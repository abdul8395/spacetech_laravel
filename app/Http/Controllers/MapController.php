<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
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
}
