
function createMap(divid, title, dataClasses, values, ratioMap, mapData) {
    //console.log(mapData);
    var mapJoinArray = [];
    for (var j = 0; j < mapData.features.length; j++) {
        var obj = mapData.features[j].properties;
        if (ratioMap == 'ratiomap') {
            obj['ratio'] = values[j];
        } else if (ratioMap == 'percentagemap') {
            obj['percentage'] = values[j];
        }
        mapJoinArray.push({
            "code": obj.name,
            "value": values[j]
        });
    }

    return new Highcharts.Map({
        credits: false,
        chart: {
            renderTo: divid,
            borderWidth: 0,
            events: {
                load: function (event) {

                }
            }

        },
        title: {
            text: title,
            "size": 10
        },

        mapNavigation: {
            enabled: true
            //                            enableDoubleClickZoomTo: true
        },

        legend: {
            title: {
                text: '',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            },
            align: 'right',
            itemStyle: {
                color: 'black',
                fontSize: "8px"
            },
           // verticalAlign: 'middle',
            floating: false,
            layout: 'vertical',
            backgroundColor: '#E0E0E0',
            valueDecimals: 0,
            width: 85,
            maxHeight: 150,
            symbolPadding: 5,
            itemDistance: 100,
            itemMarginBottom: -1,
            itemMarginTop: 0
            //                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            //                            symbolRadius: 0,
            //                            symbolHeight: 14
        },


        colorAxis: {
            dataClasses: dataClasses,
            //                    minColor : 'rgba(255, 204, 204, 1)',
            //                    maxColor : 'rgba(178, 0, 0, 0.8)',
            //                    tickInterval: 10,
            tickLength: 10,
            tickColor: 'rgba(178, 0, 0, 0.5)',
            tickWidth: 1
            //                    min: 1,
            //                    max: 100
        },

        xAxis: {
            minRange: 0.1
        },

        yAxis: {
            minRange: 0.1
        },

        series: [
            {
                data: mapJoinArray,
                    mapData: mapData,
                    joinBy: ["name", "code"],
                    animation: true,
                    name: 'Brick Kiln',
                states: {
                    hover: {
                        enabled: false,
                        borderColor: 'gray'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                    style: {
                        fontSize: fontSize + 'px',
                        //textShadow: "0 0 0px contrast,0 0 0px contrast"
                    },
                    allowOverlap: false
                    //                            rotation : 15
                },
                //                        tooltip: {
                //
                //                            valueSuffix: '%',
                //                            pointFormat: '{point.code}: {point.value}'
                //                        },

                tooltip: {
                    headerFormat: '',
                    pointFormat: '<table><span style="font-size:10px">' + title + '</span><br/><tr><td style="color:{series.color};padding:0">{} </td>' +
                    '<td style="padding:0"><b>{point.code}: {point.value:.2f}</b></td></tr></table>',
                    footerFormat: '',
                    shared: true,
                    useHTML: true
                },


                point: {
                    events: {
                        click: function () {

                        },
                        mouseOver: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.refresh(brickKilnChart.series[1].data[this.index]);
                            //    brickKilnChart.series[1].data[this.index].setState('hover');
                            //}
                        },
                        mouseOut: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.hide();
                            //    brickKilnChart.series[1].data[this.index].setState();
                            //}
                        }
                    }
                }
            }
        ]
    });
}

