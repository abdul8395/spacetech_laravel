if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

var baseMapControl = null;
var bingLayer = null;
var csvLat = null;
var csvLon = null;
var csvFile = null;
var csvSaparator = null;
var bingLayerTypes = [{'name':'Aerial'} ,
    {'name':'AerialWithLabels'},
    {'name':'Road'},
    {'name':'RoadOnDemand'},
    {'name':'CanvasLight'},
    {'name':'CanvasDark'},
    {'name':'CanvasGray'},
    {'name':'OrdnanceSurvey'}];
var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L';
var mbtilesElevationLayer = null;
function onloadFunction(){
    $('.modal-content').resizable({
        onResize: function(size ,ui) {
            var height = parseInt($('.modal-content').height());
            if(height>250){
                $('#salle_list').height(height-200);
            }
            
            $('#attribute_table').datagrid('resize');
        }
    });
    $('#modal-content').on('show.bs.modal', function () {
        $(this).find('.modal-body').css({
            'max-height':'100%'
        });
    });
}
var layersWithName = {};
function removeArrayItem(values , toRemove) {
    for (var i = 0; i < values.length; i++) {
        if (values[i] === toRemove) {
            values.splice(i, 1);
            i--;
        }
    }
    return values;
}
var attributes = {};
function showAttributes(layerName){
    var layerAttributes = attributes[layerName];
    if(layerAttributes != undefined){
        $(".modal-title").html(layerName);
        if(layerAttributes instanceof Array){
            $('#salle_list').html("");
            $('#layers_name').html("");
            addAttributesToTable(layerAttributes);
        }
        else{
            var layersInAttributes = getKeysFromJson(layerAttributes);
            $('#layers_name').html("");
            for(var i=0; i<layersInAttributes.length; i++){
                var button = $('<button/>',
                {
                    text: layersInAttributes[i],
                    class:"btn",
                    click: function (event) { event.preventDefault(); addAttributesToTable(layerAttributes , true , $(this).text()); }
                });
                $('#layers_name').append(button);
                
            }  
            
            // $('#salle_list').html(innerHtmlLayersButton);
            addAttributesToTable(layerAttributes[layersInAttributes[0]]);
            return;
        }
    }
    else{
        alert("No attributes against this layer");
    }
}

function addAttributesToTable(layerAttributes , refreshModal , insideLayer){
        if(insideLayer){
            layerAttributes = layerAttributes[insideLayer];
        }
        var keys = getKeysFromJson(layerAttributes[0]);
        removeArrayItem(keys , "geom");
        var headers = [];
        keys.forEach(function(element) {
            var obj = {field:element, title:element, width:100 , sortable:"true"};
            headers.push(obj);
        });

        if(!refreshModal){
            $('#modal_list').modal('show');
        }
        $('#salle_list').html("<table id='attribute_table'></table><img id='loader_icon' src='libraries/jquery/datagrid/loader.gif' style='height:100%; width:100%'/>");
        setTimeout(function(){
            var dg = $('#attribute_table');
            dg.datagrid({
                scrollbarSize:5,
                columns:[headers],
                data: layerAttributes,
                singleSelect:true,
                remoteFilter: false,
                remoteSort:false,
                fit:true,
            }); 
            dg.datagrid('enableFilter');
            $("#loader_icon").remove();
        } , 1000);
}

function addMbTilesToMap(file , elevation){

    var reader = new FileReader();
    reader.onload = function(evn) {

      var dataBuffer = this.result;
      // array = new Uint8Array(arrayBuffer);
      var mb = L.tileLayer.mbTiles(dataBuffer, {
        minZoom: 0,
        maxZoom: 6
      });

      map.addLayer(mb);
      addLayerToToc(file.name , mb);
      mb.on('databaseloaded', function(ev) {
        console.info('MBTiles DB loaded', ev);
      });
      mb.on('databaseerror', function(ev) {
        console.info('MBTiles DB error', ev);
      });
      if(elevation){
        mbtilesElevationLayer["layer"] = mb;
        mbtilesElevationLayer["layer_name"] = file.name;
        mbtilesElevationLayer["database"] = new SQL.Database( new Uint8Array(dataBuffer) );
      }

    }
    reader.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
    };
    reader.readAsArrayBuffer(file);


  }

