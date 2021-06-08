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
        $dist=$_REQUEST['dist'];

        $sql="select  * from tbl_industry_district_readiness_val where district = '$dist'";

		
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