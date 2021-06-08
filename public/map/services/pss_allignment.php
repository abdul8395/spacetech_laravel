<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("connection.php");


class Redlining extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {
        $geom = $_REQUEST['geom'];


        $sql = "with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
        select sum(community) as community,sum(connectivity) connectivity,sum(enviroment) enviroment,sum(humancapital) humancapital,
       sum(institutoin) institutoin,sum(markets) markets,sum(utilities)  utilities,sum(siteattrib) siteattrib,
	   sum(raw_matrials) raw_matrials
from prep.tbl_dss_final a,foo 
        where st_intersects(a.geom,foo.geom) ";
        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }

        $this->closeConnection();
        return json_encode($output);
    }
}

$json = new Redlining();
//$json->closeConnection();
echo $json->loadData();


?>