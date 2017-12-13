<?php

if (isset($_POST['data'])) {
    $action = $_POST['data']['action'];
    
    if ($action == 'log') {
        $message = $_POST['data']['message'];
        $filename = $_POST['data']['filename'];

        echo file_put_contents('logs/'.$filename, $message.PHP_EOL, FILE_APPEND) ? 'ok' : 'nok';
    } else if ($action == 'scenario') {
        $filename = $_POST['data']['filename'];
        $data = $_POST['data']['json'];

        echo file_put_contents('scenarios/'.$filename.'.json', json_decode($data)) ? 'ok' : 'nok';
    }
} else {
    $action = $_GET['action'];

    if ($action == 'list') {
        $array = [];
        if ($handle = opendir('./scenarios')) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry[0] !== '.')
                    $array[] = substr($entry, 0, -5);
            }
        }

        echo json_encode($array);
    }
}