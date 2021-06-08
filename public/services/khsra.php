<?php
session_start();
include("connection.php");
class Start extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }
    public function loadData()
    {
        $mza=$_REQUEST['mza_id'];

        $sql_kh="SELECT gid, khasra_id, object_id, district_id, tehsil_id, qanoongoi_id, patwarcircle_id, mauza_id, square_number, khasra_number, sub_khasra_number, khasra_name, system_startdate, system_enddate, legal_startdate, legal_enddate, edit_history, khasra_history, district_name, mz_name, mz_name_urdu, sub_sub_khasra_number, pin, extent, edit_khasra_history
	             FROM public.tbl_khasra_parcel where mauza_id='$mza' ORDER BY khasra_name";


        //echo $sql_kh;

        $result_query_kh = pg_query($sql_kh);
        if($result_query_kh)
        {
            $output['khsra'] = pg_fetch_all($result_query_kh);
        }

//        $sql_mauza="select gid,tehsil,mauza from tbl_mauza";
//
//        $result_query_moza = pg_query($sql_mauza);
//        if($result_query_moza)
//        {
//            $output['moza'] = pg_fetch_all($result_query_moza);
//        }





        $this->closeConnection();
        return json_encode($output);
    }

}

$json = new Start();
echo $json->loadData();
?>