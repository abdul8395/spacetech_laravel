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
                            '<div class="md-toolbar-tools" style="background-color:#29323C;color:#7A7B7C;">' +
                            '<h2>Scheme Infooo</h2>' +
                            '<span flex></span>' +
                            '<md-button class="md-icon-button" ng-click="cancel()">' +
                            '<md-icon md-svg-src="images/ic_clear_black_24px.svg" class="editColor" aria-label="Close dialog">' +
                            '</md-icon>' +
                            '</md-button>' +
                            '</div>' +
                            '</md-toolbar>'+
                            '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width:500px;">' +
                            '<form id="geom_radio" style="margin-bottom: 0;">' +
                            '<table class="table borderless" style="margin-bottom: 0;">' +

                            '<tr>' +
                            '<td style="padding-top: 12px; width: 140px;">Scheme Name:</td>' +
                            '<td><input class="form-control shadow-none" style="height: 40px;" type="text" name="scheme_nam" placeholder="scheme name" value="scheme1"  id="scheme_name"></td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td style="padding-top: 12px;">Enter Cost:</td>' +
                            '<td><input class="form-control shadow-none" style="height: 40px;" type="number" name="cost" placeholder="enter cost"  id="cost"></td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td style="padding-top: 12px;">Enter Buffer:</td>' +
                            '<td><input class="form-control shadow-none" style="height: 40px;" type="number" name="buf" placeholder="enter buffer in km" value="2"  id="buf"></td>' +
                            '</tr>' +


                            '<tr>' +
                            '<td style="padding-top: 12px;">Select Draw/Key</td>' +
                            '<td>' +
                            '<span style="margin-right: 30px;"><input type="radio" name="geom" value="point" style="margin-top: 0;margin-right: 10px">Draw Point</span>' +
                            '<span><input type="radio" name="geom" value="key_in" style="margin-top: 0;margin-right: 10px">Key in Lat/lon</span>' +
                            '</td>'+
                            '</tr>' +

                            '<tr>' +
                            '<td style="padding-top: 12px;">Enter Lat</td>'+
                            '<td><input class="form-control shadow-none" style="height: 40px;" type="text" name="latlon" placeholder="enter lat"  id="lat12"></td>' +
                            '</tr>'+

                            '<tr>' +
                            '<td style="padding-top: 12px;">Enter Lon</td>'+
                            '<td><input class="form-control shadow-none" style="height: 40px;" type="text" name="latlon" placeholder="enter lon"  id="lon12"></td>'+
                            '</tr>' +
                            // '<tr><td>Category of the Scheme: </td><td><select onchange="" id="pss_con_scheme">' + '</select></td></tr>'+
                            //   '<tr><td>Sub Category of the Scheme: </td><td><select onchange="" id="pss_sub_cat_scheme">' + '</select></td></tr>'+
                            // '<tr><td>Capacity of the Scheme: </td><td><select onchange="" id="pss_capacity_scheme">' + '</select></td></tr>'+

                            '</table></form></div>' +
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
                                '<div  class="container-fluid" style="padding: 15px;">'+

                                '<div class="col-md-12" style="">' +
                                '<md-button class="float-right" ng-click="cancel()" style="min-width:0;font-weight:bold;font-size:16px;">X</md-button>' +
                                '</div>'+


                                //***********************start of top heading**************************************
                                '<div class="row">' +
                                '<div class="col-md-10" style="padding-left: 45px;padding-right: 0;margin-top: 10px;">' +
                                '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #fff; background-color:#48A947; margin-bottom: 0;text-transform: uppercase;">Assessment Report of Education Scheme</h4>' +
                                '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #fff; background-color:#4E648C; margin-top: 0">Evaluation w.r.t. PSS Alignment</h4>'+
                                '</div>'+
                                '<div class="col-md-2">' +
                                '<img src="images/logo.png">'+
                                '</div>'+
                                '</div>'+

                                //***********************End of top heading*************************************************

                                //table

                                '<div class="row" style="padding-left: 15px;padding-right: 15px;">'+
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
                                        '<td><b>Cost:</b></td><td>'+numberWithCommas(cost)+' Million </td>' +
                                        '</tr>' +
                                        '<tr>' +
                                        '<td><b>Scheme Name:</b></td><td>'+sc_name+'</td>' +
                                        '</tr>' +
                                        // '<tr>' +
                                        // '<td><b>IEE/EIA:</b></td><td>'+scheme_schedule+'</td>' +
                                        // '</tr>' +
                                        '<tr>' +
                                        '<td><b>Total population within census blocks :</b></td><td>'+numberWithCommas(data.population_data[0].population)+'</td>' +
                                        '</tr>' +

                                        '<tr>' +
                                        '<td><b>Total children within census block (aged 3-15):</b></td><td>'+numberWithCommas(addVals(data.population_data[0].girls,data.population_data[0].boys))+'</td>' +
                                        '</tr>' +

                                        '<tr>' +
                                        '<td><b>Kids girls Population(age 3 to 15):</b></td><td>'+numberWithCommas(data.population_data[0].girls)+'</td>' +
                                        '</tr>' +

                                        '<tr>' +
                                        '<td><b>Kids boys Population(age 3 to 15):</b></td><td>'+numberWithCommas(data.population_data[0].boys)+'</td>' +
                                        '</tr>' +

                                        '<tr>' +
                                        '<td><b>Total children enrolled in private and public schools within selected buffer (aged 3-15 years):</b></td><td>'+numberWithCommas(data.stats[0].school_going)+'</td>' +
                                        '</tr>' +

                                        // '<tr>' +
                                        // '<td><b>Capacity of the Scheme:</b></td><td>'+100+'</td></tr>' +
                                        '<tr>' +
                                        '<td><b>Out of school Children(aged 3-15):</b></td><td>'+numberWithCommas(subtractVals(data.population_data[0].girls,data.population_data[0].boys,data.stats[0].school_going))+'</td>' +
                                        '</tr>' +
                                        // '<tr>' +
                                        // '<td><b>Influence Population:</b></td><td>'+ radio_chk+'</td>' +
                                        // '</tr>' +
                                        '<tr>' +
                                        '<td><b>Total private and public schools within selected buffer:</b></td><td>'+numberWithCommas(addVals(data.stats[0].total_schools,data.private_stats[0].total_schools))+'</td>' +
                                        '</tr>' +

                                        '</table>' +
                                    '</div>'+
                                    //table end

                                    //map div
                                    '<div class="col-md-6" style="height: 345px" id="map4">' +
                                    '</div>' +
                                '</div>' +

                                '<div class="row" style="margin-left: 0;margin-bottom:15px;padding-left: 15px;padding-right: 15px;">'+
                                    '<div class="col-md-12"  style="color: #fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                                        '<h5>Need Based Assessment</h5>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;">' +
                                    '<div class="col-md-4"  style="text-align:center; margin: auto;height:330px;">' +
                                        '<div id="total_score" width="200" height="100">' +
                                        '</div>'+
                                        '<h4></h4>'+
                                        '<h6></h6>'+
                                        '<p></p>'+
                                        '<p>This meter is showing availability of teachers class rooms against no of students </p>'+
                                    '</div>'+
                                    '<div class="col-md-4" id="p_st" style="text-align:center; margin: auto;height:330px;">' +
                                        '<canvas  width="200" height="100">' +
                                        '</canvas>'+
                                        '<h4></h4>'+
                                        '<h6></h6>'+
                                        '<p id="st_r_d"> </p>'+
                                    '</div>'+
                                    '<div class="col-md-4" id="p_sr" style="text-align:center; margin: auto;height:330px;">' +
                                        '<canvas  width="200" height="100">' +
                                        '</canvas>'+
                                        '<h4></h4>'+
                                        '<h6></h6>'+
                                        '<p id="p_sr_d"></p>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row" style="margin-left: 0; margin-bottom:15px; margin-top:15px; padding-left: 15px;padding-right: 15px;">'+
                                    '<div class="col-md-12"  style="color: #fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                                        '<h5>Population Charts</h5>'+
                                    '</div>'+
                                '</div>'+



                                '<div id="pop_pie" class="col-md-12">'+

                                '</div>'+
                                // '<div id="pop_bar" class="col-md-6">'+
                                //
                                // '</div>'+

                                '<div class="row" style="margin-left: 0;margin-bottom:15px;padding-left: 15px;padding-right: 15px;">'+
                                    '<div class="col-md-12"  style="color: #fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                                        '<h5>Education Index District Assessment</h5>'+
                                    '</div>'+
                                '</div>'+


                                '<div class="row" style="padding-top: 20px;">'+
                                    '<div class="col-md-9" id="ind_table" style="padding-right: 0;padding-left: 30px;">' +
                                        '<div class="float-left" style="width: 12%;margin: 0 auto;">' +
                                            '<div id="ali">'+'</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Adult literacy rate<br /><p id="ali_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 13%;margin: 0 auto;">' +
                                            '<div id="nep">'+'</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Net enrolment ratio, primary<br /><p id=" _1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 13%;margin: 0 auto;">' +
                                            '<div id="rrs">'+'</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Net enrolment ratio, secondary<br /><p id="rrs_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left"  style="width: 13%;margin: 0 auto;">' +
                                            '<div id="ert">'+'</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Net enrolment ratio, tertiary<br /><p id="ert_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left"  style="width: 13%;margin: 0 auto;">' +
                                            '<div id="yli">'+'</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Youth Literacy<br /><p id="yli_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 13%;margin: 0 auto;;">' +
                                            '<div id="pp">'+'</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">% of children entering grade 1 and graduating till grade 5<br /><p id="pp_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 13%;margin: 0 auto;">' +
                                            '<div id="ei">'+'</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Composite Education Score\n<br /><p id="ei_1"></p></h6>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="col-md-3" style="padding-left: 0;padding-right: 30px;">' +
                                        '<div style="height: 345px" id="map_two"></div>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                                    '<div class="col-md-12">'+
                                        '<p><b> Education Index shows relative position of district in education related outcomes. Higher values indicate relative scoring of district performance to be better than others</b></p>' +
                                    '</div>'+
                                '</div>'+

                                '<div class="row" style="margin-left: 0;margin-bottom:15px;padding-left: 15px;padding-right: 15px;">'+
                                    '<div class="col-md-12"  style="color: #fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                                        '<h5>Public Transport Availability Index</h5>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                                    '<div class="col-md-12">'+
                                        '<p><b>Index indicates overall tehsil level accessibility to public transport. A higher value indicates greater accessibility (at tehsil level) to public transport.facilities.</b></p>' +
                                    '</div>'+
                                '</div>'+

                                //Gauges charts
                                '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px"  id="ptia">'+'</div>'+


                                // '<div id="accordion">'+
                                // '<div class="card">'+
                                // '<div class="card-header">'+
                                // '<a class="card-link" data-toggle="collapse" href="#collapseOne">'+
                                // '<h5>Public Schools </h5>'+
                                // '</a>'+
                                // '</div>'+
                                // '<div id="collapseOne" class="collapse" data-parent="#accordion">'+
                                // '<div class="card-body">This is test panel</div>'+
                                // '</div>'+
                                // '</div>'+
                                // '</div>'+


                                '<div class="row" style="margin-left: 0;margin-bottom:15px;padding-left: 15px;padding-right: 15px;">'+
                                    '<div class="col-md-12" style="color: #fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                                        '<h5>Public Schools</h5>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="row" style="padding-left: 30px;padding-right: 30px;">' +
                                    '<div class="col-md-12">' +
                                        '<table class="table table-bordered table-striped">' +
                                            '<tr>' +
                                            '<th>School name</th>'+
                                            '<th>School type</th>'+
                                            '<th>District</th>'+
                                            '<th>Tehsil</th>'+
                                            '<th>Level</th>'+
                                            '<th>Students</th>'+
                                            '<th>Teacher</th>'+
                                            '<th>Rooms</th>'+
                                            '<th>Enrollment</th>'+
                                            '<th>Dender studying</th>'+
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
                                        '</table>' +
                                    '</div>'+
                                '</div>'+


                                '<div class="row" style="display: none;" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                                '<div class="col-md-12"  style="background-color:#9AEEEA;font-size: 20px;text-align: center;">' +
                                '<h5>Private Schools </h5>'+
                                '</div>' +
                                '</div>'+
                                '<div  class="col-md-12">'+
                                '<table style="display: none;" class="table table-bordered table-striped">' +
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

                                // '<div class="col-md-12" id="pri_st" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;display: none;">' +
                                // '<canvas  width="200" height="100">' +
                                // '</canvas>'+
                                // '<h4></h4><br />'+
                                // '<h6></h6><br />'+
                                // '<p>This meter is showing availability of teachers against no of students </p>'+
                                // '</div>'+

                                

                                '<div class="row" style="margin-left: 0;margin-bottom:15px;padding-left: 15px;padding-right: 15px;">'+
                                '<div class="col-md-12" style="color: #fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                                '<h5>SITE SUITABILITY PARAMETERS</h5>'+
                                '</div>'+
                                '</div>'+



                                '<div class="col-md-12">'+
                                '<table class="table table-bordered table-striped">' +
                                // '<tr>' +
                                // '<td class="col-md-6">Air Quality Index(no2)</td>'+
                                // '<td class="col-md-6">'+Number(data.dimensions[0].value_no2).toFixed(1)+'</td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Air Quality Index(pm2.5)</td>'+
                                // '<td class="col-md-6">'+Number(data.dimensions[0].value_pm2).toFixed(1)+'</td>'+
                                // '</tr>'+
                                '<tr>' +
                                '<th class="col-md-3">Indicator Name</th>'+
                                '<th class="col-md-3">Description</th>'+
                                '<th class="col-md-3">Raw value</th>'+
                                '<th class="col-md-3">Zone</th>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-3">Water Quality Index</td>'+
                                '<td class="col-md-3">Drinking water suitability</td>'+
                                '<td class="col-md-3">'+Number(data.dimensions[0].water_quality_index).toFixed(1)+' </td>'+
                                '<td class="col-md-3">0 to 40 less suitable<br /> 40 to 80 modrate <br /> 80 to 100 highly suitable</td>'+
                                '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Distance of Water Bodies</td>'+
                                // '<td class="col-md-6">'+Number(data.dimensions[0].distance_waterbodies).toFixed(1)+' KM</td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Distance of canal/Distributries</td>'+
                                // '<td class="col-md-6">'+Number(data.dimensions[0].distance_canal).toFixed(1)+' KM</td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Distance of Cultural/Heritage Sites</td>'+
                                // '<td class="col-md-6">'+Number(data.dimensions[0].distance_heritage).toFixed(1)+' KM</td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Distance of Conservation Area</td>'+
                                // '<td class="col-md-6">Drinking water suitability</td>'+
                                // '<td class="col-md-6">'+Number(data.dimensions[0].distance_conservation_area).toFixed(1)+' KM</td>'+
                                // '<td class="col-md-6">red</td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-6">Distance of Protected Area</td>'+
                                // '<td class="col-md-6">'+Number(data.dimensions[0].distance_protected_area).toFixed(1)+' KM</td>'+
                                // '</tr>'+
                                // '<tr>' +

                                '<td class="col-md-3">Distance of Natural Hazards (floods)</td>'+
                                '<td class="col-md-3">Proximity to nearest flood zone</td>'+
                                '<td class="col-md-3">'+Number(data.dimensions[0].distance_flood).toFixed(1)+' KM</td>'+
                                '<td class="col-md-3"></td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td class="col-md-3">Distance of Natural Hazards (Earthquackes)</td>'+
                                '<td class="col-md-3">Proximity to epicenter</td>'+
                                '<td class="col-md-3">'+Number(data.dimensions[0].distance_earthquake_epicenter).toFixed(1)+' KM</td>'+
                                '<td class="col-md-3"></td>'+
                                '</tr>'+
                                // '<tr>' +
                                // '<td class="col-md-3">Roads available in buffer</td>'+
                                // '<td class="col-md-3">Nearest distance to primary/secondary roads</td>'+
                                // '<td class="col-md-3">'+getRoads(data.road)+'</td>'+
                                // '<td class="col-md-3"></td>'+
                                // '</tr>'+

                                '<tr>' +
                                '<td class="col-md-3">Roads available in buffer</td>'+
                                '<td class="col-md-3">Nearest distance to primary/secondary roads</td>'+
                                '<td class="col-md-3">'+parseInt(data.eg[0].ps_road)/1000+' KM</td>'+
                                '<td class="col-md-3"></td>'+
                                '</tr>'+

                                '<tr>' +
                                '<td class="col-md-3">Roads available in buffer</td>'+
                                '<td class="col-md-3">Highway</td>'+
                                '<td class="col-md-3">'+data.eg[0].highway+'km</td>'+
                                '<td class="col-md-3"></td>'+
                                '</tr>'+

                                '<tr>' +
                                '<td class="col-md-3">Electricity Network</td>'+
                                '<td class="col-md-3">Connectivity to nearest</td>'+
                                '<td class="col-md-3">'+data.eg[0].electricity+'km</td>'+
                                '<td class="col-md-3"></td>'+
                                '</tr>'+

                                '<tr>' +
                                '<td class="col-md-3">Gas Network</td>'+
                                '<td class="col-md-3">Connectivity to nearest</td>'+
                                '<td class="col-md-3">'+parseFloat(data.eg[0].gas).toFixed(1)+'km</td>'+
                                '<td class="col-md-3"></td>'+
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
                           // addBarChartPopulation(data)
                            $scope.mapFour('map4',lon,lat,12,buffered)
                            addEducationguage('Student Teacher  Ratio','p_st',parseInt(strio) );
                            $("#st_r_d").html("On average "+parseInt(strio)+"  students are being taught by one teacher, within the selected buffer. To ensure quality standards, it is recommended that not more than 30 students are being taught by a single teacher");
                            addEducationguage('Rooms Students  Ratio','p_sr',parseInt(rmrio) );
                            $("#p_sr_d").html("On average there are "+parseInt(rmrio)+" students per classroom, within the selected buffer. If the total number of students is more than 30 per classroom, then it may lead to overcrowding.");
                         //   addEducationguage('Students Rooms Ration in private school','pri_st',parseInt(ptsr) );
                            var ouos=subtractVals(data.population_data[0].girls,data.population_data[0].boys,data.stats[0].school_going)
                            var tk=addVals(data.population_data[0].girls,data.population_data[0].boys)
                            var total_score=(ouos/tk)*10;
                            addEduGuage('Total Score','total_score',parseInt(total_score));


                            $("#stro").html(strio)
                            $("#rmro").html(rmrio)
                            $("#ptsr").html(ptsr)

                            for(var i=0;i<data.pti.length;i++){
                                var str='<div class="col-md-4" id="pti'+i+'" style="text-align:center; margin: auto;height:200px;">' +
                                '<canvas  width="200" height="100">' +
                                '</canvas>'+
                                '<h4></h4>'+
                                '<h6></h6>'+
                                '</div>';
                                $("#ptia").append(str);
                                addEducationguage1(data.pti[i].tehsil,'pti'+i,parseInt(data.pti[i].piai) );

                            }
                            var edu_flask1=parseFloat(data.eu_in[0].adult_litracy_index)*100
                             if(edu_flask1<30){
                                 renderThermoMeter('#FF0000','ali',parseFloat(data.eu_in[0].adult_litracy_index)*100);
                             }else if(edu_flask1>30 && edu_flask1<70){
                                renderThermoMeter('#FFFF00','ali',parseFloat(data.eu_in[0].adult_litracy_index)*100);
                            }else{
                                 renderThermoMeter('#00FF1E','ali',parseFloat(data.eu_in[0].adult_litracy_index)*100);
                             }

                            var edu_flask2=parseFloat(data.eu_in[0].primary_enroll_ratio)*100

                            if(edu_flask2<30){
                                renderThermoMeter('#FF0000','nep',parseFloat(data.eu_in[0].primary_enroll_ratio)*100);
                            }else if(edu_flask2>30 && edu_flask2<70){
                                renderThermoMeter('#FFFF00','nep',parseFloat(data.eu_in[0].primary_enroll_ratio)*100);
                            }else{
                                renderThermoMeter('#00FF1E','nep',parseFloat(data.eu_in[0].primary_enroll_ratio)*100);
                            }

                            var edu_flask3=parseFloat(data.eu_in[0].secondary_enroll_ratio)*100

                            if(edu_flask3<30){
                                renderThermoMeter('#FF0000','rrs',parseFloat(data.eu_in[0].secondary_enroll_ratio)*100);
                            }else if(edu_flask3>30 && edu_flask3<70){
                                renderThermoMeter('#FFFF00','rrs',parseFloat(data.eu_in[0].secondary_enroll_ratio)*100);
                            }else{
                                renderThermoMeter('#00FF1E','rrs',parseFloat(data.eu_in[0].secondary_enroll_ratio)*100);
                            }

                            var edu_flask4=parseFloat(data.eu_in[0].tertairy_enroll_ratio)*100

                            if(edu_flask4<30){
                                renderThermoMeter('#FF0000','ert',parseFloat(data.eu_in[0].tertairy_enroll_ratio)*100);
                            }else if(edu_flask4>30 && edu_flask4<70){
                                renderThermoMeter('#FFFF00','ert',parseFloat(data.eu_in[0].tertairy_enroll_ratio)*100);
                            }else{
                                renderThermoMeter('#00FF1E','ert',parseFloat(data.eu_in[0].tertairy_enroll_ratio)*100);
                            }

                            var edu_flask5=parseFloat(data.eu_in[0].youth_literacy_index)*100


                            if(edu_flask5<30){
                                renderThermoMeter('#FF0000','yli',parseFloat(data.eu_in[0].youth_literacy_index)*100);
                            }else if(edu_flask5>30 && edu_flask5<70){
                                renderThermoMeter('#FFFF00','yli',parseFloat(data.eu_in[0].youth_literacy_index)*100);
                            }else{
                                renderThermoMeter('#00FF1E','yli',parseFloat(data.eu_in[0].youth_literacy_index)*100);
                            }

                            var edu_flask6=parseFloat(data.eu_in[0].primary_passed)*100


                            if(edu_flask6<30){
                                renderThermoMeter('#FF0000','pp',parseFloat(data.eu_in[0].primary_passed)*100);
                            }else if(edu_flask6>30 && edu_flask6<70){
                                renderThermoMeter('#FFFF00','pp',parseFloat(data.eu_in[0].primary_passed)*100);
                            }else{
                                renderThermoMeter('#00FF1E','pp',parseFloat(data.eu_in[0].primary_passed)*100);
                            }

                            var edu_flask7=parseFloat(data.eu_in[0].education_index)*100

                            if(edu_flask7<30){
                                renderThermoMeter('#FF0000','ei',parseFloat(data.eu_in[0].education_index)*100);
                            }else if(edu_flask7>30 && edu_flask7<70){
                                renderThermoMeter('#FFFF00','ei',parseFloat(data.eu_in[0].education_index)*100);
                            }else{
                                renderThermoMeter('#00FF1E','ei',parseFloat(data.eu_in[0].education_index)*100);
                            }
                            mapTwo('map_two',lon,lat,5);

                        },2000);


                    }

                }

            }],
            controllerAs:'connectivityCtrl'
        }
    })

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRoads(data){
    str='';
    for(var i=0;i<data.length;i++){
        if(i!=data.length-1) {
            str = str + data[i].road_class + ',';
        }else{
            str = str + data[i].road_class;
        }
    }
return str;
}

 function mapTwo(containers,lng,lat,zoom) {

     var map4 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
     var roads = L.gridLayer.googleMutant({
         type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
     }).addTo(map4);


     L.esri.dynamicMapLayer({
         url:'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_education_index_v_28072020/MapServer',
         opacity: 0.7,
         layers: [0]
     }).addTo(map4);

}

