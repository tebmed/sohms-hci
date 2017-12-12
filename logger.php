<?php

$message = $_POST['data']['message'];
$filename = $_POST['data']['filename'];

echo file_put_contents('logs/'.$filename,$message.PHP_EOL,FILE_APPEND) ? 'ok' : 'nok';