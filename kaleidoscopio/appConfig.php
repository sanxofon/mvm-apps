<?php

$app_name = "Kaleidoscopio";     // El nombre de la App
$app_shortname = "kaleidoscopio";                         // Nombre corto de la app
$app_author = "Santiago C. Novaro";             // Autor de la app
$app_authorTwitter = "@sanxofon";               // Usuario twitter del autor de la app 
$app_subject = "Algebra lineal, Simetrías";                   // Temas de la app (separados por coma) 
$app_version = "v0.6";                          // Versión actual
$app_year = "2023";                             // Año de publicación de la app
if(@$_GET['launcher']) $app_version = $app_version."b"; // No modificar esta línea
$app_description = "Un kaleidoscopio con la cámara de tu dispositivo"; // Descripción general de la app.
$app_server = "";                               // Servidor donde la app está alojada (DNS ó IP). Se puede usar cadena vacía "" para cualquiera.
require_once("../is_localhost.php");
// Ruta absoluta a la app desde la raíz del servidor (debe empezar y terminar en "/")
if(is_localhost())$app_path = "/museomates/mvm-apps/".$app_shortname."/";
else$app_path = "/mvm-apps/".$app_shortname."/";  
