var drawnGeomConnectivity='';
var drawConLayer={};
var drawConLayer1={};
var cost="";
var scheme_name="";
var scheme_type="";
var scheme_val="";
var result_row_color='#e0e0d1';
var selected_color='';
var con_kmls=false;
var con_shps=false;
var cdc='';
var con_line_lengths;
var lat_start
var long_start
var lat_end
var long_end


angular.module('connectivityController',[])
.directive('connectivityTemplate',function(){
    return{
        restrict : 'E',
        templateUrl : 'template/connectivity.html',
        controller : ['$scope','$http','$timeout','$mdDialog','$compile',function($scope,$http,$timeout,$mdDialog,$compile){

            $scope.addConnectivityPcOne=function(){
                map.removeLayer(drawConLayer);
                var str_type='<option>Select Scheme Type</option>';
                $.post( "services/connectivity/connectivity_scheme_types.php",'', function(response1) {
                    //alert(response1);

                    for(var i=0;i<response1.length;i++){
                        str_type=str_type+'<option value="'+response1[i].category+'">'+response1[i].scheme_type+'</option>';
                    }

                    $mdDialog.show({
                    controller: connectivityDialogsController,
                    template:
                    '<md-dialog id="dt_dialog" aria-label="drive time">' +
                    '<md-toolbar>' +
                    '<div class="md-toolbar-tools" style="background-color:#29323C;color:#7A7B7C;">' +
                    '<h2>Scheme Info</h2>' +
                    '<span flex></span>' +
                    '<md-button class="md-icon-button" ng-click="cancel()">' +
                    '<md-icon md-svg-src="images/ic_clear_black_24px.svg" class="editColor" aria-label="Close dialog">' +
                    '</md-icon>' +
                    '</md-button>' +
                    '</div>' +
                    '</md-toolbar>'+
                    '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width:500px;">' +
                    '<form id="geom_radio">' +
                    '<table class="table borderless">' +
                    '<tr>' +
                    '<td style="padding-top: 12px;">Scheme Name:</td>' +
                    '<td><input class="form-control" style="height: 40px;" type="text" name="scheme_nam" placeholder="scheme name" value="scheme1"  id="scheme_name"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="padding-top: 12px;">Enter Cost:</td>' +
                    '<td><input class="form-control" style="height: 40px;" type="text" name="cost" placeholder="enter cost"  id="cost"></td>' +
                    '</tr>' +
                    '<tr style="height: 40px;">' +
                    '<td>File Type</td>' +
                    '<td>' +
                    '<span style="margin-right: 30px;"><input style="margin-top: 0;margin-right: 10px" type="radio" id="shp_up"  name="geom" value="point">upload shp</span>' +
                    '<span><input style="margin-top: 0;margin-right: 10px" type="radio" id="kml_up" name="geom"  value="polygon">upload kml</span>' +
                    '</td>' +
                    '</tr>' +
                    '<tr id="shp_display" style="display:none;">'+
                    '<td style="padding-top: 12px;">Upload SHP</td>'+
                    '<td><input type="file" id="shp_con" class="fileclass" class="form-control ng-hide"  accept=".zip"/></td>' +
                    // '<button  type="button" ng-click="uploadFile('+"'shp_con'"+')" class="btn-subnav dropdown-toggle bg_style" data-toggle="dropdown">' +
                    // '<span class="glyphicon glyphicon-file"></span>' +
                    // 'SHP' +
                    // '</button></td>'+
                    '</tr>'+
                    '<tr id="kml_display" style="display:none;">'+
                    '<td style="padding-top: 12px;">Upload KML</td>'+
                    '<td><input type="file" id="kml_con" class="fileclass" class="form-control ng-hide"  accept=".kml"/></td>' +
                    // '<button  type="button" ng-click="uploadFile('+"'shp_con'"+')" class="btn-subnav dropdown-toggle bg_style" data-toggle="dropdown">' +
                    // '<span class="glyphicon glyphicon-file"></span>' +
                    // 'SHP' +
                    // '</button></td>'+
                    '</tr>'+
                    '<tr><td style="padding-top: 12px;">Scheme Type:</td><td><select class="form-control" style="border-radius: 0;" onchange="" id="pss_con_scheme">' +

                    '</select></td></tr>'+
                    '</table></form></div>' +
                    '<div style="margin-bottom: 30px;margin-right: 10px;">' +
                    '<md-button style="float: right;background-image: unset;border-radius: 0;"  ng-click="addNewLineForScheme()" class="btn btn-primary">' +
                    'Draw Line' +
                    '</md-button>' +
                    '</div>' +
                    '</md-dialog>',
                    parent: angular.element(document.body),
                    //targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                setTimeout(function(){
                        $("#pss_con_scheme").html(str_type);
                    $("#kml_con").on("change", function (e) {
                        var file = $(this)[0].files[0];
                        addConnectivityKml(file);
                        this.value = null;
                        con_kmls=true;
                    });

                    $("#shp_con").on("change", function (e) {
                        var file = $(this)[0].files[0];
                        addConnectivityShapefile(file);
                        this.value = null;
                        con_shps=true;
                    });

                    $("#shp_up").on("change", function (e) {
                            $("#shp_display").show();
                            $("#kml_display").hide();
                    });

                    $("#kml_up").on("change", function (e) {
                            $("#shp_display").hide();
                            $("#kml_display").show();
                    });


                },300)
                })
            }



            $scope.uploadFile = function (id) {
                angular.element(document.querySelector('#'+id+'')).click();
            };



            function connectivityDialogsController($scope, $mdDialog){
                cdc=$scope;
                $scope.cancel=function(){
                    $mdDialog.cancel();

                }

                $scope.addNewLineForScheme=function(){
                    scheme_name = $("#scheme_name").val();
                    cost=$("#cost").val();
                    scheme_type=$('#pss_con_scheme option:selected').text();
                    scheme_val=$('#pss_con_scheme').val();
                    scheme_name = $("#scheme_name").val();
                    cost=$("#cost").val();
                    scheme_type=$('#pss_con_scheme option:selected').text();
                    scheme_val=$('#pss_con_scheme').val();
                    map.removeLayer(drawConLayer1);
                    //alert(scheme_val);
                    if(scheme_type =='Select Scheme Type'){
                        alert("Please Select Scheme Type First");
                        return;
                    }

                    else if(cost==""){
                        alert("Please Enter Cost Of the Scheme");
                        return;
                    }
                    else {
                        $scope.cancel();


                   if(con_kmls==false && con_shps==false) {
                       var connectivityAddLayer = new L.Draw.Polyline(map);
                       connectivityAddLayer.enable();
                       map.on(L.Draw.Event.CREATED, function (event) {
                           var layer = event.layer.toGeoJSON();

                           con_line_lengths = Math.round(turf.length(layer, {units: 'kilometers'}));
                           if(con_line_lengths==0){
                               con_line_lengths=1;
                           }

                          // alert(con_line_lengths*1000);
                           map.removeLayer(drawnItems);
                           drawnGeomConnectivity = layer.geometry;
                           localStorage.geom = JSON.stringify(drawnGeomConnectivity);
                           map.removeLayer(drawConLayer);
                           drawConLayer = L.geoJSON(drawnGeomConnectivity).addTo(map);
                           $scope.getCategory(drawnGeomConnectivity,'new')
                           connectivityAddLayer.disable();
                           map.off(L.Draw.Event.CREATED)
                       });
                   }else if(con_kmls==true){
                       drawnGeomConnectivity = connectivity_kml.features[0].geometry;
                       localStorage.geom = JSON.stringify(drawnGeomConnectivity);
                       con_line_lengths = Math.round(turf.length(drawnGeomConnectivity, {units: 'kilometers'}));
                       if(con_line_lengths==0){
                           con_line_lengths=1;
                       }
                       map.removeLayer(drawConLayer);
                       drawConLayer = L.geoJSON(drawnGeomConnectivity).addTo(map);
                       $scope.getCategory(drawnGeomConnectivity,'new')
                       con_kmls=false;
                       con_shps=false;


                   }else if(con_shps==true){
                       drawnGeomConnectivity = connectivity_shp.features[0].geometry;
                       localStorage.geom = JSON.stringify(drawnGeomConnectivity);
                       con_line_lengths = Math.round(turf.length(drawnGeomConnectivity, {units: 'kilometers'}));
                       if(con_line_lengths==0){
                           con_line_lengths=1;
                       }
                       map.removeLayer(drawConLayer);
                       drawConLayer = L.geoJSON(drawnGeomConnectivity).addTo(map);
                       $scope.getCategory(drawnGeomConnectivity,'new')
                       con_kmls=false;
                       con_shps=false;

                   }



                }}

                $scope.getCategory=function(lineGeom,sc){
                    //'+JSON.stringify(lineGeom)+'
                    scheme=scheme_name;
                    console.log(scheme)
                    cost_v=cost;
                    console.log(cost_v)
                    schemetype=scheme_type;
                    console.log(schemetype)

                    

                    if(sc=='new') {
                        
                        $("#rightnav").append('<div style="padding: 15px 15px 5px 15px;background: #242730;"><button class="btn btn-primary btn-block" style="background-image: unset;border-radius: 0;" onclick=getCategory1(' +"'"+JSON.stringify(lineGeom)+"'"+ ')>View Report</button></div>');
                        $.post( "services/connectivity/main_connectivity.php",{"geom":JSON.stringify(lineGeom)}, function(response1) {
                            var res=JSON.parse(response1);
                            console.log(res);
                            $scope.pssConnectivityStory(res);
                        })
                       
                    }
                    
                    else{
                        map.removeLayer(drawConLayer);
                        map.removeLayer(drawConLayer1);
                        drawConLayer1 = L.geoJSON(JSON.parse(lineGeom)).addTo(map);
                        $.post( "services/connectivity/main_connectivity.php",{"geom":lineGeom}, function(response1) {
                            var res=JSON.parse(response1);
                            console.log(res);
                            $scope.pssConnectivityStory(res);

                        })
                    }
                 //   document.getElementById("rightnav").innerHTML = $compile('<div class="row" style="padding-left:20px;"><div class="col-md-12"><button ng-click="getCategory()">click me to view report</button></div>')($scope);
               //     angular.element(document.querySelector('#rightpanel')).append($compile('<div class="row" style="padding-left:20px;"><div class="col-md-12"><button ng-click="getCategory()">click me to view report</button></div>')($scope))

                }

                $scope.getSTringFromArray=function(arr){
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

                $scope.pssConnectivityStory=function(data,lat_start,long_start,lat_end,long_end){
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
                    lat_start=drawnGeomConnectivity.coordinates[0][0]
                    long_start=drawnGeomConnectivity.coordinates[0][1]
                    lat_end=drawnGeomConnectivity.coordinates[drawnGeomConnectivity.coordinates.length-1][0]
                    long_end=drawnGeomConnectivity.coordinates[drawnGeomConnectivity.coordinates.length-1][1]
                    //console.log(tehsils)

                    //console.log(data.ptiai[0].district_name)
                   // console.log(data.ptiai[0].tehsil_name)
                    $mdDialog.show({
                        controller: connectivityDialogsController,
                        template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                        // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                        '<div  class="container-fluid">'+

                            //***********************start of top heading**************************************
                            '<div class="row" style="margin-left: 0px;">'+

                                '<div class="col-md-9" style="padding-left: 45px;padding-right: 0;margin-top: 10px;">' +
                                    '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #fff; background-color:#48A947; margin-bottom: 0;text-transform: uppercase;">  Assessment Report of Road Scheme </h4>' +
                                    '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #ffffff; background-color:#4E648C; margin-top: 0">Evaluation w.r.t. PSS Alignment</h4>'+
                                '</div>'+
                                '<div class="col-md-2" style="padding-left: 0px;padding-right: 0px;">' +
                                    '<img style="width="50" height="60" src="images/logo.png">'+
                                '</div>'+
                                '<div class="col-md-1 " style="margin-bottom: 10px;">' +
                                    '<md-button class="float-right" ng-click="cancel()" style="font-weight:bold;font-size:16px; color:black;">X</md-button>' +
                                '</div>'+
                                
                            '</div>'+

                            //***********************End of top heading*************************************************

                            '<div class="row" style="margin-left: 0px;">'+
                                
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
                                    '<td colspan="2">'+$scope.getSTringFromArray(tehsils)+'</td>'+
                                    '</tr>' +

                                    '<tr>' +
                                    '<td>District(s) </td>' +
                                    '<td colspan="2">'+$scope.getSTringFromArray(districts).split(',')[0]+'</td>'+
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
                                    '<td colspan="2" style="text-align:center !important;">Aligned With PSS </td>'+
                                    '</tr>'+

                                    '<tr>'+
                                    '<td colspan="2" style="text-align:center !important;">'+$scope.checkAlignResult(data).split(',')[0]+'</td>'+
                                    // '<td align="center">No</td>'+
                                    '</tr>'+
                                    // '<tr>'+
                                    // //'<td>value</td>'+
                                    // '<td colspan="2">'+$scope.checkAlignResult(data).split(',')[1]+'</td>'+
                                    // '</tr>'+

                                    //assessment row end

                                    '</table>' +
                                '</div>'+

                                '<div class="col-md-6">' +
                                    '<div id="conn_map_1" width="90%" height="450px">'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+



                            // table cat
                            '<div class="col-md-12">'+
                                '<table class="table table-bordered table-striped">' +
                                '<tr>' +
                                '<th colspan="2">Category</th><th>Description</th><th>Result</th>' +
                                '</tr>' +
                                '<tr>' +
                                '<td colspan="2">Category A</td>' +
                                '<td>If &gt;75% of Proposed Alignment matches with PSS alignments then PC-I is considered' +
                                ' to follow PSS and does not need to be evaluated under second stage.</td>' +
                                '<td>'+$scope.createCategoryResult(data.categoery[0],'A')+'</td>'+
                                '</tr>' +

                                '<tr>' +
                                '<td colspan="2">Category B</td><td>If &gt;25% and &lt;75 % of Proposed Alignment matches with PSS alignments then PC-I is considered to ' +
                                'moderately follow PSS. It needs to be evaluated in second stage and obtain at least 50% Score.</td>' +
                                '<td>'+$scope.createCategoryResult(data.categoery[0],'B')+'</td>'+
                                '</tr>' +

                                '<tr>' +
                                '<td colspan="2">Category C</td><td>If &lt;25 % of Proposed Alignment matches with PSS alignments then PC-I needs to be to obtain at ' +
                                'least 75 % score from the second stage checklist</td>' +
                                '<td>'+$scope.createCategoryResult(data.categoery[0],'C')+'</td>'+
                                '</tr>' +
                                //   '<tr>'+
                                //   '<td colspan="2">Align With PSS VALUE</td><td class="text-center">'+
                                //
                                // //  Math.round($scope.checkAlignResult(data.categoery[0]))
                                //   $scope.checkAlignResult(data)
                                //   +'</td>' +
                                //   '</tr>' +
                                '</table>' +
                            '</div>'+
                                
                            
                            // Guage data
                            '<div>'+$scope.tableTwoCreation(data)+'</div>'+


                            '<div class="col-md-12"  style="font-size: 20px;text-align: center;padding-left: 30px;padding-right: 30px;padding-bottom:30px;">' +
                            '<h1>Stage 2</h1>'+
                            '</div>' +


                            '<div class="row">' +
                            '<div class="col-md-12" style="padding-left: 60px;padding-right: 60px;padding-bottom:30px;">' +
                                '<table class="table">' +
                                    '<tr style="background-color: #4E648C;color: #ffffff;">' +
                                        '<td style=""><h5>Factor Scoring for Stage 2 With 5 KM Buffer</h5></td>' +
                                        '<td style=""><h5>Factor Scoring for Stage 2 With 10 KM Buffer</h5></td>' +
                                        '<td style=""><h5>Factor Scoring for Stage 2 With 15 KM Buffer</h5></td>' +
                                        '<td style=""><h5>Factor Scoring for Stage 2 With 20 KM Buffer</h5></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                        '<td style="padding: 0">'+$scope.tableThreeCreation(data)+'</td>' +
                                        '<td style="padding: 0">'+$scope.tableFourCreation(data)+'</td>' +
                                        '<td style="padding: 0">'+$scope.tableSixCreation(data)+'</td>' +
                                        '<td style="padding: 0">'+$scope.tableSevenCreation(data)+'</td>' +
                                    '</tr>' +
                                '</table>' +
                            '</div>' +
                        '</div>' +



                            '<div style="padding-left:30px;padding-right:30px;padding-top:10px;">'+
                                

                                '<div>'+
                                    // '<div>'+$scope.tableThreeCreation(data)+'</div>'+
                                    // '<div>'+$scope.tableFourCreation(data)+'</div>'+
                                    // '<div>'+$scope.tableSixCreation(data)+'</div>'+
                                    // '<div>'+$scope.tableSevenCreation(data)+'</div>'+
                                    //'</div>'+




                                    // '<div class="col-md-6">' +
                                    // '<div id="conn_map_1" width="90%" height="450px"></div>'+
                                    // '</div>'+
                                    // '</div>'+

                                    '<div >' +
                                        '<md-button class="btn btn-primary" style="float:right;background-image: unset;border-radius: 0;">' +
                                        '<a style="color: #fff;padding: 10px 20px;" href="createConnectivityPdf1.php?len='+con_line_lengths+'&scheme_val='+scheme_val+'&scheme_name='+scheme_name+'&scheme_type='+scheme_type+'&cost='+cost+
                                        '" target="_blank">save</a>' +
                                        '</md-button>'+
                                       
                                    '</div>' +
                                    '</md-dialog>',
                                            parent: angular.element(document.body),
                                            //  targetEvent: ev,
                                            clickOutsideToClose: true,
                                            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                                        })

                                        setTimeout(function(){
                                            $scope.map_connectivity_one('conn_map_1',12)
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
                                            $scope.addconnectivityguage('Total Score','total_score',parseInt(total_score))

                                            $scope.addconnectivityguage('Directiness','directiness',parseInt(data.directiness[0].score));
                                            $scope.addconnectivityguage('Connectivity to national network','national_natwork',parseInt(data.national_natwork[0].class_score))
                                            $scope.addconnectivityguage('Travel Speed','travel_speed',parseInt(travel_speed_val))

                                            $scope.addconnectivityguage('Public Transport Infrastructure Accessibility Index','ptiai',parseInt(data.ptiai[0].score))
                                            $scope.addconnectivityguage('East West Connectivity','east_west_con',parseInt(data.east_west_con[0].score))
                                            $scope.addconnectivityguage('Connectivity between Major Cities','major_cities_con',parseInt(data.major_cities_con[0].score))



                                        },3000);
                                    }



                                    $scope.map_connectivity_one= function(container,zoom) {
                                        $scope.conn_service='http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_connectivity_v_13022019/MapServer';
                                        $scope.conn_ser='http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_dry_port_15022020/MapServer';
                                        var map_tw_r = new L.Map(container, {center: [31.615965, 72.38554], zoom: zoom});
                                        var roads = L.gridLayer.googleMutant({
                                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                                        }).addTo(map_tw_r);
                                        $("#conn_map_1").height(500);
                                        setTimeout(function(){
                                            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                                                    {
                                                        url:$scope.conn_service,
                                                        opacity : 1,
                                                        useCors: false
                                                    }
                                                ).addTo(map_tw_r);
                                                punjabAdminDynamicLayer.setLayers([0,1]);

                                            var punjabAdminDynamicLayer1 = L.esri.dynamicMapLayer(
                                                {
                                                    url:$scope.conn_ser,
                                                    opacity : 1,
                                                    useCors: false
                                                }
                                            ).addTo(map_tw_r);

                                            map_tw_r.invalidateSize();
                                            var layer=L.geoJSON(drawnGeomConnectivity).addTo(map_tw_r);
                                            map_tw_r.fitBounds(layer.getBounds());
                                        },5000)

                                    }

                                    $scope.checkAlignResult=function(data){
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
                                                return '<span class="glyphicon glyphicon-ok btn-success">'+','+total_score_percent;
                                            }
                                            else if (data.categoery[0].category=='Category B'){
                                                if(total_score_percent>=50){
                                                    return '<span class="glyphicon glyphicon-ok btn-success">'+','+total_score_percent;
                                                }else{
                                                    return '<span class="glyphicon glyphicon-remove btn-danger">'+','+total_score_percent;
                                                }
                                            }
                                            else if (data.categoery[0].category=='Category C'){
                                                if(total_score_percent>=75){
                                                    return '<span class="glyphicon glyphicon-ok btn-success">'+','+total_score_percent;
                                                }else{
                                                    return '<span class="glyphicon glyphicon-remove btn-danger">'+','+total_score_percent;
                                                }
                                            }else{
                                                    return '<span class="glyphicon glyphicon-remove btn-danger">'+','+total_score_percent;
                                            }

                                        // }else{
                                        //     return "Not Aligned";
                                        // }
                                    }

                                    $scope.tableTwoCreation=function(data){
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
                                    '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +
                                        '<div class="col-md-12"  style="background-color:#4E648C; color:#ffffff;font-size: 20px;text-align: center;">' +
                                        '<h5>Parameters for Assessment of Proposed Road Project</h5>' +
                                    '</div>' +
                                    

                                    '<div class="col-md-12"   style=" text-align:center; margin: auto;">' +
                                        '<div id="total_score" width="200" height="100">' +
                                        '</div>'+
                                        '<h4></h4><br />'+
                                        '<h6></h6><br />'+
                                        '<p></p>'+
                                    '</div>'+

                                    '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                        '<div id="directiness"  width="200" height="190">' +
                                    '</div>'+
                                    '<h4></h4><br />'+
                                    '<h6></h6><br />'+
                                    '<p>A Common indicator used to measure accessibility of the two points.It is ration between Network Distance to Euclidean Distance.</p>'+

                                '</div>'+
                                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                    '<div id="national_natwork" width="200" height="190">' +
                                    '</div>'+
                                    '<h4></h4><br />'+
                                    '<h6></h6><br />'+
                                    '<p>It includes connectivity to Moterways, CPEC corridor,National and Strategic Highways.</p>'+
                                '</div>'+

                                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                    '<div id="travel_speed" width="200" height="190">' +
                                    '</div>'+
                                    '<h4></h4><br />'+
                                    '<h6></h6><br />'+
                                    '<p>Travel speed is based on the type ,width quality and class of road network available between origin and destination under free flow condition.</p>'+
                                '</div>'+


                                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                    '<div id="ptiai" width="200" height="190">' +
                                    '</div>'+
                                    '<h4></h4><br />'+
                                    '<h6></h6><br />'+
                                    '<p>Based on Tehsil-wise outcome of Public Transport Infrastructure Accessibility Index,which is developed using impartial methodology for determining transport deprivation.</p>'+
                                '</div>'+

                                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                    '<div id="east_west_con" width="200" height="190">' +
                                    '</div>'+
                                    '<h4></h4><br />'+
                                    '<h6></h6><br />'+
                                    '<p>Developing East West connections in Punjab is envisioned in PSS and also a priority by C&W department since national network runs North-South.</p>'+
                                '</div>'+



                                '<div class="col-md-4"  style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                    '<div id="major_cities_con" width="200" height="190">' +
                                    '</div>'+
                                    '<h4></h4><br />'+
                                    '<h6></h6><br />'+
                                    '<p>Connecting cities and hubs is crucial to develop system of cities planned under PSS.Classificaation of the cities is based on proposed system of cities under PSS.</p>'+
                                '</div>'+

                               


                                // summary Table
                                '<div style="padding-left:40%;pading-top:20px;padding-bottom:10px;"><h1>summary</h1></div>'+
                                    '<table class="table table-bordered table-striped">' +
                                        '<tr>' +
                                        '<th>Buffer In Km</th><th>Score</th><th>Impact</th>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td>5 km</td>'+
                                        '<td>' + (Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                                            parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                                            parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))+'</td>' +

                                        '<td>' + parseInt((Math.round(data.population5[0].score)+parseInt(data.railway5[0].score)+parseInt(data.economic_zone5[0].score)+
                                            parseInt(data.dryport5[0].score)+parseInt(data.health5[0].score)+parseInt(data.protected_area5[0].score)+
                                            parseInt(data.total_air_ports5[0].score)+parseInt(data.industry5[0].score)+parseInt(data.education5[0].sum)+parseInt(data.local_roads5[0].score))/(parseInt(con_line_lengths))) +'</td>' +
                                        '</tr>' +

                                        '<tr>' +
                                        '<td>10 km</td>'+
                                        '<td>' + (Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                                            parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                                            parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score))+'</td>' +

                                        '<td>' + parseInt((Math.round(data.population10[0].score)+parseInt(data.railway10[0].score)+parseInt(data.economic_zone10[0].score)+
                                            parseInt(data.dryport10[0].score)+parseInt(data.health10[0].score)+parseInt(data.protected_area10[0].score)+
                                            parseInt(data.total_air_ports10[0].score)+parseInt(data.industry10[0].score)+parseInt(data.education10[0].sum)+parseInt(data.local_roads10[0].score))/(parseInt(con_line_lengths))) +'</td>' +
                                        '</tr>' +

                                        '<tr>' +
                                        '<td>15 km</td>'+
                                        '<td>' + (Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                                            parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                                            parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score))+'</td>' +

                                        '<td>' + parseInt((Math.round(data.population15[0].score)+parseInt(data.railway15[0].score)+parseInt(data.economic_zone15[0].score)+
                                            parseInt(data.dryport15[0].score)+parseInt(data.health15[0].score)+parseInt(data.protected_area15[0].score)+
                                            parseInt(data.total_air_ports15[0].score)+parseInt(data.industry15[0].score)+parseInt(data.education15[0].sum)+parseInt(data.local_roads15[0].score))/(parseInt(con_line_lengths))) +'</td>' +
                                        '</tr>' +

                                        '<tr>' +
                                        '<td>20 km</td>'+
                                        '<td>' + (Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                                            parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                                            parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score))+'</td>' +

                                        '<td>' + parseInt((Math.round(data.population20[0].score)+parseInt(data.railway20[0].score)+parseInt(data.economic_zone20[0].score)+
                                            parseInt(data.dryport20[0].score)+parseInt(data.health20[0].score)+parseInt(data.protected_area20[0].score)+
                                            parseInt(data.total_air_ports20[0].score)+parseInt(data.industry20[0].score)+parseInt(data.education20[0].sum)+parseInt(data.local_roads20[0].score))/(parseInt(con_line_lengths))) +'</td>' +
                                        '</tr>' +
                                    '</table>'+
                                '</div>'+ 

                            '</div>';

                                        return str;
                                    }else{
                                        return "nothing found"
                                    }
                                }


                                $scope.addconnectivityguage= function(Names,container,val){
                                    var arr_val=[];

                                    var myobj={}
                                    if(container=='total_score'){
                                        myobj={
                                            "chart": {
                                            "theme": "fusion",
                                                "caption": Names,
                                                "lowerLimit": "0",
                                                "upperLimit": "12",
                                            // "numberSuffix": "%",
                                            //  "chartBottomMargin": "40",
                                            //  "valueFontSize": "11",
                                            //"valueFontBold": "0"
                                        },
                                            "colorRange": {
                                            "color": [{
                                                "minValue": "0",
                                                "maxValue": "4",
                                                "code": "#ACDF87",
                                                // "label": "Low",
                                            }, {
                                                "minValue": "4",
                                                "maxValue": "8",
                                                "code": "#7FF11C",
                                                // "label": "Moderate",
                                            }, {
                                                "minValue": "8",
                                                "maxValue": "12",
                                                "code": "#4F9A29",
                                                //  "label": "High",
                                            }]
                                        },
                                            "pointers": {
                                            "pointer": [{
                                                "value": val
                                            }]
                                        }

                                        }
                                    }else{
                                        myobj={
                                            "chart": {
                                            "theme": "fusion",
                                                "caption": Names,
                                                "lowerLimit": "0",
                                                "upperLimit": "2",
                                            // "numberSuffix": "%",
                                            //  "chartBottomMargin": "40",
                                            //  "valueFontSize": "11",
                                            //"valueFontBold": "0"
                                        },
                                            "colorRange": {
                                            "color": [{
                                                "minValue": "0",
                                                "maxValue": "1",
                                                "code": "#ACDF87",
                                                // "label": "Low",
                                            }, {
                                                "minValue": "1",
                                                "maxValue": "2",
                                                "code": "#4F9A29",
                                                // "label": "Moderate",
                                            }, {
                                                "minValue": "2",
                                                "maxValue": "2",
                                                "code": "#4F9A29",
                                                //  "label": "High",
                                            }]
                                        },
                                            "pointers": {
                                            "pointer": [{
                                                "value": val
                                            }]
                                        }

                                        }
                                    }
                                    FusionCharts.ready(function(){
                                        var chartObj = new FusionCharts({
                                                type: 'hlineargauge',
                                                renderAt: container,
                                                width: '300',
                                                height: '190',
                                                dataFormat: 'json',
                                                dataSource:myobj
                                            }
                                        );
                                        chartObj.render();
                                        setTimeout(function(){
                                            $("#national_natwork > span > svg > g:eq(1) > text").html('abc');
                                        },5000);
                                    });


                                }



                                $scope.health1=false;
                                $scope.health2=false;
                                $scope.health3=false;
                                $scope.health4=false;
                                $scope.industry1=false;
                                $scope.industry2=false;
                                $scope.industry3=false;
                                $scope.industry4=false;
                                $scope.education1=false;
                                $scope.education2=false;
                                $scope.education3=false;
                                $scope.education4=false;
                                $scope.road1=false;
                                $scope.road2=false;
                                $scope.road3=false;
                                $scope.road4=false;

                                $scope.oNOffIndicators=function(val){
                                    if(val=='health1') {
                                        if ($scope.health1 == false) {
                                            $scope.health1 = true;
                                            $(".ha1").show();
                                        } else {
                                            $scope.health1 = false;
                                            $(".ha1").hide();
                                        }
                                    }
                                    if(val=='health2') {
                                        if ($scope.health2 == false) {
                                            $scope.health2 = true;
                                            $(".ha2").show();
                                        } else {
                                            $scope.health2 = false;
                                            $(".ha2").hide();
                                        }
                                    }
                                    if(val=='health3') {
                                        if ($scope.health3 == false) {
                                            $scope.health3 = true;
                                            $(".ha3").show();
                                        } else {
                                            $scope.health3 = false;
                                            $(".ha3").hide();
                                        }
                                    } if(val=='health4') {
                                        if ($scope.health4 == false) {
                                            $scope.health4 = true;
                                            $(".ha4").show();
                                        } else {
                                            $scope.health4 = false;
                                            $(".ha4").hide();
                                        }
                                    }
                                    if(val=='industry1') {
                                        if ($scope.industry1 == false) {
                                            $scope.industry1 = true;
                                            $(".in1").show();
                                        } else {
                                            $scope.industry1 = false;
                                            $(".in1").hide();
                                        }
                                    }
                                    if(val=='industry2') {
                                        if ($scope.industry2 == false) {
                                            $scope.industry2 = true;
                                            $(".in2").show();
                                        } else {
                                            $scope.industry2 = false;
                                            $(".in2").hide();
                                        }
                                    }
                                    if(val=='industry3') {
                                        if ($scope.industry3 == false) {
                                            $scope.industry3 = true;
                                            $(".in3").show();
                                        } else {
                                            $scope.industry3 = false;
                                            $(".in3").hide();
                                        }
                                    }
                                    if(val=='industry4') {
                                        if ($scope.industry4 == false) {
                                            $scope.industry4 = true;
                                            $(".in4").show();
                                        } else {
                                            $scope.industry4 = false;
                                            $(".in4").hide();
                                        }
                                    }

                                    if(val=='education1') {
                                        if ($scope.education1 == false) {
                                            $scope.education1 = true;
                                            $(".ed1").show();
                                        } else {
                                            $scope.education1 = false;
                                            $(".ed1").hide();
                                        }
                                    }
                                    if(val=='education2') {
                                        if ($scope.education2 == false) {
                                            $scope.education2= true;
                                            $(".ed2").show();
                                        } else {
                                            $scope.education2 = false;
                                            $(".ed2").hide();
                                        }
                                    }
                                    if(val=='education3') {
                                        if ($scope.education3 == false) {
                                            $scope.education3 = true;
                                            $(".ed3").show();
                                        } else {
                                            $scope.education3 = false;
                                            $(".ed3").hide();
                                        }
                                    }
                                    if(val=='education4') {
                                        if ($scope.education4 == false) {
                                            $scope.education4 = true;
                                            $(".ed4").show();
                                        } else {
                                            $scope.education4 = false;
                                            $(".ed4").hide();
                                        }
                                    }
                                    if(val=='road1') {
                                        if ($scope.road1 == false) {
                                            $scope.road1 = true;
                                            $(".rd1").show();
                                        } else {
                                            $scope.road1 = false;
                                            $(".rd1").hide();
                                        }
                                    }
                                    if(val=='road2') {
                                        if ($scope.road2 == false) {
                                            $scope.road2 = true;
                                            $(".rd2").show();
                                        } else {
                                            $scope.road2 = false;
                                            $(".rd2").hide();
                                        }
                                    }if(val=='road3') {
                                        if ($scope.road3 == false) {
                                            $scope.road3 = true;
                                            $(".rd3").show();
                                        } else {
                                            $scope.road3 = false;
                                            $(".rd3").hide();
                                        }
                                    }if(val=='road4') {
                                        if ($scope.road4 == false) {
                                            $scope.road4 = true;
                                            $(".rd4").show();
                                        } else {
                                            $scope.road4 = false;
                                            $(".rd4").hide();
                                        }
                                    }
                                }


                                $scope.tableThreeCreation=function(data){

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

                                    
                        '</div>';            
                                    
                            if(data.categoery[0]) {
                            str =  
                                    '<table class="table table-bordered">' +
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
                                    '<td><a  ng-click="oNOffIndicators('+"'health1'"+')">Health</a></td>' +
                                    '<td>' + data.health5[0].faclities + '</td>' +
                                    '<td>' + data.health5[0].score + '</td>' +
                                    '</tr>' +


                                    '<tr class="ha1" style="align:center;display:none;">' +
                                    '<td>5.1</td>' +
                                    //'<td rowspan="4"> Health Details</td>' +
                                    '<td>DHQ</td>' +
                                    '<td>' + data.health_details5[0].DHQ + '</td>' +
                                    '<td>' + parseInt(data.health_details5[0].DHQ)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha1" style="display:none">' +
                                    '<td>5.2</td>' +
                                    //'<td></td>' +
                                    '<td>THQ</td>' +
                                    '<td>' + data.health_details5[0].THQ + '</td>' +
                                    '<td>' + parseInt(data.health_details5[0].THQ)*3 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha1" style="display:none">' +
                                    '<td>5.3</td>' +
                                    // '<td></td>' +
                                    '<td>BHU</td>' +
                                    '<td>' + data.health_details5[0].BHU +'</td>' +
                                    '<td>' + data.health_details5[0].BHU +'</td>' +
                                    '</tr>' +

                                    '<tr class="ha1" style="display:none">' +
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
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'industry1'"+')">Industry</td></td>' +
                                    '<td>'+ $scope.sumvals(data.industries_detail5[0].Large_Industries,data.industries_detail5[0].Medium_Industries,data.industries_detail5[0].Small_Industries,0)+ '</td>' +
                                    '<td>' + data.industry5[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="in1" style="display:none">' +
                                    '<td>8.1</td>' +
                                    // '<td rowspan="3">Industry Details</td>' +
                                    '<td>Large Industries</td>' +
                                    '<td>' + data.industries_detail5[0].Large_Industries + '</td>' +
                                    '<td>' + parseInt(data.industries_detail5[0].Large_Industries)*3 + '</td>' +

                                    '</tr>' +

                                    '<tr class="in1" style="display:none">' +
                                    '<td>8.2</td>' +
                                    //'<td></td>' +
                                    '<td>Medium Industries</td>' +
                                    '<td>' + data.industries_detail5[0].Medium_Industries + '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail5[0].Medium_Industries)/10)*2 + '</td>' +
                                    '</tr>' +

                                    '<tr class="in1" style="display:none">' +
                                    '<td>8.3</td>' +
                                    //'<td></td>' +
                                    '<td>Small Industries</td>' +
                                    '<td>' + data.industries_detail5[0].Small_Industries + '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail5[0].Small_Industries)/100) + '</td>' +
                                    '</tr>' +


                                    '<tr style="background-color: #F9F9F9;align:center;">' +
                                    '<td>9</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'education1'"+')">Education</a></td>' +
                                    '<td>'+$scope.sumvals(data.education_details5[0].Primary,data.education_details5[0].Secondary,data.education_details5[0].Colleges,data.education_details5[0].Universities) + '</td>' +
                                    '<td>' + data.education5[0].sum + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed1" style="display:none">' +
                                    '<td>9.1</td>' +
                                    //  '<td rowspan="4"> Education Details</td>' +
                                    '<td>Primary</td>' +
                                    '<td>' + data.education_details5[0].Primary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details5[0].Primary)/10)*2 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed1" style="display:none">' +
                                    '<td>9.2</td>' +
                                    //'<td></td>' +
                                    '<td>Secondary</td>' +
                                    '<td>' + data.education_details5[0].Secondary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details5[0].Secondary)/10) + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed1" style="display:none">' +
                                    '<td>9.3</td>' +
                                    // '<td></td>' +
                                    '<td>Colleges</td>' +
                                    '<td>' + data.education_details5[0].Colleges +'</td>' +
                                    '<td>' + parseInt(data.education_details5[0].Colleges)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr class="ed1" style="display:none">' +
                                    '<td>9.4</td>' +
                                    // '<td></td>' +
                                    '<td>Universities</td>' +
                                    '<td>' + data.education_details5[0].Universities +'</td>' +
                                    '<td>' + parseInt(data.education_details5[0].Universities)*4 +'</td>' +
                                    '</tr>' +

                                    '<tr style="background-color: #F9F9F9;align:center;">' +
                                    '<td>10</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'road1'"+')">Roads</a></td>' +
                                    '<td>'+$scope.sumvals(data.roads_details5[0].Express_Moterways,data.roads_details5[0].Highways,data.roads_details5[0].Primary_Roads,data.roads_details5[0].Secondary_Roads) + '</td>' +
                                    '<td>' + data.local_roads5[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd1" style="display:none">' +
                                    '<td>10.1</td>' +
                                    // '<td rowspan="4">Roads Detail</td>' +
                                    '<td>Express Moterways</td>' +
                                    '<td>' + data.roads_details5[0].Express_Moterways + '</td>' +
                                    '<td>' + parseInt(data.roads_details5[0].Express_Moterways)*5 + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd1" style="display:none">' +
                                    '<td>10.2</td>' +
                                    //'<td></td>' +
                                    '<td>Highways</td>' +
                                    '<td>' + data.roads_details5[0].Highways + '</td>' +
                                    '<td>' + parseInt(data.roads_details5[0].Highways)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd1" style="display:none">' +
                                    '<td>10.3</td>' +
                                    // '<td></td>' +
                                    '<td>Primary Roads</td>' +
                                    '<td>' + data.roads_details5[0].Primary_Roads +'</td>' +
                                    '<td>' + parseInt(data.roads_details5[0].Primary_Roads)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr class="rd1" style="display:none">' +
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


                                    '</table>' ;
                                
                                    return str;
                                }else{
                                    return "nothing found"
                                }
                                }


                                $scope.sumvals=function(a,b,c,d){
                                    var s=parseInt(a);
                                    var m=parseInt(b);
                                    var l=parseInt(c);
                                    var d=parseInt(d);
                                    return s+m+l+d

                                }

                                $scope.tableFourCreation=function(data){

                                if(data.categoery[0]) {
                                    var str =
                                //   '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +

                                // '</div>' +

                                //  '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                                
                                    '<table class="table table-bordered">' +
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
                                    '<td><a  ng-click="oNOffIndicators('+"'health2'"+')">Health</a></td>' +
                                    '<td>' + data.health10[0].faclities + '</td>' +
                                    '<td>' + data.health10[0].score + '</td>' +
                                    '</tr>' +


                                    '<tr class="ha2" style="display:none">' +
                                    '<td>5.1</td>' +
                                    //'<td rowspan="4"> Health Details</td>' +
                                    '<td>DHQ</td>' +
                                    '<td>' + data.health_details10[0].DHQ + '</td>' +
                                    '<td>' + parseInt(data.health_details10[0].DHQ)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha2" style="display:none">' +
                                    '<td>5.2</td>' +
                                    //'<td></td>' +
                                    '<td>THQ</td>' +
                                    '<td>' + data.health_details10[0].THQ + '</td>' +
                                    '<td>' + parseInt(data.health_details10[0].THQ)*3 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha2" style="display:none">' +
                                    '<td>5.3</td>' +
                                    // '<td></td>' +
                                    '<td>BHU</td>' +
                                    '<td>' + data.health_details10[0].BHU +'</td>' +
                                    '<td>' + data.health_details10[0].BHU +'</td>' +
                                    '</tr>' +

                                    '<tr class="ha2" style="display:none">' +
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
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'industry2'"+')">Industry</a></td></td>' +
                                    '<td>'+ $scope.sumvals(data.industries_detail10[0].Large_Industries,data.industries_detail10[0].Medium_Industries,data.industries_detail10[0].Small_Industries,0)+ '</td>' +
                                    '<td>' + data.industry10[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="in2" style="display:none">' +
                                    '<td>8.1</td>' +
                                    //'<td rowspan="3">Industry Details</td>' +
                                    '<td>Large Industries</td>' +
                                    '<td>' + data.industries_detail10[0].Large_Industries + '</td>' +
                                    '<td>' + parseInt(data.industries_detail10[0].Large_Industries)*3 + '</td>' +

                                    '</tr>' +

                                    '<tr class="in2" style="display:none">' +
                                    '<td>8.2</td>' +
                                    //'<td></td>' +
                                    '<td>Medium Industries</td>' +
                                    '<td>' + data.industries_detail10[0].Medium_Industries + '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail10[0].Medium_Industries)/10)*2 + '</td>' +

                                    '</tr>' +

                                    '<tr class="in2" style="display:none">' +
                                    '<td>8.3</td>' +
                                    //'<td></td>' +
                                    '<td>Small Industries</td>' +
                                    '<td>' + data.industries_detail10[0].Small_Industries + '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail10[0].Small_Industries)/100) + '</td>' +
                                    '</tr>' +

                                    '<tr style="background-color: #F9F9F9;">' +
                                    '<td>9</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'education2'"+')">Education</a></td>' +
                                    '<td>'+$scope.sumvals(data.education_details10[0].Primary,data.education_details10[0].Secondary,data.education_details10[0].Colleges,data.education_details10[0].Universities) + '</td>' +
                                    '<td>' + data.education10[0].sum + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed2" style="display:none">' +
                                    '<td>9.1</td>' +
                                    //'<td rowspan="4"> Education Details</td>' +
                                    '<td>Primary</td>' +
                                    '<td>' + data.education_details10[0].Primary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details10[0].Primary)/10)*2 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed2" style="display:none">' +
                                    '<td>9.2</td>' +
                                    //'<td></td>' +
                                    '<td>Secondary</td>' +
                                    '<td>' + data.education_details10[0].Secondary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details10[0].Secondary)/10) + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed2" style="display:none">' +
                                    '<td>9.3</td>' +
                                    // '<td></td>' +
                                    '<td>Colleges</td>' +
                                    '<td>' + data.education_details10[0].Colleges +'</td>' +
                                    '<td>' + parseInt(data.education_details10[0].Colleges)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr class="ed2" style="display:none">' +
                                    '<td>9.4</td>' +
                                    // '<td></td>' +
                                    '<td>Universities</td>' +
                                    '<td>' + data.education_details10[0].Universities +'</td>' +
                                    '<td>' + parseInt(data.education_details10[0].Universities)*4 +'</td>' +
                                    '</tr>' +

                                    '<tr style="background-color: #F9F9F9;">' +
                                    '<td>10</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'road2'"+')">Roads</a></td>' +
                                    '<td>'+$scope.sumvals(data.roads_details10[0].Express_Moterways,data.roads_details10[0].Highways,data.roads_details10[0].Primary_Roads,data.roads_details10[0].Secondary_Roads) + '</td>' +
                                    '<td>' + data.local_roads10[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd2" style="display:none">' +
                                    '<td>10.1</td>' +
                                    // '<td rowspan="4">Roads Detail</td>' +
                                    '<td>Express Moterways</td>' +
                                    '<td>' + data.roads_details10[0].Express_Moterways + '</td>' +
                                    '<td>' + parseInt(data.roads_details10[0].Express_Moterways)*5 + '</td>' +
                                    '</tr>' +

                                    '<tr  class="rd2" style="display:none">' +
                                    '<td>10.2</td>' +
                                    //'<td></td>' +
                                    '<td>Highways</td>' +
                                    '<td>' + data.roads_details10[0].Highways + '</td>' +
                                    '<td>' + parseInt(data.roads_details10[0].Highways)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr  class="rd2" style="display:none">' +
                                    '<td>10.3</td>' +
                                    // '<td></td>' +
                                    '<td>Primary Roads</td>' +
                                    '<td>' + data.roads_details10[0].Primary_Roads +'</td>' +
                                    '<td>' + parseInt(data.roads_details10[0].Primary_Roads)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr  class="rd2" style="display:none">' +
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



                                    '</table>';
                                
                                    return str;
                                }else{
                                    return "nothing found"
                                }
                                }





                                $scope.tableSixCreation=function(data){

                                if(data.categoery[0]) {
                                    var str =
                                //'<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +

                                //'</div>' +

                                // '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                                
                                    '<table class="table table-bordered">' +
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
                                    '<td><a  ng-click="oNOffIndicators('+"'health3'"+')">Health</a></td>' +
                                    '<td>' + data.health15[0].faclities + '</td>' +
                                    '<td>' + data.health15[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha3" style="display:none">' +
                                    '<td>5.1</td>' +
                                    //  '<td rowspan="4"> Health Details</td>' +
                                    '<td>DHQ</td>' +
                                    '<td>' + data.health_details15[0].DHQ + '</td>' +
                                    '<td>' + parseInt(data.health_details15[0].DHQ)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha3" style="display:none">' +
                                    '<td>5.2</td>' +
                                    //'<td></td>' +
                                    '<td>THQ</td>' +
                                    '<td>' + data.health_details15[0].THQ + '</td>' +
                                    '<td>' + parseInt(data.health_details15[0].THQ)*3 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha3" style="display:none">' +
                                    '<td>5.3</td>' +
                                    // '<td></td>' +
                                    '<td>BHU</td>' +
                                    '<td>' + data.health_details15[0].BHU +'</td>' +
                                    '<td>' + data.health_details15[0].BHU +'</td>' +
                                    '</tr>' +

                                    '<tr class="ha3" style="display:none">' +
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
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'industry3'"+')">Industry</a></td>' +
                                    '<td>'+ $scope.sumvals(data.industries_detail15[0].Large_Industries,data.industries_detail15[0].Medium_Industries,data.industries_detail15[0].Small_Industries,0)+ '</td>' +
                                    '<td>' + data.industry15[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="in3" style="display:none">' +
                                    '<td>8.1</td>' +
                                    // '<td rowspan="3">Industry Details</td>' +
                                    '<td>Large Industries</td>' +
                                    '<td>' + data.industries_detail15[0].Large_Industries + '</td>' +
                                    '<td>' + parseInt(data.industries_detail15[0].Large_Industries)*3 + '</td>' +
                                    '</tr>' +

                                    '<tr class="in3" style="display:none">' +
                                    '<td>8.2</td>' +
                                    //'<td></td>' +
                                    '<td>Medium Industries</td>' +
                                    '<td>' + data.industries_detail15[0].Medium_Industries + '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail15[0].Medium_Industries)/10)*2 + '</td>' +
                                    '</tr>' +

                                    '<tr class="in3" style="display:none">' +
                                    '<td>8.3</td>' +
                                    //'<td></td>' +
                                    '<td>Small Industries</td>' +
                                    '<td>' + data.industries_detail15[0].Small_Industries + '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail15[0].Small_Industries)/100) + '</td>' +
                                    '</tr>' +



                                    '<tr style="background-color: #F9F9F9;">' +
                                    '<td>9</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'education3'"+')">Education</a></td>' +
                                    '<td>'+$scope.sumvals(data.education_details15[0].Primary,data.education_details15[0].Secondary,data.education_details15[0].Colleges,data.education_details15[0].Universities) + '</td>' +
                                    '<td>' + data.education15[0].sum + '</td>' +
                                    '</tr>' +


                                    '<tr class="ed3" style="display:none">' +
                                    '<td>9.1</td>' +
                                    //  '<td rowspan="4"> Education Details</td>' +
                                    '<td>Primary</td>' +
                                    '<td>' + data.education_details15[0].Primary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details15[0].Primary)/10)*2 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed3" style="display:none">' +
                                    '<td>9.2</td>' +
                                    //'<td></td>' +
                                    '<td>Secondary</td>' +
                                    '<td>' + data.education_details15[0].Secondary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details15[0].Secondary)/10) + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed3" style="display:none">' +
                                    '<td>9.3</td>' +
                                    // '<td></td>' +
                                    '<td>Colleges</td>' +
                                    '<td>' + data.education_details15[0].Colleges +'</td>' +
                                    '<td>' + parseInt(data.education_details15[0].Colleges)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr class="ed3" style="display:none">' +
                                    '<td>9.4</td>' +
                                    // '<td></td>' +
                                    '<td>Universities</td>' +
                                    '<td>' + data.education_details15[0].Universities +'</td>' +
                                    '<td>' + parseInt(data.education_details15[0].Universities)*4 +'</td>' +
                                    '</tr>' +



                                    '<tr style="background-color: #F9F9F9;">' +
                                    '<td>10</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'road3'"+')">Roads</a></td>' +
                                    '<td>'+$scope.sumvals(data.roads_details15[0].Express_Moterways,data.roads_details15[0].Highways,data.roads_details15[0].Primary_Roads,data.roads_details15[0].Secondary_Roads) + '</td>' +
                                    '<td>' + data.local_roads15[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd3" style="display:none">' +
                                    '<td>10.1</td>' +
                                    // '<td rowspan="4">Roads Detail</td>' +
                                    '<td>Express Moterways</td>' +
                                    '<td>' + data.roads_details15[0].Express_Moterways + '</td>' +
                                    '<td>' + parseInt(data.roads_details15[0].Express_Moterways)*5 + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd3" style="display:none">' +
                                    '<td>10.2</td>' +
                                    //'<td></td>' +
                                    '<td>Highways</td>' +
                                    '<td>' + data.roads_details15[0].Highways + '</td>' +
                                    '<td>' + parseInt(data.roads_details15[0].Highways)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd3" style="display:none">' +
                                    '<td>10.3</td>' +
                                    // '<td></td>' +
                                    '<td>Primary Roads</td>' +
                                    '<td>' + data.roads_details15[0].Primary_Roads +'</td>' +
                                    '<td>' + parseInt(data.roads_details15[0].Primary_Roads)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr class="rd3" style="display:none">' +
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


                                    '</table>' ;
                                
                                    return str;
                                }else{
                                    return "nothing found"
                                }
                                }


                                $scope.tableSevenCreation=function(data){

                                if(data.categoery[0]) {
                                    var str_7 =
                                //'<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px;">' +

                                //'</div>' +

                                // '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">' +
                                
                                    '<table class="table table-bordered">' +
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
                                    '<td><a  ng-click="oNOffIndicators('+"'health4'"+')">Health</a></td>' +
                                    '<td>' + data.health20[0].faclities + '</td>' +
                                    '<td>' + data.health20[0].score + '</td>' +
                                    '</tr>' +


                                    '<tr class="ha4" style="display:none">' +
                                    '<td>5.1</td>' +
                                    //'<td rowspan="4"> Health Details</td>' +
                                    '<td>DHQ</td>' +
                                    '<td>' + data.health_details20[0].DHQ + '</td>' +
                                    '<td>' + parseInt(data.health_details20[0].DHQ)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha4" style="display:none">' +
                                    '<td>5.2</td>' +
                                    //'<td></td>' +
                                    '<td>THQ</td>' +
                                    '<td>' + data.health_details20[0].THQ + '</td>' +
                                    '<td>' + parseInt(data.health_details20[0].THQ)*3 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ha4" style="display:none">' +
                                    '<td>5.3</td>' +
                                    // '<td></td>' +
                                    '<td>BHU</td>' +
                                    '<td>' + data.health_details20[0].BHU +'</td>' +
                                    '<td>' + data.health_details20[0].BHU +'</td>' +
                                    '</tr>' +

                                    '<tr class="ha4" style="display:none">' +
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
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'industry4'"+')">Industry</a></td>' +
                                    '<td>'+ $scope.sumvals(data.industries_detail20[0].Large_Industries,data.industries_detail20[0].Medium_Industries,data.industries_detail20[0].Small_Industries,0)+ '</td>' +
                                    '<td>' + data.industry20[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="in4" style="display:none">' +
                                    '<td>8.1</td>' +
                                    //'<td rowspan="3">Industry Details</td>' +
                                    '<td>Large Industries</td>' +
                                    '<td>' + data.industries_detail20[0].Large_Industries + '</td>' +
                                    '<td>' + parseInt(data.industries_detail20[0].Large_Industries)*3 + '</td>' +
                                    '</tr>' +

                                    '<tr class="in4" style="display:none">' +
                                    '<td>8.2</td>' +
                                    //'<td></td>' +
                                    '<td>Medium Industries</td>' +
                                    '<td>' + data.industries_detail20[0].Medium_Industries+ '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail20[0].Medium_Industries)/10)*2 + '</td>' +
                                    '</tr>' +

                                    '<tr class="in4" style="display:none">' +
                                    '<td>8.3</td>' +
                                    //'<td></td>' +
                                    '<td>Small Industries</td>' +
                                    '<td>' + data.industries_detail20[0].Small_Industries + '</td>' +
                                    '<td>' + parseInt(parseInt(data.industries_detail20[0].Small_Industries)/100) + '</td>' +
                                    '</tr>' +


                                    '<tr style="background-color: #F9F9F9;">' +
                                    '<td>9</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'education4'"+')">Education</a></td>' +
                                    '<td>'+$scope.sumvals(data.education_details20[0].Primary,data.education_details20[0].Secondary,data.education_details20[0].Colleges,data.education_details20[0].Universities) + '</td>' +
                                    '<td>' + data.education20[0].sum + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed4" style="display:none">' +
                                    '<td>9.1</td>' +
                                    //'<td rowspan="4"> Education Details</td>' +
                                    '<td>Primary</td>' +
                                    '<td>' + data.education_details20[0].Primary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details20[0].Primary)/10)*2 + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed4" style="display:none">' +
                                    '<td>9.2</td>' +
                                    //'<td></td>' +
                                    '<td>Secondary</td>' +
                                    '<td>' + data.education_details20[0].Secondary + '</td>' +
                                    '<td>' + parseInt(parseInt(data.education_details20[0].Secondary)/10) + '</td>' +
                                    '</tr>' +

                                    '<tr class="ed4" style="display:none">' +
                                    '<td>9.3</td>' +
                                    // '<td></td>' +
                                    '<td>Colleges</td>' +
                                    '<td>' + data.education_details20[0].Colleges +'</td>' +
                                    '<td>' + parseInt(data.education_details20[0].Colleges)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr class="ed4" style="display:none">' +
                                    '<td>9.4</td>' +
                                    // '<td></td>' +
                                    '<td>Universities</td>' +
                                    '<td>' + data.education_details20[0].Universities +'</td>' +
                                    '<td>' + parseInt(data.education_details20[0].Universities)*4 +'</td>' +
                                    '</tr>' +


                                    '<tr  style="background-color: #F9F9F9;">' +
                                    '<td>10</td>' +
                                    '<td><a href="#" ng-click="oNOffIndicators('+"'road4'"+')">Roads</a></td>' +
                                    '<td>'+$scope.sumvals(data.roads_details20[0].Express_Moterways,data.roads_details20[0].Highways,data.roads_details20[0].Primary_Roads,data.roads_details20[0].Secondary_Roads) + '</td>' +
                                    '<td>' + data.local_roads20[0].score + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd4" style="display:none">' +
                                    '<td>10.1</td>' +
                                    //'<td rowspan="4">Roads Detail</td>' +
                                    '<td>Express Moterways</td>' +
                                    '<td>' + data.roads_details20[0].Express_Moterways + '</td>' +
                                    '<td>' + parseInt(data.roads_details20[0].Express_Moterways)*5 + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd4" style="display:none">' +
                                    '<td>10.2</td>' +
                                    //'<td></td>' +
                                    '<td>Highways</td>' +
                                    '<td>' + data.roads_details20[0].Highways + '</td>' +
                                    '<td>' + parseInt(data.roads_details20[0].Highways)*4 + '</td>' +
                                    '</tr>' +

                                    '<tr class="rd4" style="display:none">' +
                                    '<td>10.3</td>' +
                                    // '<td></td>' +
                                    '<td>Primary Roads</td>' +
                                    '<td>' + data.roads_details20[0].Primary_Roads +'</td>' +
                                    '<td>' + parseInt(data.roads_details20[0].Primary_Roads)*3 +'</td>' +
                                    '</tr>' +

                                    '<tr class="rd4" style="display:none">' +
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

                                    '</table>' ;
                              
                        
                                return str_7;
                            }else{
                                return "nothing found"
                            }
                        }





                $scope.createCategoryResult=function(res,cat){
                    if(cat=='A'){
                        if(res) {
                            if (res.category == 'Category A') {
                                return '<span class="glyphicon glyphicon-ok btn-success">'
                            } else {
                                return '<span class="glyphicon glyphicon-remove btn-danger">'
                            }
                        }else{
                            return '<span class="glyphicon glyphicon-remove btn-danger">'
                        }
                    }
                    if(cat=='B'){
                        if(res) {
                            if (res.category == 'Category B') {
                                return '<span class="glyphicon glyphicon-ok btn-success">'
                            } else {
                                return '<span class="glyphicon glyphicon-remove btn-danger">'
                            }
                        }else{
                                return '<span class="glyphicon glyphicon-remove btn-danger">'
                            }
                    }

                    if(cat=='C'){
                        if(res) {
                            if (res.category == 'Category C') {
                                return '<span class="glyphicon glyphicon-ok btn-success">'
                            } else {
                                return '<span class="glyphicon glyphicon-remove btn-danger">'
                            }
                        }else{
                            return '<span class="glyphicon glyphicon-remove btn-danger">'
                        }
                    }

                }

            }



        }],
        controllerAs:'connectivityCtrl'
    }
})

function getCategory1(geom){
    //angular.element($("#scheme_connectivity")).scope().getCategory('anv')
    //angular.element(document.getElementById("scheme_connectivity")).scope().getCategory()
    cdc.getCategory(geom,'old');
}