<?php
namespace db;

use mysqli;

// Clase que sirve para el mejor control de la la base de datos
class DbController{
  static private  $mysqli;

  /* termina todo y muestra un error */
  static function  endByError($msg){
    header("HTTP/1.1 500 Internal Server Error");
    echo $msg;
    self::closeConection();
    exit;
  }

  /* chequea el un estado y en base a eso devuelve un error */
  static function chechkError($test,$errorName){
    if($test){
      if(!$errorName){
        self::endByError(
          "Error al realizar la consulta : " .
          mysqli_error(self::$mysqli)
        );
      } else {
        self::endByError(
          $errorName .
          " : " .
          mysqli_error(self::$mysqli)
        );
      }

    }
  }

  /* Se conecta con la base de datos */
  static function  connect (){
    $dbprops = json_decode(file_get_contents("../database.json"));
    self::$mysqli = new mysqli(
        $dbprops->host,
        $dbprops->user,
        $dbprops->pass,
        $dbprops->database);
    self::chechkError(self::$mysqli->connect_errno,"Error al conectar con la BD");
  }

  /* ejecuta una query y devuelve el resulset */
  static function executeQuery($query){
    if(!self::$mysqli){ /*si no hay conexión*/
      self::connect();
    }
    self::chechkError(!$resultado = self::$mysqli->query($query),
      "Error al ejecutar la query [" . $query . "]");
    return $resultado;
  }

  /* devuelve una lista de array asociativos con respecto a una consulta */
  static function  getList($query){
    $result = self::executeQuery($query);
    $list = array();
    if($result->num_rows == 0){
      return array();
    }
    while ($row = $result->fetch_assoc()){
      $list[] = $row;
    }
    return $list;

  }

  /* ejecuta una query que espera una sola respuesta */
  static function getOneResult($query){
    $result = self::executeQuery($query);
    if($result->num_rows == 0){
      self::endByError("No se encontraron resultados");
    } else if ($result->num_rows > 1){
      self::endByError("Hay mas de un resultado");
    }
    return $result->fetch_assoc();
  }

  /*ciera la coneción*/
  static function  closeConection(){
    if(self::$mysqli){
      self::$mysqli->close();
    }
  }

  /* prepara una consulta precompilada */
  static function  prepare($query){
    if(!self::$mysqli){ /*si no hay conexión*/
      self::connect();
    }
    self::chechkError(!$stm = self::$mysqli->prepare($query)
      ,"Error al realizar la consulta $query");
    return $stm;
  }

  /* ejecuta una consulta precompilada */
  static function  execute($stm){
    self::chechkError(!$stm->execute(),
      "Error al agregar los parametros a la consulta");
    $id = $stm->insert_id;
    $stm->close();
    return $id;
  }

}
