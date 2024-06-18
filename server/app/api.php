<?php
include('./api-security.php');

function handle_params($post) {
    $result = $post;
    $result->message = "Encryption works fine heeeeere";
    $result->data->hello = "Goodbye World";
    $result->data->foo = "baz";

    return $result;
}

function handleApi($method) {
    $valid_key = '123456789';
    $security = new ApiSecurity($valid_key);
    $response = array();
    switch($method) {
        case "GET":
            $response["message"] = "Requete GET effectuee avec succes";
            break;
        case "POST":
            $params = file_get_contents('php://input');
            if (!empty($params)) {
                $response["raw"] = $params;
                $post = json_decode($security->decrypt($params));
                
                $result = handle_params($post);

                $response["encoded"] = json_encode($security->encrypt(json_encode($result)));
            } else {
                $response["message"] = "Aucun parametre passé dans la requete";
            }
            break;
        default:
            http_response_code(404);
            $repsonse["message"] = "Methode non prise en charge : " . $method . "\n";
            break;
    }
    return encode($response);
}

// print("Le fichier api.php a été inclus avec succès\n")
?>