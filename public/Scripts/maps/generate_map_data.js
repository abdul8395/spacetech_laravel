var fontSize = 10;
//["#FBF8CD"
var ratioMapColors = ["#FBF8CD", "#adf442", "#41f443", "#00A600", "#41f4a6", "#41f47c", "#649CFC", "#0454FC", "#0444CC", "#04349C", "#042464", "#281E5B", "#022C3A"];//#CCDCFC => 0
var ratioCounts;
var percentageCounts;

function gis_data_percentage(chartData) {
    chartData = chartData.sort(compare);
    var chart_data_gis = [];
    for (var i = 0; i < chartData.length; i++) {
        chart_data_gis[i] = chartData[i].Count;
    }
    //console.log(chart_data_gis);
    return chart_data_gis;
}


function compare(a, b) {
    if (a.name < b.name)
        return -1;
    else if (a.name > b.name)
        return 1;
    else
        return 0;
}

function show_maps(div, chartData1, gisData, title) {
    var percentageCounts = { "zero": 0, "first": 0, "second": 0, "third": 0, "fourth": 0 };
    var percentageMapValues = gis_data_percentage(chartData1);
    //console.log(percentageMapValues);
    for (var i in percentageMapValues) {
        var val = percentageMapValues[i];
        if (val === -1) {
            percentageCounts.zero += 1;
        } else if (val >= 0 && val <= 25) {
            percentageCounts.first += 1;
        } else if (val > 25 && val <= 50) {
            percentageCounts.second += 1;
        } else if (val > 50 && val <= 75) {
            percentageCounts.third += 1;
        } else if (val > 75 && val <= 100) {
            percentageCounts.fourth += 1;
        }
    }

    var percentageMapClasses = [
        {
            to: -1,
            color: ratioMapColors[0],
            name: "No Data (" + percentageCounts.zero + ")"
        },
        {
            from: 0,
            to: 25,
            name: "0 - 25 % (" + percentageCounts.first + ")",
            color: ratioMapColors[1]
        },
        {
            from: 25.0000000000001,
            to: 50,
            name: "25 - 50 % (" + percentageCounts.second + ")",
            color: ratioMapColors[2]
        },

        {
            from: 50.0000000000001,
            to: 75,
            name: "50 - 75 % (" + percentageCounts.third + ")",
            color: ratioMapColors[3]
        },
        {
            from: 75.0000000000001,
            to: 100,
            name: "75 - 100 % (" + percentageCounts.fourth + ")",
            color: ratioMapColors[4]
        }
    ];
    createMap(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData);
    //createMapManual(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData, chartData1);
}

function generate_mapdata_province(div, chartData1, gisData, title) {
    var percentageCounts = { "zero": 0, "first": 0, "second": 0, "third": 0, "fourth": 0 };
    var percentageMapValues = gis_data_percentage(chartData1);

    for (var i in percentageMapValues) {
        var val = percentageMapValues[i];
        if (val <= 0) {
            percentageCounts.zero += 1;
        } else if (val > 0 && val <= 25) {
            percentageCounts.first += 1;
        } else if (val > 25 && val <= 50) {
            percentageCounts.second += 1;
        } else if (val > 50 && val <= 75) {
            percentageCounts.third += 1;
        } else if (val > 75 && val <= 100) {
            percentageCounts.fourth += 1;
        }
    }

    var percentageMapClasses = [
        {
            from:-1,
            to: 0,
            color: ratioMapColors[0],
            name: "No Data (" + percentageCounts.zero + ")"
        },
        {
            from: 0.1,
            to: 25,
            name: "0 - 25 % (" + percentageCounts.first + ")",
            color: ratioMapColors[1]
        },
        {
            from: 25.0000000000001,
            to: 50,
            name: "25 - 50 % (" + percentageCounts.second + ")",
            color: ratioMapColors[2]
        },

        {
            from: 50.0000000000001,
            to: 75,
            name: "50 - 75 % (" + percentageCounts.third + ")",
            color: ratioMapColors[3]
        },
        {
            from: 75.0000000000001,
            to: 100,
            name: "75 - 100 % (" + percentageCounts.fourth + ")",
            color: ratioMapColors[4]
        }
    ];
    //createMap(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData);
    createMapProvince(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData, chartData1);
}

