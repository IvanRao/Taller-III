<?php

use controller\AuthController;

$RestApi->post("/api/login",function ($credentials){
   return AuthController::authenticate($credentials->username,$credentials->password);
});

$RestApi->get("/api/valid",function (){
   AuthController::validate();
   return "Valid";
});

$RestApi->post("/api/logout",function (){
   AuthController::logout();
   return "Valid";
});
