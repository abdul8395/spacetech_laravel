var drawConLayer={};
var drawConLayer1={};
var cost="";
var scheme_name="";
var scheme_type="";
var scheme_val="";
var result_row_color='#e0e0d1';
var selected_color='';
var cdc='';
var con_line_lengths;

angular.module('agricultureController',[])
.directive('agricultureTemplate',function(){
    return{
        restrict : 'E',
        templateUrl : 'template/agriculture.html',
        controller : ['$scope','$http','$timeout','$mdDialog','$compile',function($scope,$http,$timeout,$mdDialog,$compile){

            $scope.addAgriculturePcOne=function(){
                map.removeLayer(drawConLayer);
                // var str_type='<option>Select Scheme Type</option>';
                var sub_cat_tab;




                    $mdDialog.show({
                    controller: agricultureController,
                    template:
                    '<md-dialog id="dt_dialog" aria-label="drive time">' +
                    '<md-toolbar>' +
                    '<div class="md-toolbar-tools" style="background-color:#29323C; color:#7A7B7C;">' +
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
                    '<tr><td style="width:150px; padding-top: 18px;">Scheme Name:</td><td><input class="form-control" style="height: 40px;" type="text" name="scheme_nam" placeholder="scheme name test" value="scheme1"  id="scheme_name"></td>' +
                    '</tr>' +
                    '<tr><td style="padding-top: 18px;">Enter Cost:</td><td><input class="form-control" style="height: 40px;" type="number" name="cost" placeholder="enter cost"  id="cost"></td>' +
                    '</tr>' +
                    '</table>' +
                    '</form>' +
                    '</div>' +
                    '<div style="margin-bottom: 30px;margin-right: 10px;">' +
                    '<md-button style="float: right;background-image: unset;border-radius: 0;" ng-click="addNewLineForScheme()" class="btn btn-primary">' +
                    'Draw Location' +
                    '</md-button>' +
                    '</div>' +
                    '</md-dialog>',
                    parent: angular.element(document.body),
                    //targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    setTimeout(function(){

                    },300)

            };

            function agricultureController($scope, $mdDialog){
                cdc=$scope;
                $scope.cancel=function(){
                    $mdDialog.cancel();

                }


                $scope.addNewLineForScheme=function(){

                    var scheme_name = $("#scheme_name").val();
                    var cost=$("#cost").val();




                        // $.get( "http://localhost/iris_planner/services/agriculture/scheme_sub_category.php?value="+$("#pss_con_scheme").val(), function(response1) {
                        // $.get( "services/agriculture/scheme_sub_category.php?value="+'%', function(response1) {
                        //
                        //     for (var i = 0; i < response1.length; i++) {
                        //
                        //         layer_arr.push(parseInt(response1[i].layer_id ));
                        //         layer_name.push(response1[i].name );
                        //     }
                        //
                        //     // alert('aaaa')
                        //     console.log(layer_arr)
                        //     console.log(layer_name)
                        //
                        // })



                    map.removeLayer(drawConLayer1);
                    //alert(scheme_val);
                    if(scheme_type =='-'){
                        alert("Please Enter Scheme Name First");
                        return;
                    }

                    else if(cost==""){
                        alert("Please Enter Cost Of the Scheme");
                        return;
                    }
                    else {
                        $scope.cancel();



                       map.on('click', function (e) {
                          var lat = e.latlng.lat;
                          var lon = e.latlng.lng;


                           // var point_drawn = turf.point([lon, lat]);
                           // var buffered = turf.buffer(point_drawn, 20, {units: 'kilometers'});
                           // console.log(buffered);
                           // console.log(JSON.stringify(buffered.geometry));
                           // // L.geoJSON(buffered).addTo(map);



                           drawnGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');



                           console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
                           //Clear existing marker,

                           if (theMarker != undefined) {
                               map.removeLayer(theMarker);
                           }
                           ;

                           //Add a marker to show where you clicked.
                           console.log([lat, lon])
                           theMarker = L.marker([lat, lon]).addTo(map);
                           map.off("click");

                           var data_fishnet;

                           var layer_arr = [];
                           var layer_name = [];
                           var layer_data=[];
                           var cat={'Soil':[],'Climate':[],'Surface Water Availability':[],'Land Use Land Cover':[]};


                           $.ajax({
                               url: "services/agriculture/agriculture_pss.php",
                               type : "get",
                               async: false,
                               data:{"lat":lat, "lon": lon},
                               success: function (responce) {
                                   console.log(responce);

                                   for (var i = 0; i < responce['services'].length; i++) {

                                       cat[responce['services'][i]['category']].push({'layer_name':responce['services'][i]['name'],
                                           'value':responce['dimensions'][0][responce['services'][i]['grid_col_name']]+' '+responce['services'][i]['unit'],
                                            'layer_id':parseInt(responce['services'][i]['layer_id'] )
                                       })

                                   }
                                   data_fishnet =  responce;
                               }

                           });

                           var suitable_crop;
                           var t_crops;
                           $.ajax({
                               url: "services/agriculture/potential_crops.php",
                               type : "get",
                               async: false,
                               data:{"district_name":data_fishnet.dist_teh[0].district_name},
                               success: function (responce) {
                                   console.log(responce);

                                   suitable_crop =  responce

                                   var keys = Object.keys(suitable_crop[0])
                                   var true_crops = [];
                                   for(var i = 0;i< keys.length;i++){

                                       if(suitable_crop[0][keys[i]]=='1'){
                                           true_crops.push(keys[i])
                                       }

                                   }

                                   console.log(true_crops)

                                   // t_crops=true_crops.join(' ')
                                   t_crops=true_crops.join()
                                   console.log(true_crops);

                               }

                           });

                           var mills_count;
                           $.ajax({
                               url: "services/agriculture/mills_count.php",
                               type : "get",
                               async: false,
                               data:{"tehsil":data_fishnet.dist_teh[0].tehsil_name},
                               success: function (responce) {
                                   console.log(responce);
                                   mills_count =  responce;
                               }

                           });


                           $scope.checkagricultureWithPss(lon,lat,scheme_name,cost,cat,data_fishnet,mills_count,t_crops );
                       });



                }}

                $scope.checkagricultureWithPss=function(lon,lat,scheme_name,cost,cat,data_fishnet,mills_count,t_crops){
                    var sc_name=scheme_name;
                    var cost=cost;
                    var sc_geom=drawnGeom;

                    // console.log(sc_geom)
                    $scope.pssAgricultureStory(lon,lat,sc_name,cost,cat,data_fishnet,mills_count,t_crops);
                }


                $scope.mapFour = function(containers,lng,lat,zoom,data_fishnet,cat) {
                    var map4 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                    var roads = L.gridLayer.googleMutant({
                        type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                    }).addTo(map4);

                    L.esri.dynamicMapLayer({
                        url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/',
                        layers:[7]

                    }).addTo(map4);

                    L.esri.dynamicMapLayer({
                        url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_mills_v_10072020/MapServer',
                    }).addTo(map4);

                    $.ajax({
                            url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_mills_v_10072020/MapServer/legend?f=json',
                            type : "get",
                            async: false,
                            success: function (responce) {
                                var res = JSON.parse(responce);
                                for(var i=0;i<res.layers.length;i++){

                                    var html='<div><img src="data:image/png;base64,'+res.layers[i].legend[0].imageData+'" alt=""><span>'+res.layers[i].layerName+'</span></div>'
                                    $('#map4_legend').append(html)
                                }

                            }

                        });




                    var point = L.marker([lat, lng]).addTo(map4);

                    // var cat={'Soil':[],'Climate':[],'Surface Water Availability':[],'Land Use Land Cover':[]};
                    var cat_soil_data = cat['Soil'];
                    var cat_climate_data = cat['Climate'];
                    var cat_water_data = cat['Surface Water Availability'];
                    var cat_lulc_data = cat['Land Use Land Cover'];

                    var soil_logistics='<table class="table table-striped">'
                    for(var i = 0;i<cat_soil_data.length;i++){
                        soil_logistics +='<tr>' +
                            // '<td><b>'+cat_soil_data[i]['layer_name']+'</b></td><td>'+cat_soil_data[i]['value']+' </td><td style="height: 400px;width: 500px" id="lyr_'+cat_soil_data[i]['layer_id']+'"></td><td  style="height: 400px;width: 500px" id="lyrr_'+cat_soil_data[i]['layer_id']+'"></td>' +
                            '<td><b>'+cat_soil_data[i]['layer_name']+'</b><br>'+cat_soil_data[i]['value']+' </td><td style="height: 400px;width: 500px" id="lyr_'+cat_soil_data[i]['layer_id']+'"></td><td  style="height: 400px;width: 500px" id="lyrr_'+cat_soil_data[i]['layer_id']+'"></td>' +
                            '</tr>'
                    }
                    soil_logistics +='</table>';

                    var climate_logistics='<table class="table table-striped">'
                    for(var i = 0;i<cat_climate_data.length;i++){
                        climate_logistics +='<tr>' +
                            '<td><b>'+cat_climate_data[i]['layer_name']+'</b><br>'+cat_climate_data[i]['value']+' </td><td style="height: 400px;width: 500px" id="lyr_'+cat_climate_data[i]['layer_id']+'"></td><td style="height: 400px;width: 500px" id="lyrr_'+cat_climate_data[i]['layer_id']+'"></td>' +
                            '</tr>'
                    }
                    climate_logistics +='</table>';

                    var water_logistics='<table class="table table-striped">'
                    for(var i = 0;i<cat_water_data.length;i++){
                        water_logistics +='<tr>' +
                            '<td><b>'+cat_water_data[i]['layer_name']+'</b><br>'+cat_water_data[i]['value']+' </td><td style="height: 400px;width: 500px" id="lyr_'+cat_water_data[i]['layer_id']+'"></td><td style="height: 400px;width: 500px" id="lyrr_'+cat_water_data[i]['layer_id']+'"></td>' +
                            '</tr>'
                    }
                    for(var i = 0;i<cat_lulc_data.length;i++){
                        water_logistics +='<tr>' +
                            '<td><b>'+cat_lulc_data[i]['layer_name']+'</b><br>'+cat_lulc_data[i]['value']+' </td><td style="height: 400px;width: 500px" id="lyr_'+cat_lulc_data[i]['layer_id']+'"></td><td style="height: 400px;width: 500px" id="lyrr_'+cat_lulc_data[i]['layer_id']+'"></td>' +
                            '</tr>'
                    }
                    water_logistics +='</table>';



                    $("#soil_logistics").html(soil_logistics);
                    $("#climate_logistics").html(climate_logistics);
                    $("#water_logistics").html(water_logistics);


                    for(var i = 0;i<cat_soil_data.length;i++){
                        $scope.dynamicmaps('map4',lng,lat,13,[cat_soil_data[i]['layer_id']]  )
                        $scope.dynamicmaps_district('map4',lng,lat,13,[cat_soil_data[i]['layer_id']]  )
                    }

                    for(var i = 0;i<cat_climate_data.length;i++){
                        $scope.dynamicmaps('map4',lng,lat,13,[cat_climate_data[i]['layer_id']]  )
                        $scope.dynamicmaps_district('map4',lng,lat,13,[cat_climate_data[i]['layer_id']]  )
                    }

                    for(var i = 0;i<cat_water_data.length;i++){
                        $scope.dynamicmaps('map4',lng,lat,13,[cat_water_data[i]['layer_id']]  )
                        $scope.dynamicmaps_district('map4',lng,lat,13,[cat_water_data[i]['layer_id']]  )
                    }
                    for(var i = 0;i<cat_lulc_data.length;i++){
                        $scope.dynamicmaps('map4',lng,lat,13,[cat_lulc_data[i]['layer_id']]  )
                        $scope.dynamicmaps_district('map4',lng,lat,13,[cat_lulc_data[i]['layer_id']]  )
                    }

                }


                $scope.dynamicmaps = function(containers,lng,lat,zoom,layer_ids) {
                    $scope.map_arr=[];
                    var legend_arr_obj={};
                    $.ajax({
                        url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_rasters_v_16052020/MapServer/legend?f=pjson',
                        // url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_v_16052020/MapServer/legend?f=pjson',
                        type : "get",
                        async: false,
                        success: function (responce) {
                            var res = JSON.parse(responce);
                            res = res['layers']
                            for(var i=0;i<res.length;i++){
                                legend_arr_obj[res[i]['layerId']]=res[i]['legend']
                            }

                        }

                    });


                    for(var i=0 ; i < layer_ids.length;i++){

                        // var name=layer_name[i];
                        // var name=layer_name[i]+'-lyr-'+layer_ids[i]+'-id-'+i;

                        var legend_height=0;
                        var leg_style = legend_arr_obj[layer_ids[i]]
                        legend_height = leg_style.length*20

                        // var header_html = '<div style="color: black;position: absolute;top: 5px;width: 100%;z-index: 10000000;font-weight: bold;text-align: center">'+name+'</div>'
                        var map_id = 'lyr_'+layer_ids[i];
                        var leg_html=  '<div style="position: absolute;bottom: 2px;right: 2px;z-index: 1000000;height:'+legend_height+'px;width: 200px;background-color: white">'

                        for (var j =0; j <leg_style.length;j++){
                            leg_html += '<div><div style="width: 20px; height: 20px;display:inline-block;"><img src="data:image/png;base64,'+leg_style[j].imageData+'" alt=""></div><span>'+leg_style[j].label+'</span></div>'
                        }

                        leg_html+='</div>'

                        // console.log(leg_html)

                        // $('#lyr_'+layer_ids[i]).append('<div class="col-md-12" style="padding: 8px 83px 5px 13px;margin: 5px 0px 5px 50px;;"><div id="'+map_id+'" style="height: 450px;padding: 5px 5px 5px 5px; ">'+header_html+leg_html+'</div></div>');
                        $('#'+map_id).append(leg_html);
                        // zoom: 7, center: [31.615965, 72.38554],
                        // center: new L.LatLng(lat, lng), zoom: 7}
                        $scope.map_arr[layer_ids[i]] = new L.Map(map_id, {center: new L.LatLng(30.894682536970834, 72.77563557028772), zoom: 6});
                        L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo($scope.map_arr[layer_ids[i]]);
                        L.esri.dynamicMapLayer({
                            url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_rasters_v_16052020/MapServer',
                            // url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_v_16052020/MapServer',
                            layers:[layer_ids[i]]
                        }).addTo($scope.map_arr[layer_ids[i]]);


                        var point = L.marker([lat, lng]).addTo($scope.map_arr[layer_ids[i]]);
                    }

                }

                $scope.dynamicmaps_district = function(containers,lng,lat,zoom,layer_ids) {
                    $scope.map_arr=[];
                    var legend_arr_obj={};
                    $.ajax({
                        url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_rasters_v_16052020/MapServer/legend?f=pjson',
                        // url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_v_16052020/MapServer/legend?f=pjson',
                        type : "get",
                        async: false,
                        success: function (responce) {
                            var res = JSON.parse(responce);
                            res = res['layers']
                            for(var i=0;i<res.length;i++){
                                legend_arr_obj[res[i]['layerId']]=res[i]['legend']
                            }

                        }

                    });


                    for(var i=0 ; i < layer_ids.length;i++){

                        // var name=layer_name[i];
                        // var name=layer_name[i]+'-lyr-'+layer_ids[i]+'-id-'+i;

                        var legend_height=0;
                        var leg_style = legend_arr_obj[layer_ids[i]]
                        legend_height = leg_style.length*20

                        // var header_html = '<div style="color: black;position: absolute;top: 5px;width: 100%;z-index: 10000000;font-weight: bold;text-align: center">'+name+'</div>'
                        var map_id = 'lyrr_'+layer_ids[i];
                        var leg_html=  '<div style="position: absolute;bottom: 2px;right: 2px;z-index: 1000000;height:'+legend_height+'px;width: 200px;background-color: white">'

                        for (var j =0; j <leg_style.length;j++){
                            leg_html += '<div><div style="width: 20px; height: 20px;display:inline-block;"><img src="data:image/png;base64,'+leg_style[j].imageData+'" alt=""></div><span>'+leg_style[j].label+'</span></div>'
                        }

                        leg_html+='</div>'

                        // console.log(leg_html)

                        // $('#lyr_'+layer_ids[i]).append('<div class="col-md-12" style="padding: 8px 83px 5px 13px;margin: 5px 0px 5px 50px;;"><div id="'+map_id+'" style="height: 450px;padding: 5px 5px 5px 5px; ">'+header_html+leg_html+'</div></div>');
                        $('#'+map_id).append(leg_html);
                        // zoom: 7, center: [31.615965, 72.38554],
                        // center: new L.LatLng(lat, lng), zoom: 7}
                        $scope.map_arr[layer_ids[i]] = new L.Map(map_id, {center: new L.LatLng(lat, lng), zoom: 10});
                        L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo($scope.map_arr[layer_ids[i]]);
                        L.esri.dynamicMapLayer({
                            url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_rasters_v_16052020/MapServer',
                            // url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_punjab_agri_soil_v_16052020/MapServer',
                            layers:[layer_ids[i]]
                        }).addTo($scope.map_arr[layer_ids[i]]);

                        L.esri.dynamicMapLayer({
                            url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/',
                            layers:[7]

                        }).addTo($scope.map_arr[layer_ids[i]]);


                        var point = L.marker([lat, lng]).addTo($scope.map_arr[layer_ids[i]]);
                    }

                }

                $scope.pssAgricultureStory=function(lon,lat,sc_name,cost,cat,data_fishnet,mills_count,t_crops){


                    $mdDialog.show({


                        controller: agricultureController,
                        template: '<md-dialog id="dt_dialog" flex="80" aria-label="drive time">' +
                        // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                        '<div  class="container-fluid" style="padding: 15px;">'+

                        //***********************start of top heading**************************************
                        

                        '<div class="row" style="margin-left: 0px;">'+

                            '<div class="col-md-9" style="padding-left: 45px;padding-right: 0;margin-top: 10px;">' +
                                '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #fff; background-color:#48A947; margin-bottom: 0;text-transform: uppercase;">Assessment Report of Agriculture Scheme </h4>' +
                                '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #ffffff; background-color:#4E648C; margin-top: 0">Evaluation w.r.t. PSS Alignment</h4>'+
                            '</div>'+
                            '<div class="col-md-2" style="padding-left: 0px;padding-right: 0px;">' +
                                '<img style="width="50" height="60" src="images/logo.png">'+
                            '</div>'+
                            '<div class="col-md-1 " style="margin-bottom: 10px;">' +
                                '<md-button class="float-right" ng-click="cancel()" style="font-weight:bold;font-size:16px; color:red;">X</md-button>' +
                            '</div>'+
                                
                        '</div>'+

                        //***********************End of top heading*************************************************

                            //table

                            '<div class="row" style="margin-left: 0px;">'+
                                '<div class="col-md-6">'+
                                '<table class="table table-bordered table-striped">' +

                                '<tr>' +
                                '<td><b>Scheme Name:</b></td><td>'+sc_name+'</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td><b>Cost:</b></td><td>'+cost+' Million </td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>District:</b></td><td>'+data_fishnet.dist_teh[0].district_name+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Tehsil:</b></td><td>'+data_fishnet.dist_teh[0].tehsil_name+'</td>' +
                                '</tr>' +


                                '<tr>' +
                                '<td><b>Food Markets:</b></td><td>'+mills_count[0].food_markets+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Rice Mills:</b></td><td>'+mills_count[0].rice_mills+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Sugar Mills:</b></td><td>'+mills_count[0].suger_mills+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Flour Mills:</b></td><td>'+mills_count[0].floor_mills+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Oil and Fat Industries:</b></td><td>'+mills_count[0].veg_oil_fat+'</td>' +
                                '</tr>' +

                                // '<tr>' +
                                // '<td><b>Potential Crops:</b></td><td ><span style="word-break: break-word">'+t_crops+'</span></td>' +
                                // '</tr>' +

                                '</table></div>'+

                            //table end

                            //map div
                                '<div class="col-md-6" style="height: 345px;" id="map4">' +
                                    '<div id="map4_legend" style="position: absolute; bottom: 0px;right: 0px;background-color: white; height: 120px; width: 110px;z-index: 1001;">' +
                                    '</div>' +
                                '</div>' +
                            //map div end
                            '</div>' +

                            //    table of soil_logistics

                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                            '<div class="col-md-12"  style="color:#ffffff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>Soil Properties</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+

                            '<div id="soil_logistics"></div>'+
                            '</div>'+
                            '</div>'+

                            //    table soil_logistics end

                            //    table of climate_logistics

                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                            '<div class="col-md-12"  style="color:#ffffff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>Climate Properties</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+

                            '<div id="climate_logistics"></div>'+
                            '</div>'+
                            '</div>'+

                            //    table climate_logistics end

                            //    table of water_and_lulc_logistics

                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                            '<div class="col-md-12"  style="color:#ffffff; background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>Water and LULC Properties</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+

                            '<div id="water_logistics"></div>'+
                            '</div>'+
                            '</div>'+

                            //    table water_and_lulc_logistics end

                            //table of finfings

                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                            '<div class="col-md-12"  style="color:#ffffff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>Findings of Potential Crops in Selected Area</h5>'+
                            '</div>' +
                            '</div>'+


                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+

                            '<table class="table  table-striped">' +

                            '<tr>' +
                            // '<td><b>Potential Crops:</b></td><td >'+t_crops+'</span></td>' +
                            '<td><b>Potential Crops:</b></td><td ><b>'+t_crops+'</b></td>' +
                            '</tr>' +

                            '<tr>' +

                            '<td colspan="2"><p><b><ol><li>Provide the specialized and targeted support system (inputs, on farm technologies, specialized extension services etc) for these crops.</li>  ' +
                            '<li>Provide better logistical Infrastructure like storage and transportation for these crop.</li>'+
                            '<li>Build agro based industry for these crops to encourage value addition.</li></ol></b></p></td>'+
                            '</tr>' +

                            '</table></div>'+
                            '</div>'+
                            //
                            // //map of services
                            //
                            // '<div class="row" id="idsmap"></div>'+
                            //
                            // //map of services end


                            '</div>'+

                        '</md-dialog>',
                        parent: angular.element(document.body),
                        //  targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })

                    setTimeout(function(){

                        $scope.mapFour('map4',lon,lat,12,data_fishnet,cat)


                    },2000);


                }

            }



        }],
        controllerAs:'connectivityCtrl'
    }
})

function getCategory1(geom){
    cdc.getCategory(geom,'old');

}