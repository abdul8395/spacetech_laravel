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

        $sql="select sector,count(*) from tbl_cmi_data_joined where is_cmi_category = true and district_id = '$dist' and sector is not null group by  sector";
		
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