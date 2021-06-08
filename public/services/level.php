<?php

$ch = curl_init ();
$timeout = 0; // 100; // set to zero for no timeout
$indicator=urlencode($_REQUEST['indicator']);
$file_contents=file_get_contents("http://172.20.82.51/api/GeoPortal/GetIndicators?search=".$indicator);

//echo $file_contents;
//exit();

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

//echo $file_contents;
$output = array();
$file_level='';
$file_source='';
//print_r(json_decode($file_contents));
foreach (json_decode($file_contents,false) as $content){

    if(urlencode($content->label)==$indicator){

        $id=$content->id;


        $output['indicator']=$id;
        $myHITurl = "http://172.20.82.51/api/GeoPortal/LoadGeographyName?indicatorId=".$id;
        //echo $myHITurl;
        curl_setopt ( $ch, CURLOPT_URL, $myHITurl );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
        $file_level = curl_exec ( $ch );


        $myHITurl = "http://172.20.82.51/api/GeoPortal/LoadSources?indicatorId=".$id;
        //echo $myHITurl;
        curl_setopt ( $ch, CURLOPT_URL, $myHITurl );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, $timeout );
        $file_source = curl_exec ( $ch );


        if (curl_errno ( $ch )) {
            echo curl_error ( $ch );
            curl_close ( $ch );
            exit ();
        }
        curl_close ( $ch );
    }

}

//foreach (json_decode($file_level) as $content){
    $output['level']=json_decode($file_level);
//}

//foreach (json_decode($file_level) as $content){
    $output['source']=json_decode($file_source);
//}

// dump output of api if you want during test
echo json_encode($output);


?>