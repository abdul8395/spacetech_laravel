@extends('main')

@section('content')

<h2><center style="color: #02d8b6;">Change Password</center></h2>
<div class=" col-md-offset-2 col-md-8">
    <form method="POST" action="{{url('/superadmin/store_pass')}}">
        @csrf 
        @if(Session::has('success'))
        <div class="alert alert-succes">
            {{Session::get('success')}}
        </div>
        @endif

        @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div><br />
            @endif
        <input id="password" type="password" class="form-control{{ $errors->has('current_password') ? ' has-error' : '' }}" name="current_password" placeholder="Enter Your Currrent Password" /><br />
        <input id="new_password" type="password" class="form-control" name="new_password" placeholder="Enter Your New Password" /><br />
        <input id="new_confirm_password" type="password" class="form-control" name="new_confirm_password" placeholder="Re-Enter Your New Password" /><br />
        <input type="submit" id="btnUpdate" class="btn btn-success pull-right" value="Update" />

    </form>
</div>

    <!-- <script>
        const RePassword = document.getElementById('RePassword');
        RePassword.addEventListener('focusout', (event) => {
            CheckPassword();
        });
        function CheckPassword() {
            var NewPassword = $('#NewPassword').val();
            var RePassword = $('#RePassword').val();
            if (NewPassword != RePassword) {
                autoLoader("Password Doesnot Match", "error", "Alert !");
                document.getElementById("btnUpdate").disabled = true;
            }
            else {
                autoLoader("Password Matches", "success", "Alert !");
                document.getElementById("btnUpdate").disabled = false;
            }
        }
        function CheckCurrentPassword() {
            var Password = $('#Password').val();
            var CPassword = '@Session["Password"]';
            if (Password != CPassword) {
                autoLoader("Incorrect Password", "error", "Alert !");
                document.getElementById("NewPassword").disabled = true;
                $('#NewPassword').val(null);
            }
            else {
                autoLoader("Password Matches", "success", "Alert !");
                document.getElementById("NewPassword").disabled = false;
            }
        }
        const Password = document.getElementById('Password');
        Password.addEventListener('focusout', (event) => {
            CheckCurrentPassword();
        });
        function ChangePassword()
        {
            var Password = $('#Password').val();
            var NewPassword = $('#NewPassword').val();
            var RePassword = $('#RePassword').val();
            if (Password == '' || NewPassword == '' || RePassword == '') {
                autoLoader("Fill all the Fields First", "error", "Alert !");
                return;
            }
            $.ajax({
                type: "GET",
                url: "/Account/UpdatePassword",
                data: {
                    RePassword: RePassword
                },
                success: function (res) {
                    if (res == "true") {
                        autoLoader("Password Updated", "success", "Alert !");
                        window.open("/Account/Login", "_self");
                    }
                  
                },
                error: function (err) {
                    autoLoader(err.statusText, "error", "Error !");
                }
            });
        }
      
    </script> -->

@endsection