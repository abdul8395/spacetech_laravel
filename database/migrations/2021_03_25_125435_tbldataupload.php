<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Tbldataupload extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Tbldataupload', function (Blueprint $table) {
            $table->id('data_id');
            $table->integer('datatype_id');
            $table->integer('user_id');
            $table->string('data_name');
            $table->string('file_url');
            $table->date('file_storage_date');
            $table->date('data_creation_date');
            $table->string('data_description');
            $table->string('data_crs');
            $table->string('data_usage_purpose');
            $table->boolean('data_isvector');
            $table->integer('source_id');
            $table->string('schema_name');
            $table->string('table_name');
            $table->string('data_url');     
            $table->string('shp_file_path');
            $table->string('data_level');
            $table->string('privacy_level');        
            $table->string('image_type');
            $table->string('image_description');
            $table->string('image_access_path');
            $table->string('map_page_no_for_pdf');
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
