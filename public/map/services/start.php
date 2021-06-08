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





       $sql="select gid,division_name from tbl_division order by division_name";
//
        $output = array();
//
        $result_query = pg_query($sql);
        if($result_query)
        {
            $output['division'] = pg_fetch_all($result_query);
        }


        $sql_dist="select gid,district_name,division_id  from tbl_district order by district_name";

        $result_query_dist = pg_query($sql_dist);
        if($result_query_dist)
        {
            $output['district'] = pg_fetch_all($result_query_dist);
        }

        $sql_teh="select gid,district_name,tehsil_name,district_id  from tbl_tehsil order by tehsil_name";

        $result_query_teh = pg_query($sql_teh);
        if($result_query_teh)
        {
            $output['teh'] = pg_fetch_all($result_query_teh);
        }

        $sql_uc="SELECT gid, district_name, tehsil_name, uc_name, uc_no , tehsil_id FROM public.tbl_union_council order by uc_name";

        $result_query_uc = pg_query($sql_uc);
        if($result_query_uc)
        {
            $output['uc'] = pg_fetch_all($result_query_uc);
        }

        $sql_ward="SELECT gid, uc_no, district, tehsil, uc_name, ward_no,tehsil_id FROM public.tbl_ward ORDER by ward_no";

        $result_query_ward = pg_query($sql_ward);
        if($result_query_ward)
        {
            $output['ward'] = pg_fetch_all($result_query_ward);
        }


        $sql_qg="SELECT district, tehsil, qg , tehsil_id,gid FROM public.tbl_qanoongoi ORDER by qg";

        $result_query_qg = pg_query($sql_qg);
        if($result_query_qg)
        {
            $output['qg'] = pg_fetch_all($result_query_qg);
        }

//        $sql_pc="SELECT gid, patwarcircle_id, district_id, tehsil_id, qanoongoi_id, patwarcircle_name, date,
//                 district_name, tehsil_name, qg_name, extent, patwarcircle_name_eng
//	             FROM public.tbl_patwarcircle ORDER by patwarcircle_name";
//
//        $result_query_pc = pg_query($sql_pc);
//        if($result_query_pc)
//        {
//            $output['pc'] = pg_fetch_all($result_query_pc);
//        }


        $sql_mz="SELECT gid, district, tehsil, qg, mauza, tehsil_id,qanoongoi_id
	             FROM public.tbl_mauza ORDER by mauza";

        $result_query_mz = pg_query($sql_mz);
        if($result_query_mz)
        {
            $output['mz'] = pg_fetch_all($result_query_mz);
        }


//        $sql_kh="SELECT gid, khasra_id, object_id, district_id, tehsil_id, qanoongoi_id, patwarcircle_id, mauza_id, square_number, khasra_number, sub_khasra_number, khasra_name, system_startdate, system_enddate, legal_startdate, legal_enddate, edit_history, khasra_history, district_name, mz_name, mz_name_urdu, sub_sub_khasra_number, pin, extent, edit_khasra_history
//	             FROM public.tbl_khasra_parcel ORDER BY khasra_name";

//        $result_query_kh = pg_query($sql_kh);
//        if($result_query_kh)
//        {
//            $output['khsra'] = pg_fetch_all($result_query_kh);
//        }

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