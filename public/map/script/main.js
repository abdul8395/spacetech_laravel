angular.module('geoportal', ['ngMaterial','mytoolbarController','tocController','rightController','waterController','connectivityController','environmentController','educationController','agricultureController'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('deep-orange')
    })

    .controller('customSidenavController', function ($scope, $mdSidenav) {
        $scope.toggleLeft = buildToggler('left');

        var ubiqueDivOuter = document.getElementById('divUniqueButton');
        var ubiqueDivInner = document.getElementById('divUniqueButton2');

        function buildToggler(componentId) {
            return function() {


                ubiqueDivOuter.style.display = "none";
                ubiqueDivInner.style.display = "block";
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.toggleLeft2 = buildToggler2('left');

        function buildToggler2(componentId) {
            return function() {


                ubiqueDivInner.style.display = "none";
                ubiqueDivOuter.style.display = "block";

                $mdSidenav(componentId).toggle();
            };
        }


    });

// esri leaflet code
var map;
var dialog;
var geolayers=[];
var measureTool=false;
var measureControl;
var graticule=false;
var graticuleObj;
var cord;
var latlon=false;
var polyLineMeasureControl;
var boolPolyLineMeasure=false;
var lc;
var loc=false;
var shapefile;
var myLayers=[];
var drawnItems;
var attributes = {};
var layersSwitcher=[];
var layerSwitch;
var layersObj={}
var waypointsArray=[];
var styleEditor;
var mydt;
var selectedLayerData
var selectedLayerDataArray=[];
var selectedLayerName='';
var polygonDrawer;
var printer;
var toolName;
var myTypeahead;

var connectivity_kml;
var connectivity_shp;
setTimeout(function(){


    // $('button').click(function(){
    //      // $('button.active').removeClass('active');
    //      // $(this).addClass('active');
    //    $('.bg_style').removeAttr( 'style' );
    //    $(this).css({'background-color': '#2196F3'});
    //    $(this).css({'color': 'snow'});
    // });

     map = L.map("map", {
          zoom: 7,

        center: [31.615965, 72.38554],
       //    center:  [37.78, -122.42],
        zoomControl: true,
        attributionControl: false,
         condensedAttributionControl: false
    });
  //  L.esri.basemapLayer("Imagery").addTo(map);

    /*var roadMutant = L.gridLayer.googleMutant({
        maxZoom: 25,
        type:'roadmap'
    })*/
	//.addTo(map);

    var OpenMapSurfer_Roads = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        }).addTo(map);

/*

     printer = L.easyPrint({
        tileLayer: roadMutant,
        sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
        filename: 'myMap',
        exportOnly: true,
        hideControlContainer: true
    }).addTo(map);*/







    var fullScreenControl = L.control.fullscreen({position:"topright"}).addTo(map);

    map.addControl(L.staticLayerSwitcher([
        'OpenMapSurfer', 'CycleMap', 'Humanitarian'
    ], { editable: true }));

    document.getElementById('map').style.cursor='default';



//    var staticlayer=L.staticLayerSwitcher(myLayers, { editable: true }).addTo(map);

/*
    new L.Control.GPlaceAutocomplete({
        callback: function(place){
            var loc = place.geometry.location;
            map.setView( [loc.lat(), loc.lng()], 22);
        }
    }).addTo(map);
*/

   var measureOption={
       position: 'topright',
       primaryLengthUnit: 'feet',
       secondaryLengthUnit: 'miles',
       primaryAreaUnit: 'acres',
       secondaryAreaUnit: 'sqmeters',
       activeColor: '#e69095',
       completedColor: '#403ff2'
   }
    var measureControl = new L.Control.Measure(measureOption);
    measureControl.addTo(map);

    var control = new L.Control.Bookmarks().addTo(map);


    drawnItems = L.featureGroup().addTo(map);

    map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            poly : {
                allowIntersection : false
            }
        },
        draw: {
            polygon : {
                allowIntersection: false,
                showArea:true
            }
        }
    }));


    styleEditor = L.control.styleEditor({
        position: "topleft"
    });
    map.addControl(styleEditor);

    map.on(L.Draw.Event.CREATED, function(event) {
        var layer = event.layer;
//        console.log(L.Util.stamp(layer));
        var layer_id =L.Util.stamp(layer);
        var feature = layer.feature = layer.feature || {};
        feature.type = feature.type || "Feature";
        feature.properties = feature.properties||{};
        // feature.properties.style = feature.properties || {};
        console.log(feature);
//        var content = getPopupContent(layer);
//        if (content !== null) {
        var tbl= '<table class="table table-striped" id="tbl_Info">'+
            '</table>'+
            '<table class="table table-striped">' +
            '<tr>' +
            '<td><button class="btn btn-primary btn-xs" onclick="append_row()">Add Row</button></td>' +
            '<td><button class="btn btn-primary btn-xs" onclick="save_geojson('+layer_id+')">Save</button></td>' +
            //'</tr>'+
           // '<tr>'+
            // '<td><button class="btn btn-primary btn-xs" onclick="get_info_window_table('+layer_id+')">get table</button></td>' +
            '<td><a  href="#" id="export">Export Features</a></td>' +
            //'</tr>' +
            '</table>'
            ;
        layer.bindPopup(tbl, {
            minWidth : 300
        });
//        layer.feature.properties = temp;
//        }
        drawnItems.addLayer(layer);
    });
    // Object(s) edited - update popups
    map.on(L.Draw.Event.EDITED, function(event) {
        var layers = event.layers,
            content = null;
        layers.eachLayer(function(layer) {
            content = getPopupContent(layer);
            if (content !== null) {
                layer.setPopupContent(content);
            }
        });
    });






    //L.control.condensedAttribution({
    //    emblem: '<div class="emblem-wrap"><img src="https://www.route360.net/assets/images/logo_nav.png"/></div>',
    //    prefix: '<a href="http://www.urbanunit.gov.pk/UU/Home">Urban Unit</a>'
    //}).addTo(map);



    //geolayers=  L.esri.dynamicMapLayer({
    //    url: 'http://202.166.168.183:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer',
    //    opacity: 0.7,
    //    layers: [6]
    //})
        //.addTo(map);
  //  map.addLayer(geolayers);
    //map.addLayer(geolayers);
    //.addTo(map);




   // var nationalGeographic =
        //     L.layerGroup([
        // //    geolayers,
        //     L.esri.basemapLayer('NationalGeographic')
        // ]),
        // esriTopo = L.layerGroup([
        //   //  geolayers,
        //     L.esri.basemapLayer('Topographic')
        // ]),
       // esriImagery = L.layerGroup([
       //    //  geolayers,
       //      L.esri.basemapLayer('Imagery')
       //  ]),
   /* googleImagery=L.layerGroup([L.gridLayer.googleMutant({
        maxZoom: 24,
        type:'hybrid'
    })
      ])
        gmap=L.layerGroup([L.gridLayer.googleMutant({
        maxZoom: 24,
        type:'roadmap'
    })

    ])
*/
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var OpenMapSurfer_Roads = L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
        maxZoom: 22
    });



    var baseLayers = {
        "OpenStreet":OpenStreetMap_Mapnik,
        "OpenStreetRoad":OpenMapSurfer_Roads,
 //       "Google Street":gmap,
      //  "National Geographic": nationalGeographic,
       // "Esri Topographic": esriTopo,
        //"Google Imagery": googleImagery
    };
    //var overlayObj={
    //    "portalLayers":geolayers
    //}

    var OWM_API_KEY = 'f6912b4e43460266a19b6d984d6b2610';
    //var overlayObj={
    //    "portalLayers":geolayers
    //}

    var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5, appId: OWM_API_KEY});
    var cloudscls = L.OWM.cloudsClassic({opacity: 0.5, appId: OWM_API_KEY});
    var precipitation = L.OWM.precipitation( {opacity: 0.5, appId: OWM_API_KEY} );
    var precipitationcls = L.OWM.precipitationClassic({opacity: 0.5, appId: OWM_API_KEY});
    var rain = L.OWM.rain({opacity: 0.5, appId: OWM_API_KEY});
    var raincls = L.OWM.rainClassic({opacity: 0.5, appId: OWM_API_KEY});
    var snow = L.OWM.snow({opacity: 0.5, appId: OWM_API_KEY});
    var pressure = L.OWM.pressure({opacity: 0.4, appId: OWM_API_KEY});
    var pressurecntr = L.OWM.pressureContour({opacity: 0.5, appId: OWM_API_KEY});
    var temp = L.OWM.temperature({opacity: 0.5, appId: OWM_API_KEY});
    var wind = L.OWM.wind({opacity: 0.5, appId: OWM_API_KEY});
  //  var city = L.OWM.current({intervall: 15, lang: 'de', markerFunction: myOwmMarker, popupFunction: myOwmPopup});

// add layer groups to layer switcher control
    var overlayMaps = { "Clouds": clouds,"CloudHistory":cloudscls,"Precipitation":precipitation,"precipitationHistory":precipitationcls,"Rain":rain,"RainHistory":raincls,"Snow":snow,"Pressure":pressure,"Pressure Contours":pressurecntr,"Temprature":temp,"Wind":wind };

// add layer groups to layer switcher control
    var controlLayers = L.control.layers(baseLayers,overlayMaps).addTo(map);


    function myOwmMarker(data) {
        // just a Leaflet default marker
        return L.marker([data.coord.lat, data.coord.lon]);
    }

    function myOwmPopup(data) {
        // just a Leaflet default popup with name as content
        return L.popup().setContent(data.name);
    }


    //map.on('layeradd',function (e) {
    //   // adi = e;
    //    console.log(e);
    //    L.esri.request('http://202.166.168.183:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer', {}, function (error, response) {
    //  //      console.log(response.layers);
    //        mainArray=response.layers;
    //        angular.element(document.getElementById("toc")).scope().createToc(mainArray);
    //    })
    //})


    $( document ).ready(function() {
//        $("#fileInput").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addMbTilesToMap(file);
//            this.value = null;
//        });

        $("#geojson").on("change", function (e) {
            var file = $(this)[0].files[0];
            addGeoJson(file);
            this.value = null;
        });



        // $("#geojsonSA").on("change", function (e) {
        //     var file = $(this)[0].files[0];
        //     addGeoJsonForServiceArea(file)
        //     this.value = null;
        // });

        // $("#shpSA").on("change", function (e) {
        //     var file = $(this)[0].files[0];
        //     addSHPForServiceArea(file);
        //     this.value = null;
        // });

        $("#shp").on("change", function (e) {
            var file = $(this)[0].files[0];
            addShapefile(file);
            this.value = null;
        });
//        $("#fileInput3").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addGpkg(file);
//            this.value = null;
//        });
        $("#kml").on("change", function (e) {
            var file = $(this)[0].files[0];
            addKml(file);
            this.value = null;
        });



//        $("#fileInput5").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addMbTilesVector(file);
//            this.value = null;
//        });
//        $("#fileInput6").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addGeoJsonForElevation(file);
//            this.value = null;
//        });
//        $("#fileInput7").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addGPXForElevation(file);
//            this.value = null;
//        });
        $("#csv").on("change", function (e) {
            var file = $(this)[0].files[0];
            addCsvFile(file);
            this.value = null;
        });


//        $("#fileInput9").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addMbTilesVector(file , true);
//            this.value = null;
//        });
//        $("#fileInput10").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addRasterTileElevationLayer(file , true);
//            this.value = null;
//        });
//        $("#fileInput11").on("change", function (e) {
//            var file = $(this)[0].files[0];
//            addGdbFile(file , true);
//            this.value = null;
//        });

        // $("ol.simple_with_animation").sortable(
        //     {
        //         onDrop: function  ($item, container, _super) {
        //             var $clonedItem = $('<li/>').css({height: 0});
        //             $item.before($clonedItem);
        //             $clonedItem.animate({'height': $item.height()});
        //
        //             $item.animate($clonedItem.position(), function  () {
        //                 $clonedItem.detach();
        //                 _super($item, container);
        //             });
        //
        //             reArragneLayers();
        //
        //
        //         }
        //     }
        //
        // );


    });


    setTimeout(function(){ map.invalidateSize()}, 1000);

}, 200);


function upLayer(element , layerName){
    var li = $(element).parent();
    var prev = li.prev();
    if(prev.length){
        li.detach().insertBefore(prev);
       // reArragneLayers();
        myLayers[layerName].setZIndex(1000)
        myLayers[layerName].bringToFront();
    }

}
function downLayer(element , layerName){
    var li = $(element).parent();
    var next = li.next();
    if(next.length){
        li.detach().insertAfter(next);
      //  reArragneLayers();
        myLayers[layerName].bringToBack()

    }

}

