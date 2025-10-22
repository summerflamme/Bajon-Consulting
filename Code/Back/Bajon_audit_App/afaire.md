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