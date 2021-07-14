<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Auth;


class MapController extends Controller
{
    public function index(){
        if (Auth::user()) {     
            $u_id=auth()->user()->id;
            return view('map.index', ['user_id' => $u_id]);
        }else{
            return view('map.index', ['user_id' => 0]);
        }
    } 
    public function uid_service($uid){
        // $users = DB::connection('pssdb')->table("public.tbl_users")->pluck("user_name");
        // print_r($users);
        $sql1=DB::connection('pssdb')->select("select data_id, data_name, data_creation_date, data_description, data_crs ,
        data_description, type.datatype_id,type.datatype_name,type.datatype_extension,
        file_url
        from space_tech.tbl_data_upload
        inner join space_tech.tbl_data_types type on type.datatype_id = space_tech.tbl_data_upload.datatype_id where user_id=$uid AND isapproved='true' ;");

        return $sql1;
        // echo "wlcm in user_id method";
        // $uid=json_decode($id);
        // $users = DB::connection('pssdb')->table("tbl_users")->pluck("username");
    } 
   
}