function reArragneLayers(){
    $( "#userLayers" ).each(function( index ) {$($("li"))
        $(this).find('li').each(function(){
            map.removeLayer(myLayers[$( this ).text()]);
        });
        $($(this).find('li').get().reverse()).each(function(){
            // alert($( this ).text()+" "+$(this).find('input').first().is(":checked"));
            if($(this).find('input').first().is(":checked")){
                map.addLayer(myLayers[$( this ).text()]);
            }
        });
    });
}



function addConnectivityShapefile(file){
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (event) {
        var data = reader.result;
        myLayers[file.name]=new L.Shapefile(data);
        setTimeout(function(){
            connectivity_shp=myLayers[file.name].toGeoJSON();
            map.fitBounds(myLayers[file.name].getBounds());
        },300)
    }
}


function addShapefile(file){

    // if(layerSwitch!=undefined){
    //     map.removeControl(layerSwitch);
    // }

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (event) {
        var data = reader.result;
      //  shapefile = new L.Shapefile(data);
    //   var options={'name':file.name}
        myLayers[file.name]=new L.Shapefile(data);
       // myLayers[file.name].id=file.name
        var filename=file.name

          layersObj[filename]=myLayers[file.name];
        layersSwitcher.push(layersObj);

        map.addLayer(myLayers[file.name]);




        var str='<li id="'+file.name+'" class="list-group-item" >'+
        '<input onclick="turnLayerOnOf(this,'+"'"+file.name+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+file.name+'</span>' +
            '<img onclick="upLayer(this , \''+file.name+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
            '<img onclick="downLayer(this , \''+file.name+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+file.name+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>'+
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+file.name+"\",\""+'myLayers'+"\")'>"+
            '</li>';

        $("#userLayers").append(str);
        setTimeout(function(){
            //layerIds.push(file.name)
            map.fitBounds(myLayers[file.name].getBounds());
        //    alert(ls.getLayersIds())
        //    layerSwitch=map.addControl(L.staticLayerSwitcher(layersObj, { editable: true }));

        },300)

    //    map.addControl(L.staticLayerSwitcher(myLayers, { editable: true }));

        // readAttributesFromShapefile(data , file.name);
       // addLayerToToc(file.name , ac_shpfile);
    }
}



function addConnectivityKml(file){

    var reader = new FileReader();
    reader.onload = function() {

        var dataUrl = this.result;

        myLayers[file.name] = new L.KML(dataUrl, {async: true});

        myLayers[file.name].on("loaded", function(e) {
            map.fitBounds(e.target.getBounds());
           // layerSwitch=map.addControl(L.staticLayerSwitcher(layersObj, { editable: true }));
            connectivity_kml=myLayers[file.name].toGeoJSON();
            console.log(connectivity_kml);
        });

    }
    reader.readAsDataURL(file);

    //  map.addControl(L.staticLayerSwitcher(myLayers, { editable: true }));

}

function addKml(file){
    //
    // if(layerSwitch!=undefined){
    //     map.removeControl(layerSwitch);
    // }
    var reader = new FileReader();
    reader.onload = function() {

        var dataUrl = this.result;

         myLayers[file.name] = new L.KML(dataUrl, {async: true});

        myLayers[file.name].on("loaded", function(e) {
            map.fitBounds(e.target.getBounds());
            layerSwitch=map.addControl(L.staticLayerSwitcher(layersObj, { editable: true }));
            connectivity_kml=myLayers[file.name].toGeoJSON();
            console.log(connectivity_kml);
        });

        var filename=file.name;

      //  layersObj={filename:myLayers[file.name]};
        layersObj[filename]=myLayers[file.name];



        // layersSwitcher.push(layersObj)


        map.addLayer( myLayers[file.name]);

        var str='<li id="'+file.name+'" class="list-group-item" >'+
            '<input onclick="turnLayerOnOf(this,'+"'"+file.name+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+file.name+'</span>' +
            '<img onclick="upLayer(this , \''+file.name+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
            '<img onclick="downLayer(this , \''+file.name+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+file.name+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>'+
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+file.name+"\",\""+'myLayers'+"\")'>"+
            '</li>';
        $("#userLayers").append(str);
        // readAttributesFromKml(dataUrl);
        // addLayerToToc(file.name , kmlLayer);
    }
    reader.readAsDataURL(file);

    //  map.addControl(L.staticLayerSwitcher(myLayers, { editable: true }));

}

function turnLayerOnOf(element,name){
    if($(element).is(":checked")){
        map.addLayer(myLayers[name])
    }
    else{
        map.removeLayer(myLayers[name]);
    }
}



function append_row() {
    $("#tbl_Info").append('<tr class="tr_draw"><td><input class="input_draw" type="text"></td><td><input type="text"></td></tr>')
}


function addGeoJson(file){
    // -- helper from viz.js test of geojson-vt
    // $("#dropArea").html("<br/><br/>Loading... " + file.name.toString());
    var start = new Date().getTime();
    var reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function (event) {
        var elapsed = new Date().setTime(new Date().getTime() - start);
        // $("#dropArea").html($("#dropArea").html()+" " + elapsed + "ms");
        // $("#dropArea").html($("#dropArea").html()+"<br/>&nbsp;Parsing... " + humanFileSize(event.target.result.length));


        var data = JSON.parse(event.target.result);
        var filename=file.name
        selectedLayerData={"filename":filename,"data":data};
        selectedLayerDataArray.push(selectedLayerData);
        attributes[file.name] = readAttributesFromGeoJson(data);
        // $("#dropArea").html($("#dropArea").html()+"<br/>&nbsp;Indexing... " + data.features.length + " features");
        var highlight;
        var clearHighlight = function() {
            if (highlight) {
                vectorGrid.resetFeatureStyle(highlight);
            }
            highlight = null;
        };
        var vectorGrid;
        if(data.features[0].geometry.type=="Point"){
            myLayers[file.name] = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    layer.on('click', function (e) {
                        drawnItems.addLayer(layer);
                        var tbl= '<table class="table_draw" id="tbl_Info"></table>' +
                            '<table><tr><td><button onclick="append_row()">Add Row</button></td><td><button onclick="save_geojson('+layer_id+')">Save</button></td><td><button onclick="get_info_window_table('+layer_id+')">get table</button></td><td><a href="#" id="export">Export Features</a></td></tr></table>';
                        layer.bindPopup(tbl, {
                            minWidth : 300
                        });
                    });
                }
            });
            map.addLayer( myLayers[file.name]);
        }
        else{

            myLayers[file.name] = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    layer.on('click', function (e) {
                       // e.target.editing.enable();

                        var layer_id =L.Util.stamp(layer);
                        var feature = layer.feature = layer.feature || {};
                        feature.type = feature.type || "Feature";
                        feature.properties = feature.properties||{};
                        var lyr_properties=feature.properties;
                        // feature.properties.style = feature.properties || {};
                        console.log(feature);
                        // var tbl= '<table class="table_draw" id="tbl_Info"></table>' +
                        //     '<table><tr><td><button onclick="append_row()">Add Row</button></td><td><button onclick="save_geojson('+layer_id+')">Save</button></td><td><button onclick="get_info_window_table('+layer_id+')">get table</button></td><td><a href="#" id="export">Export Features</a></td></tr></table>';
                        var tbl = '<table id="tbl_Info" class="table table-striped">'
                        $.each( lyr_properties, function( key, value ) {
                            tbl=tbl+'<tr><td>'+key+'</td><td>'+value+'</td></tr>';
                        });
                        tbl=tbl+'</table>';
                        layer.bindPopup(tbl, {
                            minWidth : 300
                        });

                        drawnItems.addLayer(layer);
                    });
                }
            });
            map.addLayer( myLayers[file.name]);

            // myLayers[file.name] = L.vectorGrid.slicer(data)
            //
            // map.addLayer( myLayers[file.name]);
        }

        var str='<li onclick="dataForGeoprocessing('+"'"+file.name+"'"+',this)" id="'+file.name+'" class="list-group-item" >'+
            '<input onclick="turnLayerOnOf(this,'+"'"+file.name+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+file.name+'</span>' +
            '<img onclick="upLayer(this , \''+file.name+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
            '<img onclick="downLayer(this , \''+file.name+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+file.name+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>'+
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+file.name+"\",\""+'myLayers'+"\")'>"+
            '</li>';
        $("#userLayers").append(str);
      //  addLayerToToc(file.name , vectorGrid);

     //   map.addControl(L.staticLayerSwitcher(myLayers, { editable: true }));


    }

}

function dataForGeoprocessing(name,ele){
     //selectedLayerData=file;
     selectedLayerName=name;
    $("#userLayers li").removeClass("selected");
    $(ele).addClass("selected");
}

function updateOpacity(value, id,layer) {
    try{
        if(layer=='geolayer') {
            geolayers[id].setOpacity(value);
        }else if(layer=='mylayer'){
            mylayer[id].setOpacity(value);
        }else{
            myLayers[id].setOpacity(value);
        }
    }

    catch(err){
        if(layer=='geolayer') {
            geolayers[id].setStyle({fillOpacity: value, opacity: value});
        }else if(layer=='mylayer'){
            mylayer[id].setStyle({fillOpacity: value, opacity: value});

        }else{
            myLayers[id].setStyle({fillOpacity: value, opacity: value});
        }
        // layersWithName[name].setFeatureStyle(undefined, {fillOpacity: 1});
    }
}

function readAttributesFromGeoJson(data){
    var atrbData = [];
    for(var i=0; i<data.features.length; i++){
        atrbData.push(data.features[i].properties);
    }
    return atrbData;
}

function save_geojson(layer_id){
    var layer = drawnItems.getLayer(layer_id);
    var obj_temp = {};
    $('#tbl_Info tr').each(function(){
        var key = $(this).find('td:first-child input').val();
        var val = $(this).find('td:nth-child(2) input').val();
        obj_temp[key]= val;
    });
    //jQuery.extend(obj_temp, layer.options);
    layer.feature.properties = obj_temp;
    saveJsonObj['drawItems']=drawnItems.toGeoJSON();

    get_info_window_table(layer_id);

    //export draw features to geoJSON

    document.getElementById('export').onclick = function(e) {
        // Extract GeoJson from featureGroup
        var data = drawnItems.toGeoJSON();
        saveJsonObj['drawItems']=data;


        // Stringify the GeoJson
        var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

        // Create export
        document.getElementById('export').setAttribute('href', 'data:' + convertedData);
        document.getElementById('export').setAttribute('download','data.geojson');
    }

}

function  get_info_window_table(layer_id) {
    var layer = drawnItems.getLayer(layer_id);
    var lyr_properties = layer.feature.properties||{};

    console.log(lyr_properties);
    console.log(Object.keys(lyr_properties).length);



    if(Object.keys(lyr_properties).length==0){
        console.log('<table class="table_draw><tr class="tr_draw"><td>' +
            '<input class="input_draw" type="text"></td><td><input type="text"></td></tr></table>')
    }else if(Object.keys(lyr_properties).length>0){
        var tbl = '<table id="tbl_Info" class="table table-striped">'
        $.each( lyr_properties, function( key, value ) {
            tbl=tbl+'<tr><td>'+key+'</td><td>'+value+'</td></tr>';
        });
        tbl=tbl+'</table>';
        tbl=tbl+ '<table class="table table-striped">' +
            '<tr>' +
            '<td><button class="btn btn-primary btn-xs" onclick="append_row()">Add Row</button></td>' +
            '<td><button class="btn btn-primary btn-xs" onclick="save_geojson('+layer_id+')">Save</button></td>' +
            //'</tr>'+
            // '<tr>'+
            // '<td><button class="btn btn-primary btn-xs" onclick="get_info_window_table('+layer_id+')">get table</button></td>' +
            '<td><a  href="#" id="export">Export Features</a></td>' +
            //'</tr>' +
            '</table>';


            //'<tr><td><button onclick="append_row()">Add Row</button></td><td><button onclick="save_geojson('+layer_id+')">Save</button></td><td><button onclick="get_info_window_table('+layer_id+')">get table</button></td><td><a href="#" id="export">Export Features</a></td></tr></table>';

        layer.bindPopup(tbl, {
            minWidth : 300
        });

        console.log(tbl) ;

    }

}

