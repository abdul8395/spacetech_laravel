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

        $sql="with foo as (
with final as (
with foo as (
select * from json_populate_recordset(null::x, '[{\"condition\":\"A\",\"class\":\"Not Accepted\"},{\"condition\":\"B\",\"class\":\"Not Accepted\"},{\"condition\":\"C\",\"class\":\"Reconsider\"},{\"condition\":\"D\",\"class\":\"Accepted\"},{\"condition\":\"F\",\"class\":\"Accepted\"}]')
	),bar as (
with foo as (select ST_Transform(st_setsrid(ST_GeomFromGeoJSON ('$geom'),4326),32643)as geom)
select condition,count(*) count, sum(st_length(st_intersection(water.tbl_ws.geom,foo.geom))) as length from water.tbl_ws,foo  where st_intersects(water.tbl_ws.geom,foo.geom)
group by condition
)select foo.condition,foo.class,coalesce(bar.count,0) as ws_lines,(bar.length/sum(bar.length) over())*100 as total_length_percentage from foo left outer join bar on foo.condition = bar.condition
)select *, sum(total_length_percentage) over(partition by class) as class_score from final
)select condition,ws_lines,total_length_percentage,class_score,(select class from foo where class_score = (select max(class_score) from foo) limit 1) as final_result from foo order by condition
";
		
        $output = array();

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