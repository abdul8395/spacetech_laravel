<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class Env_logistics extends connection
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

        $sql="with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
                select updated_interchanges, transport_time_1, universities, transmission_network, topography_1,
                temperature_1, solar_radiations_1, settlements_1, railway_station_1, railroad_1, protected_areas_1, primary___secondary_road_1, 
                primary_intermediate_cities_1, population_growth_rate_1, police_station_1, minerals___mines_1, minemineralspoints, irrigation_network_1,
                irrigation_network, indutrial_estates_piedmic_1, interchanges, indutrial_estates_psic_1, indutrial_estates_fiedmic_1, 
                industries_concentration_cmi, industries, industrial_points, hospital_dhqs__thqs__ghs_1, highway_motorway_1, gwq, 
                ground_water_table_1, govt_schools_1, govt_colleges_1, gas_station_1, floods_1, gas_pipeline_1, forests_1, final_markets,
                existing_consumer_population_1, electricity_network_1, earthquake_zones_1, earthquake_epicentres_1, dryports_1, drainage_sop,
                drainage_network_1, district_headquarters_1, dhq, cities50boundary, cities50, airport_1, canals, builtup
                     FROM pss_dss.tbl_grid  a,foo 
                where st_intersects(a.geom,foo.geom)";

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

$json = new Env_logistics();
//$json->closeConnection();
// echo $json->loadData();


?>