var driveTimes='';
var res=''

function removegptask(){
    if(driveTimes!=""){
        driveTimes.clearLayers();
        map.off('click');
    }
}

function createServiceArea(){
    map.off('click');

    //angular.element($("#dt_dialog")).scope().$mdDialog.cancel();
    var gpService = L.esri.GP.service({
       // url: "http://192.168.1.200:6080/arcgis/rest/services/drivetime/GPServer/drivetime",
        //url:"http://202.166.168.183:6080/arcgis/rest/services/GPServices/drive_time_new/GPServer/drive_time",
        url:"http://202.166.168.183:6080/arcgis/rest/services/GPServices/CalcDriveTimePolygons/GPServer/Calculate%20Drive%20Time%20Polygons",
        useCors:false
    });
     var gpTask = gpService.createTask();
         gpTask.setParam('env:outSR', 4326);
     mydt=$("#drivetime").val();
     //gpTask.setParam("Break_Values", "1 2 3");
    gpTask.setParam("Drive_Time_Values", mydt);


   // gpTask.setParam("Drive_Times", "1 2");

    if(driveTimes!=""){
        driveTimes.clearLayers();
    }

     driveTimes = L.featureGroup();
    map.addLayer(driveTimes);

    map.on('click', function(evt){
        //document.getElementById('info-pane').innerHTML = 'working...';
        // if(driveTimes!='') {
        //     driveTimes.clearLayers();
        // }
        $(".loader").show();

        // gpTask.setParam("Facilities", evt.latlng)
        // gpTask.run(driveTimeCallback);


        driveTimes.clearLayers();
        // gpTask.setParam("Input_Location", evt.latlng)
        // gpTask.run(driveTimeCallback);

        gpTask.setParam("Input_Facilities", evt.latlng)
        gpTask.run(driveTimeCallback);
    });
}







function addGeoJsonForServiceArea(file){
    scope.cancel();
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {

        var data = JSON.parse(event.target.result);
        if(data.features[0].geometry.type=="Point"){
        // var mygeojson = L.geoJSON(data, {});
            myLayers[file.name] = L.geoJSON(data, {});
            map.addLayer(myLayers[file.name]);
            var dt=$("#drivetimeGjson").val();
            createServiceAreaByGeojson(data,dt);
        }
        else{
         alert("please select point dataset")
        }
    }

    var str='<li id="'+file.name+'" class="list-group-item" >'+
        '<input onclick="turnLayerOnOf(this,'+"'"+file.name+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+file.name+'</span>' +
        '<img onclick="upLayer(this , \''+file.name+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
        '<img onclick="downLayer(this , \''+file.name+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
        '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+file.name+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
        '<span class="glyphicon glyphicon-minus"></span>' +
        '</button>'+
        "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+file.name+"\",\""+'myLayers'+"\")'>"+
        '</li>';
    $("#userLayers").append(str);

}

function addSHPForServiceArea(file){
    scope.cancel();
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (event) {
        var data = reader.result;
        shp(data).then(function(geojson) {
            console.log(geojson);
            myLayers[file.name] = L.geoJSON(geojson, {});
            map.addLayer( myLayers[file.name]);
            var dt=$("#drivetimeShp").val();
            createServiceAreaByGeojson(geojson,dt)

        });


        var str='<li id="'+file.name+'" class="list-group-item" >'+
            '<input onclick="turnLayerOnOf(this,'+"'"+file.name+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+file.name+'</span>' +
            '<img onclick="upLayer(this , \''+file.name+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
            '<img onclick="downLayer(this , \''+file.name+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+file.name+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>'+
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+file.name+"\",\""+'myLayers'+"\")'>"+
            '</li>';
        $("#userLayers").append(str);


    }

}



function addSHPForBuffer(file){
    scope.cancel();
    var reader = new FileReader();
    var buffArray=[]
    reader.readAsArrayBuffer(file);
    reader.onload = function (event) {
        var data = reader.result;
        shp(data).then(function(geojson) {
            console.log(geojson);
            // myLayers[file.name] = L.geoJSON(geojson, {});
            // map.addLayer( myLayers[file.name]);
             var dt=$("#bufferSHP").val();
             for(var i=0;i<geojson.features.length;i++){
                 var point = turf.point(geojson.features[i].geometry.coordinates);
                 var buffered = turf.buffer(point, dt, {units: 'miles'});

                 buffArray.push(buffered);
             }

            //var res = L.polygon(buffered)
           // var res=L.layerGroup(buffArray);
             myLayers['bufferlayer']= L.geoJson(buffArray);
            map.addLayer(myLayers['bufferlayer']);
            //L.geoJson(buffered).addTo(map);


            var str='<li id="'+'bufferlayer'+'" class="list-group-item" >'+
                '<input onclick="turnLayerOnOf(this,'+"'"+'bufferlayer'+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+'bufferlayer'+'</span>' +
                '<img onclick="upLayer(this , \''+'bufferlayer'+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
                '<img onclick="downLayer(this , \''+'bufferlayer'+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
                '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+'bufferlayer'+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
                '<span class="glyphicon glyphicon-minus"></span>' +
                '</button>'+
                "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+'bufferlayer'+"\",\""+'myLayers'+"\")'>"+
                '</li>';
            $("#userLayers").append(str);



        });




    }

}

var lr=0;
function drawBufferOnLayer(){
    var geojson;
    var buffArray=[];

    var dt=$("#bufferlayerRad").val();

    if(selectedLayerName!='') {
        for(var i=0;i<selectedLayerDataArray.length;i++){
            if(selectedLayerDataArray[i].filename==selectedLayerName){
                geojson=selectedLayerDataArray[i].data;
            }
        }


        console.log(JSON.stringify(geojson))
        var file = selectedLayerData;
        // var data='';
        // var reader = new FileReader();
        //
        //
        // reader.readAsText(file);
        // reader.onload = function (event) {
        //      data = JSON.parse(event.target.result);
        // }

        scope.cancel();

        //for (var i = 0; i < geojson.features.length; i++) {
        if(!geojson.features){

            var jsArray=[];
            jsArray.push(geojson)
            var point = turf.featureCollection(jsArray);
        }else {
            var point = turf.featureCollection(geojson.features);
        }
        var buffered = turf.buffer(point, dt, {units: 'miles'});

            buffArray.push(buffered);
        //}

        //var res = L.polygon(buffered)
        // var res=L.layerGroup(buffArray);
        //removeFile(selectedLayerName);
        var bufferedLayerName=selectedLayerName.split('.');
        bufferedLayerName=bufferedLayerName[0]+"Buffer"+lr
        selectedLayerData={"filename":bufferedLayerName,"data":buffered};
        selectedLayerDataArray.push(selectedLayerData);
        myLayers[bufferedLayerName] = L.geoJson(buffArray);
        map.addLayer(myLayers[bufferedLayerName]);
        //L.geoJson(buffered).addTo(map);


        var str = '<li onclick="dataForGeoprocessing('+"'"+bufferedLayerName+"'"+',this)" id="' + bufferedLayerName + '" class="list-group-item selected" >' +
            '<input onclick="turnLayerOnOf(this,' + "'" + bufferedLayerName + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +bufferedLayerName + '</span>' +
            '<img onclick="upLayer(this , \'' + bufferedLayerName + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
            '<img onclick="downLayer(this , \'' + bufferedLayerName + '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + bufferedLayerName + "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + bufferedLayerName + "\",\"" + 'myLayers' + "\")'>" +
            '</li>';
        $("#userLayers").append(str);
        lr++;
    }else{
        alert("please select the layer first");
    }
}

function drawVoronoiOnLayer(){
    var geojson;
    var buffArray=[];


    if(selectedLayerName!='') {
        for(var i=0;i<selectedLayerDataArray.length;i++){
            if(selectedLayerDataArray[i].filename==selectedLayerName){
                geojson=selectedLayerDataArray[i].data;
            }
        }
        var file = selectedLayerData;


        //scope.cancel();

      //  angular.element($("#toolbar_controller")).scope().cancel();

        //for (var i = 0; i < geojson.features.length; i++) {
        var fs = turf.featureCollection(geojson.features);

        if(fs.features[0].geometry.type!="Point"){
            alert("this is not supprted");
            return false;
        }
        // var buffered = turf.buffer(point, dt, {units: 'miles'});

        var options = {
            bbox: turf.bbox(fs)
        };
        //  var points = turf.randomPoint(100, options);
        var voronoiPolygons = turf.voronoi(fs, options);


        //  buffArray.push(voronoiPolygons);
        //}

        //var res = L.polygon(buffered)
        // var res=L.layerGroup(buffArray);
        if(myLayers[selectedLayerName+'_voronoi']){
            removeFile(selectedLayerName+'_voronoi');
        }

        selectedLayerData={"filename":selectedLayerName+'_voronoi',"data":voronoiPolygons};
        selectedLayerDataArray.push(selectedLayerData);

        myLayers[selectedLayerName+'_voronoi'] = L.geoJson(voronoiPolygons);
        map.addLayer(myLayers[selectedLayerName+'_voronoi']);
        //L.geoJson(buffered).addTo(map);


        var str = '<li onclick="dataForGeoprocessing('+"'"+selectedLayerName+'_voronoi'+"'"+',this)" id="' + selectedLayerName +'_voronoi'+ '" class="list-group-item selected" >' +
            '<input onclick="turnLayerOnOf(this,' + "'" + selectedLayerName+'_voronoi' + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +selectedLayerName+'_voronoi' + '</span>' +
            '<img onclick="upLayer(this , \'' + selectedLayerName+'_voronoi' + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
            '<img onclick="downLayer(this , \'' + selectedLayerName +'_voronoi'+ '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + selectedLayerName +'_voronoi'+ "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + selectedLayerName+'_voronoi' + "\",\"" + 'myLayers' + "\")'>" +
            '</li>';
        $("#userLayers").append(str);
    }else{
        alert("please select the layer first");
    }
}








function createServiceAreaByGeojson(geojson,dt){
    map.off('click');
    var gpService = L.esri.GP.service({
        url:"http://202.166.168.183:6080/arcgis/rest/services/GPServices/drive_time_new/GPServer/drive_time",
        useCors:false
    });
    var gpTask = gpService.createTask();
    gpTask.setParam('env:outSR', 4326);
    //var dt=$("#drivetimeGjson").val();
   // gpTask.setParam("Break_Values", "40 60 80");
    gpTask.setParam("Break_Values", dt);


    if(driveTimes!=""){
        driveTimes.clearLayers();
    }

    driveTimes = L.featureGroup();
    map.addLayer(driveTimes);

  //  map.on('click', function(evt){

        driveTimes.clearLayers();
        gpTask.setParam("Facilities", geojson)
        gpTask.run(driveTimeCallbackUploadFile);
   // });
}



