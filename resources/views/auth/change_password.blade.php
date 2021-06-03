@extends('main')

@section('content')

<h2><center style="color: #02d8b6;">Change Password</center></h2>
<!-- <div class=" col-md-offset-2 col-md-8">
    <form method="POST" action="{{ route('store_pass') }}">
        @csrf 
        @if(session()->has('error'))
            <span class="alert alert-danger">
                <strong>{{ session()->get('error') }}</strong>
            </span>
        @endif
        @if(session()->has('success'))
            <span class="alert alert-success">
                <strong>{{ session()->get('success') }}</strong>
            </span>
        @endif
        <input id="password" type="password" class="form-control{{ $errors->has('current_password') ? ' has-error' : '' }}" name="current_password" placeholder="Enter Your Currrent Password" /><br />
        <input id="new_password" type="password" class="form-control" name="new_password" placeholder="Enter Your New Password" /><br />
        <input id="new_confirm_password" type="password" class="form-control" name="new_confirm_password" placeholder="Re-Enter Your New Password" /><br />
        <input type="submit" id="btnUpdate" class="btn btn-success pull-right" value="Update" />

    </form>
</div> -->
<div class="container">
    <div style="margin-left:25%">
        <div class="col-md-8">
            <div class="card">
                <br/>

               @if(session()->has('error'))
                    <span class="alert alert-danger">
                        <strong>{{ session()->get('error') }}</strong>
                    </span>
                @endif
                @if(session()->has('success'))
                    <span class="alert alert-success">
                        <strong>{{ session()->get('success') }}</strong>
                    </span>
                @endif
                <br/>
                <br/>
                <br/>
                <div class="card-body">
                    <form method="POST" action="{{ route('store_pass') }}">
                        @csrf
                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">Current Password</label>
                            <div class="col-md-12">
                                <input type="password" class="form-control @error('current_password') is-invalid @enderror" name="current_password" autocomplete="current_password">

                                @error('current_password')
                                  <span class="invalid-feedback" role="alert">
                                      <strong>{{ $message }}</strong>
                                  </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-4 col-form-label text-md-right">New Password</label>
                            <div class="col-md-12">
                                <input type="password" class="form-control @error('password') is-invalid @enderror" name="password" autocomplete="password">
                                @error('password')
                                  <span class="invalid-feedback" role="alert">
                                      <strong>{{ $message }}</strong>
                                  </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="password" class="col-md-6 col-form-label text-md-right">Confirm New Password</label>
                            <div class="col-md-12">
                                <input type="password" class="form-control @error('password_confirmation') is-invalid @enderror" name="password_confirmation" autocomplete="password_confirmation">
                                @error('password_confirmation')
                                  <span class="invalid-feedback" role="alert">
                                      <strong>{{ $message }}</strong>
                                  </span>
                                @enderror
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-warning pull-right">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
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