function createMapProvince(divid, title, dataClasses, values, ratioMap, mapData, realData) {
    var mapJoinArray = [];
    for (var j = 0; j < mapData.features.length; j++) {
        var obj = mapData.features[j].properties;
        if (ratioMap == 'ratiomap') {
            obj['ratio'] = values[j];
        } else if (ratioMap == 'percentagemap') {
            obj['percentage'] = values[j];
        }
        var count = 0;
        var search = _.where(realData, { Name: obj.postal_code });
        if (search.length > 0) {
            count = search[0].Count;
        }
        mapJoinArray.push({
            "code": obj.name,
            "value": count
        });
    }

    return new Highcharts.Map({
        credits: false,
        chart: {
            renderTo: divid,
            borderWidth: 0,
            events: {
                load: function (event) {

                }
            }

        },
        title: {
            text: title,
            "size": 10
        },

        mapNavigation: {
            enabled: true
            //                            enableDoubleClickZoomTo: true
        },

        legend: {
            title: {
                text: '',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            },
            align: 'right',
            itemStyle: {
                color: 'black',
                fontSize: "8px"
            },
            // verticalAlign: 'middle',
            floating: false,
            layout: 'vertical',
            backgroundColor: '#E0E0E0',
            valueDecimals: 0,
            width: 85,
            maxHeight: 150,
            symbolPadding: 5,
            itemDistance: 100,
            itemMarginBottom: -1,
            itemMarginTop: 0
            //                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            //                            symbolRadius: 0,
            //                            symbolHeight: 14
        },


        colorAxis: {
            dataClasses: dataClasses,
            //                    minColor : 'rgba(255, 204, 204, 1)',
            //                    maxColor : 'rgba(178, 0, 0, 0.8)',
            //                    tickInterval: 10,
            tickLength: 10,
            tickColor: 'rgba(178, 0, 0, 0.5)',
            tickWidth: 1
            //                    min: 1,
            //                    max: 100
        },

        xAxis: {
            minRange: 0.1
        },

        yAxis: {
            minRange: 0.1
        },

        series: [
            {
                data: mapJoinArray,
                mapData: mapData,
                joinBy: ["name", "code"],
                animation: true,
                name: 'Brick Kiln',
                states: {
                    hover: {
                        enabled: false,
                        borderColor: 'gray'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                    style: {
                        fontSize: fontSize + 'px',
                        //textShadow: "0 0 0px contrast,0 0 0px contrast"
                    },
                    allowOverlap: false
                    //                            rotation : 15
                },
                //                        tooltip: {
                //
                //                            valueSuffix: '%',
                //                            pointFormat: '{point.code}: {point.value}'
                //                        },

                tooltip: {
                    headerFormat: '',
                    pointFormat: '<table><span style="font-size:10px">' + title + '</span><br/><tr><td style="color:{series.color};padding:0">{} </td>' +
                    '<td style="padding:0"><b>{point.code}: {point.value:.2f}</b></td></tr></table>',
                    footerFormat: '',
                    shared: true,
                    useHTML: true
                },


                point: {
                    events: {
                        click: function () {

                        },
                        mouseOver: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.refresh(brickKilnChart.series[1].data[this.index]);
                            //    brickKilnChart.series[1].data[this.index].setState('hover');
                            //}
                        },
                        mouseOut: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.hide();
                            //    brickKilnChart.series[1].data[this.index].setState();
                            //}
                        }
                    }
                }
            }
        ]
    });
}

