<?php

namespace App\Http\Controllers;
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
        $request->validate([
            'name' => ['required','string'],
            'mobileno' => ['required','max:14'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:3', 'confirmed']
        ]);
        // return $request->all();
        

        $utb = new User();
        $utb->name = $request->name;
        $utb->mobile_no = $request->mobileno;
        $utb->email = $request->email;
        $utb->password =Hash::make($request->password);
        $utb->role = 2;
        $utb->save();
        return back()->with('success', 'Admin has been Created succesfuly.');
        // return redirect()->route('/');
    } 
}
