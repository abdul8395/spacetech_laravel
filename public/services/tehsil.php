<?php
include("connection.php");

class Tehsil extends connection {
    function __construct()
    {
        $this->connectionDB();

    }

    public function getTehsilExtent() {

        $lng = $_REQUEST['lng'];
        $lat = $_REQUEST['lat'];
            $sql = "SELECT district_name,tehsil_name,st_xmin(geom)||','||st_ymin(geom)||','||st_xmax(geom)||','||st_ymax(geom) as extent
                  from tbl_tehsil where ST_Intersects(ST_SetSRID(ST_MakePoint($lng,$lat),4326), st_transform(geom,4326))";

        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }

        return json_encode($output);

        $this->closeConnection();
    }
}

$json = new Tehsil();
//$json->closeConnection();
echo $json->getTehsilExtent();