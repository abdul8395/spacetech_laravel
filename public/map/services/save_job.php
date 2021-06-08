<?php

include("connection.php");
class Divisions extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }
    public function loadData()
    {
        session_start();
        $name=$_REQUEST['name'];
        $data= $_REQUEST['data'];
       // print_r($data->toc);
       // print_r($data);
        //exit();

        $userId= $_SESSION['user_id'];

        $sql_reg="INSERT INTO public.tbl_users_jobs(
	    user_id, job_name, job_data)
	    VALUES ($userId, '$name', "."'".json_encode($data)."'".");";
      //  echo $sql_reg;
        //exit();
        $sql_reg_num = pg_query($sql_reg);



        if($sql_reg_num){
            return "success";
        }else{
           return "failure";
        }
    }





}

$json = new Divisions();
//$json->closeConnection();
echo $json->loadData();
?>