function addShapefile(file){
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (event) {
        var data = reader.result;
        var ac_shpfile = new L.Shapefile(data);
        ac_shpfile.addTo(map);
        readAttributesFromShapefile(data , file.name);
        addLayerToToc(file.name , ac_shpfile);
    }
  }

  function readAttributesFromShapefile(data , fileName){
    shp(data).then(function(data) {
        attributes[fileName] = readAttributesFromGeoJson(data);
    });
  }


  function addKml(file){
    var reader = new FileReader();
    reader.onload = function() {

        var dataUrl = this.result;
      
        var kmlLayer = new L.KML(dataUrl, {async: true});
                                                              
         kmlLayer.on("loaded", function(e) { 
            map.fitBounds(e.target.getBounds());
         });
                                                
         map.addLayer(kmlLayer);
        readAttributesFromKml(dataUrl);
        addLayerToToc(file.name , kmlLayer);
    }
    reader.readAsDataURL(file);
  }

  function readAttributesFromKml(fileUrl){
    var req = new window.XMLHttpRequest();
    req.open('GET', fileUrl, true);
    try {
        req.overrideMimeType('text/xml'); // unsupported by IE
    } catch(e) {}
    req.onreadystatechange = function() {
        if (req.readyState != 4) return;
        if(req.status == 200) {
            var xml = this.responseXML;
            var layers = L.KML.parseKML(xml);
            if (!layers || !layers.length) return;
            for (var i = 0; i < layers.length; i++)
            {
                var features = layers[i].features;
            }
        }
    };
    req.send(null);

        

    
  }

function addGpkg(file){
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = this.result;
      baseUrl = dataUrl;
      readContentsFromGpkg(file.name);
    }
    reader.readAsArrayBuffer(file);
  }

  function readContentsFromGpkg(fileName){
    // var myRequest = new Request(baseUrl);
    // fetch(myRequest).then(function(response) {
    //     return response.arrayBuffer();
    // }).then(function(buffer) {
        gpkgDb = new SQL.Database( new Uint8Array(baseUrl) );
        var metaStmt = gpkgDb.prepare('SELECT * FROM gpkg_contents');
        var layers = [];
        while (metaStmt.step()){
            var row = metaStmt.getAsObject();
            layers.push(row);
        } 
        askLayerToAdd(layers);
    // });
  }


  function askLayerToAdd(layers){
    $(".modal-title").html("Select layer to add");
    $('#layers_name').html("");
    $('#modal_list').modal('show');
    $('#salle_list').html("<table id='attribute_table'></table><img id='loader_icon' src='libraries/jquery/datagrid/loader.gif' style='height:100%; width:100%'/>");
    setTimeout(function(){
        var dg = $('#attribute_table');
        dg.datagrid({
            columns:[[{field:"table_name", title:"Table", width:100} , {field:"data_type", title:"Type", width:100}]],
            data: layers,
            singleSelect:true,
            onClickRow:addGpkgToMap
        });
        $("#loader_icon").remove();
    } , 1000);
  }

  function addGpkgToMap(index , row){
    var dataType = row.data_type;
    var tableName = row.table_name;
    if(dataType=="features"){
        try{
            var featureStmt = gpkgDb.prepare('SELECT * FROM '+tableName);
            attributes[tableName] = [];
            var index = 0;
            while (featureStmt.step()){
                var row = featureStmt.getAsObject();
                attributes[tableName][index++] = row;
            }
        }
        catch(err){
            
        }

        var gpkgLayer = L.geoPackageFeatureLayer([],{
            // file:arrayBuffer,
            geoPackageBufferArray: baseUrl,
            layerName: tableName
        }).addTo(map);

    }
    else if(dataType=="tiles"){
        var gpkgLayer = L.geoPackageTileLayer({
            // file:arrayBuffer,
            geoPackageBufferArray : baseUrl,
            layerName: tableName
        }).addTo(map);
    }
    addLayerToToc(tableName , gpkgLayer);
    $('#modal_list').modal('toggle');
  }

  function addMbTilesVector(file , geoJson){
        if(geoJson){
            var zoomLevel = prompt("Please select zoom level");
        }
        var readerBuffer = new FileReader();
        readerBuffer.onload = function() {
                var buffer = readerBuffer.result;
                
                var vectorGrid = L.vectorGrid.protobuf( "", {
                    rendererFactory: L.canvas.tile
                } , buffer);
                if(geoJson){
                    vectorGrid._vectorTilesToGeoJson(zoomLevel).then(function(geoJsonFromVt){
                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJsonFromVt)));
                        element.setAttribute('download', file.name.split(".")[0]+".geojson");

                        element.style.display = 'none';
                        document.body.appendChild(element);

                        element.click();

                        document.body.removeChild(element);   
                    });
                }
                else{
                    vectorGrid.addTo(map);
                    vectorGrid._readAttributesFromMbtiles().then(function(layerAtrbs){
                        attributes[file.name] = layerAtrbs;    
                    });
                    addLayerToToc(file.name , vectorGrid);
                }
        }
         readerBuffer.readAsArrayBuffer(file);   
  }

