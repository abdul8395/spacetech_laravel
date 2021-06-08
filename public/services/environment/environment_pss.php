<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class environment extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $geom = $_REQUEST['geom'];
        $output = array();


        $sql1 = "with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
        select * from environment.tbl_dss a,foo 
        where st_intersects(a.geom,foo.geom) ";

        $result_query1 = pg_query($sql1);
        if ($result_query1) {
//            $output['dimentions'] = pg_fetch_all($result_query1);
            $output['dimensions'] = pg_fetch_all($result_query1);
        }

//        $sql2="select district_name,tehsil_name from tbl_tehsil where st_intersects(geom,st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)) limit 1";
//
//
//        $result_query2 = pg_query($sql2);
//        if ($result_query2) {
//            $output['dist_teh'] = pg_fetch_all($result_query2);
//        }

        $sql2="select district_name,tehsil_name from tbl_tehsil where st_intersects(geom,st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)) limit 1";


        $result_query2 = pg_query($sql2);
        if ($result_query2) {
            $output['dist_teh'] = pg_fetch_all($result_query2);
        }



        $this->closeConnection();
        return json_encode($output);
    }


}

$json = new environment();
//$json->closeConnection();
echo $json->loadData();


?>
