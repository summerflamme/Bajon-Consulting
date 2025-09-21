#!/usr/bin/env bash
set -euo pipefail

WORKSPACE=/workspace
HOST_GIT="$WORKSPACE/.git"

log() { echo "[init-git] $*"; }

# If a .git already exists at workspace, nothing to do
if [ -d "$HOST_GIT" ] || [ -f "$HOST_GIT" ]; then
  log ".git already present at $HOST_GIT. Nothing to initialize."
  exit 0
fi

if ! command -v git >/dev/null 2>&1; then
  log "git not installed in container. Skipping initialization."
  exit 0
fi

log "No .git found at $HOST_GIT - initializing git repository at $WORKSPACE"
cd "$WORKSPACE"
git init -q || { log "git init failed"; exit 1; }

# If there's a host config file one level up (../.git/config), copy user.name/email
if [ -f "$WORKSPACE/../.git/config" ]; then
  HOST_NAME=$(git --git-dir="$WORKSPACE/../.git" config --get user.name || true)
  HOST_EMAIL=$(git --git-dir="$WORKSPACE/../.git" config --get user.email || true)
  if [ -n "$HOST_NAME" ]; then
    git config --global user.name "$HOST_NAME"
    log "Set container git user.name=$HOST_NAME"
  fi
  if [ -n "$HOST_EMAIL" ]; then
    git config --global user.email "$HOST_EMAIL"
    log "Set container git user.email=$HOST_EMAIL"
  fi
fi

# Allow env override (useful when running in CI or explicit settings)
if [ -n "${GIT_USER:-}" ]; then
  git config --global user.name "$GIT_USER"
  log "Override: set git user.name=$GIT_USER from GIT_USER"
fi
if [ -n "${GIT_EMAIL:-}" ]; then
  git config --global user.email "$GIT_EMAIL"
  log "Override: set git user.email=$GIT_EMAIL from GIT_EMAIL"
fi

log "Git initialized at $WORKSPACE"
