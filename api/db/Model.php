<?php

namespace db;

use db\DbController;

abstract class Model{

  static function tableName(){
    $cn = get_called_class();
    $path = explode('\\',$cn);
    $tn = end($path);
    return $tn;
  }
    
  function refValues($arr){
    $refs = array();
    foreach($arr as $key => $value)
        $refs[$key] = &$arr[$key];
    return $refs;
  }

  function create(){
    $params = get_object_vars($this);
    $p = array();
    $v = array();
    $types = "";
    foreach ($params as $key => $value) {
      $type = gettype($this->$key);
      if($type == "integer"){
        $types  .= "i";
        array_push($p,"`$key`");
        array_push($v,$value);
      } else if ($type == "string") {
        $types .= "s";
        array_push($p,"`$key`");
        array_push($v,$value);
      } else if ($type == "double") {
        $types .= "d";
        array_push($p,"`$key`");
        array_push($v,$value);
      } 
    }
    array_unshift ($v,$types);
    $sql = "INSERT INTO " 
        . self::tableName()
        . " ("
        . implode(",",$p)
        . ") VALUES ("
        . implode(",", array_fill(0,sizeof($p),"?"))
        . ")" ;
    $stm = DbController::prepare($sql);
    call_user_func_array(array($stm,"bind_param"),$this->refValues($v));
    $id = DbController::execute($stm);
    $this->id = $id;
  }

  function update(){
    $params = get_object_vars($this);
    $p = array();
    $v = array();
    $types = "";
    foreach ($params as $key => $value) {
      $type = gettype($this->$key);
      if($key == "id"){
      } else if($type == "integer"){
        $types  .= "i";
        array_push($p,"`$key` = ? ");
        array_push($v,$value);
      } else if ($type == "string") {
        $types .= "s";
        array_push($p,"`$key` = ? ");
        array_push($v,$value);
      } else if ($type == "double") {
        $types .= "d";
        array_push($p,"`$key` = ? ");
        array_push($v,$value);
      } 
    }
    $types .= "i";
    array_push($v,$this->id);
    array_unshift ($v,$types);
    $sql = "UPDATE " 
        . self::tableName()
        . " SET "
        . implode(",",$p)
        . "WHERE id = ?";
    $stm = DbController::prepare($sql);
    call_user_func_array(array($stm,"bind_param"),$this->refValues($v));
    $id = DbController::execute($stm);
  }
    
  function delete(){
    $sql = "DELETE FROM " 
        . self::tableName()
        . " WHERE id = ?";
    $stm = DbController::prepare($sql);
    $params = array("s",$this->id);
    call_user_func_array(array($stm,"bind_param"),$this->refValues($params));
    DbController::execute($stm);
  }

  static function transformToEntity($result){
    $selfClass = get_called_class();
    $entiy = new $selfClass();
    foreach ($result as $key => $value) {
      $entiy->$key = $value;
    }
    return $entiy;
  }

  static function byId($id){
    $result =
      DbController::getOneResult(
        "Select * from "
        . self::tableName()
        ." WHERE id = "
        . $id  );
    return self::transformToEntity($result);
  }

  static function all(){
    $result =
      DbController::getList(
        "Select * from "
        . self::tableName());
    return $result;
  }
    
  static function where($where){
    $result =
      DbController::getList(
        "Select * from "
        . self::tableName()
        . " WHERE "
        . $where);
    return $result;
  }
    
 static function first($where){
    $result =
      DbController::getOneResult(
        "Select * from "
        . self::tableName()
        . " WHERE "
        . $where);
    return self::transformToEntity($result);
  }
    
}