function subtractVals(a,b,c){
    var s=addVals(a,b)
    return s-parseInt(b)
}

function addVals(a,b){
    return parseInt(a)+parseInt(b)
}

function schoolsInfo(data){
    var str='';
     var t_teachers=0;
     var t_students=0;
     var t_rooms=0;
    for(var i=0;i<data.length;i++) {
        str = str + '<tr>' +
            '<td style="width:170px;">' + data[i].school_name_x + '</td>' +
            '<td style="width:100px;">' + data[i].school_type_y + '</td>' +
            '<td style="width:100px;">' + data[i].school_district + '</td>' +
            '<td style="width:55px;">' + data[i].school_tehsil + '</td>' +
            '<td style="width:55px;">' + data[i].school_level_y + '</td>' +
            '<td style="width:55px;">' + data[i].students_with_furniture + '</td>' +
            '<td style="width:55px;">' + data[i].teachers + '</td>' +
            '<td style="width:55px;">' + data[i].total_rooms + '</td>' +
            '<td style="width:55px;">' + data[i].enrollment + '</td>' +
            '<td style="width:100px;">' + data[i].gender_studying + '</td>' +
            '<td style="width:100px;">'+studentTeacherRatio(parseInt(data[i].enrollment),parseInt(data[i].teachers))+'</td>'+
            '<td style="width:100px;">'+studentTeacherRatio(parseInt(data[i].enrollment),parseInt(data[i].total_rooms))+'</td>'+

            '</tr>';
        t_students=t_students+parseInt(data[i].enrollment);
        if(data[i].teachers!=null) {
            t_teachers = t_teachers + parseInt(data[i].teachers);
        }
        t_rooms=t_rooms+parseInt(data[i].total_rooms);

       // strio=strio+parseInt(studentTeacherRatio(parseInt(data[i].students_with_furniture),parseInt(data[i].teachers_with_furniture)))
       // rmrio=rmrio+parseInt(studentTeacherRatio(parseInt(data[i].students_with_furniture),parseInt(data[i].total_rooms)));
    }

   // strio=strio/data.length.toFixed(2)
   // rmrio=rmrio/data.length.toFixed(2)
    strio=t_students/t_teachers;
    rmrio=t_students/t_rooms;
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

function addEducationguage1(Names,container,val){
    var arr_val=[];
    var color;
    val_new=parseInt(val);
    if(val_new>=0 && val_new<=20){
        color="#F03E3E"
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color:#198c3e;font-size:16px;">'+val+'</span>';
    }

        else if(val_new>20 && val_new <=40){
            color='#f09226';
            document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
            document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #39fa76;font-size:16px;">'+val+'</span>';
        }else if(val_new>40 && val_new <=60){
            color='#f7ef0a';
            document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
            document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f7ef0a;font-size:16px;">'+val+'</span>' ;
        }
        else if(val_new>60 && val_new <=80){
            color='#39fa76';
            document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
            document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f09226 ;font-size:16px;">'+val+'</span>';
    }


    else if(val_new>80 && val_new <=100){
        color='#198c3e';
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
            {strokeStyle: "#F03E3E", min: 0, max: 20}, // Green
             {strokeStyle: "#f09226", min: 20, max: 40}, // Green
             {strokeStyle: "#f7ef0a", min: 40, max: 60}, // Yellow
            {strokeStyle: "#39fa76", min: 60, max: 80}, // Yellow
            {strokeStyle: "#198c3e", min: 80, max: 100}, // Red from 100 to 130



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


function addEducationguage(Names,container,val){
    var arr_val=[];
    var color;
    val_new=parseInt(val);
    if(val_new>=0 && val_new<=30){
        color="#198c3e"
        document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
        document.getElementById(container).querySelector('h6').innerHTML='<span style="color:#198c3e;font-size:16px;">'+val+'</span>';
     }
    //else if(val_new>20 && val_new <=40){
    //     color='#39fa76';
    //     document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
    //     document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #39fa76;font-size:16px;">'+val+'</span>';
    // }else if(val_new>40 && val_new <=60){
    //     color='#f7ef0a';
    //     document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
    //     document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f7ef0a;font-size:16px;">'+val+'</span>' ;
    // }
    // else if(val_new>60 && val_new <=80){
    //     color='#f09226';
    //     document.getElementById(container).querySelector('h4').innerHTML='<span style="color: #98999F">'+Names+'</span>';
    //     document.getElementById(container).querySelector('h6').innerHTML='<span style="color: #f09226 ;font-size:16px;">'+val+'</span>';
    // }
    else if(val_new>30 && val_new <=60){
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
            {strokeStyle: "#198c3e", min: 0, max: 30}, // Green
            // {strokeStyle: "#39fa76", min: 20, max: 40}, // Green
            // {strokeStyle: "#f7ef0a", min: 40, max: 60}, // Yellow
            // {strokeStyle: "#f09226", min: 60, max: 80}, // Yellow
            {strokeStyle: "#F03E3E", min: 30, max: 60}, // Red from 100 to 130



        ],//
        generateGradient: true,
        highDpiSupport: true,     // High resolution support

    };
    var target = document.getElementById(container).querySelector('canvas'); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 60; // set max gauge value
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
            text: 'Out of school children pie chart'
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
                y: calculatePercentage(sg,data,''),
                color:'red'
            }, {
                name: 'children enrolled at private/public schools',
                y: calculatePercentage(ouf,data,''),
                color:'green'
            }]
        }]
})
}

