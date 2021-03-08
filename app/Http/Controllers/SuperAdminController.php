<?php

namespace App\Http\Controllers;

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
}
