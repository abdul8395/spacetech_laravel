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
    <script>L_PREFER_CANVAS = true;</script>
    <script>L_DIABLE_3D=true;</script>
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

    <script type="text/javascript" src="libraries/js/fusioncharts.js"></script>




    <style>
        #pdfTable{
            background-color:#fff;
        }

    </style>

    <style type="text/css">
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


    var scheme_val='<?php echo $_REQUEST['scheme_val']?>';
    var con_line_lengths='<?php echo $_REQUEST['len']?>';
    var scheme_name='<?php echo $_REQUEST['scheme_name']?>';
    var scheme_type='<?php echo $_REQUEST['scheme_type']?>';
    var cost='<?php echo $_REQUEST['cost']?>';

    //var latlon='';
    //var pss_dist='<?php //echo $_REQUEST['dist']?>//';
    //var pss_teh='<?php //echo $_REQUEST['teh']?>//';
    //var sc_name='';
    //var lat=<?php //echo $_REQUEST['lat']?>//;
    //var lon=<?php //echo $_REQUEST['lon']?>//;
    //var sc_geom=JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');
    //var sc_type='';
    //var sc_district='';
    //var sc_tehsil='';
    //var  cost=<?php //echo $_REQUEST['cost']?>//;
    //var scheme_name='<?php //echo $_REQUEST['scheme_name']?>';
    var ipAddress="202.166.167.121";
    var lineGeom=localStorage.geom
    var lat_start
    var long_start
    var lat_end
    var long_end
    var drawnGeomConnectivity;

    //var funsionChartsData=[];

    // my code
    var allDataForconPDF = [];
    var guagepdf = [];
    //========================================

    function checkAlignWithPss(){

        $.post( "services/connectivity/main_connectivity.php",{"geom":lineGeom}, function(response1) {
            var res=JSON.parse(response1);
            console.log(res);
            createPage(res,'');

        })
    }


    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }


    function createPage(data) {
    var aaaaa=data;
    var districts=[];
    var tehsils=[];
    // console.log(districts=data.ptiai);
    //  console.log(tehsils=data.ptiai);
    for(i=0;i<data.ptiai.length;i++){
        districts.push(data.ptiai[i].district_name)
    }
    console.log(districts)
    for(i=0;i<data.ptiai.length;i++){
        tehsils.push(data.ptiai[i].tehsil_name)
        // console.log(tehsils[i])
    }
    drawnGeomConnectivity=JSON.parse(lineGeom);
    lat_start=drawnGeomConnectivity.coordinates[0][0]
    long_start=drawnGeomConnectivity.coordinates[0][1]
    lat_end=drawnGeomConnectivity.coordinates[drawnGeomConnectivity.coordinates.length-1][0]
    long_end=drawnGeomConnectivity.coordinates[drawnGeomConnectivity.coordinates.length-1][1]
    var str = '<div  class="container-fluid" style="padding-left: 0px;padding-right: 0px;margin-left: 0px;margin-right: 0px;">'+

        //***********************start of top heading**************************************
        '<div class="row" style="margin-left: 0px;">'+
        '<div class="col-md-12">'+
        '<div class="col-md-10" style="padding-right: 0px;">'+
        '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
        'letter-spacing: 0.005em;color: white;margin-top: 20px;">' +
        '<h4 style="text-align: center;border-bottom: solid 1px white">Assessment Report of Road Scheme</h4>' +
        '</div>' +

        '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
        '<h5>Evaluation w.r.t. PSS Alignment</h5>'+
        '</div>'+
        '</div>'+
        '<div class="col-md-2" style="padding-left: 0px;padding-right: 0px;">' +
        '<img src="images/logo.png">'+
        '</div>'+
        '</div>'+
        '</div>'+

        //***********************End of top heading*************************************************
         
        // table 1
        '<div class="row" style="margin-left: 0px;">'+
        // '<div class="col-md-12">'+
        '<div class="col-md-6">'+
        '<table class="table table-bordered table-striped">' +
        '<tr>' +
        '<th colspan="3" align="center">Scheme Summary</th>' +
        '</tr>' +
        '<tr>' +
        '<td>Scheme Name</td>' +
        '<td colspan="2">'+scheme_name+'</td>'+
        '</tr>' +

        '<tr>' +
        '<td>Scheme Cost (Milloion Rs) </td>' +
        '<td colspan="2">'+cost+'</td>'+
        '</tr>' +

        '<tr>' +
        '<td>Lenghth of the Road (Km) </td>' +
        '<td colspan="2">'+con_line_lengths+'</td>'+
        '</tr>' +

        '<tr>' +
        '<td>Scheme Type </td>' +
        '<td colspan="2">'+scheme_type+'</td>'+
        '</tr>' +

        '<tr>' +
        '<td>Tehsil(s) </td>' +
        '<td colspan="2">'+getSTringFromArray(tehsils)+'</td>'+
        '</tr>' +

        '<tr>' +
        '<td>District(s) </td>' +
        '<td colspan="2">'+getSTringFromArray(districts).split(',')[0]+'</td>'+
        '</tr>' +

        //coordinates row start
        '<tr>'+
        '<td rowspan="3" align="center">Coordinates</td>'+
        '<th align="center">Start Point</th>'+
        '<th align="center">End Point</th>'+
        '</tr>'+


        '<tr>'+
        '<td>Lat:'+long_start+'</td>'+
        '<td>Lat:'+long_end+'</td>'+
        '</tr>'+



        '<tr>'+
        '<td>Long:'+lat_start+'</td>'+
        '<td>Long:'+lat_end+'</td>'+
        '</tr>'+
        //coordinates row end


        //assessment row

        '<tr>'+
        '<td rowspan="3" align="center">Assessment Result</td>'+
        '<td colspan="2" align="center">Aligned With PSS </td>'+
        '</tr>'+

        '<tr>'+
        '<td colspan="2" style="text-align:center !important;">'+checkAlignResult(data).split(',')[0]+'</tdcol>'+
        // '<td align="center">No</td>'+
        '</tr>'+
        // '<tr>'+
        // //'<td>value</td>'+
        // '<td colspan="2" style="text-align:center !important;">'+checkAlignResult(data).split(',')[1]+'</td>'+
        // '</tr>'+
        '</table>' +
        '</div>'+

         

        // map img
        '<div class="col-md-6">' +
        '<div id="conn_map_1" width="90%" height="450px"></div>'+
        '</div>'+
        '</div>'+

        // tableCategory
        '<div class="col-md-12">'+
        '<table class="table table-bordered table-striped">' +
        '<tr>' +
        '<th>Category</th><th>Description</th><th>Result</th>' +
        '</tr>' +
        '<tr>' +
        '<td>Category A</td>' +
        '<td>If &gt;75% of Proposed Alignment matches with PSS alignments then PC-I is considered' +
        ' to follow PSS and does not need to be evaluated under second stage.</td>' +
        '<td>'+createCategoryResult(data.categoery[0],'A')+'</td>'+
        '</tr>' +

        '<tr>' +
        '<td>Category B</td><td>If &gt;25% and &lt;75 % of Proposed Alignment matches with PSS alignments then PC-I is considered to ' +
        'moderately follow PSS. It needs to be evaluated in second stage and obtain at least 50% Score.</td>' +
        '<td>'+createCategoryResult(data.categoery[0],'B')+'</td>'+
        '</tr>' +

        '<tr>' +
        '<td>Category C</td><td>If &lt;25 % of Proposed Alignment matches with PSS alignments then PC-I needs to be to obtain at ' +
        'least 75 % score from the second stage checklist</td>' +
        '<td>'+createCategoryResult(data.categoery[0],'C')+'</td>'+
        '</tr>' +
        //'<tr>'+
        //'<td colspan="2">Align With PSS VALUE</td><td>'+

        //  Math.round(checkAlignResult(data.categoery[0]))
       // checkAlignResult(data)
      //   +'</td>' +
      //  '</tr>' +
        '</table>' +
        '</div>'+





        
        // summary table

        '<div>'+tableTwoCreation(data)+'</div>'+
        '<div style="padding-left:30px;padding-right:30px;padding-top:10px;">'+
        '<div style="padding-left:40%;pading-top:20px;padding-bottom:10px;"><h1>Summary</h1></div>'+
        '<table class="table table-bordered table-striped">' +
        '<tr>' +
        '<th style="text-align:center !important;">Buffer In Km</th><th style="text-align:center !important;">Score</th><th style="text-align:center !important;">Impact</th>' +
        '</tr>' +
        '<tr>' +
        '<td style="text-align:center !important;">5 km</td>'+
        '<td style="text-align:center !important;">' + formatNumber((Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
            parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
            parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score)))+'</td>' +

        '<td style="text-align:center !important;">' + parseInt((Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
            parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
            parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))/(parseInt(con_line_lengths))) +'</td>' +
        '</tr>' +

        '<tr>' +
        '<td style="text-align:center !important;">10 km</td>'+
        '<td style="text-align:center !important;">' + formatNumber((Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
            parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
            parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score)))+'</td>' +

        '<td style="text-align:center !important;">' + parseInt((Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
            parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
            parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score))/(parseInt(con_line_lengths))) +'</td>' +
        '</tr>' +

        '<tr>' +
        '<td style="text-align:center !important;">15 km</td>'+
        '<td style="text-align:center !important;">' + formatNumber((Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
            parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
            parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score)))+'</td>' +

        '<td style="text-align:center !important;">' + parseInt((Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
            parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
            parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score))/(parseInt(con_line_lengths))) +'</td>' +
        '</tr>' +

        '<tr>' +
        '<td style="text-align:center !important;">20 km</td>'+
        '<td style="text-align:center !important;">' + formatNumber((Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
            parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
            parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score)))+'</td>' +

        '<td style="text-align:center !important;">' + parseInt((Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
            parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
            parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score))/(parseInt(con_line_lengths))) +'</td>' +
        '</tr>' +


        '</table>' +
        '</div>' +
        '<div>'+tableThreeCreation(data)+'</div>'+
        '<div>'+tableFourCreation(data)+'</div>'+
        '<div>'+tableSixCreation(data)+'</div>'+
        '<div>'+tableSevenCreation(data)+'</div>'+





        // '<div class="col-md-6">' +
        // '<div id="conn_map_1" width="90%" height="450px"></div>'+
        // '</div>'+
        // '</div>'+

       
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
                    '<button class="btn btn-primary" onclick="print_map_1();" style="padding: 10px 10px;font-size: 16px;">Save PDF</button>' +
                '</div>'+
            '</div>';
    $("#myImageId").html(str)


            //my code
            // Table 1 
            var tableOne = {};
                tableOne['tblOneVal_1'] = scheme_name;
                tableOne['tblOneVal_2'] = cost;
                tableOne['tblOneVal_3'] = con_line_lengths;
                tableOne['tblOneVal_4'] = scheme_type;
                tableOne['tblOneVal_5'] = getSTringFromArray(tehsils);
                tableOne['tblOneVal_6'] = getSTringFromArray(districts).split(',')[0];
                tableOne['tblOneVal_7'] = long_start;
                tableOne['tblOneVal_8'] = long_end;
                tableOne['tblOneVal_9'] = long_start;
                tableOne['tblOneVal_10'] = long_end;
                tableOne['tblOneVal_11'] = checkAlignResult(data).split(',')[0];
                allDataForconPDF.push(tableOne);

            // Table Category 
            var tablecat = {};
                tablecat['tblcatVal_1'] = createCategoryResult(data.categoery[0],'A');
                tablecat['tblcatVal_2'] = createCategoryResult(data.categoery[0],'B');
                tablecat['tblcatVal_3'] = createCategoryResult(data.categoery[0],'C');
                allDataForconPDF.push(tablecat);
            // Table Summary
            var tablesumry = {};
                tablesumry['tblsumVal_1score'] = formatNumber((Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                                            parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                                            parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score)));
                                            
                tablesumry['tblsumVal_1impact'] = parseInt((Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                                                parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                                                parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))/(parseInt(con_line_lengths)));
                
                tablesumry['tblsumVal_2score'] = formatNumber((Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                                                parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                                                parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score)));
                                            
                tablesumry['tblsumVal_2impact'] = parseInt((Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                                                parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                                                parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score))/(parseInt(con_line_lengths)));

                tablesumry['tblsumVal_3score'] = formatNumber((Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                                                parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                                                parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score)));
                                            
                tablesumry['tblsumVal_3impact'] = parseInt((Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                                                parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                                                parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score))/(parseInt(con_line_lengths)));
                
                tablesumry['tblsumVal_4score'] = formatNumber((Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                                                parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                                                parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score)));
                                            
                tablesumry['tblsumVal_4impact'] = parseInt((Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                                                parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                                                parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score))/(parseInt(con_line_lengths)));
                allDataForconPDF.push(tablesumry);

            //========================================

    setTimeout(function(){
        map_connectivity_one('conn_map_1',12)
    },1000);



    setTimeout(function(){
        var travel_speed_val='';
        if(scheme_val=='High'){
            travel_speed_val='2';
        }
        else if(scheme_val=='Medium'){
            travel_speed_val='1';
        }
        else{
            travel_speed_val='0';
        }
        var total_score=Math.round(data.directiness[0].score)+ Math.round(travel_speed_val)+Math.round(data.national_natwork[0].class_score)+Math.round(data.ptiai[0].score)+Math.round(data.east_west_con[0].score)+Math.round(data.major_cities_con[0].score);
        var total_score_percent=Math.round(((Math.round(total_score))/12)*100);
        addconnectivityguage('Total Score','total_score',parseInt(total_score))

        addconnectivityguage('Directiness','directiness',parseInt(data.directiness[0].score));
        addconnectivityguage('Connectivity to national network','national_natwork',parseInt(data.national_natwork[0].class_score))
        addconnectivityguage('Travel Speed','travel_speed',parseInt(travel_speed_val))

        addconnectivityguage('Public Transport Infrastructure Accessibility Index','ptiai',parseInt(data.ptiai[0].score))
        addconnectivityguage('East West Connectivity','east_west_con',parseInt(data.east_west_con[0].score))
        addconnectivityguage('Connectivity between Major Cities','major_cities_con',parseInt(data.major_cities_con[0].score))

      
    },3000);

}
    function getSTringFromArray(arr){
        str="";
        for(var i=0;i<arr.length;i++){
            if(i==arr.length-1){
                str=str+arr[i]
            }else{
                str=str+arr[i]+","
            }

        }
        return str;
    }
   
           

        



  function map_connectivity_one(container,zoom) {
        var conn_service='http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_connectivity_v_13022019/MapServer';
        var service2='http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_connectivity_v_72db_12022020/MapServer';
        var conn_ser='http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_dry_port_15022020/MapServer';

      // var map_tw_r = new L.Map(container, {center: [31.615965, 72.38554], zoom: zoom});
        // var roads = L.gridLayer.googleMutant({
        //     type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        // }).addTo(map_tw_r);
      var map_tw_r = new L.Map(container, {center: [31.615965, 72.38554], zoom: zoom});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          //  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          renderer: L.canvas()
      }).addTo(map_tw_r);
        $("#conn_map_1").height(500);
        setTimeout(function(){
            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                {
                    url:conn_service,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map_tw_r);

            L.esri.dynamicMapLayer(
                {
                    url:service2,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map_tw_r);

            punjabAdminDynamicLayer.setLayers([0,1]);

            var punjabAdminDynamicLayer1 = L.esri.dynamicMapLayer(
                {
                    url:conn_ser,
                    opacity : 1,
                    useCors: false
                }
            ).addTo(map_tw_r);

            map_tw_r.invalidateSize();
            var layer=L.geoJSON(drawnGeomConnectivity)
                //.addTo(map_tw_r);
            map_tw_r.fitBounds(layer.getBounds());
            map.removeLayer(layer);
        },5000)

    }



    //my code for guages
    var gaugeCounter = 1;
        //=============================



   function addconnectivityguage(Names,container,val){
        // var arr_val=[];
        //
        // var myobj={}
        // if(container=='total_score'){
        //     myobj={
        //         "chart": {
        //             "theme": "fusion",
        //             "caption": Names,
        //             "lowerLimit": "0",
        //             "upperLimit": "12",
        //             // "numberSuffix": "%",
        //             //  "chartBottomMargin": "40",
        //             //  "valueFontSize": "11",
        //             //"valueFontBold": "0"
        //         },
        //         "colorRange": {
        //             "color": [{
        //                 "minValue": "0",
        //                 "maxValue": "4",
        //                 "code": "#c02d00",
        //                 // "label": "Low",
        //             }, {
        //                 "minValue": "4",
        //                 "maxValue": "8",
        //                 "code": "#f2c500",
        //                 // "label": "Moderate",
        //             }, {
        //                 "minValue": "8",
        //                 "maxValue": "12",
        //                 "code": "#1aaf5d",
        //                 //  "label": "High",
        //             }]
        //         },
        //         "pointers": {
        //             "pointer": [{
        //                 "value": val
        //             }]
        //         }
        //
        //     }
        // }else{
        //     myobj={
        //         "chart": {
        //             "theme": "fusion",
        //             "caption": Names,
        //             "lowerLimit": "0",
        //             "upperLimit": "2",
        //             // "numberSuffix": "%",
        //             //  "chartBottomMargin": "40",
        //             //  "valueFontSize": "11",
        //             //"valueFontBold": "0"
        //         },
        //         "colorRange": {
        //             "color": [{
        //                 "minValue": "0",
        //                 "maxValue": "1",
        //                 "code": "#c02d00",
        //                 // "label": "Low",
        //             }, {
        //                 "minValue": "1",
        //                 "maxValue": "2",
        //                 "code": "#1aaf5d",
        //                 // "label": "Moderate",
        //             }, {
        //                 "minValue": "2",
        //                 "maxValue": "2",
        //                 "code": "#1aaf5d",
        //                 //  "label": "High",
        //             }]
        //         },
        //         "pointers": {
        //             "pointer": [{
        //                 "value": val
        //             }]
        //         }
        //
        //     }
        // }
        // FusionCharts.ready(function(){
        //     var chartObj = new FusionCharts({
        //             type: 'hlineargauge',
        //             renderAt: container,
        //             width: '300',
        //             height: '190',
        //             dataFormat: 'json',
        //             dataSource:myobj
        //         }
        //     );
        //     chartObj.render();
        //     setTimeout(function(){
        //         $("#national_natwork > span > svg > g:eq(1) > text").html('abc');
        //     },5000);
        // });




       var arr_val=[];

       var myobj={}

        arr_val.push(val)
        var color;
         if(container=='total_score'){
            val_new = parseInt(val);
            if (val_new <= 5) {
                color = "red"
                document.getElementById(container).querySelector('h4').innerHTML = '<span style="color: #EF9B0F">' + Names + '</span>';
                document.getElementById(container).querySelector('h6').innerHTML = '<span style="color: #EF9B0F;font-size:16px;">' + val + '</span>';
            } else if (val_new > 5 && val_new <= 7) {
                color = '#EF9B0F';
                document.getElementById(container).querySelector('h4').innerHTML = '<span style="color: #EF9B0F">' + Names + '</span>';
                document.getElementById(container).querySelector('h6').innerHTML = '<span style="color: #EF9B0F;font-size:16px;">' + val + '</span>';
            } else if (val_new > 7) {
                color = 'green';
                document.getElementById(container).querySelector('h4').innerHTML = '<span style="color: #EF9B0F">' + Names + '</span>';
                document.getElementById(container).querySelector('h6').innerHTML = '<span style="color: #EF9B0F;font-size:16px;">' + val + '</span>';
            }

        }
        else {
            val_new = parseInt(val);
            if (val_new <= 1) {
                color = "#EF9B0F"
                document.getElementById(container).querySelector('h4').innerHTML = '<span style="color: #EF9B0F">' + Names + '</span>';
                document.getElementById(container).querySelector('h6').innerHTML = '<span style="color: #EF9B0F;font-size:16px;">' + val + '</span>';
            } else if (val_new > 1 && val_new <= 2) {
                color = '#EF9B0F';
                document.getElementById(container).querySelector('h4').innerHTML = '<span style="color: #EF9B0F">' + Names + '</span>';
                document.getElementById(container).querySelector('h6').innerHTML = '<span style="color: #EF9B0F;font-size:16px;">' + val + '</span>';
            } else if (val_new > 2) {
                color = '#EF9B0F';
                document.getElementById(container).querySelector('h4').innerHTML = '<span style="color: #EF9B0F">' + Names + '</span>';
                document.getElementById(container).querySelector('h6').innerHTML = '<span style="color: #EF9B0F;font-size:16px;">' + val + '</span>';
            }

        }

         if(container=='total_score'){
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
                    {strokeStyle: "#ACDF87", min: 0, max: 5}, // Red from 100 to 130
                    {strokeStyle: "#7FF11C", min: 5, max: 7}, // Yellow
                    {strokeStyle: "#4F9A29", min: 7, max: 12}, // Green
                ],//
                generateGradient: true,
                highDpiSupport: true,     // High resolution support

            };
        }else{
            var opts = {
                //angle: -0.01, // The span of the gauge arc
                lineWidth: 0.14, // The line thickness
               // radiusScale: 1, // Relative radius
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
                    {strokeStyle: "#ACDF87", min: 0, max: 1}, // Red from 100 to 130
                    {strokeStyle: "#4F9A29", min: 1, max: 2} // Yellow
                    //{strokeStyle: "#30B32D", min: 2, max: 3}, // Green
                ],//
                generateGradient: true,
                highDpiSupport: true,     // High resolution support

            };
        }
        var target = document.getElementById(container).querySelector('canvas'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
         if(container=='total_score'){
            gauge.maxValue = 12;
        }else {
            gauge.maxValue = 2; // set max gauge value
        }
        gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 100; // set animation speed (32 is default value)
        gauge.set(val_new); // set actual value





         //my code for gauges
         setTimeout(function() {
            var dataURL = target.toDataURL("image/png");
            //console.log(dataURL);
            var newGuageChart = {};
            newGuageChart['Gauge_'+gaugeCounter] = dataURL;
            newGuageChart['Gauge_'+gaugeCounter+'_name'] = Names;
            newGuageChart['Gauge_'+gaugeCounter+'_value'] = val;
            allDataForconPDF.push(newGuageChart);
            gaugeCounter++
        }, 2000);
        //========================================



    }

    function tableTwoCreation(data){
        var travel_speed_val='';
        if(scheme_val=='High'){
            travel_speed_val='2';
        }
        else if(scheme_val=='Medium'){
            travel_speed_val='1';
        }
        else{
            travel_speed_val='0';
        }
        var total_score=Math.round(data.directiness[0].score)+ Math.round(travel_speed_val)+Math.round(data.national_natwork[0].class_score)+Math.round(data.ptiai[0].score)+Math.round(data.east_west_con[0].score)+Math.round(data.major_cities_con[0].score);
        var total_score_percent=Math.round(((Math.round(total_score))/12)*100);
        if(data.categoery[0].category=='Category A'){
            selected_color='green';
        }
        else if (data.categoery[0].category=='Category B'){
            if(total_score_percent>=50){
                selected_color='green';
            }
            else{
                selected_color='red';
            }
        }
        else if (data.categoery[0].category=='Category C'){
            if(total_score_percent>=75){
                selected_color='green';
            }
            else{
                selected_color='red';
            }
        }

        if(data.categoery[0]) {
            var str =

                            //guage 

                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +
                '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                '<h5>Parameters for Assessment of Proposed Road Project</h5>' +
                '</div>' +
                // '</div>' +

                // '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                // '<div class="col-md-12">' +
                // '<table class="table table-bordered table-striped">' +
                // '<tr>' +
                // '<th>Sr</th><th>Parameter</th><th>Score</th>' +
                // //'<th>Level</th>' +
                // '</tr>' +
                // '<tr>' +
                // '<td>1</td>' +
                // '<td>Directness Ratio</td>' +
                // '<td>' + data.directiness[0].score + '</td>' +
                // //'<td>High</td>'+
                // '</tr>' +
                // '<tr>' +
                // '<td>2</td>' +
                // '<td>Travel Speed Improvement</td>' +
                // '<td>' + travel_speed_val + '</td>' +
                //     //'<td>High</td>'+
                // '</tr>' +
                //
                // '<tr>' +
                // '<td>3</td>' +
                // '<td>Connectivity to National Network</td>' +
                // '<td>' + data.national_natwork[0].class_score + '</td>' +
                // '</tr>' +
                //
                // '<tr>' +
                // '<td>5</td>' +
                // '<td>Project in Transport Deprived Region (PTIAI)</td>' +
                // '<td>' + data.ptiai[0].score + '</td>' +
                //     //'<td>'+data.ptiai[0].ptiai+'</td>s'+
                // '</tr>' +
                //
                // '<tr>' +
                // '<td>5</td>' +
                // '<td>Provides East West Connectivity</td>' +
                // '<td>' + data.east_west_con[0].score + '</td>' +
                // '</tr>' +
                //
                // '<tr>' +
                // '<td>6</td>' +
                // '<td>Connectivity between Major Cities</td>' +
                // '<td>' + data.major_cities_con[0].score + '</td>' +
                // '</tr>' +
                // '<tr bgcolor='+result_row_color+'>' +
                // '<td></td>' +
                // '<td <b> Total Score </b></td>' +
                // '<td> <b><font color='+selected_color+'>' + total_score + ' ('+total_score_percent+'%)</font></b></td>' +
                // '</tr>' +
                //
                // '</table>' +

                '<div class="col-md-12"   style=" text-align:center; margin: auto;">' +
                '<div id="total_score" width="200" height="100">' +
                '<canvas  width="200" height="100">' +
                '</canvas>'+
                '<h4></h4><br />'+
                '<h6></h6><br />'+
                '</div>'+

                '<p></p>'+
                '</div>'+

                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                '<div id="directiness"  width="200" height="190">' +
                '<canvas  width="200" height="100">' +
                '</canvas>'+
                '<h4></h4><br />'+
                '<h6></h6><br />'+
                '</div>'+

                '<p>A Common indicator used to measure accessibility of the two points.It is ration between Network Distance to Euclidean Distance.</p>'+

                '</div>'+
                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                '<div id="national_natwork" width="200" height="190">' +
                '<canvas  width="200" height="100">' +
                '</canvas>'+
                '<h4></h4><br />'+
                '<h6></h6><br />'+
                '</div>'+

                '<p>It includes connectivity to Moterways, CPEC corridor,National and Strategic Highways.</p>'+
                '</div>'+

                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                '<div id="travel_speed" width="200" height="190">' +
                '<canvas  width="200" height="100">' +
                '</canvas>'+
                '<h4></h4><br />'+
                '<h6></h6><br />'+
                '</div>'+

                '<p>Travel speed is based on the type ,width quality and class of road network available between origin and destination under free flow condition.</p>'+
                '</div>'+


                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                '<div id="ptiai" width="200" height="190">' +
                '<canvas  width="200" height="100">' +
                '</canvas>'+
                '<h4></h4><br />'+
                '<h6></h6><br />'+
                '</div>'+

                '<p>Based on Tehsil-wise outcome of Public Transport Infrastructure Accessibility Index,which is developed using impartial methodology for determining transport deprivation.</p>'+
                '</div>'+

                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                '<div id="east_west_con" width="200" height="190">' +
                '<canvas  width="200" height="100">' +
                '</canvas>'+
                '<h4></h4><br />'+
                '<h6></h6><br />'+
                '</div>'+

                '<p>Developing East West connections in Punjab is envisioned in PSS and also a priority by C&W department since national network runs North-South.</p>'+
                '</div>'+



                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                '<div id="major_cities_con" width="200" height="190">' +
                '<canvas  width="200" height="100">' +
                '</canvas>'+
                '<h4></h4><br />'+
                '<h6></h6><br />'+
                '</div>'+

                '<p>Connecting cities and hubs is crucial to develop system of cities planned under PSS.Classificaation of the cities is based on proposed system of cities under PSS.</p>'+
                '</div>'+

                // '<div class="col-md-3"  id="enviroment" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                // '<canvas  width="200" height="100">' +
                // '</canvas>'+
                // '<h4></h4><br />'+
                // '<h6></h6><br />'+
                // '<p>Environment studies the ground water quality, air quality and\n' +
                // 'temperatures around the chosen location.</p>'+
                // '</div>'+
                // '<div class="col-md-3" id="humancapital" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                // '<canvas  width="200" height="100">' +
                // '</canvas>'+
                // '<h4></h4><br />'+
                // '<h6></h6><br />'+
                // '<p>Human Capital accounts for the settlements, government colleges,\n' +
                // 'universities and TEVTA institutes in the areas surrounding the chosen location.</p>'+
                // '</div>'+
                //
                // '<div class="col-md-3" id="institutoin" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                // '<canvas  width="200" height="100">' +
                // '</canvas>'+
                // '<h4></h4><br />'+
                // '<h6></h6><br />'+
                // '<p>Institutions include district headquarters and police stations in the\n' +
                // 'surrounding areas.</p>'+
                // '</div>'+
                // '<div class="col-md-3" id="markets" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                // '<canvas  width="200" height="100">' +
                // '</canvas>'+
                // '<h4></h4><br />'+
                // '<h6></h6><br />'+
                // '<p>Markets examines industry concentration, population and population growth\n' +
                // 'rate, primary and intermediate cities in areas surrounding the site.</p>'+
                // '</div>'+
                // '<div class="col-md-3" id="raw_matrials" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                // '<canvas  width="200" height="100">' +
                // '</canvas>'+
                // '<h4></h4><br />'+
                // '<h6></h6><br />'+
                // '<p>Raw Materials looks into the extent to which minerals, mines and\n' +
                // 'markets are easily accessible from the chosen location.</p>'+
                // '</div>'+
                // '<div class="col-md-3" id="utilities" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                // '<canvas  width="200" height="100">' +
                // '</canvas>'+
                // '<h4></h4><br />'+
                // '<h6></h6><br />'+
                // '<p>Utilities include access to drainage networks, electricity\n' +
                // 'networks, grid stations, gas pipelines, gas stations, ground water tables, irrigation\n' +
                // 'networks and solar radiations.</p>'+
                // '</div>'+

                // '</div>'+
                // '</div>'+
                '</div>';

            return str;
        }else{
            return "nothing found"
        }
    }



   function tableThreeCreation(data){

        var travel_speed_val='';
        if(scheme_val=='High'){
            travel_speed_val='2';
        }
        else if(scheme_val=='Medium'){
            travel_speed_val='1';
        }
        else{
            travel_speed_val='0';
        }

        var total_score=Math.round(data.directiness[0].score)+ Math.round(travel_speed_val)+Math.round(data.national_natwork[0].class_score)+Math.round(data.ptiai[0].score)+Math.round(data.east_west_con[0].score)+Math.round(data.major_cities_con[0].score);
        var total_score_percent=Math.round(((Math.round(total_score))/12)*100);
        var str ='';


        if(data.categoery[0]) {
                    //    stage 2
            str = str+ '<div class="col-md-12"  style="font-size: 20px;text-align: center;padding-left: 30px;padding-right: 30px;padding-bottom:30px;">' +
                '<h1>Stage 2</h1>'+
                '</div>' +
                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +
                '<div class="col-md-3"  style="background-color:green;font-size: 20px;text-align: center;">' +
                '<h5>Factor Scoring for Stage 2 With 5 KM Buffer</h5>' +
                '</div>' +

                '<div class="col-md-3"  style="background-color:yellow;font-size: 20px;text-align: center;">' +
                '<h5>Factor Scoring for Stage 2 With 10 KM Buffer</h5>' +
                '</div>' +

                '<div class="col-md-3"  style="background-color:orange;font-size: 20px;text-align: center;">' +
                '<h5>Factor Scoring for Stage 2 With 15 KM Buffer</h5>' +
                '</div>' +

                '<div class="col-md-3"  style="background-color:blue;font-size: 20px;text-align: center;">' +
                '<h5>Factor Scoring for Stage 2 With 20 KM Buffer</h5>' +
                '</div>' +


                '</div>' +

                // '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                '<div class="col-md-3">' +
                '<table class="table table-bordered " style="background-color:green;">' +
                '<tr>' +
                '<th>Sr</th><th>Parameter</th><th>Parameter Value</th><th>Score</th>' +
                //'<th>Level</th>' +
                '</tr>' +
                '<tr>' +
                '<td>1</td>' +
                '<td>Population</td>' +
                '<td>' +Math.round(data.population5[0].population) + '</td>' +
                '<td>' +Math.round(data.population5[0].score) + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>2</td>' +
                '<td>Railway</td>' +
                '<td>' +data.railway5[0].total_railway_station+ '</td>' +
                '<td>' +data.railway5[0].score+ '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>3</td>' +
                '<td>Dryport</td>' +
                '<td>' + data.dryport5[0].total_dryports + '</td>' +
                '<td>' + data.dryport5[0].score + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>4</td>' +
                '<td>Economic Zone</td>' +
                '<td>' + data.economic_zone5[0].economic_zone + '</td>' +
                '<td>' + data.economic_zone5[0].score + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;align:center;">' +
                '<td>5</td>' +
                '<td><a  onclick="oNOffIndicators('+"'health1'"+')">Health</a></td>' +
                '<td>' + data.health5[0].faclities + '</td>' +
                '<td>' + data.health5[0].score + '</td>' +
                '</tr>' +


                '<tr class="ha1">' +
                '<td>5.1</td>' +
                //'<td rowspan="4"> Health Details</td>' +
                '<td>DHQ</td>' +
                '<td>' + data.health_details5[0].DHQ + '</td>' +
                '<td>' + parseInt(data.health_details5[0].DHQ)*4 + '</td>' +
                '</tr>' +

                '<tr class="ha1" >' +
                '<td>5.2</td>' +
                //'<td></td>' +
                '<td>THQ</td>' +
                '<td>' + data.health_details5[0].THQ + '</td>' +
                '<td>' + parseInt(data.health_details5[0].THQ)*3 + '</td>' +
                '</tr>' +

                '<tr class="ha1" >' +
                '<td>5.3</td>' +
                // '<td></td>' +
                '<td>BHU</td>' +
                '<td>' + data.health_details5[0].BHU +'</td>' +
                '<td>' + data.health_details5[0].BHU +'</td>' +
                '</tr>' +

                '<tr class="ha1" >' +
                '<td>5.4</td>' +
                //'<td></td>' +
                '<td>RHU</td>' +
                '<td>' + data.health_details5[0].RHU +'</td>' +
                '<td>' + parseInt(data.health_details5[0].RHU)*2 +'</td>' +
                '</tr>' +



                '<tr>' +
                '<td>6</td>' +
                '<td>Protected Area</td>' +
                '<td>' + data.protected_area5[0].total_protected_areas + '</td>' +
                '<td>' + data.protected_area5[0].score + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>7</td>' +
                '<td>Total Air Ports</td>' +
                '<td>' + data.total_air_ports5[0].total_air_ports + '</td>' +
                '<td>' + data.total_air_ports5[0].score + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;align:center;">' +
                '<td>8</td>' +
                '<td><a  onclick="oNOffIndicators('+"'industry1'"+')">Industry</td></td>' +
                '<td>'+ sumvals(data.industries_detail5[0].Large_Industries,data.industries_detail5[0].Medium_Industries,data.industries_detail5[0].Small_Industries,0)+ '</td>' +
                '<td>' + data.industry5[0].score + '</td>' +
                '</tr>' +

                '<tr class="in1" >' +
                '<td>8.1</td>' +
                // '<td rowspan="3">Industry Details</td>' +
                '<td>Large Industries</td>' +
                '<td>' + data.industries_detail5[0].Large_Industries + '</td>' +
                '<td>' + parseInt(data.industries_detail5[0].Large_Industries)*3 + '</td>' +

                '</tr>' +

                '<tr class="in1" >' +
                '<td>8.2</td>' +
                //'<td></td>' +
                '<td>Medium Industries</td>' +
                '<td>' + data.industries_detail5[0].Medium_Industries + '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail5[0].Medium_Industries)/10)*2 + '</td>' +
                '</tr>' +

                '<tr class="in1" >' +
                '<td>8.3</td>' +
                //'<td></td>' +
                '<td>Small Industries</td>' +
                '<td>' + data.industries_detail5[0].Small_Industries + '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail5[0].Small_Industries)/100) + '</td>' +
                '</tr>' +


                '<tr style="background-color: #F9F9F9;align:center;">' +
                '<td>9</td>' +
                '<td><a  onclick="oNOffIndicators('+"'education1'"+')">Education</a></td>' +
                '<td>'+sumvals(data.education_details5[0].Primary,data.education_details5[0].Secondary,data.education_details5[0].Colleges,data.education_details5[0].Universities) + '</td>' +
                '<td>' + data.education5[0].sum + '</td>' +
                '</tr>' +

                '<tr class="ed1" >' +
                '<td>9.1</td>' +
                //  '<td rowspan="4"> Education Details</td>' +
                '<td>Primary</td>' +
                '<td>' + data.education_details5[0].Primary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details5[0].Primary)/10)*2 + '</td>' +
                '</tr>' +

                '<tr class="ed1" >' +
                '<td>9.2</td>' +
                //'<td></td>' +
                '<td>Secondary</td>' +
                '<td>' + data.education_details5[0].Secondary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details5[0].Secondary)/10) + '</td>' +
                '</tr>' +

                '<tr class="ed1" >' +
                '<td>9.3</td>' +
                // '<td></td>' +
                '<td>Colleges</td>' +
                '<td>' + data.education_details5[0].Colleges +'</td>' +
                '<td>' + parseInt(data.education_details5[0].Colleges)*3 +'</td>' +
                '</tr>' +

                '<tr class="ed1" >' +
                '<td>9.4</td>' +
                // '<td></td>' +
                '<td>Universities</td>' +
                '<td>' + data.education_details5[0].Universities +'</td>' +
                '<td>' + parseInt(data.education_details5[0].Universities)*4 +'</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;align:center;">' +
                '<td>10</td>' +
                '<td><a  onclick="oNOffIndicators('+"'road1'"+')">Roads</a></td>' +
                '<td>'+sumvals(data.roads_details5[0].Express_Moterways,data.roads_details5[0].Highways,data.roads_details5[0].Primary_Roads,data.roads_details5[0].Secondary_Roads) + '</td>' +
                '<td>' + data.local_roads5[0].score + '</td>' +
                '</tr>' +

                '<tr class="rd1" >' +
                '<td>10.1</td>' +
                // '<td rowspan="4">Roads Detail</td>' +
                '<td>Express Moterways</td>' +
                '<td>' + data.roads_details5[0].Express_Moterways + '</td>' +
                '<td>' + parseInt(data.roads_details5[0].Express_Moterways)*5 + '</td>' +
                '</tr>' +

                '<tr class="rd1" >' +
                '<td>10.2</td>' +
                //'<td></td>' +
                '<td>Highways</td>' +
                '<td>' + data.roads_details5[0].Highways + '</td>' +
                '<td>' + parseInt(data.roads_details5[0].Highways)*4 + '</td>' +
                '</tr>' +

                '<tr class="rd1" >' +
                '<td>10.3</td>' +
                // '<td></td>' +
                '<td>Primary Roads</td>' +
                '<td>' + data.roads_details5[0].Primary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details5[0].Primary_Roads)*3 +'</td>' +
                '</tr>' +

                '<tr class="rd1" >' +
                '<td>10.4</td>' +
                // '<td></td>' +
                '<td>Secondary Roads</td>' +
                '<td>' + data.roads_details5[0].Secondary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details5[0].Secondary_Roads)*2 +'</td>' +
                '</tr>' +
                '<tr>' +

                '<td>11</td>' +
                '<td><b>Total Score</b></td>' +
                '<td></td>' +
                '<td><b>' + (Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                    parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                    parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))+'</b></td>' +
                '</tr>' +

                '<tr>' +
                '<td>12</td>' +
                '<td><b>Impact Factor</b></td>' +
                '<td></td>' +
                '<td><b>' + parseInt((Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                    parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                    parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))/(parseInt(con_line_lengths))) +'</b></td>' +
                // parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))/((parseInt(data.categoery[0].total_length))/1000) +'</b></td>' +
                '</tr>' +


                '</table>' +
                '</div>';
                // my code
                var table1_Parameter = {};
                table1_Parameter['0'] = Math.round(data.population5[0].population);
                table1_Parameter['1'] = data.railway5[0].total_railway_station;
                table1_Parameter['2'] = data.dryport5[0].total_dryports;
                table1_Parameter['3'] = data.economic_zone5[0].economic_zone;
                table1_Parameter['4'] = data.health5[0].faclities;
                table1_Parameter['5'] = data.health_details5[0].DHQ;
                table1_Parameter['6'] = data.health_details5[0].THQ;
                table1_Parameter['7'] = data.health_details5[0].BHU;
                table1_Parameter['8'] = data.health_details5[0].RHU;
                table1_Parameter['9'] = data.protected_area5[0].total_protected_areas;
                table1_Parameter['10'] = data.total_air_ports5[0].total_air_ports;
                table1_Parameter['11'] = sumvals(data.industries_detail5[0].Large_Industries,data.industries_detail5[0].Medium_Industries,data.industries_detail5[0].Small_Industries,0);
                table1_Parameter['12'] = data.industries_detail5[0].Large_Industries;
                table1_Parameter['13'] = data.industries_detail5[0].Medium_Industries;
                table1_Parameter['14'] = data.industries_detail5[0].Small_Industries;
                table1_Parameter['15'] = sumvals(data.education_details5[0].Primary,data.education_details5[0].Secondary,data.education_details5[0].Colleges,data.education_details5[0].Universities);
                table1_Parameter['16'] = data.education_details5[0].Primary;
                table1_Parameter['17'] = data.education_details5[0].Secondary;
                table1_Parameter['18'] = data.education_details5[0].Colleges;
                table1_Parameter['19'] = data.education_details5[0].Universities;
                table1_Parameter['20'] = sumvals(data.roads_details5[0].Express_Moterways,data.roads_details5[0].Highways,data.roads_details5[0].Primary_Roads,data.roads_details5[0].Secondary_Roads);
                table1_Parameter['21'] = data.roads_details5[0].Express_Moterways;
                table1_Parameter['22'] = data.roads_details5[0].Highways;
                table1_Parameter['23'] = data.roads_details5[0].Primary_Roads;
                table1_Parameter['24'] = data.roads_details5[0].Secondary_Roads;
                table1_Parameter['25'] = "0";
                table1_Parameter['26'] = "0";
                
                allDataForconPDF.push(table1_Parameter);
                //end ==========================================

                var table1_score = {};
                table1_score['0'] = Math.round(data.population5[0].score);
                table1_score['1'] = data.railway5[0].score;
                table1_score['2'] = data.dryport5[0].score;
                table1_score['3'] = data.economic_zone5[0].score;
                table1_score['4'] = data.health5[0].score;
                table1_score['5'] = parseInt(data.health_details5[0].DHQ)*4;
                table1_score['6'] = parseInt(data.health_details5[0].THQ)*3;
                table1_score['7'] = data.health_details5[0].BHU;
                table1_score['8'] = parseInt(data.health_details5[0].RHU)*2;
                table1_score['9'] = data.protected_area5[0].score;
                table1_score['10'] = data.total_air_ports5[0].score;
                table1_score['11'] = data.industry5[0].score;
                table1_score['12'] = parseInt(data.industries_detail5[0].Large_Industries)*3;
                table1_score['13'] = parseInt(parseInt(data.industries_detail5[0].Medium_Industries)/10)*2;
                table1_score['14'] = parseInt(parseInt(data.industries_detail5[0].Small_Industries)/100);
                table1_score['15'] = data.education5[0].sum;
                table1_score['16'] = parseInt(parseInt(data.education_details5[0].Primary)/10)*2;
                table1_score['17'] = parseInt(parseInt(data.education_details5[0].Secondary)/10);
                table1_score['18'] = parseInt(data.education_details5[0].Colleges)*3;
                table1_score['19'] = parseInt(data.education_details5[0].Universities)*4;
                table1_score['20'] = data.local_roads5[0].score;
                table1_score['21'] = parseInt(data.roads_details5[0].Express_Moterways)*5;
                table1_score['22'] = parseInt(data.roads_details5[0].Highways)*4;
                table1_score['23'] = parseInt(data.roads_details5[0].Primary_Roads)*3;
                table1_score['24'] = parseInt(data.roads_details5[0].Secondary_Roads)*2;
                table1_score['25'] = (Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                                    parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                                    parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score));
                table1_score['26'] = parseInt((Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                                    parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                                    parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))/(parseInt(con_line_lengths)));
                
                allDataForconPDF.push(table1_score);
                //end ==========================================

            return str;
        }else{
            return "nothing found"
        }

        // stage 2 Table 1 
      

    }

   function sumvals(a,b,c,d){
        var s=parseInt(a);
        var m=parseInt(b);
        var l=parseInt(c);
        var d=parseInt(d);
        return s+m+l+d

    }

    function tableFourCreation(data){

        if(data.categoery[0]) {
            var str =
                //   '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +

                // '</div>' +

                //  '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                '<div class="col-md-3">' +
                '<table class="table table-bordered" style="background-color:yellow;">' +
                '<tr>' +
                '<th>Sr</th><th>Parameter</th><th>Parameter Value</th><th>Score</th>' +
                //'<th>Level</th>' +
                '</tr>' +
                '<tr>' +
                '<td>1</td>' +
                '<td>Population</td>' +
                '<td>' +Math.round(data.population10[0].population) + '</td>' +
                '<td>' +Math.round(data.population10[0].score) + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>2</td>' +
                '<td>Railway</td>' +
                '<td>' +data.railway10[0].total_railway_station+ '</td>' +
                '<td>' +data.railway10[0].score+ '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>3</td>' +
                '<td>Dryport</td>' +
                '<td>' + data.dryport10[0].total_dryports + '</td>' +
                '<td>' + data.dryport10[0].score + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>4</td>' +
                '<td>Economic Zone</td>' +
                '<td>' + data.economic_zone10[0].economic_zone + '</td>' +
                '<td>' + data.economic_zone10[0].score + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;">' +
                '<td>5</td>' +
                '<td><a  onclick="oNOffIndicators('+"'health2'"+')">Health</a></td>' +
                '<td>' + data.health10[0].faclities + '</td>' +
                '<td>' + data.health10[0].score + '</td>' +
                '</tr>' +


                '<tr class="ha2" >' +
                '<td>5.1</td>' +
                //'<td rowspan="4"> Health Details</td>' +
                '<td>DHQ</td>' +
                '<td>' + data.health_details10[0].DHQ + '</td>' +
                '<td>' + parseInt(data.health_details10[0].DHQ)*4 + '</td>' +
                '</tr>' +

                '<tr class="ha2" >' +
                '<td>5.2</td>' +
                //'<td></td>' +
                '<td>THQ</td>' +
                '<td>' + data.health_details10[0].THQ + '</td>' +
                '<td>' + parseInt(data.health_details10[0].THQ)*3 + '</td>' +
                '</tr>' +

                '<tr class="ha2" >' +
                '<td>5.3</td>' +
                // '<td></td>' +
                '<td>BHU</td>' +
                '<td>' + data.health_details10[0].BHU +'</td>' +
                '<td>' + data.health_details10[0].BHU +'</td>' +
                '</tr>' +

                '<tr class="ha2" >' +
                '<td>5.4</td>' +
                //'<td></td>' +
                '<td>RHU</td>' +
                '<td>' + data.health_details10[0].RHU +'</td>' +
                '<td>' + parseInt(data.health_details10[0].RHU)*2 +'</td>' +
                '</tr>' +



                '<tr>' +
                '<td>6</td>' +
                '<td>Protected Area</td>' +
                '<td>' + data.protected_area10[0].total_protected_areas + '</td>' +
                '<td>' + data.protected_area10[0].score + '</td>' +
                '</tr>' +


                '<tr>' +
                '<td>7</td>' +
                '<td>Total Air Ports</td>' +
                '<td>' + data.total_air_ports10[0].total_air_ports + '</td>' +
                '<td>' + data.total_air_ports10[0].score + '</td>' +
                '</tr>' +


                '<tr style="background-color: #F9F9F9;">' +
                '<td>8</td>' +
                '<td><a  onclick="oNOffIndicators('+"'industry2'"+')">Industry</a></td></td>' +
                '<td>'+ sumvals(data.industries_detail10[0].Large_Industries,data.industries_detail10[0].Medium_Industries,data.industries_detail10[0].Small_Industries,0)+ '</td>' +
                '<td>' + data.industry10[0].score + '</td>' +
                '</tr>' +

                '<tr class="in2" >' +
                '<td>8.1</td>' +
                //'<td rowspan="3">Industry Details</td>' +
                '<td>Large Industries</td>' +
                '<td>' + data.industries_detail10[0].Large_Industries + '</td>' +
                '<td>' + parseInt(data.industries_detail10[0].Large_Industries)*3 + '</td>' +

                '</tr>' +

                '<tr class="in2" >' +
                '<td>8.2</td>' +
                //'<td></td>' +
                '<td>Medium Industries</td>' +
                '<td>' + data.industries_detail10[0].Medium_Industries + '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail10[0].Medium_Industries)/10)*2 + '</td>' +

                '</tr>' +

                '<tr class="in2" >' +
                '<td>8.3</td>' +
                //'<td></td>' +
                '<td>Small Industries</td>' +
                '<td>' + data.industries_detail10[0].Small_Industries + '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail10[0].Small_Industries)/100) + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;">' +
                '<td>9</td>' +
                '<td><a  onclick="oNOffIndicators('+"'education2'"+')">Education</a></td>' +
                '<td>'+sumvals(data.education_details10[0].Primary,data.education_details10[0].Secondary,data.education_details10[0].Colleges,data.education_details10[0].Universities) + '</td>' +
                '<td>' + data.education10[0].sum + '</td>' +
                '</tr>' +

                '<tr class="ed2" >' +
                '<td>9.1</td>' +
                //'<td rowspan="4"> Education Details</td>' +
                '<td>Primary</td>' +
                '<td>' + data.education_details10[0].Primary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details10[0].Primary)/10)*2 + '</td>' +
                '</tr>' +

                '<tr class="ed2" >' +
                '<td>9.2</td>' +
                //'<td></td>' +
                '<td>Secondary</td>' +
                '<td>' + data.education_details10[0].Secondary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details10[0].Secondary)/10) + '</td>' +
                '</tr>' +

                '<tr class="ed2" >' +
                '<td>9.3</td>' +
                // '<td></td>' +
                '<td>Colleges</td>' +
                '<td>' + data.education_details10[0].Colleges +'</td>' +
                '<td>' + parseInt(data.education_details10[0].Colleges)*3 +'</td>' +
                '</tr>' +

                '<tr class="ed2" >' +
                '<td>9.4</td>' +
                // '<td></td>' +
                '<td>Universities</td>' +
                '<td>' + data.education_details10[0].Universities +'</td>' +
                '<td>' + parseInt(data.education_details10[0].Universities)*4 +'</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;">' +
                '<td>10</td>' +
                '<td><a  onclick="oNOffIndicators('+"'road2'"+')">Roads</a></td>' +
                '<td>'+sumvals(data.roads_details10[0].Express_Moterways,data.roads_details10[0].Highways,data.roads_details10[0].Primary_Roads,data.roads_details10[0].Secondary_Roads) + '</td>' +
                '<td>' + data.local_roads10[0].score + '</td>' +
                '</tr>' +

                '<tr class="rd2" >' +
                '<td>10.1</td>' +
                // '<td rowspan="4">Roads Detail</td>' +
                '<td>Express Moterways</td>' +
                '<td>' + data.roads_details10[0].Express_Moterways + '</td>' +
                '<td>' + parseInt(data.roads_details10[0].Express_Moterways)*5 + '</td>' +
                '</tr>' +

                '<tr  class="rd2" >' +
                '<td>10.2</td>' +
                //'<td></td>' +
                '<td>Highways</td>' +
                '<td>' + data.roads_details10[0].Highways + '</td>' +
                '<td>' + parseInt(data.roads_details10[0].Highways)*4 + '</td>' +
                '</tr>' +

                '<tr  class="rd2" >' +
                '<td>10.3</td>' +
                // '<td></td>' +
                '<td>Primary Roads</td>' +
                '<td>' + data.roads_details10[0].Primary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details10[0].Primary_Roads)*3 +'</td>' +
                '</tr>' +

                '<tr  class="rd2" >' +
                '<td>10.4</td>' +
                // '<td></td>' +
                '<td>Secondary Roads</td>' +
                '<td>' + data.roads_details10[0].Secondary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details10[0].Secondary_Roads)*2 +'</td>' +
                '</tr>' +

                '<tr>' +
                '<td>11</td>' +
                '<td><b>Total Score</b></td>' +
                '<td></td>' +
                '<td><b>' + (Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score))+'</b></td>' +
                '</tr>' +

                '<tr>' +
                '<td>12</td>' +
                '<td><b>Impact Factor</b></td>' +
                '<td></td>' +
                '<td><b>' + parseInt((Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score))/(parseInt(con_line_lengths))) +'</b></td>' +
                '</tr>' +



                '</table>' +
                '</div>';
                // my code
                var table2_Parameter = {};
                table2_Parameter['0'] = Math.round(data.population10[0].population);
                table2_Parameter['1'] = data.railway10[0].total_railway_station;
                table2_Parameter['2'] = data.dryport10[0].total_dryports;
                table2_Parameter['3'] = data.economic_zone10[0].economic_zone;
                table2_Parameter['4'] = data.health10[0].faclities;
                table2_Parameter['5'] = data.health_details10[0].DHQ;
                table2_Parameter['6'] = data.health_details10[0].THQ;
                table2_Parameter['7'] = data.health_details10[0].BHU;
                table2_Parameter['8'] = data.health_details10[0].RHU;
                table2_Parameter['9'] = data.protected_area10[0].total_protected_areas;
                table2_Parameter['10'] = data.total_air_ports10[0].total_air_ports;
                table2_Parameter['11'] = sumvals(data.industries_detail10[0].Large_Industries,data.industries_detail10[0].Medium_Industries,data.industries_detail10[0].Small_Industries,0);
                table2_Parameter['12'] = data.industries_detail10[0].Large_Industries;
                table2_Parameter['13'] = data.industries_detail10[0].Medium_Industries;
                table2_Parameter['14'] = data.industries_detail10[0].Small_Industries;
                table2_Parameter['15'] = sumvals(data.education_details10[0].Primary,data.education_details10[0].Secondary,data.education_details10[0].Colleges,data.education_details10[0].Universities);
                table2_Parameter['16'] = data.education_details10[0].Primary;
                table2_Parameter['17'] = data.education_details10[0].Secondary;
                table2_Parameter['18'] = data.education_details10[0].Colleges;
                table2_Parameter['19'] = data.education_details10[0].Universities;
                table2_Parameter['20'] = sumvals(data.roads_details10[0].Express_Moterways,data.roads_details10[0].Highways,data.roads_details10[0].Primary_Roads,data.roads_details10[0].Secondary_Roads);
                table2_Parameter['21'] = data.roads_details10[0].Express_Moterways;
                table2_Parameter['22'] = data.roads_details10[0].Highways;
                table2_Parameter['23'] = data.roads_details10[0].Primary_Roads;
                table2_Parameter['24'] = data.roads_details10[0].Secondary_Roads;
                table2_Parameter['25'] = "0";
                table2_Parameter['26'] = "0";
                
                allDataForconPDF.push(table2_Parameter);
                //end ==========================================

                var table2_score = {};
                table2_score['0'] = Math.round(data.population10[0].score);
                table2_score['1'] = data.railway10[0].score;
                table2_score['2'] = data.dryport10[0].score;
                table2_score['3'] = data.economic_zone10[0].score;
                table2_score['4'] = data.health10[0].score;
                table2_score['5'] = parseInt(data.health_details10[0].DHQ)*4;
                table2_score['6'] = parseInt(data.health_details10[0].THQ)*3;
                table2_score['7'] = data.health_details10[0].BHU;
                table2_score['8'] = parseInt(data.health_details10[0].RHU)*2;
                table2_score['9'] = data.protected_area10[0].score;
                table2_score['10'] = data.total_air_ports10[0].score;
                table2_score['11'] = data.industry10[0].score;
                table2_score['12'] = parseInt(data.industries_detail10[0].Large_Industries)*3;
                table2_score['13'] = parseInt(parseInt(data.industries_detail10[0].Medium_Industries)/10)*2;
                table2_score['14'] = parseInt(parseInt(data.industries_detail10[0].Small_Industries)/100);
                table2_score['15'] = data.education10[0].sum;
                table2_score['16'] = parseInt(parseInt(data.education_details10[0].Primary)/10)*2;
                table2_score['17'] = parseInt(parseInt(data.education_details10[0].Secondary)/10);
                table2_score['18'] = parseInt(data.education_details10[0].Colleges)*3;
                table2_score['19'] = parseInt(data.education_details10[0].Universities)*4;
                table2_score['20'] = data.local_roads10[0].score;
                table2_score['21'] = parseInt(data.roads_details10[0].Express_Moterways)*5;
                table2_score['22'] = parseInt(data.roads_details10[0].Highways)*4;
                table2_score['23'] = parseInt(data.roads_details10[0].Primary_Roads)*3;
                table2_score['24'] = parseInt(data.roads_details10[0].Secondary_Roads)*2;
                table2_score['25'] = (Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                                    parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                                    parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score));
                table2_score['26'] = parseInt((Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                                    parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                                    parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score))/(parseInt(con_line_lengths)));
                
                allDataForconPDF.push(table2_score);
                //end ==========================================                

            return str;
        }else{
            return "nothing found"
        }
    }





    function tableSixCreation(data){

        if(data.categoery[0]) {
            var str =
                //'<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +

                //'</div>' +

                // '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                '<div class="col-md-3">' +
                '<table class="table table-bordered" style="background-color:orange;">' +
                '<tr>' +
                '<th>Sr</th><th>Parameter</th><th>Parameter Value</th><th>Score</th>' +
                //'<th>Level</th>' +
                '</tr>' +
                '<tr>' +
                '<td>1</td>' +
                '<td>Population</td>' +
                '<td>' +Math.round(data.population15[0].population) + '</td>' +
                '<td>' +Math.round(data.population15[0].score) + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>2</td>' +
                '<td>Railway</td>' +
                '<td>' +data.railway15[0].total_railway_station+ '</td>' +
                '<td>' +data.railway15[0].score+ '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>3</td>' +
                '<td>Dryport</td>' +
                '<td>' + data.dryport15[0].total_dryports + '</td>' +
                '<td>' + data.dryport15[0].score + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>4</td>' +
                '<td>Economic Zone</td>' +
                '<td>' + data.economic_zone15[0].economic_zone + '</td>' +
                '<td>' + data.economic_zone15[0].score + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;">' +
                '<td>5</td>' +
                '<td><a  onclick="oNOffIndicators('+"'health3'"+')">Health</a></td>' +
                '<td>' + data.health15[0].faclities + '</td>' +
                '<td>' + data.health15[0].score + '</td>' +
                '</tr>' +

                '<tr class="ha3" >' +
                '<td>5.1</td>' +
                //  '<td rowspan="4"> Health Details</td>' +
                '<td>DHQ</td>' +
                '<td>' + data.health_details15[0].DHQ + '</td>' +
                '<td>' + parseInt(data.health_details15[0].DHQ)*4 + '</td>' +
                '</tr>' +

                '<tr class="ha3" >' +
                '<td>5.2</td>' +
                //'<td></td>' +
                '<td>THQ</td>' +
                '<td>' + data.health_details15[0].THQ + '</td>' +
                '<td>' + parseInt(data.health_details15[0].THQ)*3 + '</td>' +
                '</tr>' +

                '<tr class="ha3" >' +
                '<td>5.3</td>' +
                // '<td></td>' +
                '<td>BHU</td>' +
                '<td>' + data.health_details15[0].BHU +'</td>' +
                '<td>' + data.health_details15[0].BHU +'</td>' +
                '</tr>' +

                '<tr class="ha3" >' +
                '<td>5.4</td>' +
                //'<td></td>' +
                '<td>RHU</td>' +
                '<td>' + data.health_details15[0].RHU +'</td>' +
                '<td>' + parseInt(data.health_details15[0].RHU)*2 +'</td>' +
                '</tr>' +



                '<tr>' +
                '<td>6</td>' +
                '<td>Protected Area</td>' +
                '<td>' + data.protected_area15[0].total_protected_areas + '</td>' +
                '<td>' + data.protected_area15[0].score + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>7</td>' +
                '<td>Total Air Ports</td>' +
                '<td>' + data.total_air_ports15[0].total_air_ports + '</td>' +
                '<td>' + data.total_air_ports15[0].score + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;">' +
                '<td>8</td>' +
                '<td><a  onclick="oNOffIndicators('+"'industry3'"+')">Industry</a></td>' +
                '<td>'+ sumvals(data.industries_detail15[0].Large_Industries,data.industries_detail15[0].Medium_Industries,data.industries_detail15[0].Small_Industries,0)+ '</td>' +
                '<td>' + data.industry15[0].score + '</td>' +
                '</tr>' +

                '<tr class="in3" >' +
                '<td>8.1</td>' +
                // '<td rowspan="3">Industry Details</td>' +
                '<td>Large Industries</td>' +
                '<td>' + data.industries_detail15[0].Large_Industries + '</td>' +
                '<td>' + parseInt(data.industries_detail15[0].Large_Industries)*3 + '</td>' +
                '</tr>' +

                '<tr class="in3" >' +
                '<td>8.2</td>' +
                //'<td></td>' +
                '<td>Medium Industries</td>' +
                '<td>' + data.industries_detail15[0].Medium_Industries + '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail15[0].Medium_Industries)/10)*2 + '</td>' +
                '</tr>' +

                '<tr class="in3" >' +
                '<td>8.3</td>' +
                //'<td></td>' +
                '<td>Small Industries</td>' +
                '<td>' + data.industries_detail15[0].Small_Industries + '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail15[0].Small_Industries)/100) + '</td>' +
                '</tr>' +



                '<tr style="background-color: #F9F9F9;">' +
                '<td>9</td>' +
                '<td><a  onclick="oNOffIndicators('+"'education3'"+')">Education</a></td>' +
                '<td>'+sumvals(data.education_details15[0].Primary,data.education_details15[0].Secondary,data.education_details15[0].Colleges,data.education_details15[0].Universities) + '</td>' +
                '<td>' + data.education15[0].sum + '</td>' +
                '</tr>' +


                '<tr class="ed3" >' +
                '<td>9.1</td>' +
                //  '<td rowspan="4"> Education Details</td>' +
                '<td>Primary</td>' +
                '<td>' + data.education_details15[0].Primary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details15[0].Primary)/10)*2 + '</td>' +
                '</tr>' +

                '<tr class="ed3" >' +
                '<td>9.2</td>' +
                //'<td></td>' +
                '<td>Secondary</td>' +
                '<td>' + data.education_details15[0].Secondary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details15[0].Secondary)/10) + '</td>' +
                '</tr>' +

                '<tr class="ed3" >' +
                '<td>9.3</td>' +
                // '<td></td>' +
                '<td>Colleges</td>' +
                '<td>' + data.education_details15[0].Colleges +'</td>' +
                '<td>' + parseInt(data.education_details15[0].Colleges)*3 +'</td>' +
                '</tr>' +

                '<tr class="ed3" >' +
                '<td>9.4</td>' +
                // '<td></td>' +
                '<td>Universities</td>' +
                '<td>' + data.education_details15[0].Universities +'</td>' +
                '<td>' + parseInt(data.education_details15[0].Universities)*4 +'</td>' +
                '</tr>' +



                '<tr style="background-color: #F9F9F9;">' +
                '<td>10</td>' +
                '<td><a  onclick="oNOffIndicators('+"'road3'"+')">Roads</a></td>' +
                '<td>'+sumvals(data.roads_details15[0].Express_Moterways,data.roads_details15[0].Highways,data.roads_details15[0].Primary_Roads,data.roads_details15[0].Secondary_Roads) + '</td>' +
                '<td>' + data.local_roads15[0].score + '</td>' +
                '</tr>' +

                '<tr class="rd3" >' +
                '<td>10.1</td>' +
                // '<td rowspan="4">Roads Detail</td>' +
                '<td>Express Moterways</td>' +
                '<td>' + data.roads_details15[0].Express_Moterways + '</td>' +
                '<td>' + parseInt(data.roads_details15[0].Express_Moterways)*5 + '</td>' +
                '</tr>' +

                '<tr class="rd3" >' +
                '<td>10.2</td>' +
                //'<td></td>' +
                '<td>Highways</td>' +
                '<td>' + data.roads_details15[0].Highways + '</td>' +
                '<td>' + parseInt(data.roads_details15[0].Highways)*4 + '</td>' +
                '</tr>' +

                '<tr class="rd3" >' +
                '<td>10.3</td>' +
                // '<td></td>' +
                '<td>Primary Roads</td>' +
                '<td>' + data.roads_details15[0].Primary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details15[0].Primary_Roads)*3 +'</td>' +
                '</tr>' +

                '<tr class="rd3" >' +
                '<td>10.4</td>' +
                // '<td></td>' +
                '<td>Secondary Roads</td>' +
                '<td>' + data.roads_details15[0].Secondary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details15[0].Secondary_Roads)*2 +'</td>' +
                '</tr>' +


                '<tr>' +
                '<td>11</td>' +
                '<td><b>Total Score<b></td>' +
                '<td></td>' +
                '<td><b>' + (Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score))+'</b></td>' +
                '</tr>' +

                '<tr>' +
                '<td>12</td>' +
                '<td><b>Impact Factor</b></td>' +
                '<td></td>' +
                '<td><b>' + parseInt((Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score))/(parseInt(con_line_lengths))) +'</b></td>' +
                '</tr>' +
                '</table>' +
                '</div>';


                 // my code
                 var table3_Parameter = {};
                table3_Parameter['0'] = Math.round(data.population15[0].population);
                table3_Parameter['1'] = data.railway15[0].total_railway_station;
                table3_Parameter['2'] = data.dryport15[0].total_dryports;
                table3_Parameter['3'] = data.economic_zone15[0].economic_zone;
                table3_Parameter['4'] = data.health15[0].faclities;
                table3_Parameter['5'] = data.health_details5[0].DHQ;
                table3_Parameter['6'] = data.health_details15[0].THQ;
                table3_Parameter['7'] = data.health_details15[0].BHU;
                table3_Parameter['8'] = data.health_details15[0].RHU;
                table3_Parameter['9'] = data.protected_area15[0].total_protected_areas;
                table3_Parameter['10'] = data.total_air_ports15[0].total_air_ports;
                table3_Parameter['11'] = sumvals(data.industries_detail15[0].Large_Industries,data.industries_detail15[0].Medium_Industries,data.industries_detail15[0].Small_Industries,0);
                table3_Parameter['12'] = data.industries_detail15[0].Large_Industries;
                table3_Parameter['13'] = data.industries_detail15[0].Medium_Industries;
                table3_Parameter['14'] = data.industries_detail15[0].Small_Industries;
                table3_Parameter['15'] = sumvals(data.education_details15[0].Primary,data.education_details15[0].Secondary,data.education_details15[0].Colleges,data.education_details15[0].Universities);
                table3_Parameter['16'] = data.education_details15[0].Primary;
                table3_Parameter['17'] = data.education_details15[0].Secondary;
                table3_Parameter['18'] = data.education_details15[0].Colleges;
                table3_Parameter['19'] = data.education_details15[0].Universities;
                table3_Parameter['20'] = sumvals(data.roads_details15[0].Express_Moterways,data.roads_details15[0].Highways,data.roads_details15[0].Primary_Roads,data.roads_details15[0].Secondary_Roads);
                table3_Parameter['21'] = data.roads_details15[0].Express_Moterways;
                table3_Parameter['22'] = data.roads_details15[0].Highways;
                table3_Parameter['23'] = data.roads_details15[0].Primary_Roads;
                table3_Parameter['24'] = data.roads_details15[0].Secondary_Roads;
                table3_Parameter['25'] = "0";
                table3_Parameter['26'] = "0";
                
                allDataForconPDF.push(table3_Parameter);
                //end ==========================================

                var table3_score= {};
                table3_score['0'] = Math.round(data.population15[0].score);
                table3_score['1'] = data.railway15[0].score;
                table3_score['2'] = data.dryport15[0].score;
                table3_score['3'] = data.economic_zone15[0].score;
                table3_score['4'] = data.health15[0].score;
                table3_score['5'] = parseInt(data.health_details15[0].DHQ)*4;
                table3_score['6'] = parseInt(data.health_details15[0].THQ)*3;
                table3_score['7'] = data.health_details15[0].BHU;
                table3_score['8'] = parseInt(data.health_details15[0].RHU)*2;
                table3_score['9'] = data.protected_area15[0].score;
                table3_score['10'] = data.total_air_ports15[0].score;
                table3_score['11'] = data.industry15[0].score;
                table3_score['12'] = parseInt(data.industries_detail15[0].Large_Industries)*3;
                table3_score['13'] = parseInt(parseInt(data.industries_detail15[0].Medium_Industries)/10)*2;
                table3_score['14'] = parseInt(parseInt(data.industries_detail15[0].Small_Industries)/100);
                table3_score['15'] = data.education15[0].sum;
                table3_score['16'] = parseInt(parseInt(data.education_details15[0].Primary)/10)*2;
                table3_score['17'] = parseInt(parseInt(data.education_details15[0].Secondary)/10);
                table3_score['18'] = parseInt(data.education_details15[0].Colleges)*3;
                table3_score['19'] = parseInt(data.education_details15[0].Universities)*4;
                table3_score['20'] = data.local_roads15[0].score;
                table3_score['21'] = parseInt(data.roads_details15[0].Express_Moterways)*5;
                table3_score['22'] = parseInt(data.roads_details15[0].Highways)*4;
                table3_score['23'] = parseInt(data.roads_details15[0].Primary_Roads)*3;
                table3_score['24'] = parseInt(data.roads_details15[0].Secondary_Roads)*2;
                table3_score['25'] = (Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                                    parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                                    parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score));
                table3_score['26'] = parseInt((Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                                    parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                                    parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score))/(parseInt(con_line_lengths)));
                
                allDataForconPDF.push(table3_score);
                //end ==========================================
            return str;
        }else{
            return "nothing found"
        }
    }


     function tableSevenCreation(data){

        if(data.categoery[0]) {
            var str_7 =
                //'<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +

                //'</div>' +

                // '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                '<div class="col-md-3">' +
                '<table class="table table-bordered" style="background-color:blue;">' +
                '<tr>' +
                '<th>Sr</th><th>Parameter</th><th>Parameter Value</th><th>Score</th>' +
                //'<th>Level</th>' +
                '</tr>' +
                '<tr>' +
                '<td>1</td>' +
                '<td>Population</td>' +
                '<td>' +Math.round(data.population20[0].population) + '</td>' +
                '<td>' +Math.round(data.population20[0].score) + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>2</td>' +
                '<td>Railway</td>' +
                '<td>' +data.railway20[0].total_railway_station+ '</td>' +
                '<td>' +data.railway20[0].score+ '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>3</td>' +
                '<td>Dryport</td>' +
                '<td>' + data.dryport20[0].total_dryports + '</td>' +
                '<td>' + data.dryport20[0].score + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>4</td>' +
                '<td>Economic Zone</td>' +
                '<td>' + data.economic_zone20[0].economic_zone + '</td>' +
                '<td>' + data.economic_zone20[0].score + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;">' +
                '<td>5</td>' +
                '<td><a  onclick="oNOffIndicators('+"'health4'"+')">Health</a></td>' +
                '<td>' + data.health20[0].faclities + '</td>' +
                '<td>' + data.health20[0].score + '</td>' +
                '</tr>' +


                '<tr class="ha4" >' +
                '<td>5.1</td>' +
                //'<td rowspan="4"> Health Details</td>' +
                '<td>DHQ</td>' +
                '<td>' + data.health_details20[0].DHQ + '</td>' +
                '<td>' + parseInt(data.health_details20[0].DHQ)*4 + '</td>' +
                '</tr>' +

                '<tr class="ha4" >' +
                '<td>5.2</td>' +
                //'<td></td>' +
                '<td>THQ</td>' +
                '<td>' + data.health_details20[0].THQ + '</td>' +
                '<td>' + parseInt(data.health_details20[0].THQ)*3 + '</td>' +
                '</tr>' +

                '<tr class="ha4" >' +
                '<td>5.3</td>' +
                // '<td></td>' +
                '<td>BHU</td>' +
                '<td>' + data.health_details20[0].BHU +'</td>' +
                '<td>' + data.health_details20[0].BHU +'</td>' +
                '</tr>' +

                '<tr class="ha4" >' +
                '<td>5.4</td>' +
                //'<td></td>' +
                '<td>RHU</td>' +
                '<td>' + data.health_details20[0].RHU +'</td>' +
                '<td>' + parseInt(data.health_details20[0].RHU)*2 +'</td>' +
                '</tr>' +


                '<tr>' +
                '<td>6</td>' +
                '<td>Protected Area</td>' +
                '<td>' + data.protected_area20[0].total_protected_areas + '</td>' +
                '<td>' + data.protected_area20[0].score + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>7</td>' +
                '<td>Total Air Ports</td>' +
                '<td>' + data.total_air_ports20[0].total_air_ports + '</td>' +
                '<td>' + data.total_air_ports20[0].score + '</td>' +
                '</tr>' +

                '<tr style="background-color: #F9F9F9;">' +
                '<td>8</td>' +
                '<td><a  onclick="oNOffIndicators('+"'industry4'"+')">Industry</a></td>' +
                '<td>'+ sumvals(data.industries_detail20[0].Large_Industries,data.industries_detail20[0].Medium_Industries,data.industries_detail20[0].Small_Industries,0)+ '</td>' +
                '<td>' + data.industry20[0].score + '</td>' +
                '</tr>' +

                '<tr class="in4" >' +
                '<td>8.1</td>' +
                //'<td rowspan="3">Industry Details</td>' +
                '<td>Large Industries</td>' +
                '<td>' + data.industries_detail20[0].Large_Industries + '</td>' +
                '<td>' + parseInt(data.industries_detail20[0].Large_Industries)*3 + '</td>' +
                '</tr>' +

                '<tr class="in4" >' +
                '<td>8.2</td>' +
                //'<td></td>' +
                '<td>Medium Industries</td>' +
                '<td>' + data.industries_detail20[0].Medium_Industries+ '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail20[0].Medium_Industries)/10)*2 + '</td>' +
                '</tr>' +

                '<tr class="in4" >' +
                '<td>8.3</td>' +
                //'<td></td>' +
                '<td>Small Industries</td>' +
                '<td>' + data.industries_detail20[0].Small_Industries + '</td>' +
                '<td>' + parseInt(parseInt(data.industries_detail20[0].Small_Industries)/100) + '</td>' +
                '</tr>' +


                '<tr style="background-color: #F9F9F9;">' +
                '<td>9</td>' +
                '<td><a  onclick="oNOffIndicators('+"'education4'"+')">Education</a></td>' +
                '<td>'+sumvals(data.education_details20[0].Primary,data.education_details20[0].Secondary,data.education_details20[0].Colleges,data.education_details20[0].Universities) + '</td>' +
                '<td>' + data.education20[0].sum + '</td>' +
                '</tr>' +

                '<tr class="ed4" >' +
                '<td>9.1</td>' +
                //'<td rowspan="4"> Education Details</td>' +
                '<td>Primary</td>' +
                '<td>' + data.education_details20[0].Primary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details20[0].Primary)/10)*2 + '</td>' +
                '</tr>' +

                '<tr class="ed4" >' +
                '<td>9.2</td>' +
                //'<td></td>' +
                '<td>Secondary</td>' +
                '<td>' + data.education_details20[0].Secondary + '</td>' +
                '<td>' + parseInt(parseInt(data.education_details20[0].Secondary)/10) + '</td>' +
                '</tr>' +

                '<tr class="ed4" >' +
                '<td>9.3</td>' +
                // '<td></td>' +
                '<td>Colleges</td>' +
                '<td>' + data.education_details20[0].Colleges +'</td>' +
                '<td>' + parseInt(data.education_details20[0].Colleges)*3 +'</td>' +
                '</tr>' +

                '<tr class="ed4" >' +
                '<td>9.4</td>' +
                // '<td></td>' +
                '<td>Universities</td>' +
                '<td>' + data.education_details20[0].Universities +'</td>' +
                '<td>' + parseInt(data.education_details20[0].Universities)*4 +'</td>' +
                '</tr>' +


                '<tr  style="background-color: #F9F9F9;">' +
                '<td>10</td>' +
                '<td><a  onclick="oNOffIndicators('+"'road4'"+')">Roads</a></td>' +
                '<td>'+sumvals(data.roads_details20[0].Express_Moterways,data.roads_details20[0].Highways,data.roads_details20[0].Primary_Roads,data.roads_details20[0].Secondary_Roads) + '</td>' +
                '<td>' + data.local_roads20[0].score + '</td>' +
                '</tr>' +

                '<tr class="rd4" >' +
                '<td>10.1</td>' +
                //'<td rowspan="4">Roads Detail</td>' +
                '<td>Express Moterways</td>' +
                '<td>' + data.roads_details20[0].Express_Moterways + '</td>' +
                '<td>' + parseInt(data.roads_details20[0].Express_Moterways)*5 + '</td>' +
                '</tr>' +

                '<tr class="rd4" >' +
                '<td>10.2</td>' +
                //'<td></td>' +
                '<td>Highways</td>' +
                '<td>' + data.roads_details20[0].Highways + '</td>' +
                '<td>' + parseInt(data.roads_details20[0].Highways)*4 + '</td>' +
                '</tr>' +

                '<tr class="rd4" >' +
                '<td>10.3</td>' +
                // '<td></td>' +
                '<td>Primary Roads</td>' +
                '<td>' + data.roads_details20[0].Primary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details20[0].Primary_Roads)*3 +'</td>' +
                '</tr>' +

                '<tr class="rd4" >' +
                '<td>10.4</td>' +
                // '<td></td>' +
                '<td>Secondary Roads</td>' +
                '<td>' + data.roads_details20[0].Secondary_Roads +'</td>' +
                '<td>' + parseInt(data.roads_details20[0].Secondary_Roads)*2 +'</td>' +
                '</tr>' +



                '<tr>' +
                '<td>11</td>' +
                '<td><b>Total Score</b></td>' +
                '<td></td>' +
                '<td><b>' + (Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score))+'</b></td>' +
                '</tr>' +

                '<tr>' +
                '<td>12</td>' +
                '<td><b>Impact Factor</td>' +
                '<td></td>' +
                '<td><b>' + parseInt((Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score))/(parseInt(con_line_lengths))) +'</b></td>' +
                '</tr>' +




                '</table>' +
                '</div>'+
                '</div>';

                 // my code
                 var table4_Parameter = {};
                table4_Parameter['0'] = Math.round(data.population20[0].population);
                table4_Parameter['1'] = data.railway20[0].total_railway_station;
                table4_Parameter['2'] = data.dryport20[0].total_dryports;
                table4_Parameter['3'] = data.economic_zone20[0].economic_zone;
                table4_Parameter['4'] = data.health20[0].faclities;
                table4_Parameter['5'] = data.health_details20[0].DHQ;
                table4_Parameter['6'] = data.health_details20[0].THQ;
                table4_Parameter['7'] = data.health_details20[0].BHU;
                table4_Parameter['8'] = data.health_details20[0].RHU;
                table4_Parameter['9'] = data.protected_area20[0].total_protected_areas;
                table4_Parameter['10'] = data.total_air_ports20[0].total_air_ports;
                table4_Parameter['11'] = sumvals(data.industries_detail20[0].Large_Industries,data.industries_detail20[0].Medium_Industries,data.industries_detail20[0].Small_Industries,0);
                table4_Parameter['12'] = data.industries_detail20[0].Large_Industries;
                table4_Parameter['13'] = data.industries_detail20[0].Medium_Industries;
                table4_Parameter['14'] = data.industries_detail20[0].Small_Industries;
                table4_Parameter['15'] = sumvals(data.education_details20[0].Primary,data.education_details20[0].Secondary,data.education_details20[0].Colleges,data.education_details20[0].Universities);
                table4_Parameter['16'] = data.education_details20[0].Primary;
                table4_Parameter['17'] = data.education_details20[0].Secondary;
                table4_Parameter['18'] = data.education_details20[0].Colleges;
                table4_Parameter['19'] = data.education_details20[0].Universities;
                table4_Parameter['20'] = sumvals(data.roads_details20[0].Express_Moterways,data.roads_details20[0].Highways,data.roads_details20[0].Primary_Roads,data.roads_details20[0].Secondary_Roads);
                table4_Parameter['21'] = data.roads_details20[0].Express_Moterways;
                table4_Parameter['22'] = data.roads_details20[0].Highways;
                table4_Parameter['23'] = data.roads_details20[0].Primary_Roads;
                table4_Parameter['24'] = data.roads_details20[0].Secondary_Roads;
                table4_Parameter['25'] = "0";
                table4_Parameter['26'] = "0";
                
                allDataForconPDF.push(table4_Parameter);
                //end ==========================================

                var table4_score= {};
                table4_score['0'] = Math.round(data.population20[0].score);
                table4_score['1'] = data.railway20[0].score;
                table4_score['2'] = data.dryport20[0].score;
                table4_score['3'] = data.economic_zone20[0].score;
                table4_score['4'] = data.health20[0].score;
                table4_score['5'] = parseInt(data.health_details20[0].DHQ)*4;
                table4_score['6'] = parseInt(data.health_details20[0].THQ)*3;
                table4_score['7'] = data.health_details20[0].BHU;
                table4_score['8'] = parseInt(data.health_details20[0].RHU)*2;
                table4_score['9']  = data.protected_area20[0].score;
                table4_score['10'] = data.total_air_ports20[0].score;
                table4_score['11'] = data.industry20[0].score;
                table4_score['12'] = parseInt(data.industries_detail20[0].Large_Industries)*3;
                table4_score['13'] = parseInt(parseInt(data.industries_detail20[0].Medium_Industries)/10)*2;
                table4_score['14'] = parseInt(parseInt(data.industries_detail20[0].Small_Industries)/100);
                table4_score['15'] = data.education20[0].sum;
                table4_score['16'] = parseInt(parseInt(data.education_details20[0].Primary)/10)*2;
                table4_score['17'] = parseInt(parseInt(data.education_details20[0].Secondary)/10);
                table4_score['18'] = parseInt(data.education_details20[0].Colleges)*3;
                table4_score['19'] = parseInt(data.education_details20[0].Universities)*4;
                table4_score['20'] = data.local_roads20[0].score;
                table4_score['21'] = parseInt(data.roads_details20[0].Express_Moterways)*5;
                table4_score['22'] = parseInt(data.roads_details20[0].Highways)*4;
                table4_score['23'] = parseInt(data.roads_details20[0].Primary_Roads)*3;
                table4_score['24'] = parseInt(data.roads_details20[0].Secondary_Roads)*2;
                table4_score['25'] = (Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                                    parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                                    parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score));
                table4_score['26'] = parseInt((Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                                    parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                                    parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score))/(parseInt(con_line_lengths)));
                
                allDataForconPDF.push(table4_score);
                //end ==========================================
            return str_7;
        }else{
            return "nothing found"
        }
    }



    function checkAlignResult(data){
        var travel_speed_val='';
        if(scheme_val=='High'){
            travel_speed_val='2';
        }
        else if(scheme_val=='Medium'){
            travel_speed_val='1';
        }
        else{
            travel_speed_val='0';
        }
        var total_score=Math.round(data.directiness[0].score)+ Math.round(travel_speed_val)+Math.round(data.national_natwork[0].class_score)+Math.round(data.ptiai[0].score)+Math.round(data.east_west_con[0].score)+Math.round(data.major_cities_con[0].score);
        var total_score_percent=Math.round(((Math.round(total_score))/12)*100);
        // if(data){
        if(data.categoery[0].category=='Category A'){
            return 'OK'+','+total_score_percent;
        }
        else if (data.categoery[0].category=='Category B'){
            if(total_score_percent>=50){
                return 'OK'+','+total_score_percent;
            }else{
                return 'X'+','+total_score_percent;
            }
        }
        else if (data.categoery[0].category=='Category C'){
            if(total_score_percent>=75){
                return 'OK'+','+total_score_percent;
            }else{
                return 'X'+','+total_score_percent;
            }
        }else{
            return 'X'+','+total_score_percent;
        }

        // }else{
        //     return "Not Aligned";
        // }
    }

    function createCategoryResult(res,cat){
        if(cat=='A'){
            if(res) {
                if (res.category == 'Category A') {
                    return 'OK'
                } else {
                    return 'X'
                }
            }else{
                return 'X'
            }
        }
        if(cat=='B'){
            if(res) {
                if (res.category == 'Category B') {
                    return 'OK'
                } else {
                    return 'X'
                }
            }else{
                return 'X'
            }
        }

        if(cat=='C'){
            if(res) {
                if (res.category == 'Category C') {
                    return 'OK'
                } else {
                    return 'X'
                }
            }else{
                return 'X'
            }
        }

    }






    // its recursive method
    function print_map_1(){
         var parm="#conn_map_1"
        return html2canvas($(parm), {
            useCORS: true,
            //optimized: false,
           // allowTaint: false,
            onrendered: function(canvas) {
                var myImage = canvas.toDataURL("image/jpeg,1.0");

                // my code for map1
                var mapImage = {};
                mapImage["conn_map_1"] = myImage;
                allDataForconPDF.push(mapImage);
                // =================================


                var str='<img src="'+myImage+'"/>'
                $(parm).html('');
                $(parm).html(str);

                    // createPDF();
                    getAllDataMakePDF();
                    

            }
        });


    }



    var health1=true;
    var health2=true;
    var health3=true;
    var health4=true;
    var industry1=true;
    var industry2=true;
    var industry3=true;
    var industry4=true;
    var education1=true;
    var education2=true;
    var education3=true;
    var education4=true;
    var road1=true;
    var road2=true;
    var road3=true;
    var road4=true;

    function oNOffIndicators(val){
        if(val=='health1') {
            if (health1 == false) {
                health1 = true;
                $(".ha1").show();
            } else {
                health1 = false;
                $(".ha1").hide();
            }
        }
        if(val=='health2') {
            if (health2 == false) {
                health2 = true;
                $(".ha2").show();
            } else {
                health2 = false;
                $(".ha2").hide();
            }
        }
        if(val=='health3') {
            if (health3 == false) {
                health3 = true;
                $(".ha3").show();
            } else {
                health3 = false;
                $(".ha3").hide();
            }
        } if(val=='health4') {
            if (health4 == false) {
                health4 = true;
                $(".ha4").show();
            } else {
                health4 = false;
                $(".ha4").hide();
            }
        }
        if(val=='industry1') {
            if (industry1 == false) {
                industry1 = true;
                $(".in1").show();
            } else {
                industry1 = false;
                $(".in1").hide();
            }
        }
        if(val=='industry2') {
            if (industry2 == false) {
                industry2 = true;
                $(".in2").show();
            } else {
                industry2 = false;
                $(".in2").hide();
            }
        }
        if(val=='industry3') {
            if (industry3 == false) {
                industry3 = true;
                $(".in3").show();
            } else {
                industry3 = false;
                $(".in3").hide();
            }
        }
        if(val=='industry4') {
            if (industry4 == false) {
                industry4 = true;
                $(".in4").show();
            } else {
                industry4 = false;
                $(".in4").hide();
            }
        }

        if(val=='education1') {
            if (education1 == false) {
                education1 = true;
                $(".ed1").show();
            } else {
                education1 = false;
                $(".ed1").hide();
            }
        }
        if(val=='education2') {
            if (education2 == false) {
                education2= true;
                $(".ed2").show();
            } else {
                education2 = false;
                $(".ed2").hide();
            }
        }
        if(val=='education3') {
            if (education3 == false) {
                education3 = true;
                $(".ed3").show();
            } else {
                education3 = false;
                $(".ed3").hide();
            }
        }
        if(val=='education4') {
            if (education4 == false) {
                education4 = true;
                $(".ed4").show();
            } else {
                education4 = false;
                $(".ed4").hide();
            }
        }
        if(val=='road1') {
            if (road1 == false) {
                road1 = true;
                $(".rd1").show();
            } else {
                road1 = false;
                $(".rd1").hide();
            }
        }
        if(val=='road2') {
            if (road2 == false) {
                road2 = true;
                $(".rd2").show();
            } else {
                road2 = false;
                $(".rd2").hide();
            }
        }if(val=='road3') {
            if (road3 == false) {
                road3 = true;
                $(".rd3").show();
            } else {
                road3 = false;
                $(".rd3").hide();
            }
        }if(val=='road4') {
            if (road4 == false) {
                road4 = true;
                $(".rd4").show();
            } else {
                road4 = false;
                $(".rd4").hide();
            }
        }
    }


    function createPDF(){
       // var base64Img = null;
       //  margins = {
       //      top: 70,
       //      bottom: 40,
       //      left: 30,
       //      width: 800
       //  };
       //  var pdf = new jsPDF('p', 'pt', 'a4');
       //  pdf.setFontSize(18);
       //  pdf.fromHTML(document.getElementById('myImageId'),
       //      margins.left, // x coord
       //      margins.top,
       //      {
       //          // y coord
       //          width: margins.width// max width of content on PDF
       //      },function(dispose) {
       //          headerFooterFormatting(pdf)
       //      },
       //      margins);
       //
       //  var iframe = document.createElement('iframe');
       //  iframe.setAttribute('style','position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;');
       //  document.body.appendChild(iframe);
       //
       //  iframe.src = pdf.output('datauristring');
          //      window.print();

       // var pdf = new jsPDF('p', 'pt', 'letter'),
           // source = $('#myImageId'),
            // specialElementHandlers = {
            //     '#table_stock': function(element, renderer) {
            //         return true
            //     }
            // }
        // margins = {
        //     top: 60,
        //     bottom: 60,
        //     left: 40,
        //     width: 522
        // };
        // pdf.fromHTML(
        //     source, margins.left, margins.top, {
        //         'width': margins.width
        //         //'elementHandlers': specialElementHandlers
        //     },
        //     function(dispose) {
        //         pdf.save('Stockreport.pdf');
        //     },
        //     margins
        // )

       //  var pdf = new jsPDF('p','pt','letter');
       // //  var len_html=document.getElementById('myImageId');
       //
       //  pdf.addHTML(document.querySelector('#myImageId'), function() {
       //      pdf.save('pdfTable.pdf');
       //  });

        // html2canvas($("#myImageId"), {
        //     onrendered: function(canvas) {
        //         var imgData = canvas.toDataURL(
        //             'image/png');
        //         var doc = new jsPDF('p', 'mm');
        //         doc.addImage(imgData, 'PNG', 10, 10);
        //         doc.save('sample-file.pdf');
        //     }
        // });

        // return html2canvas($("#myImageId"), {
        //     background: "#ffffff",
        //     onrendered: function(canvas) {
        //         var myImage = canvas.toDataURL("image/jpeg,1.0");
        //         // Adjust width and height
        //         var imgWidth = (canvas.width * 20) / 160;
        //         var imgHeight = (canvas.height * 10) / 160;
        //         // jspdf changes
        //         var pdf = new jsPDF('p', 'mm', 'a3');
        //         pdf.addImage(myImage, 'JPEG', 10, 10, imgWidth, imgHeight); // 2: 19
        //         pdf.save('Download.pdf');
        //     }
        // });

        //print_map_1();

        //setTimeout(function(){

        return html2canvas($("#myImageId"), {
             useCORS: true,
             optimized: false,
             allowTaint: false,
            onrendered: function(canvas) {
                //! MAKE YOUR PDF
                var pdf;
                for (var i = 0; i <= parseInt($("#myImageId")[0].clientHeight/1640); i++) {


                       if(i==1){

                           var srcImg = canvas;
                           var sX = 0;
                           var sY = 2000 * i; // start 980 pixels down for every new page
                           var sWidth = canvas.width;
                           var sHeight = 2000;
                           var dX = 0;
                           var dY = 0;
                           var dWidth = canvas.width;
                           var dHeight = 2000;
                           var w = (dWidth) * 0.75;
                           var h = (dHeight) * 0.75;

                       }
                       // else if(i==2){
                       //
                       //         var srcImg = canvas;
                       //         var sX = 0;
                       //         var sY = 1650 * i; // start 980 pixels down for every new page
                       //         var sWidth = canvas.width;
                       //         var sHeight = 1650;
                       //         var dX = 0;
                       //         var dY = 0;
                       //         var dWidth = canvas.width;
                       //         var dHeight = 1650;
                       //         var w = (dWidth) * 0.75;
                       //         var h = (dHeight) * 0.75;
                       //
                       //
                       // }else if(i==3){
                       //
                       //     var srcImg = canvas;
                       //     var sX = 0;
                       //     var sY = 1520 * i; // start 980 pixels down for every new page
                       //     var sWidth = canvas.width;
                       //     var sHeight = 1520;
                       //     var dX = 0;
                       //     var dY = 0;
                       //     var dWidth = canvas.width;
                       //     var dHeight = 1520;
                       //     var w = (dWidth) * 0.75;
                       //     var h = (dHeight) * 0.75;
                       //
                       //
                       // }
                       else {
                           var srcImg = canvas;
                           var sX = 0;
                           var sY = 2000 * i; // start 980 pixels down for every new page
                           var sWidth = canvas.width;
                           var sHeight = 2000;
                           var dX = 0;
                           var dY = 0;
                           var dWidth = canvas.width;
                           var dHeight = 2000;
                           var w = (dWidth) * 0.75;
                           var h = (dHeight) * 0.75;
                       }

                        if(i==0){
                            pdf = new jsPDF('p', 'mm',[w , h],true)
                        }


                        window.onePageCanvas = document.createElement("canvas");
                        onePageCanvas.setAttribute('width', dWidth);
                        onePageCanvas.setAttribute('height', dHeight);
                        var ctx = onePageCanvas.getContext('2d');
                        // details on this usage of this function:
                        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                        ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

                        // document.body.appendChild(canvas);
                        var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

                        // var a = document.createElement('a');
                        // a.href = canvasDataURL;
                        // a.download = 'myfile.png';
                        // a.click();

                        var pdf_p_width = (onePageCanvas.width) * 0.75;
                        var pdf_p_height = onePageCanvas.height * 0.75;

                        //! If we're on anything other than the first page,
                        // add another page
                        if (i > 0) {
                       pdf.addPage(pdf_p_width, pdf_p_height); //8.5" x 11" in pts (in*72)
                          }
                        //! now we declare that we're working on that page
                       pdf.setPage(i + 1);
                        //! now we add content to that page!

                       pdf.addImage(canvasDataURL, 'JPEG', 0, 0, pdf_p_width, pdf_p_height);


                }

                    //! after the for loop is finished running, we save the pdf.
                   pdf.save('connectivity.pdf');

            }
        });

      //   },10000)

    }


    function createSvgToCanvas(container,index){

     //   var item = document.body.querySelector('g[class^=\'raphael-group-\']');
     //    item.parentNode.removeChild(item);
      //   var svgElements= container.find('svg');
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
        // container.className = "tempHide";
        //     $(container).hide();

        //document.getElementById(container).innerHTML=encodedData;

        var text = document.createTextNode(funsionChartsData[index].getSVGString());
        document.getElementById("msg").innerHTML=text;
        // converting SVG to Base64
       // var s_base64 = new XMLSerializer().serializeToString(document.getElementById("msg"));
        var s_base64 = new XMLSerializer().serializeToString(text);

        // canvg('canvas', s_base64);
     //   var canvas = document.getElementById("canvas");
       // var img = canvas.toDataURL("image/png");
        // using btoa to convert serialized SVG string to Base64
        console.log(s_base64);
        var encodedData = window.btoa(s_base64);
        console.log(encodedData);
     //   $(container).html("<img src=data:image/jpeg;charset=utf-8;base64, "+s_base64+">");
      //  document.getElementById("msgbase64").innerHTML=encodedData;




    }





  


 


    console.log(allDataForconPDF);

    //my code to send  all data Array ----Save pdf
    function getAllDataMakePDF()
    {

        // makeTableCanvas();
        // console.log(allDataForconPDF);
        var allData = JSON.stringify(allDataForconPDF);
        // console.log(allData);
        // return;

        // Create a form
        var mapForm = document.createElement("form");
        mapForm.target = "_blank";
        mapForm.method = "POST";
        mapForm.action = "services/makePDF/connectivityPDF.php";

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
    
    // loader 
   $(document).ready(function(){
        $("#loader").show();

        checkAlignWithPss();

        setTimeout(function()
        {
            $("#loader").hide();
        },10000);
    }); 

</script>



