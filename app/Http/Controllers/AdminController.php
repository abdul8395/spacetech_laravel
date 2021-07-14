<?php

namespace App\Http\Controllers;

use DB;
use Auth;
use Illuminate\Http\Request;
use App\Models\Add_data;
use App\Models\Form;
use App\Models\DataUpload;
use App\Models\Data_upload_divi;
use App\Models\tbl_dep;
use App\Models\tbl_divi;
// use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Response;

use Shapefile\Shapefile;
use Shapefile\ShapefileException;
use Shapefile\ShapefileReader;

use VIPSoft\Unzip\Unzip;


header('Content-Type: application/json');

class AdminController extends Controller
{

    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

  

    public function index(){
        $dep = DB::table("space_tech.tbl_department")->pluck("department_name", "department_id");
        $div = DB::table("space_tech.tbl_division")->pluck("division_name", "division_id");
        // $dep = DB::select("SELECT DISTINCT department_id, department_name
        // FROM space_tech.tbl_data_upload_departments;");
        // $div = DB::select("SELECT DISTINCT division_id, division_name
        // FROM space_tech.tbl_data_upload_divisions;");
         // print_r($dep);
        // exit();
        return view('admin.index', ['deps' => $dep, 'divs' => $div]);
    } 
    public function Load_DataPage(){
        // $dt=DataUpload::all();
        $dt=DB::select("SELECT data_id FROM space_tech.tbl_data_upload where isapproved=true;");
        // $d_id=$dt[1]->data_id;
        // echo $d_id;
        // exit();
        $data= array();
        for($i=0; $i<sizeof($dt); $i++){
            $d_id=$dt[$i]->data_id;
            if (Auth::user()) {       
                $u_id=auth()->user()->id;
                $u_role=auth()->user()->role;
                $dtup = DB::select("SELECT
                dt.datatype_name, data_id, space_tech.tbl_data_upload.user_id, data_name, data_storage_date, u.name,data_creation_date,
                data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved, privacy_level     
                FROM space_tech.tbl_data_upload
                INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  space_tech.tbl_data_upload.datatype_id
                INNER JOIN space_tech.users u ON u.source_id =  space_tech.tbl_data_upload.source_id
                where space_tech.tbl_data_upload.data_id=$d_id;");
        
                $divinames = DB::select("SELECT division_name
                FROM space_tech.tbl_data_upload_divisions
                where data_id=$d_id;");
        
                $distnames = DB::select("SELECT district_name
                FROM space_tech.tbl_data_upload_districts
                where data_id=$d_id;");
        
                $tehnames = DB::select("SELECT tehsil_name
                FROM space_tech.tbl_data_upload_tehsils
                where data_id=$d_id;");
        
                $depname = DB::select("SELECT department_name
                FROM space_tech.tbl_data_upload_departments
                where data_id=$d_id;");
        
                $a=DB::select('SELECT permission_id, data_id, user_id, access_granted
                FROM space_tech.tbl_permissions
                where data_id='.$d_id.' and user_id='.$u_id.';');
                $reqchk='0';
                if(count($a)>0){
                    $reqchk='1';
                };
                $download_access_user = DB::select("SELECT data_id, user_id
                FROM space_tech.tbl_permissions where access_granted=true;");
                // $data[$i]="test";
                $data[$i]=['dtup' => $dtup, 'divinames' => $divinames, 'distnames' => $distnames, 'tehnames' => $tehnames, 'depname' => $depname , 'logusrid' => $u_id, 'u_role' => $u_role, 'reqchk' => $reqchk, 'download_access_user' => $download_access_user];
                // return view('admin.loadData',['dtup' => $dtup, 'divinames' => $divinames, 'distnames' => $distnames, 'tehnames' => $tehnames, 'depname' => $depname , 'logusrid' => $u_id]);
                
            } else { 
                $dtup = DB::select("SELECT
                dt.datatype_name, data_id, user_id, data_name, data_storage_date, u.name, data_creation_date,
                data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved, privacy_level     
                FROM space_tech.tbl_data_upload
                INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  space_tech.tbl_data_upload.datatype_id
                INNER JOIN space_tech.users u ON u.source_id =  space_tech.tbl_data_upload.source_id
                where space_tech.tbl_data_upload.data_id=$d_id;");
        
                $divinames = DB::select("SELECT division_name
                FROM space_tech.tbl_data_upload_divisions
                where data_id=$d_id;");
        
                $distnames = DB::select("SELECT district_name
                FROM space_tech.tbl_data_upload_districts
                where data_id=$d_id;");
        
                $tehnames = DB::select("SELECT tehsil_name
                FROM space_tech.tbl_data_upload_tehsils
                where data_id=$d_id;");
        
                $depname = DB::select("SELECT department_name
                FROM space_tech.tbl_data_upload_departments
                where data_id=$d_id;");
                // return view('admin.loadData1',['dtup' => $dtup, 'divinames' => $divinames, 'distnames' => $distnames, 'tehnames' => $tehnames, 'depname' => $depname]);
                $data[$i]=['dtup' => $dtup, 'divinames' => $divinames, 'distnames' => $distnames, 'tehnames' => $tehnames, 'depname' => $depname];
               
            }
        }
        // print_r($data);
        return view('admin.loadData', ['data' => $data]);

        
    } 
   
    
    
    public  function approval_logs(){
        $dtype = DB::select("SELECT DISTINCT datatype_id, datatype_name
        FROM space_tech.tbl_data_types;");
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('admin.ApprovalHistory', ['dtype' => $dtype, 'dsrc' => $dsrc]);
    } 
    public  function load_approval_data($data){
        $u_id=auth()->user()->id;
        $a=json_decode($data);
        if($a->StorageDate==''){
            $stdate='null';
        }else{
        $stdate=date('Ymd', strtotime($a->StorageDate));
        }
        if($a->CreationDate==''){
            $crdate='null';
        }else{
        $crdate=date('Ymd', strtotime($a->CreationDate));
        }
        if($a->Type==''){
            $type='null';
        }else{
        $type=$a->Type;
        }
        if($a->Srcdpt==''){
            $src='null';
        }else{
        $src=$a->Srcdpt;
        }
        if($a->StorageDate == '' && $a->CreationDate == '' && $a->Type == '' && $a->Srcdpt == ''){
           
            $q = DB::select("SELECT
                            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
                            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
                            FROM space_tech.tbl_data_upload  as du
                            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
                            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
                            where user_id=$u_id;");
            return json_encode($q);
            
        }
        elseif($type == 'null' && $src == 'null'){
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate';");
            return json_encode($q);
        }
        elseif($type == 'null'){
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate' and du.source_id=$src;");
            return json_encode($q);
        }
        elseif($src == 'null'){
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate' and du.datatype_id=$type;");
            return json_encode($q);
        }
        else{
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate' and du.datatype_id=$type and du.source_id=$src;;");
            return json_encode($q);
        }
        // print_r($a);
        // $date=$a->StorageDate;
        // echo $a->Srcdpt;
        // echo date('Ymd', strtotime($date));
        // print_r($a);
        // exit();
    } 
    public  function viewdes($id){
        $a=json_decode($id);
        $q = DB::select("SELECT description
        FROM space_tech.tbl_approval_log where data_id=$a;");
        $des;
        foreach ($q as $f) {
            $des="$f->description";
        }
        return json_encode($des);
    } 


    public  function pending_req(){
        $dtype = DB::select("SELECT DISTINCT datatype_id, datatype_name
        FROM space_tech.tbl_data_types;");
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('admin.PendingRequests', ['dtype' => $dtype, 'dsrc' => $dsrc]);    
    } 
    public  function load_pending_req($data){
        $a=json_decode($data);
        $u_id=auth()->user()->id;

        if($a->StorageDate==''){
            $stdate='null';
        }else{
        $stdate=date('Ymd', strtotime($a->StorageDate));
        }
        if($a->CreationDate==''){
            $crdate='null';
        }else{
        $crdate=date('Ymd', strtotime($a->CreationDate));
        }
        if($a->Type==''){
            $type='null';
        }else{
        $type=$a->Type;
        }
        if($a->Srcdpt==''){
            $src='null';
        }else{
        $src=$a->Srcdpt;
        }
        if($a->StorageDate == '' && $a->CreationDate == '' && $a->Type == '' && $a->Srcdpt == ''){
            $a=DB::select('SELECT data_id
            FROM space_tech.tbl_permissions
             where user_id='.$u_id.' and access_granted is null;');
            if(count($a)>0){
                $darr = json_decode(json_encode($a), true);
                $dt_id= implode(", ", array_map(function($obj) { foreach ($obj as $p => $v) { return $v;} }, $darr));

                $q = DB::select("SELECT
                dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
                data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
                FROM space_tech.tbl_data_upload
                INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  space_tech.tbl_data_upload.datatype_id
                INNER JOIN space_tech.users u ON u.source_id =  space_tech.tbl_data_upload.source_id
                where data_id in ($dt_id);");
                return json_encode($q);
             }
        }
        else{
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  space_tech.tbl_data_upload.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  space_tech.tbl_data_upload.source_id
            where space_tech.tbl_data_upload.data_storage_date='$stdate' or space_tech.tbl_data_upload.data_creation_date='$crdate' or space_tech.tbl_data_upload.datatype_id=$type or space_tech.tbl_data_upload.source_id=$src
            and data_id in (".$a.");");
            return json_encode($q);
        }
    }
    public  function req_log(){
        $dtype = DB::select("SELECT DISTINCT datatype_id, datatype_name
        FROM space_tech.tbl_data_types;");
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('admin.RequestsLog', ['dtype' => $dtype, 'dsrc' => $dsrc]);
        
    } 
    public  function req_logdata($data){
        $u_id=auth()->user()->id;
        $a=json_decode($data);
        if($a->StorageDate==''){
            $stdate='null';
        }else{
        $stdate=date('Ymd', strtotime($a->StorageDate));
        }
        if($a->CreationDate==''){
            $crdate='null';
        }else{
        $crdate=date('Ymd', strtotime($a->CreationDate));
        }
        if($a->Type==''){
            $type='null';
        }else{
        $type=$a->Type;
        }
        if($a->Srcdpt==''){
            $src='null';
        }else{
        $src=$a->Srcdpt;
        }
        $download_access_user = DB::select("SELECT data_id, user_id
        FROM space_tech.tbl_permissions where access_granted=true;");

        if($a->StorageDate == '' && $a->CreationDate == '' && $a->Type == '' && $a->Srcdpt == ''){
           
            $q = DB::select("SELECT
                            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
                            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
                            FROM space_tech.tbl_data_upload  as du
                            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
                            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
                            where user_id=$u_id and du.isapproved IS not NULL or data_id in (SELECT data_id
                            FROM space_tech.tbl_permissions where access_granted=true);");
            return json_encode($q);
            
        }
        elseif($type == 'null' && $src == 'null'){
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id and du.isapproved IS not NULL or data_id in (SELECT data_id
            FROM space_tech.tbl_permissions where access_granted=true)
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate';");
            return json_encode($q);
        }
        elseif($type == 'null'){
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id and du.isapproved IS not NULL or data_id in (SELECT data_id
            FROM space_tech.tbl_permissions where access_granted=true)
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate' and du.source_id=$src;");
            return json_encode($q);
        }
        elseif($src == 'null'){
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id and du.isapproved IS not NULL or data_id in (SELECT data_id
            FROM space_tech.tbl_permissions where access_granted=true)
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate' and du.datatype_id=$type;");
            return json_encode($q);
        }
        else{
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id and du.isapproved IS not NULL or data_id in (SELECT data_id
            FROM space_tech.tbl_permissions where access_granted=true)
            and du.data_storage_date='$stdate' and du.data_creation_date='$crdate' and du.datatype_id=$type and du.source_id=$src;;");
            return json_encode($q);
        }
    }

    public function reqbtn($id){
       $a= DB::insert('INSERT INTO space_tech.tbl_data_upload(
            data_id, datatype_id, user_id, data_name, file_url, data_storage_date, data_creation_date, data_description, 
            data_crs, data_usage_purpose, data_isvector, data_level, privacy_level, data_resolution, image_type, image_description)
            VALUES ('.$data_id.',' .$dtid.',' .$u_id.',' ."'$dname'".',' ."'$furl'".',' ."'$dstdate'".',' ."'$dcdate'".',' ."'$ddes'".',' ."'$dcrs'".',' ."'$dup'".',' .$disvector.',' ."'$dlvl'".',' ."'$dplvl'".',' ."'$data_resolution'".',' ."'$image_type'".',' ."'$image_description'".');');
        if($a)
        { 
          return back()->with('success', 'Password Changed Successfully.');
        }
        else
        {          
          return back()->with('error', 'Please enter correct password');
        }  
        
    }

    public function changepass() {
        return view('auth.change_password');
    }
    // public function storepass(Request $request) {
    //     $request->validate([
    //         'current_password' => ['required', new MatchOldPassword],
    //         'new_password' => ['required'],
    //         'new_confirm_password' => ['same:new_password'],
    //     ]);
    // User::find(auth()->user()->id)->update(['password'=> Hash::make($request->new_password)]);
    //     // return back()->with('success', 'Password Changed Successfully.');
    //     dd('Password change successfully.');
    // }

    public function storepass(Request $request){
        // echo "storepass";
        // exit();

        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:3|confirmed',
            'password_confirmation' => 'required',
          ]);
  
          $user = Auth::user();
  
          if (!Hash::check($request->current_password, $user->password)) {
              return back()->with('error', 'Current password does not match!');
          }
  
          $user->password = Hash::make($request->password);
          $user->save();
  
          return back()->with('success', 'Password successfully changed!');

          
    
        
    }
   
    

    public function counts() {
        if (Auth::user()) {       
            $u_id=auth()->user()->id;
            $approval = DB::select("SELECT
                    dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
                    data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
                    FROM space_tech.tbl_data_upload  as du
                    INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
                    INNER JOIN space_tech.users u ON u.source_id =  du.source_id
                    where user_id=$u_id;");
            $approvalcount=count($approval);
    
            $pendreq=DB::select('SELECT data_id
                    FROM space_tech.tbl_permissions
                    where user_id='.$u_id.' and access_granted is null;');
            $pendreqcount=count($pendreq);
    
            $reqlog = DB::select("SELECT
                    dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
                    data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
                    FROM space_tech.tbl_data_upload  as du
                    INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
                    INNER JOIN space_tech.users u ON u.source_id =  du.source_id
                    where user_id=$u_id and du.isapproved IS not NULL or data_id in (SELECT data_id
                            FROM space_tech.tbl_permissions where access_granted=true);");
            $reqlogcount=count($reqlog); 
            return ['approvalcount' => $approvalcount,'pendreqcount' => $pendreqcount,'reqlogcount' => $reqlogcount];
        }  

    }
    public function testform(Request $request) {
        return view('admin.testform');
    }

    public function storetestform(Request $request) {

    // Form validation
    $request->validate([
        'name' => 'required',
        'message' => 'required'
    ]);

    // return $request->all();

    //  Store data in database
    $task = new Form();
    $task->name = $request->name;
    $task->message = $request->message;
    $task->save();
    // return redirect()->route('/');

    return back()->with('success', 'Your form has been submitted.');
}
    
}
