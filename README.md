# SimpleRestApi

Simple Rest Api es una Api de PHP para ayudar al desarrollo de una aplicación PHP orientada a objetos, modular y con acceso a base de datos. 

## Requerimientos

* XAMMP

## Pasos de instalación

Bajarse el proyecto y descomprimirlo dentro de `httdocs` de un XAMMP

## Configuración

Para configurar la base de datos modificar el archivo `api/database.json` con los accesos de conexión a una base de datos MySql

## Arquitectura

La **SimpleRestApi** cuenta con una arquitectura simple de carpetas

- **`api/`** Contiene la aplicación. *Es privada para el cliente.*
  - **`controller/`** Contiene los controladores de la aplicación.
  - **`core/RestApi.php`** Clase principal de funcionamiento de la API. *Modificar con precaución.*
  - **`db/`** Clases de ayuda para Base de Datos.
    - **`DbController.php`** Contiene métodos estáticos para facilitar la consultas a la base de datos.
    - **`Model.php`** Clase abstracta de la cuales deberían extender los modelos.
  - **`model/`** Carpeta donde se definen los modelos.
  - **`routes/`** Carpeta donde se definen las rutas.
  - **`database.json`** Archivo de configuración con la base de Datos.
- **`js/RestApi.js`** Métodos útiles para realizar llamadas REST a la api desde el cliente.
- **`.htaccess`** Configuración de redirección de rutas.

## Carga automática de clases

Para que la carga automática de clases funcione correctamente se deben seguir los siguientes recaudos.

* Una clase por archivo `.php`
* El nombre de la clase tiene que ser el **mismo** que el nombre del archivo *(sin la exención)*
* El nombre del namespace de la clase tiene que se igual a la ruta de carpetas dentro de la `api/`

#### Por ejemplo
En el archivo `api/model/Product.php` debe contener:

```php
<?php

namespace model;

public class Product{

/*...*/
```

Y dentro de `api/controller/ProductController.php`

```php
<?php

namespace controller;

use model\Product;

public class ProductController{

  public function create($data){
     $prod = new Product();
     /*...*/
```

## Creación de servicios

Para definir servicios REST se deber crear un archivo php de rutas dentro de la carpeta `api/routes` por ejemplo `api/routes/product.php`.

> Los archivos de rutas son de los pocos que no se definen como clases por que se concideran de configuración.

Por el funcionamiento interno de la **SimpleRestApi** toda las rutas de los servicios REST deben empezar con `/api/`...

El archivo de rutas es el encargado de *mapear* una convinación de **URL** y **Metodo de HTTP** con una acción determinada. 
La acción deberá retornar un Objeto que será transformado automáticamente a JSON.

> Es sumamente recomendable que las acciónes dentro de las rutas tengan una lógica basica y que luego llamen a un controlador.

Los métodos HTTP disponibles son:

* **`$RestApi->get(_URL_,_Acción_);`**
* **`$RestApi->post(_URL_,_Acción_);`**
* **`$RestApi->put(_URL_,_Acción_);`**
* **`$RestApi->delete(_URL_,_Acción_);`**

#### Ejemplos

##### Ejemplo 1 : Hola mundo

```php
$RestApi->get('/api/sayHi',function (){
   return "Hola mundo";
});
```

Haciendo un *GET* a `/api/sayHi` retorna:

```json
{"msg":"Hola mundo"}
```

##### Ejemplo 2 : Usar parámetros de la URL

```php
$RestApi->get('/api/testParams',function ($params){
   $param1 = $params->getParam('param1');
   $param2 = $params->getParam('param2',"noParam2");
   return array("p1" => $param1 , "p2" => $param2);
});
```

Haciendo un *GET* a `/api/testParams?param1=test&otherParam=noUse` retorna:

```json
{"p1":"test","p2":"noParam2"}
```

##### Ejemplo 3 : Variables en la URL

Los signos de pregtunta (`?`) en la URL definen variables que se van a recibir desde la función

```php
$RestApi->get('/api/product/?/comment/?',function ($prodId,$commentId){
   return array("p1" => $prodId , "p2" => $commentId);
});
```

Haciendo un *GET* a `/api/product/33/comment/45` retorna:

```json
{"p1":"33","p2":"45"}
```

##### Ejemplo 4 : Manejo del body

```php

use controller\ProductController;

$RestApi->put('/api/product/?',function ($id,$data){
   $prod = ProductController::byId($id);
   $prod->name = $data->name;
   /*... guardar cambios en la base de datos ...*/
   return $prod;
});

```

Haciendo un *PUT* a `/api/product/33` enviando `{"name":"My New Product Name"}`:

```json
{"id":"33","name":"My New Product Name"}
```

## Manejo de Base de Datos

### DbController

La clase `db\DbController` tiene funcioanlidades estàticas que ayudan al manejo de conexiónes, consultas y ejecciones con la base de datos. 
Para utilizar el DbController solamente es necesario incluirlo automáticamente dentro de un controlador usando 

```php
use db\DbController;
```

#### getList

En base a una Query Sql devuelve una array de objetos con las respuestas.

```php
$result = DbController::getList("Select * from Product");

/*
[
 ["id"=>"1","name"=>"Prod1"],
 ["id"=>"2","name"=>"Prod2"],
]
*/
```
#### getOneResult

Devuelve un solo resultado

```php
$name = "Prod2";
$result = DbController::getOneResult("Select * from Product where name = $name");

/*
["id"=>"2","name"=>"Prod2"]
*/
```

#### prepare/execute

Se utiliza para realizar operaciónes que no sean de consulta y que reciban parámentros del usuario que tienen que ser tratados con cuidado. *Como por ejemplo, INSERT, UPDATE o DELETE.*



```php
$name = "Prod2";
$stm = DbController::prepare("DELETE from Product where name = ?");
$stm->bind_param("s",$name);
DbController::execute($stm);
```

### Model

La clase `db\Model` le da funcionalidades de ORM a una clase de modelo. Para activar estas funcionalidades la clase que se desea *mapear* con la base de datos tiene que tener el **mismo** nombre que la tabla de la base de datos configurada.

#### Ejemplo de clase manejada por el ORM

`api/model/Product.php`
```php
<?php

namespace model;

use db\Model;

class Product extends Model{
      
}
```
### Funcionalidades

#### all
Devuelve **todas** las instancias de esa clase que se encuentren en la base de datos.

> Hace un "SELECT * FROM _Nombre_de_la_clase_"

```php
$result = Product::all();

/*
[
 ["id"=>"1","name"=>"Prod1"],
 ["id"=>"2","name"=>"Prod2"],
]
*/
```
#### where
Filtra la consulta.

> Hace un "SELECT * FROM _Nombre_de_la_clase_ WHERE _Parametro_"

```php
$name = "Prod2";
$result = Product::where("name = $name");

/*
[
 ["id"=>"2","name"=>"Prod2"],
]
*/
```

#### byId
Trae un elemento por ID

> Hace un "SELECT * FROM _Nombre_de_la_clase_ WHERE id = _Id_"

```php
$result = Product::byId(2);

/*
Product("id"=>"2","name"=>"Prod2")
*/
```

#### create
Crea la entidad dentro de la base de datos y le agrega el ID autogenerado

```php
$prod = new Product();
$prod->name = "Prod3";
$prod->create();

/*
Product("id"=>"3","name"=>"Prod3")
*/
```

#### update
Actualiza la entidad

```php
$prod = Product::byId(3);
$prod->name = "Prod-3";
$prod->update();

/*
Product("id"=>"3","name"=>"Prod-3")
*/
```