function readAttributesFromGeoJson(data){
    var atrbData = [];
    for(var i=0; i<data.features.length; i++){
        atrbData.push(data.features[i].properties);
    }
    return atrbData;
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
            vectorGrid = L.geoJSON(data, {}).addTo(map);
        }
        else{
            vectorGrid = L.vectorGrid.slicer(data).addTo(map);
        }
        addLayerToToc(file.name , vectorGrid);

    }

}
function updateOpacity(value, name) {
    try{
        layersWithName[name].setOpacity(value);
    }
    catch(err){
        layersWithName[name].setStyle({fillOpacity: value , opacity:value});
        // layersWithName[name].setFeatureStyle(undefined, {fillOpacity: 1});
    }
}  

function addLayerToToc(name , layer , downloadAble){
    layersWithName[name] = layer;
    var innerHtmlLayer = '<li id="layer_template" class="list-group-item" layer-name="" style="background:#BFCCBF;">'+
        '<input onclick="turnLayerOnOf(this , \''+name+'\')" class="leaflet-control-layers-selector" type="checkbox" checked><span>'+name+'</span>'+
        '<img onclick="showAttributes(\''+name+'\')" src="images/atrb.png" style="height:20px; width:20px; cursor:pointer">'+
        '<img onclick="upLayer(this , \''+name+'\')" src="images/up.png" style="height:20px; width:20px; cursor:pointer">'+
        '<img onclick="downLayer(this , \''+name+'\')" src="images/down.png" style="height:20px; width:20px; cursor:pointer">';
        
        // '<img onclick="addStyleToLayer(\''+name+'\')"  data-toggle="modal" data-target="#myModalNorm" src="images/style.png" style="height:20px; width:20px; cursor:pointer">';
    if(downloadAble){
        innerHtmlLayer+='<img onclick="download(\''+name+'\')" src="images/download.png" style="height:20px; width:20px; cursor:pointer">';
    }
    else{
        innerHtmlLayer+='<img onclick="removeLayer(this , \''+name+'\')" src="images/remove.png" style="height:20px; width:20px; cursor:pointer">';
    }
    innerHtmlLayer+="<br><input id='slide' type='range' min='0' max='1' step='0.1' value='1' onchange='updateOpacity(this.value , \""+name+"\")'>"
    innerHtmlLayer+='</li>';
        $("#layers_ul").prepend(innerHtmlLayer);
}

function download(name){
    var geojson = layersWithName[name].toGeoJSON();
    var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson)));
  element.setAttribute('download', "drawlayer.geojson");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function turnLayerOnOf(element , layerName){
    if($(element).is(":checked")){
        reArragneLayers();
        // var type = obj.overlay ?
        //     (e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
        //     (e.type === 'layeradd' ? 'baselayerchange' : null);

        // if (type) {
            // alert(layersWithName[layerName].overlay);
            // map.fire('overlayadd', layersWithName[layerName]);
        // }
    }
    else{
        map.removeLayer(layersWithName[layerName]);
    }
}

function upLayer(element , layerName){
    var li = $(element).parent();
    var prev = li.prev();
    if(prev.length){
        li.detach().insertBefore(prev);
        reArragneLayers();
    }
    
}
function downLayer(element , layerName){
    var li = $(element).parent();
    var next = li.next();
    if(next.length){
        li.detach().insertAfter(next);
        reArragneLayers();
    }
    
}
function removeLayer(element , layerName){
    var li = $(element).parent();
    li.detach();
    map.removeLayer(layersWithName[layerName]);
}

