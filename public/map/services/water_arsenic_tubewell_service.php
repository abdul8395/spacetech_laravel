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

        $sql="with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
            ,bar as (
            select a.gid,scheme_nam as tubewell_name, round((st_distance(st_transform(a.geom,32643),foo.geom)/1000)::numeric,2) as distance  from water.tbl_tubewell_rural a,foo
            ORDER BY foo.geom <-> st_transform(a.geom,32643) limit 1
            ),goo as (
            select a.gid, round((st_distance(st_transform(a.geom,32643),foo.geom)/1000)::numeric,2) as distance_from_sample,arsenic::double precision*1000 as arsenic 
                ,NULLIF(regexp_replace(flouride, '\D','','g'), '')::double precision  as flouride,NULLIF(regexp_replace(nitrate, '\D','','g'), '')::double precision as nitrate,tds::double precision  from water.tbl_water_quality_sample a,foo
            ORDER BY foo.geom <-> st_transform(a.geom,32643) limit 1
            )select (select distance as distance_from_tubewell from bar ),(select tubewell_name  from bar ),*,
            case when arsenic>50 then 'false' else 'true' end as arsenic_status ,
            case when flouride>1.5 then 'false' else 'true' end as flouride_status,
            case when nitrate>50 then 'false' else 'true' end as nitrate_status,
            case when tds>1000 then 'false' else 'true' end as tds_status
            from goo";


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