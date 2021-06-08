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


        $sql = " 
with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom)
        select  case when land_use ='Residential' then 'Residential' when  land_use ='Commercial' then 'Commercial' else 'mix'  end as coalesce ,count(*) FROM tbl_parcel_boundary a,foo 
        where st_intersects(a.geom,foo.geom) group by coalesce";
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