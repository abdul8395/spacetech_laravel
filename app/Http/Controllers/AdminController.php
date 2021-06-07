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
// use ZanySoft\Zip\Zip;
// use ZipArchive;
use Illuminate\Support\Facades\Storage;
use Response;


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
                // $data[$i]="test";
                $data[$i]=['dtup' => $dtup, 'divinames' => $divinames, 'distnames' => $distnames, 'tehnames' => $tehnames, 'depname' => $depname , 'logusrid' => $u_id, 'reqchk' => $reqchk];
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
   
    public  function download($id){
        // $fid=DataUpload::find($id);
        $fid=DB::select("SELECT * FROM space_tech.tbl_data_upload where data_id=$id;");
        // echo $fid[0]['file_url'];
        foreach ($fid as $f) {
            $a=$f->file_url;
            $fn=basename($a);
            $tempname = tempnam(sys_get_temp_dir(), $fn);
            copy($a, $tempname);
            return response::download($tempname, $fn);
            exit();
        // return Storage::download('public/uploads/'.$b);
        // return Storage::download(storage_path("public/uploads/{$b}"));
        // return Storage::disk('public')->download($f->file_url);
        }
    } 

    public function reqbtnf($data){
        // echo "req f";
        // exit();
        $id=json_decode($data);
        $q = DB::select("select max(permission_id) from space_tech.tbl_permissions;");
        $arr = json_decode(json_encode($q), true);
        $pid=implode("",$arr[0])+1;
        $u_id=auth()->user()->id;
        DB::insert('INSERT INTO space_tech.tbl_permissions
                    (permission_id, data_id, user_id)
                        VALUES ( '.$pid.','.$id.','.$u_id.');');
            return json_encode(true);
    } 

    public  function getdist($id){
        $a=json_decode($id);
        $dist = DB::select("SELECT district_id, district_name
        FROM space_tech.tbl_district where space_tech.tbl_district.division_id in (".implode(",",$a).");");
        return json_encode($dist);
    } 
    public  function getteh($id){
        $a=json_decode($id);
        $teh = DB::select("SELECT tehsil_id, tehsil_name
        FROM space_tech.tbl_tehsil where space_tech.tbl_tehsil.district_id in (".implode(",",$a).");");
        return json_encode($teh);
    } 
    public  function search_load_data($data){
        $a=json_decode($data);
        if($a->Departments=='' && $a->Divisions=='' && $a->Districts=='' && $a->Tehsils==''){
           return $this->Load_DataPage();
        }

        $global_array=[];
        // print_r($data);
        // print_r(implode(",",$a->Departments));
        // exit();
       // echo $a->Divisions;
        //exit();
        if($a->Departments==''){
            $dp_id='null';
            
        }else{
        $dp_id=implode(",",$a->Departments);
        }
        if($a->Divisions==''){
            $div_id='null';
        }else{
        $div_id=implode(",",$a->Divisions);
        }
        if($a->Districts==''){
            $dist_id='null';
        }else{
        $dist_id=implode(",",$a->Districts);
        }
        if($a->Tehsils==''){
            $teh_id='null';
        }else{
        $teh_id=implode(",",$a->Tehsils);
        }
 
        $sql="select data_id from space_tech.tbl_data_upload 
        where data_id in(
        (select distinct data_id from space_tech.tbl_data_upload_departments where department_id in ($dp_id) LIMIT 1),
         
        (select distinct data_id from space_tech.tbl_data_upload_divisions where division_id in($div_id) LIMIT 1),
            
        (select distinct data_id from space_tech.tbl_data_upload_districts where district_id in($dist_id) LIMIT 1),
        
        (select distinct data_id from space_tech.tbl_data_upload_tehsils where tehsil_id in($teh_id) LIMIT 1)
        );";
    

         $dt=DB::select($sql);
        //  $global_array.push($rs);
        // //print_r($rs);
        // foreach($dt as $arr){
        //    print_r($arr->data_id);
        //    exit();
        // }
        
        $data= array();
        for($i=0; $i<sizeof($dt); $i++){
            $d_id=$dt[$i]->data_id;
            if (Auth::user()) {       
                $u_id=auth()->user()->id;
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
                // $data[$i]="test";
                $data[$i]=['dtup' => $dtup, 'divinames' => $divinames, 'distnames' => $distnames, 'tehnames' => $tehnames, 'depname' => $depname , 'logusrid' => $u_id, 'reqchk' => $reqchk];
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


        // $dt = json_encode($rs);
        // return view('admin.loadData',['tbl_duplod' => $rs]);
        // print_r($a->Departments);
        // if($a->Departments == 0 && $a->Divisions == 0 && $a->Districts == 0 && $a->Tehsils == 0){
        //     echo "load all data";
        // }
        // else{
        //     echo "load search data";
        // }
        // print_r($data);
        // print_r("$data.Departments");
        // exit();
        // $a=json_decode($data);
        // $teh = DB::select("SELECT tehsil_id, tehsil_name
        // FROM space_tech.tbl_tehsil where space_tech.tbl_tehsil.district_id in (".implode(",",$a).");");
        // return json_encode($teh);
    } 


    public  function updateaccesslevel($data){
        $d=json_decode($data);
        $level=$d->level;
        $d_id=$d->data_id;

        DB::update("UPDATE space_tech.tbl_data_upload
        SET privacy_level='$level' WHERE data_id=$d_id;");
        return json_encode(true);
    }
   
    public  function add_data(){
        $dep = DB::table("space_tech.tbl_department")->pluck("department_name", "department_id");
        $div = DB::table("space_tech.tbl_division")->pluck("division_name", "division_id");
        $type = DB::table("space_tech.tbl_data_types")->pluck("datatype_name", "datatype_id");
        return view('admin.addFileData', ['depts' => $dep, 'div' => $div, 'type' => $type]);
    } 
    public  function getfiletype($id){
        $a=json_decode($id);
        $dist = DB::select("SELECT datatype_extension
        FROM space_tech.tbl_data_types where space_tech.tbl_data_types.datatype_id=$a;");
        return json_encode($dist);
    } 

    public  function add_data_store(Request $request){
        // print_r($request->all());
        $q = DB::select("select max(data_id) from space_tech.tbl_data_upload;");
        $arr = json_decode(json_encode($q), true);
        $data_id=implode("",$arr[0])+1;

        $dtid=$request->DataType_Id;
        $u_id=auth()->user()->id;
        $q1 = DB::select("SELECT source_id
        FROM space_tech.users
        where id=$u_id;");
        $arr1 = json_decode(json_encode($q1), true);
        $source_id=implode("",$arr1[0]);
        $dname=$request->Data_Name;
        // file name & path 
        $fileName = time().'_'.$request->Data_URL->getClientOriginalName();  
        $filePath = $request->Data_URL->move(public_path('uploads'), $fileName);
        // echo $filePath;
        $furl=$filePath;
        $dstdate=$request->Data_CreationDate;
        $dcdate=$request->Data_CreationDate;
        $ddes=$request->Data_Description;
        $dcrs=$request->Data_CRS;
        $dup=$request->Data_Usage_Purpose;
        $disvector=$request->Data_IsVector;
        $dlvl=$request->DataLevel;
        $dplvl=$request->DataPrivacy;
        $data_resolution = $request->Data_Resolution;

        //------------tbl_data_upload insertions-----------
        if($dtid==5 || $dtid==1){
            DB::insert('INSERT INTO space_tech.tbl_data_upload(
            data_id, datatype_id, user_id, data_name, file_url, data_storage_date, data_creation_date, data_description, 
            data_crs, data_usage_purpose, data_isvector, data_level, privacy_level, source_id)
            VALUES ('.$data_id.',' .$dtid.',' .$u_id.',' ."'$dname'".',' ."'$furl'".',' ."'$dstdate'".',' ."'$dcdate'".',' ."'$ddes'".',' ."'$dcrs'".',' ."'$dup'".',' .$disvector.',' ."'$dlvl'".',' ."'$dplvl'".',' .$source_id.');');
        }

        if($dtid==4){
        $image_type = $request->ImageType;
        $image_description = $request->ImgDesc;
        // $tbl_dataupload->image_access_path = '/storage/' . $filePath;
        DB::insert('INSERT INTO space_tech.tbl_data_upload(
            data_id, datatype_id, user_id, data_name, file_url, data_storage_date, data_creation_date, data_description, 
            data_crs, data_usage_purpose, data_isvector, data_level, privacy_level, data_resolution, image_type, image_description, source_id)
            VALUES ('.$data_id.',' .$dtid.',' .$u_id.',' ."'$dname'".',' ."'$furl'".',' ."'$dstdate'".',' ."'$dcdate'".',' ."'$ddes'".',' ."'$dcrs'".',' ."'$dup'".',' .$disvector.',' ."'$dlvl'".',' ."'$dplvl'".',' ."'$data_resolution'".',' ."'$image_type'".',' ."'$image_description'".',' .$source_id.');');
        }
        
        if($dtid==6){
        $map_page_no_for_pdf = $request->map_page_no_for_pdf;
        DB::insert('INSERT INTO space_tech.tbl_data_upload(
            data_id, datatype_id, user_id, data_name, file_url, data_storage_date, data_creation_date, data_description, 
            data_crs, data_usage_purpose, data_isvector, data_level, privacy_level, data_resolution, map_page_no_for_pdf, source_id)
            VALUES ('.$data_id.',' .$dtid.',' .$u_id.',' ."'$dname'".',' ."'$furl'".',' ."'$dstdate'".',' ."'$dcdate'".',' ."'$ddes'".',' ."'$dcrs'".',' ."'$dup'".',' .$disvector.',' ."'$dlvl'".',' ."'$dplvl'".',' ."'$data_resolution'".',' ."'$map_page_no_for_pdf'".',' .$source_id.');');
        }

        // if($disvector==false){
        //     $data_resolution = $request->Data_Resolution;
        //     DB::insert('INSERT INTO space_tech.tbl_data_upload(
        //         data_id, datatype_id, user_id, data_name, file_url, data_storage_date, data_creation_date, data_description, 
        //         data_crs, data_usage_purpose, data_isvector, data_level, privacy_level, data_resolution)
        //         VALUES ('.$data_id.',' .$dtid.',' .$u_id.',' ."'$dname'".',' ."'$furl'".',' ."'$dstdate'".',' ."'$dcdate'".',' ."'$ddes'".',' ."'$dcrs'".',' ."'$dup'".',' .$disvector.',' ."'$dlvl'".',' ."'$dplvl'".',' ."'$data_resolution'".');');
        // }

        //------------tbl_data_upload_departments,divisions,districts,tehsils insertion-----------
        if($dlvl != "nolevel"){
            if($dlvl=="Province" || $dlvl=="Division" || $dlvl=="District" || $dlvl=="Tehsil"){
                $id=$request->Departments;
                $n=$request->DepartmentsText;
                $a = explode(",",$id);
                $b = explode(",",$n);
                // print_r($id);
                for ($i = 0; $i < count($a); $i++){
                    DB::insert('INSERT INTO space_tech.tbl_data_upload_departments(
                    data_id, department_id, department_name)
                    VALUES ( '.$data_id.',' .$a[$i].',' ."'$b[$i]'".');');
                    
                }
            }
            if($dlvl=="Division" || $dlvl=="District" || $dlvl=="Tehsil"){
                $id=$request->Divisions;
                $n=$request->DivisionsText;
                $a = explode(",",$id);
                $b = explode(",",$n);
                for ($i = 0; $i < count($a); $i++){
                    DB::insert('INSERT INTO space_tech.tbl_data_upload_divisions(
                    data_id, division_id, division_name)
                    VALUES ( '.$data_id.',' .$a[$i].',' ."'$b[$i]'".');');
                }
            }
            if($dlvl=="District" || $dlvl=="Tehsil"){
                $id=$request->Districts;
                $n=$request->DistrictsText;
                $a = explode(",",$id);
                $b = explode(",",$n);
                for ($i = 0; $i < count($a); $i++){
                        DB::insert('INSERT INTO space_tech.tbl_data_upload_districts(
                        data_id, district_id, district_name)
                        VALUES ( '.$data_id.',' .$a[$i].',' ."'$b[$i]'".');');
                }
            }
            if($dlvl=="Tehsil"){
                $id=$request->Tehsils;
                $n=$request->TehsilsText;
                $a = explode(",",$id);
                $b = explode(",",$n);
                for ($i = 0; $i < count($a); $i++){
                        DB::insert('INSERT INTO space_tech.tbl_data_upload_tehsils(
                        data_id, tehsil_id, tehsil_name)
                        VALUES ( '.$data_id.',' .$a[$i].',' ."'$b[$i]'".');');
                }
            }
        }
        

        return json_encode(true);
        // return back()->with(true);
        // return back()->with('success', 'Data has been Submitted successfuly.');
        // return redirect()->route('index');

        // ----------laravel default validation and store etc..----
          // $request->validate([
        //     'privacy_level' => 'required',
        //     'dtype' => 'required',
        //     'name' => 'required',
        //     'file' => 'required',
        //     'description' => 'required',
        //     'usage' => 'required',
        //     'crs' => 'required',
        // ]);

        // $fileName = time().'_'.$request->file->getClientOriginalName();
        // $filePath = $request->file('file')->storeAs('uploads', $fileName, 'public');

        // $tbl_dataupload = new DataUpload();
       
        // $tbl_dataupload->privacy_level = $request->privacy_level;
        // $tbl_dataupload->datatype_id = $request->dtype;
        // $tbl_dataupload->data_name = $request->name;
        // $tbl_dataupload->file_url = '/storage/' . $filePath;
        // $tbl_dataupload->data_description = $request->description;
        // $tbl_dataupload->data_usage_purpose = $request->usage;
        // $tbl_dataupload->data_crs = $request->crs;
        // $tbl_dataupload->save();
        // return back()->with('success', 'Data has been Submitted successfuly.');
        // // return redirect()->route('index');



        // ----------zip extract code----
        // $zip = new ZipArchive();
        // $zip->open('$filePath', ZipArchive::CREATE);
        // $zip->extractTo(public_path('uploads'));
        // $zip->close();

        // $zip = Zip::create('file.zip'); // create zip
        // $zip->add(public_path()); // add public path to the zip file

        // $zip = Zip::open('file.zip');
        // $shpurl = $zip->extract(public_path() . '/uncompressed');
        // print_r($request->all());
        // print_r($filePath);
        // print_r($shpurl);
        // exit();
        // ----------file name & path test----
        // $fileName = time().'.'.$request->Data_URL->extension();  
        // $filePath = $request->Data_URL->move(public_path('uploads'), $fileName);
        // $fileName = time().'_'.$request->Data_URL->getClientOriginalName();
        // $filePath = $request->file('file')->storeAs('uploads', $fileName, 'public');
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
        if($a->StorageDate == '' && $a->CreationDate == '' && $a->Type == '' && $a->Srcdpt == ''){
           
            $q = DB::select("SELECT
                            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
                            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
                            FROM space_tech.tbl_data_upload  as du
                            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
                            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
                            where user_id=$u_id and du.isapproved IS not NULL;");
            return json_encode($q);
            
        }
        elseif($type == 'null' && $src == 'null'){
            $q = DB::select("SELECT
            dt.datatype_name, data_id, data_name, data_storage_date, u.name,data_creation_date,
            data_description, data_crs, data_usage_purpose, data_isvector, data_resolution, isapproved     
            FROM space_tech.tbl_data_upload  as du
            INNER JOIN space_tech.tbl_data_types dt ON dt.datatype_id =  du.datatype_id
            INNER JOIN space_tech.users u ON u.source_id =  du.source_id
            where user_id=$u_id and du.isapproved IS not NULL
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
            where user_id=$u_id and du.isapproved IS not NULL
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
            where user_id=$u_id and du.isapproved IS not NULL
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
            where user_id=$u_id and du.isapproved IS not NULL
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
