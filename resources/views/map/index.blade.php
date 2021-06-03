<?php

?>
<!doctype html>
<html lang="en" ng-app="geoportal">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>space tech</title>
    <link rel="stylesheet" href="bower_components/angular-material/angular-material.css"/>
<!--    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"/>-->
    <link rel="stylesheet" href="bower_components/bootstrap-latest/4.5.0/dist/css/bootstrap.min.css"/>

    <link rel="stylesheet" href="bower_components/angular-ivh-treeview/dist/ivh-treeview.css"/>
    <link rel="stylesheet" href="bower_components/angular-ivh-treeview/dist/ivh-treeview-theme-basic.css"/>
    <link href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.7/styles/default.min.css" rel="stylesheet">


    <link rel="stylesheet" href="css/style.css"/>
    <link rel="stylesheet" href="css/navbar.css"/>
    <link rel="stylesheet" href="css/bootstrap-treeview.min.css"/>
    <!--    <link rel="stylesheet" href="css/fontawesome/css/font-awesome.css"/> -->

    <link rel="stylesheet" href="css/prettify.css"/>

    <link rel="stylesheet" href="css/bootstrap-combined.min.css"/>
    <!--<script src="https://maps.googleapis.com/maps/api/js" async defer></script>-->
 <!--   <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDe3KCv3RAAvrSU9oW2atvZ0aW5C4v0mYw=places"></script>-->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"/>
