var CommonJs = function () {
    return {
        Shuffle: function (array) {
            var m = array.length, t, i;
            // While there remain elements to shuffle…
            while (m) {

                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            return array;
        }
    }
}();
var RoleManager = function () { 
    return {
        Create: function (name) {
            $.ajax({
                type: "POST",
                url: "/Account/CreateRole",
                data: {
                    name: name
                },
                success: function (res) {
                    if (res.Status === "200") {
                        autoLoader(res.Response, "success", "Created");
                    } else {
                        autoLoader(res.Response, "error", "Error");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error");
                }
            });
        }
    }
}();

var Mask = function () {
    return {
        Show: function () {
            $("#divMask").fadeIn();
        },
        Hide: function () {
            $("#divMask").fadeOut();
        },
        ShowOnDiv: function (id) {
            $(id).fadeIn();
        },
        HideOnDiv: function (id) {
            $(id).fadeOut();
        }
    }
}();

$(document).ready(function () {
    //SweetAlert.init();
    makeDatePicker();
    //dateEvents();
});

var makeDatePicker = function () {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (month < 10 ? '0' : '') + (day < 10 ? '0' : '') + day + '/' + month + '/' + d.getFullYear();
    $(".datepicker").each(function (i, o) {
        $(o).datepicker({
            format:"dd-M-yy",
            orientation: "left",
            autoclose: true
        });
        $(o).datepicker('setDate', output);
    });
}

function isNumeric(event) {
    var key = window.event ? event.keyCode : event.which;


    if (key === 46) {
        return true;
    }

    if (event.keyCode === 8 || event.keyCode === 46
     || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 9) {


        return true;
    }
    else if (key < 48 || key > 57) {
        return false;
    }
    else return true;
}
function isNumericPhone(event, dom) {
    var val = $(dom).val();
    var valid = false;
    var key = window.event ? event.keyCode : event.which;
    if (key === 46) {
        valid = true;
    }
    if (event.keyCode === 8 || event.keyCode === 46
     || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 9) {
        valid = true;
    }
    else if (key < 48 || key > 57) {
        valid = false;
    }
    else valid = true;
    return valid;
}
function isAlphabetic(event) {

    var key = window.event ? event.keyCode : event.which;

    if (key === 46 || key === 32) {
        return true;
    }
    if (event.keyCode === 8 || event.keyCode === 46
     || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 9) {


        return true;
    }

    else if (key < 65 || key > 90) {
        if (key > 96 && key < 123) {
            return true;
        } else {
            return false;
        }


    }
    else return true;
}

function isPhoneNumber(event) {
    var key = window.event ? event.keyCode : event.which;

    if (key === 46 || key === 43) {
        return true;
    }
    if (event.keyCode === 8 || event.keyCode === 46
     || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 107 || event.keyCode === 9) {


        return true;
    }
    else if (key < 48 || key > 57) {
        return false;
    }
    else return true;
}

function isDate(event) {
    var key = window.event ? event.keyCode : event.which;

    if (key === 46 || key === 43) {
        return true;
    }
    if (event.keyCode === 8 || event.keyCode === 46
        || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 107 || event.keyCode === 9) {


        return true;
    }
    else return false;
}

function validateEmail(email) {
    var result = "";
    if (email !== "") {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (!(filter.test(email)))
            return false;
        else
            return true;
    }
    else
        return false;
}

var $toast;
var $toastJsonArray = [];
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "0",
    "extendedTimeOut": "0",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
function showLoader(msg, type, Title) {
    var title = "";
    if (type == undefined || type == null || type == "") {
        type = "info";
    }
    if (Title != undefined && Title != null && Title != "") {
        title = Title;
    } else {
        switch (type) {
            case "info":
                title = "Wait...";
                break;
            case "warning":
                title = "Wait...";
                break;
            case "success":
                title = "Success...";
                break;
            case "error":
                title = "Error...";
                break;
            default:
                title = "Wait...";
                break;
        }
    }
    var randomId = randomString(30);
    if (type !== undefined && type !== null && type !== "") {
        $toast = toastr[type](msg, title);
        //$toastArray.push($toast);
        var t = { "toast": $toast, "id": randomId };
        $toastJsonArray.push(t);
    }
    else {
        $toast = toastr["info"](msg, title);
        //$toastArray.push($toast);
        var t = { "toast": $toast, "id": randomId };
        $toastJsonArray.push(t);
    }
    return randomId;
}

function hideLoader(id) {
    if (id === undefined || id === null || id === "") {
        if ($toastJsonArray.length > 0) {
            $toastJsonArray[0].toast.remove();
            $toastJsonArray.splice(0, 1);
        }
    } else {
        var loader = findLoader(id);
        var toast = loader.toast;
        toast.remove();
    }
}

function autoLoader(msg, type, Title) {
    var title = "";
    if (type == undefined || type == null || type == "") {
        type = "info";
    }
    var $gr;
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    if (Title != undefined && Title != null && Title != "") {
        title = Title;
    } else {
        switch (type) {
            case "info":
                title = "Wait...";
                break;
            case "warning":
                title = "Wait...";
                break;
            case "success":
                title = "Success...";
                break;
            case "error":
                title = "Error...";
                break;
            default:
                title = "Wait...";
                break;
        }
    }

    if (type !== "") {
        $gr = toastr[type](msg, title);
    }
    else {
        $gr = toastr["info"](msg, title);
    }
    setTimeout(function () {
        $gr.remove();
    }, "5000");
}

function findLoader(key) {
    for (var i = 0; i < $toastJsonArray.length; i++) {
        if ($toastJsonArray[i].id === key) {
            return $toastJsonArray[i];
        }
    }
}

function wordCountKeyPress(event, elem, maxWords) {
    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode === 8 || event.keyCode === 46
     || event.keyCode === 37 || event.keyCode === 39) {
        return true;
    } else {
        var wordcount = 0;
        wordcount = $(elem).val().split(/\b[\s,\.-:;]*/).length;
        if (wordcount > maxWords) {
            return false;
        } else {
            return true;
        }
    }

}

/** Below two functions are used for word count functoinality in suggestions/comments form, so that
    user cannot type more then 50 characters in the suggestion/complains text box**/
function wordCount(value, maxWords) {
    var wordcount = 0;
    wordcount = value.split(/\b[\s,\.-:;]*/).length;
    if (wordcount > maxWords) {
        return false;
    } else {
        return true;
    }
}

function wordCountKeyUp(field, remainingId) {
    var fieldLen = field.value.length;
    console.log(fieldLen);
    $('#' + remainingId).html(fieldLen + " Characters...");
    if (field.value.length > 300) {
        field.value = field.value.substring(0, 300);
    }
}

function randomString(stringLength) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = "";
    for (var i = 0; i < stringLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

function randomInteger(stringLength) {
    var chars = "0123456789";
    var randomstring = "";
    for (var i = 0; i < stringLength; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

function getExt(filename) {
    var ext = filename.split('.').pop();
    if (ext === filename) return "";
    return ext.toLowerCase().toString();
}

function addComas(input) {

    var data = input.split(".");

    var data3 = reverseString(data[0]);
    var data2 = data3.replace(/,/g, "");
    var value = data2.split("");
    var strLength = data2.length;
    var tempaar = "";
    for (var i = strLength; i > 0; i--) {
        if (i % 3 === 0 && i !== strLength) {
            tempaar += ",";
            tempaar += value[i - 1];
        }
        else {
            tempaar += value[i - 1];
        }
    }
    if (data.length > 1) {
        tempaar = tempaar + "." + data[1];
    }
    return tempaar;
}

function reverseString(s) {
    return s.split("").reverse().join("");
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageUrl = decodeURIComponent(window.location.search.substring(1)),
        sUrlVariables = sPageUrl.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sUrlVariables.length; i++) {
        sParameterName = sUrlVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var removeHtmlTags = function (html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

/*Generate captcha for the suggestions/Comments forms*/
function getCaptcha() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 6;
    var captcha = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        captcha += chars.substring(rnum, rnum + 1);
    }
    return captcha;
}

var validateData = function (formName, excludedNames) {
    var er = 0;

    if (formName !== undefined && formName !== null && formName !== "") {
        $("#" + formName + " .validate").each(function (index, elem) {

            var match = false;
            if (excludedNames !== undefined && excludedNames !== null && excludedNames !== "") {
                var exist = excludedNames.indexOf($(elem).attr("id"));
                if (exist !== -1) {
                    match = true;
                }
            }
            if (!match) {
                var value = $(elem).val();
                var email = $(elem).hasClass("email");
                var select2 = $(elem).hasClass("select2");
                if (email) {
                    if (!validateEmail(value)) {
                        $(elem).addClass("error-border");
                        er++;
                    } else {
                        $(elem).removeClass("error-border");
                    }
                } else if (select2) {

                    if (value === undefined || value === null || value === "") {
                        $(elem).next().find(".select2-selection").addClass("error-border");
                        er++;
                    } else {
                        $(elem).next().find(".select2-selection").removeClass("error-border");
                    }
                } else {
                    if (value === "") {
                        $(elem).addClass("error-border");
                        er++;
                    } else {
                        $(elem).removeClass("error-border");
                    }
                }
            }
        });
    }
    else {
        $(".validate").each(function (index, elem) {

            var match = false;
            if (excludedNames !== undefined && excludedNames !== null && excludedNames !== "") {
                var exist = excludedNames.indexOf($(elem).attr("id"));
                if (exist !== -1) {
                    match = true;
                }
            }
            if (!match) {
                var value = $(elem).val();
                var email = $(elem).hasClass("email");
                var select2 = $(elem).hasClass("select2");
                if (email) {
                    if (!validateEmail(value)) {
                        $(elem).addClass("error-border");
                        er++;
                    } else {
                        $(elem).removeClass("error-border");
                    }
                } else if (select2) {

                    if (value === undefined || value === null || value === "") {
                        $(elem).next().find(".select2-selection").addClass("error-border");
                        er++;
                    } else {
                        $(elem).next().find(".select2-selection").removeClass("error-border");
                    }
                } else {
                    if (value === "") {
                        $(elem).addClass("error-border");
                        er++;
                    } else {
                        $(elem).removeClass("error-border");
                    }
                }
            }
        });
    }


    if (er > 0) {
        return false;
    } else {
        return true;
    }
}

var serializeFormToJson = function (formId, excludedNames) {
    var o = {};
    var a = $("#" + formId).serializeArray();
    var names = [];
    if (excludedNames !== undefined && excludedNames !== null && excludedNames !== "") {
        names = excludedNames.split(",");
    }
    $.each(a, function () {
        var match = false;
        var exist = $.inArray(this.name, names) //excludedNames.indexOf(this.name);
        if (exist !== -1) {
            match = true;
        }
        if (match === false) {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        }
    });
    return o;
}

var resetData = function () {
    $(".validate").each(function (index, elem) {
        var select2 = $(elem).hasClass("select2");
        if (select2) {
            $(elem).val('').change();
        } else {
            $(elem).val("");
        }
    });
}

function hexToRgb(hexCode) {
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hexCode);
    var rgb = "rgb(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + ")";
    return rgb;
}

function hexToRgba(hexCode, opacity) {
    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
    var matches = patt.exec(hexCode);
    var rgb = "rgba(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + "," + opacity + ")";
    return rgb;
}

var getDate_dd_MMM_yyyy_From_Server = function (date) {
    if (date !== undefined && date !== null && date !== "") {
        var date1 = new Date(parseInt(date.substr(6)))
        var d = date1.toString('dd-MMM-yyyy')
        return d;
    } else {
        date
    }
}

var getDate_dd_MMM_yyyy_From_DateString = function (date) {
    if (date !== undefined && date !== null && date !== "") {
        var date1 = new Date(date)
        var d = date1.toString('dd-MMM-yyyy')
        return d;
    } else {
        date
    }
}

function CreateDropDown(data, dropdown, type) {
    var markup = "<option value=''>--Select " + type + "--</option>";
    for (var x = 0; x < data.length; x++) {
        markup += "<option value=" + data[x].Id + ">" + data[x].Text + "</option>";
    }
    $("#" + dropdown).html(markup).show();
}
var checkMain = function () {
    if ($('.chkFile:checked').length == $('.chkFile').length) {
        $("#checkAll").prop('checked', true);
    }
    else {
        $("#checkAll").prop('checked', false);
    }
}

var validionTwoDatePicker = function () {
    var start_date = $("#txtStartDate").val();
    var end_date = $("#txtEndDate").val();
    if (start_date > end_date) {
        $("#txtEndDate").val("");
    }
    $(".validDatepicker").each(function (i, o) {
        $(o).datepicker({
            format: "dd/mm/yyyy",
            orientation: "left",
            autoclose: true
        });
        $(o).datepicker('setStartDate', start_date);
    });
}

var removeSpecialChars = function (str) {
    return str.replace(/(?!\w|\s)./g, '')
        .replace(/\s+/g, ' ')
        .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}
//var dateEvents = function () {
//    $(".onchange-event").each(function (i, o) {
//        $(o).change(function () {
//            var start_date = $(o).val();
//            var el = $(o).parent().parent().find(".onclick-event").attr("id");
//            var end_date = $("#" + el).val();
//            if (start_date > end_date) {
//                $("#" + el).val("");
//            }
//            $("#" + el).datepicker('setStartDate', start_date);
//        });
//    });
//}
var scrollToElement = function (elem) {
    $('html, body').animate({
        scrollTop: $("#" + elem).offset().top - 100
    }, 1000);
}

var replaceBrakAndTab = function (str) {
    str = str.replace(/\\n/g, '');
    str = str.replace(/\\t/g, '');
    return str;
}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var Loader = function () {
    return {
        Show: function (divId) {
            $(`#${divId}`).prepend(`<div class="loader-holder"><div class="loader"></div></div>  `);
            $(`#${divId}`).addClass("loader-mask");
        },
        Hide: function (divId) {
            $(`#${divId}`).find(".loader-holder").remove();
            $(`#${divId}`).removeClass("loader-mask");
        }
    }
}();