function addEduGuage(Names,container,val){
    var arr_val=[];

    var myobj={}
   // if(container=='total_score'){
        myobj={
            "chart": {
                "theme": "fusion",
                "caption": Names,
                "lowerLimit": "0",
                "upperLimit": "10",
                // "numberSuffix": "%",
                //  "chartBottomMargin": "40",
                //  "valueFontSize": "11",
                //"valueFontBold": "0"
            },
            "colorRange": {
                "color": [
                //     {
                //     "minValue": "0",
                //     "maxValue": "3",
                //     "code": "",
                //     // "label": "Low",
                // },
                    {
                    "minValue": "0",
                    "maxValue": "1",
                    "code": "#005801",
                    // "label": "Moderate",
                    }, {
                        "minValue": "1",
                        "maxValue": "2",
                        "code": "#00AB00",
                        // "label": "Moderate",
                    }, {
                        "minValue": "2",
                        "maxValue": "3",
                        "code": "#00FC01",
                        // "label": "Moderate",
                    }, {
                        "minValue": "3",
                        "maxValue": "4",
                        "code": "#4EFF4F",
                        // "label": "Moderate",
                    }, {
                        "minValue": "4",
                        "maxValue": "5",
                        "code": "#95F8AD",
                        // "label": "Moderate",
                    }, {
                        "minValue": "5",
                        "maxValue": "6",
                        "code": "#FFBABA",
                        // "label": "Moderate",
                    },{
                    "minValue": "6",
                    "maxValue": "7",
                    "code": "#FF7B7B",
                    //  "label": "High",
                    },{
                        "minValue": "7",
                        "maxValue": "8",
                        "code": "#FF5252",
                        //  "label": "High",
                    },{
                        "minValue": "8",
                        "maxValue": "9",
                        "code": "#FF0000",
                        //  "label": "High",
                    },{
                        "minValue": "9",
                        "maxValue": "10",
                        "code": "#A70000",
                        //  "label": "High",
                    }]
            },
            "pointers": {
                "pointer": [{
                    "value": val
                }]
            }

        }
  //  }

    // else{
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


function renderThermoMeter(color,container,val){
    var arr_val=[];
    arr_val.push(val);
    therm_val=val;
    var mark;
    var values;
    var width;
    if(container=='community1'){
        mark="1";
        values="1";
        width='160'
    }else{
        mark="0";
        values="0";
        width='80'
    }

    FusionCharts.ready(function() {

        $("#"+container+"_1").html(val+'%');

        var chart = new FusionCharts({
            type: 'thermometer',
            renderAt: container,
            id: 'temp-monitor',
            width: width,
            height: '200',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "theme": "fusion",
                    "ticksOnRight": "0",
                    //"caption": "Central cold storage",
                    //  "subcaption": "Bakersfield Central",
                    "subcaptionFontBold": "0",
                    "lowerLimit": "0",
                    "upperLimit": "100",
                    "numberSuffix": "",
                    "bgColor": "#ffffff",
                    "showBorder": "0",
                    "thmFillColor": color,
                    "showTickMarks": mark,
                    "showTickValues": values
                },
                "value": val
            }

        }).render();

    });

    // setTimeout(function(){
    //     $('.raphael-group-227-creditgroup').html('');
    // },500)
    // $(container).highcharts({
    //     chart: {
    //         type: 'column',
    //         marginBottom: 72
    //     },
    //     credits: {
    //         enabled: false
    //     },
    //     title: null,
    //     legend: {
    //         enabled: false
    //     },
    //     exporting: {
    //         enabled: false
    //     },
    //     yAxis: {
    //         min: 0,
    //         max: 100,
    //         title: name,
    //         align: 'center'
    //     },
    //     xAxis: {
    //         labels: name
    //     },
    //     series: [{
    //         data: arr_val,
    //         color: '#c00'
    //     }]
    // }, function(chart) { // on complete
    //
    //    // chart.renderer.image('thrmo.png',30, 0, 110, 300).add();
    // });

}
