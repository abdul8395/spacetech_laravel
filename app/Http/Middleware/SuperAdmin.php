<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Auth;
class SuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
       
        if(!Auth::check()){
            return redirect()->route('login');
        }

        // dd($next($request));
        
        // role 1 = admin
        if(Auth::user()->role==1){
            return $next($request);
        }
        // role 2 = manager
        if(Auth::user()->role==2){
            return redirect()->route('admin');
        }
        // role 3 = user
        if(Auth::user()->role==3){
            return redirect()->route('user');
        }


    }
}