<!--    <link href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">-->




    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"/>

    <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
    <script src="https://unpkg.com/esri-leaflet@2.1.1/dist/esri-leaflet.js"></script>


    <link rel="stylesheet" type="text/css" href="lib/leaflet.toolbar.css"/>
    <script type="text/javascript" src="lib/leaflet.toolbar.js"></script>

    <link rel="stylesheet" href="bower_components/ruler/leaflet-ruler.css">
    <script src="bower_components/ruler/leaflet-ruler.js"></script>

    <script src="bower_components/full_screen/Leaflet.fullscreen.min.js"></script>
    <link rel="stylesheet" href="bower_components/full_screen/leaflet.fullscreen.css">

    <!--<link rel="stylesheet" href="bower_components/measurement/leaflet-measure.css">-->
    <!--<script src="bower_components/measurement/leaflet-measure.js"></script>-->
    <script src="bower_components/measurement/L.MeasuringTool.js"></script>
   <!--<script src="bower_components/Leaflet.GoogleMutant.js"></script>-->


    <link rel="stylesheet" href="bower_components/L.Control.ZoomDisplay.css"/>
    <script type="text/javascript" src="bower_components/L.Control.ZoomDisplay.js"></script>

    <script type="text/javascript" src="bower_components/leaflet.latlng-graticule.js"></script>

    <link rel="stylesheet" href="bower_components/coordinates/leaflet.mousecoordinate.css"/>
    <script type="text/javascript" src="bower_components/coordinates/leaflet.mousecoordinate.min.js"></script>

    <link rel="stylesheet" href="bower_components/atribution/leaflet-control-condended-attribution.css"/>
    <script type="text/javascript" src="bower_components/atribution/leaflet-control-condended-attribution.js"></script>

    <link rel="stylesheet" href="bower_components/locate/L.Control.Locate.css"/>
    <script type="text/javascript" src="bower_components/locate/L.Control.Locate.min.js"></script>


    <!--style module-->
    <link type="text/css" href="libraries/modules/style/css/Leaflet.StyleEditor.min.css" rel="stylesheet">
    <script src="libraries/modules/style/js/Leaflet.StyleEditor.min.js"></script>


    <!--<script src="libraries/modules/mbtiles_vector/Leaflet.TileLayer.MBTiles.js"></script>-->
    <script type="text/javascript" src="script/alldata.js"></script>

    <!--geojson vt modules-->
    <script src="libraries/modules/vector_grid/Leaflet.VectorGrid.js"></script>
    <script src="libraries/modules/vector_grid/zlib.js"></script>
    <!--<script src="https://unpkg.com/leaflet.vectorgrid@latest/dist/Leaflet.VectorGrid.bundled.js"></script>-->

    <!--shapefile modules-->
    <script src="libraries/modules/shapefile/shp.js"></script>
    <script src="libraries/modules/shapefile/leaflet.shpfile.js"></script>


    <!--kml module-->
    <script src="libraries/modules/kml/kml.js"></script>

  

    <link rel="stylesheet" href="bower_components/draw/leaflet.draw.css"/>
    <script src="bower_components/draw/leaflet.draw-custom.js"></script>

    <!--<link rel="stylesheet" href="bower_components/styleeditor/css/Leaflet.StyleEditor.min.css"/>-->
    <!--<script src="bower_components/styleeditor/javascript/Leaflet.StyleEditor.min.js"></script>-->

    <link rel="stylesheet" href="libraries"/>
    <!--<script src="bower_components/styleeditor/javascript/Leaflet.StyleEditor.min.js"></script>-->

    <link type="text/css" href="libraries/modules/basemaps/control.layers.minimap.css" rel="stylesheet">
    <script src="libraries/modules/basemaps/leaflet-providers.js"></script>
    <script src="libraries/modules/basemaps/L.Control.Layers.Minimap.js"></script>
    <script src="libraries/modules/basemaps/highlight.pack.js"></script>
    <script src="libraries/modules/basemaps/shared.js"></script>
    <script src="libraries/modules/basemaps/preview.js"></script>

    <script type="text/javascript" src="libraries/modules/fgdb/fgdb.js"></script>

    <script src="libraries/modules/csv/leaflet.geocsv-src.js"></script>
    <script type="text/javascript" src="libraries/StaticLayerSwitcher.js"></script>
    <link rel="stylesheet" type="text/css" href="bower_components/leaflet-openweathermap/leaflet-openweathermap.css"/>
    <script type="text/javascript" src="bower_components/leaflet-openweathermap/leaflet-openweathermap.js"></script>
    <script type="text/javascript" src="bower_components/leaflet-fullHash/leaflet-fullHash.js"></script>
    <script type="text/javascript" src="libraries/georaster-layer-for-leaflet.browserify.min.js"></script>
    <script type="text/javascript" src="libraries/georaster.browserify.js"></script>
    <script type="text/javascript" src="libraries/turf.min.js"></script>


    <link rel="stylesheet" type="text/css"
          href="bower_components/leaflet-google-places/src/css/leaflet-gplaces-autocomplete.css"/>
    <script type="text/javascript"
            src="bower_components/leaflet-google-places/src/js/leaflet-gplaces-autocomplete.js"></script>

    <link rel="stylesheet" type="text/css" href="bower_components/leaflet-measure/leaflet-measure.css"/>
    <script type="text/javascript" src="bower_components/leaflet-measure/leaflet-measure.js"></script>

    <link rel="stylesheet" type="text/css" href="bower_components/Leaflet.Bookmarks/dist/leaflet.bookmarks.css"/>
    <script type="text/javascript" src="bower_components/Leaflet.Bookmarks/dist/Leaflet.Bookmarks.js"></script>
    <script type="text/javascript" src="libraries/coropleth/choropleth.js"></script>
    <link rel="stylesheet" type="text/css" href="bower_components/Leaflet.Dialog/Leaflet.Dialog.css"/>



    <script type="text/javascript" src="bower_components/Leaflet.Dialog/Leaflet.Dialog.js"></script>
    <script type="text/javascript" src="bower_components/html2canvas/dist/html2canvas.js"></script>
    <script>var environment_mitigation1 = environment_mitigation;</script>


  

    <link rel="stylesheet" type="text/css" href="lib/leaflet.distortableimage.css"/>
    <script type="text/javascript" src="lib/leaflet.distortableimage.js"></script>

  

  

    <script>
        var loged_in_username = 'admin';

        // alert(loged_in_username);
    </script>
    <style >

        g[class^='raphael-group-'][class$='-creditgroup'] {
            display: none !important;
        }
		
		#loader{
            position: fixed;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            z-index: 999999;
            background: url('images/ajaxloader.gif')
            50% 50% no-repeat rgb(249,249,249);
            display: none;
        }
    </style>
