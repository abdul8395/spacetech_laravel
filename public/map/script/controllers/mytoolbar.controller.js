var scheme_name="";

var rural_water_scheme_name="";

var urban_water_scheme_name="";


var industryAddLayer="";

var sel_geom="point";

var theMarker = {};

var drawnGeom="";

var pss_dist="";

var pss_teh="";

var nineDimensiosVal="";

var cost="";
var therm_val='';
var lat;
var lon;


var selectionApp=angular.module('mytoolbarController',[]);
selectionApp.directive('mytoolbarTemplate',function(){



        return{
            restrict : 'E',
            templateUrl : 'template/mytoolbar.html',
            controller : ['$scope','$http','$timeout','$mdDialog',function($scope,$http,$timeout,$mdDialog){

                var self=this;
                $scope.tb1=true;
                $scope.tb2=false;
                $scope.tb3=false;
                $scope.tool=true;
                $scope.map_paint=false;
                $scope.savejobs=true;



                if(loged_in_username=="industry"){
                    $scope.road_score_card=false;
                    $scope.scheme_align_with_pss=true;
                    $scope.pss_class="industry";
                }else if(loged_in_username=="water"){
                    $scope.road_score_card=false;
                    $scope.scheme_align_with_pss=false;
                    $scope.water_scheme_align_with_pss=true;
                    $scope.pss_class="industry";
                }else if(loged_in_username=="connectivity"){
                    $scope.connectivity_scheme_align_with_pss=true;
                    $scope.road_score_card=false;
                    $scope.scheme_align_with_pss=false;
                    $scope.water_scheme_align_with_pss=false;
                    $scope.pss_class="industry";
                }else if(loged_in_username=="environment"){
                    $scope.environment_scheme_align_with_pss=true;
                    $scope.road_score_card=false;
                    $scope.scheme_align_with_pss=false;
                    $scope.water_scheme_align_with_pss=false;
                    $scope.pss_class="industry";
                }else if(loged_in_username=="education"){
                    $scope.education_scheme_align_with_pss=true;
                    $scope.road_score_card=false;
                    $scope.scheme_align_with_pss=false;
                    $scope.water_scheme_align_with_pss=false;
                    $scope.pss_class="industry";
                }else if(loged_in_username=="agriculture"){
                    $scope.agriculture_scheme_align_with_pss=true;
                    $scope.environment_scheme_align_with_pss=false;
                    $scope.road_score_card=false;
                    $scope.scheme_align_with_pss=false;
                    $scope.water_scheme_align_with_pss=false;
                    $scope.pss_class="industry";
                }else{
                    $scope.road_score_card=true;
                    $scope.water_scheme_align_with_pss=false;
                    $scope.scheme_align_with_pss=false;
                    $scope.pss_class="normal_admin";
                }



                // function showDriveInputDialog($scope,$mdDialog) {
                //     $mdDialog.show({
                //         clickOutsideToClose: true,
                //
                //         scope: $scope,        // use parent scope in template
                //         preserveScope: true,  // do not forget this if use parent scope
                //
                //         // Since GreetingController is instantiated with ControllerAs syntax
                //         // AND we are passing the parent '$scope' to the dialog, we MUST
                //         // use 'vm.<xxx>' in the template markup
                //
                //         template: '<md-dialog>' +
                //         '  <md-dialog-content>' +
                //         '     Hi There' +
                //         '  </md-dialog-content>' +
                //         '</md-dialog>',
                //
                //         controller: function DialogController($scope, $mdDialog) {
                //             $scope.closeDialog = function() {
                //                 $mdDialog.hide();
                //             }
                //         }
                //     });
                //
                // }




                // $scope.addDistrictTehsil = function(ev) {
                //             $mdDialog.show({
                //                 controller: IndustryController,
                //                 width:'400px',
                //                 template: '<md-dialog  id="in_dialog" aria-label="drive time"><md-toolbar>' +
                //                 '<div class="md-toolbar-tools">' +
                //                 '<h2>Add district Tehsil</h2>' +
                //                 '<span flex></span>' +
                //                 '<md-button class="md-icon-button" ng-click="cancel()">' +
                //                 '<md-icon md-svg-src="images/ic_clear_black_24px.svg" class="editColor" aria-label="Close dialog">' +
                //                 '</md-icon>' +
                //                 '</md-button>' +
                //                 '</div>' +
                //                 '</md-toolbar>' +
                //                 '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width:500px;">' +
                //                 '<table class="table table-bordered"><tr><td>Scheme Type:</td><td><select onchange="" id="pss_scheme">' +
                //                 '<option value="select scheme">select scheme</option>'+
                //                 '<option value="Small industrial estate">Small industrial estate</option>'+
                //                 '<option value="Industrial zone - PIEDMC / FIEDMC">Industrial zone - PIEDMC / FIEDMC</option>'+
                //                 '<option value="Special Industrial Zone - PIEDMC / FIEDMC">Special Industrial Zone - PIEDMC / FIEDMC</option>'+
                //                 '<option value="Education institute - TEVTA">Education institute - TEVTA</option>'+
                //                 '</select></td></tr>'+
                //                 '<tr><td>District: </td><td>' +
                //                 '<div id="district_pss"></div></td></tr>' +
                //                 '<tr><td>Tehsil:</td><td>' +
                //                 '<div id="tehsil_pss"></div>'+
                //                 '</div>' +
                //                 '</td></tr>'+
                //                 '<tr><td><div class="col-md-4"><md-button ng-click="goBack()" class="md-primary">' +
                //                 '     Back ' +
                //                 '    </md-button></div></td>'+
                //                 '<td><div class="col-md-4"><md-button ng-click="checkAlignWithPss()" class="md-primary">' +
                //                 '     Get Info ' +
                //                 '    </md-button></div></td></tr></md-dialog>'+
                //                 '</table>',
                //                 parent: angular.element(document.body),
                //                 targetEvent: ev,
                //                 clickOutsideToClose: true,
                //                 fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                //             })
                //
                //     // setTimeout(function () {
                //     //     var str='<option></option>';
                //     //     for(var i=0;i<allAdminData.district.length;i++){
                //     //
                //     //         str=str+"<option value='"+allAdminData.district[i].gid+"'>"+allAdminData.district[i].district_name+"</option>";
                //     //
                //     //     }
                //     //
                //     //     $("#district_pss").html(str);
                //     // },500 )
                //
                //     var sc_geom=drawnGeom;
                //
                //     $.post( "services/district_tehsil_pss.php",{"geom":JSON.stringify(sc_geom)}, function(response1) {
                //        // console.log(response1);
                //     //    $("#district_pss").html(response1[0].district_name);
                //      //   $("#tehsil_pss").html(response1[0].tehsil_name);
                //
                //         pss_dist=response1[0].district_name;
                //         pss_teh=response1[0].tehsil_name;
                //     })
                //
                //
                // };



                $scope.goToXY = function(ev) {

                        $mdDialog.show({
                        controller: IndustryController,
                        template:
                        '<md-dialog id="dt_dialog" aria-label="drive time">' +
                        '<md-toolbar>' +
                        '<div class="md-toolbar-tools" style="background-color:#29323C;color:#7A7B7C;">' +
                        '<h2>Go to XY</h2>' +
                        '<span flex></span>' +
                        '<md-button class="md-icon-button" ng-click="cancel()">' +
                        '<md-icon md-svg-src="images/ic_clear_black_24px.svg" class="editColor" aria-label="Close dialog">' +
                        '</md-icon>' +
                        '</md-button>' +
                        '</div>' +
                        '</md-toolbar>'+
                        '<div style="padding:40px 40px 0 40px;">' +
                        '<form id="geom_radio" style="padding: 10px;margin-bottom: 0;">' +
                        '<table style="margin-top: 10px;">' +
                        '<tr>' +
                        '<td style="padding-top: 0; width: 100px;">Lat:</td><td><input class="form-control shadow-none" style="width:270px; height: 40px;" type="text" name="x" placeholder="lat" value=""  id="x"></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td style="padding-top: 0; width: 100px;">Lon:</td><td><input class="form-control shadow-none" style="width:270px; height: 40px;" type="text" name="y" placeholder="lon"  id="y"></td>' +
                        '</tr>' +
                        '</table>' +
                        '</form>' +
                        '</div>' +
                        '<div style="margin-bottom: 30px;margin-right: 42px;">' +
                        '<md-button style="float: right;background-image: unset;border-radius: 0;" ng-click="goToMyXY()" class="btn btn-primary">' +
                        'Go To XY' +
                        '</md-button>' +
                        '</div>' +
                        '</md-dialog>',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })


                };



                $scope.addPcOne = function(ev) {
                    var str_type='<option>Select Type</option>';
                    $.post( "services/scheme_types.php",'', function(response1) {
                        //alert(response1);

                        for(var i=0;i<response1.length;i++){
                            str_type=str_type+'<option value="'+response1[i].scheme_type+'">'+response1[i].scheme_type+'</option>';
                        }


                    $mdDialog.show({
                        controller: IndustryController,
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
                        '<form id="geom_radio" style="margin-bottom: 0;">' +
                        '<table class="table borderless" style="margin-bottom: 0;">' +
                        '<tr><td style="padding-top: 12px; width: 140px;">Scheme Name</td><td><input class="form-control shadow-none" style="height: 40px;" type="text" name="scheme_nam" placeholder="Enter Scheme Name" value="Scheme1"  id="scheme_name"></td>' +
                        '</tr>' +
                        '<tr><td style="padding-top: 12px;">Enter Cost</td><td><input class="form-control shadow-none" style="height: 40px;" type="text" name="cost" placeholder="Enter Cost"  id="cost"></td>' +
                        '</tr>' +
                        '<tr><td style="padding-top: 12px;">Scheme Type</td><td><select class="form-control shadow-none" style="height: 40px;border: 1px solid #ccc; padding-left: 5px;" onchange="" id="pss_scheme">' +
                        '</select></td></tr>'+
                        '<tr><td style="padding-top: 12px;">Draw</td>' +
                        '<td>' +
                        '<span style="margin-right: 30px;"><input type="radio" name="geom" value="point" style="margin-top: 0;margin-right: 10px">Draw Point</span>' +
                        '<span><input type="radio" name="geom" value="polygon" style="margin-top: 0;margin-right: 10px">Draw Polygon</span>' +
                        '</td>'+
                        '</tr>' +
                        '<tr>'+
                         '<td style="padding-top: 12px;">Enter Lat</td>'+
                        '<td><input class="form-control shadow-none" style="height: 40px;"  type="text" name="latlon" placeholder="Enter Lat"  id="lat"></td></tr>'+
                        '<tr>' +
                        '<td style="padding-top: 12px;">Enter Lon</td>'+
                        '<td>'+
                        '<input class="form-control shadow-none" style="height: 40px;" type="text" name="latlon" placeholder="Enter Lon"  id="lon"></td>'+
                        '</tr>' +
                        '</table></form></div>' +
                        '<div style="margin-bottom: 30px;margin-right: 10px;">' +
                            '<md-button style="float: right;background-image: unset;border-radius: 0;" ng-click="addNewLocationForScheme()" class="btn btn-primary">' +
                            'Add Location' +
                            '</md-button>' +
                        '</div>' +
                        '</md-dialog>',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                        setTimeout(function(){
                        $("#pss_scheme").html(str_type);
                        },300)
                    })


                };


                // $scope.selectScheme = function(ev) {
                //     $mdDialog.show({
                //         controller: IndustryController,
                //         template: '<md-dialog id="dt_dialog" aria-label="drive time"><md-toolbar>' +
                //         '<div class="md-toolbar-tools">' +
                //         '<h2>Select Scheme Type</h2>' +
                //         '<span flex></span>' +
                //         '<md-button class="md-icon-button" ng-click="cancel()">' +
                //         '<md-icon md-svg-src="images/ic_clear_black_24px.svg" class="editColor" aria-label="Close dialog">' +
                //         '</md-icon>' +
                //         '</md-button>' +
                //         '</div>' +
                //         '</md-toolbar>' +
                //         '<div style="padding-top: 3px;" class="col-md-12">Select Scheme: ' +
                //         '<select onchange="">' +
                //             '<option value="Small industrial estate">Small industrial estate</option>'+
                //             '<option value="Industrial zone - PIEDMC / FIEDMC">Industrial zone - PIEDMC / FIEDMC</option>'+
                //             '<option value="Special Industrial Zone - PIEDMC / FIEDMC">Special Industrial Zone - PIEDMC / FIEDMC</option>'+
                //             '<option value="Education institute - TEVTA">Education institute - TEVTA</option>'+
                //         '</select>' +
                //         '</md-dialog></div>' +
                //         '<div class="col-md-4"><md-button ng-click="addNewLocationForScheme()" class="md-primary">' +
                //         '      Add Location' +
                //         '    </md-button></div>',
                //         parent: angular.element(document.body),
                //         targetEvent: ev,
                //         clickOutsideToClose: true,
                //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                //     })
                //
                // };



                function IndustryController($scope, $mdDialog) {


                   setTimeout(function(){
                    if(scheme_name!=""){
                       $("#scheme_name").val(scheme_name);
                    }
                   },500)




                    $scope.captureImages=function(dim) {

                        $("#TempDataDiv").html($("#myImageId").html());

                        var useHeight = $("#TempDataDiv").prop('scrollHeight');
                        $("#myImageId").html('')
                        addNewguage('community','community',parseInt(nineDimensiosVal[0].community));
                        addNewguage('connectivity','connectivity',parseInt(nineDimensiosVal[0].connectivity));
                        addNewguage('enviroment','enviroment',parseInt(nineDimensiosVal[0].enviroment));
                        addNewguage('humancapital','humancapital',parseInt(nineDimensiosVal[0].humancapital));

                        addNewguage('institutoin','institutoin',parseInt(nineDimensiosVal[0].institutoin));
                        addNewguage('markets','markets',parseInt(nineDimensiosVal[0].markets));
                        addNewguage('raw_matrials','raw_matrials',parseInt(nineDimensiosVal[0].raw_matrials));
                        addNewguage('utilities','utilities',parseInt(nineDimensiosVal[0].utilities));
                        dounetChart();
                        setTimeout(function(){

                        html2canvas($("#TempDataDiv"), {
                            height: useHeight,
                            onrendered: function (canvas) {
                             //   theCanvas = canvas;
                            //    document.body.appendChild(canvas);

                                // Convert and download as image
                                //window.open('', canvas.toDataURL());
                             //   window.open().document.write('<img src="' + canvas.toDataURL() + '" />');

                                //  Canvas2Image.saveAsPNG(canvas);
                                // $("#pin_point").append(canvas);
                                // Clean up
                                //document.body.removeChild(canvas);

                                imageData =  canvas.toDataURL();
                             //   Canvas2Image.saveAsPNG(canvas);
                                $("#TempDataDiv").html("");
                                $scope.cancel();
                                var win = window.open();
                              //  window.open().document.write('<img src="' + imageData + '" />');
                                win.document.write("<br><img src='" + imageData  + "'/>");
                                win.print();
                            }
                        });
                        },2000)
                    }



                    $scope.goToMyXY=function(){
                        if (theMarker != undefined) {
                            map.removeLayer(theMarker);
                        }
                        ;

                        var lat1=parseFloat($("#x").val());
                        var lon1=parseFloat($("#y").val());

                        map.setView( [lat1, lon1], 14);
                        theMarker = L.marker([lat1, lon1]).addTo(map);
                        $scope.cancel();
                    }


                    $scope.addNewLocationForScheme=function() {
                        scheme_name = $("#scheme_name").val();
                        var latlon=$("#lat").val();
                        sel_geom = $("#geom_radio input[type='radio']:checked").val();
                        cost=$("#cost").val();

                        if(cost==""){
                            alert("please enter the cost");
                            return;
                        }

                        if(scheme_name!="") {
                           if(sel_geom==undefined &&latlon=="") {
                               alert("please add lat/lon or select any geometry type to add location");
                               return;
                           }else {

                               $scope.cancel();

                               if (sel_geom == "point") {


                                   map.on('click', function (e) {
                                       lat = e.latlng.lat;
                                       lon = e.latlng.lng;

                                       drawnGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');

                                       // $.post( "services/district_tehsil_pss.php",{"geom":JSON.stringify(sc_geom)}, function(response1) {
                                       //     // console.log(response1);
                                       //     //    $("#district_pss").html(response1[0].district_name);
                                       //     //   $("#tehsil_pss").html(response1[0].tehsil_name);
                                       //
                                       //     pss_dist=response1[0].district_name;
                                       //     pss_teh=response1[0].tehsil_name;
                                       // })

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
                                      // angular.element($("#context")).scope().checkAlignWithPss();
                                       $scope.checkAlignWithPss();
                                   });
                               }else if($("#lat").val()!=""){
                                   if (theMarker != undefined) {
                                       map.removeLayer(theMarker);
                                   }
                                   ;

                                   var lat1=parseFloat($("#lat").val());
                                   var lon1=parseFloat($("#lon").val());
                                   drawnGeom = JSON.parse('{"type":"Point","coordinates":[' + lon1 + ',' + lat1 + ']}');


                                   theMarker = L.marker([lat1, lon1]).addTo(map);
                                   $scope.checkAlignWithPss();
                               } else {

                                   industryAddLayer = new L.Draw.Polygon(map);

                                   //  $('#drawPolygon').click(function() {

                                   industryAddLayer.enable();

                                   // polygonDrawer.disable();


                                   //   });

                                   map.on(L.Draw.Event.CREATED, function (event) {

                                       var layer = event.layer.toGeoJSON();

                                       drawnGeom = layer.geometry;

                                       // alert(layer);
                                       // var newLayer = event.layer;

                                       //industryAddLayer=L.geoJson(layer);
                                       // map.addLayer(industryAddLayer);


                                       industryAddLayer.disable();

                                       $scope.checkAlignWithPss();
                                   });
                               }
                           }
                        }else{
                            alert("please enter scheme name to add location");
                        }
                    }


                    $scope.checkAlignWithPss=function(){
                        var sc_name=scheme_name;
                        var sc_geom=drawnGeom;
                        var sc_type=$("#pss_scheme option:selected").val();
                        var sc_district=$("#district_pss option:selected").val();
                        var sc_tehsil=$("#pss_tehsil option:selected").val();
                        //alert("scheme name"+sc_name+","+"geom"+sc_geom+","+"scheme type"+sc_type+","+"district id"+sc_district+","+"sc_tehsil"+sc_tehsil)

                        $.post( "services/industry_allignment_pss.php",{"geom":JSON.stringify(sc_geom)}, function(response1) {
                            //alert(response1);
                            pss_dist=response1.dist_teh[0].district_name;
                            pss_teh=response1.dist_teh[0].tehsil_name;

                            if(parseInt(response1.dimentions[0].final_score)>=60){
                               // alert("not aligned with pss")
                                $mdDialog.cancel();

                                $scope.allignmentWithPssStory("<p style='color: green;'>Aligned with PSS</p>",response1.dimentions,response1.cooridoor,response1.env_sectoral,response1.near_suitable,response1.env_spatial[0]);

                            }else{
                                $mdDialog.cancel();
                                if(response1.cooridoor.status=="false") {
                                    $scope.allignmentWithPssStory("<p style='color: red;'>Not aligned with PSS</p>", response1.dimentions, response1.cooridoor, response1.env_sectoral, response1.near_suitable, response1.env_spatial[0]);
                                }else{
                                    $scope.allignmentWithPssStory("<p style='color: green;'>Aligned with PSSz</p>", response1.dimentions, response1.cooridoor, response1.env_sectoral, response1.near_suitable, response1.env_spatial[0]);

                                }
                            }
                        })
                            .fail(function() {
                                alert( "error" );
                            })

                      //  $mdDialog.cancel();
                       // map.removeLayer(theMarker);
                     //   map.removeLayer(drawnItems);


                      //  alert("it is aligned with pss");
                    }


                    // $scope.checkAlignWithEnvironment=function(){
                    //     var sc_name=scheme_name;
                    //     var sc_geom=drawnGeom;
                    //     var sc_type=$("#pss_scheme option:selected").val();
                    //     var sc_district=$("#district_pss option:selected").val();
                    //     var sc_tehsil=$("#pss_tehsil option:selected").val();
                    //     //alert("scheme name"+sc_name+","+"geom"+sc_geom+","+"scheme type"+sc_type+","+"district id"+sc_district+","+"sc_tehsil"+sc_tehsil)
                    //
                    //     $.post( "services/industry_allignment_pss.php",{"geom":JSON.stringify(sc_geom)}, function(response1) {
                    //         //alert(response1);
                    //         if(response1.align==false){
                    //             // alert("not aligned with pss")
                    //             $mdDialog.cancel();
                    //             $scope.allignmentWithEnvStory("not aligned with Environment",response1.dimentions[0]);
                    //
                    //         }else{
                    //             $mdDialog.cancel();
                    //             $scope.allignmentWithEnvStory("Aligned with Environment",response1.dimentions[0]);
                    //         }
                    //     })
                    //         .fail(function() {
                    //             alert( "error" );
                    //         })
                    //
                    //     //  $mdDialog.cancel();
                    //     // map.removeLayer(theMarker);
                    //     //   map.removeLayer(drawnItems);
                    //
                    //
                    //     //  alert("it is aligned with pss");
                    // }



                    $scope.allignmentWithPssStory=function(res,dim,coorridor,environ,near_suitable,env_spatial){
                         nineDimensiosVal=dim
                        localStorage["community"] = dim[0].community;
                        localStorage["connectivity"] = dim[0].connectivity;
                        localStorage["enviroment"] = dim[0].enviroment;
                        localStorage["humancapital"] = dim[0].humancapital;
                        localStorage["institutoin"] = dim[0].institutoin;
                        localStorage["markets"] = dim[0].markets;
                        localStorage["raw_matrials"] = dim[0].raw_matrials;
                        localStorage["utilities"] = dim[0].utilities;

                        localStorage["sn"] = scheme_name;
                        localStorage["dist"] = pss_dist;
                        localStorage["th"] = pss_teh;
                        localStorage["res"] = res;

                     //   localStorage["rule"] = coorridor.name;
                     //   localStorage["status"] = coorridor.status;
                     //   localStorage["corridoor_name"] = coorridor.corridoor_name;
                        localStorage["flood"] = environ[0].flood;



                        $mdDialog.show({
                            controller: IndustryController,
                            template: '<md-dialog id="dt_dialog" aria-label="drive time" style="">' +



							
							
							

                           // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                           //  '<div  class="container-fluid" style="padding-left: 0px;padding-right: 0px;margin-left: 0px;margin-right: 0px;">'+
                            '<div  class="container-fluid" style="">'+
                            //***********************start of top heading**************************************
							//'<div style="float: right;"><md-button class="md-raised" ng-click="cancel()">Close</md-button></div>'+\
							
							
							'<div class="col-md-12 " style="margin-bottom: 10px;">' +
                                '<md-button class="float-right" ng-click="cancel()" style="font-weight:bold;font-size:16px;">X</md-button>' +
                            '</div>'+
							
                            '<div class="row">' +
                            '<div class="col-md-10" style="padding-left: 45px;padding-right: 0;margin-top: 10px;">' +
                            '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #fff; background-color:#48A947; margin-bottom: 0;text-transform: uppercase;">  Site Suitability Assessment for Industrial Estates/SEZs </h4>' +
                            '<h4 style="text-align: center;padding: 10px; font-size:16px; color: #fff; background-color:#4E648C; margin-top: 0">PROPOSED SITE CHARACTERISTICS</h4>'+
                            '</div>'+
                            '<div class="col-md-2">' +
                            '<img src="images/logo.png">'+
                            '</div>'+
                            '</div>'+

                           //***********************End of top heading*************************************************

                            '<div class="row" style="margin-left: 0px;">'+
                            //'<div class="col-md-12">'+
                            '<div class="col-md-6">'+
                            '<table class="table table-bordered table-striped">' +
                            '<tr>' +
                            '<td><b>Overall Standing:</b></td><td>'+parseInt(dim[0].final_score)+' out of 100</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>District:</b></td><td>'+pss_dist+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Tehsil:</b></td><td>'+pss_teh+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Mauza:</b></td><td>'+env_spatial.mauza+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Cost:</b></td><td>'+cost+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Scheme Name:</b></td><td>'+scheme_name+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Nearest Primary City:</b></td><td>'+env_spatial.city_name+'</td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td><b>Nearest SEZ/Industrial Estate:</b></td><td>'+env_spatial.estate_name+'</td>' +
                            '</tr>' +

                             '<tr>' +
                            '<td><b>Floods and Risk area:</b></td><td>'+$scope.removeNullValuse(environ[0].flood)+'</td></tr>' +
                            '<tr>' +
                            '<td><b>Protected Area:</b></td><td>'+$scope.removeNullValuse(env_spatial.protected_areas)+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td><b>Result:</b></td><td>'+res+'</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>'+
                            '<div class="col-md-6">' +
                            '<div id="pin_point1" width="90%" height="450px"></div>'+
                            '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >'+
                            '<img src="images/main.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">'+
                            '</div>'+
                            '</div>'+
                            //'</div>'+
                            '</div>'+


                          //*********************************end of row Two *************************************

                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">'+
                            '<div class="col-md-12"  style="color: #fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>PROPOSED SITE READINESS GAUGES</h5>'+
                            '</div>'+
                            '</div>'+

                            '<div class="row"  style="margin-left: 0px;padding-left: 15px;padding-right: 15px;">'+
                            //'<div class="col-md-12">'+
                            '<div class="col-md-12"  style=" text-align:center; margin: auto;">' +
                            '<canvas id="total_score" width="200" height="100">' +
                            '</canvas>'+
                            '<h4 id="frs"></h4>'+
                            '</div>'+

                            '<div class="col-md-3" id="community" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Community includes schools and hospitals (DHQs, THQs, GHs, etc.) in the ' +
                            'areas surrounding the site.</p>'+
                            '</div>'+
                            '<div class="col-md-3" id="connectivity" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Connectivity &amp; Logistics accounts for the availability and\n' +
                            'access to airports, dry ports, railways, interchanges, highways, primary and secondary\n' +
                            'roads. It also calculates transport time from the chosen location.</p>'+
                            '</div>'+
                            '<div class="col-md-3"  id="enviroment" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Environment studies the ground water quality, air quality and\n' +
                            'temperatures around the chosen location.</p>'+
                            '</div>'+
                            '<div class="col-md-3" id="humancapital" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Human Capital accounts for the settlements, government colleges,\n' +
                            'universities and TEVTA institutes in the areas surrounding the chosen location.</p>'+
                            '</div>'+

                            '<div class="col-md-3" id="institutoin" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Institutions include district headquarters and police stations in the\n' +
                            'surrounding areas.</p>'+
                            '</div>'+
                            '<div class="col-md-3" id="markets" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Markets examines industry concentration, population and population growth\n' +
                            'rate, primary and intermediate cities in areas surrounding the site.</p>'+
                            '</div>'+
                            '<div class="col-md-3" id="raw_matrials" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Raw Materials looks into the extent to which minerals, mines and\n' +
                            'markets are easily accessible from the chosen location.</p>'+
                            '</div>'+
                            '<div class="col-md-3" id="utilities" style="border: 1px solid #98999F; text-align:center; margin: auto;height:400px;">' +
                            '<canvas  width="200" height="100">' +
                            '</canvas>'+
                            '<h4></h4><br />'+
                            '<h6></h6><br />'+
                            '<p>Utilities include access to drainage networks, electricity\n' +
                            'networks, grid stations, gas pipelines, gas stations, ground water tables, irrigation\n' +
                            'networks and solar radiations.</p>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+


                            //*********************************end of row three *************************************


                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;padding-top: 20px">'+
                            '<div class="col-md-12"  style="color:#fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>DISTANCE TO KEY INFRASTRUCTURE</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+

                            '<div id="logistics"></div>'+
                            '</div>'+
                            '</div>'+


                            //*********************************end of row Four *************************************



                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">'+
                            '<div class="col-md-12"  style="color:#fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>SITE POSITIONING WITH RESPECT TO PSS PRIORITIZATION</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-top: 20px;margin-bottom: 20px">'+
                                // '<div class="col-md-12">'+
                                    '<div class="col-md-6">' +
                                    '<h5 style="text-align: center;margin-bottom: 15px;">PROPOSED KEY INDUSTRIAL SECTORS AS INFORMED BY PSSS</h5>'+
                                    '<div id="pss_priortization" style="padding-left: 45px;"></div>'+
                                    '</div>'+
                                    '<div class="col-md-6">' +
                                    '<div style="padding-right: 15px;">' +
                                        '<div id="pin_point2" >'+
                                        '<img src="images/finalsuitibility.png" style="height: 130px;width: 130px;border: 3px solid black;" alt="">'+
                                        '</div>'+
                                    '</div>'+
                                    '</div>'+
                                //'</div>'+
                            '</div>'+


                            //*********************************end of row Five *************************************


                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">'+
                            '<div class="col-md-12"  style="color:#fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>EXISTING TOP INDUSTRIES IN DISTRICT OF PROPOSED SITE</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                                '<div class="col-md-6" >' +
                                    '<div id="dount_container" style="height: 400px; width: 100%;"></div>'+
                                '</div>'+
                                '<div class="col-md-6" >' +
                                    '<div id="pin_point4">' +
                                        '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >'+
                                            '<img src="images/industry.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+

                            //*********************************end of row SIX *************************************
                            '<br/>'+
                            '<div class="row"  style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">'+
                            '<div class="col-md-12"  style="color:#fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>ENVIRONMENT ASSESSMENT</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">' +
                            '<h5>Legal Requirement</h5>'+
                            '<table class="table table-bordered table-striped">' +
                            '<tr>' +
                            '<td>Legal Requirement for Environment Assessment :</td><td>'+env_spatial.legal_rule+'</td>' +
                            '</tr>' +
                            '</table></div>'+
                            '<div class="col-md-6"><h5>Sectoral Assessment</h5>'+
                            '<table class="table table-bordered table-striped">' +
                            '<tr>' +
                            '<td>Flood zone:</td><td>'+$scope.removeNullValuse(environ[0].flood)+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Residential area:</td><td>'+$scope.removeNullValuse(environ[0].residential)+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Prime agri land:</td><td>'+$scope.removeNullValuse(env_spatial.vegitation)+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Closest Major cities:</td><td>'+$scope.removeNullValuse(env_spatial.city_name)+'</td>' +
                            '</tr>' +
                            '</table></div>'+
                            '<div class="col-md-6"><h5>Spatial Assessment</h5>'+
                            '<table class="table table-bordered table-striped">' +
                            '<tr>' +
                            '<td>Location inside conservation area:</td><td>'+env_spatial.conservation_area+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Location in protected area :</td><td>'+$scope.removeNullValuse(env_spatial.protected_areas)+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Location in protected habitat:</td><td></td>' +
                            '</tr>' +

                            '<tr>' +
                            '<td>Location in flood area:</td><td>'+$scope.removeNullValuse(environ[0].flood)+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Water quality index:</td><td>'+env_spatial.water_quality+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Groundwater depth:</td><td>'+env_spatial.water_depth+'</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>'+

                            '<div class="col-md-6">'+
                                '<h5 style="text-align: center;">Conservation Map</h5>'+
                            '</div>'+

                            '<div class="col-md-6">'+
                                '<h5 style="text-align: center;">Ground Water Quality Map</h5>'+
                            '</div>'+

                            //'<div class="col-md-12">'+
                                '<div class="col-md-6">' +
                                    '<div id="pin_point3" style="padding-top: 30px;padding-left: 50px;border-right:solid 2px white;">' +
                                        '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >'+
                                        '<img src="images/environment.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+

                                '<div class="col-md-6" >' +
                                    '<div id="pin_point5" style="padding-top: 30px;border-left:solid 2px white;">' +
                                        '<div id="legend-one" style="position: absolute;z-index: 500000;left: 68%;top: 53%;" >'+
                                        '<img src="images/groundwater.png" style="height: 150px;width: 150px;border: 3px solid black;" alt="">'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            //'</div>'+
                            '</div>'+

                            //*********************************end of row Seven *************************************

                            '<br/>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">'+
                            '<div class="col-md-12"  style="color:#fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>DISTRICT READINESS FOR SEZs/IE: PRESENT RANKINGS AMONG 36 DISTRICTS</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="padding-top: 20px;">'+
                                // '<div class="col-md-12">'+
                                    '<div class="col-md-9" id="ind_table" style="padding-right: 0;padding-left: 30px;">' +
                                        '<div class="float-left" style="width: 15%;margin: 0 auto;">' +
                                            '<div id="community1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 25px;">Community<br /><p id="community1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 10%;margin: 0 auto;">' +
                                            '<div id="connectivity1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Connectivity<br /><p id="connectivity1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 10%;margin: 0 auto;">' +
                                            '<div id="enviroment1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Enviroment<br /><p id="enviroment1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left"  style="width: 10%;margin: 0 auto;">' +
                                            '<div id="humancapital1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Human Capital<br /><p id="humancapital1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left"  style="width: 10%;margin: 0 auto;">' +
                                            '<div id="institutoin1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;"> Institutoin<br /><p id="institutoin1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 10%;margin: 0 auto;;">' +
                                            '<div id="markets1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Markets<br /><p id="markets1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 10%;margin: 0 auto;">' +
                                            '<div id="raw_matrials1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Raw Matrials<br /><p id="raw_matrials1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width: 10%;margin: 0 auto;">' +
                                            '<div id="utilities1">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">Utilities<p id="utilities1_1"></p></h6>'+
                                        '</div>'+

                                        '<div class="float-left" style="width:10%;margin: 0 auto;">' +
                                            '<div id="overAll">'+
                                            '</div>'+
                                            '<h6 style="text-align: center;padding-top: 0px;margin-left: 0px;">OverAll Rank <p id="overAll_1"></p></h6>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="col-md-3" style="padding-left: 0;padding-right: 30px;">' +
                                        '<div id="pin_point12"></div>'+
                                    '</div>'+
                                // '</div>'+
                            '</div>'+

                            //*********************************end of row Eight *************************************
                            '<br/>'+
                            '<div class="row" style="margin-left: 0px;padding-left: 30px;padding-right: 30px;">'+
                            '<div class="col-md-12"  style="color:#fff;background-color:#4E648C;font-size: 20px;text-align: center;">' +
                            '<h5>CONTACT DETAILS AND RESPONSIBLE OFFICIALS</h5>'+
                            '</div>' +
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+
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
                            '</div>'+
                            '</div>'+
                            '</div>'+

                            '<div class="row" style="margin-left: 0px;padding-left: 15px;padding-right: 15px;padding-top: 20px;">'+
                            '<div class="col-md-12">'+
                            '<div class="col-md-12" style="border: solid black 1px;">' +

                            //'<h5>Logistics</h5>'+
                            '<div id="logistic_div" style="overflow: scroll;height: 800px; ">' +
                            '</div>'+
                            '</div>'+

                            '</div>'+

                            '<div class="col-md-12" style="margin-top: 20px;margin-bottom: 20px;">' +
                           // '<md-button ng-click="cancel()" class="md-primary">' +
                             //        'Finish' +
                            //         '</md-button>'+
                           '<md-button class="btn btn-primary" style="float:right;background-image: unset;border-radius: 0;">' +
                         //  '<a href="createpdf.php?dist='+pss_dist+'&teh='+pss_teh+'&cost='+cost+
                          //  '&lat='+lat+'&lon='+lon+'&scheme_name='+scheme_name+

                          //  '"  target="_blank">save</a>' +
						  '<a style="color: #fff;padding: 10px 20px;" href="createConnectivityPdf.php?dist='+pss_dist+'&teh='+pss_teh+'&cost='+cost+
                            '&lat='+lat+'&lon='+lon+'&scheme_name='+scheme_name+
                            '"  target="_blank">save</a>' +
                           '</md-button >'+
                            '</div>' +
                            '</md-dialog>',
                            parent: angular.element(document.body),
                          //  targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                        })

                        setTimeout(function(){
                            addNewguage('Community','community',parseInt(dim[0].community));
                            addNewguage('Connectivity','connectivity',parseInt(dim[0].connectivity));
                            addNewguage('Enviroment','enviroment',parseInt(dim[0].enviroment));
                            addNewguage('Human capital','humancapital',parseInt(dim[0].humancapital));

                            addNewguage('Institution','institutoin',parseInt(dim[0].institutoin));
                            addNewguage('Markets','markets',parseInt(dim[0].markets));
                            addNewguage('Raw Matrials','raw_matrials',parseInt(dim[0].raw_matrials));
                            addNewguage('Utilities','utilities',parseInt(dim[0].utilities));
                            $scope.industrialSectors();
                            dounetChart();
                           // refTable();
                           // renderThermoMeter();
                            thermoRes();
                            totalScoreGuage(dim[0].final_score);
                            $("#frs").html(res);
                           // $scope.createSignals(dim[0],env_spatial)

                            $scope.mapOne('pin_point1',drawnGeom.coordinates[1],drawnGeom.coordinates[0],12);
                            $scope.mapTwo('pin_point2',drawnGeom.coordinates[1],drawnGeom.coordinates[0],12);
                            $scope.mapThree('pin_point3',drawnGeom.coordinates[1],drawnGeom.coordinates[0],10);
                            $scope.mapFour('pin_point4',drawnGeom.coordinates[1],drawnGeom.coordinates[0],10)
                            $scope.mapFive('pin_point5',drawnGeom.coordinates[1],drawnGeom.coordinates[0],10)
                            $scope.mapSix('pin_point12',drawnGeom.coordinates[1],drawnGeom.coordinates[0],10)

                            $("#"+pss_dist).css('border', '3px solid red');
                            $('#logistic_div').load('pss/dss_scoring.htm');
                           // $('#community_div').load('pss/communitys.htm');
                           // $('#environment_div').load('pss/envs.htm');
                            //$('#industrial_site_div').load('pss/industrial_sites.htm');
                            //$('#institution_div').load('pss/institutaions.htm');
                           // $('#labour_div').load('pss/labours.htm');
                            //$('#Markets_div').load('pss/markets_s.htm');
                            //$('#raw_matrial_div').load('pss/raw_matrials.htm');
                            //$('#utilities_div').load('pss/utlities_s.htm');

                            //[{"updated_interchanges":"11423.65917969","transport_time_1":"4500",
                            // "universities":"3905.12475586","transmission_network":"19319.6796875",
                            // "topography_1":"0","temperature_1":"0","solar_radiations_1":"0","settlements_1":"0",
                            // "railway_station_1":"2500","railroad_1":"1500","protected_areas_1":"12041.59472656",
                            // "primary___secondary_road_1":"0","primary_intermediate_cities_1":"6264.98193359",
                            // "population_growth_rate_1":"0","police_station_1":"14866.06835938","minerals___mines_1":null,
                            // "minemineralspoints":null,"irrigation_network_1":null,"irrigation_network":null,
                            // "indutrial_estates_piedmic_1":null,"interchanges":null,"indutrial_estates_psic_1":null,
                            // "indutrial_estates_fiedmic_1":null,"industries_concentration_cmi":null,"industries":null,
                            // "industrial_points":null,"hospital_dhqs__thqs__ghs_1":null,"highway_motorway_1":null,"gwq":null,
                            // "ground_water_table_1":null,"govt_schools_1":null,"govt_colleges_1":null,"gas_station_1":null,
                            // "floods_1":null,"gas_pipeline_1":null,"forests_1":null,"final_markets":null,
                            // "existing_consumer_population_1":null,"electricity_network_1":null,"earthquake_zones_1":null,
                            // "earthquake_epicentres_1":null,"dryports_1":null,"drainage_sop":null,"drainage_network_1":null,
                            // "district_headquarters_1":null,"dhq":null,"cities50boundary":null,"cities50":null,
                            // "airport_1":null,"canals":null,"builtup":null}]



                            $.post( "services/industry_nine_dimentions.php",{"geom":JSON.stringify(drawnGeom)}, function(response1) {
                               // console.log(response1);
                                var res=JSON.parse(response1);
                                var logistics='<table class="table table-bordered table-striped">' +
                                '<tr>' +
                                '<td width="50%">Highway Motorway</td>'+
                                '<td width="50%">'+Number(res[0].highway_motorway_1).toFixed(1)+'KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Railroad</td>'+
                                '<td>'+Number(res[0].railroad_1).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Airport</td>'+
                                '<td>'+Number(res[0].airport_1).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Trucking Stations Interchanges</td>'+
                                '<td>'+Number(res[0].updated_interchanges).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Dryports</td>'+
                                '<td>'+Number(res[0].dryports_1).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Education</td>'+
                                '<td>'+Number(res[0].universities).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Hospitals</td>'+
                                '<td>'+Number(res[0].hospital_dhqs__thqs__ghs_1).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Floods</td>'+
                                '<td>'+Number(res[0].floods_1).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Gas Network</td>'+
                                '<td>'+Number(res[0].gas_station_1).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                '<tr>' +
                                '<td>Electricity Network</td>'+
                                '<td>'+Number(res[0].electricity_network_1).toFixed(1)+' KM</td>'+
                                '</tr>'+
                                // '<tr>' +
                                // '<td>Water Supply</td>'+
                                // '<td>NA</td>'+
                                // '</tr>'+
                                '</table>';
                                $("#logistics").html(logistics);

                                // $("#highway").html("<b>"+res[0].highway_motorway_1+"</b>");
                                // $("#railroad").html("<b>"+res[0].railroad_1+"</b>");
                                // $("#airport").html("<b>"+res[0].airport_1+"</b>");
                                // $("#trucking").html("<b>"+res[0].updated_interchanges+"</b>");
                                // $("#shiping").html("<b>"+res[0].dryports_1+"</b>");
                                // var comunity='<table class="table table-bordered table-striped">' +
                                // '<tr>' +
                                // '<td>Education</td>'+
                                // '<td>'+res[0].universities+'</td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td>Hospitals</td>'+
                                // '<td>'+res[0].hospital_dhqs__thqs__ghs_1+'</td>'+
                                // '</tr>'+
                                // '<tr>' +
                                // '<td>Hotal</td>'+
                                // '<td>NA</td>'+
                                // '</tr>'+
                                // '</table>';
                                // $("#comunity").html(comunity);

                                // var environment='<table class="table table-bordered table-striped">' +
                                //     '<tr>' +
                                //     '<td>Rainfall</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Humidity</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Temprature</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Floods</td>'+
                                //     '<td>'+res[0].floods_1+'</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Polution</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Ecology</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '</table>';
                                // $("#environment").html(environment);

                                // var labour='<table class="table table-bordered table-striped">' +
                                //     '<tr>' +
                                //     '<td>Labor Proximity</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Labor Literacy level</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Skilled Labor</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Labor Cost</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '</table>';
                                // $("#labour").html(labour);

                                // var raw_materials='<table class="table table-bordered table-striped">' +
                                //     '<tr>' +
                                //     '<td>Material Proximity</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Components/Supplies</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '</table>';
                                // $("#raw_materials").html(raw_materials);

                                // var markets='<table class="table table-bordered table-striped">' +
                                //     '<tr>' +
                                //     '<td>Existing Consumer</td>'+
                                //     '<td>'+res[0].existing_consumer_population_1+'</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Industry Concentration</td>'+
                                //     '<td>'+res[0].industries_concentration_cmi+'</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Population Growth</td>'+
                                //     '<td>'+res[0].population_growth_rate_1+'</td>'+
                                //     '</tr>'+
                                //     '</table>';
                                // $("#markets_tbl").html(markets);


                                // var Industrial='<table class="table table-bordered table-striped">' +
                                //     '<tr>' +
                                //     '<td>Land Cost</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Developed Park</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Quality</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '</table>';
                                // $("#Industrial_tbl").html(Industrial);

                                // var institution='<table class="table table-bordered table-striped">' +
                                //     '<tr>' +
                                //     '<td>Public Sector Dept</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Business Associations</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Banks/DFIs</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Training Centre</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Police Station</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '</table>';
                                // $("#institution_tbl").html(institution);

                                // var utilities='<table class="table table-bordered table-striped">' +
                                //     '<tr>' +
                                //     '<td>Gas Network</td>'+
                                //     '<td>'+res[0].gas_station_1+'</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Electricity Network</td>'+
                                //     '<td>'+res[0].electricity_network_1+'</td>'+
                                //     '</tr>'+
                                //     '<tr>' +
                                //     '<td>Water Supply</td>'+
                                //     '<td>NA</td>'+
                                //     '</tr>'+
                                //     '</table>';
                                // $("#utilities_tbl").html(utilities);




                                // $("#education").html("<b>"+res[0].universities+"</b>");
                                // $("#hospital").html("<b>"+res[0].hospital_dhqs__thqs__ghs_1+"</b>");
                                // $("#hotal").html("0");


                            }).fail(function() {
                                    alert( "error" );})







                        },1000)
                    }


                    var escapeJSON = function(str) {
                        return str.replace(/\\/g,'\\');
                    };

                    $scope.removeNullValuse=function(vals){
                     if(vals==null){
                       //  return 'No <span class="glyphicon glyphicon-remove btn-danger"></span>';
                         return 'No';
                     }else{
                        // return 'Yes <span class="glyphicon glyphicon-ok btn-success"></span>';
                         return 'Yes';
                     }
                    }

                    $scope.addImageToIndustry=function(vals){
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
                    $scope.punjabAdminService = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';
                    $scope.mapOne = function(containers,lat,lng,zoom) {
                       // $scope.punjabAdminService = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';
                        var one_map = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                        var roads = L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo(one_map);
                        var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                            {
                                url:$scope.punjabAdminService,
                                opacity : 1,
                                useCors: false
                            }
                        ).addTo(one_map);
                       // $scope.addPointOnMap(lat,lng);
                        L.marker([lat, lng]).addTo(one_map);
                        $("#pin_point1").height(420);
                        setTimeout(function(){
                            one_map.invalidateSize()
                            punjabAdminDynamicLayer.setLayers([8,7,13]);
                        },5000)
                    }


                    $scope.mapTwo = function(containers,lat,lng,zoom) {
                        $scope.finalSuitibility = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_dss_nine_dimension_r_07122018/MapServer/';
                        var map2 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                        var roads = L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo(map2);
                        finalSuitibilityDynamic = L.esri.dynamicMapLayer(
                            {
                                url:$scope.finalSuitibility,
                                opacity : 1,
                                useCors: false
                            }
                        ).addTo(map2);
                        var point = L.marker([lat, lng]).addTo(map2);

                        $("#pin_point2").height(400);
                        setTimeout(function(){
                            map2.invalidateSize()
                            finalSuitibilityDynamic.setLayers([17]);
                            $scope.tehsil = $scope.getAjax({lat:lat,lng:lng});

                            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                                {
                                    url:$scope.punjabAdminService,
                                    opacity : 1,
                                    useCors: false
                                }
                            ).addTo(map2);
                            punjabAdminDynamicLayer.setLayers([8,7]);
                           // $scope.zoomToMap(map2,$scope.tehsil[0].extent);

                            var ext = $scope.tehsil[0].extent.split(',');
                            map2.fitBounds([
                                [ext[1], ext[0]],
                                [ext[3], ext[2]]
                            ]);

                        },5000)

                    }

                    $scope.mapThree = function(container,lat,lng,zoom) {
                        $scope.environmnet = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_environment_print_v_07122018/MapServer/';
                        var map3 = new L.Map(container, {center: new L.LatLng(lat, lng), zoom: zoom});
                        var roads = L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo(map3);
                        var environmentDynamic = L.esri.dynamicMapLayer(
                            {
                                url:$scope.environmnet,
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
                                    url:$scope.punjabAdminService,
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




                    $scope.mapFour = function(containers,lat,lng,zoom) {
                        $scope.boundary = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/';
                        $scope.industry = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisporta_industyl_pg31_v_15082018/MapServer/';
                        map4 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                        var roads = L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo(map4);
                        boundary = L.esri.dynamicMapLayer(
                            {
                                url:$scope.boundary,
                                opacity : 1,
                                layers : [8,7],
                                useCors: false
                            }
                        );
                        map4.addLayer(boundary);
                        industry = L.esri.dynamicMapLayer(
                            {
                                url:$scope.industry,
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
                                    url:$scope.punjabAdminService,
                                    opacity : 1,
                                    useCors: false
                                }
                            ).addTo(map4);
                            punjabAdminDynamicLayer.setLayers([8,7]);
                            map4.invalidateSize()
                            map4.addLayer(industry);
                        },5000)
                    }



                    $scope.mapFive = function(containers,lat,lng,zoom) {
                        $scope.groundwater = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_pss_environment_main_v_07122018/MapServer/';
                        var map5 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                        var roads = L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo(map5);
                        var groundwater = L.esri.dynamicMapLayer(
                            {
                                url:$scope.groundwater,
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
                                    url:$scope.punjabAdminService,
                                    opacity : 1,
                                    useCors: false
                                }
                            ).addTo(map5);
                            punjabAdminDynamicLayer.setLayers([8,7]);
                            map5.invalidateSize()
                            map5.addLayer(groundwater);
                        },5000)
                    }


                    $scope.mapSix = function(containers,lat,lng,zoom) {
                        var map6 = new L.Map(containers, {center: new L.LatLng(lat, lng), zoom: zoom});
                        var roads = L.gridLayer.googleMutant({
                            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
                        }).addTo(map6);

                      //  var point = L.marker([lat, lng]).addTo(map6);
                        $("#pin_point12").height(300);
                        setTimeout(function(){
                            var punjabAdminDynamicLayer = L.esri.dynamicMapLayer(
                                {
                                    url:$scope.punjabAdminService,
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
                                if(typeof gglayer != 'undefined'){
                                    gglayer.clearLayers();
                                };

                                gglayer = L.geoJson(neighborhoods,{ style: myStyle}).addTo(map6);
                                // fit map to boundry
                                map6.fitBounds(gglayer.getBounds());

                            });

                        },5000)
                    }



                    $scope.getAjax = function(params) {
                        var data = [];
                        $.ajax({
                            url : 'services/tehsil.php',
                            type : 'POST',
                            data : params,
                            dataType : 'JSON',
                            async : false,
                            success : function (response) {
                                data = response;
                            }
                        });
                        return data;
                    };


                    // $scope.addPointOnMap = function (lat, lng) {
                    //
                    // }


                    $scope.createSignals=function(dims,env_spatial){


                        var str_signal='<table class="table table-condensed">' +
                            '<tr>' +
                            '<td>Access to Highways/Motorways</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_highway))+parseInt(dims.f_highway)+'%</td>'+

                            '<td>Access to Railway Station</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_railway))+parseInt(dims.f_railway)+'%</td>' +

                            '<td>Access to Electricity Network</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_electricity_network))+parseInt(dims.f_electricity_network)+'%</td>'+
                            '</tr>'+

                            '<tr>' +
                            '<td>Air Quality Index</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_airqality))+parseInt(dims.f_airqality)+'%</td>'+

                            '<td>Access to Drainage</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_drainage_network))+parseInt(dims.f_drainage_network)+'%</td>' +


                            '<td>Access to Dryport/ Logistics</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_dryport))+parseInt(dims.f_dryport)+'%</td>' +
                            '</tr>'+

                            '<tr>' +
                            '<td>Access to Gas Network</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_gas_transmission_network))+parseInt(dims.f_gas_transmission_network)+'%</td>'+

                            '<td>Ground Water Table</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_ground_water_table))+parseInt(dims.f_ground_water_table)+'%</td>' +

                            '<td>Access to Training Centres</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_tevta_training_center))+parseInt(dims.f_tevta_training_center)+'%</td>'+
                            '</tr>'+

                            '<tr>' +
                            '<td>Landscape (Topography)</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_topography))+parseInt(dims.f_topography)+'%</td>' +

                            '<td>Access to Universities</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(dims.f_university))+parseInt(dims.f_university)+'%</td>' +

                            '<td>Ground Water Quality Index</td>'+
                            '<td>'+$scope.creteSignalColor(parseInt(env_spatial.water_quality))+parseInt(env_spatial.water_quality)+'%</td>' +

                            '</tr>'+

                        '</table>';

                        $("#trafic_signals").html(str_signal)
                    }

                    $scope.creteSignalColor=function(val){
                       var str_col="";
                       if(val>60) {
                           str_col='<div style="width: 10px;height: 10px;background-color: green;border-radius: 50%;behavior: url(PIE.htc);"></div>';
                       }else if(val>40 && val<60){
                           str_col='<div style="width: 10px;height: 10px;background-color: yellow;border-radius: 50%;behavior: url(PIE.htc);"></div>';
                       }else if(val<40 ){
                           str_col='<div style="width: 10px;height: 10px;background-color: red;border-radius: 50%;behavior: url(PIE.htc);"></div>';
                       }
                       return str_col
                    }

                    $scope.industrialSectors=function(){
                        $.post( "services/district_sector_compatibility.php",{"district":pss_dist}, function(response1) {
                           // alert(response1);
                            var str_dist='<table class="table">';
                            for(var i=0;i<response1.length;i++){
                                var num=i+1;
                                str_dist=str_dist+'<tr><td>'+$scope.addImageToIndustry(response1[i].sector)+'</td><td>'+response1[i].sector+'</td></tr>';
                            }

                            str_dist=str_dist+'</table>'
                            $("#pss_priortization").html(str_dist);
                        })
                            .fail(function() {
                                alert( "error" );
                            })
                    }


                    // $scope.allignmentWithEnvStory=function(res,dim){
                    //     $mdDialog.show({
                    //         controller: IndustryController,
                    //         template: '<md-dialog id="dt_dialog" aria-label="drive time"><md-toolbar>' +
                    //         '<div class="md-toolbar-tools">' +
                    //         '<h2>Detail Information</h2>' +
                    //         '<span flex></span>' +
                    //         '<md-button class="md-icon-button" ng-click="cancel()">' +
                    //         '<md-icon md-svg-src="images/ic_clear_black_24px.svg" class="editColor" aria-label="Close dialog">' +
                    //         '</md-icon>' +
                    //         '</md-button>' +
                    //         '</div>' +
                    //         '</md-toolbar>' +
                    //         '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width: 500px;"><table class="table table-bordered">' +
                    //         '<tr>' +
                    //         '<td>Scheme Name:</td><td>'+scheme_name+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>District:</td><td>'+pss_dist+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Tehsil:</td><td>'+pss_teh+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Result:</td><td>'+res+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Comunity:</td><td>'+dim.community+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Connectivity:</td><td>'+dim.connectivity+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Enviroment:</td><td>'+dim.enviroment+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Humancapital:</td><td>'+dim.humancapital+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Institutoin:</td><td>'+dim.institutoin+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Markets:</td><td>'+dim.markets+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Raw Matrials:</td><td>'+dim.raw_matrials+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Siteattrib:</td><td>'+dim.siteattrib+'</td>' +
                    //         '</tr>' +
                    //         '<tr>' +
                    //         '<td>Utilities:</td><td>'+dim.utilities+'</td>' +
                    //         '</tr>' +
                    //         '</table>\</div>' +
                    //         '<div class="col-md-4"><md-button ng-click="cancel()" class="md-primary">' +
                    //         '      Finish' +
                    //         '    </md-button></div></md-dialog>',
                    //         parent: angular.element(document.body),
                    //         //  targetEvent: ev,
                    //         clickOutsideToClose: true,
                    //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    //     })
                    // }



                    // $scope.checkalignmentWithEnv=function(){
                    //     $mdDialog.show({
                    //         controller: IndustryController,
                    //         template: '<md-dialog id="in_dialog" aria-label="drive time"><md-toolbar>' +
                    //         '<div class="md-toolbar-tools">' +
                    //         '<h2>Check Alignment with Environment</h2>' +
                    //         '<span flex></span>' +
                    //         '<md-button class="md-icon-button" ng-click="cancel()">' +
                    //         '<md-icon md-svg-src="images/ic_clear_black_24px.svg" class="editColor" class="editColor" aria-label="Close dialog">' +
                    //         '</md-icon>' +
                    //         '</md-button>' +
                    //         '</div>' +
                    //         '</md-toolbar>' +
                    //         '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width: 500px;">' +
                    //         '<table class="table table-bordered"><tr><td>Scheme Type:</td><td><select onchange="" id="pss_scheme">' +
                    //         '<option value="select scheme">select scheme</option>'+
                    //         '<option value="Small industrial estate">Small industrial estate</option>'+
                    //         '<option value="Industrial zone - PIEDMC / FIEDMC">Industrial zone - PIEDMC / FIEDMC</option>'+
                    //         '<option value="Special Industrial Zone - PIEDMC / FIEDMC">Special Industrial Zone - PIEDMC / FIEDMC</option>'+
                    //         '<option value="Education institute - TEVTA">Education institute - TEVTA</option>'+
                    //         '</select></td></tr>'+
                    //         '<tr><td>Enter Cost:</td><td><input type="text" name="cost" placeholder="enter cost"  id="cost"></td>' +
                    //         '</tr>' +
                    //         '<tr><td>District: </td><td>' +
                    //           pss_dist+
                    //         '</td></tr>' +
                    //         '<tr><td>Tehsil:</td><td>' +
                    //           pss_teh+
                    //         '</div>' +
                    //         '</td></tr>' +
                    //         '<td><div class="col-md-4"><md-button ng-click="goBack()" class="md-primary">' +
                    //         '     Back ' +
                    //         '    </md-button></div></td>'+
                    //         '</td><td><div class="col-md-4"><md-button ng-click="checkAlignWithEnvironment()" class="md-primary">' +
                    //         '     Get Info ' +
                    //         '    </md-button></div></td></tr></table></md-dialog>',
                    //         parent: angular.element(document.body),
                    //       //  targetEvent: ev,
                    //         clickOutsideToClose: true,
                    //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    //     })
                    //
                    //     // setTimeout(function () {
                    //     //     var str='<option></option>';
                    //     //     for(var i=0;i<allAdminData.district.length;i++){
                    //     //
                    //     //         str=str+"<option value='"+allAdminData.district[i].gid+"'>"+allAdminData.district[i].district_name+"</option>";
                    //     //
                    //     //     }
                    //     //
                    //     //     $("#district_pss").html(str);
                    //     // },500 )
                    //
                    // }


                    $scope.goBack=function(){
                        $mdDialog.cancel();
                        map.removeLayer(drawnItems);
                        map.removeLayer(theMarker);
                        angular.element($("#context")).scope().addPcOne();
                    }

                    $scope.cancel = function() {
                        $mdDialog.cancel();
                        map.removeLayer(drawnItems);
                        map.removeLayer(theMarker);
                    };
                }

                $scope.uploadFile = function (id) {
                    angular.element(document.querySelector('#'+id+'')).click();
                };

                $scope.goToHome=function(){
                    window.location.href="landing.php";
                }



                // $scope.paint=function() {
                //
                //     if ($scope.map_paint == false) {
                //         $scope.myPaintCtrl = map.addControl(new MapPaint.SwitchControl());
                //         $scope.map_paint = true;
                //     } else {
                //         $scope.map_paint = false;
                //         map.removeControl($scope.myPaintCtrl);
                //     }
                // }
                $scope.showLatLng=function (){

                    if(latlon==false) {

                    if(measureTool==true) {
                        $('#Measuretool').removeAttr('style');
                        measureTool = false;
                        measureControl.disable();
                    }


                    if(graticule==true) {
                        $('#graticules').removeAttr('style');
                        graticuleObj.removeFrom(map);
                        graticule = false;
                    }

                        if(rtCtrl==true){
                            $('#routings').removeAttr( 'style' );
                            map.removeControl(routingControl);
                            rtCtrl=false;
                        }

                        if(sc==true){
                            sc=false;
                            polylineDrawer.disable();
                            $('#sc').removeAttr( 'style' );
                        }

                        if(dc==true){
                            polygonDrawer.disable();
                            dc=false;
                            $('#drawPolygon').removeAttr( 'style' );
                            $('#drawParcelPolygon').removeAttr( 'style' );

                        }

                        $('#coordinates').css({'background-color': '#2196F3'});
                        $('#coordinates').css({'color': 'snow'});

                        cord=L.control.mouseCoordinate({utm: true, utmref: true}).addTo(map);
                        latlon=true;
                    }else{
                        $('#coordinates').removeAttr( 'style' );
                        map.removeControl(cord);
                        latlon=false;


                    }

                }

                // $scope.geoLocate=function (){
                //     if(loc==false) {
                //          lc = L.control.locate().addTo(map);
                //         lc.start();
                //         loc=true;
                //     }else{
                //         lc.stop();
                //         map.removeControl(lc);
                //         loc=false;
                //     }
                //
                // }



                $scope.handleToolbar=function(rs,tb){
                    if(tb=='tool' && rs==true){
                        $scope.tb1=true;
                        $scope.tool=true;
                        }else if(tb=='tool' && rs==false){
                        $scope.tb1=false;
                        $scope.tool=false;
                    }

                    if(tb=='editing' && rs==true){
                        $scope.tb2=true;
                        $scope.editing=true;
                    }else if(tb=='editing' && rs==false){
                        $scope.tb2=false;
                        $scope.editing=false;
                    }

                }


                $scope.showMeasureControl=function (){
                    if(measureTool==false){
                        //measureControl = L.control.measure();
                        //map.addControl(measureControl);
                        if(latlon==true) {
                            $('#coordinates').removeAttr('style');
                            map.removeControl(cord);
                            latlon = false;
                        }
                        if(graticule==true) {
                            $('#graticules').removeAttr('style');
                            graticuleObj.removeFrom(map);
                            graticule = false;
                        }

                        if(rtCtrl==true){
                            $('#routings').removeAttr( 'style' );
                            map.removeControl(routingControl);
                            rtCtrl=false;
                        }

                        if(sc==true){
                            sc=false;
                            polylineDrawer.disable();
                            $('#sc').removeAttr( 'style' );
                        }


                        if(dc==true){
                            polygonDrawer.disable();
                            dc=false;
                            $('#drawPolygon').removeAttr( 'style' );
                            $('#drawParcelPolygon').removeAttr( 'style' );

                        }

                        $('#Measuretool').css({'background-color': '#2196F3'});
                        $('#Measuretool').css({'color': 'snow'});
                        measureTool=true;


                        measureControl = new L.MeasuringTool(map);
                        measureControl.enable();

                    }
                    else{
                        $('#Measuretool').removeAttr( 'style' );
                        measureTool=false;
                        measureControl.disable();
                    }
                }


                $scope.addGraticule=function(){
                    if(graticule==false) {

                        if(latlon==true) {
                            $('#coordinates').removeAttr('style');
                            map.removeControl(cord);
                            latlon = false;
                        }

                        if(measureTool==true) {
                            $('#Measuretool').removeAttr('style');
                            measureTool = false;
                            measureControl.disable();
                        }

                        if(rtCtrl==true){
                            $('#routings').removeAttr( 'style' );
                            map.removeControl(routingControl);
                            rtCtrl=false;
                        }

                        if(sc==true){
                            sc=false;
                            polylineDrawer.disable();
                            $('#sc').removeAttr( 'style' );
                        }

                        if(dc==true){
                            polygonDrawer.disable();
                            dc=false;
                            $('#drawPolygon').removeAttr( 'style' );
                            $('#drawParcelPolygon').removeAttr( 'style' );

                        }

                        graticuleObj=L.latlngGraticule({
                            showLabel: true,
                            color:'#0000FF'
                        }).addTo(map);
                        $('#graticules').css({'background-color': '#2196F3'});
                        $('#graticules').css({'color': 'snow'});
                        graticule=true
                    }else{
                        $('#graticules').removeAttr( 'style' );
                        graticuleObj.removeFrom(map);
                        graticule=false;

                    }
                }

                $scope.showPolyLineMeasureControl=function(){
                    if(boolPolyLineMeasure==false){
                        polyLineMeasureControl=L.control.ruler();

                        //$(".leaflet-bar").removeClass('leaflet-ruler');
                        //$(".leaflet-bar").addClass('leaflet-ruler-clicked');
                        map.addControl(polyLineMeasureControl);
                        boolPolyLineMeasure=true;
                    }
                    else{
                        map.removeControl(polyLineMeasureControl);
                        boolPolyLineMeasure=false;
                    }
                }




            }],
            controllerAs:   'toolCtrl'

        }

});







function selectDist_pss(id){

    var str='<option></option>';
    for(var i=0;i<allAdminData.teh.length;i++){
        if(allAdminData.teh[i].district_id==id) {
            str=str+"<option value='"+allAdminData.teh[i].gid+"'>"+allAdminData.teh[i].tehsil_name+"</option>"
        }

    }

    $("#pss_tehsil").html(str);


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
}


function addNewguage(Names,container,val){
    var arr_val=[];
   // arr_val.push(val)
    var color;
    val_new=parseInt(val);
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
//     Highcharts.chart(container, {
//
//         credits:{
//             enabled:false
//         },
//         exporting: { enabled: false },
//         chart: {
//             type: 'gauge',
//             plotShadow: false
//         },
//
//         title: {
//             text: Names
//             // verticalAlign: 'bottom',
//             // margin: 50,
//             // floating: true
//         },
//
//         pane: {
//             startAngle: -150,
//             endAngle: 150,
//             background: [{
//                 backgroundColor: {
//                     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//                     stops: [
//                         [0, '#FFF'],
//                         [1, '#333']
//                     ]
//                 },
//                 borderWidth: 0,
//                 outerRadius: '109%'
//             }, {
//                 backgroundColor: {
//                     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//                     stops: [
//                         [0, '#333'],
//                         [1, '#FFF']
//                     ]
//                 },
//                 borderWidth: 1,
//                 outerRadius: '107%'
//             }, {
//                 // default background
//             }, {
//                 backgroundColor: '#DDD',
//                 borderWidth: 0,
//                 outerRadius: '105%',
//                 innerRadius: '103%'
//             }]
//         },
//
//         // the value axis
//         yAxis: {
//             min: 0,
//             max: 100,
//
//             minorTickInterval: 'auto',
//             minorTickWidth: 1,
//             minorTickLength: 10,
//             minorTickPosition: 'inside',
//             minorTickColor: '#666',
//
//             tickPixelInterval: 30,
//             tickWidth: 2,
//             tickPosition: 'inside',
//             tickLength: 10,
//             tickColor: '#666',
//             labels: {
//                 step: 2,
//                 rotation: 'auto'
//             },
//             // title: {
//             //     text: 'km/h'
//             // },
//             plotBands: [{
//                 from: 0,
//                 to: 40,
//                 color: '#DF5353' // green
//             }, {
//                 from: 40,
//                 to: 60,
//                 color: '#DDDF0D' // yellow
//             }, {
//                 from: 60,
//                 to: 100,
//                 color: '#55BF3B' // red
//             }]
//         },
//
//         series: [{
//             name: Names,
//             data: arr_val,
//             tooltip: {
//                 valueSuffix: ''
//             }
//         }]
//
//     }
// // Add some life
//     );
}


function dounetChart(){

var dount_arr=[];

        $.post( "services/industry_sector_lookup.php",{"dist":pss_dist}, function(response1) {
            // alert(response1);

            for(var i=0;i<response1.length;i++){
                var dount_obj={};
                dount_obj['y']=response1[i].count;
                dount_obj['label']=response1[i].sector+"-"+response1[i].count;
                dount_arr.push(dount_obj);

            }

            var chart = new CanvasJS.Chart("dount_container", {
                animationEnabled: true,
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
                    indexLabelFontSize: 12,
                    //  indexLabel: "{label} - #percent%",
                   //   toolTipContent: "<b>{label}:</b> (#percent%)",
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

            $(".canvasjs-chart-credit").html('');




        })
            .fail(function() {
                alert( "error" );
            })






}

function thermoRes(){
    $.post( "services/industry_sector_thermometer.php",{"dist":pss_dist}, function(response1) {
        renderThermoMeter('#7034A0','community1',parseInt(response1[0].community));
        renderThermoMeter('#1A3260','connectivity1',parseInt(response1[0].connectivity));
        renderThermoMeter('#4AAAC9','enviroment1',parseInt(response1[0].enviro_eco));
        renderThermoMeter('#F7C033','humancapital1',parseInt(response1[0].human_capital));

        renderThermoMeter('#3D3D3D','institutoin1',parseInt(response1[0].institutions));
        renderThermoMeter('#92CF50','markets1',parseInt(response1[0].market));
        renderThermoMeter('#1A3260','raw_matrials1',parseInt(response1[0].raw_material));
        renderThermoMeter('#2F7186','utilities1',parseInt(response1[0].utilities));
        renderThermoMeter('#244AFB','overAll',parseInt(response1[0].overall_rank));

    });
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
        $("#"+container+"_1").html(val);
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




function refTable() {
    var colors_arr = ['', '#63BE7B', '#6BC07B', '#74C37C', '#7DC57C', '#86C87D', '#8FCA7D', '#98CD7E', '#A1D07E', '#AAD27F', '#B3D57F', '#BCD780', '#C5DA80', '#CDDC81', '#D6DF81', '#DFE282', '#E8E482', '#F1E783', '#FAE983', '#FFE884', '#FFE082', '#FFD981', '#FED280', '#FECA7E', '#FDC37D', '#FDBB7B', '#FCB47A', '#FCAC78', '#FCA577', '#FB9D75', '#FB9674', '#FA8F73', '#FA8771', '#FA8070', '#F9786E', '#F9716D', '#F8696B'];
    var data = [
        {
            "Districts": "Lahore",
            "Markets": 1,
            "Connectivity": 2,
            "Human Capital": 2,
            "Industrial Progress": 2,
            "Raw Materials": 27,
            "Utilities": 1,
            "Institutions": 1,
            "Enviro-Eco": 30,
            "Community": 1,
            "Overall Rank": 1
        },
        {
            "Districts": "Faisalabad",
            "Markets": 2,
            "Connectivity": 3,
            "Human Capital": 3,
            "Industrial Progress": 1,
            "Raw Materials": 8,
            "Utilities": 12,
            "Institutions": 2,
            "Enviro-Eco": 21,
            "Community": 6,
            "Overall Rank": 2
        },
        {
            "Districts": "Rawalpindi",
            "Markets": 3,
            "Connectivity": 1,
            "Human Capital": 1,
            "Industrial Progress": 11,
            "Raw Materials": 25,
            "Utilities": 7,
            "Institutions": 4,
            "Enviro-Eco": 36,
            "Community": 4,
            "Overall Rank": 3
        },
        {
            "Districts": "Gujranwala",
            "Markets": 4,
            "Connectivity": 12,
            "Human Capital": 8,
            "Industrial Progress": 3,
            "Raw Materials": 14,
            "Utilities": 6,
            "Institutions": 5,
            "Enviro-Eco": 26,
            "Community": 7,
            "Overall Rank": 4
        },
        {
            "Districts": "Multan",
            "Markets": 8,
            "Connectivity": 4,
            "Human Capital": 4,
            "Industrial Progress": 6,
            "Raw Materials": 20,
            "Utilities": 2,
            "Institutions": 3,
            "Enviro-Eco": 16,
            "Community": 18,
            "Overall Rank": 5
        },
        {
            "Districts": "Sialkot",
            "Markets": 6,
            "Connectivity": 5,
            "Human Capital": 12,
            "Industrial Progress": 4,
            "Raw Materials": 29,
            "Utilities": 9,
            "Institutions": 6,
            "Enviro-Eco": 32,
            "Community": 5,
            "Overall Rank": 6
        },
        {
            "Districts": "Chakwal",
            "Markets": 13,
            "Connectivity": 20,
            "Human Capital": 6,
            "Industrial Progress": 18,
            "Raw Materials": 1,
            "Utilities": 23,
            "Institutions": 15,
            "Enviro-Eco": 18,
            "Community": 11,
            "Overall Rank": 7
        },
        {
            "Districts": "Attock",
            "Markets": 7,
            "Connectivity": 6,
            "Human Capital": 5,
            "Industrial Progress": 26,
            "Raw Materials": 3,
            "Utilities": 19,
            "Institutions": 14,
            "Enviro-Eco": 24,
            "Community": 10,
            "Overall Rank": 8
        },
        {
            "Districts": "Sheikhupura",
            "Markets": 12,
            "Connectivity": 8,
            "Human Capital": 14,
            "Industrial Progress": 5,
            "Raw Materials": 12,
            "Utilities": 4,
            "Institutions": 17,
            "Enviro-Eco": 19,
            "Community": 9,
            "Overall Rank": 9
        },
        {
            "Districts": "Sargodha",
            "Markets": 16,
            "Connectivity": 10,
            "Human Capital": 13,
            "Industrial Progress": 8,
            "Raw Materials": 4,
            "Utilities": 24,
            "Institutions": 8,
            "Enviro-Eco": 20,
            "Community": 14,
            "Overall Rank": 10
        },
        {
            "Districts": "Gujrat",
            "Markets": 5,
            "Connectivity": 30,
            "Human Capital": 7,
            "Industrial Progress": 9,
            "Raw Materials": 28,
            "Utilities": 17,
            "Institutions": 9,
            "Enviro-Eco": 27,
            "Community": 2,
            "Overall Rank": 11
        },
        {
            "Districts": "Sahiwal",
            "Markets": 9,
            "Connectivity": 23,
            "Human Capital": 11,
            "Industrial Progress": 20,
            "Raw Materials": 21,
            "Utilities": 3,
            "Institutions": 11,
            "Enviro-Eco": 13,
            "Community": 16,
            "Overall Rank": 12
        },
        {
            "Districts": "Muzaffargarh",
            "Markets": 29,
            "Connectivity": 13,
            "Human Capital": 33,
            "Industrial Progress": 23,
            "Raw Materials": 2,
            "Utilities": 8,
            "Institutions": 16,
            "Enviro-Eco": 10,
            "Community": 29,
            "Overall Rank": 13
        },
        {
            "Districts": "TT Singh",
            "Markets": 10,
            "Connectivity": 11,
            "Human Capital": 16,
            "Industrial Progress": 15,
            "Raw Materials": 26,
            "Utilities": 22,
            "Institutions": 29,
            "Enviro-Eco": 9,
            "Community": 12,
            "Overall Rank": 14
        },
        {
            "Districts": "Jhelum",
            "Markets": 11,
            "Connectivity": 16,
            "Human Capital": 9,
            "Industrial Progress": 13,
            "Raw Materials": 31,
            "Utilities": 10,
            "Institutions": 21,
            "Enviro-Eco": 33,
            "Community": 3,
            "Overall Rank": 15
        },
        {
            "Districts": "Bahawalpur",
            "Markets": 31,
            "Connectivity": 9,
            "Human Capital": 10,
            "Industrial Progress": 31,
            "Raw Materials": 9,
            "Utilities": 15,
            "Institutions": 7,
            "Enviro-Eco": 28,
            "Community": 27,
            "Overall Rank": 16
        },
        {
            "Districts": "Khanewal",
            "Markets": 23,
            "Connectivity": 14,
            "Human Capital": 21,
            "Industrial Progress": 14,
            "Raw Materials": 16,
            "Utilities": 5,
            "Institutions": 19,
            "Enviro-Eco": 3,
            "Community": 28,
            "Overall Rank": 17
        },
        {
            "Districts": "RYK",
            "Markets": 19,
            "Connectivity": 7,
            "Human Capital": 27,
            "Industrial Progress": 29,
            "Raw Materials": 7,
            "Utilities": 13,
            "Institutions": 10,
            "Enviro-Eco": 17,
            "Community": 34,
            "Overall Rank": 18
        },
        {
            "Districts": "Okara",
            "Markets": 14,
            "Connectivity": 24,
            "Human Capital": 17,
            "Industrial Progress": 10,
            "Raw Materials": 18,
            "Utilities": 26,
            "Institutions": 13,
            "Enviro-Eco": 15,
            "Community": 23,
            "Overall Rank": 19
        },
        {
            "Districts": "Kasur",
            "Markets": 15,
            "Connectivity": 31,
            "Human Capital": 23,
            "Industrial Progress": 7,
            "Raw Materials": 23,
            "Utilities": 16,
            "Institutions": 20,
            "Enviro-Eco": 6,
            "Community": 20,
            "Overall Rank": 20
        },
        {
            "Districts": "Mianwali",
            "Markets": 24,
            "Connectivity": 21,
            "Human Capital": 15,
            "Industrial Progress": 32,
            "Raw Materials": 11,
            "Utilities": 20,
            "Institutions": 22,
            "Enviro-Eco": 8,
            "Community": 21,
            "Overall Rank": 21
        },
        {
            "Districts": "Vehari",
            "Markets": 18,
            "Connectivity": 29,
            "Human Capital": 24,
            "Industrial Progress": 19,
            "Raw Materials": 24,
            "Utilities": 27,
            "Institutions": 18,
            "Enviro-Eco": 5,
            "Community": 19,
            "Overall Rank": 22
        },
        {
            "Districts": "MB Din",
            "Markets": 22,
            "Connectivity": 18,
            "Human Capital": 29,
            "Industrial Progress": 12,
            "Raw Materials": 30,
            "Utilities": 18,
            "Institutions": 25,
            "Enviro-Eco": 22,
            "Community": 17,
            "Overall Rank": 23
        },
        {
            "Districts": "Chiniot",
            "Markets": 34,
            "Connectivity": 27,
            "Human Capital": 18,
            "Industrial Progress": 16,
            "Raw Materials": 13,
            "Utilities": 25,
            "Institutions": 36,
            "Enviro-Eco": 7,
            "Community": 25,
            "Overall Rank": 24
        },
        {
            "Districts": "Hafizabad",
            "Markets": 32,
            "Connectivity": 17,
            "Human Capital": 20,
            "Industrial Progress": 17,
            "Raw Materials": 35,
            "Utilities": 21,
            "Institutions": 34,
            "Enviro-Eco": 11,
            "Community": 15,
            "Overall Rank": 25
        },
        {
            "Districts": "Jhang",
            "Markets": 25,
            "Connectivity": 15,
            "Human Capital": 22,
            "Industrial Progress": 30,
            "Raw Materials": 15,
            "Utilities": 34,
            "Institutions": 23,
            "Enviro-Eco": 2,
            "Community": 31,
            "Overall Rank": 26
        },
        {
            "Districts": "Nankana",
            "Markets": 20,
            "Connectivity": 22,
            "Human Capital": 19,
            "Industrial Progress": 35,
            "Raw Materials": 32,
            "Utilities": 14,
            "Institutions": 35,
            "Enviro-Eco": 12,
            "Community": 13,
            "Overall Rank": 27
        },
        {
            "Districts": "Bahawalnagar",
            "Markets": 28,
            "Connectivity": 28,
            "Human Capital": 30,
            "Industrial Progress": 28,
            "Raw Materials": 22,
            "Utilities": 28,
            "Institutions": 24,
            "Enviro-Eco": 1,
            "Community": 33,
            "Overall Rank": 28
        },
        {
            "Districts": "Layyah",
            "Markets": 26,
            "Connectivity": 35,
            "Human Capital": 31,
            "Industrial Progress": 24,
            "Raw Materials": 10,
            "Utilities": 29,
            "Institutions": 30,
            "Enviro-Eco": 23,
            "Community": 26,
            "Overall Rank": 29
        },
        {
            "Districts": "Khushab",
            "Markets": 27,
            "Connectivity": 19,
            "Human Capital": 26,
            "Industrial Progress": 22,
            "Raw Materials": 19,
            "Utilities": 33,
            "Institutions": 26,
            "Enviro-Eco": 29,
            "Community": 22,
            "Overall Rank": 30
        },
        {
            "Districts": "Bhakkar",
            "Markets": 35,
            "Connectivity": 36,
            "Human Capital": 28,
            "Industrial Progress": 21,
            "Raw Materials": 6,
            "Utilities": 31,
            "Institutions": 32,
            "Enviro-Eco": 31,
            "Community": 32,
            "Overall Rank": 31
        },
        {
            "Districts": "Lodhran",
            "Markets": 21,
            "Connectivity": 25,
            "Human Capital": 25,
            "Industrial Progress": 34,
            "Raw Materials": 34,
            "Utilities": 32,
            "Institutions": 31,
            "Enviro-Eco": 4,
            "Community": 24,
            "Overall Rank": 32
        },
        {
            "Districts": "DG Khan",
            "Markets": 33,
            "Connectivity": 26,
            "Human Capital": 32,
            "Industrial Progress": 33,
            "Raw Materials": 5,
            "Utilities": 30,
            "Institutions": 12,
            "Enviro-Eco": 35,
            "Community": 35,
            "Overall Rank": 33
        },
        {
            "Districts": "Narowal",
            "Markets": 30,
            "Connectivity": 33,
            "Human Capital": 35,
            "Industrial Progress": 27,
            "Raw Materials": 36,
            "Utilities": 36,
            "Institutions": 27,
            "Enviro-Eco": 25,
            "Community": 8,
            "Overall Rank": 34
        },
        {
            "Districts": "Pakpattan",
            "Markets": 17,
            "Connectivity": 34,
            "Human Capital": 34,
            "Industrial Progress": 36,
            "Raw Materials": 33,
            "Utilities": 11,
            "Institutions": 28,
            "Enviro-Eco": 14,
            "Community": 30,
            "Overall Rank": 35
        },
        {
            "Districts": "Rajanpur",
            "Markets": 36,
            "Connectivity": 32,
            "Human Capital": 36,
            "Industrial Progress": 25,
            "Raw Materials": 17,
            "Utilities": 35,
            "Institutions": 33,
            "Enviro-Eco": 34,
            "Community": 36,
            "Overall Rank": 36
        }
    ];

    var table_body = "<table width='100%' height='100%'><tr style='color:white'><td style='border-right: solid 1px white' bgcolor='#254E79'>Districts</td><td  style='border-right: solid 1px white' bgcolor='#254E79'>Markets</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Connectivity</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Human Capital</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Industrial Progress</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Raw Materials</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Utilities</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Institutions</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Enviro-Eco</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Community</td><td style='border-right: solid 1px white' bgcolor='#254E79'>Overall Rank</td></tr>";

    for (var i = 0; i < data.length; i++) {
        table_body += "<tr id='"+data[i]['Districts']+"'><td  style='border-top: solid 1px white; text-align:left; color:white' bgcolor='#254E79'>" + data[i]['Districts'] + "</td><td bgcolor=" + colors_arr[parseInt(data[i]['Markets'])] + ">" + data[i]['Markets'] + "</td><td bgcolor=" + colors_arr[data[i]['Connectivity']] + ">" + data[i]['Connectivity'] + "</td><td bgcolor=" + colors_arr[data[i]['Human Capital']] + ">" + data[i]['Human Capital'] + "</td><td bgcolor=" + colors_arr[data[i]['Industrial Progress']] + ">" + data[i]['Industrial Progress'] + "</td><td bgcolor=" + colors_arr[data[i]['Raw Materials']] + ">" + data[i]['Raw Materials'] + "</td><td bgcolor=" + colors_arr[data[i]['Utilities']] + ">" + data[i]['Utilities'] + "</td><td bgcolor=" + colors_arr[data[i]['Institutions']] + ">" + data[i]['Institutions'] + "</td><td bgcolor=" + colors_arr[data[i]['Enviro-Eco']] + ">" + data[i]['Enviro-Eco'] + "</td><td bgcolor=" + colors_arr[data[i]['Community']] + ">" + data[i]['Community'] + "</td><td bgcolor=" + colors_arr[data[i]['Overall Rank']] + ">" + data[i]['Overall Rank'] + "</td></tr>"
    }

    table_body += "</table>";

   // $('#ind_table').html(table_body);
}
