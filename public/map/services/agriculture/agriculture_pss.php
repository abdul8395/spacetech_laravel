<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class agriculture extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $lat = $_REQUEST['lat'];
        $lon = $_REQUEST['lon'];
        $output = array();


        $sql1 = "with foo as (select ST_Transform(ST_SetSRID( ST_Point( $lon, $lat), 4326),32643)as geom)
        select * from agri_punjab.tbl_fishnet a,foo 
        where st_intersects(a.geom,foo.geom) ";

        $result_query1 = pg_query($sql1);
        if ($result_query1) {
//            $output['dimentions'] = pg_fetch_all($result_query1);
            $output['dimensions'] = pg_fetch_all($result_query1);
        }



        $sql2="select district_name,tehsil_name from tbl_tehsil where st_intersects(geom,st_setsrid(ST_Point( $lon, $lat),4326)) limit 1";
        $result_query2 = pg_query($sql2);
        if ($result_query2) {
            $output['dist_teh'] = pg_fetch_all($result_query2);
        }

//        $output['dist_teh'] = array('district_name'=>'district','tehsil_name'=>'tehsil');

        $sql3="select * from agri_punjab.tbl_agri_sub_category";
        $result_query3 = pg_query($sql3);
        if ($result_query3) {
            $output['services'] = pg_fetch_all($result_query3);
        }
        $this->closeConnection();
        return json_encode($output);
    }


}

$json = new agriculture();
//$json->closeConnection();
echo $json->loadData();


?>
