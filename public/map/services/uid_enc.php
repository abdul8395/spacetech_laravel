<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include("connection1.php");


class Pss extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

        $output = array();


        $uid_en=$_REQUEST['encid'];

       $sql1="SELECT user_id FROM space_tech.tbl_users where encrypted_user_id='".$uid_en."';";
     $result_query1 = pg_query($sql1);
        if ($result_query1) {
            $output = pg_fetch_all($result_query1);
        }


        $this->closeConnection();
        return json_encode($output);
    }
}

$json = new Pss();
//$json->closeConnection();
echo $json->loadData();


?>