<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("connection.php");


class Pss extends connection
{


    function __construct()
    {
        $this->connectionDB();
		
		$result = $this->get_data();
		echo json_encode($result);
		
		
		
    }

    public function get_data()
    {
        $geom=$_REQUEST['geom'];

        $sql="with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom)
        ,bar as (
        select district,tehsil,mauza from tbl_mauza,foo where  st_intersects(tbl_mauza.geom,foo.geom) limit 1
        )
        select  district,tehsil,mauza ,st_intersects(a.geom,foo.geom) from water.tbl_wwtp a, foo,bar ";

//       echo $sql;
//        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }
		 $this->closeConnection();
        return json_encode($output);
    }
	   
}

$json = new Pss();
//$json->closeConnection();
// echo $json->loadData();


?>