function generate_mapdata_division(div, chartData1, gisData, title) {
    var percentageCounts = { "zero": 0, "first": 0, "second": 0, "third": 0, "fourth": 0 };
    var percentageMapValues = gis_data_percentage(chartData1);
    
    for (var i in percentageMapValues) {
        var val = percentageMapValues[i];
        if (val <= 0) {
            percentageCounts.zero += 1;
        } else if (val > 0 && val <= 25) {
            percentageCounts.first += 1;
        } else if (val > 25 && val <= 50) {
            percentageCounts.second += 1;
        } else if (val > 50 && val <= 75) {
            percentageCounts.third += 1;
        } else if (val > 75 && val <= 100) {
            percentageCounts.fourth += 1;
        }
    }

    var percentageMapClasses = [
        {
            from: -1,
            to: 0,
            color: ratioMapColors[0],
            name: "No Data (" + percentageCounts.zero + ")"
        },
        {
            from: 0.1,
            to: 25,
            name: "0 - 25 % (" + percentageCounts.first + ")",
            color: ratioMapColors[1]
        },
        {
            from: 25.0000000000001,
            to: 50,
            name: "25 - 50 % (" + percentageCounts.second + ")",
            color: ratioMapColors[2]
        },

        {
            from: 50.0000000000001,
            to: 75,
            name: "50 - 75 % (" + percentageCounts.third + ")",
            color: ratioMapColors[3]
        },
        {
            from: 75.0000000000001,
            to: 100,
            name: "75 - 100 % (" + percentageCounts.fourth + ")",
            color: ratioMapColors[4]
        }
    ];
    //createMap(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData);
    createMapDivision(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData, chartData1);
}

function generate_mapdata_district(div, chartData1, gisData, title) {
    //console.log(gisData);
    var percentageCounts = { "zero": 0, "first": 0, "second": 0, "third": 0, "fourth": 0 };
    var percentageMapValues = gis_data_percentage(chartData1);
    //console.log(percentageMapValues);
    for (var i in percentageMapValues) {
        var val = percentageMapValues[i];
        if (val <= 0) {
            percentageCounts.zero += 1;
        } else if (val > 0 && val <= 25) {
            percentageCounts.first += 1;
        } else if (val > 25 && val <= 50) {
            percentageCounts.second += 1;
        } else if (val > 50 && val <= 75) {
            percentageCounts.third += 1;
        } else if (val > 75 && val <= 100) {
            percentageCounts.fourth += 1;
        }
    }

    var percentageMapClasses = [
        {
            from: -1,
            to: 0,
            color: ratioMapColors[0],
            name: "No Data (" + percentageCounts.zero + ")"
        },
        {
            from: 0.1,
            to: 25,
            name: "0 - 25 % (" + percentageCounts.first + ")",
            color: ratioMapColors[1]
        },
        {
            from: 25.0000000000001,
            to: 50,
            name: "25 - 50 % (" + percentageCounts.second + ")",
            color: ratioMapColors[2]
        },

        {
            from: 50.0000000000001,
            to: 75,
            name: "50 - 75 % (" + percentageCounts.third + ")",
            color: ratioMapColors[3]
        },
        {
            from: 75.0000000000001,
            to: 100,
            name: "75 - 100 % (" + percentageCounts.fourth + ")",
            color: ratioMapColors[4]
        }
    ];
    createMapDistrict(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData, chartData1);
}

function generate_mapdata_na(div, chartData1, gisData, title) {
    //console.log(gisData);
    var percentageCounts = { "zero": 0, "first": 0, "second": 0, "third": 0, "fourth": 0 };
    var percentageMapValues = gis_data_percentage(chartData1);
    //console.log(percentageMapValues);
    for (var i in percentageMapValues) {
        var val = percentageMapValues[i];
        if (val <= 0) {
            percentageCounts.zero += 1;
        } else if (val > 0 && val <= 25) {
            percentageCounts.first += 1;
        } else if (val > 25 && val <= 50) {
            percentageCounts.second += 1;
        } else if (val > 50 && val <= 75) {
            percentageCounts.third += 1;
        } else if (val > 75 && val <= 100) {
            percentageCounts.fourth += 1;
        }
    }

    var percentageMapClasses = [
        {
            from: -1,
            to: 0,
            color: ratioMapColors[0],
            name: "No Data (" + percentageCounts.zero + ")"
        },
        {
            from: 0.1,
            to: 25,
            name: "0 - 25 % (" + percentageCounts.first + ")",
            color: ratioMapColors[1]
        },
        {
            from: 25.0000000000001,
            to: 50,
            name: "25 - 50 % (" + percentageCounts.second + ")",
            color: ratioMapColors[2]
        },

        {
            from: 50.0000000000001,
            to: 75,
            name: "50 - 75 % (" + percentageCounts.third + ")",
            color: ratioMapColors[3]
        },
        {
            from: 75.0000000000001,
            to: 100,
            name: "75 - 100 % (" + percentageCounts.fourth + ")",
            color: ratioMapColors[4]
        }
    ];
    createMapNa(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData, chartData1);
}

