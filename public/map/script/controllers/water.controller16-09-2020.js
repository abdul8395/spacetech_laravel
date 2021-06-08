var drawnGeomWater="";
var selected_scheme="";
var selected_color="";
var result_row_color='#e0e0d1';
var scheme_title="";
var sc_t='';
angular.module('waterController',[])
.directive('waterTemplate',function(){
    return{
        restrict : 'E',
        templateUrl : 'template/water.html',
        controller : ['$scope','$http','$timeout','$mdDialog',function($scope,$http,$timeout,$mdDialog){


            $scope.addWaterPcOne = function(ev) {
                $mdDialog.show({
                    controller: waterController,
                    template:
                    '<md-dialog id="dt_dialog" aria-label="drive time">' +
                    '<md-toolbar>' +
                    '<div class="md-toolbar-tools" style="background-color:#178D87">' +
                    '<h2>Water Scheme Info</h2>' +
                    '<span flex></span>' +
                    '<md-button class="md-icon-button" ng-click="cancel()">' +
                    '<md-icon md-svg-src="images/ic_clear_black_24px.svg" aria-label="Close dialog">' +
                    '</md-icon>' +
                    '</md-button>' +
                    '</div>' +
                    '</md-toolbar>'+
                    '<div style="padding-left: 10px;padding-top: 3px;padding-right: 10px;width:500px;">' +
                    '<md-tabs  md-left-tabs>' +
                    '<md-tab md-on-select="onSelectedTabChange(0)" label="Urban Schemes">' +
                    '<md-content class="md-padding">'+
                    '<form>' +
                    '<table class="table table-bordered">' +
                    '<tr><td>Scheme Name:</td><td><input type="text" name="scheme_nam2" placeholder="scheme name" value="scheme2"  id="scheme_name1"></td>' +
                    '</tr>' +

                    '<tr><td>Scheme Type:</td><td>' +
                    '<select onchange="" id="pss_water_scheme">' +
                    '<option value="Pipeline replacement">select scheme</option>'+
                    '<option value="Rehabilitation of TW">Rehabilitation of TW</option>'+
                    '<option value="Rehabilitation of OHR">Rehabilitation of OHR</option>'+
                    '<option value="Rehabilitation of DS">Rehabilitation of DS</option>'+
                    '<option value="Rehabilitation of GST">Rehabilitation of GST</option>'+
                    '<option value="water supply pipelines">water supply pipelines</option>'+
                    '<option value="sewerage pipeline">sewerage pipeline</option>'+
                    //'<option value="New Installation of TW, OHR, DS, GST">New Installation of TW, OHR, DS, GST</option>'+
                    '<option value="New Installation of TW">New Installation of TW</option>'+
                    '<option value="New Installation of OHR">New Installation of OHR</option>'+
                    '<option value="New Installation of DS">New Installation of DS</option>'+
                    '<option value="New Installation of GST">New Installation of GST</option>'+
                    '<option value="Screening criteria for WWTP Location">Screening criteria for WWTP Location</option>'+
                    '</select>' +
                    '</td></tr>'+
                    '</table></form>' +
                    '</md-content>'+
                    '</md-tab>' +

                    '<md-tab md-on-select="onSelectedTabChange(1)" label="Rural Schemes">' +
                    '<md-content class="md-padding">'+
                    '<form>' +
                    '<table class="table table-bordered">' +
                    '<tr><td>Scheme Name:</td><td>' +
                    '<input type="text" name="scheme_nam2" placeholder="scheme name" value="scheme2"  id="scheme_name2">' +
                    '</td>' +
                    '</tr>' +

                    '<tr><td>Scheme Type:</td><td>' +
                    '<select onchange="" id="pss_water_scheme1">' +
                    '<option value="select scheme">select scheme</option>'+
                    '<option value="Installation Filtration plants">Installation Filtration plants</option>'+
                    '<option value="Installation Tube wells">Installation Tube wells</option>'+
                    '</select>' +
                    '</td></tr>'+
                    '</table></form>' +
                    '</md-content>'+
                    '</md-tab>' +


                    '</md-tabs>' +
                    '</div>     ' +

                    '<div class="col-md-4"><md-button ng-click="addNewLocationForWaterScheme()" class="md-primary">' +
                    '      Click here' +
                    '    </md-button></div>' +
                    '</md-dialog>',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
            };





    function waterStoryController($scope, $mdDialog) {
                $scope.cancel = function() {
                    $mdDialog.cancel();

                };

            }




    function waterController($scope, $mdDialog) {

        $scope.selectedTabWater="Urban Schemes";
        $scope.sc_type = "";
        $scope.scheme_name="";



        $scope.cancel=function(){
            $mdDialog.cancel();
        }


        $scope.onSelectedTabChange=function(tab){
            if(tab==0) {
                $scope.selectedTabWater ="Urban Schemes";
                $scope.scheme_name=$("#scheme_name1").val();
            }else if(tab==1){
                $scope.selectedTabWater ="Rural Schemes";
                $scope.scheme_name=$("#scheme_name2").val();
            }
        }



        $scope.waterPssStory_urban_two=function(res,latlon,index){
            console.log(res);
            $mdDialog.cancel();
            var res_result=$scope.getResultRehab(res.condtion_r);
            $mdDialog.show({
                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +

                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4 ><b>'+scheme_title+' ('+res.name+')</b></h4>'+
                // '<h5 ><b>PS 7.1:</b> Implement Geographically Disaggregated decision Support Systems & Tools</h5>'+

                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<table class="table table-bordered table-striped">' +
                '<tr>' +
                '<td><b>Current Status:</b></td><td>' + $scope.rehabResult(res.condtion_r)+ '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Name:</b></td><td>' + res.name+ '</td>' +
                '</tr>' +
                // '<tr>' +
                // '<td><b>Scheme type:</b></td><td>' + $scope.sc_type+ '</td>' +
                // '</tr>' +
                '<tr>' +
                '<td><b>District:</b></td><td>' + res.district + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Town:</b></td><td>' + res.town + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Locality:</b></td><td>' + res.locality + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>UC:</b></td><td>' + res.uc_no + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>City</b></td><td>' + res.city + '</td>' +
                '</tr>' +
                //'<tr>' +
                //'<td><b>Road</b></td><td>' + res.road + '</td>' +
                //'</tr>' +
                '<tr bgcolor='+result_row_color+'>' +
                '<td><b>Result</b></td><td> <b><font color='+selected_color+'>' +  res_result + '</font></b></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="pin_point_tw_r" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '<div class="col-md-4"><md-button ng-click="cancel()" class="md-primary">' +
                '      Cancel' +
                '    </md-button></div>'+
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                //clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });

            setTimeout(function(){
            $scope.map_tw_r('pin_point_tw_r',latlon,index,17)
            },1000);

        }


        $scope.getResultRehab=function(res){
            selected_color='';
            if(res=='5'){
                selected_color='green';
                return "Accepted";
            }else if(res=='4'){
                selected_color='green';
                return "Accepted";
            }else if(res=='3'){
                selected_color='#ff9900';
                return "Reconsider";
            }else if(res=='2'){
                selected_color='red';
                return "Not Accepted";
            }else if(res=='1'){
                selected_color='red';
                return "Not Accepted";
            }
        }



        $scope.map_tw_r = function(container,laton,index,zoom) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var map_tw_r = new L.Map(container, {center: laton , zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_tw_r);
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [index],
                    useCors: false
                }
            );
            $("#pin_point_tw_r").height(300);
            setTimeout(function(){
                map_tw_r.invalidateSize()
                map_tw_r.addLayer(twDynamic);
            },5000)

        }




        $scope.waterPssStory_urban_three=function(res,latlon,index){
            console.log(res);
            if(res.status=='Functional' || res.status =='functional'){
                selected_color='red';
            }
            else{
                   selected_color='green';
            }
            $mdDialog.show({
                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +

                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4 ><b>'+scheme_title+' ('+res.name+')</b></h4>'+
                //  '<h5 ><b>SO 7: </b>Improve the Institutional set-up and Governance</h5>'+
                // '<h5 ><b>PS 7.1:</b> Implement Geographically Disaggregated decision Support Systems & Tools</h5>'+

                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<table class="table table-bordered table-striped">' +
                '<tr>' +
                '<td><b>Capacity:</b></td><td>' + res.capacity__ + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Construction Year:</b></td><td>' + res.constructi + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Name:</b></td><td>' + res.name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Generator Status:</b></td><td>' + res.generator + '</td>' +
                '</tr>' +
                //'<tr>' +
                //'<td><b>no__of_ins</b></td><td>' + res.no__of_ins + '</td>' +
                //'</tr>' +
                //'<tr>' +
                //'<td><b>operating</b></td><td>' + res.operating_ + '</td>' +
                //'</tr>' +
                '<tr>' +
                '<td><b>Scheme Name</b></td><td>' + res.scheme_nam + '</td>' +
                '</tr>' +
                //'<tr>' +
                //'<td><b>source</b></td><td>' + res.source + '</td>' +
                //'</tr>' +
                '<tr>' +
                '<td><b>Status</b></td><td> <b><font color='+selected_color+'>' + res.status + '</font></b></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="map_gst_r" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '<div class="col-md-4"><md-button ng-click="cancel()" class="md-primary">' +
                '      Cancel' +
                '    </md-button></div>'+
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                //clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });
            setTimeout(function(){
                $scope.map_gst_r('map_gst_r',latlon,index,17)
            },1000);
        }


        $scope.map_gst_r = function(container,laton,index,zoom) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var map_tw_r = new L.Map(container, {center: laton , zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_tw_r);
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [index],
                    useCors: false
                }
            );
            $("#map_gst_r").height(300);
            setTimeout(function(){
                map_tw_r.invalidateSize()
                map_tw_r.addLayer(twDynamic);
            },5000)

        }

        $scope.waterPssStory_urban_four=function(res,point,index){
            //console.log(res);

            $mdDialog.show({
                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +

                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4 ><b>  '+sc_t+ '</b></h4>'+
                //  '<h5 ><b>SO 7: </b>Improve the Institutional set-up and Governance</h5>'+
                // '<h5 ><b>PS 7.1:</b> Implement Geographically Disaggregated decision Support Systems & Tools</h5>'+

                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<div class="col-md-10"  style="background-color:#9AEEEA;margin-left:10px;font-size: 20px;text-align: center;">' +
                '<h5>Existence of closest '+selected_scheme+' in vicinity of proposed scheme</h5>'+
                '</div>'+
                '<table class="table table-bordered table-striped">' +
                '<tr>' +
                '<td><b>Distance from Existing '+selected_scheme+':</b></td><td>' + res.distance+ ' KM</td>' +
                '</tr>' +
                // '<tr>' +
                // '<td><b>Scheme type:</b></td><td>' + $scope.sc_type+ '</td>' +
                // '</tr>' +
                '<tr>' +
                '<td><b>District:</b></td><td>' + res.district + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Existing '+selected_scheme+' Name:</b></td><td>' + res.name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Locality:</b></td><td>' + res.locality + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Road Name</b></td><td>' + res.road + '</td>' +
                '</tr>' +
                //'<tr>' +
                //'<td><b>date_time</b></td><td>' + res.date_time + '</td>' +
                //'</tr>' +
                '<tr>' +
                '<td><b>City</b></td><td>' + res.city + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>UC</b></td><td>' + res.uc_no + '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="map_installation" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });
            setTimeout(function(){
                $scope.map_installation_map('map_installation',point,index,14,res)
            },1000);

        }



        $scope.map_installation_map= function(container,point,index,zoom,res) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var arr=[];
            arr.push(point.coordinates[1]);
            arr.push(point.coordinates[0]);
            var map_tw_r = new L.Map(container, {center: arr, zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_tw_r);
            var myStyle = {
                radius: 6,
                fillColor: " #00FFFFFFF",
                color: "#0090a8",
                weight: 5,
                opacity: 1

            };
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [index],
                    useCors: false
                }
            );
            $("#map_installation").height(300);
            setTimeout(function(){
                map_tw_r.invalidateSize();
                var layer=L.geoJSON(point).addTo(map_tw_r);
                var p_json=JSON.parse('{"type":"Point","coordinates":[' + res.lng + ',' + res.lat + ']}');
                L.geoJSON(p_json,{
                    pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, myStyle);
                }}).addTo(map_tw_r);
               // map_tw_r.fitBounds(layer.getBounds());
                map_tw_r.addLayer(twDynamic);
            },5000)

        }


        $scope.waterPssStory_urban_four_gst=function(res,point,index){
            console.log(res);
            $mdDialog.show({
                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +

                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4 ><b>  '+sc_t+ '</b></h4>'+
                //  '<h5 ><b>SO 7: </b>Improve the Institutional set-up and Governance</h5>'+
                // '<h5 ><b>PS 7.1:</b> Implement Geographically Disaggregated decision Support Systems & Tools</h5>'+

                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<div class="col-md-10"  style="background-color:#9AEEEA;margin-left:10px;font-size: 20px;text-align: center;">' +
                '<h5>Existence of closest '+selected_scheme+' in vicinity of proposed scheme</h5>'+
                '</div>'+
                '<table class="table table-bordered table-striped">' +
                '<tr>' +
                '<td><b>Distance from Existing '+selected_scheme+':</b></td><td>' + res.distance+ ' KM</td>' +
                '</tr>' +
                // '<tr>' +
                // '<td><b>Scheme type:</b></td><td>' + $scope.sc_type+ '</td>' +
                // '</tr>' +
                '<tr>' +
                '<td><b>Capacity:</b></td><td>' + res.capacity__ + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Block:</b></td><td>' + res.name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Construction:</b></td><td>' + res.constructi + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Operating</b></td><td>' + res.operating_ + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Name of Existing '+selected_scheme+'</b></td><td>' + res.scheme_nam + '</td>' +
                '</tr>' +
                //'<tr>' +
                //'<td><b>source</b></td><td>' + res.source + '</td>' +
                //'</tr>' +
                '<tr>' +
                '<td><b>Status</b></td><td>' + res.status + '</td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="map_installation_gst" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });
            setTimeout(function(){
                $scope.map_installation_map_gst('map_installation_gst',point,index,14,res)
            },1000);

        }



        $scope.map_installation_map_gst= function(container,point,index,zoom,res) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var arr=[];
            arr.push(point.coordinates[1])
            arr.push(point.coordinates[0])
            var map_tw_r = new L.Map(container, {center: arr, zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_tw_r);
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [index],
                    useCors: false
                }
            );
            var myStyle = {
                radius: 6,
                fillColor: " #00FFFFFFF",
                color: "#0090a8",
                weight: 5,
                opacity: 1

            };
            $("#map_installation_gst").height(300);
            setTimeout(function(){
                map_tw_r.invalidateSize();
                var layer=L.geoJSON(point).addTo(map_tw_r);
                var p_json=JSON.parse('{"type":"Point","coordinates":[' + res.lng + ',' + res.lat + ']}');
                L.geoJSON(p_json,{
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, myStyle);
                    }}).addTo(map_tw_r);
                // map_tw_r.fitBounds(layer.getBounds());
                map_tw_r.addLayer(twDynamic);
            },5000)

        }



        $scope.waterPssStory_urban_five=function(res,point){
            //console.log(res);
            var rs_wwtp=res.st_intersects;
            if(rs_wwtp=='t'){
                rs_wwtp='Accepted';
                selected_color='green';
            }
            else{
                rs_wwtp='Not Accepted';
                selected_color='red';
            }
            $mdDialog.show({
                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +

                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4 ><b>  '+sc_t+ '</b></h4>'+
                //  '<h5 ><b>SO 7: </b>Improve the Institutional set-up and Governance</h5>'+
                // '<h5 ><b>PS 7.1:</b> Implement Geographically Disaggregated decision Support Systems & Tools</h5>'+

                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<table class="table table-bordered table-striped">' +

                '<tr>' +
                '<td><b>District:</b></td><td>' + res.district + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Mauza:</b></td><td>' + res.mauza + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Tehsil:</b></td><td>' + res.tehsil + '</td>' +
                '</tr>' +
                '<tr bgcolor='+result_row_color+'>' +
                '<td><b>Result</b></td><td> <b><font color='+selected_color+'>' + rs_wwtp + '</font></b></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="map_installation_wwtp" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });

            setTimeout(function(){
                $scope.map_installation_map_wwtp('map_installation_wwtp',point,8,14)
            },1000);

        }


        $scope.map_installation_map_wwtp= function(container,point,index,zoom) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var arr=[];
            arr.push(point.coordinates[1])
            arr.push(point.coordinates[0])
            var map_tw_r = new L.Map(container, {center: arr, zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_tw_r);
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [index],
                    useCors: false
                }
            );
            $("#map_installation_wwtp").height(300);
            setTimeout(function(){
                map_tw_r.invalidateSize();
                var layer=L.geoJSON(point).addTo(map_tw_r);
                // map_tw_r.fitBounds(layer.getBounds());
                map_tw_r.addLayer(twDynamic);
            },5000)

        }







        $scope.waterPssStory_rural_one=function(res,point){
            //console.log(res);
            var v_arsenic=0;
            var v_flouride =0;
            var v_nitrade = 0;
            var v_tds = 0;
            var v_arsenic_res='';
            var v_flouride_res='';
            var v_nitrade_res='';
            var v_tds_res='';
            var v_arsenic_color='black';
            var v_flouride_color='black';
            var v_nitrade_color='black';
            var v_tds_color='black';

            if(res.arsenic==null){
                v_arsenic= 'NA';
                v_arsenic_res='NA';
            }
            else{
                v_arsenic=res.arsenic ;
                if(v_arsenic>50){
                    v_arsenic_color='red';
                    v_arsenic_res='False';
                }
                else{
                    v_arsenic_color='green';
                    v_arsenic_res='True';
                }
            }
            if(res.flouride==null){
                v_flouride= 'NA';
                v_flouride_res= 'NA';
            }
            else{
                v_flouride=res.flouride;
                if(v_flouride>1.5){
                    v_flouride_color='red';
                    v_flouride_res='False';
                }
                else{
                    v_flouride_color='green';
                    v_flouride_res='True';
                }
            }
            if(res.nitrate==null){
                v_nitrade= 'NA';
                v_nitrade_res='NA';
            }
            else{
                v_nitrade=res.nitrate;
                if(v_nitrade>50){
                    v_nitrade_color='red';
                    v_nitrade_res='False';
                }
                else
                {
                    v_nitrade_color='green';
                    v_nitrade_res='True';
                }
            }
            if(res.tds==null){
                v_tds= 'NA';
            }
            else{
                v_tds=res.tds;
                if(v_tds>1000){
                    v_tds_color='red';
                    v_tds_res='False';
                }
                else{
                    v_tds_color='green';
                    v_tds_res='True';
                }
            }
            $mdDialog.show({
                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +

                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4>'+sc_t+'</h4>'+
                //  '<h5 ><b>SO 7: </b>Improve the Institutional set-up and Governance</h5>'+
                // '<h5 ><b>PS 7.1:</b> Implement Geographically Disaggregated decision Support Systems & Tools</h5>'+

                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<table class="table table-bordered table-striped">' +
                '<tr>' +
                '<td><b>Distance From Existing Scheme:</b></td><td>' + res.distance_from_site+ ' KM</td>' +
                '</tr>' +
                // '<tr>' +
                // '<td><b>Scheme type:</b></td><td>' + $scope.sc_type+ '</td>' +
                // '</tr>' +
                '<tr>' +
                '<td><b>Existing Scheme Name:</b></td><td>' + res.site_name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Distance From Water Sample:</b></td><td>' + res.distance_from_sample + ' KM</td>' +
                '</tr>' +
                '</table>'+
                '<div class="col-md-10"  style="background-color:#9AEEEA;margin-left:10px;font-size: 20px;text-align: center;">' +
                '<h5>Water Quality Result</h5>'+
                '</div>'+
                '<table class="table table-bordered table-striped">' +
                '<tr>'+
                '<td><b>Arsenic (ppb):</b></td>' +
                '<td> <b> <font color='+v_arsenic_color+'>' + v_arsenic + '</font></b></td>' +
                '<td><b>Arsenic Condition</b></td><td> <b> <font color='+v_arsenic_color+'>' + v_arsenic_res + '</font></b></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Flouride (ppm)</b></td>' +
                '<td> <b> <font color='+v_flouride_color+'>' + v_flouride + '</font></b></td>' +
                '<td><b>Flouride Condition</b></td><td> <b> <font color='+v_flouride_color+'>' + v_flouride_res + '</font></b></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Nitrate (ppm)</b></td>' +
                '<td> <b> <font color='+v_nitrade_color+'>' + v_nitrade + '</font></b></td>' +
                '<td><b>Nitrade Condition</b></td><td> <b> <font color='+v_nitrade_color+'>' + v_nitrade_res + '</font></b></td>'+
                '</tr>' +
                '<tr>' +
                '<td><b>Tds (ppm)</b></td>' +
                '<td> <b> <font color='+v_tds_color+'>' + v_tds + '</font></b></td>' +
                '<td><b>Tds Condition</b></td><td> <b> <font color='+v_tds_color+'>' + v_tds_res + '</font></b></td>'+
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="rural_one" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });
            setTimeout(function(){
                $scope.map_rerual_one('rural_one',point,13)
            },1000);
        }


        $scope.map_rerual_one= function(container,point,zoom) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var arr=[];
            arr.push(point.coordinates[1])
            arr.push(point.coordinates[0])
            var map_tw_r = new L.Map(container, {center: arr, zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_tw_r);
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [0,5],
                    useCors: false
                }
            );
            $("#rural_one").height(300);
            setTimeout(function(){
                map_tw_r.invalidateSize();
                var layer=L.geoJSON(point).addTo(map_tw_r);
                // map_tw_r.fitBounds(layer.getBounds());
                map_tw_r.addLayer(twDynamic);
            },5000)

        }


        $scope.waterPssStory_rural_two=function(res,point){
            //console.log(res);
            var v_arsenic=0;
            var v_flouride =0;
            var v_nitrade = 0;
            var v_tds = 0;
            var v_arsenic_res='';
            var v_flouride_res='';
            var v_nitrade_res='';
            var v_tds_res='';
            var v_arsenic_color='black';
            var v_flouride_color='black';
            var v_nitrade_color='black';
            var v_tds_color='black';

            if(res.arsenic==null){
                v_arsenic= 'NA';
                v_arsenic_res='NA';
            }
            else{
                v_arsenic=res.arsenic ;
                if(v_arsenic>50){
                        v_arsenic_color='red';
                        v_arsenic_res='False';
                }
                else{
                    v_arsenic_color='green';
                    v_arsenic_res='True';
                }
            }
            if(res.flouride==null){
                v_flouride= 'NA';
                v_flouride_res= 'NA';
            }
            else{
                v_flouride=res.flouride;
                if(v_flouride>1.5){
                    v_flouride_color='red';
                    v_flouride_res='False';
                }
                else{
                    v_flouride_color='green';
                    v_flouride_res='True';
                }
            }
            if(res.nitrate==null){
                v_nitrade= 'NA';
                v_nitrade_res='NA';
            }
            else{
                v_nitrade=res.nitrate;
                if(v_nitrade>50){
                    v_nitrade_color='red';
                    v_nitrade_res='False';
                }
                else
                {
                    v_nitrade_color='green';
                    v_nitrade_res='True';
                }
            }
            if(res.tds==null){
                v_tds= 'NA';
            }
            else{
                v_tds=res.tds;
                if(v_tds>1000){
                    v_tds_color='red';
                    v_tds_res='False';
                }
                else{
                    v_tds_color='green';
                    v_tds_res='True';
                }
            }
            $mdDialog.show({
                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                // '<md-toolbar style="background-color: white;padding-left: 10px;padding-top:20px;">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +

                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4>'+sc_t+'</h4>'+
                //  '<h5 ><b>SO 7: </b>Improve the Institutional set-up and Governance</h5>'+
                // '<h5 ><b>PS 7.1:</b> Implement Geographically Disaggregated decision Support Systems & Tools</h5>'+

                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<table class="table table-bordered table-striped">' +
                '<tr>' +
                '<td><b>Distance From Existing Tubewell:</b></td><td>' + res.distance_from_tubewell+ ' KM</td>' +
                '</tr>' +
                // '<tr>' +
                // '<td><b>Scheme type:</b></td><td>' + $scope.sc_type+ '</td>' +
                // '</tr>' +
                '<tr>' +
                '<td><b>Existing Tubewell Name:</b></td><td>' + res.tubewell_name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Distance from Existing Water Sample:</b></td><td>' + res.distance_from_sample + ' KM</td>' +
                '</tr>' +
                '<tr>' +
                '</table>'+
                '<div class="col-md-10"  style="background-color:#9AEEEA;margin-left:10px;font-size: 20px;text-align: center;">' +
                '<h5>Water Quality Result</h5>'+
                '</div>'+
                '<table class="table table-bordered table-striped">' +
                '<tr>'+
                '<td><b>Arsenic (ppb):</b></td>' +
                '<td> <b> <font color='+v_arsenic_color+'>' + v_arsenic + '</font></b></td>' +
                '<td><b>Arsenic Condition</b></td><td> <b> <font color='+v_arsenic_color+'>' + v_arsenic_res + '</font></b></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Flouride (ppm)</b></td>' +
                '<td> <b> <font color='+v_flouride_color+'>' + v_flouride + '</font></b></td>' +
                '<td><b>Flouride Condition</b></td><td> <b> <font color='+v_flouride_color+'>' + v_flouride_res + '</font></b></td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Nitrate (ppm)</b></td>' +
                '<td> <b> <font color='+v_nitrade_color+'>' + v_nitrade + '</font></b></td>' +
                '<td><b>Nitrade Condition</b></td><td> <b> <font color='+v_nitrade_color+'>' + v_nitrade_res + '</font></b></td>'+
                '</tr>' +
                '<tr>' +
                '<td><b>Tds (ppm)</b></td>' +
                '<td> <b> <font color='+v_tds_color+'>' + v_tds + '</font></b></td>' +
                '<td><b>Tds Condition</b></td><td> <b> <font color='+v_tds_color+'>' + v_tds_res + '</font></b></td>'+
                '</tr>' +

                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="rural_two" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });

            setTimeout(function(){
                $scope.map_rerual_two('rural_two',point,13)
            },1000);

        }

        $scope.map_rerual_two= function(container,point,zoom) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var arr=[];
            arr.push(point.coordinates[1])
            arr.push(point.coordinates[0])
            var map_tw_r = new L.Map(container, {center: arr, zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_tw_r);
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [0,5],
                    useCors: false
                }
            );
            $("#rural_two").height(300);
            setTimeout(function(){
                map_tw_r.invalidateSize();
                var layer=L.geoJSON(point).addTo(map_tw_r);
                // map_tw_r.fitBounds(layer.getBounds());
                map_tw_r.addLayer(twDynamic);
            },5000)

        }




        $scope.rehabResult=function(res){

            if(res=='5'){
                return "Failure";
            }else if(res=='4'){
                return "Poor";
            }else if(res=='3'){
                return "Satisfactory";
            }else if(res=='2'){
                return "Good";
            }else if(res=='1'){

                return "Excellent";
            }
        }


        $scope.identifyWaterData=function(geoLayersIdForIdentifier,url,condition) {
            map.on('click', function (e) {
                var latlon=e.latlng
               // console.log(latlon);
                L.esri.identifyFeatures({
                    url: url
                })
                    .on(map)
                    .at(e.latlng)
                    .layers('visible:' + geoLayersIdForIdentifier)
                    // .layers('23')
                    .run(function (error, featureCollection, response) {
                        // $scope.layerInfos = response.results[0].attributes;
                       if(condition=='Rehabilitation of GST') {
                           $scope.waterPssStory_urban_three(response.results[0].attributes,latlon,geoLayersIdForIdentifier);
                       }else{
                           $scope.waterPssStory_urban_two(response.results[0].attributes,latlon,geoLayersIdForIdentifier);
                       }
                        //  $scope.$apply();
                    });


            });

        }



        $scope.cancel = function() {
            $mdDialog.cancel();

        };






    $scope.addNewLocationForWaterScheme=function() {
        //alert($scope.selectedTabWater);

        var waterAddLayer = new L.Draw.Polygon(map);
        scheme_title='';
        if($("#pss_water_scheme option:selected").val()=='Rehabilitation of TW'){
            scheme_title='Rehabilitation of Tubewell';
            $scope.cancel();
            $scope.identifyWaterData(0,'http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer');
            waterAddLayer.disable();
            return;
        }

        if($("#pss_water_scheme option:selected").val()=='Rehabilitation of OHR'){
            scheme_title='Rehabilitation of OHR';
            $scope.cancel();
            $scope.identifyWaterData(1,'http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer');

            waterAddLayer.disable();
            return;
        }

        if($("#pss_water_scheme option:selected").val()=='Rehabilitation of DS'){
            scheme_title='Rehabilitation of Disposal Station';
            $scope.cancel();
            $scope.identifyWaterData(2,'http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer');
            waterAddLayer.disable();
            return;
        }

        if($("#pss_water_scheme option:selected").val()=='Rehabilitation of GST'){
            scheme_title='Rehabilitation of GST';
            $scope.cancel();
            $scope.identifyWaterData(3,'http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer','Rehabilitation of GST');
            waterAddLayer.disable();
            return;
        }
        // if($("#pss_water_scheme option:selected").val()=='water supply pipelines'){
        //     $scope.cancel();
        //     $scope.identifyWaterData(4,'http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer');
        //     waterAddLayer.disable();
        //     return;
        // }
        // if($("#pss_water_scheme option:selected").val()=='sewerage pipeline'){
        //     $scope.cancel();
        //     $scope.identifyWaterData(5,'http://'+ipAddress+':6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer');
        //     waterAddLayer.disable();
        //     return;
        // }



        //***************************************************


        if($("#pss_water_scheme option:selected").val()=='Screening criteria for WWTP Location'){
                sc_t='Screening criteria for WWTP Location';
            $scope.cancel();
            map.on('click', function (e) {
                lat = e.latlng.lat;
                lon = e.latlng.lng;

                var pointGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');


                $.post( "services/water_wwst_service.php",{"geom":JSON.stringify(pointGeom)}, function(response1) {
                    var res=JSON.parse(response1);
                    $scope.waterPssStory_urban_five(res[0],pointGeom)
                })

                //console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
                //Clear existing marker,

                if (theMarker != undefined) {
                    map.removeLayer(theMarker);
                };

                //Add a marker to show where you clicked.
               // console.log([lat, lon])
                theMarker = L.marker([lat, lon]).addTo(map);
                map.off("click");

                //  $scope.checkAlignWithPss();
                return;
            });
            return;
        }



        if($("#pss_water_scheme1 option:selected").val()=='Installation Filtration plants'){
            sc_t='Installation Filtration plants';
            $scope.cancel();
            map.on('click', function (e) {
                lat = e.latlng.lat;
                lon = e.latlng.lng;

                var pointGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');

                $.post( "services/water_arsenic_treatment_plant_service.php",{"geom":JSON.stringify(pointGeom)}, function(response1) {
                   // var res=JSON.parse(response1);
                    var res=JSON.parse(response1);
                   // console.log(response1)
                    $scope.waterPssStory_rural_one(res[0],pointGeom);

                })

               // console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
                //Clear existing marker,

                if (theMarker != undefined) {
                    map.removeLayer(theMarker);
                };

                //Add a marker to show where you clicked.
              //  console.log([lat, lon])
                theMarker = L.marker([lat, lon]).addTo(map);
                map.off("click");

                //  $scope.checkAlignWithPss();
                return;
            });
            return;
        }

        if($("#pss_water_scheme1 option:selected").val()=='Installation Tube wells'){
            sc_t='Installation Tube wells';
            $scope.cancel();
            map.on('click', function (e) {
                lat = e.latlng.lat;
                lon = e.latlng.lng;

                var pointGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');


                $.post( "services/water_arsenic_tubewell_service.php",{"geom":JSON.stringify(pointGeom)}, function(response1) {
                    var res=JSON.parse(response1);
                   // console.log(response1)
                    $scope.waterPssStory_rural_two(res[0],pointGeom);

                })

              //  console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
                //Clear existing marker,

                if (theMarker != undefined) {
                    map.removeLayer(theMarker);
                };

                //Add a marker to show where you clicked.
               // console.log([lat, lon])
                theMarker = L.marker([lat, lon]).addTo(map);
                map.off("click");

                //  $scope.checkAlignWithPss();
                return;
            });
            return;
        }



        if($("#pss_water_scheme option:selected").val()=='New Installation of TW' ||
            $("#pss_water_scheme option:selected").val()=='New Installation of OHR' ||
            $("#pss_water_scheme option:selected").val()=='New Installation of DS' ||
            $("#pss_water_scheme option:selected").val()=='New Installation of GST'
         ){
            var table='water.tbl_tube_well';
            var installationIndex='';
            if($("#pss_water_scheme option:selected").val()=='New Installation of TW'){
                sc_t='New Installation of TW';
                selected_scheme='Tubewell';
                table='water.tbl_tube_well';
                installationIndex=0;
            }else if( $("#pss_water_scheme option:selected").val()=='New Installation of OHR'){
                sc_t='New Installation of OHR';
                selected_scheme='OHR';
                table='water.tbl_overhead';
                installationIndex=1;
            }else if( $("#pss_water_scheme option:selected").val()=='New Installation of DS'){
                sc_t='New Installation of DS';
                selected_scheme='Disposal Station';
                table='water.tbl_disposal';
                installationIndex=2;
            }else if($("#pss_water_scheme option:selected").val()=='New Installation of GST'){
                sc_t='New Installation of GST';
                selected_scheme='GST';
                table='water.tbl_gst';
                installationIndex=3;
            }
            $scope.cancel();
            map.on('click', function (e) {
                lat = e.latlng.lat;
                lon = e.latlng.lng;

                var pointGeom = JSON.parse('{"type":"Point","coordinates":[' + lon + ',' + lat + ']}');


                 $.post( "services/new_installation_service.php",{"geom":JSON.stringify(pointGeom),"table":table}, function(response1) {
                     var res=JSON.parse(response1);
                     //alert("distance is :"+res[0].distance+"meter");
                    // console.log(res[0]);
                     if(table=='water.tbl_gst'){
                         $scope.waterPssStory_urban_four_gst(res[0], pointGeom, installationIndex)

                     }else {
                         $scope.waterPssStory_urban_four(res[0], pointGeom, installationIndex)
                     }
                 })

              //  console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
                //Clear existing marker,

                if (theMarker != undefined) {
                    map.removeLayer(theMarker);
                };

                //Add a marker to show where you clicked.
              //  console.log([lat, lon])
                theMarker = L.marker([lat, lon]).addTo(map);
                map.off("click");

              //  $scope.checkAlignWithPss();
                return;
            });
            return;
        }

        $scope.waterPssStory=function(res,index){
            var cond_A=0;
            var cond_B=0;
            var cond_C=0;
            var cond_D=0;
            var cond_E=0;
            if((res[0].total_length_percentage) == null){
                cond_A= $scope.removeNullValuse(res[0].total_length_percentage);
            }
            else{
                cond_A=(res[0].total_length_percentage);
            }
            if((res[1].total_length_percentage) == null){
                cond_B= $scope.removeNullValuse(res[1].total_length_percentage);
            }
            else{
                cond_B=(res[1].total_length_percentage);
            }
            if((res[2].total_length_percentage) == null){
                cond_C= $scope.removeNullValuse(res[2].total_length_percentage);
            }
            else{
                cond_C=(res[2].total_length_percentage);
            }
            if((res[3].total_length_percentage) == null){
                cond_D= $scope.removeNullValuse(res[3].total_length_percentage);
            }
            else{
                cond_D=(res[3].total_length_percentage);
            }
            if((res[4].total_length_percentage) == null){
                cond_E= $scope.removeNullValuse(res[4].total_length_percentage);
            }
            else{
                cond_E=(res[4].total_length_percentage);
            }
            var f_res= res[3].final_result;
            selected_color='';
            if(f_res=='Accepted'){
                selected_color='green';
            }
            if (f_res=='Reconsider'){
                selected_color='orange';
            }
            if(f_res=='Not Accepted'){
                selected_color='red';
            }
            //console.log($scope.scheme_name);
            $mdDialog.show({

                controller: waterStoryController,
                template: '<md-dialog id="dt_dialog" aria-label="drive time">' +
                '<div id="myImageId" class="container-fluid">' +
                '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="col-md-10">' +

                '<div class="col-md-12"  style="background-color:#178D87;font-size: 20px;' +
                'letter-spacing: 0.005em;color: white;margin-top: 20px;margin-left:50px;">' +
                '<h4 style="text-align: center;border-bottom: solid 1px white">Site Suitability Assessment for IE</h4>' +
                '<h4 ><b> Replacement of '+$scope.sc_type+ '</b></h4>'+
                '</div>' +

                '<div class="col-md-12"  style="background-color:#9AEEEA;margin-left:50px;font-size: 20px;text-align: center;">' +
                '<h5>PROPOSED SITE CHARACTERISTICS</h5>' +
                '</div>' +

                '</div>' +

                '<div class="col-md-2">' +
                '<img src="images/logo.png">' +
                '</div>' +

                '</div>' +
                '</div>' +

                '<div class="row" style="margin-left: 50px;margin-right: 50px;">' +
                '<div class="col-md-6">' +
                '<table class="table table-bordered table-striped">' +
                '<tr>' +
                '<td><b>Scheme level:</b></td><td>' + $scope.selectedTabWater+ '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Scheme type:</b></td><td>' + $scope.sc_type+ '</td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Scheme Name:</b></td><td>' + $scope.scheme_name + '</td>' +
                '</tr>' +
                '<tr bgcolor='+result_row_color+'>' +
                '<td><b>Result:</b></td><td> <b><font color='+selected_color+'>' + res[3].final_result + '</font></b></td>' +
                '</tr>' +
                '</table>' +
                '<div class="col-md-10"  style="background-color:#9AEEEA;margin-left:10px;font-size: 20px;text-align: center;">' +
                 '<h5>Existing Pipelines Condition in Percentage(%)</h5>'+
                '</div>'+
                '<table class="table table-bordered table-striped">'+
                '<tr>' +
                '<td><b>Pipelines in Excellent Condition:</b></td><td>' + Math.round(cond_A) + ' % </td>' +
                '</tr>' +
                '<tr>' +
                '<td><b>Pipelines in Good Condition:</b></td><td>' + Math.round(cond_B) + ' % </td>' +
                '</tr>' +

                '<tr>' +
                '<td><b>Pipelines in Satisfactory Condition:</b></td><td>' + Math.round(cond_C) + ' % </td>' +
                '</tr>' +

                '<tr>' +
                '<td><b>Pipelines in Poor Condition:</b></td><td>' +  Math.round(cond_D) + ' % </td></tr>' +
                '<tr>' +
                '<td><b>Pipelines in Failure Condition:</b></td><td>' + Math.round(cond_E) + ' %</td>' +
                '</tr>' +


                '</table>' +
                '</div>' +
                '<div class="col-md-6">' +
                '<div id="piple_map" width="90%" height="450px"></div>' +
                '</div>' +
                '</div>'+
                '</div>' +
                '<div class="col-md-4"><md-button ng-click="cancel()" class="md-primary">' +
                '      Cancel' +
                '    </md-button></div>'+
                '</md-dialog>',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen
            });

            setTimeout(function(){
                $("#piple_map").html("");
                $scope.map_pipeline_map('piple_map',latlon,index,12)
            },1000);

        }

        $scope.removeNullValuse=function(vals) {
            if (vals == null) {
                //  return 'No <span class="glyphicon glyphicon-remove btn-danger"></span>';
                return '0';
            }
        }

        $scope.map_pipeline_map= function(container,laton,index,zoom) {
            $scope.tw = 'http://202.166.167.121:6080/arcgis/rest/services/Punjab/PB_irisportal_pg138_water_supply_v_01812019/MapServer';
            var map_pipeline_sewrage = new L.Map(container, {center: [31.615965, 72.38554] , zoom: zoom});
            var roads = L.gridLayer.googleMutant({
                type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
            }).addTo(map_pipeline_sewrage);
            var twDynamic = L.esri.dynamicMapLayer(
                {
                    url:$scope.tw,
                    opacity : 1,
                    layers : [index],
                    useCors: false
                }
            );
            $("#piple_map").height(300);
            setTimeout(function(){
                map_pipeline_sewrage.invalidateSize();
                var layer=L.geoJSON(drawnGeomWater).addTo(map_pipeline_sewrage);
                map_pipeline_sewrage.fitBounds(layer.getBounds());
                map_pipeline_sewrage.addLayer(twDynamic);
            },5000)

        }

        $scope.checkAlignWithWaterPss=function(url_con) {

            //  var sc_district=$("#district_pss option:selected").val();
            //  var sc_tehsil=$("#pss_tehsil option:selected").val();
            //alert("scheme name"+sc_name+","+"geom"+sc_geom+","+"scheme type"+sc_type+","+"district id"+sc_district+","+"sc_tehsil"+sc_tehsil)
            var url;
            if(url_con=='sewerage pipeline'){
                url='services/sewreage_sector_lookup.php'
            }else{
                url='services/water_sector_lookup.php';
            }

            $.post(url, {"geom": JSON.stringify(drawnGeomWater)}, function (response1) {
                //alert(response1);
                if(url_con=='sewerage pipeline') {
                    $scope.waterPssStory(JSON.parse(response1),7);
                }else{
                    $scope.waterPssStory(JSON.parse(response1),6);

                }

            })
                .fail(function () {
                    alert("error");
                })


        }





        if ($scope.selectedTabWater = "Urban Schemes") {
            $scope.sc_type = $("#pss_water_scheme option:selected").val();
        } else {
            $scope.sc_type = $("#pss_water_scheme1 option:selected").val();
        }

        $scope.cancel();
        waterAddLayer.enable();

        map.on(L.Draw.Event.CREATED, function (event) {
            var layer = event.layer.toGeoJSON();
            map.removeLayer(drawnItems);
            drawnGeomWater = layer.geometry;
            waterAddLayer.disable();
            $scope.checkAlignWithWaterPss($scope.sc_type);
            map.off(L.Draw.Event.CREATED)
        });

    }




    }


        }],
        controllerAs:   'waterCtrl'

    }


});

