
<!doctype html>
<html>
<head>
    <!-- set the encoding of your site -->
    <meta charset="utf-8">

      <!-- CSRF Token -->
      <meta name="csrf-token" content="{{ csrf_token() }}">
      
    <!-- set the viewport width and initial-scale on mobile devices -->
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0 "> -->
    <title> Space Tech</title>
    <link rel="shortcut icon" href="{{URL::asset('/images/logo.png')}}" type="image/x-icon">
    <!-- include the site stylesheet -->
    
    <link href="{{URL::asset('/NewLayout/css/bootstrap.min.css')}}" rel="stylesheet" />
    <link href="{{URL::asset('/NewLayout/css/all.css')}}" rel="stylesheet" />
    <link href="{{URL::asset('/assets/admin/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css')}}" rel="stylesheet" />
    <link href="{{URL::asset('/assets/admin/bower_components/select2/dist/css/select2.min.css')}}" rel="stylesheet" />
    <link href="{{URL::asset('/assets/admin/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css')}}" rel="stylesheet" />
    <link href="{{URL::asset('/assets/bootstrap-select/dist/css/bootstrap-select.min.css')}}" rel="stylesheet" />
    <link href="{{URL::asset('/assets/toastr/toastr.min.css')}}" rel="stylesheet" />

    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" rel="stylesheet">
    <!-- <link href="../../Content/newdashboard-custom.css" rel="stylesheet" /> -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" rel="stylesheet">

    <!-- <link href="../../Content/newdashboard-custom.css" rel="stylesheet" />  -->
    <script src="{{URL::asset('/Scripts/jquery-1.11.2.js')}}"></script>
    <style>
        .shadowboxTable {
            width: 15em;
            border: 1px solid #e3e3e3;
            box-shadow: 8px 8px 5px #e3e3e3;
            padding: 8px 12px;
            width: 100%;
        }

        .grey {
            color: #696969;
        }

        #load {
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 9999;
            background: url("{{URL::asset('/assets/images/Loader.gif')}}") no-repeat center center rgba(0,0,0,0);
            background-size: 100% auto;
        }

        .boxshadow {
            padding: 4px;
            box-shadow: inset 0 0 4px #666;
        }

        .shadowbox {
            width: 15em;
            border: 1px solid #e3e3e3;
            box-shadow: 8px 8px 5px #e3e3e3;
            padding: 8px 12px;
        }

        .shadowboxTable {
            width: 15em;
            border: 1px solid #e3e3e3;
            box-shadow: 8px 8px 5px #e3e3e3;
            padding: 8px 12px;
            width: 100%;
        }

        .rowPanel {
            margin-top: 40px;
            padding: 0 10px;
        }

        .clickable {
            cursor: pointer;
        }

        .panel-heading span {
            margin-top: -20px;
            font-size: 15px;
        }
    </style>
</head>
<body>
 
    <div id="load"></div>
    <!-- <div id="contents"> -->

    </div>
    
    <!-- main container of all the page elements -->
    <div id="wrapper">
        <!-- header of the page -->
        <header id="header">
            <div class="container">
                <!-- page logo -->
                <div class="logo" style="margin-top:-10px;">
                    <a href="#">
                        <img src="{{URL::asset('/images/logo.png')}}" alt="Urban Unit">
                    </a>
                </div>

                <div class="login-holder">
                    <ul class="login-list list-unstyled list-inline">
                        <li class="pull-left" style="margin-left:200px">
                            <a href="#"><strong style="font-size:30px;">Centralized Dashboard</strong></a>
                        </li>

                            <!-- <li id="login_li">

                                    <a href="javascript:document.getElementById('logoutForm').submit()">Sign Out</a>


                            </li> -->
                        @guest
                            @if (Route::has('login'))
                            <li id="login_li">
                                <a href="{{ route('login') }}">Login</a>
                            </li>   
                            @endif

                            @else
                            <li id="login_li">
                                <a href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">Logout</a>
                            </li>
                                @if(Auth::user()->role==1)
                                <li id="login_li">
                                    <a href="{{ url('/superadmin/add_users') }}">Add Users</a>
                                </li>
                                @endif
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>
                        @endguest
                              
                          
                            
                                
                      

                    </ul>
                </div>
            </div>
        </header>

        <nav id="nav" style="background: black;">
            <div class="container">


                <div class="navigation-holder" style="width:100%;">
                    <ul class="navigation list-unstyled list-inline" style="width:100%;">

                        <li><a href="{{ url('/') }}">Home</a></li>
                        @if(Auth::check())
                            @if(Auth::user()->role==1)
                           
                            
                                <li id="linkDataSets">
                                    <a href="http://172.20.82.84:88/spacetech_map/?user_id={{ Auth::user()->id }}" target="_blank">View Datasets</a>
                                </li>
                                <li><a href="{{ url('/superadmin/filetypes') }}">File Types</a></li>
                            @endif
                            @if(Auth::user()->role==2)
                                <li id="linkDataSets">
                                    <a href="http://172.20.82.84:88/spacetech_map/?user_id={{ Auth::user()->id }}" target="_blank">View Datasets</a>
                                </li>
                                <li><a href="{{ url('/add_data') }}">Add Data</a></li>
                                <li><a href="{{ url('/approval_logs') }}">Approval Logs</a></li>
                                <li><a href="{{ url('/pending_req') }}">Pending Requests&nbsp;<span style="color:red;" id="lblPendingRequestsCountForAdmin">(0)</span></a></li>
                                <li><a href="{{ url('/req_log') }}">Requests Log</a></li>
                            @endif
                            @if(Auth::user()->role==1)
                                <li><a href="{{ url('/superadmin/pending_req') }}">Pending Requests &nbsp;<span style="color:red;" id="lblPendingRequestsCount"></span></a></li>
                                <li><a href="{{ url('/superadmin/approval') }}">Approval &nbsp;<span style="color:red;" id="lblUnApprovCount">(0)</span></a></li>
                                <li><a href="{{ url('/superadmin/req_log') }}">Requests Log </a></li>
                                <li><a href="{{ url('/superadmin/change_pass') }}">Change Password</a></li>
                            @endif
                            @if(Auth::user()->role==2)
                                <li><a href="#">Change Password</a></li>
                            @endif
                        @endif

                    </ul>
                </div>
            </div>
        </nav>


        @yield('content')
        

    </div>

    <footer id="footer">
        <div class="container">
            <span>Space Technology Application in Socio-Economic Development Progress &copy; @System.DateTime.Now.Year <a href="#"></a></span>
        </div>
    </footer>
    
    <script src="{{URL::asset('/NewLayout/js/bootstrap.min.js')}}"></script>
    <script src="{{URL::asset('/NewLayout/js/jquery.main.js')}}"></script>
    <script src="{{URL::asset('/assets/admin/bower_components/select2/dist/js/select2.full.min.js')}}"></script>
    <script src="{{URL::asset('/assets/admin/bower_components/moment/min/moment.min.js')}}"></script>
    <script src="{{URL::asset('/assets/admin/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js')}}"></script>
    <script src="{{URL::asset('/assets/admin/bower_components/datatables.net/js/jquery.dataTables.min.js')}}"></script>
    <script src="{{URL::asset('/assets/admin/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js')}}"></script>
    <script src="{{URL::asset('/assets/toastr/toastr.min.js')}}"></script>
    <script src="{{URL::asset('/assets/bootstrap-select/dist/js/bootstrap-select.min.js')}}"></script>
    <script src="{{URL::asset('/Scripts/date.js')}}"></script>
    <script src="{{URL::asset('/Scripts/underscore-min.js')}}"></script>
    <script src="{{URL::asset('/Scripts/common.js')}}"></script>
    <script src="{{URL::asset('/Scripts/app.js')}}"></script>

