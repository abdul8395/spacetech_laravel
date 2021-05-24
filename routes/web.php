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
Route::get('/', [AdminController::class, 'index']);
Route::get('/home', [AdminController::class, 'index'])->middleware('revalidate');
Route::get('/district/{id}', [AdminController::class, 'getdist']);
Route::get('/tehsil/{id}', [AdminController::class, 'getteh']);
Route::get('/loaddata', [AdminController::class, 'Load_DataPage']);
Route::get('/deatilbtn/{data}', [AdminController::class, 'detailbtn']);
Route::get('/searchdata/{data}', [AdminController::class, 'search_load_data']);



// Route::get('/Load_Users/{data}', [SuperAdminController::class, 'Load_Users']);
// Route::get('/viewdes/{id}', [AdminController::class, 'viewdes']);



// Route::post('loadatapage', [AdminController::class, 'Load_DataPage'])->name('Load_data.Page');


Route::match(['get','post'], '/testform', [AdminController::class, 'testform']);
Route::match(['get','post'], '/storetestform', [AdminController::class, 'storetestform']);

//................Auth/Login________Route..................
Auth::routes();

//................SuperAdmin________Routes...................
Route::match(['get','post'], '/superadmin', [AdminController::class, 'index'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/filetypes', [SuperAdminController::class, 'filetypes'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/Load_ext', [SuperAdminController::class, 'Load_ext'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/chkext/{data}', [SuperAdminController::class, 'chkext'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/store_ext/{data}', [SuperAdminController::class, 'store_ext'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/pending_req', [SuperAdminController::class, 'pending_req'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/approval', [SuperAdminController::class, 'approval'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/load_approval/{data}', [SuperAdminController::class, 'load_approval'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/req_log', [SuperAdminController::class, 'req_log'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/change_pass', [SuperAdminController::class, 'changepass'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/store_pass', [SuperAdminController::class, 'storepass'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/admins', [SuperAdminController::class, 'admins'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/Load_Users/{data}', [SuperAdminController::class, 'Load_Users'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/add_admin', [SuperAdminController::class, 'add_admin'])->name('superadmin')->middleware('superadmin');
Route::match(['get','post'], '/superadmin/storeadmin', [SuperAdminController::class, 'storeadmin'])->name('superadmin')->middleware('superadmin');


//................Admin________Routes..................
Route::match(['get','post'], '/admin', [AdminController::class, 'index'])->name('admin')->middleware('revalidate','admin');
Route::match(['get','post'], '/add_data', [AdminController::class, 'add_data'])->middleware('revalidate','admin');
Route::match(['get','post'], '/getfiletype/{id}', [AdminController::class, 'getfiletype'])->middleware('admin');
Route::match(['get','post'], '/add_data_store', [AdminController::class, 'add_data_store'])->middleware('admin');
Route::match(['get','post'], '/approval_logs', [AdminController::class, 'approval_logs'])->middleware('admin');
Route::match(['get','post'], '//approval_loaddata/{data}', [AdminController::class, 'load_approval_data'])->middleware('admin');
Route::match(['get','post'], '/viewdes/{id}', [AdminController::class, 'viewdes'])->middleware('admin');
Route::match(['get','post'], '/pending_req', [AdminController::class, 'pending_req'])->middleware('admin');
Route::match(['get','post'], '/req_log', [AdminController::class, 'req_log'])->middleware('admin');
Route::match(['get','post'], '/change_pass', [AdminController::class, 'changepass'])->middleware('admin');
Route::match(['get','post'], '/store_pass', [AdminController::class, 'storepass'])->name('store_pass')->middleware('admin');
Route::match(['get','post'], '/user', [UserController::class, 'index'])->name('user')->middleware('user')->middleware('admin');




// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
