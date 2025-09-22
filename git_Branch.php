<?php
// script: create_branch.php
// Usage: php create_branch.php

echo "=== Création d'une branche Git ===\n";

// Demande du nom de branche
echo "Entrez le nom de la fonctionnalité (ex: login, dashboard, api): ";
$feature = trim(fgets(STDIN));

echo "Front ou Back ? (front/back): ";
$side = strtolower(trim(fgets(STDIN)));

echo "Entrez votre identifiant Git (ex: jdupont): ";
$user = trim(fgets(STDIN));

// Vérification du format
if (empty($feature) || !in_array($side, ['front', 'back']) || empty($user)) {
    echo "❌ Erreur : format invalide.\n";
    echo "Format attendu : nom_de_fonctionnalité_front|back_nomdugitdelapersonne\n";
    exit(1);
}

// Construction du nom de branche
$branchName = $feature . "_" . $side . "_" . $user;

// Vérification si la branche existe déjà
$check = shell_exec("git branch --list " . escapeshellarg($branchName));
if (!empty(trim($check))) {
    echo "❌ La branche '$branchName' existe déjà.\n";
    exit(1);
}

// Création et switch sur la branche
echo "✅ Création de la branche : $branchName\n";
shell_exec("git checkout -b " . escapeshellarg($branchName));
echo "✨ Vous êtes maintenant sur la branche '$branchName'.\n";
