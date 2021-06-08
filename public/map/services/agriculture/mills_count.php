<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class mills_count extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $tehsil = $_REQUEST['tehsil'];
//        $output = array();


        $sql1 = "with foo  as (select tehsil_name,st_transform(geom,32643) as geom from tbl_tehsil where tehsil_name = '".$tehsil."'),
floor_mills as (select count(*) as floor_mills from agri_punjab.tbl_flour_mills,foo where st_intersects(foo.geom,agri_punjab.tbl_flour_mills.geom)),
food_markets as (select count(*) as food_markets from agri_punjab.tbl_food_markets,foo where st_intersects(foo.geom,agri_punjab.tbl_food_markets.geom)),
rice_mills as (select count(*) as rice_mills from agri_punjab.tbl_rice_mills,foo where st_intersects(foo.geom,agri_punjab.tbl_rice_mills.geom)),
suger_mills as (select count(*) as suger_mills from agri_punjab.tbl_suger_mills,foo where st_intersects(foo.geom,agri_punjab.tbl_suger_mills.geom)),
veg_oil_fat as (select count(*) as veg_oil_fat from agri_punjab.tbl_veg_oil_fat,foo where st_intersects(foo.geom,agri_punjab.tbl_veg_oil_fat.geom))
select * from floor_mills,food_markets,rice_mills,suger_mills,veg_oil_fat ";

        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output = pg_fetch_all($result_query1);
        }



//        $sql2="select district_name,tehsil_name from tbl_tehsil where st_intersects(geom,st_setsrid(ST_Point( $lon, $lat),4326)) limit 1";
//        $result_query2 = pg_query($sql2);
//        if ($result_query2) {
//            $output['dist_teh'] = pg_fetch_all($result_query2);
//        }

//        $output['dist_teh'] = array('district_name'=>'district','tehsil_name'=>'tehsil');


        $this->closeConnection();
        return json_encode($output);
    }


}

$json = new mills_count();
//$json->closeConnection();
echo $json->loadData();


?>
