<?php

$ipContainer = shell_exec('hostname -I');

header('Content-Type: application/json');
echo json_encode([
  'ip'     => str_replace([" ", "\n", "\t"], '', $ipContainer),
  'versao' => 'v1.0'
]);