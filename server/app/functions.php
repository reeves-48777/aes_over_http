<?php
if (!function_exists('getallheaders')) {
    function getallheaders() {
    $headers = [];
    foreach ($_SERVER as $name => $value) {
        if (substr($name, 0, 5) == 'HTTP_') {
            $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
    }
    return $headers;
    }
}

if (!function_exists('encode')) {
    function encode($data) {
        return json_encode($data, JSON_PRETTY_PRINT);
    }
}

// print("Le fichier functions.php a été inclus avec succès\n");
?>