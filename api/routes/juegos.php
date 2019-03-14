<?php

use controller\JuegosController as JgCnt;
use controller\AuthController;
use controller\FileController;

$RestApi->get("/api/juegos/?",function($id){
    AuthController::validateAdmin();
    return JgCnt::byId($id);
});

$RestApi->post("/api/juegos",function($data){
    AuthController::validateAdmin();
    return JgCnt::create($data->nombre,$data->precio,$data->consolas_id, $data->imagen);
});

$RestApi->put("/api/juegos",function($data){
    AuthController::validateAdmin();
    return JgCnt::update($data->id,$data->nombre,$data->precio,$data->consolas_id, $data->imagen);
});

$RestApi->get("/api/juegos",function(){
    //AuthController::validateAdmin();
    return JgCnt::all();
});

$RestApi->delete("/api/juegos/?",function($id){
    AuthController::validateAdmin();
    return JgCnt::delete($id);
});
