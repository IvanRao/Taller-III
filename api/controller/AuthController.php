<?php

namespace controller;

use model\Usuarios;
use Exception;

class AuthController{
    
  static function validateAdmin(){
    if(isset($_SESSION['user']) && $_SESSION['user'] == 1){
      return $_SESSION['user'];
    }
    header("HTTP/1.1 401 UNAUTHORIZED");
    die();
  }

  static function validate(){
    if(isset($_SESSION['user'])){
      return $_SESSION['user'];
    }
    header("HTTP/1.1 401 UNAUTHORIZED");
    die();
  }

  static function authenticate($username,$password){
    $users = Usuarios::where("usuario = '$username' and pass = '$password'");
    if(isset($users[0])){
      $_SESSION['user'] = $users[0]['role'];
      unset($users[0]['pass']);
      return $users[0];
    } else {
        header("HTTP/1.1 401 UNAUTHORIZED");
        die();
    }
  }

  static function logout(){
      $_SESSION['user'] = NULL;
  }

}