function driveTimeCallback(error, response, raw){
  //  document.getElementById('info-pane').innerHTML = 'click on the map to calculate 1 and 2 minute drivetimes';
    res=response;
    map.off('click');
   // L.geoJSON(response.ServiceAreas).addTo(map);

   //  driveTimes= L.vectorGrid.slicer(response.ServiceAreas)
   //  map.addLayer(driveTimes);



    var dtime=mydt.split(' ')

   // driveTimes.addLayer(L.geoJSON(response.ServiceAreas));
    for(var i=0;i<response.Polygons.features.length;i++) {
        if(myLayers[dtime[i]]){
            if(myLayers[dtime[i]]._map!=null) {
                removeFile(dtime[i]);
            }
        }
        myLayers[dtime[i]] =L.geoJSON(response.Polygons.features[i], {
            style: function (feature) {
                console.log(feature);
                switch (feature.id) {
                    case 1 :
                        return {color: "#ff0000", "opacity": 1};
                    case 2 :
                        return {color: "#0000ff", "opacity": 1};
                    case 3 :
                        return {color: "#fffcb0", "opacity": 1};
                }
            }
        });

        map.addLayer( myLayers[dtime[i]]);
        $(".loader").hide();

        var str = '<li id="' + dtime[i] + '" class="list-group-item" >' +
            '<input onclick="turnLayerOnOf(this,' + "'" +dtime[i] + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +dtime[i] +"min"+ '</span>' +
            '<img onclick="upLayer(this , \'' + dtime[i] + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
            '<img onclick="downLayer(this , \'' + dtime[i] + '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + dtime[i] + "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + dtime[i] + "\",\"" + 'myLayers' + "\")'>" +
            '</li>';
        $("#userLayers").append(str);

     //  console.log(JSON.stringify(response.Polygons.features[i].geometry));
     //    $.ajax({
     //        url: "services/redlining.php",
     //        //?geom=" + JSON.stringify(response.Polygons.features[i].geometry),
     //        type: "POST",
     //        dataType: "json",
     //        data: {"geom":JSON.stringify(response.Polygons.features[i].geometry)},
     //        contentType: "application/json; charset=utf-8",
     //        success: function callback(response1) {
     //            if (!response1[0]) {
     //                alertify.error("Record Not Found....");
     //            } else {
     //                // alert(response);
     //                // rightScope.layerInfos = response[0];
     //                // rightScope.$apply();
     //                var idIW = L.popup();
     //                var content = '<table class="table table-striped table-bordered table-responsive" flex>' +
     //                    '<tr>' +
     //                    '<td >Population</td><td ng-switch-default>' + Math.round(response1[0].population) + '</td>' +
     //                    '</tr>' +
     //                    '</table>';
     //                idIW.setContent(content);
     //                idIW.setLatLng(myLayers[dtime[i]].getBounds().getCenter()); //calculated based on the e.layertype
     //                idIW.openOn(map);
     //                myLayers[dtime[i]].bindPopup(content, {
     //                    minWidth : 300
     //                });
     //            }
     //        }
     //    });






    }

    // for(var i=0;i<3;i++){
    //     $.post( "services/redlining.php",{"geom":JSON.stringify(response.Polygons.features[i].geometry)}, function(response1) {
    //         if (!response1[0]) {
    //             alertify.error("Record Not Found....");
    //         } else {
    //             // alert(response);
    //             // rightScope.layerInfos = response[0];
    //             // rightScope.$apply();
    //             var idIW = L.popup();
    //             var content = '<table class="table table-striped table-bordered table-responsive" flex>' +
    //                 '<tr>' +
    //                 '<td >Population</td><td ng-switch-default>' + Math.round(response1[0].population) + '</td>' +
    //                 '</tr>' +
    //                 '</table>';
    //             idIW.setContent(content);
    //             idIW.setLatLng(myLayers[dtime[i]].getBounds().getCenter()); //calculated based on the e.layertype
    //             idIW.openOn(map);
    //             myLayers[dtime[i]].bindPopup(content, {
    //                 minWidth : 300
    //             });
    //         }
    //     })
    //         .fail(function() {
    //             alert( "error" );
    //         })
    // }

    addpopUpToServiceArea(response,dtime)

    //  addLayerToToc(file.name , vectorGrid);
  //  driveTimes.addLayer(L.geoJSON(response.Output_Drive_Time_Polygons));

}

var recurrionIndex=0;
function addpopUpToServiceArea(response,dtime){
    $.post( "services/redlining.php",{"geom":JSON.stringify(response.Polygons.features[recurrionIndex].geometry)}, function(response1) {
        if (!response1[0]) {
            alertify.error("Record Not Found....");
        } else {
            // alert(response);
            // rightScope.layerInfos = response[0];
            // rightScope.$apply();
            var idIW = L.popup();
            var content = '<table class="table table-striped table-bordered table-responsive" flex>' +
                '<tr>' +
                '<td >Population</td><td ng-switch-default>' + Math.round(response1[0].population) + '</td>' +
                '</tr>' +
                '</table>';
            idIW.setContent(content);
            idIW.setLatLng(myLayers[dtime[recurrionIndex]].getBounds().getCenter()); //calculated based on the e.layertype
            idIW.openOn(map);
            myLayers[dtime[recurrionIndex]].bindPopup(content, {
                minWidth : 300
            });
            recurrionIndex++;
            if(recurrionIndex <3){
                addpopUpToServiceArea(response,dtime);

            }

        }
    })
        .fail(function() {
            alert( "error" );
        })
}



function driveTimeCallbackUploadFile(error, response, raw){
    //  document.getElementById('info-pane').innerHTML = 'click on the map to calculate 1 and 2 minute drivetimes';
    res=response;
    // L.geoJSON(response.ServiceAreas).addTo(map);

    //  driveTimes= L.vectorGrid.slicer(response.ServiceAreas)
    //  map.addLayer(driveTimes);

    // driveTimes.addLayer(L.geoJSON(response.ServiceAreas));
    myLayers['mydriveTime']=driveTimes.addLayer(L.geoJSON(response.Polygons,{
        style:function(feature){
            console.log(feature);
            switch (feature.id) {
                case 1 : return {color: "#ff0000","opacity": 1};
                case 2 :   return {color: "#0000ff","opacity": 1};
                case 3 :   return {color: "#fffcb0","opacity": 1};
            }
        }
    }));

    var str='<li id="'+'mydriveTime'+'" class="list-group-item" >'+
        '<input onclick="turnLayerOnOf(this,'+"'"+'mydriveTime'+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+'mydriveTime'+'</span>' +
        '<img onclick="upLayer(this , \''+'mydriveTime'+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
        '<img onclick="downLayer(this , \''+'mydriveTime'+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
        '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+'mydriveTime'+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
        '<span class="glyphicon glyphicon-minus"></span>' +
        '</button>'+
        "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+'mydriveTime'+"\",\""+'myLayers'+"\")'>"+
        '</li>';
    $("#userLayers").append(str);
    //  addLayerToToc(file.name , vectorGrid);
    //  driveTimes.addLayer(L.geoJSON(response.Output_Drive_Time_Polygons));

}


var rtCtrl=false;
var routingControl='';
function routingApp(){

if(rtCtrl==false) {
    //  routingControl = L.Routing.control({
    //     // waypoints: [
    //     //     L.latLng(57.74, 11.94),
    //     //     L.latLng(57.6792, 11.949)
    //     // ],
    //     // waypoints:waypointsArray,
    //     router: L.Routing.esri({
    //         liveTraffic: true,
    //         profile: 'Driving',
    //         serviceUrl: 'http://202.166.168.183:6080/arcgis/rest/services/NetworkAnalysis/PB_irisportal_pg31_networkanalysis_v_04012018/NAServer/Route'
    //     }),
    //     geocoder: L.Control.Geocoder.nominatim(),
    //     routeWhileDragging: true
    //     //   reverseWaypoints: true
    // }).addTo(map);

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

    if(graticule==true) {
        $('#graticules').removeAttr('style');
        graticuleObj.removeFrom(map);
        graticule = false;
    }

    if(dc==true){
        polygonDrawer.disable();
        dc=false;
        $('#drawPolygon').removeAttr( 'style' );
        $('#drawParcelPolygon').removeAttr( 'style' );

    }

    $('#routings').css({'background-color': '#2196F3'});
    $('#routings').css({'color': 'snow'});

    routingControl=L.Routing.control({
        // waypoints: [
        //     L.latLng(57.74, 11.94),
        //     L.latLng(57.6792, 11.949)
        // ],
        geocoder: L.Control.Geocoder.nominatim(),
        routeWhileDragging: true,
        reverseWaypoints: true,
        showAlternatives: true,
        altLineOptions: {
            styles: [
                {color: 'black', opacity: 0.15, weight: 9},
                {color: 'white', opacity: 0.8, weight: 6},
                {color: 'blue', opacity: 0.5, weight: 2}
            ]
        }
    }).addTo(map);
    rtCtrl=true;
}else{
    $('#routings').removeAttr( 'style' );
    map.removeControl(routingControl);
    rtCtrl=false;
}

}
var redliningDrawControl=''
var dc=false;
var bounds='';
var outerArray=[];


setTimeout(function(){
//     var drawPolygonButton = document.getElementById('drawPolygon');
//
//     drawPolygonButton.addEventListener('click', function(){
//         currentPolygon = new L.polygon([]).addTo(map);
//         map.on('click', addLatLngToPolygon); //Listen for clicks on map.
//     });

     polygonDrawer = new L.Draw.Polygon(map);

    $('#drawPolygon').click(function() {
        toolName='';
        if(dc==false){
            polygonDrawer.enable();
           // map.removeControl(styleEditor);

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

            if(graticule==true) {
                $('#graticules').removeAttr('style');
                graticuleObj.removeFrom(map);
                graticule = false;
            }

            if(rtCtrl==true){
                $('#routings').removeAttr( 'style' );
                map.removeControl(routingControl);
                rtCtrl=false;
            }if(sc==true){
                sc=false;
                polylineDrawer.disable();
                $('#sc').removeAttr( 'style' );
            }


            dc=true;
            $('#drawParcelPolygon').removeAttr( 'style' );
            $('#drawPolygon').css({'background-color': '#2196F3'});
            $('#drawPolygon').css({'color': 'snow'});
        }else {
            polygonDrawer.disable();
            dc=false;
            $('#drawPolygon').removeAttr( 'style' );
        }
    });

    map.on(L.Draw.Event.CREATED, function(event) {
        if(dc==true) {
            var layer = event.layer.toGeoJSON();

            var newLayer = event.layer;

            // label = new L.Label()
            // label.setContent("static label")
            // label.setLatLng(event.layer.getBounds().getCenter())
            // map.showLabel(label);

            if(toolName=='drawParcelPolygon'){
                $.ajax({
                    url: "services/parcel_calculator.php?geom=" + JSON.stringify(layer.geometry),
                    type: "GET",
                    dataType: "json",
                    //data: JSON.stringify(geom,layer.geometry),
                    contentType: "application/json; charset=utf-8",
                    success: function callback(response) {
                        if (!response[0]) {
                            alertify.error("Record Not Found....");
                        } else {
                           // alert(response);
                            // rightScope.layerInfos = response[0];
                            // rightScope.$apply();
                            var idIW = L.popup();
                            var content = '<table class="table table-striped table-bordered table-responsive" flex>'+
                                    '<th >Landuse</th>'+
                                '<th >Count</th>';
                            for(var i=0;i<response.length;i++) {
                                content=content+'<tr>' +
                                '<td ng-switch-default>' + response[i].coalesce + '</td>' +
                                    '<td ng-switch-default>' + response[i].count + '</td>' +
                                    '</tr>';
                            }
                            content=content+'</table>';
                            idIW.setContent(content);
                            idIW.setLatLng(event.layer.getBounds().getCenter()); //calculated based on the e.layertype
                            idIW.openOn(map);

                            newLayer.bindPopup(content, {
                                minWidth : 300
                            });
                        }
                    }
                });

            }else {
                $.ajax({
                    url: "services/redlining.php?geom=" + JSON.stringify(layer.geometry),
                    type: "GET",
                    dataType: "json",
                    //data: JSON.stringify(geom,layer.geometry),
                    contentType: "application/json; charset=utf-8",
                    success: function callback(response) {
                        if (!response[0]) {
                            alertify.error("Record Not Found....");
                        } else {
                            // alert(response);
                            // rightScope.layerInfos = response[0];
                            // rightScope.$apply();
                            var idIW = L.popup();
                            var content = '<table class="table table-striped table-bordered table-responsive" flex>' +
                                '<tr>' +
                                '<td >Population</td><td ng-switch-default>' + Math.round(response[0].population) + '</td>' +
                                '</tr>' +
                                '</table>';
                            idIW.setContent(content);
                            idIW.setLatLng(event.layer.getBounds().getCenter()); //calculated based on the e.layertype
                            idIW.openOn(map);
                            newLayer.bindPopup(content, {
                                minWidth : 300
                            });
                        }
                    }
                });
            }
        }

    });


        $('#drawParcelPolygon').click(function() {
            toolName='drawParcelPolygon';
            if(dc==false){
                polygonDrawer.enable();
                // map.removeControl(styleEditor);

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

                if(graticule==true) {
                    $('#graticules').removeAttr('style');
                    graticuleObj.removeFrom(map);
                    graticule = false;
                }

                if(rtCtrl==true){
                    $('#routings').removeAttr( 'style' );
                    map.removeControl(routingControl);
                    rtCtrl=false;
                }if(sc==true){
                    sc=false;
                    polylineDrawer.disable();
                    $('#sc').removeAttr( 'style' );
                }

                // if(rtCtrl==true){
                //     $('#routings').removeAttr( 'style' );
                //     map.removeControl(routingControl);
                //     rtCtrl=false;
                // }


                dc=true;
                $('#drawPolygon').removeAttr( 'style' );
                $('#drawParcelPolygon').css({'background-color': '#2196F3'});
                $('#drawParcelPolygon').css({'color': 'snow'});
            }else {
                polygonDrawer.disable();
                dc=false;
                $('#drawParcelPolygon').removeAttr( 'style' );
            }
        });

        // map.on(L.Draw.Event.CREATED, function(event) {
        //     if(dc==true) {
        //         var layer = event.layer.toGeoJSON();
        //
        //
        //         // label = new L.Label()
        //         // label.setContent("static label")
        //         // label.setLatLng(event.layer.getBounds().getCenter())
        //         // map.showLabel(label);
        //
                        //     }
        //
        // });

        // for(var i=0;i<layer._bounds;i++){
        //     if(i==0){
        //          innerArray.push(layer._bounds[i]._northEast.lat);
        //         innerArray.push(layer._bounds[i]._northEast.lon);
        //     }
        //     if(i==1){
        //         innerArray.push(layer._bounds[i]._southWest.lat);
        //         innerArray.push(layer._bounds[i]._southWest.lon);
        //     }
        //
        //     outerArray.push(innerArray);
        // }

       // alert(layer);


    // map.on('draw:created', function (e) {
    //     var type = e.layerType,
    //         layer = e.layer;
    //     layer.addTo(map);
    // });

    document.getElementById('geotiff').addEventListener('change', function (event) {
        var files = event.target.files;

        var  reader = new FileReader();

        reader.onload = function (e) {

            // console.log(e.target.result);
            var res = parse_georaster(e.target.result);
            res.then(function(value) {
                // console.log(value);
                 myLayers['georaster'] = new GeoRasterLayer({
                    georaster: value,
                    opacity: 0.7
                });


                myLayers['georaster'].addTo(map);

                map.fitBounds( myLayers['georaster'].getBounds());

                var str='<li id="'+'georaster'+'" class="list-group-item" >'+
                    '<input onclick="turnLayerOnOf(this,'+"'"+'georaster'+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+'georaster'+'</span>' +
                    '<img onclick="upLayer(this , \''+'georaster'+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
                    '<img onclick="downLayer(this , \''+'georaster'+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
                    '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+'georaster'+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
                    '<img src="images/remove.png" />' +
                    '</button>'+
                    "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+'mydriveTime'+"\",\""+'myLayers'+"\")'>"+
                    '</li>';
                $("#userLayers").append(str);

            })

        }

        // Read the file
        reader.readAsArrayBuffer(files[0]);


    }, false);


},3000)



