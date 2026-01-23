# CRUD ADMIN 


## Create user 
## Update userById
## Rest UsersList  
## Deletr userById


#### J'ai déjà depuis react 

## Modifier l'user connecter 






bug du css dans le auth.css 


.login-box input,
.login-box button,
.login-box select {
width: 100%;
display: block;
padding: 10px;
border-radius: 5px;
margin-bottom: 15px;
}


voir avec Simon si on peux enlever le display:block car pour mon form de création d'un user en enlevant le display:block le drapeau se met au bon endroit






* - Cohérence role vs currentRole : state role est un tableau Role[], mais la payload createUserPost envoie `role` entier (tableau)
*   ; probablement il faut envoyer currentRole (string) ou l'id du rôle attendu par le backend.






curl http://localhost:8080/api/users/listUsers

curl -X POST http://localhost:8080/api/users/createUser \               
  -H "Content-Type: application/json" \
  -d '{
    "email": "DemoTest@curl.com",
    "password": "password",
    "lastName": "Demo",    
    "firstName": "Oral",
    "phone": "+33942345398",git 
    "currentRole": "Auditeur"
   }'

curl http://localhost:8080/api/users/d2be6ef6-16f5-4275-8f0a-e157f07b69c7

curl -X DELETE http://localhost:8080/api/users/deleteUser/


curl http://localhost:8080/api/pptx/download/{idAudit}




Gestion d'erreur : 
    Si on esseye d'accèder a l'userform mais que l'id ne correspond a aucun user redirection vers la list d'utilisateur