function reArragneLayers(){
    $( "#layers_ul" ).each(function( index ) {$($("li"))
        $(this).find('li').each(function(){
            map.removeLayer(layersWithName[$( this ).text()]);
        });
        $($(this).find('li').get().reverse()).each(function(){
            // alert($( this ).text()+" "+$(this).find('input').first().is(":checked"));
            if($(this).find('input').first().is(":checked")){
                map.addLayer(layersWithName[$( this ).text()]);
            }
        });
    });
}
function addStyleToLayer(layerName){
    // var style = {
    //             fillColor:/* p === 0 ? */'green' /*:
    //                     p === 1 ? '#E31A1C' :
    //                     p === 2 ? '#FEB24C' :
    //                     p === 3 ? '#B2FE4C' : '#FFEDA0'*/,
    //             fillOpacity: 0.5,
    //             fillOpacity: 1,
    //             stroke: true,
    //             fill: true,
    //             color: 'red',
    //             opacity: 1,
    //             weight: 2,
    //         };

    // layersWithName[layerName].setFeatureStyle(undefined, style);
}

function getKeysFromJson(json){
    var keys = [], name;
    for (name in json) {
        if (json.hasOwnProperty(name)) {
            keys.push(name);
        }
    }
    return keys;
}
var el;
function addGeoJsonForElevation(file){
    var reader = new FileReader();
    
    reader.readAsText(file);
    reader.onload = function (event) {
        if(el){
            map.remove(el);
        }
        el = L.control.elevation();
        el.addTo(map);
        var gjl = L.geoJson(JSON.parse(reader.result),{
            onEachFeature: el.addData.bind(el)
        }).addTo(map);

        // map.addLayer(service).fitBounds(bounds);
    }
}

function addGPXForElevation(file){
    var reader = new FileReader();
    reader.onload = function() {

      var dataUrl = this.result;
      if(el){
        map.remove(el);
    }
      el = L.control.elevation();
        el.addTo(map);
        var g=new L.GPX(dataUrl, {
            async: true,
             marker_options: {
                startIconUrl: 'libraries/modules/leaflet_gpx/pin-icon-start.png',
                endIconUrl: 'libraries/modules/leaflet_gpx/pin-icon-end.png',
                shadowUrl: 'libraries/modules/leaflet_gpx/pin-shadow.png'
              }
        });
        g.on('loaded', function(e) {
                map.fitBounds(e.target.getBounds());
        });
        g.on("addline",function(e){
            el.addData(e.line);
        });
        g.addTo(map);
        // map.addLayer(service);

    }
    reader.readAsDataURL(file);

}

// function loadScript(key){
//     var scriptsToLoad = scripts[key]["scripts"];
//     for(var i=0; i<scriptsToLoad.length; i++){
//         $.getScript(scriptsToLoad[i])
//           .done(function( script, textStatus ) {
//             console.log( textStatus );
//           })
//           .fail(function( jqxhr, settings, exception ) {
//             console.log( exception );
//         });
//     }
    
// }
function showHideEditor(){
    // loadScript("leaflet.draw");
  if(editor==undefined){
    editor = new L.Control.Draw({
      edit: {
          featureGroup: drawnItems,
          poly: {
              allowIntersection: false
          }
      },
      draw: {
          polygon: {
              allowIntersection: false,
              showArea: true
          }
      }
    });
    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;

        drawnItems.addLayer(layer);
    });
  }
  if(editor._map==undefined){
    map.addControl(editor);
  }
  else{
    map.removeControl(editor);
  }
}

function showHideBaseMap(){
  if(baseMapControl==null){
    addBaseMaps();
    return;
  }
  if(baseMapControl._map==undefined){
    map.addControl(baseMapControl);
  }
  else{
    map.removeControl(baseMapControl);
  }
}


function addRemoveMouseCoordinates(){
    if(mouseCoordinates._map==undefined){
        map.addControl(mouseCoordinates);
    }
    else{
        map.removeControl(mouseCoordinates);
    }
}

