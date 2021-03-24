<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/greeting', function () {
//     //return 'Hello World';
//     test::index();
// });
//Route::get('/abc', [test::class, 'index']);

// Route::get('/', function () {
//     return view('welcome_old');
// });



//................Home________Route..................
Route::get('/', [AdminController::class, 'home']);

//................Auth/Login________Route..................
Auth::routes();

//................SuperAdmin________Routes..................
Route::match(['get','post'], '/superadmin', [SuperAdminController::class, 'index'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/filetypes', [SuperAdminController::class, 'filetypes'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/pending_req', [SuperAdminController::class, 'pending_req'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/approval', [SuperAdminController::class, 'approval'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/req_log', [SuperAdminController::class, 'req_log'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/add_users', [SuperAdminController::class, 'add_users'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/change_pass', [SuperAdminController::class, 'change_pass'])->name('superadmin')->middleware('superadmin');
//................Admin________Routes..................
Route::match(['get','post'], '/admin', [AdminController::class, 'index'])->name('admin')->middleware('admin');
Route::match(['get','post'], '/add_data', [AdminController::class, 'add_data']);
Route::match(['get','post'], '/add_data_store', [AdminController::class, 'add_data_store']);
Route::match(['get','post'], '/approval_logs', [AdminController::class, 'approval_logs']);
Route::match(['get','post'], '/pending_req', [AdminController::class, 'pending_req']);
Route::match(['get','post'], '/req_log', [AdminController::class, 'req_log']);
Route::match(['get','post'], '/change_pass', [AdminController::class, 'change_pass']);
Route::match(['get','post'], '/user', [UserController::class, 'change_pass'])->name('user')->middleware('user');

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