function createMapDivision(divid, title, dataClasses, values, ratioMap, mapData,realData) {
    var mapJoinArray = [];
    for (var j = 0; j < mapData.features.length; j++) {
        var obj = mapData.features[j].properties;
        if (ratioMap == 'ratiomap') {
            obj['ratio'] = values[j];
        } else if (ratioMap == 'percentagemap') {
            obj['percentage'] = values[j];
        }
        var count = 0;
        var search = _.where(realData, { Name: obj.div_code });
        if (search.length > 0) {
            count = search[0].Count;
        }
        mapJoinArray.push({
            "code": obj.name,
            "value": count
        });
    }

    return new Highcharts.Map({
        credits: false,
        chart: {
            renderTo: divid,
            borderWidth: 0,
            events: {
                load: function (event) {

                }
            }

        },
        title: {
            text: title,
            "size": 10
        },

        mapNavigation: {
            enabled: true
            //                            enableDoubleClickZoomTo: true
        },

        legend: {
            title: {
                text: '',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            },
            align: 'right',
            itemStyle: {
                color: 'black',
                fontSize: "8px"
            },
            // verticalAlign: 'middle',
            floating: false,
            layout: 'vertical',
            backgroundColor: '#E0E0E0',
            valueDecimals: 0,
            width: 85,
            maxHeight: 150,
            symbolPadding: 5,
            itemDistance: 100,
            itemMarginBottom: -1,
            itemMarginTop: 0
            //                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            //                            symbolRadius: 0,
            //                            symbolHeight: 14
        },


        colorAxis: {
            dataClasses: dataClasses,
            //                    minColor : 'rgba(255, 204, 204, 1)',
            //                    maxColor : 'rgba(178, 0, 0, 0.8)',
            //                    tickInterval: 10,
            tickLength: 10,
            tickColor: 'rgba(178, 0, 0, 0.5)',
            tickWidth: 1
            //                    min: 1,
            //                    max: 100
        },

        xAxis: {
            minRange: 0.1
        },

        yAxis: {
            minRange: 0.1
        },

        series: [
            {
                data: mapJoinArray,
                mapData: mapData,
                joinBy: ["name", "code"],
                animation: true,
                name: 'Brick Kiln',
                states: {
                    hover: {
                        enabled: false,
                        borderColor: 'gray'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                    style: {
                        fontSize: fontSize + 'px',
                        //textShadow: "0 0 0px contrast,0 0 0px contrast"
                    },
                    allowOverlap: false
                    //                            rotation : 15
                },
                //                        tooltip: {
                //
                //                            valueSuffix: '%',
                //                            pointFormat: '{point.code}: {point.value}'
                //                        },

                tooltip: {
                    headerFormat: '',
                    pointFormat: '<table><span style="font-size:10px">' + title + '</span><br/><tr><td style="color:{series.color};padding:0">{} </td>' +
                    '<td style="padding:0"><b>{point.code}: {point.value:.2f}</b></td></tr></table>',
                    footerFormat: '',
                    shared: true,
                    useHTML: true
                },


                point: {
                    events: {
                        click: function () {

                        },
                        mouseOver: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.refresh(brickKilnChart.series[1].data[this.index]);
                            //    brickKilnChart.series[1].data[this.index].setState('hover');
                            //}
                        },
                        mouseOut: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.hide();
                            //    brickKilnChart.series[1].data[this.index].setState();
                            //}
                        }
                    }
                }
            }
        ]
    });
}

function createMapDistrict(divid, title, dataClasses, values, ratioMap, mapData, realData) {
    
    var mapJoinArray = [];
    for (var j = 0; j < mapData.features.length; j++) {
        var obj = mapData.features[j].properties;
        if (ratioMap == 'ratiomap') {
            obj['ratio'] = values[j];
        } else if (ratioMap == 'percentagemap') {
            obj['percentage'] = values[j];
        }
        var count = 0;
        var search = _.where(realData, { Name: obj.dist_code });
        if (search.length > 0) {
            count = search[0].Count;
        }
        mapJoinArray.push({
            "code": obj.name,
            "value": count
        });
    }

    return new Highcharts.Map({
        credits: false,
        chart: {
            renderTo: divid,
            borderWidth: 0,
            events: {
                load: function (event) {

                }
            }

        },
        title: {
            text: title,
            style: {
                color: '#000000',
                fontWeight: 'bold'
            }
        },

        mapNavigation: {
            enabled: true
            //                            enableDoubleClickZoomTo: true
        },

        legend: {
            title: {
                text: '',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            },
            align: 'right',
            itemStyle: {
                color: 'black',
                fontSize: "8px"
            },
            // verticalAlign: 'middle',
            floating: false,
            layout: 'vertical',
            backgroundColor: '#E0E0E0',
            valueDecimals: 0,
            width: 85,
            maxHeight: 150,
            symbolPadding: 5,
            itemDistance: 100,
            itemMarginBottom: -1,
            itemMarginTop: 0
            //                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            //                            symbolRadius: 0,
            //                            symbolHeight: 14
        },


        colorAxis: {
            dataClasses: dataClasses,
            //                    minColor : 'rgba(255, 204, 204, 1)',
            //                    maxColor : 'rgba(178, 0, 0, 0.8)',
            //                    tickInterval: 10,
            tickLength: 10,
            tickColor: 'rgba(178, 0, 0, 0.5)',
            tickWidth: 1
            //                    min: 1,
            //                    max: 100
        },

        xAxis: {
            minRange: 0.1
        },

        yAxis: {
            minRange: 0.1
        },

        series: [
            {
                data: mapJoinArray,
                mapData: mapData,
                joinBy: ["name", "code"],
                animation: true,
                name: 'Brick Kiln',
                states: {
                    hover: {
                        enabled: false,
                        borderColor: 'gray'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                    style: {
                        fontSize: fontSize + 'px',
                        //textShadow: "0 0 0px contrast,0 0 0px contrast"
                    },
                    allowOverlap: false
                    //                            rotation : 15
                },
                //                        tooltip: {
                //
                //                            valueSuffix: '%',
                //                            pointFormat: '{point.code}: {point.value}'
                //                        },

                tooltip: {
                    headerFormat: '',
                    pointFormat: '<table><span style="font-size:10px">' + title + '</span><br/><tr><td style="color:{series.color};padding:0">{} </td>' +
                    '<td style="padding:0"><b>{point.code}: {point.value:.2f}</b></td></tr></table>',
                    footerFormat: '',
                    shared: true,
                    useHTML: true
                },


                point: {
                    events: {
                        click: function () {

                        },
                        mouseOver: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.refresh(brickKilnChart.series[1].data[this.index]);
                            //    brickKilnChart.series[1].data[this.index].setState('hover');
                            //}
                        },
                        mouseOut: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.hide();
                            //    brickKilnChart.series[1].data[this.index].setState();
                            //}
                        }
                    }
                }
            }
        ]
    });
}

