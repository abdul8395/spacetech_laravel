<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include("../connection.php");
class Pss extends connection
{
    function __construct()
    {
        $this->connectionDB();

    }

    public function loadData()
    {

       $geom1=$_REQUEST['geom'];

        //$query = "SELECT school_gen, COUNT(*) AS total_schools,SUM(teachers) AS total_teachers, SUM (enrolment) AS student_enroll FROM education.schools_data WHERE ST_Within(geom,  st_geomfromtext(st_astext(ST_GeomFromGeoJSON('$geom1')),4326))  AND (sector = 'Public') GROUP BY GROUPING SETS (school_gen, ());";
          $query="SELECT school_name_x, school_district, school_tehsil, school_level_x, school_type_x, school_name_y, permanent_address,
                    uc_name, uc_no, na_no, pp_no, gender_studying, school_level_y, 
                    school_type_y,total_rooms, classes, 
                    teachers_with_furniture, students_with_furniture,
                    enrollment, teachers, nonteachers
                    FROM education.schools_data_with_locations WHERE ST_Within(geom,  st_geomfromtext(st_astext(ST_GeomFromGeoJSON('$geom1')),4326))";
        //echo $query;
        $result = pg_query($query);

        $val = pg_fetch_all($result);


        $sql = "SELECT sum(population) as population,sum(a3_12_female) AS girls, sum(a3_12_male) AS boys FROM education.tbl_pop_block WHERE ST_Within(geom, st_geomfromtext(st_astext(ST_GeomFromGeoJSON('$geom1')),4326)) ;";
        //echo $sql;
        $res = pg_query($sql);
        $val1 = pg_fetch_all($res);

        $sql1="select count(*) as total_schools,sum(enrollment) as school_going,sum(students_with_furniture) as student,sum(teachers_with_furniture) as teacher,sum(total_rooms) as room FROM education.schools_data_with_locations WHERE ST_Within(geom, st_geomfromtext(st_astext(ST_GeomFromGeoJSON('$geom1')),4326))";
        $res1 = pg_query($sql1);
        $val2 = pg_fetch_all($res1);

        $sql2 = "with foo as (select ST_Transform(st_centroid(st_setsrid(ST_GeomFromGeoJSON ('$geom1'),4326)),32643)as geom)
        select * from environment.tbl_dss a,foo 
        where st_intersects(a.geom,foo.geom) ";
        $res2 = pg_query($sql2);
        $val3 = pg_fetch_all($res2);

        $sql3="select * from  education.tbl_private_schools_with_locations where st_intersects(geom, st_geomfromtext(st_astext(ST_GeomFromGeoJSON('$geom1')),4326))";
        $res3 = pg_query($sql3);
        $val4 = pg_fetch_all($res3);

        $sql4="select count(*) as total_schools,sum(\"Enrollment\") as students,sum(\"Teaching_Staff\") as teacher from education.tbl_private_schools_with_locations
 where st_intersects(geom, st_geomfromtext(st_astext(ST_GeomFromGeoJSON('$geom1')),4326))";
        $res4 = pg_query($sql4);
        $val5 = pg_fetch_all($res4);

        $array_results = array();
        $array_results["schools_data"] = $val;
        $array_results["private_schools"] = $val4;

        $array_results["population_data"] = $val1;
        $array_results["stats"] = $val2;
        $array_results["private_stats"] = $val5;
        $array_results["dimensions"] = $val3;


        //print_r($array_results);



        $this->closeConnection();
        return json_encode($array_results);
    }
}

$json = new Pss();
//$json->closeConnection();
echo $json->loadData();

?>