<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("connection.php");


class Redlining extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {
        $tbl = $_REQUEST['tbl'];
        $query = $_REQUEST['query'];
       // $parm = $_REQUEST['param'];

        $sql1="SELECT table_name FROM public.tbl_service_name_mapping where layer_name='$tbl'";
        $result_query1 = pg_query($sql1);
        $row=pg_fetch_object($result_query1);
        $tbl_name=$row->table_name;


        $sql = "select count(*) from  $tbl_name where $query";
        $output = array();

        $result_query = pg_query($sql);
        if ($result_query) {
            $output = pg_fetch_all($result_query);
        }

        $this->closeConnection();
        return json_encode($output);
    }
}

$json = new Redlining();
//$json->closeConnection();
echo $json->loadData();


?>