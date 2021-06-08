<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/style.css"/>

    <script src="bower_components/jquery.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
<!--    <script src="https://unpkg.com/jspdf@latest/dist/jspdf.min.js"></script>-->
    <script type="text/javascript" src="libraries/gauge.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
    <script src="https://unpkg.com/esri-leaflet@2.1.1/dist/esri-leaflet.js"></script>
<!--    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAt1uYJLjERTtaX3WTuztXF13VYinO1hDc&libraries=places"></script>-->
<!--    <script src="bower_components/Leaflet.GoogleMutant.js"></script>-->
<!--    <script src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.4.1/jspdf.min.js'></script>-->
<!--    <script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>-->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.0.272/jspdf.debug.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/canvg/1.5/canvg.js"></script>
    <script src="libraries/jquery.tempgauge.js"></script>

    <style type="text/css">
        #pdfTable{
            background-color:#fff;
        }
        g[class^='raphael-group-'][class$='-creditgroup'] {
            display:none !important;
        }

		#loader{
            position: fixed;
            left: 0px;
            top: 0px;
            width: 100%;
            height: 100%;
            z-index: 99999999;
            background: url('images/ajax-loader.gif')
            50% 50% no-repeat rgb(249,249,249);
            display: none;
        }

        /*------------------------------------------------------*/
    </style>

</head>
<body>
<div id="loader"></div>
<div id="myImageId" class="container-fluid">
</div>

<div id="msg"></div>
</body>
</html>