// function addLatLngToPolygon(clickEventData){
//     currentPolygon.addLatLng(clickEventData.latlng);
// }


// map.on('draw:created', function (e) {
//     var type = e.layerType,
//         layer = e.layer;
//
//     // Do whatever you want with the layer.
//     // e.type will be the type of layer that has been draw (polyline, marker, polygon, rectangle, circle)
//     // E.g. add it to the map
//     layer.addTo(map);
// });


// function drawPolygonRedlining(){
//     var drawnItems = L.featureGroup().addTo(map);
//     if(dc==false) {
//         map.removeControl(styleEditor);
//         redliningDrawControl = new L.Control.Draw({
//             position: 'topright',
//             draw: {
//                 circle: false,
//                 rectangle: true,
//                 polyline: false,
//                 polygon: true,
//                 marker: false,
//                 circlemarker: false
//
//             },
//             edit: {featureGroup: drawnItems, edit: false}
//         }).addTo(map);
//         dc=true;
//     }else{
//         map.removeControl(redliningDrawControl);
//         drawnItems.remove();
//       dc=false;
//     }
// }


//var bufferLayer=L.layerGroup().addTo(map);
var bufferLayersDraw=[];



var sBfP;
var layerdrawnFrombbox;
function drawSpBuffer(rad,lId,url){
    if(layerdrawnFrombbox){
        map.removeLayer(layerdrawnFrombbox)
    }
    if(sBfP){
        map.removeLayer(sBfP)
    }
    map.off('click');
    map.on('click', function (e){

        var pointArray=[];
        pointArray.push(e.latlng.lng);
        pointArray.push(e.latlng.lat);
        var point = turf.point(pointArray);

        if(myLayers['bufferlayer']) {
            removeFile('bufferlayer');
        }


        var bufferPoint=turf.buffer(point, rad, {units: 'kilometers'});


        sBfP=L.geoJson(bufferPoint);
        sBfP.addTo(map);

        var lg=sBfP.toGeoJSON();
        var bbox=turf.bbox(lg);
        var ar1=[];
        var ar2=[];
        var finalArr=[];
        ar1.push(bbox[1]);
        ar1.push(bbox[0]);
        ar2.push(bbox[3]);
        ar2.push(bbox[2]);
        finalArr.push(ar1);
        finalArr.push(ar2);

        var bounds = L.latLngBounds(finalArr);

        var service = L.esri.mapService({
           // url: 'http://172.20.81.131:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer'
            url:url
        });

        service.query()
            .layer(lId)
            .within(bounds)
            .run(function(error, featureCollection, response){
              //  console.log(featureCollection);



                // alert(featureCollection.features.length);
                layerdrawnFrombbox=L.geoJson(featureCollection);
                var content='<table class="table table-striped table-bordered table-responsive" flex><tr><td>Features Count</td><td>'+featureCollection.features.length+'</td></tr></table>';
                layerdrawnFrombbox.bindPopup(content, {
                    minWidth : 300
                }).addTo(map);

                layerdrawnFrombbox.on('mouseover', function(e) {
                    //open popup;
                    var popup = L.popup()
                        .setLatLng(e.latlng)
                        .setContent(content)
                        .openOn(map);
                });


                map.addLayer(layerdrawnFrombbox);
             //   map.removeLayer(sBfP);
            });


        map.off('click');

    })
}





var pop_ly=1;

function drawBufferPopulation(rad){
    map.off('click');
    map.on('click', function (e){
        //alert(e);
        var pointArray=[];
        pointArray.push(e.latlng.lng);
        pointArray.push(e.latlng.lat);
        var point = turf.point(pointArray);



        var bufferPoint=turf.buffer(point, rad, {units: 'kilometers'});

        var popLayer=L.geoJson(bufferPoint);
        myLayers['bufferlayer'+pop_ly]=popLayer.addTo(map);



        $.ajax({
            url: "services/redlining.php?geom=" + JSON.stringify(bufferPoint.geometry),
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                if (!response[0]) {
                    alertify.error("Record Not Found....");
                } else {
                    // alert(response);
                    // rightScope.layerInfos = response[0];
                    // rightScope.$apply();
                    var idIW = L.popup();
                    var content = '<table class="table table-striped table-bordered table-responsive" flex>' +
                        '<tr>' +
                        '<td >Population</td><td ng-switch-default>' + Math.round(response[0].population) + '</td>' +
                        '</tr>' +
                        '</table>';
                    idIW.setContent(content);
                    idIW.setLatLng(popLayer.getBounds().getCenter()); //calculated based on the e.layertype
                    idIW.openOn(map);
                    popLayer.bindPopup(content, {
                        minWidth : 300
                    });
                }
            }
        });

        var str='<li  id="'+'bufferlayer'+pop_ly+'" class="list-group-item" >'+
            '<input onclick="turnLayerOnOf(this,'+"'"+'bufferlayer'+pop_ly+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+'bufferlayer'+pop_ly+'</span>' +
            '<img onclick="upLayer(this , \''+'bufferlayer'+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
            '<img onclick="downLayer(this , \''+'bufferlayer'+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+'bufferlayer'+pop_ly+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>'+
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+'bufferlayer'+pop_ly+"\",\""+'myLayers'+"\")'>"+
            '</li>';
        $("#userLayers").append(str);


        map.off('click');

    })
}


