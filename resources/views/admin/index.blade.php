
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
                            <select id="deps" class="select2" name="dep" multiple="multiple" style="width:500px;">
                            
                                @foreach($deps as $id => $n)
                                    <option value="{{$id}}">{{$n}}</option>
                                @endforeach

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
                            <select id="divis" class="select2" name="divi" multiple="multiple" style="width:500px;">
                                @foreach($divs as $id => $n)
                                    <option value="{{$id}}">{{$n}}</option>
                                @endforeach
                            </select>
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
                            <select id="dists" class="select2" name="dist" multiple="multiple" style="width:500px;">
                             
                            </select>
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
                            <select id="tehs" class="select2" name="teh" multiple="multiple" style="width:500px;">
                               
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <span id="srchbtn" class="btn btn-primary btn-block" >Search</span>
                <br />
                <span class="btn btn-block" style="background-color:black;color:white;" onclick="Reset();">Reset Filters</span>
            </div>
        </div>
        <div class="col-md-9">
        <div id="tblData"></div>
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
          
         $(document).ready(function () {
            // $.ajaxSetup({
            //     headers: {
            //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            //     }
            // });       
            LoadDataPage();
            // $('.jqselect2').select2();
            $('.select2').select2({

            });
            // $('#departments').select2({
            //     // placeholder: 'Select Departments'
            // });

            $('select[name="divi"]').on('change',function(e){
                e.preventDefault();
                var divids= $(this).val();
                console.log(divids);
                if(divids)
                {
                    $.ajax({
                        url : 'district/' +JSON.stringify(divids),
                        type : "GET",
                        dataType : "json",
                        success:function(data){
                            // console.log(data);
                            $('select[name="dist"]').empty();
                            for(var i=0;i<data.length;i++){
                                $('select[name="dist"]').append('<option value="'+ data[i].district_id +'">'+ data[i].district_name +'</option>');
                            }
                        }
                    });
                }
                else
                {
                    $('select[name="dist"]').empty();
                }
            });
            $('select[name="dist"]').on('change',function(e){
                e.preventDefault();
                var distds= $(this).val();
                // console.log(divids);
                if(distds)
                {
                    $.ajax({
                        url : 'tehsil/' +JSON.stringify(distds),
                        type : "GET",
                        dataType : "json",
                        success:function(data){
                            // console.log(data);
                            $('select[name="distds"]').empty();
                            for(var i=0;i<data.length;i++){
                                $('select[name="teh"]').append('<option value="'+ data[i].tehsil_id +'">'+ data[i].tehsil_name +'</option>');
                            }
                        }
                    });
                }
                else
                {
                    $('select[name="teh"]').empty();
                }
            });

            $('#srchbtn').on('click',function(){
                
                // e.preventDefault();
                var loaderId = showLoader("Loading Data..", "warning");
                var alldata={
                        // page: page,
                        Departments: $('#deps').val(),
                        Divisions: $('#divis').val(),
                        Districts: $('#dists').val(),
                        Tehsils: $('#tehs').val(),
                        };
                $.ajax({
                    url : 'searchdata/' +JSON.stringify(alldata),
                    type : "GET",
                    success:function(data){
                        // console.log(data);
                        $("#tblData").empty();
                        hideLoader(loaderId);
                        $("#tblData").html(data);
                    }
                });
            });


        });

       
           function LoadDataPage() {
                var loaderId = showLoader("Loading Data..", "warning");
                $.ajax({
                    type : "GET", 
                    url : 'loaddata/',
                    success:function(data){
                        // console.log(data);
                        hideLoader(loaderId);
                        $("#tblData").html(data);
                        
                    }
                });
            }
            function detailbtn(data){
                var loaderId = showLoader("Loading Data..", "warning");
                $.ajax({
                    type : "GET", 
                    url : 'deatilbtn/'+data,
                    success:function(data){
                        // console.log(data);
                        hideLoader(loaderId);
                        $("#tblData").html(data);
                        
                    }
                });
            }
            function Requestbtn(id){
                var loaderId = showLoader("Requesting Data..", "warning");
                $.ajax({
                    type : "GET", 
                    url : 'reqbtnf/'+id,
                    dataType : "json",
                    success:function(res){
                        var r=JSON.parse(res)
                        if (r == true) {
                        hideLoader(loaderId);
                        autoLoader("Your Request is Sent  and Please Wait For Approval", "success", "Request Sent!");
                        // console.log(res)
                        // Reset();
                        }
                        else
                        {
                            autoLoader('Request can not be Sent", "error", "Error !"');
                        }
                        
                        
                    }
                });
            }

                // function downloadbtn(id){
                //     var loaderId = showLoader("Preparing for Download..", "warning");
                //     $.ajax({
                //         type : "GET", 
                //         url : 'download/'+id,
                        
                //         success:function(res){
                        
                //             hideLoader(loaderId);
                //             autoLoader("Downloaded Successfully...", "success");
                            
                //         }
                //     });
                // }

            function Reset() {
                $('#deps').val(null);
                $('#deps').trigger('change');
                $('#divis').val(null);
                $('#divis').trigger('change');
                $('#dists').val(null);
                $('#dists').trigger('change');
                $('#tehs').val(null);
                $('#tehs').trigger('change');
            }

        function fetch_select(v){}
            function showUpdateAccessModal(id, pp) {
                $('#ddlPrivacyUpdate').val(pp);
                $('#hidDataId').val(id);
                $("#UpdateAccessModal").modal("show");
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
            // function RequestData(id) {
            //     var accessLevel = $('#ddlPrivacyUpdate').val();
            //     $.ajax({
            //         type: "GET",
            //         url: "/Admin/RequestData",
            //         data: {
            //             id: id
            //         },
            //         success: function (res) {
            //             if (res == "true") {
            //                 autoLoader("Your Request is Sent  and Please Wait For Approval", "success", "Request Sent!");
            //                 // LoadDataPage();
            //                 $('#hidDataId').val(null);
            //             }
            //             else {
            //                 autoLoader("Request can not be Sent", "error", "Error !");
            //             }
            //         },
            //         error: function (err) {
            //             autoLoader(err.statusText, "error", "Error !");
            //         }
            //     });
            // }
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
                            // LoadDataPage();
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
            // function LoadDataPage(page) {
            //     var loaderId = showLoader("Loading Data..", "warning");
            //     var Departments = $('#deps').val();
            //     var Divisions = $('#divis').val();
            //     var Districts = $('#dists').val();
            //     var Tehsils = $('#tehs').val();
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