function generate_mapdata_pp(div, chartData1, gisData, title) {
    //console.log(gisData);
    var percentageCounts = { "zero": 0, "first": 0, "second": 0, "third": 0, "fourth": 0 };
    var percentageMapValues = gis_data_percentage(chartData1);
    //console.log(percentageMapValues);
    for (var i in percentageMapValues) {
        var val = percentageMapValues[i];
        if (val <= 0) {
            percentageCounts.zero += 1;
        } else if (val > 0 && val <= 25) {
            percentageCounts.first += 1;
        } else if (val > 25 && val <= 50) {
            percentageCounts.second += 1;
        } else if (val > 50 && val <= 75) {
            percentageCounts.third += 1;
        } else if (val > 75 && val <= 100) {
            percentageCounts.fourth += 1;
        }
    }

    var percentageMapClasses = [
        {
            from: -1,
            to: 0,
            color: ratioMapColors[0],
            name: "No Data (" + percentageCounts.zero + ")"
        },
        {
            from: 0.1,
            to: 25,
            name: "0 - 25 % (" + percentageCounts.first + ")",
            color: ratioMapColors[1]
        },
        {
            from: 25.0000000000001,
            to: 50,
            name: "25 - 50 % (" + percentageCounts.second + ")",
            color: ratioMapColors[2]
        },

        {
            from: 50.0000000000001,
            to: 75,
            name: "50 - 75 % (" + percentageCounts.third + ")",
            color: ratioMapColors[3]
        },
        {
            from: 75.0000000000001,
            to: 100,
            name: "75 - 100 % (" + percentageCounts.fourth + ")",
            color: ratioMapColors[4]
        }
    ];
    createMapPp(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData, chartData1);
}

function generate_mapdata_district_all(div, chartData1, gisData, title, subtitle) {
    //console.log(gisData);
    var percentageCounts = { "zero": 0, "first": 0, "second": 0, "third": 0, "fourth": 0 };
    var percentageMapValues = gis_data_percentage(chartData1);

    var min = _.min(percentageMapValues);
    var max = _.max(percentageMapValues);
    var avg = (parseFloat(max) - parseFloat(min)) / 2;
    var one = parseFloat(avg) * 1;
    var two = parseFloat(avg) * 2;
    var three = parseFloat(avg) * 3;
    var four = parseFloat(avg) * 4;
    //console.log(percentageMapValues);
    for (var i in percentageMapValues) {
        var val = percentageMapValues[i];
        if (val <= 0) {
            percentageCounts.zero += 1;
        } else if (val > 0 && val <= one) {
            percentageCounts.first += 1;
        } else if (val > one && val <= two) {
            percentageCounts.second += 1;
        } else if (val > two && val <= three) {
            percentageCounts.third += 1;
        } else if (val > three && val <= four) {
            percentageCounts.fourth += 1;
        }
    }

    var percentageMapClasses = [
        {
            from: -1,
            to: 0,
            color: ratioMapColors[0],
            name: "No Data (" + percentageCounts.zero + ")"
        },
        {
            from: 0.1,
            to: one,
            name: "0 - " + one + " (" + percentageCounts.first + ")",
            color: ratioMapColors[1]
        },
        {
            from: one + 0.1,
            to: two,
            name: one + " - " + two +" (" + percentageCounts.second + ")",
            color: ratioMapColors[2]
        },

        {
            from: two + 0.1,
            to: three,
            name: two + " - " + three + " (" + percentageCounts.third + ")",
            color: ratioMapColors[3]
        },
        {
            from: three + 0.1,
            to: four,
            name: three + " - " + four + " (" + percentageCounts.fourth + ")",
            color: ratioMapColors[4]
        }
    ];
    createMapPubjabDistrict(div, title, percentageMapClasses, percentageMapValues, 'percentagemap', gisData, chartData1, subtitle);
}