</head>
<body ng-cloak >
<div id="loader"></div>
<!--Side navbar-->
<div ng-controller="customSidenavController" layout="column" style="min-height: 500px;" ng-cloak>

    <md-sidenav class="md-sidenav-left left" md-component-id="left" md-disable-backdrop="" md-whiteframe="4">
        <div class="menu"></div>
        <div id="divUniqueButton2" class="menu-icon" style="border-radius: 3px;">
            <div class="hamburger hamburger--stand" type="button" ng-click="toggleLeft2()" >
              <span class="hamburger-box">
                <span class="hamburger-inner"></span>
              </span>
            </div>
        </div>
        <div class="sidebar_content" style="height: 100%;overflow-x: hidden; padding: 10px;">
            <header class="bs-canvas-header p-3">
                <div class="row">
                    <div class="col-md-12 mb-3 web-title">
                        <img src="images/logo.png" alt="uu" width="400" height="200">
                    </div>
                </div>
            </header>

            <div class="accordian_content">
                <toc-template></toc-template>
                
            </div>
        </div>
    </md-sidenav>

    <div id="divUniqueButton" style="position: absolute; z-index: 99999;">
        <md-button class="uniqueButton" ng-click="toggleLeft()" style="width: 55px;height: 45px;background: #242730; color: white;">
            <span style="font-size: 35px;" class="fa fa-bars"></span>
        </md-button>
    </div>

    <div flex layout="row">
        <div flex="100" id="rightbox" layout="column" style="height: 100vh;" >
            <div flex="80" id="map" style="z-index:50;width: 100%; height: 100%;">
                <div id='latlng_div' style='visibility:hidden; position: absolute;top:85%;right: 10px;z-index: 1000;background: white;padding: 1em;'>
                    <pre id='info' style="z-index: 1000"></pre>
                </div>
                <div style="z-index:800;position: relative;display: none;" class="loader"></div>
            </div>
        </div>
    </div>
</div>
<!--Side navbar END-->


<script src="bower_components/jquery.js"></script>
<!--<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>-->
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="bower_components/bootstrap-latest/4.5.0/dist/js/bootstrap.min.js"></script>
<script src="bower_components/bootstrap-treeview.js"></script>


<!--<script type="text/javascript" src="bower_components/angular/angular.min.js"></script>-->
<script type="text/javascript" src="bower_components/angular/angular1.5.min.js"></script>
<script type="text/javascript" src="bower_components/angular-material/angular-material.min.js"></script>
<script type="text/javascript" src="bower_components/angular-aria/angular-aria.min.js"></script>
<script type="text/javascript" src="bower_components/angular-animate/angular-animate1.5.js"></script>
<script type="text/javascript" src="bower_components/angular-messages/angular-messages.min.js"></script>
<script type="text/javascript" src="bower_components/angular-ivh-treeview/dist/ivh-treeview.js"></script>
<script type="text/javascript" src="script/main.js"></script>

<script type="text/javascript" src="script/controllers/mytoolbar.controller.js"></script>
<script type="text/javascript" src="script/controllers/toc.controller.js"></script>

<script type="text/javascript" src="script/controllers/sideNavController.js"></script>
<script type="text/javascript" src="script/controllers/right.controller.js"></script>
<script type="text/javascript" src="script/controllers/water.controller.js"></script>
<script type="text/javascript" src="script/controllers/connectivity.controller.js"></script>
<script type="text/javascript" src="script/controllers/environment.controller.js"></script>
<script type="text/javascript" src="script/controllers/education.controller.js"></script>
<script type="text/javascript" src="script/controllers/agriculture.controller.js"></script>