function drawBuffer(rad){
    map.off('click');
    map.on('click', function (e){
        //alert(e);
        var pointArray=[];
        pointArray.push(e.latlng.lng);
        pointArray.push(e.latlng.lat);
        var point = turf.point(pointArray);

        // if(myLayers['bufferlayer']){
        //     if(myLayers['bufferlayer']._map!=null) {
        //         removeFile('bufferlayer');
        //         bufferLayersDraw=[]
        //     }
        // }
       // myLayers['bufferlayer']=  L.geoJson(turf.buffer(point, rad, {units: 'kilometers'}));
        if(myLayers['bufferlayer']) {
            removeFile('bufferlayer');
        }



        var bufferPoint=turf.buffer(point, rad, {units: 'kilometers'});
        selectedLayerData={"filename":'bufferlayer',"data":bufferPoint};
        selectedLayerDataArray.push(selectedLayerData);

        bufferLayersDraw.push(L.geoJson(bufferPoint));
        myLayers['bufferlayer']=L.layerGroup(bufferLayersDraw).addTo(map);


       // map.addLayer(myLayers['bufferlayer']);
        //L.geoJson(buffered).addTo(map);


        var str='<li onclick="dataForGeoprocessing('+"'"+'bufferlayer'+"'"+',this)" id="'+'bufferlayer'+'" class="list-group-item" >'+
            '<input onclick="turnLayerOnOf(this,'+"'"+'bufferlayer'+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+'bufferlayer'+'</span>' +
            '<img onclick="upLayer(this , \''+'bufferlayer'+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
            '<img onclick="downLayer(this , \''+'bufferlayer'+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile('+"'"+'bufferlayer'+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>'+
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+'bufferlayer'+"\",\""+'myLayers'+"\")'>"+
            '</li>';
        $("#userLayers").append(str);
        map.off('click');

    })
}



var glayer;


var myStyle = {
    radius: 12,
    fillColor: " #00FFFFFFF",
    color: "#0090a8",
    weight: 5,
    opacity: 1,
    fillOpacity: 0.1
};



// function query_by_nid(layer_id,search_perm){
//
//     if (layer_id== 8) {
//         var name = "gid ='" + search_perm + "'";
//     }else if (layer_id== 7) {
//         var name = "district_name  ='" + search_perm+ "'";
//     }else if(layer_id== 6){
//         var name = "tehsil_name  ='" + search_perm + "'";
//     }else if(layer_id== 5){
//         var name = "mauza  ='" + search_perm + "'";
//     }
//
//
//
//     L.esri.query({
//         url: "http://202.166.168.183:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/"+layer_id
//
//     }).where(name).run(function(error, result){
//         // draw result on the map
//         if(typeof glayer != 'undefined'){
//             glayer.clearLayers();
//         };
//
//         glayer = L.geoJson(result,{ style: myStyle}).addTo(map);
//
//
//
//         // fit map to boundry
//         map.fitBounds(glayer.getBounds());
//
//     });
//
// };


function query_by_nid(layer_id,search_perm,third) {


    if(third!='filter'){
    if (layer_id == 9) {
        var name = "gid ='" + search_perm + "'";
    } else if (layer_id == 8) {
        var name = "district_name  ='" + search_perm + "'";
    } else if (layer_id == 7) {
        var name = "tehsil_name  ='" + search_perm + "'";
    } else if (layer_id == 6) {
        var name = "mauza  ='" + search_perm + "'";
    } else if (layer_id == 4) {
        var name = "uc_name  ='" + search_perm + "'";
    } else if (layer_id == 3) {
        var name = "ward_no  ='" + search_perm + "' and uc_name='" + third + "'";
    }

    }else{
        var name=search_perm;
    }





   // var qu= L.esri.query({
   //      url: "http://202.166.168.183:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/"+layer_id
   //
   //  })
   //      qu.where("district='Bahawalpur'");
   //      qu.run(function(error, result){
   //      // draw result on the map
   //      if(typeof glayer != 'undefined'){
   //          glayer.clearLayers();
   //      };
   //
   //      glayer = L.geoJson(result,{ style: myStyle}).addTo(map);
   //
   //
   //
   //      // fit map to boundry
   //      map.fitBounds(glayer.getBounds());
   //
   //  });



    L.esri.query({
        url: "http://202.166.168.183:6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_v_02112017/MapServer/"+layer_id
    }).where(name).run(function(error, neighborhoods){
        // draw neighborhood on the map
        if(typeof glayer != 'undefined'){
            glayer.clearLayers();
        };

        glayer = L.geoJson(neighborhoods,{ style: myStyle}).addTo(map);



        // fit map to boundry
        map.fitBounds(glayer.getBounds());

    });

};


function query_by_nid_new(layer_id,search_perm){

    if (layer_id== 12) {
        var name = "gid ='" + search_perm + "'";
    }else if(layer_id== 11){
            var name = "gid ='" + search_perm + "'";
    }





    L.esri.query({
        url: "http://"+ipAddress+":6080/arcgis/rest/services/Punjab/PB_irisportal_pg31_misc_query_v_05032018/MapServer/"+layer_id

    }).where(name).run(function(error, result){
        // draw result on the map
        if(typeof glayer != 'undefined'){
            glayer.clearLayers();
        };

        glayer = L.geoJson(result,{ style: myStyle}).addTo(map);



        // fit map to boundry
        map.fitBounds(glayer.getBounds());

    });

};


function manualPrint () {
    printer.printMap('CurrentSize', 'MyManualPrint')
}

var myLayerName='';
var myTehsilId;

function calculateStatistics(layerName){

    myLayerName=layerName;

    var contents = '<div class="row">' +
        '<div class="col-md-4" style="border-right:grey 1px solid;height: 100%;">' +
        '<div class="form-group">'+
        '<label for="division">Division</label>'+
        '<select class="form-control" onchange="selectDiv(this.value)" id="graph_division">'+
        '</select>'+
        '</div>' +
        '<div class="form-group">'+
        '<label for="district">District</label>'+
        '<select class="form-control" onchange="selectDist(this.value)" id="graph_district">'+
        '</select>'+
        '</div>' +
        '<div class="form-group">'+
        '<label for="division">Tehsil</label>'+
        '<select class="form-control" onchange="selectTeh(this.value)" id="graph_Tehsil">'+
        '</select>'+
        '</div>' +
        '<label class="radio-inline"><input type="radio" name="hirarchy" value="Revenue">Revenue</label>'+
        '<label class="radio-inline"><input type="radio" name="hirarchy" value="Local">Local</label>'+
        '<div class="desc" id="Revenue">'+
        '<div class="form-group">'+
        '<label for="qanoon">Qanoongoi</label>'+
        '<select class="form-control" onchange="selectQG(this.value)" id="graph_qanoon">'+
        '</select>'+
        '</div>' +
        // '<div class="form-group">'+
        // '<label for="moza">Mauza</label>'+
        // '<select class="form-control" id="graph_moza">'+
        // '</select>'+
        // '</div>' +
        // '<div class="form-group">'+
        // '<label for="moza">Khsra</label>'+
        // '<select class="form-control" id="graph_khsra">'+
        // '</select>'+
        // '</div>' +
        '</div>' +
        '<div class="desc" id="Local">'+
        '<div class="form-group">'+
        '<label for="uc">UC</label>'+
        '<select class="form-control" onchange="selectUc(this.value)" id="graph_uc">'+
        '</select>'+
        '</div>' +
        // '<div class="form-group">'+
        // '<label for="ward">WARD</label>'+
        // '<select class="form-control" onchange="selectWard(this.value)" id="graph_ward">'+
        // '</select>'+
        // '</div>' +
        '</div>'+
        '</div>'+

        '<div class="col-md-8">'+
        // "<div class='btn-group btn-group-justified' role='group' aria-label='Justified button group'>" +
        // "<div class='btn-group' role='group'><button type='button' class='btn btn-default'>Division</button></div>" +
        // "<div class='btn-group' role='group'><button type='button' class='btn btn-default'>District</button></div>" +
        // "<div class='btn-group' role='group'><button type='button' class='btn btn-default' onclick='set_content()'>Tehsil</button></div>" +
        // "</div>"+
         "<div id='container' style='min-width: 310px; height: 400px; margin: 10px auto'></div>" +
        "</div>" +
        "</div>";

  //  ].join('');

     dialog = L.control.dialog({size:[700,500]})
        .setContent(contents)
        .addTo(map);


    $("div.desc").hide();
    $("input[name$='hirarchy']").click(function() {
        var test = $(this).val();
        if(test=='Revenue'){
            createStatictics(myLayerName,3,myTehsilId)
        }else{
            createStatictics(myLayerName,5,myTehsilId)
        }
        $("div.desc").hide();
        $("#" + test).show();
    });


    $('.leaflet-control-dialog-close').click(function(){
        map.removeControl(dialog);
       // dialog.removeFrom(map);
//        map.removeLayer(dialog);
    });

    var str='<option></option>';
    for(var i=0;i<allAdminData.division.length;i++){
        str=str+"<option value='"+allAdminData.division[i].gid+"'>"+allAdminData.division[i].division_name+"</option>"
    }

    $("#graph_division").html(str);

    createStatictics(myLayerName,0,0)

}




function selectDiv(id){
    createStatictics(myLayerName,1,id)
    var str='<option></option>';
    for(var i=0;i<allAdminData.district.length;i++){
        if(allAdminData.district[i].division_id==id) {
            str=str+"<option value='"+allAdminData.district[i].gid+"'>"+allAdminData.district[i].district_name+"</option>"
        }

    }

    $("#graph_district").html(str);


}

function selectDist(id){
    createStatictics(myLayerName,2,id)
    var str='<option></option>';
    for(var i=0;i<allAdminData.teh.length;i++){
        if(allAdminData.teh[i].district_id==id) {
            str=str+"<option value='"+allAdminData.teh[i].gid+"'>"+allAdminData.teh[i].tehsil_name+"</option>"
        }

    }

    $("#graph_Tehsil").html(str);


}


function selectTeh(id){
    myTehsilId=id;
  //  createStatictics(myLayerName,3,id)
    var str='<option></option>';
    var str1='<option></option>';

    for(var i=0;i<allAdminData.qg.length;i++){
        if(allAdminData.qg[i].tehsil_id==id) {
            str=str+"<option value='"+allAdminData.qg[i].gid+"'>"+allAdminData.qg[i].qg+"</option>"
        }

    }

    for(var i=0;i<allAdminData.uc.length;i++){
        if(allAdminData.uc[i].tehsil_id==id) {
            str=str+"<option value='"+allAdminData.uc[i].uc_no+"'>"+allAdminData.uc[i].uc_name+"</option>"
        }

    }

    $("#graph_qanoon").html(str);
    $("#graph_uc").html(str);


}


function selectUc(id){
    createStatictics(myLayerName,6,id)
    var str='<option></option>';
    for(var i=0;i<allAdminData.ward.length;i++){
        if(allAdminData.ward[i].uc_no==id) {
            str=str+"<option value='"+allAdminData.ward[i].gid+"'>"+allAdminData.ward[i].ward_no+"</option>"
        }

    }

    $("#graph_ward").html(str);


}

function selectQG(id){
    createStatictics(myLayerName,4,id)

}






function set_content(param_data,tbl_name){
    //param_data=[{"tehsil":"18-Hazari","count":87},{"tehsil":"Ahmad Pur Sial","count":80},{"tehsil":"Ahmed Pur East","count":39},{"tehsil":"Ali Pur","count":107},{"tehsil":"Arifwala","count":44},{"tehsil":"Attock","count":6},{"tehsil":"Bahawalnagar","count":26},{"tehsil":"Bhakkar","count":20},{"tehsil":"Bhalwal","count":17},{"tehsil":"Bhera","count":1},{"tehsil":"Bhowana","count":26},{"tehsil":"Burewala","count":41},{"tehsil":"Chak Jhumra","count":3},{"tehsil":"Chakwal","count":26},{"tehsil":"Chichawatni","count":58},{"tehsil":"Chiniot","count":18},{"tehsil":"Chishtian","count":59},{"tehsil":"Choa Saidan Shah","count":35},{"tehsil":"Choubara","count":46},{"tehsil":"Chunian","count":58},{"tehsil":"D.G.Khan","count":25},{"tehsil":"Darya Khan","count":54},{"tehsil":"DASKA","count":54},{"tehsil":"De-Excluded Area","count":90},{"tehsil":"De-Excluded Area","count":69},{"tehsil":"Depalpur","count":86},{"tehsil":"Dina","count":17},{"tehsil":"Dunyapur","count":40},{"tehsil":"Fateh Jang","count":43},{"tehsil":"Ferozewala","count":20},{"tehsil":"Fort Abbas","count":116},{"tehsil":"Gojra","count":13},{"tehsil":"Gujar Khan","count":60},{"tehsil":"Gujrat","count":42},{"tehsil":"Hafizabad","count":4},{"tehsil":"Haroonabad","count":100},{"tehsil":"Hasanabdal","count":28},{"tehsil":"Hasil Pur","count":18},{"tehsil":"Hazro","count":19},{"tehsil":"Isakhel","count":9},{"tehsil":"Jahanian","count":134},{"tehsil":"Jalalpur Pir Wala","count":180},{"tehsil":"Jampur","count":1},{"tehsil":"Jand","count":61},{"tehsil":"Jaranwala","count":26},{"tehsil":"Jatoi","count":84},{"tehsil":"Jhang","count":24},{"tehsil":"Jhelum","count":20},{"tehsil":"Kabirwala","count":35},{"tehsil":"Kahuta","count":17},{"tehsil":"Kallar Kahar","count":40},{"tehsil":"Kallar Syedan","count":30},{"tehsil":"Kallur Kot","count":44},{"tehsil":"Kamalia","count":61},{"tehsil":"Kamoke","count":69},{"tehsil":"Karor","count":29},{"tehsil":"Kasur","count":23},{"tehsil":"Kehror Pacca","count":52},{"tehsil":"Khairpur Tamewali","count":31},{"tehsil":"Khan Pur","count":93},{"tehsil":"Khanewal","count":108},{"tehsil":"Kharian","count":102},{"tehsil":"Khushab","count":27},{"tehsil":"Kot Addu","count":17},{"tehsil":"Kot Chutta","count":60},{"tehsil":"Kot Momin","count":34},{"tehsil":"Kot Radha Kishan","count":115},{"tehsil":"Kotali Sattian","count":10},{"tehsil":"Lalian","count":6},{"tehsil":"Lawa","count":67},{"tehsil":"Layyah","count":3},{"tehsil":"Liaquat Pur","count":103},{"tehsil":"Lodhran","count":13},{"tehsil":"Mailsi","count":87},{"tehsil":"Malakwal","count":61},{"tehsil":"Mandi Bahaudin","count":29},{"tehsil":"Mankera","count":34},{"tehsil":"Mian Channu","count":79},{"tehsil":"Mianwali","count":33},{"tehsil":"Minchinabad","count":1},{"tehsil":"Multan Saddar","count":115},{"tehsil":"Muridke","count":1},{"tehsil":"Murree","count":6},{"tehsil":"Muzaffargarh","count":62},{"tehsil":"Nankana Sahib","count":21},{"tehsil":"Narowal","count":28},{"tehsil":"Naushera","count":2},{"tehsil":"Noor Pur Thal","count":37},{"tehsil":"Nowshera Virkan","count":83},{"tehsil":"Okara","count":1},{"tehsil":"Pakpattan","count":11},{"tehsil":"PASRUR","count":102},{"tehsil":"Pattoki","count":91},{"tehsil":"Phalia","count":50},{"tehsil":"Pind Dadan Khan","count":41},{"tehsil":"Pindi Bhattian","count":38},{"tehsil":"Pindi Gheb","count":49},{"tehsil":"Piplan","count":42},{"tehsil":"Pir Mahal","count":82},{"tehsil":"Quaid Abad","count":36},{"tehsil":"Rahim Yar Khan","count":68},{"tehsil":"Rajanpur","count":33},{"tehsil":"Rawalpindi","count":84},{"tehsil":"Renala Khurd","count":51},{"tehsil":"Rojhan","count":54},{"tehsil":"Saddar","count":140},{"tehsil":"Saddar","count":1},{"tehsil":"Saddar","count":40},{"tehsil":"Sadiq Abad","count":20},{"tehsil":"Safdarabad","count":89},{"tehsil":"Sahiwal","count":132},{"tehsil":"Sahiwal","count":15},{"tehsil":"SAMBRIAL","count":111},{"tehsil":"Samundari","count":105},{"tehsil":"Sangla Hill","count":1},{"tehsil":"Sarai Alamgir","count":108},{"tehsil":"Sargodha","count":65},{"tehsil":"Shah Kot","count":11},{"tehsil":"Shah Pur Sadar","count":145},{"tehsil":"Shakargarh","count":97},{"tehsil":"Sharaqpur","count":37},{"tehsil":"Sheikhupura","count":45},{"tehsil":"Shorkot","count":53},{"tehsil":"Shujabad","count":161},{"tehsil":"SIALKOT","count":24},{"tehsil":"Silanwali","count":109},{"tehsil":"Sohawa","count":6},{"tehsil":"Talagang","count":60},{"tehsil":"Tandlian Wala","count":83},{"tehsil":"Taunsa Sharif","count":1},{"tehsil":"Taxila","count":118},{"tehsil":"Toba Tek Singh","count":28},{"tehsil":"Vehari","count":28},{"tehsil":"Wazirabad","count":19},{"tehsil":"Yazman","count":70},{"tehsil":"Zafarwal","count":9}];
    var name=tbl_name;
    var category =[];
    var data =[];
    for(var i = 0 ; i<param_data.length;i++){
        category.push(param_data[i].lvl_name);
        data.push(parseInt(param_data[i].val));
    }
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: name+'  Distribution'
        },
        xAxis: {
            categories:category ,
            crosshair: true,
            type: 'text',
            labels: {
                overflow: 'justify'
            },
            startOnTick: true,
            showFirstLabel: true,
            endOnTick: true,
            showLastLabel: true,
             tickInterval: 10, 
            labels: {
                rotation: -45,
                 align: 'left', 
                //step: 2,
                enabled: true
            },
            style: {
                fontSize: '2px',
                fontFamily: 'Verdana, sans-serif'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count'
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: name[1],
            data: data
        }]
    });
}
function createStatictics(tblname,level,gid){
    $.ajax({
        url: "services/stat.php?tbl="+tblname+"&lvl="+level+"&param="+gid,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
             set_content(response,tblname)
        }
    });
}
var lineLayerJson;
var myLineBufferArray=[];
var sc=false
function createScoreCard(){
    toolName='sc';

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

    if(dc==true){
        polygonDrawer.disable();
        dc=false;
        $('#drawPolygon').removeAttr( 'style' );
        $('#drawParcelPolygon').removeAttr( 'style' );

    }

    if(graticule==true) {
        $('#graticules').removeAttr('style');
        graticuleObj.removeFrom(map);
        graticule = false;
    }


    if(sc==false) {
        polylineDrawer = new L.Draw.Polyline(map);
        polylineDrawer.enable();
        $('#sc').css({'background-color': '#2196F3'});
        $('#sc').css({'color': 'snow'});
        sc=true

        // polylineDrawer.disable();
        map.on(L.Draw.Event.CREATED, function (event) {
            if(toolName=='sc') {
                polylineDrawer.disable();
                $('#sc').removeAttr('style');
                lineLayerJson = event.layer.toGeoJSON();
                angular.element(document.getElementById("toc")).scope().createBufferOnLineData();
            }
        });
    }else{
        sc=false;
        polylineDrawer.disable();
        $('#sc').removeAttr( 'style' );
    }
}

