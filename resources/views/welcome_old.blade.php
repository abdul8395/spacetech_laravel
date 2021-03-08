<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>SpaceTech</title>

        {{-- Fonts --}}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossorigin="anonymous" />

        {{-- Bootstrap CSS --}}
        <!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<!-- Popper JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <style>
            .card {
                box-shadow: 8px 8px 5px #e3e3e3;;

            }
        </style>  
    </head>
    <body class="antialiased">
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-3" style="">
                <a href="#">
                <img src="{{URL::asset('/images/logo.png')}}" alt="uu" style=" margin-left: 20px;" hight="200px" width="350px">                   
                </a>
            </div>
            <div class="col-sm-6" style=""> 
                <h1 class="text-center" style=" margin-top: 30px; margin-bottom: 30px; margin-left: 80px;" >Centralized Dashboard</h1>
            </div>
            <div class="col-sm-3" style="">
            @if (Route::has('login'))
                <div class="hidden fixed top-0 right-0 px-6 py-4 sm:block">
                    @auth
                        <!-- <a href="{{ url('/home') }}" class="text-sm text-gray-700 underline">Home</a> -->
                    @else
                        <a href="{{ route('login') }}" style="margin-top: 150px !important; margin-left: 100px !important;  color: #393939;" class="text-sm text-gray-700 underline">Log in</a>

                        @if (Route::has('register'))
                            <!-- <a href="{{ route('register') }}" class="ml-4 text-sm text-gray-700 underline">Register</a> -->
                        @endif
                    @endauth
                </div>
            @endif
            </div>
        </div>

    </div>
    {{-- navbar --}}
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="ml-5">
                <a class="navbar-brand" href="#"></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active ml-5" aria-current="page" href="#">Home</a>
                    </li>
                </ul>
            </div>
           
        </nav>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3">
                
                    <button class="btn btn-info btn-lg btn-block" style="margin-top: 50px" type="button" data-toggle="collapse" data-target="#dep" aria-expanded="false" aria-controls="dep">
                        Departments<i class="fa fa-arrows-v"></i>
                    </button>
                    <div class="collapse" id="dep">
                        <div class="card card-body">
                            <input type="text" placeholder="Search">
                        </div>
                    </div>
                    <br>
                    <button class="btn btn-info btn-lg btn-block" style="" type="button" data-toggle="collapse" data-target="#divisions" aria-expanded="false" aria-controls="divisions">
                        Divisions
                    </button>
                    <div class="collapse" id="divisions">
                        <div class="card card-body">
                            <input type="text" placeholder="Search">
                        </div>
                    </div>
                    <br>
                    <button class="btn btn-info btn-lg btn-block" style="" type="button" data-toggle="collapse" data-target="#Districts" aria-expanded="false" aria-controls="Districts">
                        Districts
                    </button>
                    <div class="collapse" id="Districts">
                        <div class="card card-body">
                            <input type="text" placeholder="Search">
                        </div>
                    </div>
                    <br>
                    <button class="btn btn-info btn-lg btn-block" style="" type="button" data-toggle="collapse" data-target="#Tehsils" aria-expanded="false" aria-controls="Tehsils">
                        Tehsils
                    </button>
                    <div class="collapse" id="Tehsils">
                        <div class="card card-body">
                            <input type="text" placeholder="Search">
                        </div>
                    </div>
                    <br>
                    <button type="button" class="btn btn-primary  btn-block">Search</button>
                    <button type="button" class="btn btn-dark  btn-block">Reset Filters</button>
                
                </div>
                <div class="col-sm-9">
                    <div class="card mt-5">
                        <!-- <h5 class="card-header">Home District Boundaries
                        <span class="badge rounded-pill bg-success text-white">Status Done</span>
                        </h5> -->
                        <div class="card-body row">
                            <div class="col-sm-6">
                                <p class="card-text"><b style="color:#007CE0; ">District Boundaries </b></p>
                                <h5 class="card-title">Description: Boundaries of Districts in the form of Shp File</h5>
                                <p class="card-text"><b>Usage: </b>Can be used to view the administrative boundaries of the districts</p>
                                <h5 class="card-title">Divisions:  <span class="badge rounded-pill bg-success text-white">Lahore</span>  <span class="badge rounded-pill bg-info text-dark">Multan</span></h5>
                                <h5 class="card-title">Districts:  <span class="badge rounded-pill bg-warning text-dark">Kasur</span>  <span class="badge rounded-pill bg-warning text-dark">Lodran</span></h5>
                            </div>
                            <div class="col-sm-6">
                                <p class="card-text">Discription: Can be used to view the administrative boundaries of the districts</p>
                                <br>
                                <p class="card-text">Usage: Can be used to view the administrative boundaries of the districts</p>
                                <br>
                                <h5 class="card-title">FileType:  <span class="badge rounded-pill bg-warning text-dark">Shape</span></h5>
                                <h5 class="card-title">Departments:  <span class="badge rounded-pill bg-warning text-dark">All Departments</span></h5>
                                <a href="#" class="btn btn-warning float-right">Download</a>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="card mt-5 mb-5">
                        <h5 class="card-header">Home District Boundaries
                        <span class="badge rounded-pill bg-success text-white">Status Done</span>
                        </h5>
                        <div class="card-body row">
                            <div class="col-sm-6">
                                <h5 class="card-title">Description: Boundaries of Districts in the form of Shp File</h5>
                                <p class="card-text">Usage: Can be used to view the administrative boundaries of the districts</p>
                                <h5 class="card-title">Divisions:  <span class="badge rounded-pill bg-success text-white">Lahore</span>  <span class="badge rounded-pill bg-info text-dark">Multan</span></h5>
                                <h5 class="card-title">Districts:  <span class="badge rounded-pill bg-warning text-dark">Kasur</span>  <span class="badge rounded-pill bg-warning text-dark">Lodran</span></h5>
                            </div>
                            <div class="col-sm-6">
                                <p class="card-text">Discription: Can be used to view the administrative boundaries of the districts</p>
                                <br>
                                <p class="card-text">Usage: Can be used to view the administrative boundaries of the districts</p>
                                <br>
                                <h5 class="card-title">FileType:  <span class="badge rounded-pill bg-warning text-dark">Shape</span></h5>
                                <h5 class="card-title">Departments:  <span class="badge rounded-pill bg-warning text-dark">All Departments</span></h5>
                                <a href="#" class="btn btn-warning float-right">Download</a>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>

<script>
   
</script>


    </body>
</html>
