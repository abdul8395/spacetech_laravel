
@extends('main')

@section('content')

<h2 class="tab-content jumbotron col-md-12 " style="background-image: url(../../assets/images/background.jpg);
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;">
    <center style="color: white;">
        Pending Requests
    </center>
</h2>

<div class="tab-content jumbotron col-md-10 col-md-offset-1">

    <div class="form-group col-md-5">
        <div class="col-md-4">
            <label>Storage Date</label>
        </div>
        <div class="col-md-8">
            <input type="text" class="datepicker form-control" value="" id="txtSearchInsertionDate">
        </div>
    </div>
    <div class="form-group col-md-5">
        <div class="col-md-4">
            <label>Creation Date</label>
        </div>
        <div class="col-md-8">
            <input type="text" class="datepicker form-control" value="" id="txtSearchCreationDate">
        </div>
    </div>
    <div class="form-group col-md-2">
        <span class="btn btn-danger" style="border-radius:10px;" onclick="getGrid()">Search</span>
    </div>
    <div class="clearfix"></div>
    <div class="form-group col-md-5">
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
    <div class="form-group col-md-5">
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

        <!-- <div class="form-group col-md-2 ">
                <input type="hidden" id="hidDataId" />
                <input type="button" class="btn btn-success" value="Add New File" onclick="showAddFileModal(0)" />
            </div> -->
  

</div>
<div class="tab-content col-md-10 col-md-offset-1">
    <div class="clearfix"></div><br /><br />
   <!-- <div id="Data_Grid"></div> -->
    <table class="table table-responsive" data-vertable="ver2" id="tblGrid"></table>
</div>



    <script>
        $(document).ready(function () {
            // $("#tbl_Data").DataTable();
            // $('#txtSearchInsertionDate').val(null);
            // $('#txtSearchCreationDate').val(null);
            // LoadData();
            getGrid();

        });
        // var $table;
        function getGrid() {
            var reqdata={
                StorageDate: $('#txtSearchInsertionDate').val(),
                CreationDate: $('#txtSearchCreationDate').val(),
                Type: $('#ddlTypeSearch').val(),
                Srcdpt: $('#ddlsrcSearch').val(),
                };

            $table = $('#tblGrid').DataTable({
                "dom": "<'row'<'col-sm-6'l><'col-sm-6 text-right'i>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'><'col-sm-7'p>>", //'<"top"rl>it<"bottom"p><"clear">',
                "lengthMenu": [[10, 25, 50, 100, 100000], [10, 25, 50, 100, "All"]],
                "paging": true,
                "info": true,
                "ordering": true,
                "search": true,
                "processing": true,
                // "serverSide": true,
                "destroy": true,
                "ajax": {
                    "url": "sload_pending_req/"+JSON.stringify(reqdata),
                    "type": "GET",
                    "dataSrc": "",
                },
                createdRow: function (row, data, dataIndex, cells) {
                    $(row).addClass('row100');

                    $(row).find('td:eq(0)').addClass('row100 head');


                },
                "columns": [
                    { "data": "first_name", "title": "User", "className": "column100 column1", "orderable": false, "searchable": false, "width": "20px", "data-column": "column1" },
                    { "data": "datatype_name", "title": "Type", "className": "column100 column1", "orderable": false, "searchable": false, "width": "20px", "data-column": "column1" },
                    { "data": "name", "title": "Name", "className": "column100 column2", "orderable": false, "searchable": false, "width": "30px", "data-column": "column2" },
                    { "data": "data_storage_date", "title": "Storage Date", "className": "column100 column3", "orderable": false, "searchable": false, "width": "30px", "data-column": "column3" },
                    { "data": "first_name", "title": "Source", "className": "column100 column4", "orderable": false, "searchable": false, "width": "70px", "data-column": "column4" },
                    { "data": "data_creation_date", "title": "Creation Date", "className": "column100 column5", "orderable": false, "searchable": false, "width": "190px", "data-column": "column5" },
                    { "data": "data_description", "title": "Desp.", "className": "column100 column6", "orderable": false, "searchable": false, "width": "30px", "data-column": "column6" },
                    { "data": "data_crs", "title": "CRS", "className": "column100 column7", "orderable": false, "searchable": false, "width": "75px", "data-column": "column7" },
                    { "data": "data_usage_purpose", "title": "Purpose", "className": "column100 column8", "orderable": false, "searchable": false, "width": "75px", "data-column": "column8" },
                    { "data": "data_isvector", "title": "IsVector", "className": "column100 column9", "orderable": false, "searchable": false, "width": "40px", "data-column": "column9" },
                    { "data": "data_resolution", "title": "Resolution", "className": "column100 column10", "orderable": false, "searchable": false, "width": "40px", "data-column": "column10" },
                    { "data": null, "title": "Action", "className": "column100 column10", "orderable": false, "searchable": false, "width": "40px", "data-column": "column10" }//,
                    //    { "data": null, "title": "Status", "className": "column100 column11", "orderable": false, "searchable": false, "width": "40px", "data-column": "column11" }
                ],
                "order": [[0, "asc"]],
                "rowCallback": function (row, data) {
                    console.log(data);
                    var r = '<td>' + data.first_name + '</td>'
                        + '<td>' + data.datatype_name + '</td>'
                        + '<td>' + data.data_name + '</td>'
                        + '<td>' + data.data_storage_date + '</td>'
                        + '<td>' + data.first_name + '</td>'
                        + '<td>' + data.data_creation_date + '</td>'
                        + '<td>' + data.data_description + '</td>'
                        + '<td>' + data.data_crs + '</td>'
                        + '<td>' + data.data_usage_purpose + '</td>';
                    if (data.data_isvector == true) {
                        r = r + '<td><input type="checkbox" checked></td>';
                    }
                    else {
                        r = r + '<td><input type="checkbox"></td>';
                    }
                    r = r + '<td>' + data.data_resolution + '</td>';
                    r = r + '<td>';
                       's'
                    r = r + '</td>';
                    $(row).html(r);
                }
            });
        }

        function ApproveRequest(Id) {
            $.ajax({
                type: "GET",
                url: "/SuperAdmin/ApproveRequest",
                data: {
                    Id: Id
                },
                success: function (res) {
                    if (res != "false") {
                        autoLoader("Request Approved", "success", "Approved !");
                        PendingRequestCount();
                        getGrid();
                    }
                    else {
                        autoLoader("Request can not be Approved", "error", "Error !");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
        function RejectRequest(Id) {
            $.ajax({
                type: "GET",
                url: "/SuperAdmin/RejectRequest",
                data: {
                    Id: Id
                },
                success: function (res) {
                    if (res != "false") {
                        autoLoader("Request Rejected", "error", "Success !");
                        PendingRequestCount();
                        getGrid();
                    }
                    else {
                        autoLoader("Request can not be Rejected", "error", "Error !");
                    }
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
    </script>

@endsection