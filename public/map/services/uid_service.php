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


        $uid=$_REQUEST['user_id'];
        $sql1="select data_id, data_name, data_creation_date, data_description, data_crs ,
        data_description, type.datatype_id,type.datatype_name,type.datatype_extension,
        case when type.datatype_name = 'Shape' then 
        shp_file_path
        when type.datatype_name in ('PDF','Image') then
        image_access_path
        else 
        file_url
        end url
        from space_tech.tbl_data_upload
        inner join space_tech.tbl_data_types type on type.datatype_id = space_tech.tbl_data_upload.datatype_id where user_id='".$uid."' AND isapproved='true'";
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