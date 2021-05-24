@extends('main')

@section('content')

    <style>
    </style>

<br /><br /><br />
<div class="col-md-offset-2 col-md-8 ">
    <div class="form-group col-md-4">

        <div class="col-md-12">
            <strong>Name</strong>
            <input type="text" id="Name" class="form-control" name="name"  autocomplete="name" autofocus style="margin-top: 10px;" placeholder="Enter Name Here" />
        </div>
    </div>
    <div class="form-group col-md-4">

        <div class="col-md-12">
            <strong>Extension</strong>
            <input type="text" id="Extension" class="form-control" name="ext"  autocomplete="name" autofocus style="margin-top: 10px;" placeholder="Enter Extention Here" />
        </div>
    </div>
    <!-- @*<div class="form-group col-md-3">
        <div class="col-md-6">
            Is Active
        </div>
        <div class="col-md-4">
            @Html.CheckBoxFor(m => m.DataType_IsActive, new { @class = "form-control" })
            @Html.ValidationMessageFor(model => model.DataType_IsActive, "", new { @class = "text-danger" })
        </div>
    </div>*@ -->
    <div class="form-group col-md-4">
        <div class="col-md-11">
            <button style="background:#2FA085; color:white; margin:0px 3px;" class="btn  btn-success pull-right" value="Create Scheme" id="btnCreate" onclick="ChkExtension()">Save</button>
        </div>
    </div>
</div>

<div class="tab-content col-md-10 col-md-offset-1">
    <div class="clearfix"></div><br /><br />
    <div id="FileType_Grid"></div>
</div>

    <script>

        $(document).ready(function () {
            $("#tbl_FileType").DataTable();
            LoadTypes(null);

        });
        function LoadTypes() {
            var loaderId = showLoader("Loading Data..", "warning");
            $.ajax({
                type: "GET",
                url: "Load_ext",
                success: function (res) {
                    $("#FileType_Grid").html(res);
                    $("#tbl_FileType").DataTable();
                    hideLoader(loaderId);

                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function validate() {
            var Name = $("#Name").val();
            var Extension = $("#Extension").val();
            if (Name == '' || Extension == '') {
                return false;
            }
            else {
                return true;
            }
        }
        function Reset() {
            $("#Name").val('');
            $("#Extension").val('');
            
        }
        function saveType () {
            $('#btnCreate').prop('disabled', true);
            $('#btnCreate').val('Saving...');
            var valid = validate();
            if (valid) {
                // var json = serializeFormToJson("createForm");
                // var Program_Name = $("#Program_Name").val();
                var reqdata={
                    Name: $("#Name").val(),
                    Extension: $("#Extension").val()
                }
                
                $.ajax({
                    type: "get",
                    url: "store_ext/" +JSON.stringify(reqdata),
                    // dataType : "json",
                    success: function (res) {
                        if(res == 'true'){
                            $('#btnCreate').prop('disabled', false);
                            $('#btnCreate').val('Create');
                            autoLoader("Saved Successfully...", "success");
                            Reset();
                        }
                        else {
                            $('#btnCreate').prop('disabled', false);
                            $('#btnCreate').val('Create');
                            autoLoader(res, "error");
                        }
                    }
                });

            } else {
                $('#btnCreate').prop('disabled', false);
                $('#btnCreate').val('Save');
                autoLoader("Please fill neccessory fields.", "error");

            }
        }
        function IsActive(id) {
            $.ajax({
                type: "POST",
                url: "/SuperAdmin/UpdateActive",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res == "true") {
                        autoLoader("Updated Sucessfully", "success");
                        LoadTypes(null);
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function ChkExtension() {
            var Extension = $("#Extension").val();
            $.ajax({
                type: "get",
                url: "chkext/" +JSON.stringify(Extension),
                // dataType : "json",
                success: function (res) {
                    // alert(res)
                    if(res == 'true'){
                        autoLoader("This Extension is already Exist", "error", "Error !");
                    }
                    else {
                        saveType();
                        // alert('elsepart')
                    }
                }
            });
            
        }
        function DeleteType(id) {
            $.ajax({
                type: "POST",
                url: "/SuperAdmin/DeleteType",
                data: {
                    id: id,
                },
                success: function (res) {
                    if (res === "true") {
                        autoLoader("Record Deleted", "error", "Error !");
                        LoadTypes(null);
                    }
                    else {
                        autoLoader("Unable to Delete Record!", "error", "Error !");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
    </script>


@endsection
