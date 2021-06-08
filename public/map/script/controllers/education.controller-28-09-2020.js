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
var strio=0;
var rmrio=0;
var ptsr=0;

angular.module('educationController',[])
    .directive('educationTemplate',function(){
        return{
            restrict : 'E',
            templateUrl : 'template/education.html',
            controller : ['$scope','$http','$timeout','$mdDialog','$compile',function($scope,$http,$timeout,$mdDialog,$compile){

                $scope.addEducationPcOne=function(){
                    map.removeLayer(drawConLayer);
                    // var str_type='<option>Select Scheme Type</option>';
                    var sub_cat_tab;

                    strio=0;
                  rmrio=0;
                    ptsr=0;

                    $mdDialog.show({
                        controller: connectivityDialogsController,
                        template:
                            '<md-dialog id="dt_dialog" aria-label="drive time">' +
                            '<md-toolbar>' +
                            '<div class="md-toolbar-tools" style="background-color:#178D87">' +
                            '<h2>Scheme Info</h2>' +
                            '<span flex></span>' +
                            '<md-button class="md-icon-button" ng-click="cancel()">' +
                            '<md-icon md-svg-src="images/ic_clear_black_24px.svg" aria-label="Close dialog">' +
                            '</md-icon>' +
                            '</md-button>' +
                            '</div>' +
                            '</md-toolbar>'+
                            '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width:500px;"><form id="geom_radio"><table class="table table-bordered">' +
                            '<tr><td>Scheme Name:</td><td><input type="text" name="scheme_nam" placeholder="scheme name" value="scheme1"  id="scheme_name"></td>' +
                            '</tr>' +
                            '<tr><td>Enter Cost:</td><td><input type="number" name="cost" placeholder="enter cost"  id="cost"></td>' +
                            '</tr>' +
                            '<tr><td>Enter Buffer:</td><td><input type="number" name="buf" placeholder="enter buffer in km" value="2"  id="buf"></td>' +
                            '</tr>' +
                            '<tr>'+
                            '<tr><td>' +
                            '<input type="radio" name="geom" value="point">Draw Point</td>' +
                            '<td><input type="radio" name="geom" value="key_in">Key in Lat/lon</td>'+
                            '</tr>' +
                            '<td>Enter Lat</td>'+
                            '<td><input type="text" name="latlon" placeholder="enter lat"  id="lat12"></td></tr>'+
                            '<tr>' +
                            '<td>Enter Lon</td>'+
                            '<td>'+
                            '<input type="text" name="latlon" placeholder="enter lon"  id="lon12"></td>'+
                            '</tr>' +
                            // '<tr><td>Category of the Scheme: </td><td><select onchange="" id="pss_con_scheme">' + '</select></td></tr>'+
                            //   '<tr><td>Sub Category of the Scheme: </td><td><select onchange="" id="pss_sub_cat_scheme">' + '</select></td></tr>'+
                            // '<tr><td>Capacity of the Scheme: </td><td><select onchange="" id="pss_capacity_scheme">' + '</select></td></tr>'+

                            '</table></form></div>' +
                            '<div class="col-md-4"><md-button ng-click="addNewLineForScheme()" class="md-primary">' +
                            '      Draw Location' +
                            '    </md-button></div></md-dialog>',
                        parent: angular.element(document.body),
                        //targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                    setTimeout(function(){


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
                        // var radio_checked=document.getElementById("pop").checked;
                        //var radio_checked=$('input[name="pop"]:checked').val();;
                        var latlon=$("#lat12").val();
                        var sel_geom = $("#geom_radio input[type='radio']:checked").val();

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

                        else if(sel_geom==undefined &&latlon=="") {
                            alert("please add lat/lon or select any geometry type to add location");
                            return;
                        }
                            // else if($('input[name="pop"]:checked').val()=="undefined"){
                            //     alert("Please Enter Cost Of the Scheme");
                            //     return;
                            // }
                            // else if($('#pss_con_scheme option:selected').text()=="undefined"){
                            //     alert("Please Enter Cost Of the Scheme");
                            //     return;
                            // }
                            // else if($('#pss_sub_cat_scheme option:selected').text()=="undefined"){
                            //     alert("Please Enter Cost Of the Scheme");
                            //     return;
                        // }
                        else {
                            var buf=$("#buf").val();
                            var lat1=parseFloat($("#lat12").val());
                            var lon1=parseFloat($("#lon12").val());




                            if (sel_geom == "point") {
                                $scope.cancel();
                                map.on('click', function (e) {
                                    var lat = e.latlng.lat;
                                    var lon = e.latlng.lng;


                                    var point_drawn = turf.point([lon, lat]);

                                    var buffered = turf.buffer(point_drawn, parseInt(buf), {units: 'kilometers'});
                                    console.log(buffered);
                                    console.log(JSON.stringify(buffered.geometry));
                                    // L.geoJSON(buffered).addTo(map);


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

                                    $.post("services/education/service.php", {"geom": JSON.stringify(buffered.geometry)}, function (response1) {
                                        console.log(response1);
                                        // var pop=parseInt(response1[0].population);
                                        //  console.log(pop)
                                        $scope.checkenvironmentWithPss(lon, lat, scheme_name, cost, response1, buffered);

                                    })


                                });
                            }else{
                                $scope.cancel();
                            var point_drawn = turf.point([lon1, lat1]);

                            var buffered = turf.buffer(point_drawn, parseInt(buf), {units: 'kilometers'});
                            console.log(buffered);
                            console.log(JSON.stringify(buffered.geometry));
                            // L.geoJSON(buffered).addTo(map);


                            drawnGeom = JSON.parse('{"type":"Point","coordinates":[' + lon1 + ',' + lat1 + ']}');


                            console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
                            //Clear existing marker,

                            if (theMarker != undefined) {
                                map.removeLayer(theMarker);
                            }
                            ;

                            //Add a marker to show where you clicked.
                            console.log([lat1, lon1])
                            theMarker = L.marker([lat1, lon1]).addTo(map);
                            map.off("click");

                            $.post("services/education/service.php", {"geom": JSON.stringify(buffered.geometry)}, function (response1) {
                                console.log(response1);
                                // var pop=parseInt(response1[0].population);
                                //  console.log(pop)
                                $scope.checkenvironmentWithPss(lon1, lat1, scheme_name, cost, response1, buffered);

                            })


                        }
                        }}

                    $scope.checkenvironmentWithPss=function(lon,lat,scheme_name,cost,data,buffered){
                        var sc_name=scheme_name;
                        var cost=cost;
                        var sc_geom=drawnGeom;
                        var scheme_schedule;
                        // if (cost<=50){scheme_schedule="IEE";}else if (cost>50){scheme_schedule="EIA";}
                        // var sc_type=$("#pss_scheme option:selected").val();
                        // var sc_district=$("#district_pss option:selected").val();
                        // var sc_tehsil=$("#pss_tehsil option:selected").val();
                        // alert("scheme name"+sc_name+","+"geom"+sc_geom+","+"scheme type"+sc_type+","+"district id"+sc_district+","+"sc_tehsil"+sc_tehsil)

                        console.log(sc_geom)
                        $scope.pssEnvironmentStory(lon,lat,sc_name,cost,data,buffered);
                    }


                    $scope.mapFour = function(containers,lng,lat,zoom,buffered) {
                        // $scope.boundary = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';
                        // $scope.industry = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisporta_industyl_pg31_v_15082018/MapServer/';
                        var map4 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                        var roads = L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo(map4);


                        var point = L.marker([lat, lng]).addTo(map4);
                        L.geoJSON(buffered).addTo(map4);
                        L.geoJSON(buffered).addTo(map);
                        L.esri.dynamicMapLayer({
                            url: 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer',
                            opacity: 0.7,
                            layers: [18]
                        }).addTo(map4);
                    }

                    $scope.pssEnvironmentStory=function(lon,lat,sc_name,cost,data,buffered){

                        // var align=data.dimensions[0].final;
                        // var aligned;
                        // if (align<=40){aligned="Not Aligned with PSS"}
                        // else if (align>40 && align<=70){aligned="Partially Aligned with PSS"}
                        // else if (align && align<=100){aligned="Aligned with PSS"}

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
                                '<h4 style="text-align: center;border-bottom: solid 1px white">Assessment Report of Education Scheme</h4>' +
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

                                // '<tr>' +
                                // '<td><b>Overall Standing:</b></td><td>'+0+' out of 100</td>' +
                                // '</tr>' +

                                // '<tr>' +
                                // '<td><b>District:</b></td><td>'+''+'</td>' +
                                // '</tr>' +
                                //
                                // '<tr>' +
                                // '<td><b>Tehsil:</b></td><td>'+''+'</td>' +
                                // '</tr>' +

                                // '<tr>' +
                                // '<td><b>Mauza:</b></td><td>'+data.dist_teh[0].mauza+'</td>' +
                                // '</tr>' +
                                '<tr>' +
                                '<td><b>Cost:</b></td><td>'+cost+' Million </td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td><b>Scheme Name:</b></td><td>'+sc_name+'</td>' +
                                '</tr>' +
                                // '<tr>' +
                                // '<td><b>IEE/EIA:</b></td><td>'+scheme_schedule+'</td>' +
                                // '</tr>' +
                                '<tr>' +
                                '<td><b>Total Population:</b></td><td>'+data.population_data[0].population+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Kids Population:</b></td><td>'+addVals(data.population_data[0].girls,data.population_data[0].boys)+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Kids girls Population:</b></td><td>'+data.population_data[0].girls+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>Kids boys Population:</b></td><td>'+data.population_data[0].boys+'</td>' +
                                '</tr>' +

                                '<tr>' +
                                '<td><b>School going population:</b></td><td>'+data.stats[0].school_going+'</td>' +
                                '</tr>' +

                                // '<tr>' +
                                // '<td><b>Capacity of the Scheme:</b></td><td>'+100+'</td></tr>' +
                                '<tr>' +
                                '<td><b>Out of school population:</b></td><td>'+subtractVals(data.population_data[0].girls,data.population_data[0].boys,data.stats[0].school_going)+'</td>' +
                                '</tr>' +
                                // '<tr>' +
                                // '<td><b>Influence Population:</b></td><td>'+ radio_chk+'</td>' +
                                // '</tr>' +
                                '<tr>' +
                                '<td><b>Total Schools:</b></td><td>'+addVals(data.stats[0].total_schools,data.private_stats[0].total_schools)+'</td>' +
                                '</tr>' +

                                '</table></div>'+

                                //table end

                                //map div
                                '<div class="col-md-6" style="height: 345px" id="map4"></div>' +
                                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                                '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                                '<h5>Population Charts</h5>'+
                                '</div>' +
                                '</div>'+
                                '<div id="pop_pie" class="col-md-6">'+

                                '</div>'+
                                '<div id="pop_bar" class="col-md-6">'+

                                '</div>'+

                                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                                '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                                '<h5>Public Schools </h5>'+
                                '</div>' +
                                '</div>'+
                                '<div class="col-md-12">'+
                                '<table class="table table-bordered table-striped">' +
                                '<tr>' +
                                '<th>school name</th>'+
                                '<th>school type</th>'+
                                '<th>district</th>'+
                                '<th>tehsil</th>'+
                                '<th>level</th>'+
                                '<th>students</th>'+
                                '<th>teacher</th>'+
                                '<th>rooms</th>'+
                                '<th>enrollment</th>'+
                                '<th>gender_studying</th>'+
                                '<th>Student Teacher Ratio</th>'+
                                '<th>Class Room Ratio</th>'+
                                '</tr>'+

                                schoolsInfo(data.schools_data)+
                                '<tr>' +
                                '<td><b>Total public Info</b></td>'+
                                '<td>'+data.stats[0].total_schools+'</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td><b>'+data.stats[0].student+'</b></b></td>'+
                                '<td><b>'+data.stats[0].teacher+'</b></td>'+
                                '<td><b>'+data.stats[0].room+'</b></td>'+
                                '<td><b>'+data.stats[0].school_going+'</b></td>'+
                                '<td></td>'+
                                '<td id="stro"></td>'+
                                '<td id="rmro"></td>'+
                                '</tr>'+
                                '</table></div>'+

                                '<div class="col-md-6" id="p_st" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                '<canvas  width="200" height="100">' +
                                '</canvas>'+
                                '<h4></h4><br />'+
                                '<h6></h6><br />'+
                                '<p>This meter is showing availability of teachers class rooms against no of students </p>'+
                                '</div>'+

                                '<div class="col-md-6" id="p_sr" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                '<canvas  width="200" height="100">' +
                                '</canvas>'+
                                '<h4></h4><br />'+
                                '<h6></h6><br />'+
                                '<p>This meter is showing availability of class rooms against no of students </p>'+
                                '</div>'+

                                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                                '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                                '<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
                                '<h5>Private Schools </h5>'+
                                '</button>'+
                                '</div>' +
                                '</div>'+
                                '<div id="collapseOne" class="col-md-12">'+
                                '<table class="table table-bordered table-striped">' +
                                '<tr>' +


                                '<th>school name</th>'+
                                '<th>school type</th>'+
                                '<th>district</th>'+
                                '<th>tehsil</th>'+
                                '<th>level</th>'+
                                '<th>students</th>'+
                                '<th>teacher</th>'+
                                '<th>rooms</th>'+
                                '<th>gender_studying</th>'+
                                '<th>Student Teacher Ratio</th>'+
                                '</tr>'+

                                schoolsInfo1(data.private_schools)+

                                '<tr>' +
                                '<td><b>Total private Info</b></td>'+
                                '<td>'+data.private_stats[0].total_schools+'</td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td><b>'+data.private_stats[0].students+'</b></b></td>'+
                                '<td><b>'+data.private_stats[0].teacher+'</b></td>'+
                                '<td></td>'+
                                '<td></td>'+
                                '<td id="ptsr"></td>'+
                                '</tr>'+

                                '</table></div>'+

                                '<div class="col-md-12" id="pri_st" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                                '<canvas  width="200" height="100">' +
                                '</canvas>'+
                                '<h4></h4><br />'+
                                '<h6></h6><br />'+
                                '<p>This meter is showing availability of teachers against no of students </p>'+
                                '</div>'+

                                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                                '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                                '<h5>SITE SUITABILITY PARAMETERS </h5>'+
                                '</div>' +
                                '</div>'+
                                '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                                '<div class="col-md-12">'+
                                '<table class="table table-bordered table-striped">' +
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
                                '</table></div>'+

                                '</md-dialog>',
                            parent: angular.element(document.body),
                            //  targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                        })

                        setTimeout(function(){


                            addPieChartPopulation(data)
                            addBarChartPopulation(data)
                            $scope.mapFour('map4',lon,lat,12,buffered)
                            addEducationguage('Teacher Student Ratio','p_st',parseInt(strio) );
                            addEducationguage('Students Rooms Ratio','p_sr',parseInt(rmrio) );
                            addEducationguage('Students Rooms Ration in private school','pri_st',parseInt(ptsr) );



                            $("#stro").html(strio)
                            $("#rmro").html(rmrio)
                            $("#ptsr").html(ptsr)


                        },2000);


                    }

                }



            }],
            controllerAs:'connectivityCtrl'
        }
    })

function subtractVals(a,b,c){
    var s=addVals(a,b)
    return s-parseInt(b)
}

function addVals(a,b){
    return parseInt(a)+parseInt(b)
}

function schoolsInfo(data){
    var str='';

    for(var i=0;i<data.length;i++) {
        str = str + '<tr>' +
            '<td>' + data[i].school_name_x + '</td>' +
            '<td>' + data[i].school_type_y + '</td>' +
            '<td>' + data[i].school_district + '</td>' +
            '<td>' + data[i].school_tehsil + '</td>' +
            '<td>' + data[i].school_level_y + '</td>' +
            '<td>' + data[i].students_with_furniture + '</td>' +
            '<td>' + data[i].teachers_with_furniture + '</td>' +
            '<td>' + data[i].total_rooms + '</td>' +
            '<td>' + data[i].enrollment + '</td>' +
            '<td>' + data[i].gender_studying + '</td>' +
            '<td>'+studentTeacherRatio(parseInt(data[i].students_with_furniture),parseInt(data[i].teachers_with_furniture))+'</td>'+
            '<td>'+studentTeacherRatio(parseInt(data[i].students_with_furniture),parseInt(data[i].total_rooms))+'</td>'+

            '</tr>';
        strio=strio+parseInt(studentTeacherRatio(parseInt(data[i].students_with_furniture),parseInt(data[i].teachers_with_furniture)))
        rmrio=rmrio+parseInt(studentTeacherRatio(parseInt(data[i].students_with_furniture),parseInt(data[i].total_rooms)));
    }

    strio=strio/data.length.toFixed(2)
    rmrio=rmrio/data.length.toFixed(2)
    return str;
}

function schoolsInfo1(data){
    var str='';
    for(var i=0;i<data.length;i++) {
        str = str + '<tr>' +
            '<td>' + data[i].SchoolName + '</td>' +
            '<td>' + data[i].School_Category + '</td>' +
            '<td>' + data[i].DistrictName + '</td>' +
            '<td>' + data[i].teh_nm + '</td>' +
            '<td>' + data[i].SchoolLevel + '</td>' +
            '<td>' + data[i].Enrollment + '</td>' +
            '<td>' + data[i].Teaching_Staff + '</td>' +
            '<td></td>' +
            '<td>' + data[i].SchoolGender + '</td>' +
            '<td>'+studentTeacherRatio(parseInt(data[i].Enrollment),parseInt(data[i].Teaching_Staff))+'</td>'+

            '</tr>';
        ptsr=ptsr+parseInt(studentTeacherRatio(parseInt(data[i].Enrollment),parseInt(data[i].Teaching_Staff)))
    }
    ptsr=ptsr/data.length.toFixed(2)
    return str;
}

function studentTeacherRatio(a,b){
    return (a/b).toFixed(2);
}

function getCategrory1(geom){
    //angular.element($("#scheme_connectivity")).scope().getCategory('anv')
    //angular.element(document.getElementById("scheme_connectivity")).scope().getCategory()
    cdc.getCategory(geom,'old');

}
function addEducationguage(Names,container,val){
    var arr_val=[];
    var color;
    val_new=parseInt(val);
    if(val_new>=0 && val_new<=20){
        color="#198c3e"
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color:#198c3e;font-size:16px;">'+val+'</span>';
    }else if(val_new>20 && val_new <=40){
        color='#39fa76';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #39fa76;font-size:16px;">'+val+'</span>';
    }else if(val_new>40 && val_new <=60){
        color='#f7ef0a';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f7ef0a;font-size:16px;">'+val+'</span>' ;
    }
    else if(val_new>60 && val_new <=80){
        color='#f09226';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f09226 ;font-size:16px;">'+val+'</span>';
    }
    else if(val_new>80){
        color='#F03E3E';
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #F03E3E;font-size:16px;">'+val+'</span>';
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
            {strokeStyle: "#198c3e", min: 0, max: 20}, // Green
            {strokeStyle: "#39fa76", min: 20, max: 40}, // Green
            {strokeStyle: "#f7ef0a", min: 40, max: 60}, // Yellow
            {strokeStyle: "#f09226", min: 60, max: 80}, // Yellow
            {strokeStyle: "#F03E3E", min: 80, max: 100}, // Red from 100 to 130



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

function addBarChartPopulation(data){
    // Create the chart
    Highcharts.chart('pop_bar', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Population Statistics'
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Population'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}<br/>'
        },

        series: [
            {
                name: "pop",
                colorByPoint: true,
                data: [
                    {
                        name: "population",
                        y: parseInt(addVals(data.population_data[0].girls,data.population_data[0].boys))

                    },
                    {
                        name: "Girls population",
                        y: parseInt(data.population_data[0].girls)

                    },
                    {
                        name: "boys population",
                        y: parseInt(data.population_data[0].boys)
                    },

                    {
                        name: "School Going",
                        y:parseInt(data.stats[0].school_going)
                    },
                    {
                        name: "Out of School",
                        y:parseInt(subtractVals(data.population_data[0].girls,data.population_data[0].boys,data.stats[0].school_going))

                    }

                ]
            }
        ]
    });
}

function calculatePercentage(val,data,c){
    var t_pop=addVals(data.population_data[0].girls,data.population_data[0].boys);
    if(c==1){
        return 100-val;
    }else {
        return (val * 100) / t_pop;
    }
}

function addPieChartPopulation(data) {
   var ouf= parseInt(subtractVals(data.population_data[0].girls,data.population_data[0].boys,data.stats[0].school_going))
   var sg=parseInt(data.stats[0].school_going);
   var d=ouf+sg;
   var su=calculatePercentage(d,data,'');
    Highcharts.chart('pop_pie', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'population of kids'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'kids',
            colorByPoint: true,
            data: [
            //     {
            //     name: 'kids population',
            //     y: calculatePercentage(su,data,'1'),
            //     sliced: true,
            //     selected: true
            // },
                {
                name: 'out of school',
                y: calculatePercentage(sg,data,'')
            }, {
                name: 'school going',
                y: calculatePercentage(ouf,data,'')
            }]
        }]
})
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