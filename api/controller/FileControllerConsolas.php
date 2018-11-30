<?php

namespace controller;

class FileControllerConsolas{

  static $folder = "../storeConsolas/";

  public function write($b64_data, $fileName){
     $ifp = fopen( self::$folder . $fileName, 'wb' );
     $data = explode( ',', $b64_data );
     fwrite( $ifp, base64_decode( $data[ 1 ] ) );
     fclose( $ifp );
     return $data[ 0 ];
  }

  public function read($fileName){
    $file = self::$folder . $fileName;
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Content-Length: ' . filesize($file));
    header('Content-type: image/jpeg');

    readfile($file);
    die();
  }

}
