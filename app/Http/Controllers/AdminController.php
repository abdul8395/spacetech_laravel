<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;

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
        $request->validate([
            'privacy' => 'required',
            'type' => 'required',
            'name' => 'required',
            'file' => 'required',
            'des' => 'required',
            'usage' => 'required',
            'crs' => 'required',
            'yeardata' => 'required',
            'pagemap' => 'required',
        ]);

        $adddata = new Add_Data();
        $adddata->title = $request->title;
        $adddata->description = $request->description;
        $adddata->status = $request->status;
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
