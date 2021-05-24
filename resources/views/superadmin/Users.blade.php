@extends('main')

@section('content')
  <style>
     
    </style>
    }
<h2><center style="color: #02d8b6;"> Admins</center></h2>


<div class="tab-content col-md-10 col-md-offset-1">
    <div class="form-group col-md-4">
        <div class="col-md-12">
            <select id="ddlsrcSearch" name="months[]" class = "form-control select2" >
                <option value="">-- Select Role --</option>
                    <option value="2">Admin</option>
            </select>
        </div>
    </div>

    <div class="form-group col-md-4 pull-left">
        <div class="col-md-12">
            <select id="drpDpt" name="months[]" class = "form-control select2" >
                <option value="">-- Select Source --</option>
                @foreach($dsrc as $p)
                    <option value="{{$p->source_id}}">{{$p->source_name}}</option>
                @endforeach
            </select>
        </div>
    </div>
    <div class="form-group col-md-2 pull-left">
        <span class="btn btn-danger"  style="border-radius:10px;" onclick="LoadUsers()">Search</span>
    </div>
    <div class="form-group col-md-2 pull-right">
        <a href="{{ url('/superadmin/add_admin') }}" class=" btn btn-warning pull-right" style="border-radius:10px;"><span class="glyphicon glyphicon-user">&nbsp;Admins</span></a>
    </div>
   
    <div class="clearfix"></div><br /><br />
    <div id="Users_Grid"></div>
</div>

        <script>
            $(document).ready(function () {
                
                LoadUsers();
                $("#tbl_Users").DataTable();

            });
            function LoadUsers() { 
                var DeptId = $('#drpDpt').val();
                // var Role = $('#drpRole').val();
                var loaderId = showLoader("Loading Data..", "warning");
                $.ajax({
                    type: "GET",
                    url: "Load_Users/" +JSON.stringify(DeptId),
                    dataSrc: "",
                    success: function (res) {
                        $("#Users_Grid").html(res);
                        $("#tbl_Users").DataTable();
                        hideLoader(loaderId);

                    },
                    error: function (err) {
                        autoLoader(err.statusText, "error", "Error !");
                    }
                });
            }
            // function addadmins() { 
            //     var loaderId = showLoader("Loading Data..", "warning");
            //     $.ajax({
            //         type: "GET",
            //         url: "add_admin",
            //         dataSrc: "",
            //         success: function (res) {
            //             $("#Users_Grid").html(res);
            //             $("#tbl_Users").DataTable();
            //             hideLoader(loaderId);

            //         },
            //         error: function (err) {
            //             autoLoader(err.statusText, "error", "Error !");
            //         }
            //     });
            // }
        </script>

@endsection