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

angular.module('environmentController',[])
.directive('environmentTemplate',function(){
    return{
        restrict : 'E',
        templateUrl : 'template/environment.html',
        controller : ['$scope','$http','$timeout','$mdDialog','$compile',function($scope,$http,$timeout,$mdDialog,$compile){

            $scope.addEnvironmentPcOne=function(){
                map.removeLayer(drawConLayer);
                // var str_type='<option>Select Scheme Type</option>';
                var sub_cat_tab;




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
                    '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width:600px;">' +
                    '<form id="geom_radio">' +
                    '<table class="table borderless">' +
                    '<tr><td style="width:200px; padding-top: 18px;">Scheme Name:</td><td><input class="form-control" style="height: 40px;" type="text" name="scheme_nam" placeholder="scheme name" value="scheme1"  id="scheme_name"></td>' +
                    '</tr>' +
                    '<tr><td style="padding-top: 18px;">Enter Cost:</td><td><input class="form-control" style="height: 40px;" type="number" name="cost" placeholder="enter cost"  id="cost"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="padding-top: 12px;">Population influence</td>'+
                    '<td>' +
                    '<div class="form-check form-check-inline">'+
                    '<input class="form-check-input" type="radio" name="pop" id="pop" value="Positively Influenced">'+
                    '<label class="form-check-label">Positive</label>'+
                    '</div>'+
                    '<div class="form-check form-check-inline">'+
                    '<input class="form-check-input" type="radio" name="pop" id="pop" value="Negatively Influenced">'+
                    '<label class="form-check-label">Negative</label>'+
                    '</div>'+
                    // '<input type="radio" name="pop" id="pop" value="Positively Influenced"><span>+ve</span>' +
                    // '<input type="radio" name="pop" id="pop" value="Negatively Influenced"><span>-ve</span>'+
                    '</td>' +
                    '</tr>' +
                    '<tr><td style="padding-top: 18px;">Category of the Scheme: </td><td><select class="form-control" style="border-radius: 0;" onchange="" id="pss_con_scheme">' + '</select></td></tr>'+
                    '<tr><td style="padding-top: 18px;">Sub Category of the Scheme: </td><td><select class="form-control" style="border-radius: 0;" onchange="" id="pss_sub_cat_scheme">' + '</select></td></tr>'+
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

                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                    setTimeout(function(){

                        $("#cost").keyup(function() {
                            var x = $("#cost").val();

                            if (x <= 50) {
                                var y = "environment.schedule1";
                                sub_cat_tab = "environment.schedule1_subcategory";
                                console.log(sub_cat_tab);
                                $.post( "services/environment/scheme_category.php",{"table":y}, function(response1) {
                                console.log(response1);
                                var str_type='<option>Select Scheme Type</option>';
                                for (var i = 0; i < response1.length; i++) {

                                str_type = str_type + '<option value="' + response1[i].category_type + '">' + response1[i].category + '</option>';
                                }
                                setTimeout(function(){
                                    $("#pss_con_scheme").html(str_type);
                                    },300)
                                })
                            } else if (x > 50) {
                                var y = "environment.schedule2";
                                sub_cat_tab = "environment.schedule2_subcategory";
                                console.log(sub_cat_tab)
                                $.post( "services/environment/scheme_category.php",{"table":y}, function(response1) {
                                    // console.log(response1);
                                    var str_type='<option>Select Scheme Type</option>';

                                    for (var i = 0; i < response1.length; i++) {

                                        str_type = str_type + '<option value="' + response1[i].category_type + '">' + response1[i].category + '</option>';
                                    }
                                    setTimeout(function(){
                                        $("#pss_con_scheme").html(str_type);
                                    },300)
                                })
                            }
                        })
                        console.log(sub_cat_tab);

                        $('#pss_con_scheme').on('change',function () {
                            // alert(this.value)
                            $.post( "services/environment/scheme_sub_category.php?table="+sub_cat_tab+"&value="+this.value, function(response1) {
                                console.log(response1);
                                var str_sub_type='<option>Select Sub Category of Scheme</option>';

                                for (var i = 0; i < response1.length; i++) {
                                    str_sub_type = str_sub_type + '<option value="' + response1[i].category_type + '">' + response1[i].category + '</option>';
                                }
                                setTimeout(function(){
                                    $("#pss_sub_cat_scheme").html(str_sub_type);
                                },300)
                            })


                        })
                    },300)

            };

            function connectivityDialogsController($scope, $mdDialog){
                cdc=$scope;
                $scope.cancel=function(){
                    $mdDialog.cancel();

                }

                $scope.addNewLineForScheme=function(){
                    var scheme_name = $("#scheme_name").val();
                    var cost=$("#cost").val();
                    var category_text=$('#pss_con_scheme option:selected').text();
                    var category_value=$('#pss_con_scheme option:selected').val();
                    var scheme_sub_cat_text=$('#pss_sub_cat_scheme option:selected').text();
                    var scheme_sub_cat_value=$('#pss_sub_cat_scheme option:selected').val();
                    var radio_checked=document.getElementById("pop").checked;
                    var radio_checked=$('input[name="pop"]:checked').val();;

                    // var scheme_capacity_text=$('#pss_capacity_scheme option:selected').text();
                    // var scheme_capacity_value=$('#pss_capacity_scheme option:selected').val();
                    // scheme_capacity_value=$('#pss_capacity_scheme').val();

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
                    else if($('input[name="pop"]:checked').val()=="undefined"){
                        alert("Please Enter Cost Of the Scheme");
                        return;
                    }
                    else if($('#pss_con_scheme option:selected').text()=="undefined"){
                        alert("Please Enter Cost Of the Scheme");
                        return;
                    }
                    else if($('#pss_sub_cat_scheme option:selected').text()=="undefined"){
                        alert("Please Enter Cost Of the Scheme");
                        return;
                    }
                    else {
                        $scope.cancel();

                       map.on('click', function (e) {
                          var lat = e.latlng.lat;
                          var lon = e.latlng.lng;


                           var point_drawn = turf.point([lon, lat]);
                           var buffered = turf.buffer(point_drawn, 20, {units: 'kilometers'});
                           console.log(buffered);
                           console.log(JSON.stringify(buffered.geometry));
                           // L.geoJSON(buffered).addTo(map);

                           drawnGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');

                           console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
                           //Clear existing marker,

                           if (theMarker != undefined) {
                               map.removeLayer(theMarker);
                           };

                           //Add a marker to show where you clicked.
                           console.log([lat, lon])
                           theMarker = L.marker([lat, lon]).addTo(map);
                           map.off("click");

                           $.post( "services/environment/getPopulation.php",{"geom":JSON.stringify(buffered.geometry)}, function(response1) {
                               console.log(response1);
                               var pop=parseInt(response1[0].population);
                               console.log(pop)
                               $scope.checkenvironmentWithPss(lon,lat,scheme_name,cost,category_text,scheme_sub_cat_text,pop,radio_checked);

                           })

                       });

                }}

                $scope.checkenvironmentWithPss=function(lon,lat,scheme_name,cost,category_text,scheme_sub_cat_text,pop,radio_checked){
                    var sc_name=scheme_name;
                    var cost=cost;
                    var sc_geom=drawnGeom;
                    var category_text=category_text;
                    var scheme_sub_cat_text=scheme_sub_cat_text;
                    var popu=pop;
                    var radio_chk=radio_checked;
                    console.log(radio_chk)
                    var scheme_schedule;
                    if (cost<=50){scheme_schedule="IEE";}else if (cost>50){scheme_schedule="EIA";}
                    // var sc_type=$("#pss_scheme option:selected").val();
                    // var sc_district=$("#district_pss option:selected").val();
                    // var sc_tehsil=$("#pss_tehsil option:selected").val();
                    // alert("scheme name"+sc_name+","+"geom"+sc_geom+","+"scheme type"+sc_type+","+"district id"+sc_district+","+"sc_tehsil"+sc_tehsil)

                    console.log(sc_geom)
                    $.post( "services/environment/environment_pss.php",{"geom":JSON.stringify(sc_geom)}, function(response1) {
                            var res=response1;
                            console.log(res);
                            console.log(res.dimensions[0].protected);
                            $scope.pssEnvironmentStory(response1,lon,lat,sc_name,cost,category_text,scheme_sub_cat_text,popu,radio_chk,scheme_schedule);

                    }).fail(function()
                    {
                        alert( "error" );
                    })

                }


                $scope.mapFour = function(containers,lng,lat,zoom) {
                    // $scope.boundary = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';
                    // $scope.industry = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisporta_industyl_pg31_v_15082018/MapServer/';
                    var map4 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                    var roads = L.gridLayer.googleMutant({
                        type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                    }).addTo(map4);

                    var point = L.marker([lat, lng]).addTo(map4);

                }

                $scope.pssEnvironmentStory=function(data,lon,lat,sc_name,cost,category_text,scheme_sub_cat_text,popu,radio_chk,scheme_schedule){

                    var align=data.dimensions[0].final;
                    var aligned;
                    if (align<=40){aligned="Not Aligned with PSS"}
                    else if (align>40 && align<=70){aligned="Partially Aligned with PSS"}
                    else if (align && align<=100){aligned="Aligned with PSS"}

                    $mdDialog.show({
                        controller: connectivityDialogsController,
                        template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                        // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                        '<div  class="container-fluid" style="padding-left: 0px;padding-right: 0px;margin-left: 0px;margin-right: 0px;">'+

                        //***********************start of top heading**************************************
                        '<div class="row" style="margin-left: 0px;">'+
                        '<div class="col-md-12">'+
                        '<div class="col-md-10" style="padding-right: 0px;">'+
                        '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                        'letter-spacing: 0.005em;color: white;margin-top: 20px;">' +
                        '<h4 style="text-align: center;border-bottom: solid 1px white">Assessment Report of Environment Scheme</h4>' +
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

                            //table

                            '<div class="row" style="margin-left: 0px;">'+
                            '<div class="col-md-12">'+
                            '<div class="col-md-6">'+
                            '<table class="table table-bordered table-striped">' +

                            '<tr>' +
                            '<td><b>Overall Standing:</b></td><td>'+data.dimensions[0].final+' out of 100</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td><b>District:</b></td><td>'+data.dist_teh[0].district_name+'</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td><b>Tehsil:</b></td><td>'+data.dist_teh[0].tehsil_name+'</td>' +
                            '</tr>' +
                            // '<tr>' +
                            // '<td><b>Mauza:</b></td><td>'+data.dist_teh[0].mauza+'</td>' +
                            // '</tr>' +
                            '<tr>' +
                            '<td><b>Cost:</b></td><td>'+cost+' Million </td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Scheme Name:</b></td><td>'+sc_name+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>IEE/EIA:</b></td><td>'+scheme_schedule+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Category of the Scheme:</b></td><td>'+category_text+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Sub Category of the Scheme:</b></td><td>'+scheme_sub_cat_text+'</td>' +
                            '</tr>' +
                            // '<tr>' +
                            // '<td><b>Capacity of the Scheme:</b></td><td>'+100+'</td></tr>' +
                            '<tr>' +
                            '<td><b>Affected Population:</b></td><td>'+popu+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Influence Population:</b></td><td>'+ radio_chk+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Result:</b></td><td>'+res+aligned+'</td>' +
                            '</tr>' +

                            '</table></div>'+

                            //table end

                            //map div
                            '<div class="col-md-6" style="height: 450px" id="map4"></div>' +
                            //map div end

                            //guages
                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">'+
                            '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                            '<h5>PROPOSED SITE READINESS GAUGES</h5>'+
                            '</div>'+
                            '</div>'+

                            '<div class="row"  style="margin-left: 0px;padding-left: 15px;padding-right: 15px;">'+
                            '<div class="col-md-12">'+

                            '<div class="col-md-12" id="total_score" style="text-align:center; margin: auto;height:275px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h5></h5><br />'+
                            '<h6></h6><br />'+
                            '<p> ' +
                            '</p>'+
                            '</div>'+

                            '<div class="col-md-3" id="aqi" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Describes overall condition of air pollutant in that particular area.\n' +
                            'It is useful in determining the severity of pollutants.</p>'+
                            '</div>'+


                            '<div class="col-md-3" id="wqi" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Provides a single number that expresses overall water quality at a certain \n ' +
                            'location and time. Baseded on several water quality parameter.</p>'+
                            '</div>'+

                            '<div class="col-md-3" id="water_bodies" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Score varies from minimum distance (lowest score) from water distance to \n' +
                            'maximum  distance (highest score). Most suitable location is away from water bodies.</p>'+
                            '</div>'+

                            '<div class="col-md-3" id="heritage" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Score varies from minimum distance (lowest score) from Cultural Heritage Sites to \n' +
                            'maximum  distance (highest score). Most suitable location is away from Cultural Heritage Sites.</p>'+
                            '</div>'+

                            '<div class="col-md-3" id="protected" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Geographical space dedicated and managed through legal or other effective means to \n ' +
                            'achieve the long term conservation of nature with associated ecosystem and cultural values \n'+
                            'such as natural Parks, wildlife, forests, world parks</p>'+
                            '</div>'+

                            '<div class="col-md-3" id="hazard" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Score varies from minimum distance (lowest score) from Flood Or Earthquake location to \n' +
                            'maximum  distance (highest score). Most suitable location is away from Hazardous loactions.</p>'+
                            '</div>'+

                            // '<div class="col-md-3"  id="population" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            // '<canvas  width="200" height="100">' +
                            // '</canvas>'+
                            // '<h4></h4><br />'+
                            // '<h6></h6><br />'+
                            // '<p></p>'+
                            // '</div>'+







                            '<div class="col-md-3" id="landuse" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p> It includes six landuse types (Water Bodies/Irrigation , Built-up,Cultivable Land \n ' +
                            'Vegetation,Bare soil,Barren Land ). Contributing in score from lowest to highest respectively</p>'+
                            '</div>'+




                            '</div>'+
                            '</div>'+
                        //    guages end


                        //    table of env_logistics

                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                            '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                            '<h5>DISTANCE TO KEY INFRASTRUCTURE</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+

                            '<div id="env_logistics"></div>'+
                            '</div>'+
                            '</div>'+

                        //    table env_logistics end

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+
                            '<div class="col-md-12">' +

                            //'<h5>Logistics</h5>'+

                            environment_mitigation+

                            '</div>'+
                            '</div>'+
                            '</div>'+

                        '</md-dialog>',
                        parent: angular.element(document.body),
                        //  targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })

                    setTimeout(function(){
                        addEnvironmentguage('Protected Area/ Conservation Area','protected',data.dimensions[0].protected_area );
                        addEnvironmentguage('Natural Hazards (floods & Earthquakes)','hazard',data.dimensions[0].natural_hazards);
                        // addEnvironmentguage('Affected Population (Within project boundary)','population',0);
                        addEnvironmentguage('Cultural/Heritage Sites','heritage',data.dimensions[0].cultural_heritage);
                        addEnvironmentguage('Water Bodies/Canal /distributaries','water_bodies',data.dimensions[0].water_bodies);
                        addEnvironmentguage('Water Quality Index','wqi',data.dimensions[0].water_quality_index);
                        addEnvironmentguage('Landuse','landuse',data.dimensions[0].landuse);
                        addEnvironmentguage('Air Quality Index','aqi',data.dimensions[0].air_quality_index);
                        addFinalguage('Final Score','total_score',data.dimensions[0].final,aligned);
                        // addEnvironmentguage('Water Quality Index','wqi',data.dimensions[0].pm2);


                        $scope.mapFour('map4',lon,lat,13)

                            var env_logistics='<table class="table table-bordered table-striped">' +
                                '<tr>' +
                                '<td class="col-md-6">Air Quality Index(no2)</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].value_no2).toFixed(1)+'</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Air Quality Index(pm2.5)</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].value_pm2).toFixed(1)+'</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Water Quality Index</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].value_gwq).toFixed(1)+' </td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Distance of Water Bodies</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].distance_waterbodies).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Distance of canal/Distributries</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].distance_canal).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Distance of Cultural/Heritage Sites</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].distance_heritage).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Distance of Conservation Area</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].distance_conservation_area).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Distance of Protected Area</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].distance_protected_area).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Distance of Natural Hazards (floods)</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].distance_flood).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-6">Distance of Natural Hazards (Earthquackes)</td>'+
                                '<td class="col-md-6">'+Number(data.dimensions[0].distance_earthquake_epicenter).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Affected Population</td>'+
                                // '<td class="col-md-6">'+popu+' </td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Landuse type</td>'+
                                // '<td class="col-md-6">'+0+' </td>'+
                                // '</tr>'+
                                '</table>';
                            $("#env_logistics").html(env_logistics);



                    },2000);


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
function addEnvironmentguage(Names,container,val){
    var arr_val=[];
    var color;
    val_new=parseInt(val);
    if(val_new>=0 && val_new<=20){
        color="red"
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: red;font-size:16px;">'+val+'</span>';
    }else if(val_new>20 && val_new <=40){
        color='#f09226';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f09226;font-size:16px;">'+val+'</span>';
    }else if(val_new>40 && val_new <=60){
        color='#f7ef0a';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f7ef0a;font-size:16px;">'+val+'</span>' ;
    }
    else if(val_new>60 && val_new <=80){
        color='#39fa76';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #39fa76 ;font-size:16px;">'+val+'</span>';
    }
    else if(val_new>80 && val_new <=100){
        color='green';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: green;font-size:16px;">'+val+'</span>';
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
            {strokeStyle: "#F03E3E", min: 0, max: 20}, // Red from 100 to 130
            {strokeStyle: "#f09226", min: 21, max: 40}, // Yellow
            {strokeStyle: "#f7ef0a", min: 41, max: 60}, // Green
            {strokeStyle: "#39fa76", min: 61, max: 80}, // Green
            {strokeStyle: "#198c3e", min: 81, max: 100}, // Green
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

}

function addFinalguage(Names,container,val,alignment){
    var arr_val=[];
    var color;
    val_new=parseInt(val);
    if(val_new>=0 && val_new<=40){
        color="red"
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h5').innerHTML='<span style="color: red;font-size:16px;">'+val+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: red;font-size:16px;">'+alignment+'</span>';
    }else if(val_new>40 && val_new <=70){
        color='#f7ef0a';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h5').innerHTML='<span style="color: #f7ef0a;font-size:16px;">'+val+'</span>' ;
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f7ef0a;font-size:16px;">'+alignment+'</span>' ;
    }
    else if(val_new>70 && val_new <=100){
        color='green';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h5').innerHTML='<span style="color: green;font-size:16px;">'+val+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: green;font-size:16px;">'+alignment+'</span>';
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
            {strokeStyle: "#F03E3E", min: 0, max: 40}, // Red from 0 to 40
            {strokeStyle: "#f7ef0a", min: 41, max: 70}, // Yellow
            {strokeStyle: "#198c3e", min: 71, max: 100}, // Green
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

}