var bufferIndex=1;

function createBufferOnLineFeature(dt){

 //   var dt=$("#bufferOnLine").val();


    //var line = turf.featureCollection(lineLayerJson);
    var buffered = turf.buffer(lineLayerJson, dt, {units: 'miles'});

    console.log(buffered);

  //  myLineBufferArray.push(buffered);
    //}

    //var res = L.polygon(buffered)
    // var res=L.layerGroup(buffArray);
    //removeFile(selectedLayerName);
    myLayers['linebuffer'+bufferIndex] = L.geoJson(buffered);
    map.addLayer(myLayers['linebuffer'+bufferIndex]);

    var str = '<li onclick="dataForGeoprocessing('+"'"+'linebuffer'+bufferIndex+"'"+',this)" id="' + 'linebuffer'+bufferIndex+ '" class="list-group-item" >' +
        '<input onclick="turnLayerOnOf(this,' + "'" + 'linebuffer'+bufferIndex + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +'linebuffer'+bufferIndex + '</span>' +
        //'<img onclick="upLayer(this , \'' + bufferedLayerName + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
        //'<img onclick="downLayer(this , \'' + bufferedLayerName + '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
        '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + 'linebuffer'+bufferIndex + "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
        '<span class="glyphicon glyphicon-minus"></span>' +
        '</button>' +
        "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + 'linebuffer'+bufferIndex + "\",\"" + 'myLayers' + "\")'>" +
        '</li>';
    $("#userLayers").append(str);


    scope.cancel();

   // var mydata='[{"factor_id":1,"factor_name":"schools","factor_value":10,"geom":"{"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {  "type": "Polygon",  "coordinates": [ [ [ 74.32858765125275, 31.51550884234235 ], [ 74.32984292507172, 31.51550884234235 ], [ 74.32984292507172, 31.51568948196454 ], [ 74.32858765125275, 31.51568948196454 ], [ 74.32858765125275, 31.51550884234235 ] ]  ]}}] }"}, {"factor_id":2,"factor_name":"hospital","factor_value":10,"geom":"{"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {  "type": "Point",  "coordinates": [ 74.32870030403137, 31.51563003098819  ]}},{"type": "Feature","properties": {},"geometry": {  "type": "Point",  "coordinates": [ 74.32891756296158, 31.51550655576261  ]}},{"type": "Feature","properties": {},"geometry": {  "type": "Point",  "coordinates": [ 74.32933062314987, 31.51563917729471  ]}},{"type": "Feature","properties": {},"geometry": {  "type": "Point",  "coordinates": [ 74.32967126369475, 31.51553170813662  ]}}] }"}, {"factor_id":3,"factor_name":"builtup percentage","factor_value":10,"geom":"{"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {  "type": "Point",  "coordinates": [ 74.32923138141632, 31.515662043057073  ]}},{"type": "Feature","properties": {},"geometry": {  "type": "Point",  "coordinates": [ 74.32906240224838, 31.515668902784714  ]}}] }"}]';


    $.ajax({
        url: "services/sc.php?geom=" + JSON.stringify(buffered.geometry),
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
            angular.element(document.getElementById("toc")).scope().createTableOfScores(response);
            bufferIndex++;
        }
    });



}

function removeFile(name){
    bufferIndex=1;
    scoreIndex=1;
    map.removeLayer(myLayers[name]);
    // $('#'+name).remove();
    var div = document.getElementById(name);
    if(div!=null) {
        div.parentNode.removeChild(div);
    }else{
        bufferLayersDraw=[];
    }
}



var layerId;
var colName='';
var colValue='';
var myOperator;
var selectedLayerName=''
var layerCh;


function filterLayers(layerName,id,ch){
layerId=parseInt(id);
layerCh=ch;
    selectedLayerName=layerName;
    var str='<option value=""></option>';

    $.ajax({
        url: "services/select_table_col.php?layer_name="+layerName,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
            for(var i=0;i<response.length;i++){
                str=str+"<option value='"+response[i].column_name+"'>"+response[i].column_name+"</option>";
            }
            $("#tbl_col").html(str);
        }
    });



    var contents = '<div class="row">' +
        '<div class="col-md-12" style="height: 100%;">' +
        '<div class="form-group">'+
        '<label for="Col">Select Column</label>'+
        '<select class="form-control" onchange="selectCol(this.value,'+"'"+layerName+"'"+","+'0'+')" id="tbl_col">'+
        '</select>'+
        '</div>'+
        '<div class="form-group">'+
        '<label for="Col">Select Operator</label>'+
        '<select class="form-control" onchange="selectOperator(this.value)" >'+
        '<option value="">Select Operator</option>'+
        '<option value="=">=</option>'+
        '<option value="AND">AND</option>'+
        '<option value=">">></option>'+
        '<option value="<"><</option>'+
        '<option value=">=">>=</option>'+
        '<option value="<="><=</option>'+
        '</select>'+
        '</div>'+
        '<div class="form-group">'+
        '<label for="Col">Select Value</label>'+
        '<select class="form-control" onchange="selectVal(this.value)" id="tbl_val">'+
        '</select>'+
        '</div>'+
        '<div >'+
        '<button onclick="pagination('+"'"+"back"+"'"+')" class="btn-default">back</button><button class="btn-success" id="from">1</button><button class="btn-danger" id="to">0</button><button onclick="pagination('+"'"+"next"+"'"+')"  class="btn-default">next</button>'+
        '&nbsp &nbsp Total result Count:<input style="padding-top: 5px;width: 70px;" type="text" id="rs_count" value="0" disabled>'+
        '</div>'+
        '<div class="form-group">'+
        '<label for="Col">Query</label>'+
        '<textarea class="form-control" cols="30" rows="3"   id="query">'+
        '</textarea>'+
        '</div>'+
        '<div class="form-group"  style="padding-top: 5px;">'+
        '<button class="btn btn-success"  onclick="createlayerQuery()">submit</button>'+
        '<button class="btn btn-danger" style="margin-left: 40px;" onclick="clearAll()">clearAll</button>'+
        '</div>'+
        '</div>'+
        '</div>';




    dialog = L.control.dialog({size:[500,480]})
        .setContent(contents)
        .addTo(map);


    $('.leaflet-control-dialog-close').click(function(){
        map.removeControl(dialog);

    });
}


    function selectCol(val,table,offset,ch){
        colName=val;
        var str='<option value=""></option>';
        $.ajax({
            url: "services/select_table_col_val.php?layer_name="+table+"&value="+val+"&offset="+offset,
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                for(var i=0;i<response.col_val.length;i++){
                    str=str+"<option value='"+response.col_val[i].val+"'>"+response.col_val[i].val+"</option>";
                }
                $("#tbl_val").html(str);
                $("#to").html(Math.round(parseInt(response.col_count[0].count)/10));
                if(ch!='p') {
                    var myColName = $("#query").val() + " " + colName;
                    $("#query").val(myColName);
                }
            }
        });
    }

  //  var query='';
    function selectVal(val){
        colValue=val;
        if(colName==''||colValue=='' ) {
            query='';
        }else{
            //query =colName + myOperator + "'" + colValue + "'";
            ;
            var queryVal=$("#query").val()+"'" + colValue + "'";
            $("#query").val(queryVal);
        }
      //  if(query==''){

        // }else{
        //     query=" and "+query+colName+"="+colValue
        // }
    }

    function createlayerQuery(){
     //   query_by_nid(layerId,query,'filter')
        if(layerCh!="0") {
            query = $("#query").val();
            var id = '{' + '"' + layerId + '"' + ':' + '"' + query + '"' + '}';
            var ld = JSON.parse(id);
            geolayers[layerId].setLayerDefs(ld);
            getCountOfLayer(selectedLayerName,query);
        }else{
            query = $("#query").val();
            var id = '{' + '"' + layerId + '"' + ':' + '"' + query + '"' + '}';
            var ld = JSON.parse(id);
            mylayer[selectedLayerName].setLayerDefs(ld)
            getCountOfLayer(selectedLayerName,query);
        }
    }

    function getCountOfLayer(tbl,query){
        $.ajax({
            url: "services/layer_filter_count.php?tbl="+tbl+"&query="+query,
            type: "GET",
            dataType: "json",
            //data: JSON.stringify(geom,layer.geometry),
            contentType: "application/json; charset=utf-8",
            success: function callback(response) {
                $("#rs_count").val(response[0].count);
            }
        });
    }

    function selectOperator(val){
        myOperator=val;
        query=$("#query").val()+" "+myOperator;
        $("#query").val(query);

    }

    function pagination(val) {
        if(val=="next"){

            var from=parseInt($("#from").html())+1;
                $("#from").html(from);
             var offset1=$("#from").html()*10
            offset1=offset1-10

            var myColName=colName;
            selectCol(myColName,selectedLayerName,offset1,'p')

        }else{
            if($("#from").html()!="1") {
                var to = parseInt($("#from").html()) - 1;
                $("#from").html(to);
                if($("#from").html()!=1){
                    var offset1 = $("#from").html() * 10
                    offset1=offset1-10
                }else{
                    var offset1=0;
                }


                var myColName = colName;
                selectCol(myColName, selectedLayerName, offset1,'p')
            }else{
                selectCol(myColName, selectedLayerName, 0,'p');

            }
        }

    }

    function clearAll(){
        if(layerCh!="0") {
            $("#query").val('');
            var id = '{' + '"' + layerId + '"' + ':' + '"' + "" + '"' + '}';
            var ld = JSON.parse(id);
            geolayers[layerId].setLayerDefs(ld)
        }else{

            $("#query").val('');
            var id = '{' + '"' + layerId + '"' + ':' + '"' + "" + '"' + '}';
            var ld = JSON.parse(id);
            mylayer[selectedLayerName].setLayerDefs(ld)
        }
    }


