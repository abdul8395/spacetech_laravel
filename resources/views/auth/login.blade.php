
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- set the encoding of your site -->
    <meta charset="utf-8">
    <!-- set the viewport width and initial-scale on mobile devices -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0 ">
    <title>Space Tech </title>
    <!-- include the site stylesheet -->
    
    <link href="{{URL::asset('/NewLayout/css/bootstrap.min.css')}}" rel="stylesheet" />
    <link href="{{URL::asset('/NewLayout/css/all.css')}}" rel="stylesheet" />
    
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" rel="stylesheet">
</head>
<body>
    <!-- main container of all the page elements -->
    <div id="wrapper">
        <section class="login-section" style="background-image:url({{URL::asset('/NewLayout/images/login-background.jpg')}})">
            <div class="section-holder">
                <header class="login-header">
                    <div class="pull-left"><a href="#"><img src="{{URL::asset('/NewLayout/images/UUlogo.png')}}" height="70" width="300" alt="EYRIS PAKISTAN"></a></div>
                    <div class="buttons-holder list-unstyled list-inline">
                        <a href="#" class="btn-users"><span>Login</span></a>
                    </div>
                </header>
                <div class="login-holder d-flex align-items-center justify-content-center">
                    <div class="login-block">
                        <div class="login-frame">
                            <h2>Centralized Dahboard <span>Space Technology Application in Socio-Economic Development Progress</span></h2>
                           
                            <form method="POST" action="{{ route('login') }}">
                            @csrf
                                <div class="login-form">
                                        @error('email')
                                            <span class="invalid-feedback" role="alert">
                                                <p style="color: #a94442;">{{ $message }}</>
                                            </span>
                                        @enderror
                                    <div class="input-row">
                                        <i class="fas fa-user"></i>
                                        <div class="input-holder">
                                            <input id="email" type="email" placeholder="Email Address" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" autofocus>
                                        </div>
                                    </div>
                                    <div class="input-row">
                                        <i class="fas fa-lock"></i>
                                        <div class="input-holder">
                                            <input id="password" type="password" placeholder="Password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password" >
                                        </div>
                                        @error('password')
                                            <span class="invalid-feedback" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                        @enderror
                                    </div>
                                    @if (Route::has('password.request'))
                                    
                                    @endif
                                    <button type="submit" class="btn-submit"><span>Login</span></button>
                                </div>


                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <!-- include jQuery library -->
    <script src="http://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
            crossorigin="anonymous"></script>
    <!-- include Bootstrap 4 JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
            crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/js/bootstrap.min.js" integrity="sha384-o+RDsa0aLu++PJvFqy8fFScvbHFLtbvScb8AjopnFD+iEQ7wo/CG0xlczd+2O/em"
            crossorigin="anonymous"></script>
    <!-- include custom JavaScript -->
    <script src="{{URL::asset('/NewLayout/js/jquery.main.js')}}"></script>
    
</body>
</html>