function createMapNa(divid, title, dataClasses, values, ratioMap, mapData, realData) {

    var mapJoinArray = [];
    for (var j = 0; j < mapData.features.length; j++) {
        var obj = mapData.features[j].properties;
        if (ratioMap == 'ratiomap') {
            obj['ratio'] = values[j];
        } else if (ratioMap == 'percentagemap') {
            obj['percentage'] = values[j];
        }
        var count = 0;
        var search = _.where(realData, { Name: obj.name });
        if (search.length > 0) {
            count = search[0].Count;
        }
        mapJoinArray.push({
            "code": obj.name,
            "value": count
        });
    }

    return new Highcharts.Map({
        credits: false,
        chart: {
            renderTo: divid,
            borderWidth: 0,
            events: {
                load: function (event) {

                }
            }

        },
        title: {
            text: title,
            style: {
                color: '#000000',
                fontWeight: 'bold'
            }
        },

        mapNavigation: {
            enabled: true
            //                            enableDoubleClickZoomTo: true
        },

        legend: {
            title: {
                text: '',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            },
            align: 'right',
            itemStyle: {
                color: 'black',
                fontSize: "8px"
            },
            // verticalAlign: 'middle',
            floating: false,
            layout: 'vertical',
            backgroundColor: '#E0E0E0',
            valueDecimals: 0,
            width: 85,
            maxHeight: 150,
            symbolPadding: 5,
            itemDistance: 100,
            itemMarginBottom: -1,
            itemMarginTop: 0
            //                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            //                            symbolRadius: 0,
            //                            symbolHeight: 14
        },


        colorAxis: {
            dataClasses: dataClasses,
            //                    minColor : 'rgba(255, 204, 204, 1)',
            //                    maxColor : 'rgba(178, 0, 0, 0.8)',
            //                    tickInterval: 10,
            tickLength: 10,
            tickColor: 'rgba(178, 0, 0, 0.5)',
            tickWidth: 1
            //                    min: 1,
            //                    max: 100
        },

        xAxis: {
            minRange: 0.1
        },

        yAxis: {
            minRange: 0.1
        },

        series: [
            {
                data: mapJoinArray,
                mapData: mapData,
                joinBy: ["name", "code"],
                animation: true,
                name: 'Brick Kiln',
                states: {
                    hover: {
                        enabled: false,
                        borderColor: 'gray'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                    style: {
                        fontSize: fontSize + 'px',
                        //textShadow: "0 0 0px contrast,0 0 0px contrast"
                    },
                    allowOverlap: false
                    //                            rotation : 15
                },
                //                        tooltip: {
                //
                //                            valueSuffix: '%',
                //                            pointFormat: '{point.code}: {point.value}'
                //                        },

                tooltip: {
                    headerFormat: '',
                    pointFormat: '<table><span style="font-size:10px">' + title + '</span><br/><tr><td style="color:{series.color};padding:0">{} </td>' +
                    '<td style="padding:0"><b>{point.code}: {point.value:.2f}</b></td></tr></table>',
                    footerFormat: '',
                    shared: true,
                    useHTML: true
                },


                point: {
                    events: {
                        click: function () {

                        },
                        mouseOver: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.refresh(brickKilnChart.series[1].data[this.index]);
                            //    brickKilnChart.series[1].data[this.index].setState('hover');
                            //}
                        },
                        mouseOut: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.hide();
                            //    brickKilnChart.series[1].data[this.index].setState();
                            //}
                        }
                    }
                }
            }
        ]
    });
}