function addRemoveBookmarks(){
    if(bookmarksControl._map==undefined){
        map.addControl(bookmarksControl);
    }
    else{
        map.removeControl(bookmarksControl);
    }
}
function addRemoveMeasurementPolyline(){
    // scaleControl 
    if(polylineMeasurement._map==undefined){
        map.addControl(polylineMeasurement);
    }
    else{
        map.removeControl(polylineMeasurement);
    }
}
function addRemoveMeasure(){
    if(measureControl._map==undefined){
        map.addControl(measureControl);
    }
    else{
        map.removeControl(measureControl);
    }
}

function addWmsToMap(){
    var tileLayerAddress = prompt("Enter Wms Url");
    if(tileLayerAddress!=null && tileLayerAddress!=""){ 
        var layer_name = prompt("Enter Layer Name");
        if(layer_name!=null && layer_name!=""){
            var myLayer = L.tileLayer.wms(tileLayerAddress+"?" ,{
                layers: layer_name,
                format: 'image/png',
                transparent: true
            }).addTo(map);
            addLayerToToc(layer_name , myLayer);
        }
    }
    
}

function addTmsToMap(){
    alert("tms");
} 

function addWtmsToMap(){
    alert("wtms");
}

function addCsvFile(file){
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
        var data = event.target.result;
        csvFile = file;
        var firstLine = data.split("\n").shift();
        var saparator = prompt("Select saparator!");
        if(saparator!=null && saparator!=""){ 
            csvSaparator = saparator;
            var columns = firstLine.split(saparator);
            if(columns.length>1){
                var columnsData = [];
                for(var i=0; i<columns.length; i++){
                    var temp = {};
                    temp["column"] = columns[i];
                    columnsData.push(temp);
                }
                askLatLonColumns(columnsData);
                return;
            }
            alert("no columns found");
        }
        return;
        var csvLayer = L.geoCsv (null, {firstLineTitles: true, fieldSeparator: ','});
        csvLayer.addData(data);
        map.addLayer(csvLayer);
        addLayerToToc(file.name , csvLayer);
    }
}

function askLatLonColumns(columns){
    $(".modal-title").html("Select Lat Column");
    $('#layers_name').html("");
    $('#modal_list').modal('show');
    $('#salle_list').html("<table id='attribute_table'></table><img id='loader_icon' src='libraries/jquery/datagrid/loader.gif' style='height:100%; width:100%'/>");
    setTimeout(function(){
        var dg = $('#attribute_table');
        dg.datagrid({
            columns:[[{field:"column", title:"Columns", width:100}]],
            data: columns,
            singleSelect:true,
            onClickRow:latLonSelected
        });
        $("#loader_icon").remove();
    } , 1000);
  }

function latLonSelected(index , row){
    if(csvLat==null){
        csvLat = row.column;
        $(".modal-title").html("Select Lon Column");
        return;
    }
    if(csvLon==null){
        csvLon = row.column;
    }
    convertCsvToGeoJson();
}

function cancelCsv(){
    csvLat = null;
    csvLon = null;
    csvFile = null;
    csvSaparator = null
}

function convertCsvToGeoJson(){
    var reader = new FileReader();
    reader.readAsText(csvFile);
    
    reader.onload = function (event) {
        var lines = event.target.result.split(/[\r\n]+/g);
        var columnsIndices = {};
        var geoJson = {};
        geoJson["type"] = 'FeatureCollection';
        geoJson["features"] = [];
        for(var i = 0; i < lines.length; i++) { 
            if(i==0){
                var columns = lines[i].split(csvSaparator);
                for(var j = 0; j < columns.length; j++) { 
                    columnsIndices[j] = columns[j];
                }
                continue;
            }
            var columns = lines[i].split(csvSaparator);
            var feature = {};
            feature["type"] = "Feature";
            var featureGeomatery = {};
            var featureProperties = {};
            featureGeomatery["type"] = "Point";
            featureGeomatery["coordinates"] = [0,0];
            for(var j = 0; j < columns.length; j++) { 
                if(columnsIndices[j]==csvLat){
                    featureGeomatery["coordinates"][1]=parseFloat(columns[j]);
                }
                else if(columnsIndices[j]==csvLon){
                    featureGeomatery["coordinates"][0]=parseFloat(columns[j]);
                }
                else{
                    featureProperties[columnsIndices[j]]=columns[j];
                }
            }
            feature["geometry"] = featureGeomatery;
            feature["properties"] = featureProperties;
            geoJson["features"].push(feature);
        }
        try{
            $('#modal_list').modal('toggle');
            attributes[csvFile.name] = readAttributesFromGeoJson(geoJson);
            var geoJsonLayer = L.geoJSON(geoJson, {}).addTo(map);
            addLayerToToc(csvFile.name , geoJsonLayer);
        }
        catch(err){
            alert("Layer has following error \n"+err);
        }
        cancelCsv();
    }

    
}

