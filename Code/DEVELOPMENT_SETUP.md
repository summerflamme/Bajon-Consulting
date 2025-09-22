# Guide d'installation et configuration de l'environnement de développement

Ce document décrit comment préparer et lancer l'environnement de développement pour le projet Bajon-Consulting (backend Java Spring Boot + frontend React/Vite). Il est rédigé en français et couvre les prérequis, le démarrage via Docker Compose en mode développement, ainsi que les erreurs courantes et leurs solutions.

## Pré-requis

- Git (>= 2.20)
- Docker (Docker Engine) et Docker Compose
  - Sur Linux, assurez-vous que l'utilisateur a accès au socket Docker (groupe `docker`) ou exécutez les commandes avec `sudo`.
- (Optionnel) Visual Studio Code avec l'extension Remote - Containers / Dev Containers
- (Optionnel) Node.js et npm si vous voulez exécuter le frontend localement hors container (Node 20+ recommandé)
- (Optionnel) Java 17 si vous voulez exécuter le backend localement hors container

## Structure du repository (utile pour se repérer)

- `Code/Back/Bajon_audit_App` : source backend Spring Boot (pom.xml, src/...)
- `Code/Front/Bajon_Consulting_Audit_App` : source frontend Vite + React
- `Code/docker-compose.dev.yml` : compose fichier pour le mode développement (montages de volumes)
- `Code/Back/Bajon_audit_App/Dockerfile.dev` : Dockerfile dev pour backend
- `Code/Front/Bajon_Consulting_Audit_App/Dockerfile.dev` : Dockerfile dev pour frontend

## Démarrage recommandé (Docker Compose - mode dev)

1. Ouvrez un terminal dans le dossier `Code` (contenant `docker-compose.dev.yml`).

2. Construire et démarrer les services (backend, frontend, db) :

```sh
docker compose -f docker-compose.dev.yml up --build
```

3. Vérifiez les logs :

```sh
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend
```

4. Accéder aux services depuis votre navigateur :

- Frontend (Vite) : http://localhost:5173
- Backend (Spring Boot) : http://localhost:8080 (selon configuration Spring Boot)

## Démarrer le frontend manuellement dans le container

Par défaut le conteneur frontend peut être démarré en mode "paresseux" (CMD qui garde le container ouvert). Pour lancer le serveur Vite :

```sh
# Ouvrir un shell dans le container frontend
docker compose -f docker-compose.dev.yml exec frontend /bin/sh
# Dans le container
npm run dev
```

Note: `package.json` contient le script `dev` qui exécute `vite --host`, ce qui force Vite à écouter sur toutes les interfaces (0.0.0.0) — nécessaire pour l'accès depuis l'hôte.

## Démarrer le backend manuellement dans le container

Si nécessaire, ouvrir un shell dans le container backend et démarrer Spring Boot :

```sh
docker compose -f docker-compose.dev.yml exec backend /bin/sh
# puis dans le container
mvn spring-boot:run
```

Le Dockerfile dev pour le backend est configuré pour éviter des problèmes courants de permissions (MAVEN_CONFIG, et redirection du répertoire `target` vers un volume administré par Docker) — voir la section dépannage.

## Résolution des erreurs courantes

1. Erreur: `./mvnw: not found` ou `Permission denied` pour /root
   - Cause: le wrapper `mvnw` est masqué ou n'est pas exécutable à l'intérieur du container (souvent dû au montage du repo en volume). Aussi Maven peut essayer d'écrire dans `/root/.m2`.
   - Solution: le Dockerfile dev a été adapté pour utiliser l'installation `mvn` incluse dans l'image et définir `MAVEN_CONFIG=/home/vscode/.m2`. Vous pouvez aussi rendre `mvnw` exécutable sur l'hôte (chmod +x) ou ne pas monter le dossier au moment du build.

2. Erreur: `FileSystemException: ... target/classes ... Operation not permitted`
   - Cause: Maven essaie d'écrire dans `target` qui est sur le volume monté et les permissions ne permettent pas l'écriture depuis le container.
   - Solution: nous utilisons un volume Docker nommé (`backend_target`) monté sur le chemin `.../target` pour que Docker gère cet emplacement et que le container puisse y écrire. Alternativement, la variable `-Dproject.build.directory` a été utilisée pour rediriger les outputs vers `/home/vscode/target` dans le container.

3. Le frontend n'est pas accessible dans le navigateur
   - Cause: le container frontend n'exécute pas `npm run dev` automatiquement (le Dockerfile.dev peut avoir `CMD ["tail", "-f", "/dev/null"]`).
   - Solution: lancer `npm run dev` manuellement dans le container ou modifier Dockerfile/devcompose pour démarrer automatiquement.

## Conseils pour le développement quotidien

- Développement React (hot reload)
  - Lancer le frontend via Docker Compose en mode dev (ou localement avec Node). Vite utilise le montage de fichiers pour le rechargement à chaud.

- Éviter de monter le dépôt entier si possible
  - Monter seulement les sous-dossiers `Code/Back/Bajon_audit_App` et `Code/Front/Bajon_Consulting_Audit_App` est plus prévisible. Exemple dans `docker-compose.dev.yml`:
    ```yaml
    volumes:
      - ../Code/Back/Bajon_audit_App:/workspace/Code/Back/Bajon_audit_App:cached
      - ../Code/Front/Bajon_Consulting_Audit_App:/workspace/Code/Front/Bajon_Consulting_Audit_App:cached
    ```

- Si vous avez des problèmes de permissions fréquents
  - Assurez-vous que votre UID/GID hôte est compatible ou utilisez des volumes Docker (nommés) pour dossiers qui doivent être écrits par le container.

## Commandes utiles

```sh
# Build + up dev
docker compose -f docker-compose.dev.yml up --build

# Stop
docker compose -f docker-compose.dev.yml down

# Voir les logs (backend/frontend)
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f frontend

# Ouvrir un shell dans le container frontend
docker compose -f docker-compose.dev.yml exec frontend /bin/sh

# Ouvrir un shell dans le container backend
docker compose -f docker-compose.dev.yml exec backend /bin/sh
```

## Si vous bloquez

- Copiez-collez ici les 50–150 premières lignes de logs renvoyées par :

```sh
docker compose -f docker-compose.dev.yml up --build
```

et j'analyserai et corrigerai les points restants.

---

Si vous voulez, je peux :
- Modifier `docker-compose.dev.yml` pour monter seulement les sous-dossiers (réduction des risques),
- Ou modifier le Dockerfile frontend pour démarrer automatiquement `npm run dev` (pratique pour dev),
- Ajouter un petit script `dev-entrypoint.sh` pour choisir automatiquement entre `./mvnw` et `mvn`.

Dites-moi quelle option vous préférez et je l'implémente (patch + test).