function createMapPp(divid, title, dataClasses, values, ratioMap, mapData, realData) {

    var mapJoinArray = [];
    for (var j = 0; j < mapData.features.length; j++) {
        var obj = mapData.features[j].properties;
        if (ratioMap == 'ratiomap') {
            obj['ratio'] = values[j];
        } else if (ratioMap == 'percentagemap') {
            obj['percentage'] = values[j];
        }
        var count = 0;
        var search = _.where(realData, { Name: obj.name });
        if (search.length > 0) {
            count = search[0].Count;
        }
        mapJoinArray.push({
            "code": obj.name,
            "value": count
        });
    }

    return new Highcharts.Map({
        credits: false,
        chart: {
            renderTo: divid,
            borderWidth: 0,
            events: {
                load: function (event) {

                }
            }

        },
        title: {
            text: title,
            style: {
                color: '#000000',
                fontWeight: 'bold'
            }
        },

        mapNavigation: {
            enabled: true
            //                            enableDoubleClickZoomTo: true
        },

        legend: {
            title: {
                text: '',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            },
            align: 'right',
            itemStyle: {
                color: 'black',
                fontSize: "8px"
            },
            // verticalAlign: 'middle',
            floating: false,
            layout: 'vertical',
            backgroundColor: '#E0E0E0',
            valueDecimals: 0,
            width: 85,
            maxHeight: 150,
            symbolPadding: 5,
            itemDistance: 100,
            itemMarginBottom: -1,
            itemMarginTop: 0
            //                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            //                            symbolRadius: 0,
            //                            symbolHeight: 14
        },


        colorAxis: {
            dataClasses: dataClasses,
            //                    minColor : 'rgba(255, 204, 204, 1)',
            //                    maxColor : 'rgba(178, 0, 0, 0.8)',
            //                    tickInterval: 10,
            tickLength: 10,
            tickColor: 'rgba(178, 0, 0, 0.5)',
            tickWidth: 1
            //                    min: 1,
            //                    max: 100
        },

        xAxis: {
            minRange: 0.1
        },

        yAxis: {
            minRange: 0.1
        },

        series: [
            {
                data: mapJoinArray,
                mapData: mapData,
                joinBy: ["name", "code"],
                animation: true,
                name: 'Brick Kiln',
                states: {
                    hover: {
                        enabled: false,
                        borderColor: 'gray'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                    style: {
                        fontSize: fontSize + 'px',
                        //textShadow: "0 0 0px contrast,0 0 0px contrast"
                    },
                    allowOverlap: false
                    //                            rotation : 15
                },
                //                        tooltip: {
                //
                //                            valueSuffix: '%',
                //                            pointFormat: '{point.code}: {point.value}'
                //                        },

                tooltip: {
                    headerFormat: '',
                    pointFormat: '<table><span style="font-size:10px">' + title + '</span><br/><tr><td style="color:{series.color};padding:0">{} </td>' +
                    '<td style="padding:0"><b>{point.code}: {point.value:.2f}</b></td></tr></table>',
                    footerFormat: '',
                    shared: true,
                    useHTML: true
                },


                point: {
                    events: {
                        click: function () {

                        },
                        mouseOver: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.refresh(brickKilnChart.series[1].data[this.index]);
                            //    brickKilnChart.series[1].data[this.index].setState('hover');
                            //}
                        },
                        mouseOut: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.hide();
                            //    brickKilnChart.series[1].data[this.index].setState();
                            //}
                        }
                    }
                }
            }
        ]
    });
}


