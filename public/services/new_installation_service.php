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
        $table=$_REQUEST['table'];

        $sql="with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
		select a.*, round((st_distance(st_transform(a.geom,32643),foo.geom)/1000)::numeric,2) as distance  from $table a,foo
		ORDER BY foo.geom <-> st_transform(a.geom,32643) limit 1";

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