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



        $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom
)select  sum((st_Area(st_transform(st_intersection(a.geom,foo.geom),32643))/st_area(st_transform(a.geom,32643)))*grid_code) as population FROM tbl_grid_with_populatiotin a,foo 
where st_intersects(a.geom,foo.geom)";
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