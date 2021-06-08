<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("connection.php");


class Pss extends connection
{
    function __construct()
    {
        $this->connectionDB();
		if(isset($_REQUEST['district'])){
			$result = $this->check_district($_REQUEST['district']);
			echo json_encode($result);
		}
		
		if(isset($_REQUEST['sector'])){
		$result = $this->check_sector($_REQUEST['sector']);
		echo json_encode($result);
		}
		

    }

    public function check_district($distrct_id)
    {
        $sql="select * from tbl_optimal_sector where district_name ilike '".$distrct_id."'";
		
        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }
		 $this->closeConnection();
        return $output;
    }
	   public function check_sector($sector_id)
    {
        

        $sql="select * from tbl_optimal_sector where sector_id = $sector_id";

        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }
        $this->closeConnection();
        return $output;
    }
}

$json = new Pss();
//$json->closeConnection();
// echo $json->loadData();


?>