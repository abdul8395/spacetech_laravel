<!DOCTYPE html>
<html>
  <head>
   <!-- Load Leaflet (not latest version due to dependencies) -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet-src.js"></script>
	
	
    <!-- Load Esri Leaflet from CDN -->
    <script src="https://unpkg.com/esri-leaflet@2.1.1/dist/esri-leaflet.js"
    integrity="sha512-ECQqaYZke9cSdqlFG08zSkudgrdF6I1d8ViSa7I3VIszJyVqw4ng1G8sehEXlumdMnFYfzY0tMgdQa4WCs9IUw=="
    crossorigin=""></script>

    <!-- Load Esri Leaflet locally, after cloning this repository -->
    <!--<script src="https://unpkg.com/esri-leaflet@2.1.1"></script>-->
	
	<!-- Leaflet Draw -->
<script src="js/draw/leaflet_draw.js"></script>
<link rel="stylesheet" href="js/draw/leaflet_draw.css">
<!--      <script src="js/draw/Leaflet.draw.js"></script>-->
<!--      <link rel="stylesheet" href="js/draw/leaflet.draw.css">-->

<script src="js/measurement/leaflet-measure.js"></script>
<link rel="stylesheet" href="js/measurement/leaflet-measure.css">

      <script src="js/ruler/leaflet-ruler.js"></script>
      <link rel="stylesheet" href="js/ruler/leaflet-ruler.css">

<script src="js/full_screen/Leaflet.fullscreen.min.js"></script>
 <link rel="stylesheet" href="js/full_screen/leaflet.fullscreen.css">

      <script src="js/bookmarks/Leaflet.Bookmarks.min.js"></script>
      <link rel="stylesheet" href="js/bookmarks/leaflet.bookmarks.min.css">
	
    <style>
      html, body, #map {
        margin:0; padding:0;  width : 100%; height : 100%;
      }
	   #info {
        display: block;
        position: relative;
        margin: 0px auto;
        width: 50%;
        padding: 10px;
        border: none;
        border-radius: 3px;
        font-size: 12px;
        text-align: center;
        color: #222;
        background: #fff;
    }
	 #info-pane {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 400;
		padding: 1em;
		background: white;
		text-align: right;
	}

  #form {
    display: none;
  }
    </style>
  </head>
  <body>
  <div id="btnDiv">  
  <input type='button' value='Show Coordinates' onclick='showLatLng();'/>
<!--  <input type='button' value='Show Edit Toolbar' onclick='showDrawControl();'/> -->
  <input type='button' value='Measure' onclick='showMeasureControl();'/>
      <input type='button' value='Ruler' onclick='showPolyLineMeasureControl();'/>
<!--  <input type='button' value='Bookmark' onclick='showBookmarkControl();'/>-->
  </div>
    <div id="map"></div>
	<div id='info-pane' class='leaflet-bar'>
	
		<form action='#' id='form'>
			<label for='name'>
				Name<br>
				<input id='name' type="text" value='' name='name'><br>
			</label>
			<label for='typee'>
				Transportation Plan Id<br>
				<!--<input id='type' type='text' value='' name='type' disabled='disabled'>-->
				<input id='type' type='text' value='' name='type' >
			</label>
		</form>
		
	</div>
	<div id='latlng_div' style='visibility:hidden;'>
		<pre id='info' ></pre>
		<pre id="eventoutput">...</pre>
	</div>

    <script>
	var map;
	// variable to track the layer being edited
  var currentlyEditing;
  var currentlyDeleting = false;
  var edit_tool=false;
  var drawControl;
  var measureTool=false;
  var measureControl;
  var bookmarksJson = [];
  var blnBookmark=false;
  var polyLineMeasureControl;
  var boolPolyLineMeasure=false;
      //var map = L.map('map').setView([45.528, -122.680], 13);
	  //var map = L.map('map').setView([34.33491570060008,75.66738179005004], 5);
	  map = L.map("map", {
		zoom: 6,
		center: [31.615965, 72.38554],
  // layers: [cartoLight],
		zoomControl: true,
		attributionControl: false
	// fullscreenControl: true,
	// measureControl: true,
	});
	L.esri.basemapLayer("Imagery").addTo(map);
     // L.esri.basemapLayer("Gray").addTo(map);

      L.esri.dynamicMapLayer({
			url: 'http://202.166.168.183:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer',
			opacity: 0.7
			}).addTo(map);

	// create a feature group for Leaflet Draw to hook into for delete functionality
  var drawnItems = L.featureGroup();
  map.addLayer(drawnItems);
  
  map.on('measurefinish', function (evt) {
			writeResults(evt);
		});

    var fullScreenControl = L.control.fullscreen({position:"topright"}).addTo(map);


  function showDrawControl(){
	if(edit_tool==false){
			  // create a new Leaflet Draw control
  drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems, // allow editing/deleting of features in this group
      edit: false // disable the edit tool (since we are doing editing ourselves)
    },
    draw: {
      circle: true, // disable circles
      marker: true, // disable polylines
      polyline: true, // disable polylines
      polygon: {
        allowIntersection: true, // polygons cannot intersect thenselves
        drawError: {
          color: 'red', // color the shape will turn when intersects
          message: '<strong>Oh snap!<strong> you can\'t draw that!' // message that will show when intersect
        }
      }
    }
  });

  // add our drawing controls to the map
  map.addControl(drawControl);
  edit_tool=true;
}
else{
	map.removeControl(drawControl);
	edit_tool=false;
}
}
function showLatLng(){
		var div_visiblity=document.getElementById('latlng_div').style.visibility;
		//alert(div_visiblity);
		if(div_visiblity=='hidden'){
			document.getElementById('latlng_div').style.visibility='visible';
			map.on('mousemove', function (e) {
			//alert(e.lngLat);
			document.getElementById('info').innerHTML ='<b>Lat: '+e.latlng.lat+' <br/>Lon: '+e.latlng.lng+'</b>';

			/* document.getElementById('info').innerHTML =
				// e.point is the x, y coordinates of the mousemove event relative
				// to the top-left corner of the map
				JSON.stringify(e.point) + '<br /> Ali' +
			// e.lngLat is the longitude, latitude geographical position of the event
			JSON.stringify(e.lngLat);*/
		});	
	}
	else{
		document.getElementById('latlng_div').style.visibility='hidden';
	}
		
}
function showMeasureControl(){
	if(measureTool==false){
		measureControl = L.control.measure();
		map.addControl(measureControl);
		measureTool=true;
	}
	else{
		map.removeControl(measureControl);
		measureTool=false;
	}
}
function showBookmarkControl(){


}

function showPolyLineMeasureControl(){
    if(boolPolyLineMeasure==false){
        polyLineMeasureControl=L.control.ruler();
        map.addControl(polyLineMeasureControl);
        boolPolyLineMeasure=true;
    }
    else{
        map.removeControl(polyLineMeasureControl);
        boolPolyLineMeasure=false;
    }
}
	function writeResults (results) {
			document.getElementById('eventoutput').innerHTML = JSON.stringify({
			area: results.area,
			areaDisplay: results.areaDisplay,
			lastCoord: results.lastCoord,
			length: results.length,
			lengthDisplay: results.lengthDisplay,
			pointCount: results.pointCount,
			points: results.points
			}, null, 2);
		}		
      //var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";

    /*  parks.bindPopup(function(e){
        return L.Util.template(popupTemplate, e.feature.properties)
      });*/
    </script>
  </body>
</html>