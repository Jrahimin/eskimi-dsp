<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', function (\Illuminate\Http\Request $request) {
    /*\DB::connection()->enableQueryLog();
    if($request->new){
        \Illuminate\Support\Facades\Cache::forget('campaigns');
    }
    $data = \Illuminate\Support\Facades\Cache::remember('campaigns', 10, function (){
        return \App\Models\Campaign::all();
    });
    dd(\DB::getQueryLog());*/

    return view('welcome');
});