<script>

    var latlon='';
    var pss_dist='<?php echo $_REQUEST['dist']?>';
    var pss_teh='<?php echo $_REQUEST['teh']?>';
    var sc_name='';
    var lat=<?php echo $_REQUEST['lat']?>;
    var lon=<?php echo $_REQUEST['lon']?>;
    var sc_geom=JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');
    var sc_type='';
    var sc_district='';
    var sc_tehsil='';
    var cost=<?php echo $_REQUEST['cost']?>;
    var scheme_name='<?php echo $_REQUEST['scheme_name']?>';
    var funsionChartsData=[];

    //my code
    var allDataForPDF = [];
    //========================================

    function checkAlignWithPss(){

        $.post( "services/industry_allignment_pss.php",{"geom":JSON.stringify(sc_geom)}, function(response1) {
            //alert(response1);
            pss_dist=response1.dist_teh[0].district_name;
            pss_teh=response1.dist_teh[0].tehsil_name;

            if(parseInt(response1.dimentions[0].final_score)>=60)
            {
                createPage("<p style='color: green;'>Aligned with PSS</p>",response1.dimentions,response1.cooridoor,response1.env_sectoral,response1.near_suitable,response1.env_spatial[0]);
            }
            else
            {
                if(response1.cooridoor.status=="false")
                {
                    createPage("<p style='color: red;'>Not aligned with PSS</p>", response1.dimentions, response1.cooridoor, response1.env_sectoral, response1.near_suitable, response1.env_spatial[0]);
                }
                else
                {
                    createPage("<p style='color: green;'>Aligned with PSSz</p>", response1.dimentions, response1.cooridoor, response1.env_sectoral, response1.near_suitable, response1.env_spatial[0]);
                }
            }
        })
        .fail(function() {
            alert( "error" );
        })

        //  $mdDialog.cancel();
        //  map.removeLayer(theMarker);
        //  map.removeLayer(drawnItems);


        //  alert("it is aligned with pss");
    }

    function createPage(res,dim,coorridor,environ,near_suitable,env_spatial){

        var str = '<div  class="container-fluid" style="padding-left: 0px;padding-right: 0px;margin-left: 0px;margin-right: 0px;">' +

            //***********************start of top heading**************************************
            '<div class="row" style="margin-left: 0px;">' +
            '<div class="col-md-12">' +
            '<div class="col-md-2" style="padding-left: 0px;padding-right: 0px;">' +
            '<img src="images/urbanunit .png">' +
            '</div>' +
            '<div class="col-md-8" style="padding-right: 0px;">' +
            '<div class="col-md-12" style="background-color:#48A947;font-size: 20px;' +
            'letter-spacing: 0.005em;color: white;margin-top: 20px;">' +
            '<h4 style="text-align: center;text-transform:uppercase;">  Site Suitability Assessment for Industrial Estates/SEZs </h4>' +
            '</div>' +

            '<div class="col-md-12" style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
            '</div>' +
            '</div>' +
            '<div class="col-md-2" style="padding-left: 0px;padding-right: 0px;">' +
            '<img src="images/logo.png">' +
            '</div>' +
            '</div>' +
            '</div>' +

            //***********************End of top heading*************************************************

            '<div class="row" style="margin-left: 0px;">' +
            '<div class="col-md-12">' +
            '<div class="col-md-6">' +
            '<table class="table table-bordered table-striped">' +
            '<tr>' +
            '<td><b>Overall Standing:</b></td><td>' + parseInt(dim[0].final_score) + ' out of 100</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>District:</b></td><td>' + pss_dist + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>Tehsil:</b></td><td>' + pss_teh + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>Mauza:</b></td><td>' + env_spatial.mauza + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>Cost:</b></td><td>' + cost + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>Scheme Name:</b></td><td>' + scheme_name + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>Nearest Primary City:</b></td><td>' + env_spatial.city_name + '</td>' +
            '</tr>' +
            '<tr>' +
                '<td><b>Nearest SEZ/Industrial Estate:</b></td><td>' + env_spatial.estate_name + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>Floods and Risk area:</b></td><td>' + removeNullValuse(environ[0].flood) + '</td></tr>' +
            '<tr>' +
            '<td><b>Protected Area:</b></td><td>' + removeNullValuse(env_spatial.protected_areas) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td><b>Result:</b></td><td>' + res + '</td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '<div class="col-md-6">' +
            '<div id="pin_point1" width="90%" height="450px"></div>' +
            '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >' +
            '<img src="images/main.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +


            //*********************************end of row Two *************************************

            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">' +
            '<div class="col-md-12"  style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>PROPOSED SITE READINESS GAUGES</h5>' +
            '</div>' +
            '</div>' +

            '<div class="row"  style="margin-left: 0px;padding-left: 15px;padding-right: 15px;">' +
            '<div class="col-md-12">' +
            '<div class="col-md-12"  style=" text-align:center; margin: auto;">' +
            '<canvas id="total_score" width="200" height="100">' +
            '</canvas>' +
            '<h4 id="frs"></h4>' +
            '</div>' +

            '<div class="col-md-3" id="community" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Community includes schools and hospitals (DHQs, THQs, GHs, etc.) in the ' +
            'areas surrounding the site.</p>' +

            '</div>' +
            '<div class="col-md-3" id="connectivity" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Connectivity &amp; Logistics accounts for the availability and\n' +
            'access to airports, dry ports, railways, interchanges, highways, primary and secondary\n' +
            'roads. It also calculates transport time from the chosen location.</p>' +
            '</div>' +
            '<div class="col-md-3"  id="enviroment" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Environment studies the ground water quality, air quality and\n' +
            'temperatures around the chosen location.</p>' +
            '</div>' +
            '<div class="col-md-3" id="humancapital" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Human Capital accounts for the settlements, government colleges,\n' +
            'universities and TEVTA institutes in the areas surrounding the chosen location.</p>' +
            '</div>' +

            '<div class="col-md-3" id="institutoin" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Institutions include district headquarters and police stations in the\n' +
            'surrounding areas.</p>' +
            '</div>' +
            '<div class="col-md-3" id="markets" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Markets examines industry concentration, population and population growth\n' +
            'rate, primary and intermediate cities in areas surrounding the site.</p>' +
            '</div>' +
            '<div class="col-md-3" id="raw_matrials" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Raw Materials looks into the extent to which minerals, mines and\n' +
            'markets are easily accessible from the chosen location.</p>' +
            '</div>' +
            '<div class="col-md-3" id="utilities" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
            '<canvas  width="200" height="100">' +
            '</canvas>' +
            '<h4></h4><br />' +
            '<h6></h6><br />' +
            '<p>Utilities include access to drainage networks, electricity\n' +
            'networks, grid stations, gas pipelines, gas stations, ground water tables, irrigation\n' +
            'networks and solar radiations.</p>' +
            '</div>' +
            '</div>' +
            '</div>' +

            //*********************************end of row three *************************************

            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">' +
            '<div class="col-md-12"  style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>DISTANCE TO KEY INFRASTRUCTURE</h5>' +
            '</div>' +
            '</div>' +

            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
            '<div class="col-md-12">' +

            '<div id="logistics"></div>' +
            '</div>' +
            '</div>' +

            //*********************************end of row Four *************************************

            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">' +
            '<div class="col-md-12"  style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>SITE POSITIONING WITH RESPECT TO PSS PRIORITIZATION</h5>' +
            '</div>' +
            '</div>' +

            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
            '<h5 style="padding-left: 50px;">PROPOSED KEY INDUSTRIAL SECTORS AS INFORMED BY PSS</h5>' +
            '<div class="col-md-12">' +
            '<div class="col-md-6"  id="pss_priortization">' +
            '</div>' +
            '<div class="col-md-6" id="pin_point2">' +
            '<div  style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >' +
            '<img src="images/finalsuitibility.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            //*********************************end of row Five *************************************

            '<div class="row" class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">' +
            '<div class="col-md-12"  style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>EXISTING TOP INDUSTRIES IN DISTRICT OF PROPOSED SITE</h5>' +
            '</div>' +
            '</div>' +

            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
            '<div class="col-md-12">' +
            '<div class="col-md-6" id="dount_container" style="height: 300px; width: 50%;">' +
            '</div>' +
            '<div class="col-md-6" id="pin_point4">' +
            '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >' +
            '<img src="images/industry.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            //*********************************end of row SIX *************************************

            '<br/>' +
            '<div class="row"  style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">' +
            '<div class="col-md-12"  style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>ENVIRONMENT ASSESSMENT</h5>' +
            '</div>' +
            '</div>' +

            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
            '<div class="col-md-12">' +
            '<h5>Legal Requirement</h5>' +
            '<table class="table table-bordered table-striped">' +
            '<tr>' +
            '<td>Legal Requirement for Environment Assessment :</td><td>' + env_spatial.legal_rule + '</td>' +
            '</tr>' +
            '</table></div>' +
            '<div class="col-md-6"><h5>Sectoral Assessment</h5>' +
            '<table class="table table-bordered table-striped">' +
            '<tr>' +
            '<td>Flood zone:</td><td>' + removeNullValuse(environ[0].flood) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Residential area:</td><td>' + removeNullValuse(environ[0].residential) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Prime agri land:</td><td>' + removeNullValuse(env_spatial.vegitation) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Closest Major cities:</td><td>' + removeNullValuse(env_spatial.city_name) + '</td>' +
            '</tr>' +
            '</table></div>' +
            '<div class="col-md-6"><h5>Spatial Assessment</h5>' +
            '<table class="table table-bordered table-striped">' +
            '<tr>' +
            '<td>Location inside conservation area:</td><td>' + env_spatial.conservation_area + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Location in protected area :</td><td>' +removeNullValuse(env_spatial.protected_areas) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Location in protected habitat:</td><td></td>' +
            '</tr>' +

            '<tr>' +
            '<td>Location in flood area:</td><td>' + removeNullValuse(environ[0].flood) + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Water quality index:</td><td>' + env_spatial.water_quality + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Groundwater depth:</td><td>' + env_spatial.water_depth + '</td>' +
            '</tr>' +
            '</table>' +
            '</div>' +

            '<div class="col-md-6">' +
            '<h5 style="text-align: center;">Conservation Map</h5>' +
            '</div>' +

            '<div class="col-md-6">' +
            '<h5 style="text-align: center;">Ground Water Quality Map</h5>' +
            '</div>' +
            '<div class="col-md-12">' +
            '<div class="col-md-6" id="pin_point3" style="padding-top: 30px;padding-left: 50px;border-right:solid 2px white;">' +
            '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >' +
            '<img src="images/environment.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">' +
            '</div>' +
            '</div>' +

            '<div class="col-md-6" id="pin_point5" style="padding-top: 30px;border-left:solid 2px white;">' +
            '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >' +
            '<img src="images/groundwater.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            //*********************************end of row Seven *************************************

            '<br/>' +

            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">' +
            '<div class="col-md-12"  style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>DISTRICT READINESS FOR SEZs/IE: PRESENT RANKINGS AMONG 36 DISTRICTS</h5>' +
            '</div>' +
            '</div>' +

            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
            '<div class="col-md-12">' +
            '<div class="col-md-9" id="ind_table" style="padding-top: 10px;padding-bottom: 10px;padding-left: 0px;padding-right: 0px;">' +

            '<div class="col-md-1" style="width:10%;margin: 0 auto;">' +
            '<div id="community1">' +
            '</div>' +
            '<h6 style="text-align: center;padding-left: 25px;padding-top: 0px;margin-left: 0px;">Community<br /><p id="community1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"  style="width:10%;margin: 0 auto;">' +
            '<div id="connectivity1">' +

            '</div>' +
            '<h6 style="text-align: center;padding-left: 10px;padding-top: 0px;margin-left: 0px;">Connectivity<br /><p id="connectivity1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"   style="width:10%;margin: 0 auto;">' +
            '<div id="enviroment1">' +

            '</div>' +
            '<h6 style="text-align: center;padding-left: 20px;padding-top: 0px;margin-left: 0px;">Enviroment<br /><p id="enviroment1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"  style="width:10%;margin: 0 auto;">' +
            '<div id="humancapital1">' +

            '</div>' +
            '<h6 style="text-align: center;padding-left: 30px;padding-top: 0px;margin-left: 0px;">Human Capital<br /><p id="humancapital1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"  style="width:10%;margin: 0 auto;">' +
            '<div id="institutoin1">' +
            '</div>' +
            '<h6 style="text-align: center;padding-left: 20px;padding-top: 0px;margin-left: 0px;"> Institutoin<br /><p id="institutoin1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"  style="width:10%;margin: 0 auto;;">' +
            '<div id="markets1">' +
            '</div>' +
            '<h6 style="text-align: center;padding-left: 20px;padding-top: 0px;margin-left: 0px;">Markets<br /><p id="markets1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"  style="width:10%;margin: 0 auto;">' +
            '<div id="raw_matrials1">' +
            '</div>' +
            '<h6 style="text-align: center;padding-left: 20px;padding-top: 0px;margin-left: 0px;">Raw Matrials<br /><p id="raw_matrials1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"  style="margin: 0 auto;">' +
            '<div id="utilities1">' +
            '</div>' +
            '<h6 style="text-align: center;padding-left: 20px;padding-top: 0px;margin-left: 0px;">Utilities<p id="utilities1_1"></p></h6>' +
            '</div>' +

            '<div class="col-md-1"  style="margin: 0 auto;">' +
            '<div id="overAll">' +
            '</div>' +
            '<h6 style="text-align: center;padding-left: 20px;padding-top: 0px;margin-left: 0px;">OverAll Rank <p id="overAll_1"></p></h6>' +
            '</div>' +

            '</div>' +
            '<div class="col-md-3" id="pin_point12">' +
            '</div>' +

            '</div>' +
            '</div>' +

            //*********************************end of row Eight *************************************
            '<br/>' +
            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">' +
            '<div class="col-md-12"  style="background-color:#4E648C;color:#fff;font-size: 20px;text-align: center;">' +
            '<h5>CONTACT DETAILS AND RESPONSIBLE OFFICIALS</h5>' +
            '</div>' +
            '</div>' +

            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
            '<div class="col-md-12">' +
            '<div class="col-md-12">' +
            '<table class="table">' +
            '<tr>' +
            '<td>Name:</td><td></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Designation:</td><td></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Organization:</td><td></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Signatures:</td><td></td>' +
            '</tr>' +
            '<tr>' +
            '<td>Date:</td><td></td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>' +


            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
            '<div class="col-md-12">' +
            '<div class="col-md-12" style="border: solid black 1px;">' +

            //'<h5>Logistics</h5>'+
            '<div id="logistic_div" style="overflow: scroll;height: 2800px; ">' +
            '</div>' +
            '</div>' +
            '</div>' +


            '<div class="col-md-4">' +
            // '<md-button ng-click="cancel()" class="md-primary">' +
            // 'Finish' +
            // '</md-button>' +
            // '<md-button ng-click="captureImages()" class="md-primary">' +
            // '<a href="createpdf.html" target="_blank">save</a>' +
            // '</md-button>' +
            // '<button onclick="createPDF()"> savepdf</button>'+
            // '<button onclick="print_map_1()">savepdf</button>'+
                '<div style="margin: 20px 0 50px 0;">' +
                    '<button class="btn btn-primary" onclick="print_map_1();" style="padding: 10px 20px;font-size: 16px;">Save PDF</button>' +
                '</div>'+
            '</div>';






        $("#myImageId").html(str);

        setTimeout(function()
        {

            //my code
            var tableOne = {};
            tableOne['tblOneVal_1'] = parseInt(dim[0].final_score)+' out of 100';
            tableOne['tblOneVal_2'] = pss_dist;
            tableOne['tblOneVal_3'] = pss_teh;
            tableOne['tblOneVal_4'] = env_spatial.mauza;
            tableOne['tblOneVal_5'] = cost;
            tableOne['tblOneVal_6'] = scheme_name;
            tableOne['tblOneVal_7'] = env_spatial.city_name;
            tableOne['tblOneVal_8'] = env_spatial.estate_name;
            tableOne['tblOneVal_9'] = removeNullValuse(environ[0].flood);
            tableOne['tblOneVal_10'] = removeNullValuse(env_spatial.protected_areas);
            tableOne['tblOneVal_11'] = $(res).text();
            allDataForPDF.push(tableOne);

            //ENVIRONMENT ASSESSMENT
            var legalReqTable = {};
            legalReqTable['legalReq'] = env_spatial.legal_rule;
            allDataForPDF.push(legalReqTable);

            var sectoralAssessTable = {};
            sectoralAssessTable['sectoral_assess_1'] = removeNullValuse(environ[0].flood);
            sectoralAssessTable['sectoral_assess_2'] = removeNullValuse(environ[0].residential);
            sectoralAssessTable['sectoral_assess_3'] = removeNullValuse(env_spatial.vegitation);
            sectoralAssessTable['sectoral_assess_4'] = removeNullValuse(env_spatial.city_name);
            allDataForPDF.push(sectoralAssessTable);

            var spatialAssessTable = {};
            spatialAssessTable['spatial_assess_1'] = env_spatial.conservation_area;
            spatialAssessTable['spatial_assess_2'] = removeNullValuse(env_spatial.protected_areas);
            spatialAssessTable['spatial_assess_3'] = 'no value';
            spatialAssessTable['spatial_assess_4'] = removeNullValuse(environ[0].flood);
            spatialAssessTable['spatial_assess_5'] = env_spatial.water_quality;
            spatialAssessTable['spatial_assess_6'] = env_spatial.water_depth;
            allDataForPDF.push(spatialAssessTable);
            //========================================


            addNewguage('Community','community',parseInt(dim[0].community));
            addNewguage('Connectivity','connectivity',parseInt(dim[0].connectivity));
            addNewguage('Enviroment','enviroment',parseInt(dim[0].enviroment));
            addNewguage('Human capital','humancapital',parseInt(dim[0].humancapital));
            addNewguage('Institution','institutoin',parseInt(dim[0].institutoin));
            addNewguage('Markets','markets',parseInt(dim[0].markets));
            addNewguage('Raw Matrials','raw_matrials',parseInt(dim[0].raw_matrials));
            addNewguage('Utilities','utilities',parseInt(dim[0].utilities));

            industrialSectors();
            dounetChart();

            thermoRes();
            totalScoreGuage(dim[0].final_score);
            $("#frs").html(res);

            mapOne('pin_point1',sc_geom.coordinates[1],sc_geom.coordinates[0],12);
            mapTwo('pin_point2',sc_geom.coordinates[1],sc_geom.coordinates[0],12);
            mapThree('pin_point3',sc_geom.coordinates[1],sc_geom.coordinates[0],10);
            mapFour('pin_point4',sc_geom.coordinates[1],sc_geom.coordinates[0],10)
            mapFive('pin_point5',sc_geom.coordinates[1],sc_geom.coordinates[0],10)
            mapSix('pin_point12',sc_geom.coordinates[1],sc_geom.coordinates[0],10)

            $("#"+pss_dist).css('border', '3px solid red');
            $('#logistic_div').load('pss/dss_scoring.htm');

            $.post( "services/industry_nine_dimentions.php",{"geom":JSON.stringify(sc_geom)}, function(response1) {
                var res=JSON.parse(response1);
                var logistics='<table class="table table-bordered table-striped">' +
                    '<tr>' +
                    '<td class="col-md-6">Highway Motorway</td>'+
                    '<td class="col-md-6">'+Number(res[0].highway_motorway_1).toFixed(1)+'KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Railroad</td>'+
                    '<td class="col-md-6">'+Number(res[0].railroad_1).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Airport</td>'+
                    '<td class="col-md-6">'+Number(res[0].airport_1).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Trucking Stations Interchanges</td>'+
                    '<td class="col-md-6">'+Number(res[0].updated_interchanges).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Dryports</td>'+
                    '<td class="col-md-6">'+Number(res[0].dryports_1).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Education</td>'+
                    '<td class="col-md-6">'+Number(res[0].universities).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Hospitals</td>'+
                    '<td class="col-md-6">'+Number(res[0].hospital_dhqs__thqs__ghs_1).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Floods</td>'+
                    '<td class="col-md-6">'+Number(res[0].floods_1).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Gas Network</td>'+
                    '<td class="col-md-6">'+Number(res[0].gas_station_1).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '<tr>' +
                    '<td class="col-md-6">Electricity Network</td>'+
                    '<td class="col-md-6">'+Number(res[0].electricity_network_1).toFixed(1)+' KM</td>'+
                    '</tr>'+
                    '</table>';
                $("#logistics").html(logistics);


                //my code
                //DISTANCE TO KEY INFRASTRUCTURE
                var distancetable = {};
                distancetable['tblDis_1'] = Number(res[0].highway_motorway_1).toFixed(1)+' KM';
                distancetable['tblDis_2'] = Number(res[0].railroad_1).toFixed(1)+' KM';
                distancetable['tblDis_3'] = Number(res[0].airport_1).toFixed(1)+' KM';
                distancetable['tblDis_4'] = Number(res[0].updated_interchanges).toFixed(1)+' KM';
                distancetable['tblDis_5'] = Number(res[0].dryports_1).toFixed(1)+' KM';
                distancetable['tblDis_6'] = Number(res[0].universities).toFixed(1)+' KM';
                distancetable['tblDis_7'] = Number(res[0].hospital_dhqs__thqs__ghs_1).toFixed(1)+' KM';
                distancetable['tblDis_8'] = Number(res[0].floods_1).toFixed(1)+' KM';
                distancetable['tblDis_9'] = Number(res[0].gas_station_1).toFixed(1)+' KM';
                distancetable['tblDis_10'] = Number(res[0].electricity_network_1).toFixed(1)+' KM';
                allDataForPDF.push(distancetable);
                //console.log(allDataForPDF);
                //=======================================

            }).fail(function() {
                alert( "error" );})

        },1000)

    }

    industrialSector();

    function removeNullValuse(vals){
        if(vals==null){
            //  return 'No <span class="glyphicon glyphicon-remove btn-danger"></span>';
            return 'No';
        }else{
            // return 'Yes <span class="glyphicon glyphicon-ok btn-success"></span>';
            return 'Yes';
        }
    }

    function industrialSector(){
        $.post( "services/district_sector_compatibility.php",{"district":pss_dist}, function(response1) {
            // alert(response1);
            var str_dist='<table class="table">';
            for(var i=0;i<response1.length;i++){
                var num=i+1;
                str_dist=str_dist+'<tr><td>'+num+'</td><td>'+response1[i].sector+'</td></tr>';
            }

            str_dist=str_dist+'</table>'
            $("#pss_priortization").html(str_dist);
        })
            .fail(function() {
                alert( "error" );
            })
    }

    function dounetChart(){

        var dount_arr=[];

        $.post( "services/industry_sector_lookup.php",{"dist":'Lahore'}, function(response1) {
            // alert(response1);

            for(var i=0;i<response1.length;i++){
                var dount_obj={};
                dount_obj['y']=response1[i].count;
                dount_obj['label']=response1[i].sector;
                dount_arr.push(dount_obj);

            }

            var chart = new CanvasJS.Chart("dount_container", {
                animationEnabled: true,
                exportEnabled: true,
                exportFileName:"dountChart",
                // title:{
                //     text: "Email Categories",
                //     horizontalAlign: "left"
                // },
                credits:{
                    enabled:false
                },
                data: [{
                    type: "doughnut",
                    startAngle: 60,
                    //innerRadius: 60,
                    indexLabelFontSize: 17,
                    //  indexLabel: "{label} - #percent%",
                    //  toolTipContent: "<b>{label}:</b> {y} (#percent%)",
                    dataPoints:dount_arr
                    //     [
                    //     { y: 67, label: "Inbox" },
                    //     { y: 28, label: "Archives" },
                    //     { y: 10, label: "Labels" },
                    //     { y: 7, label: "Drafts"},
                    //     { y: 15, label: "Trash"},
                    //     { y: 6, label: "Spam"}
                    // ]
                }]
            });
            chart.render();


            //my code
            setTimeout(function() {
            var canvas = $("#dount_container .canvasjs-chart-canvas").get(0);
            var dataURL = canvas.toDataURL();
            //console.log(dataURL);

            var donutChart = {};
                donutChart['donut_1'] = dataURL;
                allDataForPDF.push(donutChart);
            }, 2000);
            //========================================




            $(".canvasjs-chart-credit").html('');

        }).fail(function() {
            alert( "error" );
        })

    }

    //my code
    var gaugeCounter = 1;
    //=============================
    function addNewguage(Names,container,val){

        var arr_val=[];
        // arr_val.push(val)
        var color;
        val_new = parseInt(val);
        if(val_new<=40){
            color="red"
            document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
            document.getElementById(container).querySelector('h6').innerHTML='<span style="color: red;font-size:16px;">'+val+'%</span>';
        }else if(val_new>40 && val_new <=60){
            color='#EF9B0F';
            document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
            document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #EF9B0F;font-size:16px;">'+val+'%</span>';
        }else if(val_new>60 ){
            color='green';
            document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
            document.getElementById(container).querySelector('h6').innerHTML='<span style="color: green;font-size:16px;">'+val+'%</span>' ;
        }

        var opts = {
            angle: -0.01, // The span of the gauge arc
            lineWidth: 0.14, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
                length: 0.53, // // Relative to gauge radius
                strokeWidth: 0.044, // The thickness
                color: color // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#98999F',   // Colors
            colorStop: '#98999F',    // just experiment with them
            strokeColor: '#98999F',  // to see which ones work best for you
            staticZones: [
                {strokeStyle: "#F03E3E", min: 0, max: 33}, // Red from 100 to 130
                {strokeStyle: "#FFDD00", min: 34, max: 67}, // Yellow
                {strokeStyle: "#30B32D", min: 68, max: 100}, // Green
            ],//
            generateGradient: true,
            highDpiSupport: true,     // High resolution support

        };

        var target = document.getElementById(container).querySelector('canvas'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 100; // set max gauge value
        gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 100; // set animation speed (32 is default value)
        gauge.set(val_new); // set actual value

        //my code
        setTimeout(function() {
            var dataURL = target.toDataURL("image/png");
            //console.log(dataURL);
            var newGuageChart = {};
            newGuageChart['Gauge_'+gaugeCounter] = dataURL;
            newGuageChart['Gauge_'+gaugeCounter+'_name'] = Names;
            newGuageChart['Gauge_'+gaugeCounter+'_value'] = val;
            allDataForPDF.push(newGuageChart);
            gaugeCounter++
        }, 2000);
        //========================================


    }

    function thermoRes(){
        $.post( "services/industry_sector_thermometer.php",{"dist":pss_dist}, function(response1) {
            renderThermoMeter('#7034A0','community1',parseInt(response1[0].community),0);
            renderThermoMeter('#1A3260','connectivity1',parseInt(response1[0].connectivity),1);
            renderThermoMeter('#4AAAC9','enviroment1',parseInt(response1[0].enviro_eco),2);
            renderThermoMeter('#F7C033','humancapital1',parseInt(response1[0].human_capital),3);

            renderThermoMeter('#3D3D3D','institutoin1',parseInt(response1[0].institutions),4);
            renderThermoMeter('#92CF50','markets1',parseInt(response1[0].market),5);
            renderThermoMeter('#1A3260','raw_matrials1',parseInt(response1[0].raw_material),6);
            renderThermoMeter('#2F7186','utilities1',parseInt(response1[0].utilities),7);
            renderThermoMeter('#244AFB','overAll',parseInt(response1[0].overall_rank),8);
            setTimeout(function(){
                // createSvgToCanvas($("#community1"),0)
                // createSvgToCanvas($("#connectivity1"),1)
                // createSvgToCanvas($("#enviroment1"),2)
                // createSvgToCanvas($("#humancapital1"),3)
                // createSvgToCanvas($("#institutoin1"),4)
                // createSvgToCanvas($("#markets1"),5)
                // createSvgToCanvas($("#raw_matrials1"),6)
                // createSvgToCanvas($("#utilities1"),7)
                // createSvgToCanvas($("#overAll"),8)

            },3000)


        });
    }


    //my code
    var thermoCounter = 0;
    //=================================
    function renderThermoMeter(color,container,val,index){

        //my code
        var thermoChart = $("#"+container).tempGauge({

        borderColor:"black",

        borderWidth: 4,
        defaultTemp: 26,

        fillColor:color,
        showLabel:false,

        labelSize: 12,

        maxTemp: val,

        minTemp:0,
        width: 100
        });

        //my code
        var canvasTag = thermoChart[0];
        setTimeout(function() {
            var dataURL = canvasTag.toDataURL("image/png");
            //console.log(dataURL);
            var newThermoMeter = {};
            newThermoMeter['thermo_'+thermoCounter] = dataURL;
            allDataForPDF.push(newThermoMeter);
            thermoCounter++;
        }, 2000);
        //==========================================



    }

    function totalScoreGuage(val){
        var arr_val=[];
        // arr_val.push(val)
        var color="#98999F";
        val_new=parseInt(val);

        var opts = {
            angle: -0.01, // The span of the gauge arc
            lineWidth: 0.14, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
                length: 0.53, // // Relative to gauge radius
                strokeWidth: 0.044, // The thickness
                color: color // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#6FADCF',   // Colors
            colorStop: '#8FC0DA',    // just experiment with them
            strokeColor: '#98999F',
            staticZones: [
                {strokeStyle: "#F03E3E", min: 0, max: 33}, // Red from 100 to 130
                {strokeStyle: "#FFDD00", min: 34, max: 67}, // Yellow
                {strokeStyle: "#30B32D", min: 68, max: 100}, // Green
            ],// to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true,     // High resolution support

        };
        var target = document.getElementById('total_score'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = 100; // set max gauge value
        gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 100; // set animation speed (32 is default value)
        gauge.set(val_new); // set actual value


        //my code
        setTimeout(function() {

            var dataURL = target.toDataURL("image/png");
            //console.log(dataURL);
            var totalScoreChart = {};
            totalScoreChart["TotalGauge"] = dataURL;
            allDataForPDF.push(totalScoreChart);

        }, 2000);
        //========================================

    }

    function industrialSectors(){
        $.post( "services/district_sector_compatibility.php",{"district":pss_dist}, function(response1) {
            // alert(response1);

            //my code
            var industrySector = {};
            //=============================

            var str_dist='<table class="table">';
            for(var i=0;i<response1.length;i++){
                var num=i+1;
                str_dist=str_dist+'<tr><td>'+addImageToIndustry(response1[i].sector)+'</td><td>'+response1[i].sector+'</td></tr>';

                //my code
                //PROPOSED KEY INDUSTRIAL SECTORS AS INFORMED BY PSS
                industrySector['industrySec_'+num] = response1[i].sector;
                //=======================================

            }

            //my code
            allDataForPDF.push(industrySector);
            //================================

            str_dist=str_dist+'</table>'
            $("#pss_priortization").html(str_dist);
        })
            .fail(function() {
                alert( "error" );
            })

    }

    function addImageToIndustry(vals){
        if(vals=="Clothing"){
            return "<img src='images/clothing.png' width='20px' height='20px'>";
        }else if(vals=="Textiles"){
            return "<img src='images/textile.png' width='20px' height='20px'>";
        }else if(vals=="Non-electronic Machinery"){
            return "<img src='images/manufacturing.png' width='20px' height='20px'>";
        }else if(vals=="Miscellaneous Manufacturing"){
            return "<img src='images/electronic component.png' width='20px' height='20px'>";
        }else if(vals=="Transport Equipment"){
            return "<img src='images/transport.png' width='20px' height='20px'>";
        }else if(vals=="Chemicals"){
            return "<img src='images/chemical.png' width='20px' height='20px'>";
        }else if(vals=="Basic Manufactures"){
            return "<img src='images/basic_manufacture.png' width='20px' height='20px'>";
        }else if(vals=="Processed Food"){
            return "<img src='images/food.png' width='20px' height='20px'>";
        }else if(vals=="Electronic Components"){
            return "<img src='images/electrnic_machinery.png' width='20px' height='20px'>";
        }else if(vals=="IT and Consumer Electronics"){
            return "<img src='images/IT & Consumer.png' width='20px' height='20px'>";
        }else if(vals=="Leather Products"){
            return "<img src='images/manufacturing.png' width='20px' height='20px'>";
        }else{
            return "<img src='images/clothing.png' width='20px' height='20px'>";
        }
    }

    var punjabAdminService = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';

    function mapOne(containers,lat,lng,zoom) {
        // $scope.punjabAdminService = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';
        var one_map = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          //  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            renderer: L.canvas()
        }).addTo(one_map);

        var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
            {
                url:punjabAdminService,
                opacity : 1,
                useCors: false
            }
        ).addTo(one_map);
        // $scope.addPointOnMap(lat,lng);
        L.marker([lat, lng]).addTo(one_map);
        $("#pin_point1").height(420);

        // html2canvas(document.querySelector("#pin_point1")).then(canvas2 => {
        //     document.body.appendChild(canvas2)
        // });


        setTimeout(function(){
            one_map.invalidateSize()
            punjabAdminDynamicLayer.setLayers([8,7,13]);
        },5000)
    }

    function mapTwo(containers,lat,lng,zoom) {
      var finalSuitibility = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_dss_nine_dimension_r_07122018/MapServer/';
        var map2 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
        // var roads = L.gridLayer.googleMutant({
        //     type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        // }).addTo(map2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            renderer: L.canvas()
        }).addTo(map2);
        finalSuitibilityDynamic = L.esri.dynamicMapLayer(
            {
                url:finalSuitibility,
                opacity : 1,
                useCors: false
            }
        ).addTo(map2);
        var point = L.marker([lat, lng]).addTo(map2);

        $("#pin_point2").height(400);
        setTimeout(function(){
            map2.invalidateSize()
            finalSuitibilityDynamic.setLayers([17]);
          //  $scope.tehsil = $scope.getAjax({lat:lat,lng:lng});

            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                {
                    url:punjabAdminService,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map2);
            punjabAdminDynamicLayer.setLayers([8,7]);
            // $scope.zoomToMap(map2,$scope.tehsil[0].extent);

            // var ext = $scope.tehsil[0].extent.split(',');
            // map2.fitBounds([
            //     [ext[1], ext[0]],
            //     [ext[3], ext[2]]
            // ]);

        },5000)

    }

    function mapThree(container,lat,lng,zoom) {
        var environmnet = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_environment_print_v_07122018/MapServer/';
        var map3 = new L.Map(container, {center: new L.LatLng(lat, lng), zoom: zoom});
        // var roads = L.gridLayer.googleMutant({
        //     type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        // }).addTo(map3);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            renderer: L.canvas()
        }).addTo(map3);
        var environmentDynamic = L.esri.dynamicMapLayer(
            {
                url:environmnet,
                opacity : 1,
                layers : [0,1,2],
                useCors: false
            }
        );
        var point = L.marker([lat, lng]).addTo(map3);
        $("#pin_point3").height(400);
        setTimeout(function(){
            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                {
                    url:punjabAdminService,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map3);
            punjabAdminDynamicLayer.setLayers([8,7]);
            map3.invalidateSize()
            map3.addLayer(environmentDynamic);
            map3.addLayer(punjabAdminDynamicLayer);
        },5000)

    }

    function mapFour(containers,lat,lng,zoom) {
       var boundary = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';
        var industry = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisporta_industyl_pg31_v_15082018/MapServer/';
        map4 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
        // var roads = L.gridLayer.googleMutant({
        //     type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        // }).addTo(map4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            renderer: L.canvas()
        }).addTo(map4);
        boundary = L.esri.dynamicMapLayer(
            {
                url:boundary,
                opacity : 1,
                layers : [8,7],
                useCors: false
            }
        );
        map4.addLayer(boundary);
        industry = L.esri.dynamicMapLayer(
            {
                url:industry,
                opacity : 1,
                layers : [255,256,257],
                useCors: false
            }
        );

        var point = L.marker([lat, lng]).addTo(map4);
        $("#pin_point4").height(400);
        setTimeout(function(){
            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                {
                    url:punjabAdminService,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map4);
            punjabAdminDynamicLayer.setLayers([8,7]);
            map4.invalidateSize()
            map4.addLayer(industry);
        },5000)
    }

    function mapFive(containers,lat,lng,zoom) {
       var groundwater = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_pss_environment_main_v_07122018/MapServer/';
        var map5 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
        // var roads = L.gridLayer.googleMutant({
        //     type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        // }).addTo(map5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            renderer: L.canvas()
        }).addTo(map5);
        var groundwater = L.esri.dynamicMapLayer(
            {
                url:groundwater,
                opacity : 1,
                layers : [4],
                useCors: false
            }
        );

        var point = L.marker([lat, lng]).addTo(map5);
        $("#pin_point5").height(400);
        setTimeout(function(){
            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                {
                    url:punjabAdminService,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map5);
            punjabAdminDynamicLayer.setLayers([8,7]);
            map5.invalidateSize()
            map5.addLayer(groundwater);
        },5000)
    }

    function mapSix(containers,lat,lng,zoom) {
        var map6 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
        // var roads = L.gridLayer.googleMutant({
        //     type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        // }).addTo(map6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            renderer: L.canvas()
        }).addTo(map6);
        //  var point = L.marker([lat, lng]).addTo(map6);
        $("#pin_point12").height(300);
        setTimeout(function(){
            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                {
                    url:punjabAdminService,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map6);
            punjabAdminDynamicLayer.setLayers([8]);
            map6.invalidateSize()

            var name = "district_name  ='" +pss_dist+ "'";
            var gglayer;

            L.esri.query({
                url: "http://202.166.168.183:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/8"
            }).where(name).run(function(error, neighborhoods){
                // draw neighborhood on the map
                // if(typeof gglayer != 'undefined'){
                //     gglayer.clearLayers();
                // };

            //    gglayer = L.geoJson(neighborhoods,{ style: myStyle}).addTo(map6);
                // fit map to boundry
               // map6.fitBounds(gglayer.getBounds());

            });

        },5000)
    }

    var ijk=1
    // its recursive method
    function print_map_1(){
        var parm="#pin_point"+ijk;
        //console.log(parm);
        return html2canvas($(parm), {
            useCORS: true,
            //optimized: false,
           // allowTaint: false,
            onrendered: function(canvas) {
                var myImage = canvas.toDataURL("image/jpeg,1.0");

                //console.log(canvas);

                var mapImages = {};
                mapImages["pin_point"+ijk] = myImage;
                allDataForPDF.push(mapImages);


                var str='<img src="'+myImage+'"/>'
                $(parm).html('');
                $(parm).html(str);
                ijk++
                if(ijk==13)
                {
                    //createPDF();
                    getAllDataMakePDF();
                }
                if(ijk==6)
                {
                    ijk=12;
                }
                setTimeout(function()
                {
                    print_map_1();
                },5000)
                // Adjust width and height
                //var imgWidth = (canvas.width * 20) / 160;
                //var imgHeight = (canvas.height * 10) / 160;
                // jspdf changes
                // var pdf = new jsPDF('p', 'mm', 'a3');
                // pdf.addImage(myImage, 'JPEG', 10, 10, imgWidth, imgHeight); // 2: 19
                // pdf.save('Download.pdf');
            }
        });


    }

    // function createPDF(){
    //
    //     return html2canvas($("#myImageId"), {
    //          useCORS: true,
    //          optimized: false,
    //          allowTaint: false,
    //         onrendered: function(canvas)
    //         {
    //             //! MAKE YOUR PDF
    //             var pdf;
    //             for (var i = 0; i <= $("#myImageId")[0].clientHeight/1640; i++) {
    //
    //                if(i==1)
    //                {
    //                    var srcImg = canvas;
    //                    var sX = 0;
    //                    var sY = 1570 * i; // start 980 pixels down for every new page
    //                    var sWidth = canvas.width;
    //                    var sHeight = 1450;
    //                    var dX = 0;
    //                    var dY = 0;
    //                    var dWidth = canvas.width;
    //                    var dHeight = 1450;
    //                    var w = (dWidth) * 0.75;
    //                    var h = (dHeight) * 0.75;
    //
    //                }
    //                else if(i==2)
    //                {
    //
    //                    var srcImg = canvas;
    //                    var sX = 0;
    //                    var sY = 1500 * i; // start 980 pixels down for every new page
    //                    var sWidth = canvas.width;
    //                    var sHeight = 1550;
    //                    var dX = 0;
    //                    var dY = 0;
    //                    var dWidth = canvas.width;
    //                    var dHeight = 1550;
    //                    var w = (dWidth) * 0.75;
    //                    var h = (dHeight) * 0.75;
    //
    //
    //                }
    //                else if(i==3)
    //                {
    //
    //                    var srcImg = canvas;
    //                    var sX = 0;
    //                    var sY = 1530 * i; // start 980 pixels down for every new page
    //                    var sWidth = canvas.width;
    //                    var sHeight = 1450;
    //                    var dX = 0;
    //                    var dY = 0;
    //                    var dWidth = canvas.width;
    //                    var dHeight = 1450;
    //                    var w = (dWidth) * 0.75;
    //                    var h = (dHeight) * 0.75;
    //
    //                }
    //                else
    //                {
    //                    var srcImg = canvas;
    //                    var sX = 0;
    //                    var sY = 1600 * i; // start 980 pixels down for every new page
    //                    var sWidth = canvas.width;
    //                    var sHeight = 1550;
    //                    var dX = 0;
    //                    var dY = 0;
    //                    var dWidth = canvas.width;
    //                    var dHeight = 1640;
    //                    var w = (dWidth) * 0.75;
    //                    var h = (dHeight) * 0.75;
    //                }
    //
    //
    //                 if(i==0)
    //                 {
    //                     pdf = new jsPDF('p', 'pt',[w , h])
    //                 }
    //
    //
    //                 window.onePageCanvas = document.createElement("canvas");
    //                 onePageCanvas.setAttribute('width', dWidth);
    //                 onePageCanvas.setAttribute('height', dHeight);
    //                 var ctx = onePageCanvas.getContext('2d');
    //                 // details on this usage of this function:
    //                 // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
    //                 ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
    //
    //                 // document.body.appendChild(canvas);
    //                 var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
    //
    //                 // var a = document.createElement('a');
    //                 // a.href = canvasDataURL;
    //                 // a.download = 'myfile.png';
    //                 // a.click();
    //
    //                 var pdf_p_width = (onePageCanvas.width) * 0.75;
    //                 var pdf_p_height = onePageCanvas.height * 0.75;
    //
    //                 //! If we're on anything other than the first page,
    //                 // add another page
    //                 if (i > 0)
    //                 {
    //                     pdf.addPage(pdf_p_width, pdf_p_height); //8.5" x 11" in pts (in*72)
    //                 }
    //                 //! now we declare that we're working on that page
    //                 pdf.setPage(i + 1);
    //                 //! now we add content to that page!
    //
    //                 pdf.addImage(canvasDataURL, 'PNG', 0, 0, pdf_p_width, pdf_p_height);
    //
    //             }
    //
    //                 //! after the for loop is finished running, we save the pdf.
    //                 pdf.save('industry.pdf');
    //
    //         }
    //     });
    //
    //   //   },10000)
    //
    // }

    function createSvgToCanvas(container,index){

        //     var item = document.body.querySelector('g[class^=\'raphael-group-\']');
        //     item.parentNode.removeChild(item);
        //     var svgElements= container.find('svg');
        //
        //     var canvas, xml;
        //
        //     canvas = document.createElement("canvas");
        //     canvas.className = "screenShotTempCanvas";
        //     xml = (new XMLSerializer()).serializeToString(svgElements[0]);
        //
        //     xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');
        //
        //     canvg(canvas, xml);
        //     $(canvas).insertAfter(container);
        //     container.className = "tempHide";
        //     $(container).hide();

        //      document.getElementById(container).innerHTML=encodedData;

        var text = document.createTextNode(funsionChartsData[index].getSVGString());
        document.getElementById("msg").innerHTML=text;
        // converting SVG to Base64
       // var s_base64 = new XMLSerializer().serializeToString(document.getElementById("msg"));
        var s_base64 = new XMLSerializer().serializeToString(text);

        // canvg('canvas', s_base64);
        // var canvas = document.getElementById("canvas");
        // var img = canvas.toDataURL("image/png");
        // using btoa to convert serialized SVG string to Base64
        console.log(s_base64);
        var encodedData = window.btoa(s_base64);
        console.log(encodedData);
        //   $(container).html("<img src=data:image/jpeg;charset=utf-8;base64, "+s_base64+">");
        //  document.getElementById("msgbase64").innerHTML=encodedData;

    }

    $(document).ready(function(){
        $("#loader").show();

        checkAlignWithPss();

        setTimeout(function()
        {
            $("#loader").hide();
        },10000);
    });

    //my code ----- get Map images
    // var mapCounter = 1;
    // function getMapImages() {
    //
    //     var parm="#pin_point"+mapCounter;
    //     return html2canvas($(parm), {
    //         useCORS: true,
    //         //optimized: false,
    //         // allowTaint: false,
    //         onrendered: function(canvas) {
    //             var dataURL = canvas.toDataURL("image/png");
    //             // console.log(mapCounter);
    //             // console.log(dataURL);
    //
    //             var mapImages = {};
    //             mapImages["mapImg_"+mapCounter] = dataURL;
    //             allDataForPDF.push(mapImages);
    //
    //
    //             setTimeout(function()
    //             {
    //                 if(mapCounter < 7)
    //                 {
    //                     if(mapCounter == 6)
    //                     {
    //                         mapCounter = 12;
    //                         getMapImages();
    //                     }
    //                     else
    //                     {
    //                         getMapImages();
    //                     }
    //                     mapCounter++;
    //                 }
    //
    //             },5000)
    //
    //         }
    //     });
    //
    // }

    //my code ----Save pdf
    function getAllDataMakePDF()
    {

        makeTableCanvas();
        console.log(allDataForPDF);
        var allData = JSON.stringify(allDataForPDF);
        //console.log(allData);
        // return;

        // Create a form
        var mapForm = document.createElement("form");
        mapForm.target = "_blank";
        mapForm.method = "POST";
        mapForm.action = "services/makePDF/industryPDF.php";

        // Create an input
        var mapInput = document.createElement("input");
        mapInput.type = "text";
        mapInput.name = "allPDFData";
        mapInput.value = allData;

        // Add the input to the form
        mapForm.appendChild(mapInput);

        // Add the form to dom
        document.body.appendChild(mapForm);

        // Just submit
        mapForm.submit();

        // document.body.removeChild(form);

    }
    //=========================================

function makeTableCanvas(){
    var parm="#logistic_div";
    //console.log(parm);
    return html2canvas($(parm), {
        useCORS: true,
        //optimized: false,
        // allowTaint: false,
        onrendered: function(canvas) {
            var myImage = canvas.toDataURL("image/jpeg,1.0");

            //console.log(canvas);

            var longTable = {};
            longTable["logistic_div"] = myImage;
            allDataForPDF.push(longTable);

        }
    });
}

</script>
