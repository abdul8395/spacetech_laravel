

$(function () {

    App.init();


    //$('#example2').DataTable({
    //    'paging': true,
    //    'lengthChange': false,
    //    'searching': false,
    //    'ordering': true,
    //    'info': true,
    //    'autoWidth': false
    //});

});


var App = function () {
    return {
        init: function () {
            //_.templateSettings = {
            //    interpolate: /\{\{(.+?)\}\}/g
            //};
            // $(".select2").each(function (i, o) {
            //     var placeholder = $(o).data("placeholder");
            //     var onunselect = $(o).data("onunselect");
            //     $(o).select2({
            //         placeholder: placeholder,
            //         allowClear: true
            //     }).on("select2:unselect", function (e) {
            //         if (onunselect !== undefined && onunselect !== null && onunselect !== "") {
            //             var fn = window[onunselect];
            //             fn(e);
            //         }
            //     });
                //$(o).val(null).trigger("change");
                //$(o).select2("val", null).trigger("change");
            });

            //$('[data-mask]').inputmask();

            // $('.datepicker').datepicker({
            //     autoclose: true
            // });
            // $(".datepicker-year").datepicker({
            //     format: "yyyy",
            //     viewMode: "years",
            //     minViewMode: "years",
            //     autoclose: true
            // });

            //$('.timepicker').each(function (i, e) {

            //    $(e).timepicker({
            //        showInputs: false,
            //        defaultTime: false
            //    });
            //});
            //$('.timepicker').timepicker({
            //    showInputs: false,
            //    defaultTime: false
            //});

            //Date range picker
            //$('.dateRangePicker').daterangepicker();

            //$('.editor').wysihtml5()
        },
        Make_Select2: function (className) {
            $("." + className).each(function (i, o) {
                var placeholder = $(o).data("placeholder");
                var onunselect = $(o).data("onunselect");
                $(o).select2({
                    placeholder: placeholder,
                    allowClear: true
                }).on("select2:unselect", function (e) {
                    if (onunselect !== undefined && onunselect !== null && onunselect !== "") {
                        var fn = window[onunselect];
                        fn(e);
                    }
                });
                //$(o).val(null).trigger("change");
                //$(o).select2("val", null).trigger("change");
            });
        },
        Make_TimePicker: function () {
            $('.timepicker').timepicker({
                showInputs: false,
                defaultTime: false
            });
        }
    }
}();

var Maps = function () {
    return {
        GetData: function () {
            var _this = this;
            $.get("/geojson/division_2017.json", {  },
                function (data, textStatus, jqXHR) {
                    //console.log(data);
                    var features = data.features;
                    var length = Math.ceil( features.length / 5 );
                    //console.log(length);
                    for (var i = 0; i < features.length; i = i + length) {
                        var array = _this.SliceArray(features, i, i + length);
                        //_this.SendArrayToServer_Division(array);
                        //_this.SendArrayToServer_District(array);
                        //console.log(array);
                    }
                },
                "json"
            );
        },
        SliceArray: function (arr, start, end) {
            var ar2 = arr.slice(start, end);
            return ar2;
        },
        SendArrayToServer_District: function (arr) {
            var jsonArray = [];
            $.each(arr, function (i, e) {
                var temp = {
                    "Type": e.type,
                    "Geometry": JSON.stringify(e.geometry),
                    "Properties": JSON.stringify(e.properties),
                    "ProvinceCode": e.properties.prov_code,
                    "DivisionCode": e.properties.div_code,
                    "DistrictCode": e.properties.dist_code,
                    "Year": e.properties.year,
                    "Population": e.properties.population
                };
                jsonArray.push(temp);
            });
            
            $.ajax({
                type: "POST",
                url: "/Generics/SaveGeoJson",
                data: {
                    json: JSON.stringify(jsonArray)
                },
                success: function (data) {

                },
                error: function (err) {
                    console.log(err.textStatus);
                }
            });
        },
        SendArrayToServer_Division: function (arr) {
            var jsonArray = [];
            $.each(arr, function (i, e) {
                var temp = {
                    "Type": e.type,
                    "Geometry": JSON.stringify(e.geometry),
                    "Properties": JSON.stringify(e.properties),
                    "ProvinceCode": e.properties.prov_code,
                    "DivisionCode": e.properties.div_code,
                    "DistrictCode": null,
                    "Year": e.properties.year,
                    "Population": e.properties.population
                };
                jsonArray.push(temp);
            });

            $.ajax({
                type: "POST",
                url: "/Generics/SaveGeoJson",
                data: {
                    json: JSON.stringify(jsonArray)
                },
                success: function (data) {

                },
                error: function (err) {
                    console.log(err.textStatus);
                }
            });
        }
    }
}();
//swal({
//    title: "Delete",
//    text: "Are you sure to delete?",
//    type: "warning",
//    allowOutsideClick: true,
//    showConfirmButton: true,
//    showCancelButton: true,
//    confirmButtonClass: "btn-success",
//    cancelButtonClass: "btn-danger",
//    confirmButtonText: "Yes",
//    cancelButtonText: "No",
//},
//	function (isConfirm) {
//	    console.log(isConfirm);
//	    if (isConfirm) {
//	        var loader = showLoader("Please wait...", "info");
//	        $.ajax({
//	            type: "POST",
//	            url: "/Fms/DeleteFile",
//	            data: {
//	                id: id
//	            },
//	            success: function (res) {
//	                hideLoader(loader);
//	                if (res.Status === "success") {
//	                    swal("Deleted", res.Response, "success");
//	                    drawLaodFiles();
//	                } else {
//	                    swal("Error", res.Response, "error");
//	                }
//	            },
//	            error: function (err) {
//	                swal("Error", err.statusText, "error");
//	            }
//	        });

//	    } else {

//	    }
//	});