function createMapPubjabDistrict(divid, title, dataClasses, values, ratioMap, mapData, realData, subtitle) {
    var mapJoinArray = [];
    for (var j = 0; j < mapData.features.length; j++) {
        var obj = mapData.features[j].properties;
        if (ratioMap == 'ratiomap') {
            obj['ratio'] = values[j];
        } else if (ratioMap == 'percentagemap') {
            obj['percentage'] = values[j];
        }
        var count = 0;
        var name = obj.distt_name.toUpperCase();
        var search = _.where(realData, { Name: name });
        if (search.length > 0) {
            count = search[0].Count;
        }
        mapJoinArray.push({
            "code": obj.distt_name.toLowerCase(),
            "value": parseFloat( count)
        });
    }



    //console.log( JSON.stringify( mapJoinArray));
    return new Highcharts.Map({
        credits: false,
        chart: {
            renderTo: divid,
            borderWidth: 0,
            events: {
                load: function (event) {

                }
            }

        },
        title: {
            text: title,
            style: {
                color: '#000000',
                fontSize: "15px"
                //fontWeight: 'bold',
            }
        },
        subtitle: {
            text: subtitle
        },
        mapNavigation: {
            enabled: true
            //                            enableDoubleClickZoomTo: true
        },
        legend: {
            title: {
                text: '',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                }
            },
            align: 'right',
            itemStyle: {
                color: 'black',
                fontSize: "8px"
            },
            // verticalAlign: 'middle',
            floating: false,
            layout: 'vertical',
            backgroundColor: '#E0E0E0',
            valueDecimals: 0,
            width: 85,
            maxHeight: 150,
            symbolPadding: 5,
            itemDistance: 100,
            itemMarginBottom: -1,
            itemMarginTop: 0
            //                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)'
            //                            symbolRadius: 0,
            //                            symbolHeight: 14
        },
        colorAxis: {
            dataClasses: dataClasses,
            //                    minColor : 'rgba(255, 204, 204, 1)',
            //                    maxColor : 'rgba(178, 0, 0, 0.8)',
            //                    tickInterval: 10,
            tickLength: 10,
            tickColor: 'rgba(178, 0, 0, 0.5)',
            tickWidth: 1
            //                    min: 1,
            //                    max: 100
        },
        xAxis: {
            minRange: 0.1
        },
        yAxis: {
            minRange: 0.1,
        },
        series: [
            {
                data: mapJoinArray,
                mapData: mapData,
                joinBy: ["name", "code"],
                animation: true,
                name: 'Brick Kiln',
                states: {
                    hover: {
                        enabled: false,
                        borderColor: 'gray'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.name}',
                    style: {
                        fontSize: fontSize + 'px',
                        //textShadow: "0 0 0px contrast,0 0 0px contrast"
                    },
                    allowOverlap: false
                    //                            rotation : 15
                },
                //                        tooltip: {
                //
                //                            valueSuffix: '%',
                //                            pointFormat: '{point.code}: {point.value}'
                //                        },

                tooltip: {
                    headerFormat: '',
                    pointFormat: '<table><span style="font-size:10px">' + title + '</span><br/><tr><td style="color:{series.color};padding:0">{} </td>' +
                    '<td style="padding:0"><b>{point.code}: {point.value:.2f}</b></td></tr></table>',
                    footerFormat: '',
                    shared: true,
                    useHTML: true
                },


                point: {
                    events: {
                        click: function () {

                        },
                        mouseOver: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.refresh(brickKilnChart.series[1].data[this.index]);
                            //    brickKilnChart.series[1].data[this.index].setState('hover');
                            //}
                        },
                        mouseOut: function () {
                            //if (chart1Loaded) {
                            //    brickKilnChart.tooltip.hide();
                            //    brickKilnChart.series[1].data[this.index].setState();
                            //}
                        }
                    }
                }
            }
        ]
    });
}
