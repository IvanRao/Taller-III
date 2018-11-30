<?php

namespace controller;

use model\Juegos;
use model\Consolas;
use db\DbController;
use controller\FileController;

class JuegosController{

    private static function fillData($prod){
        $prod = (object) $prod;
        $prod->consolas_id = Consolas::byId($prod->consolas_id);
        return $prod;
    }

    public static function all(){   
        return array_map("self::fillData",Juegos::all());
    }


    public static function byId($id){   
        return self::fillData(Juegos::byId($id));
    }

    public static function delete($id){   
        $prod =  Juegos::byId($id);
        $prod->delete();
        return "Ok";
    }

    public static function create($nombre,$precio,$consolas_id,$imagen){  
        $p = new Juegos();
        $p->nombre = $nombre;
        $p->precio = $precio;
        $p->consolas_id = $consolas_id;
        $p->create();
        FileController::write($imagen,$p->id);
        return "OK";
    }

    public static function update($id,$nombre,$precio,$consolas_id,$imagen){  
        $p = Juegos::byId($id);
        $p->nombre = $nombre;
        $p->precio = $precio;
        $p->consolas_id = $consolas_id;
        $p->update();
        if ($imagen != null){
            FileController::write($imagen,$p->id); 
        }else{};
        return "OK";
    }


}
