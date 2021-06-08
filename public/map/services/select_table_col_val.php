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
      $layer_name = $_REQUEST['layer_name'];
      $value = $_REQUEST['value'];
      $offset=$_REQUEST['offset'];
       $output=[];

      $sql="SELECT table_name FROM public.tbl_service_name_mapping where layer_name='$layer_name'";

      $q = pg_query($sql);
       $row=pg_fetch_object($q);




       $tbl_name=$row->table_name;


      $check_count= "SELECT count(distinct($value)) as count  FROM $tbl_name;";
      //echo $check_sql;
      $check_count = pg_query($check_count);
      $output['col_count'] = pg_fetch_all($check_count);


      $check_sql = "SELECT  distinct($value) as val FROM $tbl_name order BY $value offset $offset limit 10 ";
      //echo $check_sql;
      $check_query = pg_query($check_sql);

      //$rs = pg_fetch_array($check_query);
      //  print_r($rs);
      if ($check_query) {
          $output['col_val'] = pg_fetch_all($check_query);
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