<?php

namespace App\Http\Controllers;
use DB;
use Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class SuperAdminController extends Controller
{
    public  function index(){
        return view('admin.index');
    } 
    public  function filetypes(){
        return view('superadmin.FileTypes');
    } 
    public  function Load_ext(){
                $d = DB::select("SELECT datatype_id, datatype_name, datatype_extension, datatype_isactive
                FROM space_tech.tbl_data_types;");
               
                return View('superadmin.LoadFileTypes', ['ext' => $d]);
    } 
    public  function chkext($data){
        $a=json_decode($data);
        // echo $a;
        $ext = DB::select("SELECT datatype_id, datatype_name
        FROM space_tech.tbl_data_types where datatype_extension='$a';");
        // print_r($ext);
        $res = count($ext);
        // echo $res;
        if($res==1){
            return json_encode(true);
        }
        else{
            return json_encode(false);
        }   
    }
    public  function store_ext($data){
        $a=json_decode($data);
        $q = DB::select("select max(datatype_id) from space_tech.tbl_data_types;");
        $arr = json_decode(json_encode($q), true);
        $data_id=implode("",$arr[0])+1;
        
        // echo $a;
        $q = DB::select("INSERT INTO space_tech.tbl_data_types(
            datatype_id, datatype_name, datatype_extension, datatype_isactive)
            VALUES ($data_id, '$a->Name', '$a->Extension', 'false');");
            return json_encode(true);  
    }
    public  function pending_req(){
        $dtype = DB::select("SELECT DISTINCT datatype_id, datatype_name
        FROM space_tech.tbl_data_types;");
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('superadmin.PendingRequests', ['dtype' => $dtype, 'dsrc' => $dsrc]);
        
    } 
    public  function load_pending_req($data){
        $a=json_decode($data);
        // $u_id=auth()->user()->id;

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
             where access_granted is null;');
           
            if(count($a)>0){
                $darr = json_decode(json_encode($a), true);
                $dt_id= implode(", ", array_map(function($obj) { foreach ($obj as $p => $v) { return $v;} }, $darr));
                $dataid = ltrim($dt_id, ',');

                $q = DB::select("SELECT
                dt.datatype_name, du.data_id, data_name, data_storage_date, u.name,data_creation_date,
                data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved, p.permission_id, p.user_id   
                FROM space_tech.tbl_data_upload du
                INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
                INNER JOIN space_tech.users u ON u.source_id =  du.source_id
				inner join space_tech.tbl_permissions p on p.data_id=du.data_id
                where du.data_id in ($dataid) and p.access_granted is null;");
                
                // print_r($q);
                $k=0;
                foreach($q as $p){
                   $a= DB::select("SELECT name from users where id=$p->user_id;");
                  // print_r($p);
                  // print_r($a);
                
                   $q[$k]->username=$a[0]->name;
                   $k++;
                //   print_r($q);
                }
                
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

    public  function approval(){
        $dtype = DB::select("SELECT DISTINCT datatype_id, datatype_name
        FROM space_tech.tbl_data_types;");
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('superadmin.FileApproval', ['dtype' => $dtype, 'dsrc' => $dsrc]);
        
    } 
    public  function load_approval($data){

        // return view('superadmin.LoadApprovalData');
        // exit();

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
            dt.datatype_name, data_id, data_name, data_storage_date, u.name, data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  space_tech.tbl_data_upload.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  space_tech.tbl_data_upload.source_id
            where space_tech.tbl_data_upload.isapproved IS NULL;");
            return view('superadmin.LoadApprovalData', ['data' => $q]);
        }
        else{
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name, data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  space_tech.tbl_data_upload.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  space_tech.tbl_data_upload.source_id
            where space_tech.tbl_data_upload.isapproved IS NULL
            and space_tech.tbl_data_upload.data_storage_date='$stdate' or space_tech.tbl_data_upload.data_creation_date='$crdate' or space_tech.tbl_data_upload.datatype_id=$type or space_tech.tbl_data_upload.source_id=$src;");
            return view('superadmin.LoadApprovalData', ['data' => $q]);
        }
        
    } 
    public  function apprfile($data){
        $id=json_decode($data);
        DB::update("UPDATE space_tech.tbl_data_upload
        SET isapproved=true WHERE data_id=$id;");
        return json_encode(true);
    } 
    public  function rejectfile($data){
        $id=json_decode($data);
        DB::update("UPDATE space_tech.tbl_data_upload
        SET isapproved=false WHERE data_id=$id;");
        return json_encode(true);
    } 

    public  function dapprreq($data){
        DB::update('UPDATE space_tech.tbl_permissions
        SET access_granted= true
        WHERE permission_id='.$data.';');
            return json_encode(true);
    } 
    public  function drejectreq($data){
        DB::update('UPDATE space_tech.tbl_permissions
        SET access_granted= false
        WHERE permission_id='.$data.';');
            return json_encode(true);
    } 
    public  function req_log(){
        $dtype = DB::select("SELECT DISTINCT datatype_id, datatype_name
        FROM space_tech.tbl_data_types;");
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('superadmin.RequestsLog', ['dtype' => $dtype, 'dsrc' => $dsrc]);
    } 

    public  function admins(){
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('superadmin.users', ['dsrc' => $dsrc]);
    } 
    public  function Load_Users($data){
        // return View('superadmin.LoadUsers');
        
        $a=json_decode($data);
        // echo $a;
        // exit();
            if ($a=='')
            {
                $adms = DB::select("SELECT name, mobile_no, email, a.source_name, role 
                FROM space_tech.users
                inner join space_tech.tbl_sources a on a.source_id = space_tech.users.source_id
                where role=2;");
               
                return View('superadmin.LoadUsers', ['adms' => $adms]);
            }
            else
            {
                $adms = DB::select("SELECT name, mobile_no, email, a.source_name, role 
                FROM space_tech.users
                inner join space_tech.tbl_sources a on a.source_id = $a
                where role=2 and space_tech.users.source_id = $a;");
            //    print_r($adms);
                return View('superadmin.LoadUsers', ['adms' => $adms]);
            }
    } 
    public  function add_admin(){
        $dsrc = DB::select("SELECT DISTINCT source_id, source_name
        FROM space_tech.tbl_sources;");
        return view('superadmin.Register', ['dsrc' => $dsrc]);
    } 
    public  function storeadmin(Request $request){
        $request->validate([
            'name' => ['required','string'],
            'mobileno' => ['required','max:14'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:3', 'confirmed'],
            'role' => ['required'],
            'source' => ['required']
        ]);
        // return $request->all();
        

        $utb = new User();
        $utb->name = $request->name;
        $utb->mobile_no = $request->mobileno;
        $utb->email = $request->email;
        $utb->password =Hash::make($request->password);
        $utb->role = 2;
        $utb->source_id =$request->source;
        $utb->save();
        return back()->with('success', 'Admin has been Created succesfuly.');
        // return redirect()->route('/');
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
            'current_password' => ['required'],
            'new_password' => ['required'],
            'new_confirm_password' => ['same:new_password'],
        ]);
        $current_password = \Auth::User()->password;           
        if(\Hash::check($request->input('current_password'), $current_password))
        {          
          $user_id = \Auth::User()->id;                       
          $obj_user = User::find($user_id);
          $obj_user->password = \Hash::make($request->input('new_password'));
          $obj_user->save(); 
          return back()->with('success', 'Password Changed Successfully.');
        }
        else
        {          
          return back()->with('error', 'Please enter correct password');
        }  
        
    }
}
