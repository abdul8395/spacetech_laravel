<?php

$ch = curl_init ();
$timeout = 0; // 100; // set to zero for no timeout
$indicator=$_REQUEST['indicatorId'];
$geography=$_REQUEST['geography'];

$url="http://172.20.82.51/api/GeoPortal/LoadYears?indicatorId=".$indicator.'&geography='.$geography;

//echo $url;
$myHITurl = $url;
curl_setopt ( $ch, CURLOPT_URL, $myHITurl );
curl_setopt ( $ch, CURLOPT_HEADER, 0 );
curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
$file_contents = curl_exec ( $ch );
if (curl_errno ( $ch )) {
    echo curl_error ( $ch );
    curl_close ( $ch );
    exit ();
}
curl_close ( $ch );

//echo $file_contents;
$output = array();
//foreach (json_decode($file_contents) as $content){
    $output[]=json_decode($file_contents);
//}


// dump output of api if you want during test
echo json_encode($output);


?>