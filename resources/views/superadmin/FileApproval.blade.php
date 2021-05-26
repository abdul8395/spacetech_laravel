@extends('main')

@section('content')

<h2 class="tab-content jumbotron col-md-12 " style="background-image: url(../../assets/images/background.jpg);
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;">
    <center style="color: white;">
        File Approval
          </center>
</h2>
<div class="tab-content jumbotron col-md-10 col-md-offset-1">
   
    
    <div class="form-group col-md-3">
        <div class="col-md-4">
            <label>Storage Date</label>
        </div>
        <div class="col-md-8">
            <input type="text" class="datepicker form-control" value="" id="txtSearchInsertionDate">
        </div>
    </div>
    <div class="form-group col-md-3">
        <div class="col-md-4">
            <label>Creation Date</label>
        </div>
        <div class="col-md-8">
            <input type="text" class="datepicker form-control" value="" id="txtSearchCreationDate">
        </div>
    </div>
    
    <!-- @*<div class="form-group col-md-4">
             <div class="col-md-4">
                 <label>Status</label>
             </div>
             <div class="col-md-8">
                 @Html.DropDownList("ddlIsApproved", new List<SelectListItem>
                 {
           new SelectListItem{ Text="Approved", Value = "True" },
           new SelectListItem{ Text="Rejected", Value = "False" },
        }, "-- Select Status --", new { @class = "form-control" })
             </div>

         </div>*@ -->

        <div class="form-group col-md-3">
            <div class="col-md-4">
                <label>Type</label>
            </div>
            <div class="col-md-8">
            <select id="ddlTypeSearch" name="months[]" class = "form-control select2" style = "width:100%;">
                <option value="">-- Select Type Of Data --</option>
                    @foreach($dtype as $p)
                        <option value="{{$p->datatype_id}}">{{$p->datatype_name}}</option>
                    @endforeach
                </select>
            </div>
        
        </div>
        <div class="form-group col-md-3">
            <div class="col-md-4">
                <label>Source</label>
            </div>
            <div class="col-md-8">
                <select id="ddlsrcSearch" name="months[]" class = "form-control select2" style = "width:100%;">
                    <option value="">-- Select Source --</option>
                    @foreach($dsrc as $p)
                        <option value="{{$p->source_id}}">{{$p->source_name}}</option>
                    @endforeach
                </select>
            </div>  
        </div>
        <div class="form-group pull-right">
        <span class="btn btn-danger" style="border-radius:10px;" onclick="LoadData()">Search</span>
    </div><hr />
    <div id="rejectionModel" class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" style="width:60%;">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Reject File</h4>
                </div>
                <div class="modal-body">
                    <table class="table">

                        <tr>
                            <td><strong>Description</strong></td>
                            <td><textarea class="form-control" id="txtDescription"></textarea></td>
                        </tr>

                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class=" btn btn-danger" onclick="Reject()" id="btnSave" style="color:white;">Reject</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="approvalModel" class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" style="width:60%;">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Approve File</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-bordered">

                        <tr>
                            <td><strong>Schema</strong></td>
                            <td><select id="drpSchemas" class="form-control"></select></td>
                        </tr>
                        <tr>
                            <td><strong>Table</strong></td>
                            <td><input type="text" id="txtTableName" class="form-control" /></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class=" btn btn-success" onclick="ChkTable()" id="btnSaveApproved" style="color:white;">Add</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <div id="URLModel" class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" style="width:60%;">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    @*<button type="button" class="close" data-dismiss="modal">&times;</button>*@
                    <h4 class="modal-title">Add URL</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-bordered">
                        <tr>
                            <td><strong>URL</strong></td>
                            <td><input type="text" id="txtURL" class="form-control" /></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class=" btn btn-success" onclick="AddURL()" id="btnSaveURL" style="color:white;">Add</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>  
        </div>
    </div>

</div>
<div class="tab-content col-md-10 col-md-offset-1">
    <div class="clearfix"></div><br /><br />
    <div id="DataApprove_Grid"></div>
