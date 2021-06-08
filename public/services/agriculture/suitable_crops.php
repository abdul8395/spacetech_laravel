<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class suitable_crops extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $lat = $_REQUEST['lat'];
        $lon = $_REQUEST['lon'];
//        $output = array();


        $sql1 = "with foo as (select ST_Transform(ST_SetSRID( ST_Point( $lon, $lat), 4326),32643)as geom)
        select wheat, rice, cotton,
maize, sunflower, gram, soybean, groundnut, sesame, sorghum, millet, lentil, canola, linseed,
rapeseed_mustard, barley, alfaalfa, sugarcane, sugarbeet, quinoa, moringa, mottgrass, citrus,
mango, guava, strawberry, garlic, spinach, cabbage, peas, carrot, turnip, radish, turmeric, 
cauliflower, potato, tomato, onion, capsicum, pumpkin, squashes, gourds, okra, ginger,
sudangrass from agri_punjab.suitable_crops a,foo 
        where st_intersects(a.geom,foo.geom) ";

        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output = pg_fetch_all($result_query1);
        }



        $this->closeConnection();
        return json_encode($output);
    }


}

$json = new suitable_crops();
//$json->closeConnection();
echo $json->loadData();


?>
