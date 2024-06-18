<?php
header("Access-Control-Allow-Headers : Content-Type, X-API-Key, Accept, Origin");
header("Access-Control-Allow-Origin : *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS, HEAD, PATCH");

include('api.php');
include('functions.php');

$valid_key = "123456789";
$response = array();

$headers = getallheaders();
if (isset($headers['X-API-KEY'])) {
    $api_key = $headers['X-API-KEY'];

    if ($api_key === $valid_key) {
        $response['message'] = "API key is valid";
        $request_method = $_SERVER['REQUEST_METHOD'];
        $response = handleApi($request_method);

    } else {
        http_response_code(401);
        $response = encode(["message" => "API key is invalid"]);
    }
} else {
    http_response_code(400);
    $response = encode(["message" => "No API key provided"]);
}

echo $response;
// phpinfo();
?>