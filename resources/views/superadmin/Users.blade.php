@model SpaceTechPG.Models.RegisterViewModel
@{
    ViewBag.Title = "Users";
    Layout = "~/Views/Shared/_Layout.cshtml";
}
@section styles{
  <style>
     
    </style>
    }
<h2><center style="color: #02d8b6;"> Admins</center></h2>


<div class="tab-content col-md-10 col-md-offset-1">
    <div class="form-group col-md-4">
        <div class="col-md-12">
            @Html.DropDownListFor(m => m.Role, ViewBag.UserRoles as IEnumerable<SelectListItem>, "-Select Role-", new { @Id = "drpRole", @class = "form-control select2" })
        </div>
    </div>

    <div class="form-group col-md-4 pull-left">
        <div class="col-md-12">
            @Html.DropDownListFor(m => m.Dept_Id, ViewBag.Departments as IEnumerable<SelectListItem>, "-Select Source-", new {@Id = "drpDpt", @class = "form-control select2" })
        </div>
    </div>
    <div class="form-group col-md-2 pull-left">
        <span class="btn btn-danger"  style="border-radius:10px;" onclick="LoadUsers()">Search</span>
    </div>
    <div class="form-group col-md-2 pull-right">
        <a href="~/Account/Register" class=" btn btn-warning pull-right" style="border-radius:10px;"><span class="glyphicon glyphicon-user">&nbsp;Admins</span></a>
    </div>
   
    <div class="clearfix"></div><br /><br />
    <div id="Users_Grid"></div>
</div>
    @section scripts
    {
        <script>
            $(document).ready(function () {
                $("#tbl_Users").DataTable();
                LoadUsers();

            });
            function LoadUsers() { 
                var DeptId = $('#drpDpt').val();
                var Role = $('#drpRole').val();
                var loaderId = showLoader("Loading Data..", "warning");
                $.ajax({
                    type: "GET",
                    url: "/SuperAdmin/Load_Users",
                    data: {
                        DeptId: DeptId,
                        Role: Role
                    },
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
        </script>

    }
