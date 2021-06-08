<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("connection.php");


class Pss extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $geom = $_REQUEST['geom'];
        $output = array();

		
        // $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom
// )select st_intersects(a.geom,foo.geom) as alligned  FROM tbl_circle_boundary a,foo
// where st_intersects(a.geom,foo.geom) limit 1";


        // $result_query = pg_query($sql);
        // if ($result_query) {
        // $output['align'] = pg_fetch_all($result_query);
        // }
		


        $sql1 = "with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
        select sum(community) as community,sum(connectivity) connectivity,sum(enviroment) enviroment,sum(humancapital) humancapital,
       sum(institutoin) institutoin,sum(markets) markets,sum(utilities)  utilities,sum(siteattrib) siteattrib, 
	   sum(f_highway) as f_highway, sum(f_railway) as f_railway,sum(f_dryport) as f_dryport,sum(f_electricity_network) as f_electricity_network,sum(f_electricity_network) as f_electricity_network,sum(f_gas_transmission_network) as f_gas_transmission_network,sum(f_drainage_network) as f_drainage_network,sum(f_university) as f_university,sum(f_tevta_training_center) as f_tevta_training_center,sum(f_topography) as f_topography,sum(f_ground_water_table) as f_ground_water_table,sum(f_airqality) as f_airqality,
	   sum(raw_matrials) raw_matrials,sum(final_score)/count(*) as final_score 
from prep.tbl_dss_final a,foo 
        where st_intersects(a.geom,foo.geom) ";

        $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output['dimentions'] = pg_fetch_all($result_query1);
        }

        $sql2="select district_name,tehsil_name from tbl_tehsil where st_intersects(geom,st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)) limit 1";


        $result_query2 = pg_query($sql2);
        if ($result_query2) {
            $output['dist_teh'] = pg_fetch_all($result_query2);
        }



        $output['cooridoor'] = $this->check_corridoor_intersection();
        $output['near_suitable'] = $this->get_near_suitable();
        $output['env_sectoral'] = $this->check_envirnment_sectoral();
        $output['env_spatial'] = $this->check_envirnment_spatial();

        if($output['cooridoor']==false){
            $output['cooridoor']['name'] = 'Rule1';
            $output['cooridoor']['status']='false';
            $output['cooridoor']['corridoor_name']=null;
        }else{
            $output['cooridoor']['name'] = 'Rule1';
            $output['cooridoor']['status']='true';
            $output['cooridoor']['corridoor_name']= $output['cooridoor'][0]['corridoor_name'];

        }

        if($output['dimentions']==false){
            $output['dimentions']['name'] = 'Rule2';
            $output['dimentions']['status']='false';
        }else{
            $output['dimentions']['name'] = 'Rule2';
            $output['dimentions']['status']='true';
            //  $output['dimentions']['dimensions']=$output['dimentions'];
        }




        $this->closeConnection();
        return json_encode($output);
    }

    public function check_corridoor_intersection()
    {
        $geom = $_REQUEST['geom'];

        $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom
                )select a.gid as id, newcorri1 as corridoor_name ,st_intersects(a.geom,foo.geom) as alligned  FROM tbl_industries_corridors a,foo 
                where st_intersects(a.geom,foo.geom) limit 1";
        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }


        return $output;
    }


    public function get_near_suitable()
    {
        $geom = $_REQUEST['geom'];

        $sql = "	
		with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
		select a.gid,a.newcorri1 as corridoor_name, round((st_distance(st_transform(a.geom,32643),foo.geom)/1000)::numeric,2) from tbl_industries_corridors a,foo
		ORDER BY foo.geom <-> st_transform(a.geom,32643) limit 5
		";


        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }


        return $output;
    }


    public function check_envirnment_sectoral()
    {
        $geom = $_REQUEST['geom'];

        $sql = "	
		with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
		select 
		(select coalesce(st_intersects(foo.geom,tbl_builtup_2017.geom),'false') as residential from foo,tbl_builtup_2017 where st_intersects(foo.geom,tbl_builtup_2017.geom) ),
		(select st_intersects(st_transform(foo.geom,4326),tbl_flood_extent.geom) as flood from foo,tbl_flood_extent where st_intersects(st_transform(foo.geom,4326),tbl_flood_extent.geom)),
		(select st_intersects(st_transform(foo.geom,4326),tbl_mc_boundary_2015.geom) as major_city from foo,tbl_mc_boundary_2015 where st_intersects(st_transform(foo.geom,4326),tbl_mc_boundary_2015.geom))
		";


        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }


        return $output;
    }


    public function check_envirnment_spatial()
    {
        $geom = $_REQUEST['geom'];
        // $scheme_type = $_REQUEST['scheme_type'];

        $sql = "		
		with foo as (select st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326)as geom)
		select 
		(select case when tbl_conservation_area.grid_code::integer>=4 then 'true' else 'false' end  as conservation_area from foo,tbl_conservation_area where st_intersects(foo.geom,tbl_conservation_area.geom) ),
		(select tbl_ground_water_quality.grid_code::integer as water_quality from foo,tbl_ground_water_quality where st_intersects(foo.geom,tbl_ground_water_quality.geom)),
		(select tbl_water_depth_grid.grid_code::integer as water_depth from foo,tbl_water_depth_grid where st_intersects(foo.geom,tbl_water_depth_grid.geom)),
		(select legal_rule from tbl_env_scheme_legal_types where scheme_type = 'Special Industrial Zone' ),
		(select tbl_mauza.mauza from foo,tbl_mauza where st_intersects(foo.geom,tbl_mauza.geom)),
		(select st_intersects(st_transform(foo.geom,32643),tbl_vegetatoin.geom) as vegitation from foo,tbl_vegetatoin where st_intersects(st_transform(foo.geom,32643),tbl_vegetatoin.geom)),
		(select mc_name || '  '||round((st_distance(st_transform(foo.geom,32643),st_transform(tbl_cities.geom,32643))/1000)::numeric,2) || '(km)' as city_name from foo,tbl_cities where city_type = 'Primary City' ORDER BY foo.geom <-> tbl_cities.geom limit 1),
		(select estate || name as estate_name from foo,tbl_industrial_estates ORDER BY foo.geom <-> tbl_industrial_estates.geom limit 1),
		(select st_intersects(foo.geom,tbl_env_protected_areas.geom) as protected_areas from foo,tbl_env_protected_areas  where st_intersects(foo.geom,tbl_env_protected_areas.geom))
		";


        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }


        return $output;
    }


}

$json = new Pss();
//$json->closeConnection();
echo $json->loadData();


?>