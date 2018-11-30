<?php

use controller\FileControllerConsolas;

$RestApi->post("/api/fileConsolas",function ($data){
  return FileControllerConsolas::write($data->data,$data->name);
});


$RestApi->get("/api/fileConsolas/?",function ($name){
  FileControllerConsolas::read($name);
  return "???";
});
