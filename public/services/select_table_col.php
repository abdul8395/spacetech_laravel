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

    if($layer_name=='Industry'){
        $check_sql = "SELECT column_name FROM  information_schema.columns WHERE table_name = (SELECT table_name FROM public.tbl_service_name_mapping where layer_name='$layer_name') and column_name in ('division_id','district_id','tehsil_id','row_id','application_number','establishment_name','establishment_address','establishment_area_unit_id','sector',
        'ind_group','ind_class','other_operational_status','product_one_production','unit_operates_months','establishment_area','establishment_annual_turnover','total_employee','male_employee','female_employee')";
                 // and column_name='division_id' and column_name='tehsil_id'     and column_name='row_id' and column_name='application_number' and column_name='establishment_name' and column_name='establishment_address' and column_name='establishment_area_unit_id'";
    }else {
        $check_sql = "SELECT column_name FROM  information_schema.columns WHERE table_name = (SELECT table_name FROM public.tbl_service_name_mapping where layer_name='$layer_name')";
    }
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