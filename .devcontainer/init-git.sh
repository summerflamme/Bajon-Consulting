#!/bin/sh
set -eu

WORKSPACE=/workspace
HOST_GIT="$WORKSPACE/.git"

log() {
  echo "[init-git] $*"
}

# Vérifie si .git existe déjà
if [ -d "$HOST_GIT" ] || [ -f "$HOST_GIT" ]; then
  log ".git already present at $HOST_GIT. Nothing to initialize."
else
  # Vérifie si git est installé
  if ! command -v git >/dev/null 2>&1; then
    log "git not installed in container. Skipping initialization."
    exit 0
  fi

  log "No .git found at $HOST_GIT - initializing git repository at $WORKSPACE"
  cd "$WORKSPACE" || exit 1
  git init -q || { log "git init failed"; exit 1; }

  # Copie config du host
  if [ -f "$WORKSPACE/../.git/config" ]; then
    HOST_NAME=$(git --git-dir="$WORKSPACE/../.git" config --get user.name 2>/dev/null || true)
    HOST_EMAIL=$(git --git-dir="$WORKSPACE/../.git" config --get user.email 2>/dev/null || true)

    if [ -n "$HOST_NAME" ]; then
      git config --global user.name "$HOST_NAME"
      log "Set container git user.name=$HOST_NAME"
    fi

    if [ -n "$HOST_EMAIL" ]; then
      git config --global user.email "$HOST_EMAIL"
      log "Set container git user.email=$HOST_EMAIL"
    fi
  fi

  # Override avec variables d'environnement
  if [ "${GIT_USER:-}" ]; then
    git config --global user.name "$GIT_USER"
    log "Override: set git user.name=$GIT_USER from GIT_USER"
  fi

  if [ "${GIT_EMAIL:-}" ]; then
    git config --global user.email "$GIT_EMAIL"
    log "Override: set git user.email=$GIT_EMAIL from GIT_EMAIL"
  fi
fi

# ===============================
# Installation des dépendances npm
# ===============================

FRONT_DIR="$WORKSPACE/Code/Front/Bajon_Consulting_Audit_App"

if [ -d "$FRONT_DIR" ]; then
  log "Installing npm dependencies in $FRONT_DIR..."
  cd "$FRONT_DIR"
  npm install || { log "npm install failed in $FRONT_DIR"; exit 1; }
  log "✅ npm dependencies installed successfully in $FRONT_DIR."
else
  log "❌ Front directory not found at $FRONT_DIR, skipping npm install."
fi

log "Git + npm setup complete at $WORKSPACE"