</div>


    <script>


        function Approvebtn(id) {
            $.ajax({
                type: "get",
                url: "apprfile/" +JSON.stringify(id),
                // dataType : "json",
                success: function (res) {
                    var r=JSON.parse(res)
                    if(r == true){
                        autoLoader("File Approved", "success", "Approved !");
                    }
                    else {
                        autoLoader("File can not be Approved", "error", "Error !");
                    }
                }
            });   
        }
        function Rejectbtn(id) {
            $.ajax({
                type: "get",
                url: "rejectfile/" +JSON.stringify(id),
                // dataType : "json",
                success: function (res) {
                    var r=JSON.parse(res)
                    if(r == true){
                        autoLoader("File Recjected", "success", "Rejected !");
                    }
                    else {
                        autoLoader("File can not be Recjected", "error", "Error !");
                    }
                }
            });   
        }
        function showAddFileModal(id) {
            Reset();
            $('#hidDataId').val(id);
            $("#rejectionModel").modal("show");

        }
        function ShowApproveModal(id) {
            Reset();
            var loaderId = showLoader("Loading Data..", "warning");
            $('#hidDataId').val(id);
            $.ajax({
                url: "/Admin/GetShemas",
                type: "GET",
                data: {
                    
                },
                success: function (res) {
                    console.log(res);
                    $("#drpSchemas").html(res);
                    hideLoader(loaderId);
                    $("#approvalModel").modal("show");
                },
                error: function (err) {
                    console.log(err.statusText);
                }
            });
           
        }
        function ChkTable() {
          var loaderId = showLoader("Saving Data..", "warning");
            var DataId =   $('#hidDataId').val();
            var Schema = $('#drpSchemas option:selected').text();
            var SchemaVal = $('#drpSchemas option:selected').val();
            var Table = $("#txtTableName").val();
            if (SchemaVal == '' || Table == '')
            {
                autoLoader("Select Schema and Enter Table Name First", "error", "Error !");
                return false;
            }
            $.ajax({
                type: "POST",
                url: "/SuperAdmin/CheckTable",
                data: {
                    DataId: DataId,
                    Schema: Schema,
                    Table: Table
                },
                success: function (res) {
                    if (res != "true") {
                        autoLoader("Table created in " + Schema + "", "success", "Success !");
                        $('#approvalModel').modal('hide');
                        hideLoader(loaderId);
                        autoLoader("Record Approved", "success", "Success !");
                        document.getElementById('approvCount').innerHTML = '(' + res + ')';
                        //window.open("https://www.google.com.pk/", '_blank');
                       // $("#URLModel").modal("show");
                    }
                    else {
                        hideLoader(loaderId);
                        autoLoader("This Table is already created in " + Schema + "", "error", "Error !");
                       
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function AddURL() {
            var DataId = $('#hidDataId').val();
            var URL = $("#txtURL").val();
            if (URL == '') {
                autoLoader("Enter URL", "error", "Error !");
                return false;
            }
            $.ajax({
                type: "POST",
                url: "/SuperAdmin/EnterURL",
                data: {
                    DataId: DataId,
                    URL: URL
                },
                success: function (res) {
                    if (res != "false") {
                        document.getElementById('approvCount').innerHTML = '(' + res + ')';
                        autoLoader("Record Approved", "success", "Success !");
                        $('#URLModel').modal('hide');
                        LoadData();
                    }
                    else {
                        autoLoader("Something Wrong", "error", "Error !");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function Reset() {
            $('#txtSearchInsertionDate').val(null);
            $('#txtSearchCreationDate').val(null);
            $('#ddlTypeSearch').val(null);
            $('#ddlDptSearch').val(null);
            $('#ddlIsApproved').val(null);
            $('#txtDescription').val(null);
            $('#drpSchemas').val(null);
            $('#txtTableName').val(null);
        }
        $(document).ready(function () {
            $("#tbl_ApproveData").DataTable();
            Reset();
            LoadData();

        });
        function LoadData() {
            var reqdata={
                StorageDate: $('#txtSearchInsertionDate').val(),
                CreationDate: $('#txtSearchCreationDate').val(),
                Type: $('#ddlTypeSearch').val(),
                Srcdpt: $('#ddlsrcSearch').val(),
                };

            var Approved = true;
           // var Approved = $('#ddlIsApproved').val();
            var loaderId = showLoader("Loading Data..", "warning");
            $.ajax({
                type: "GET",
                url: "load_approval/" +JSON.stringify(reqdata),
                success: function (res) {
                    $("#DataApprove_Grid").html(res);
                    $("#tbl_ApproveData").DataTable();
                    hideLoader(loaderId);

                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function Approve(id) {
            $.ajax({
                type: "GET",
                url: "/SuperAdmin/ApproveData",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res != "false") {
                        autoLoader("Data Approved Successfully...", "success");
                        UnApprovedCount();
                        LoadData();
                    }
                    else {
                        autoLoader("Data can not be Approved", "error", "Error !");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function Approve1(DataId) {
            alert(0);
            $.ajax({
                type: "GET",
                url: "/SuperAdmin/ApproveData",
                data: {
                    DataId: DataId
                },
                success: function (res) {
                    if (res != "false") {
                        autoLoader("Data Approved Successfully...", "success");
                       // document.getElementById('approvCount').innerHTML = '(' + res + ')';
                        LoadData();
                    }
                    else {
                        autoLoader("Data can not be Approved", "error", "Error !");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function Reject() {
            var id = $('#hidDataId').val();
            var description = $('#txtDescription').val();
            if (description == '') {
                autoLoader("Please Add Description", "error", "Error !");
                return false;
            }
            $.ajax({
                type: "GET",
                url: "/SuperAdmin/RejectData",
                data: {
                    id: id,
                    description: description
                },
                success: function (res) {
                    if (res != "false") {
                        autoLoader("Data Rejected...", "error");
                        document.getElementById('approvCount').innerHTML = '(' + res + ')';
                        LoadData();
                        $('#rejectionModel').modal('hide');
                    }
                    else {
                        autoLoader("Data can not be Approved", "error", "Error !");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }

    </script>

@endsection