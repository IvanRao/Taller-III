<?php

$RestApi->post("/api/user",function ($user){
  controller\UserController::registrate($user->username,$user->pass);
  return "OK";
});