function drawCenterOnLayer(){
    var geojson;
    var buffArray=[];


    if(selectedLayerName!='') {
        for(var i=0;i<selectedLayerDataArray.length;i++){
            if(selectedLayerDataArray[i].filename==selectedLayerName){
                geojson=selectedLayerDataArray[i].data;
            }
        }
        var file = selectedLayerData;


        //scope.cancel();

      //  angular.element($("#toolbar_controller")).scope().cancel();

        //for (var i = 0; i < geojson.features.length; i++) {
        var fs = turf.featureCollection(geojson.features);


        // var buffered = turf.buffer(point, dt, {units: 'miles'});

        //  var points = turf.randomPoint(100, options);
        var centerPolygons = turf.center(fs);


        //  buffArray.push(voronoiPolygons);
        //}

        //var res = L.polygon(buffered)
        // var res=L.layerGroup(buffArray);
        if(myLayers[selectedLayerName+'_center']){
            removeFile(selectedLayerName+'_center');
        }

        selectedLayerData={"filename":selectedLayerName+'_center',"data":centerPolygons};
        selectedLayerDataArray.push(selectedLayerData);

        myLayers[selectedLayerName+'_center'] = L.geoJson(centerPolygons);
        map.addLayer(myLayers[selectedLayerName+'_center']);
        //L.geoJson(buffered).addTo(map);


        var str = '<li onclick="dataForGeoprocessing('+"'"+selectedLayerName+'_center'+"'"+',this)" id="' + selectedLayerName +'_center'+ '" class="list-group-item selected" >' +
            '<input onclick="turnLayerOnOf(this,' + "'" + selectedLayerName+'_center' + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +selectedLayerName+'_center' + '</span>' +
            '<img onclick="upLayer(this , \'' + selectedLayerName+'_center' + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
            '<img onclick="downLayer(this , \'' + selectedLayerName +'_center'+ '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + selectedLayerName +'_center'+ "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + selectedLayerName+'_center' + "\",\"" + 'myLayers' + "\")'>" +
            '</li>';
        $("#userLayers").append(str);
    }else{
        alert("please select the layer first");
    }
}

function drawEnvelopOnLayer(){
    var geojson;
    var buffArray=[];


    if(selectedLayerName!='') {
        for(var i=0;i<selectedLayerDataArray.length;i++){
            if(selectedLayerDataArray[i].filename==selectedLayerName){
                geojson=selectedLayerDataArray[i].data;
            }
        }
        var file = selectedLayerData;


        //scope.cancel();

      //  angular.element($("#toolbar_controller")).scope().cancel();

        //for (var i = 0; i < geojson.features.length; i++) {
        var fs = turf.featureCollection(geojson.features);


        // var buffered = turf.buffer(point, dt, {units: 'miles'});

        //  var points = turf.randomPoint(100, options);
        var centerPolygons = turf.envelope(fs);




        //  buffArray.push(voronoiPolygons);
        //}


        myLayers[selectedLayerName+'_envelop'] = L.geoJson(centerPolygons);
        map.addLayer(myLayers[selectedLayerName+'_envelop']);

        //var res = L.polygon(buffered)
        // var res=L.layerGroup(buffArray);
        if(myLayers[selectedLayerName+'_envelop']){
            removeFile(selectedLayerName+'_envelop');
        }

        myLayers[selectedLayerName+'_envelop'] = L.geoJson(centerPolygons);
        map.addLayer(myLayers[selectedLayerName+'_envelop']);
        //L.geoJson(buffered).addTo(map);


        var str = '<li onclick="dataForGeoprocessing('+"'"+selectedLayerName+'_envelop'+"'"+',this)" id="' + selectedLayerName +'_center'+ '" class="list-group-item selected" >' +
            '<input onclick="turnLayerOnOf(this,' + "'" + selectedLayerName+'_envelop' + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +selectedLayerName+'_envelop' + '</span>' +
            '<img onclick="upLayer(this , \'' + selectedLayerName+'_envelop' + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
            '<img onclick="downLayer(this , \'' + selectedLayerName +'_envelop'+ '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + selectedLayerName +'_envelop'+ "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + selectedLayerName+'_envelop' + "\",\"" + 'myLayers' + "\")'>" +
            '</li>';
        $("#userLayers").append(str);
    }else{
        alert("please select the layer first");
    }
}


function drawConvexOnLayer(){
    var geojson;
    var buffArray=[];


    if(selectedLayerName!='') {
        for(var i=0;i<selectedLayerDataArray.length;i++){
            if(selectedLayerDataArray[i].filename==selectedLayerName){
                geojson=selectedLayerDataArray[i].data;
            }
        }
        var file = selectedLayerData;


        //scope.cancel();

      //  angular.element($("#toolbar_controller")).scope().cancel();

        //for (var i = 0; i < geojson.features.length; i++) {
        var fs = turf.featureCollection(geojson.features);


        // var buffered = turf.buffer(point, dt, {units: 'miles'});

        //  var points = turf.randomPoint(100, options);
        var centerPolygons = turf.convex(fs);


        //  buffArray.push(voronoiPolygons);
        //}

        //var res = L.polygon(buffered)
        // var res=L.layerGroup(buffArray);

        if(myLayers[selectedLayerName+'_convex']){
            removeFile(selectedLayerName+'_convex');
        }

        myLayers[selectedLayerName+'_convex'] = L.geoJson(centerPolygons);
        map.addLayer(myLayers[selectedLayerName+'_convex']);
        //L.geoJson(buffered).addTo(map);


        var str = '<li onclick="dataForGeoprocessing('+"'"+selectedLayerName+'_convex'+"'"+',this)" id="' + selectedLayerName +'_center'+ '" class="list-group-item selected" >' +
            '<input onclick="turnLayerOnOf(this,' + "'" + selectedLayerName+'_convex' + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +selectedLayerName+'_center' + '</span>' +
            '<img onclick="upLayer(this , \'' + selectedLayerName+'_convex' + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
            '<img onclick="downLayer(this , \'' + selectedLayerName +'_convex'+ '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + selectedLayerName +'_convex'+ "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + selectedLayerName+'_convex' + "\",\"" + 'myLayers' + "\")'>" +
            '</li>';
        $("#userLayers").append(str);
    }else{
        alert("please select the layer first");
    }
}



function drawBboxPolygonOnLayer(){
    if(selectedLayerName!='') {
        var box=prompt("plz enter bbox",'' );

        var bbArray=box.split(',');


        //  var points = turf.randomPoint(100, options);
        var centerPolygons = turf.bboxPolygon(bbArray);


        //  buffArray.push(voronoiPolygons);
        //}

        //var res = L.polygon(buffered)
        // var res=L.layerGroup(buffArray);

        if(myLayers[selectedLayerName+'_bbpolygon']){
            removeFile(selectedLayerName+'_bbpolygon');
        }

        myLayers[selectedLayerName+'_bbpolygon'] = L.geoJson(centerPolygons);
        map.addLayer(myLayers[selectedLayerName+'_bbpolygon']);
        //L.geoJson(buffered).addTo(map);


        var str = '<li onclick="dataForGeoprocessing('+"'"+selectedLayerName+'_bbpolygon'+"'"+',this)" id="' + selectedLayerName +'_bbpolygon'+ '" class="list-group-item selected" >' +
            '<input onclick="turnLayerOnOf(this,' + "'" + selectedLayerName+'_bbpolygon' + "'" + ')" class="leaflet-control-layers-selector" type="checkbox" checked><span>' +selectedLayerName+'_bbpolygon' + '</span>' +
            '<img onclick="upLayer(this , \'' + selectedLayerName+'_bbpolygon' + '\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">' +
            '<img onclick="downLayer(this , \'' + selectedLayerName +'_bbpolygon'+ '\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">' +
            '<button style="margin-left: -10px;"  type="button" onclick="removeFile(' + "'" + selectedLayerName +'_bbpolygon'+ "'" + ')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
            '<span class="glyphicon glyphicon-minus"></span>' +
            '</button>' +
            "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \"" + selectedLayerName+'_bbpolygon' + "\",\"" + 'myLayers' + "\")'>" +
            '</li>';
        $("#userLayers").append(str);
    }else{
        alert("please select the layer first");
    }
}



function drawBBoxOnLayer(){
    var geojson;
    var buffArray=[];


    if(selectedLayerName!='') {
        for(var i=0;i<selectedLayerDataArray.length;i++){
            if(selectedLayerDataArray[i].filename==selectedLayerName){
                geojson=selectedLayerDataArray[i].data;
            }
        }
        var file = selectedLayerData;


        //scope.cancel();

      //  angular.element($("#toolbar_controller")).scope().cancel();

        //for (var i = 0; i < geojson.features.length; i++) {
        var fs = turf.featureCollection(geojson.features);


        // var buffered = turf.buffer(point, dt, {units: 'miles'});

        //  var points = turf.randomPoint(100, options);
        var centerPolygons = turf.bbox(fs);



        alert(centerPolygons);


        //  buffArray.push(voronoiPolygons);
        //}

        //var res = L.polygon(buffered)
        // var res=L.layerGroup(buffArray);





    }else{
        alert("please select the layer first");
    }
}

function myTreeSearchFunction() {
    var input, filter, ul, li, divs, i;
    $('#treeview1').treeview('expandAll', { silent: true });
    input = document.getElementById("myInput");
    if(input.value==""){
        $('#treeview1').treeview('collapseAll', { silent: true });
    }
    filter = input.value.toUpperCase();
    divs = document.getElementById("treeview1");
    ul = divs.getElementsByTagName("ul");
    li = ul[0].getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
       // a = li[i].getElementsByTagName("a")[0];
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";


        }
    }
}

var strChkox=''; 
var lyr=[];

function imageDistort(url,name,id){
let url1 = 'http://spacetech.urbanunit.gov.pk/'+ url;
    console.log(url1)
	lyr[id] = L.distortableImageOverlay(url1, {
        selected: true,
        mode: 'freeRotate',
      //  actions: [L.DragAction, L.ScaleAction, L.DistortAction,L.RotateAction,L.FreeRotateAction,L.LockAction,L.UnlockAction,L.OpacityAction],
          actions:[L.DragAction, L.ScaleAction, L.DistortAction, L.RotateAction, L.FreeRotateAction, L.LockAction, L.OpacityAction, L.BorderAction],
      });
     // .addTo(map);
     
     
      map.addLayer(lyr[id]);
      angular.element(document.getElementById("dt_dialog11")).remove();

      strChkox +='<label for="udata" style="margin-left: 40px !important;">'+
      '<input type="checkbox" class="chk" name="gjlayer" value="Bike" onclick="addRemoveimgLayer('+id+','+"'"+url1+"'"+')" id="'+id+'" checked>'+
      ' '+name+' </label>'; 

      $("#udatachk").html(strChkox);


	
// 	var str='<li id="'+l+'" class="list-group-item" >'+
//     '<input onclick="turnLayerOnOf(this,'+"'"+l+"'"+')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+l+'</span>' +
//    // '<img onclick="upLayer(this , \''+file.name+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
//    // '<img onclick="downLayer(this , \''+file.name+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">'+
//     '<button style="margin-left: 10px;"  type="button" onclick="removeFile('+"'"+l+"'"+')" class="btn-subnav dropdown-toggle" data-toggle="dropdown">' +
//     '<span class="glyphicon glyphicon-minus"></span>' +
//     '</button>'+
//     "<input  id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+l+"\",\""+'myLayers'+"\")'>"+
//     '</li>';
// 	$("#userLayers").append(str);
// 	l++;
   
}



function addRemoveimgLayer(id,url1){
    if(id==id){
            // $(this).attr("id")
            var ckb = $("#"+id).is(':checked');
            if(ckb==true){
                lyr[id] = L.distortableImageOverlay(url1, {
                    selected: true,
                    mode: 'freeRotate',
                  //  actions: [L.DragAction, L.ScaleAction, L.DistortAction,L.RotateAction,L.FreeRotateAction,L.LockAction,L.UnlockAction,L.OpacityAction],
                      actions:[L.DragAction, L.ScaleAction, L.DistortAction, L.RotateAction, L.FreeRotateAction, L.LockAction, L.OpacityAction, L.BorderAction],
                  });
                 // .addTo(map);
                 
                 
                  map.addLayer(lyr[id]);
            }else{
                 map.removeLayer(lyr[id])
            }
        }
}




/*
function () {
    // console.log( "ready!" );
    $.ajax({
        url: "http://172.20.82.84:88/spacetech_map/services/uid_service.php?user_id="+app_user_id,
        type: "GET",
        dataType: "json",
        //data: JSON.stringify(geom,layer.geometry),
        contentType: "application/json; charset=utf-8",
        success: function callback(response) {
            
          
            
        }
    });
});
*/
