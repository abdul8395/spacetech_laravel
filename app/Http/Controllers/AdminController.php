<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use App\Models\Add_data;
use App\Models\Form;

class AdminController extends Controller
{

    public function createUserForm(Request $request) {
        return view('form');
      }

      public function UserForm(Request $request) {

        // Form validation
        $this->validate($request, [
            'name' => 'required',
            'message' => 'required'
         ]);
  
        //  Store data in database
        Form::create($request->all());
  
        //
        return back()->with('success', 'Your form has been submitted.');
    }


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
        // dd($request);
        $request->validate([
            'name' => 'required',
            // 'file' => 'required',
            // 'des' => 'required',
            // 'usage' => 'required',
            // 'crs' => 'required',
            // 'yeardata' => 'required',
            // 'pagemap' => 'required',
            // 'privacy' => 'required',
            // 'type' => 'required',
        ]);

        $adddata = new Add_data();
        $adddata->data_name = $request->name;
        // $adddata->description = $request->description;
        // $adddata->status = $request->status;
        $adddata->save();
        // return redirect()->route('index');
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
    
}