</body>

</html>

<script>
    document.onreadystatechange = function () {
       
        var state = document.readyState
        if (state == 'interactive') {
            document.getElementById('contents').style.visibility = "hidden";
        } else if (state == 'complete') {
            setTimeout(function () {
                document.getElementById('interactive');
                document.getElementById('load').style.visibility = "hidden";
                document.getElementById('contents').style.visibility = "visible";
            }, 1000);
        }
    }

        function UnApprovedCount() {
        $.ajax({
            type: "GET",
            url: "/SuperAdmin/UnApprovedCount",
            data: {

            },
            success: function (res) {
                if (res != "false") {
                    if ("@Role" == "SuperAdmin") {
                        document.getElementById('lblUnApprovCount').innerHTML = '(' + res + ')';
                    }

                }
            },
            error: function (err) {
                autoLoader(err.statusText, "error", "Error !");
            }
        });
    }


    function Encrypt(username, password) {
        if (!username) username = "";
        username = (username == "undefined" || username == "null") ? "" : username;
        try {
            var key = 146;
            var pos = 0;
            encryptedUsername = '';
            while (pos < username.length) {
                encryptedUsername = encryptedUsername + String.fromCharCode(username.charCodeAt(pos) ^ key);
                pos += 1;
            }

            if (!password) password = "";
            password = (password == "undefined" || password == "null") ? "" : password;

            var key = 146;
            var pos = 0;
            encryptedPassword = '';
            while (pos < password.length) {
                encryptedPassword = encryptedPassword + String.fromCharCode(password.charCodeAt(pos) ^ key);
                pos += 1;
            }

            var url = 'http://unitcloud.urbanunit.gov.pk/uu/index.php/login?user=' + encryptedUsername + '&pass=' + encryptedPassword;
            window.open(url);

        } catch (ex) {
            return '';
        }
    }
    $(function () {
        $('.datepicker').datepicker({ dateFormat: 'dd-MMM-YYYY' });
        // PendingRequestCount();
        // UnApprovedCount();
    });

    // function PendingRequestCount() {
    //     $.ajax({
    //         type: "GET",
    //         url: "/SuperAdmin/PendingRequestCount",
    //         data: {

    //         },
    //         success: function (res) {
    //             if (res != "false") {
    //                 if ("@Role" == "SuperAdmin")
    //                 {
    //                     document.getElementById('lblPendingRequestsCount').innerHTML = '(' + res + ')';
    //                 }
    //                 if ("@Role" == "Admin")
    //                 {
    //                     document.getElementById('lblPendingRequestsCountForAdmin').innerHTML = '(' + res + ')';
    //                 }

    //             }
    //         },
    //         error: function (err) {
    //             autoLoader(err.statusText, "error", "Error !");
    //         }
    //     });
    // }
    // function UnApprovedCount() {
    //     $.ajax({
    //         type: "GET",
    //         url: "/SuperAdmin/UnApprovedCount",
    //         data: {

    //         },
    //         success: function (res) {
    //             if (res != "false") {
    //                 if ("@Role" == "SuperAdmin") {
    //                     document.getElementById('lblUnApprovCount').innerHTML = '(' + res + ')';
    //                 }

    //             }
    //         },
    //         error: function (err) {
    //             autoLoader(err.statusText, "error", "Error !");
    //         }
    //     });
    // }

</script>