# Implementation of auth-module using Nest JS and MongoDB
# Please follow below steps for the setup

1. npm install

2. npm run build

3. npm run start

4. App will run on 8080 port like 'http://localhost:8080/'

5. User can use postman to check apis :

# To Register : 
Url : http://localhost:8080/auth/register
Payload : {
    "email": "vrushu@gmail.com",
    "name": "Vrushu",
    "password": "P@ssw0rd1234"
}

# To Login : 
Url : http://localhost:8080/auth/login
Payload : {
    "email": "vrushu@gmail.com",
    "password": "P@ssw0rd1234"
}