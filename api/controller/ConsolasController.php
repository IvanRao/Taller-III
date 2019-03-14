<?php

namespace controller;

use model\Consolas;
use db\DbController;
use controller\FileControllerConsolas;

class ConsolasController{

    public static function all(){   
        return Consolas::all();
    }

    public static function byId($id){   
        return Consolas::byId($id);
    }

    public static function delete($id){   
        $prod =  Consolas::byId($id);
        $prod->delete();
        return "Ok";
    }

    public static function create($nombre,$precio,$imagenConsola){  
        $p = new Consolas();
        $p->nombre = $nombre;
        $p->precio = $precio;
        $p->create();
        FileControllerConsolas::write($imagenConsola,$p->id);
        return "OK";
    }

    public static function update($id,$nombre,$precio,$imagenConsola){  
        $p = Consolas::byId($id);
        $p->nombre = $nombre;
        $p->precio = $precio;
        $p->update();
        if ($imagenConsola != null) {
        FileControllerConsolas::write($imagenConsola,$p->id);
        }else{};
        return "OK";
    }


}
