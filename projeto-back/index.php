<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$ipContainer = shell_exec('hostname -I');

header('Content-Type: application/json');
echo json_encode([
  'ip'     => str_replace([" ", "\n", "\t"], '', $ipContainer),
  'versao' => 'v1.0'
]);