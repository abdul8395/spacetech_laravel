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
        $lvl = $_REQUEST['lvl'];
        $parm = $_REQUEST['param'];


        $sql = "select * from  GetRows('".$tbl."',$lvl,'".$parm."')";
         //dept(lvl_name text,lvl_id int,val bigint)";
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