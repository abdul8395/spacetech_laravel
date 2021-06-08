<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("../connection.php");


class Scheme_category extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

//        $table = $_REQUEST['table'];
        $output = array();




        $sql3="select * from environment.schedule2";


        $result_query3 = pg_query($sql3);
        if ($result_query3) {
            $output = pg_fetch_all($result_query3);
        }


        $this->closeConnection();
        return json_encode($output);
    }
}

$json = new Scheme_category();
//$json->closeConnection();
echo $json->loadData();


?>