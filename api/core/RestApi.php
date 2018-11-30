<?php
// Inicia la sesión en caso de que se desee guardar algo en ella
session_start();

define('BASE_PATH', realpath(dirname(__FILE__) . '/..'));

spl_autoload_register(function ($class){
  $filename = BASE_PATH . '/' . str_replace('\\', '/', $class) . '.php';
  if(file_exists($filename)){
    include($filename);
  }
});

use db\DbController;

//La clase Params se utiliza para el mejor manejo de los parametros de URL
class Params{
  public function __construct($map = null)
  {
    $this->map = $map;
  }

  //Devuelve el valor de un parametro de URL por clave y con un valor
  // por defecto
  public function getParam($name,$default = null){
    if($this->map != null && isset($this->map[$name])){
      return $this->map[$name];
    } else {
      return $default;
    }
  }
}

// Esta clase se utiliza en caso de que se tenga que devolver un mensaje
class RestApiMensageResponse{
  public $msg;
  public function __construct($msg){
    $this->msg = $msg;
  }
}

// Clase de ayuda a manejo de llamada a servicios rest
class RestApi{

  //Guarda el path actual como array de string
  private $path;

  //Guara los parametros de la URL como array asociativo
  private $params;

  //Guarda el tipo de metodo actual ( GET, POST, PUT, ...)
  private $method;

  // Variable que indica si ya se ejecutó
  private $end = false;


  //Al construirse se cargan todas las variables con los datos actuales.
  public function __construct()
  {
    $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $parts = parse_url($url);
    if(isset($parts['query']))
    {
        parse_str($parts['query'], $query);
        $this->params = $query;
    }
    $uri = $parts['path'];
    $this->path = explode("/",$uri);
    $this->method = $_SERVER['REQUEST_METHOD'];
  }

  //Funcion que analiza el path y metodo esperado y en caso de serlo
  //  invoca un callback con los datos esperados
  public function process($fMethod,$fPath,$action){
    // Verifica que no haya terminado y que el metodo sea el esperado
    if($this->end || $this->method != $fMethod){
      return;
    }

    //Separa el path actual en partes y las copara
    $fPathArr = explode("/",$fPath);
    if(sizeOf($fPathArr) != sizeOf($this->path)){
      return;
    }
    $actionArgs = array();
    for ($i=0; $i < sizeOf($fPathArr) ; $i++) {
      //En caso de que el path buscado tenga un ? guarda ese dato
      if($fPathArr[$i]  == '?'){
        array_push($actionArgs,$this->path[$i]);
      } else if($fPathArr[$i] != $this->path[$i] ){
        return;
      }
    }
    //Crea el objeto Params
    $params = new Params($this->params);
    //Crea el body como json
    $body = json_decode(file_get_contents('php://input'));

    //Dependiendo del tipo de metodo el orden de los parametros del callback
    if($fMethod == "GET"){
      array_push($actionArgs,$params);
      array_push($actionArgs,$body);
    } else {
      array_push($actionArgs,$body);
      array_push($actionArgs,$params);
    }
    //Frena cualquier busqueda futura de paths
    $this->end = true;
    //invoca a la callback con los parametros
    $ret = call_user_func_array($action,$actionArgs);

    //procesa el resultado del callback para generar una respuesta
    if(is_object($ret) || is_array($ret)){
      echo json_encode($ret);
    } else {
      echo json_encode(new RestApiMensageResponse($ret));
    }
  }

  //Se crea una funcion por cada tipo de metodo HTML invocando a la funcion process

  public function get($fPath,$action){
    $this->process("GET",$fPath,$action);
  }

  public function post($fPath,$action){
    $this->process("POST",$fPath,$action);
  }

  public function put($fPath,$action){
    $this->process("PUT",$fPath,$action);
  }

  public function delete($fPath,$action){
    $this->process("DELETE",$fPath,$action);
  }

  public function isDone(){
    return $this->end;
  }

}

//Se crea una copia local de la RestApi
$RestApi = new RestApi();

//Busca todas los archivos de ruta y los agrega al request actual
$__routes = scandir("../routes");
foreach ($__routes as $key => $file) {
  if(substr($file, -4) === ".php"){
    require "../routes/".$file;
  }
}

DbController::closeConection();

// En caso de que haya pasado por todas las rutas y no haya encontrado nada
//   devuelve un error 404
if(!$RestApi->isDone()){
  header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
}
?>