<!--<script type="text/javascript" src="bower_components/bootstrap-contextmenu.js"></script>-->
<script type="text/javascript" src="bower_components/prettify.js"></script>

<script src="https://unpkg.com/esri-leaflet-gp"></script>
<link rel="stylesheet" type="text/css" href="bower_components/leaflet-routing-machine/dist/leaflet-routing-machine.css"/>
<script type="text/javascript" src="bower_components/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
<script type="text/javascript" src="bower_components/leaflet-routing-machine/examples/Control.Geocoder.js"></script>
<script type="text/javascript" src="libraries/printer/bundle.js"></script>

<script src="libraries/typeahead.min.js"></script>

<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>

<link rel="stylesheet" href="//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">
<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>



<link rel="stylesheet" href="libraries/images_slider/css-view/lightbox.css" type="text/css"/>
<script src="libraries/images_slider/js-view/lightbox-2.6.min.js"></script>
<script src="libraries/images_slider/js-view/jQueryRotate.js"></script>

<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
<script type="text/javascript" src="libraries/html2canvas.js"></script>
<script type="text/javascript" src="libraries/canvas2image.js"></script>

<script type="text/javascript" src="libraries/gauge.min.js"></script>

<!--<script type="text/javascript" src="https://cdn.fusioncharts.com/fusioncharts/latest/fusioncharts.js"></script>-->
<!--<script type="text/javascript" src="https://cdn.fusioncharts.com/fusionchartys/latest/themes/fusioncharts.theme.fusion.js"></script>-->
<script type="text/javascript" src="libraries/js/fusioncharts.js"></script>
<!--<script type="text/javascript" src="libraries/js/fusioncharts.theme.fusion.js"></script>-->


<!--<link rel="stylesheet" href="bower_components/Leaflet.label/dist/leaflet.label.css"/>-->
<!--<script type="text/javascript" src="bower_components/Leaflet.label/dist/leaflet.label.js"></script>-->

<!--<script src="https://unpkg.com/leaflet-routing-machine@3.2.5"></script>-->
<!--<script src="https://unpkg.com/leaflet-control-geocoder@1.5.4"></script>-->
<!--<script type="text/javascript" src="bower_components/lrm-esri-master/dist/lrm-esri.js"></script>-->


<!--<script type="text/javascript" src="libraries/jquery-sortable.js"></script>-->
<script>
    <?php  $result = (isset($_REQUEST['job_id'])) ? $_REQUEST['job_id'] : "false";?>

    var myJobs = "<?php echo $result;?>";
    // alert(myJobs);


</script>


<div id="TempDataDiv"></div>

</body>
</html>

<script>
	 
    $(document).ready(function () {
        setTimeout(function () {
            var myTypeahead = $('#indicator').typeahead({
                name: 'indicator_name',
                remote: 'services/indicator.php?indicator=%QUERY',
                limit: 6
            });

            $(".tt-dropdown-menu").removeAttr('style');

            myTypeahead.on('typeahead:selected', function (evt, data) {
                angular.element(document.getElementById("toc")).scope().selectIndicator();
            });

        }, 3000);




    });




    //    $('#context').contextmenu({
    //        target: '#context-menu'
    ////        onItem: function (context, e) {
    ////            alert($(e.target).text());
    ////        }
    //    });

    var value_img = 0;

    function rotate_img() {
        value_img += 90;
        $(".lb-outerContainer").rotate({animateTo: value_img});
    }
       
		
        var uiden="<?php echo $_GET['user_id'];?>";
        var app_user_id
		$.ajax({ 
            url: "services/uid_enc.php?encid=" +uiden,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
				console.log(response)
				for(var i=0;i<response.length;i++){
					app_user_id = response[0].user_id;
                    // alert(app_user_id);
					console.log(app_user_id);
				}
                
            }
        });
        console.log(app_user_id);
		// alert(app_user_id);
        // setTimeout(function(){ alert(app_user_id); }, 5000);
        // setTimeout(function(){ alert(app_user_id); }, 3000);


</script>


