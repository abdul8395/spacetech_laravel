@extends('main')

@section('content')

    <h2><center style="color: #02d8b6;">Add Admin</center></h2>
    <hr />
    <div class="col-md-offset-2 col-md-8">
    <form action="{{url('/superadmin/storeadmin')}}" method="POST">
                @csrf
            <div class="col-md-12" style="margin-top:5px;">
                <strong>Name</strong>
                <input type="text" id="name" class="form-control" name="name"  autocomplete="name" autofocus style="margin-top: 10px;" placeholder="Enter Name Here" />
               
            </div>
            <div class="col-md-12" style="margin-top:5px;">
                <strong>Mobile No.</strong>
                <input id="mno" type="number" id="txtDataName"  class="form-control" name="mno"  style="margin-top: 10px;" placeholder="Enter Mobile Number Here" />

            </div>
            <div class="col-md-12" style="margin-top:5px;">
                <strong>Email Address</strong>
                <input autocomplete="off" type="email" id="email" class="form-control " name="email"  style="margin-top: 10px;" placeholder="Enter Email Address Here" />
   

            </div>
            

           
            <div class="clearfix"></div>
            <div class="col-md-6" style="margin-top:20px;">
                <strong>Password</strong>
                <input autocomplete="off" id="password" type="password" class="form-control " name="password" placeholder="Password"  style="margin-top: 10px;">
                   
            </div>
            <div id="rowResolution" class="col-md-6" style="margin-top:20px;">
                <strong>Confirm Password</strong>
                    <input id="password-confirm" type="password" class="form-control" name="password_confirmation" placeholder="Confirm Password" style="margin-top: 10px;" >
            </div>

            <div class="col-md-6 pull-right" style="margin-top:15px;">
                <div>
                    <button class=" btn btn-success pull-right btn-submit"  id="btnSave" style="color:white; margin-bottom: 10px;">Save</button>
                </div>
            </div>
        </form>
    </div>


@endsection
