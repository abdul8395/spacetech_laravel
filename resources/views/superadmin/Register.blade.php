@extends('main')

@section('content')

    <h2><center style="color: #02d8b6;">Add Admin</center></h2>
    <hr />
    <div class="col-md-offset-2 col-md-8">
        <div class="form-group col-md-6">

            <div class="col-md-12">
                @Html.TextBoxFor(m => m.FirstName, new { @class = "form-control", @placeholder = "Enter First Name" })
                @Html.ValidationMessageFor(model => model.FirstName, "", new { @class = "text-danger" })
            </div>
        </div>
        <div class="form-group col-md-6">

            <div class="col-md-12">
                @Html.TextBoxFor(m => m.LastName, new { @class = "form-control", @placeholder = "Enter Last Name" })
                @Html.ValidationMessageFor(model => model.LastName, "", new { @class = "text-danger" })
            </div>
        </div>
        <div class="form-group col-md-6">

            <div class="col-md-12">
                @Html.TextBoxFor(m => m.MobileNo, new { @class = "form-control", @placeholder = "Enter Mobile No" })
                @Html.ValidationMessageFor(model => model.MobileNo, "", new { @class = "text-danger" })
            </div>
        </div>
     
        <div class="form-group col-md-6">

            <div class="col-md-12">
                @Html.TextBoxFor(m => m.Email, new { @class = "form-control", @placeholder = "Enter Email Address" })
                @Html.ValidationMessageFor(model => model.Email, "", new { @class = "text-danger" })
            </div>
        </div>
        <div class="form-group col-md-6">
            <div class="col-md-12">
                @Html.PasswordFor(m => m.Password, new { @class = "form-control", @placeholder = "Enter Password" })
                @Html.ValidationMessageFor(model => model.Password, "", new { @class = "text-danger" })
            </div>
        </div>
        <div class="form-group col-md-6">
            <div class="col-md-12">
                @Html.PasswordFor(m => m.ConfirmPassword, new { @class = "form-control", @placeholder = "Re-Enter Password" })
                @Html.ValidationMessageFor(model => model.ConfirmPassword, "", new { @class = "text-danger" })
            </div>
        </div>
        <div class="form-group col-md-6">
            <div class="col-md-12">
                @Html.DropDownListFor(m => m.Role, ViewBag.UserRoles as IEnumerable<SelectListItem>, "-Select Role-", new { @class = "form-control select2" })
                @Html.ValidationMessageFor(model => model.Role, "", new { @class = "text-danger" })
            </div>
        </div>
        
        <div class="form-group col-md-6 pull-left">
            <div class="col-md-12">
                @Html.DropDownListFor(m => m.Dept_Id, ViewBag.Departments as IEnumerable<SelectListItem>, "-Select Department-", new { @class = "form-control select2" })
                @Html.ValidationMessageFor(model => model.Dept_Id, "", new { @class = "text-danger" })
            </div>
        </div>
        <div class="form-group col-md-12 ">
            <div class="col-md-11">
                <input type="submit" class="btn btn-submit pull-right" style="        background-color: #02d8b6;
        border-radius: 10px;" value="Register" />
            </div>
        </div>
    </div>


@endsection
