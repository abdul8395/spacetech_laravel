<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;


class SuperAdminController extends Controller
{
    public  function index(){
        return view('admin.index');
    } 
    public  function filetypes(){
        return view('superadmin.FileTypes');
    } 
    public  function pending_req(){
        return view('superadmin.PendingRequests');
    } 
    public  function approval(){
        return view('superadmin.FileApproval');
    } 
    public  function req_log(){
        return view('superadmin.RequestsLog');
    } 
    public  function add_users(){
        return view('superadmin.Register');
    } 
    public  function storeadmin(Request $request){
        dd($request);
        // $request->validate([
        //     'name' => 'required',
        //     'mno' => 'required',
        //     'email' => 'required'
        // ]);

        // $utb = new User();
        // $utb->name = $request->name;
        // $utb->mobile_no = $request->mno;
        // $utb->email = $request->email;
        // $utb->password = $request->password;
        // $utb->role = 2;
        // $utb->save();
        // return redirect()->route('/');
    } 
}
