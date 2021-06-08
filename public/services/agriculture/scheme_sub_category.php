<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class agri_sub_category extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

//        $table = $_REQUEST['table'];
        $cat_type = $_REQUEST['value'];
        $output = array();




//        $sql3="select * from $table where category_type= '".$cat_type."' ";
        $sql3="select * from agri_punjab.tbl_agri_sub_category where catageory_id::text like '".$cat_type."'";


        $result_query3 = pg_query($sql3);
        if ($result_query3) {
            $output = pg_fetch_all($result_query3);
        }


        $this->closeConnection();
        return json_encode($output);
    }
}

$json = new agri_sub_category();
//$json->closeConnection();
echo $json->loadData();


?>