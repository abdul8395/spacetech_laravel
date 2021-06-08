<?php

 $indicatorId = '';
 $geography = '';
 $sourceId = '';
 $year = '';
 $tbl='';
 $subtbl='';
if(isset($_GET["indicatorId"])){
 $indicatorId=$_GET["indicatorId"]; 
};

if(isset($_GET["geography"])){
  $geography=$_GET["geography"];
  
  if($geography=='Division'){
  $tbl='tbl_division';
  $subtbl='select portal_div_id from prep.division where division_id::integer=';
  }else if($geography=='District'){
  $tbl='tbl_district';
  $subtbl='select portal_district_id from prep.district where district_id::integer=';
  };
  
  
};

if(isset($_GET["sourceId"])){
	$sourceId=urlencode($_GET["sourceId"]);
};

if(isset($_GET["year"])){
	$year=$_GET["year"]; 
};



 
 

 $res =file_get_contents('http://172.20.82.51/api/GeoPortal/LoadData?indicatorId='.$indicatorId.'&geography='.$geography.'&sourceId='.$sourceId.'&year='.$year);
 $data = json_decode($res)->Data;

$conn = new PDO('pgsql:host=172.20.82.138;dbname=db_iris_portal','postgres','irisdiamondx');
# Build SQL SELECT statement and return the geometry as a GeoJSON element

# Build GeoJSON feature collection array
$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
);

foreach ($data as $value) {
	$sql = 'SELECT *, public.ST_AsGeoJSON(geom) AS geojson FROM '.$tbl.' where gid in ('.$subtbl.$value->GeographyId.')';
	$rs = $conn->query($sql);
	if (!$rs) {
		echo 'An SQL error occured.\n';
		exit;
	}
	
	# Loop through rows to build feature arrays
	while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
		$properties = $row;
		# Remove geojson and geometry fields from properties
		unset($properties['geojson']);
		unset($properties['geom']);
		$feature = array(
			 'type' => 'Feature',
			 'geometry' => json_decode($row['geojson'], true),
			 'properties' => $value
		);
		# Add feature arrays to feature collection array
		array_push($geojson['features'], $feature);
	}
}


header('Content-type: application/json');
echo json_encode($geojson, JSON_NUMERIC_CHECK);
$conn = NULL;
?>