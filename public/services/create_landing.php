<?php
session_start();
include('connection.php');

class UserMaps extends connection
{
    function __construct()
    {
        $this->connectionDB();
    }

  function login()
  {
      $id = $_SESSION['user_id'];


      $check_sql = "select job_id,job_name from tbl_users_jobs where user_id=$id";
      //echo $check_sql;
      $check_query = pg_query($check_sql);

      //$rs = pg_fetch_array($check_query);
      //  print_r($rs);
      if ($check_query) {
          $output = pg_fetch_all($check_query);
      $this->closeConnection();
      return json_encode($output);
      }else{
          $this->closeConnection();
          return "failed";
      }
  }

}
   $loginuser=new UserMaps();

       echo $loginuser->login();

?>