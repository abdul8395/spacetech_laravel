<?php

 $buuf_geom = '';
 $response= array();

if(isset($_GET["geom"])){
    $buuf_geom =$_GET["geom"];
};

$conn = new PDO('pgsql:host=172.20.82.138;dbname=db_iris_portal','postgres','irisdiamondx');

function gen_geojson($rs){
    $geojson = array(
        'type'      => 'FeatureCollection',
        'features'  => array()
    );

    while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
        $properties = $row;
        # Remove geojson and geometry fields from properties
        unset($properties['geojson']);
        unset($properties['geom']);
        $feature = array(
            'type' => 'Feature',
            'geometry' => json_decode($row['geojson'], true),
            'properties' => $properties
        );
        # Add feature arrays to feature collection array
        array_push($geojson['features'], $feature);
    }

    return $geojson;

}


function get_schools($conn,$geom){
    $res = array();
    $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('".$geom."'),4326) as geom)
        select a.gid,st_asgeojson(a.geom) AS geojson, count(*) over() as count FROM tbl_school a,foo 
        where st_intersects(a.geom,foo.geom) ";

    $rs = $conn->query($sql);
    if (!$rs) {
        echo 'An SQL error occured.\n';
        exit;
    }
    $row = $rs->fetch(PDO::FETCH_ASSOC);

    $count['count'] = $row['count'];
    $name['name'] = 'School';

    array_push($res,$count);
    array_push($res,$name);
    array_push($res,gen_geojson($rs));

    return $res;

}




function get_industry($conn,$geom){
    $res = array();
    $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('".$geom."'),4326) as geom)
        select a.gid,st_asgeojson(a.geom) AS geojson, count(*) over() as count FROM tbl_industry a,foo 
        where st_intersects(a.geom,foo.geom) ";

    $rs = $conn->query($sql);
    if (!$rs) {
        echo 'An SQL error occured.\n';
        exit;
    }
    $row = $rs->fetch(PDO::FETCH_ASSOC);

    $count['count'] = $row['count'];
    $name['name'] = 'Industry';

    array_push($res,$count);
    array_push($res,$name);
    array_push($res,gen_geojson($rs));

    return $res;

}



function get_roads($conn,$geom){
    $res = array();
    $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('".$geom."'),4326) as geom)
        select a.gid,st_asgeojson(a.geom) AS geojson, count(*) over() as count FROM tbl_road a,foo 
        where road_class = 'Primary Road' and st_intersects(a.geom,foo.geom) ";

    $rs = $conn->query($sql);
    if (!$rs) {
        echo 'An SQL error occured.\n';
        exit;
    }
    $row = $rs->fetch(PDO::FETCH_ASSOC);

    $count['count'] = $row['count'];
    $name['name'] = 'Roads';

    array_push($res,$count);
    array_push($res,$name);
    array_push($res,gen_geojson($rs));

    return $res;

}

function get_health($conn,$geom){
    $res = array();
    $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('".$geom."'),4326) as geom)
        select a.gid,st_asgeojson(a.geom) AS geojson, count(*) over() as count FROM tbl_health a,foo 
        where st_intersects(a.geom,foo.geom) ";

    $rs = $conn->query($sql);
    if (!$rs) {
        echo 'An SQL error occured.\n';
        exit;
    }
    $row = $rs->fetch(PDO::FETCH_ASSOC);

    $count['count'] = $row['count'];
    $name['name'] = 'Health';

    array_push($res,$count);
    array_push($res,$name);
    array_push($res,gen_geojson($rs));

    return $res;

}

function get_rail($conn,$geom){
    $res = array();
    $sql = "with foo as (select st_setsrid(ST_GeomFromGeoJSON ('".$geom."'),4326) as geom)
        select a.gid,st_asgeojson(a.geom) AS geojson, count(*) over() as count FROM tbl_railway_station_location a,foo 
        where st_intersects(a.geom,foo.geom) ";

    $rs = $conn->query($sql);
    if (!$rs) {
        echo 'An SQL error occured.\n';
        exit;
    }
    $row = $rs->fetch(PDO::FETCH_ASSOC);

    $count['count'] = $row['count'];
    $name['name'] = 'Railways';

    array_push($res,$count);
    array_push($res,$name);
    array_push($res,gen_geojson($rs));

    return $res;

}


function get_builtup($conn,$geom){
    $res = array();
    $sql = "with foo as (select st_transform(st_setsrid(ST_GeomFromGeoJSON ('".$geom."'),4326),32643) as geom)
        select a.gid,st_asgeojson(a.geom) AS geojson, st_area(st_intersection(foo.geom,a.geom)) as count FROM tbl_builtup_2017 a,foo 
        where st_intersects(a.geom,foo.geom)";

    $rs = $conn->query($sql);
    if (!$rs) {
        echo 'An SQL error occured.\n';
        exit;
    }
    $row = $rs->fetch(PDO::FETCH_ASSOC);

    $count['count'] = $row['count'];
    $name['name'] = 'Builtup';

    array_push($res,$count);
    array_push($res,$name);
    array_push($res,gen_geojson($rs));

    return $res;

}



$schools_geojson = get_schools($conn,$buuf_geom);
$industry_geojson = get_industry($conn,$buuf_geom);
$roads_geojson = get_roads($conn,$buuf_geom);
$health_geojson = get_health($conn,$buuf_geom);
$rail_geojson = get_rail($conn,$buuf_geom);
$get_builtup = get_builtup($conn,$buuf_geom);

array_push($response,$schools_geojson);
array_push($response,$industry_geojson);
array_push($response,$roads_geojson );
array_push($response,$health_geojson );
array_push($response,$rail_geojson );
array_push($response,$get_builtup );



header('Content-type: application/json');
echo json_encode($response, JSON_NUMERIC_CHECK);
$conn = NULL;
?>