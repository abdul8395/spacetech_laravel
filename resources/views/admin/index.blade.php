
@extends('main')

@section('content')
        <style>

            h3 {
                font-weight: 900;
            }

        
        </style>

    <input type="hidden" id="hidDataId" />
    <br />
    <br />

    <div class="col-md-12">
        <div class="col-md-3">
            <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Departments</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">

                        <select class="form-control" id="sel" onchange="fetch_select(this.value);" name="call_sign"><option value="0"></option><option value="1"> BUD0</option><option value="2">118RS</option><option value="3">23A01</option><option value="4">606RC</option><option value="5">A2B01</option><option value="6">AA001</option><option value="7">AA002</option><option value="8">AA003</option>
                        </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Divisions</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">
                            @Html.DropDownList("ddlDivisionSearch", (IEnumerable<SelectListItem>)ViewBag.DivisionTiles, null, new { @Id = "ddlDivisionSearch", @class = "select2", @multiple = "multiple", @style = "width:100%;", onchange = "getDistricts(this)" })

                        </div>
                    </div>
                </div>
            </div>
            <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Districts</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">
                            @Html.DropDownList("ddlDistrictsSearch", (IEnumerable<SelectListItem>)ViewBag.DistrictTiles, null, new { @Id = "ddlDistrictsSearch", @class = "select2", @multiple = "multiple", @style = "width:100%;", onchange = "getTehsils(this)" })
                        </div>
                    </div>
                </div>
            </div>
            <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Tehsils</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">
                            @Html.DropDownList("ddlTehsil", (IEnumerable<SelectListItem>)ViewBag.TehsilTiles, null, new { @Id = "ddlTehsil", @class = "select2", @multiple = "multiple", @style = "width:100%;" })

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <span class="btn btn-primary btn-block" onclick="LoadDataPage(null);">Search</span>
                <br />
                <span class="btn btn-block" style="background-color:black;color:white;" onclick="Reset();">Reset Filters</span>
            </div>
        </div>
        <div class="col-md-9">
            @include('Admin.loadData')
        </div>
    </div>
    <div class="tab-content col-md-10 col-md-offset-1">
        <div class="clearfix"></div><br /><br />
        <div id="Data_Grid"></div>
        <table class="table table-responsive" data-vertable="ver2" id="tblGrid"></table>
    </div>

    <div id="UpdateAccessModal" class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" style="width:60%;">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add File</h4>
                </div>
                <div class="modal-body">
                    <table class="table">
                        <tr>
                            <td><strong>Privacy Level</strong></td>
                            <td>
                                @Html.DropDownList("ddlPrivacyUpdate", new List<SelectListItem>
                                    {
                                        new SelectListItem{ Text="Public", Value = "Public" },
                                        new SelectListItem{ Text="Protected", Value = "Protected" },
                                        new SelectListItem{ Text="Private", Value = "Private" },
                                    }
                        , "-- Select Privact Level --", new { @Id = "ddlPrivacyUpdate", @class = "form-control ", @style = "width:100%;" })
                            </td>
                        </tr>


                    </table>
                </div>
                <div class="modal-footer">


                    <button type="button" class=" btn btn-success" style="color:white;" onclick="UpdateAccess()" id="btnUpdateAccess">Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>



        <script>
        function fetch_select(v){}
            function showUpdateAccessModal(id, pp) {
                $('#ddlPrivacyUpdate').val(pp);
                $('#hidDataId').val(id);
                $("#UpdateAccessModal").modal("show");
            }
            function Reset() {
                $('#ddlDptSearch').val(null);
                $('#ddlDptSearch').trigger('change');
                $('#ddlDivisionSearch').val(null);
                $('#ddlDivisionSearch').trigger('change');
                $('#ddlDistrictsSearch').val(null);
                $('#ddlDistrictsSearch').trigger('change');
                $('#ddlTehsil').val(null);
                $('#ddlTehsil').trigger('change');
            }
            $(document).on('click', '.panel-heading span.clickable', function (e) {
                var $this = $(this);
                if (!$this.hasClass('panel-collapsed')) {
                    $this.parents('.panel').find('.panel-body').slideUp();
                    $this.addClass('panel-collapsed');
                    $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                } else {
                    $this.parents('.panel').find('.panel-body').slideDown();
                    $this.removeClass('panel-collapsed');
                    $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                }
            })
            function RequestData(id) {
                var accessLevel = $('#ddlPrivacyUpdate').val();
                $.ajax({
                    type: "GET",
                    url: "/Admin/RequestData",
                    data: {
                        id: id
                    },
                    success: function (res) {
                        if (res == "true") {
                            autoLoader("Your Request is Sent Please Wait For Approval", "success", "Request Sent!");
                            LoadDataPage();
                            $('#hidDataId').val(null);
                        }
                        else {
                            autoLoader("Request can not be Sent", "error", "Error !");
                        }
                    },
                    error: function (err) {
                        autoLoader(err.statusText, "error", "Error !");
                    }
                });
            }
            function UpdateAccess() {
                var id = $('#hidDataId').val();
                var accessLevel = $('#ddlPrivacyUpdate').val();
                $.ajax({
                    type: "GET",
                    url: "/Admin/UpdateAccess",
                    data: {
                        id: id,
                        accessLevel: accessLevel
                    },
                    success: function (res) {
                        if (res == "true") {
                            autoLoader("Record Updated", "success", "Update !");
                            LoadDataPage();
                            $('#hidDataId').val(null);
                            $('#UpdateAccessModal').modal('hide');
                        }
                        else {
                            autoLoader("Record can not be Updated", "error", "Error !");
                        }
                    },
                    error: function (err) {
                        autoLoader(err.statusText, "error", "Error !");
                    }
                });
            }
            $(document).ready(function () {
                // LoadDataPage();

            });
            // function LoadDataPage(page) {
            //     var loaderId = showLoader("Loading Data..", "warning");
            //     var Departments = $('#ddlDptSearch').val();
            //     var Divisions = $('#ddlDivisionSearch').val();
            //     var Districts = $('#ddlDistrictsSearch').val();
            //     var Tehsils = $('#ddlTehsil').val();
            //     $.ajax({
            //         type: "POST",
            //         url: "/Admin/Load_DataPage",
            //         data: {
            //             page: page,
            //             Departments: Departments,
            //             Divisions: Divisions,
            //             Districts: Districts,
            //             Tehsils: Tehsils
            //         },
            //         success: function (res) {
            //             $("#tblData").html(res);
            //             hideLoader(loaderId);

            //         },
            //         error: function (err) {
            //             autoLoader(err.statusText, "error", "Error !");
            //         }
            //     });
            // }
            function getDistricts(elem) {
                var id = $(elem).val();
                var formData = new FormData();
                formData.append("Divisions", id);
                //alert(id);
                $.ajax({
                    type: "POST",
                    url: "/Admin/bind_combo_Districts",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) { bind_combo_Districts(data); },
                    error: function () {
                        autoLoader(res, "error");
                    }
                });
            }
            function bind_combo_Districts(data) {
                $("#ddlDistrictsSearch option:selected").prop("selected", false);
                $("#ddlDistrictsSearch option").remove();
                var markup = null;
                for (var x = 0; x < data.length; x++) {
                    markup += "<option value=" + data[x].district_id + ">" + data[x].district_name + "</option>";
                }
                $("#ddlDistrictsSearch").html(markup);
                $('#ddlDistrictsSearch').multiselect('rebuild');
            }
            function getTehsils(elem) {
                var id = $(elem).val();
                var formData = new FormData();
                formData.append("Districts", id);
                //alert(id);
                $.ajax({
                    type: "POST",
                    url: "/Admin/bind_combo_Tehsil",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) { bind_combo_Tehsil(data); },
                    error: function () {
                        autoLoader(res, "error");
                    }
                });
            }
            function bind_combo_Tehsil(data) {
                $("#ddlTehsil option:selected").prop("selected", false);
                $("#ddlTehsil option").remove();
                var markup = null;
                for (var x = 0; x < data.length; x++) {
                    markup += "<option value=" + data[x].tehsil_id + ">" + data[x].tehsil_name + "</option>";
                }
                $("#ddlTehsil").html(markup);
                $('#ddlTehsil').multiselect('rebuild');
            }
        </script>



@endsection