function addRemoveBingLayer(index , row){
        disableBaseMap();
        bingLayer = L.tileLayer.bing({imagerySet: row.name , BingMapsKey:BING_KEY}).addTo(map);
        reArragneLayers();
        $('#modal_list').modal('toggle');
    
}

function askBingLayerToAdd(columns){
    if(!map.hasLayer(bingLayer)){
        $(".modal-title").html("Select Please Select Bing Layer Type!");
        $('#layers_name').html("");
        $('#modal_list').modal('show');
        $('#salle_list').html("<table id='attribute_table'></table><img id='loader_icon' src='libraries/jquery/datagrid/loader.gif' style='height:100%; width:100%'/>");
        setTimeout(function(){
            var dg = $('#attribute_table');
            dg.datagrid({
                columns:[[{field:"name", title:"Layer Types", width:100}]],
                data: bingLayerTypes,
                singleSelect:true,
                onClickRow:addRemoveBingLayer
            });
            $("#loader_icon").remove();
        } , 1000);
    }
    else{
        map.removeLayer(bingLayer);
    }
  }

function disableBaseMap(){

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    reArragneLayers();
}


function getTileXYZ(lat, lon, zoom) {
    var xtile = parseInt(Math.floor( (lon + 180) / 360 * (1<<zoom) ));
    var ytile = parseInt(Math.floor( (1 - Math.log(Math.tan(lat.toRad()) + 1 / Math.cos(lat.toRad())) / Math.PI) / 2 * (1<<zoom) ));
    ytile = mbtilesElevationLayer["layer"]._globalTileRange.max.y - ytile;
    return {"tile_x":xtile , "tile_y":ytile , "tile_z":zoom};
} 

function onclickMap(evt){
    var tileXYZ = getTileXYZ(evt.latlng.lat, evt.latlng.lng, map.getZoom());
    var metaStmt = mbtilesElevationLayer["database"].prepare('SELECT tile_data FROM tiles WHERE zoom_level = :z AND tile_column = :x AND tile_row = :y');
    var row = metaStmt.getAsObject({
        ':x': tileXYZ.tile_x,
        ':y': tileXYZ.tile_y,
        ':z': tileXYZ.tile_z
    });
        // window.open(window.URL.createObjectURL(new Blob([row.tile_data] , {type: 'image/png'})));
        // var options = {};
        // options["buffer"] = new Uint8Array(row.tile_data);
        // options["lat"] = evt.latlng.lat;
        // options["lng"] = evt.latlng.lng;
        // options["x"] = tileXYZ.tile_x;
        // options["y"] = tileXYZ.tile_y;
        // options["z"] = tileXYZ.tile_z;
        // getPixel(options);
    // }
}

function addRasterTileElevationLayer(file){
    if(mbtilesElevationLayer==null){
        mbtilesElevationLayer = {};
        addMbTilesToMap(file , true);
    }
    else{
        $(this).find('li').each(function(){
            if($( this ).text()==mbtilesElevationLayer["layer_name"]){
                removeLayer(this , mbtilesElevationLayer["layer_name"]);
                mbtilesElevationLayer==null;
                addMbTilesToMap(file);
                return;
            }
        });
    }
}


function addGdbFile(file){
    var reader = new FileReader();
    reader.onload = function() {
        var dataUrl = this.result;
        fgdb(dataUrl).then(function(objectOfGeojson){
            // var gdbGeoJson = L.geoJSON(objectOfGeojson, {}).addTo(map);
            var keys = getKeysFromJson(objectOfGeojson);
            for(var i=0; i<keys.length; i++){
               var gdbGeoJson = L.vectorGrid.slicer(objectOfGeojson[keys[i]]).addTo(map);
                addLayerToToc(keys[i] , gdbGeoJson);     
            }
            
            // console.log(objectOfGeojson);
        },function(error){
            alert(error);
        });
        
    }
    reader.readAsDataURL(file);
    
}

