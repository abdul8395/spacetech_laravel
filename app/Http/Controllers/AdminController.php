<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use App\Models\Add_data;
use App\Models\Form;
use App\Models\DataUpload;

class AdminController extends Controller
{
    public  function home(){
        return view('admin.index');
    } 

    public  function index(){
        return view('admin.index');
    } 

    public  function add_data(){
        return view('admin.addFileData');
    } 
    public  function add_data_store(Request $request){
    //    return DataUpload::where('data_name', 'Boundaries')->first();
        // return DB::table('tbl_data_upload')->order_by('data_id', 'desc')->first();

        $request->validate([
            'privacy_level' => 'required',
            'dtype' => 'required',
            'name' => 'required',
            'file' => 'required',
            'description' => 'required',
            'usage' => 'required',
            'crs' => 'required',
            
        ]);
        // return $request->all();
        $fileName = time().'_'.$request->file->getClientOriginalName();
        $filePath = $request->file('file')->storeAs('uploads', $fileName, 'public');

        $tbl_dataupload = new DataUpload();
       
        $tbl_dataupload->privacy_level = $request->privacy_level;
        $tbl_dataupload->datatype_id = $request->dtype;
        $tbl_dataupload->data_name = $request->name;
        $tbl_dataupload->file_url = '/storage/' . $filePath;
        $tbl_dataupload->data_description = $request->description;
        $tbl_dataupload->data_usage_purpose = $request->usage;
        $tbl_dataupload->data_crs = $request->crs;
        $tbl_dataupload->save();
        return back()->with('success', 'Data has been Submitted successfuly.');
        // // return redirect()->route('index');
    } 
    
    public  function approval_logs(){
        return view('admin.ApprovalHistory');
    } 
    public  function pending_req(){
        return view('admin.PendingRequests');
    } 
    public  function req_log(){
        return view('admin.RequestsLog');
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
