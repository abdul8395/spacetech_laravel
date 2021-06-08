<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include("../connection.php");


class Pss extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $output = array();

//        $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom
//)select st_intersects(a.geom,foo.geom) as alligned  FROM tbl_circle_boundary a,foo
//where st_intersects(a.geom,foo.geom) limit 1";


        $sql3="SELECT type as scheme_type,categoery as category from transportation.tbl_pctyps ORDER BY type;";


        $result_query3 = pg_query($sql3);
        if ($result_query3) {
            $output = pg_fetch_all($result_query3);
        }


        $this->closeConnection();
        return json_encode($output);
    }
}

$json = new Pss();
//$json->closeConnection();
echo $json->loadData();


?>