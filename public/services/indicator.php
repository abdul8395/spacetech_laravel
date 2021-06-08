<?php

$ch = curl_init ();
$timeout = 0; // 100; // set to zero for no timeout
$indicator=urlencode($_REQUEST['indicator']);
//echo $indicator;
$file_contents=file_get_contents("http://172.20.82.51/api/GeoPortal/GetIndicators?search=".$indicator);

//echo $url;
//$myHITurl = $url;
//curl_setopt ( $ch, CURLOPT_URL, $myHITurl );
//curl_setopt ( $ch, CURLOPT_HEADER, 0 );
//curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
//curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
//$file_contents = curl_exec ( $ch );
//if (curl_errno ( $ch )) {
//    echo curl_error ( $ch );
//    curl_close ( $ch );
//    exit ();
//}
//curl_close ( $ch );
//
////echo $file_contents;
//$output = array();
foreach (json_decode($file_contents) as $content){
    $output[]=$content->label;
}
//
//
//// dump output of api if you want during test
echo json_encode($output);


?>