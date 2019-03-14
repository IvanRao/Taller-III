<?php

use controller\ConsolasController as ConCnt;
use controller\AuthController;
use controller\FileControllerConsolas;

$RestApi->get("/api/consolas/?",function($id){
    AuthController::validateAdmin();
    return ConCnt::byId($id);
});

$RestApi->post("/api/consolas",function($consola){
    AuthController::validateAdmin();
    return ConCnt::create($consola->nombre,$consola->precio,$consola->imagenConsola);
});

$RestApi->put("/api/consolas",function($consola){
    AuthController::validateAdmin();
    return ConCnt::update($consola->id,$consola->nombre,$consola->precio,$consola->imagenConsola);
});

$RestApi->get("/api/consolas",function(){
    //AuthController::validateAdmin();
    return ConCnt::all();
});

$RestApi->delete("/api/consolas/?",function($id){
    AuthController::validateAdmin();
    return ConCnt::delete($id);
});
