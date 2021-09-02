
@extends('main')

@section('content')

        <style>

            h3 {
                font-weight: 900;
            }

        
        </style>

    <input type="hidden" id="hidDataId" />
    <br />
    <br />

    <div class="col-md-12">
        <div class="col-md-3">

            <!-- <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Departments</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">
                            <select id="deps" class="select2" name="dep" multiple="multiple" style="width:500px;">
                            
                                @foreach($deps as $id => $n)
                                    <option value="{{$id}}">{{$n}}</option>
                                @endforeach

                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Divisions</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">
                            <select id="divis" class="select2" name="divi" multiple="multiple" style="width:500px;">
                                @foreach($divs as $id => $n)
                                    <option value="{{$id}}">{{$n}}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Districts</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">
                            <select id="dists" class="select2" name="dist" multiple="multiple" style="width:500px;">
                             
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rowPanel">
                <div class="col-md-12">
                    <div class="panel panel-info">
                        <div class="panel-heading">
                            <h3 class="panel-title">Tehsils</h3>
                            <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                        </div>
                        <div class="panel-body collapse">
                            <select id="tehs" class="select2" name="teh" multiple="multiple" style="width:500px;">
                               
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12">
                <span id="srchbtn" class="btn btn-primary btn-block" >Search</span>
                <br />
                <span class="btn btn-block" style="background-color:black;color:white;" onclick="Reset();">Reset Filters</span>
            </div> -->


            <!-- new search design-->
            <input type="hidden" id="selected_dep" value="">
            <div id="inputdiv"><input type="hidden"  id="selected_divi" name="selected_divi" class="selected_divi"  value=""></div>
            
            <div id="slideOut">
                <div class="modal-content">
                    <div class="modal-header"> 
                        <p class="modal-title">Search Data Basis On Following Filters</p>
                    </div>
                    <div class="modal-body">
                        <div class="drawer-body">
                            <button class="collapsible active">Select Departments</button>
                                <div class="content">
                                    @foreach($deps as $id => $n)
                                        <input type="button" class="dep_input input_style" value="{{$n}}">
                                    @endforeach
                                </div>
                        </div>
                        <br>
                        <div class="drawer-body">
                            <button class="collapsible">Select Divisions</button>
                                <div class="content">
                                    @foreach($divs as $id => $n)
                                        <input type="button" class="divi_input input_style" value="{{$n}}">
                                    @endforeach
                                </div>
                        </div>
                        <br>
                        <div class="drawer-body">
                            <button class="collapsible">Select Districts</button>
                                <div class="content" id="d_content">
                                    <p id="dum_p">First Select Division</p>
                                </div>
                        </div>
                        <br>
                        <div class="drawer-body">
                            <button class="collapsible">Select Tehsils</button>
                                <div class="content" id="t_content">
                                    <p>First Select District</p>
                                </div>
                        </div>
                        <br>
                        <br>
                        <button class="pull-right" type="button" onclick="remove_my_bread_crumbs()" style="border:1px solid #2FA085;padding:7px 20px;color:#121010;background:#cdb129; margin-left:5px !important;">Filter Data</button>
                        <button class="pull-right" type="button" onclick="remove_my_bread_crumbs()" style="border:1px solid #2FA085;padding:7px 20px;color:#fff;background:#2FA085;">Reset Filter</button>
                        
                    </div>
                    <!-- <div class="modal-footer"></div> -->
                </div>
            </div>
        </div>


        <div class="col-md-9">
        <div id="tblData"></div>
        </div>
    </div>
    <div class="tab-content col-md-10 col-md-offset-1">
        <div class="clearfix"></div><br /><br />
        <div id="Data_Grid"></div>
        <table class="table table-responsive" data-vertable="ver2" id="tblGrid"></table>
    </div>

    <div id="UpdateAccessModal" class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog" style="width:60%;">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Add File</h4>
                </div>
                <div class="modal-body">
                    <table class="table">
                        <tr>
                            <td><strong>Privacy Level</strong></td>
                            <td>
                                <select id="ddlPrivacyUpdate" class="form-control" name="privacy_level">
                                    <option selected disabled>--Select Privacy Level--</option>
                                    <option value="Public">Public</option>
                                    <option value="Protected">Protected</option>
                                    <option value="Private">Private</option>
                                </select>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">


                    <button type="button" class=" btn btn-success" style="color:white;" onclick="savebtn()" id="btnUpdateAccess">Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>



        <script>

const collapsible = document.getElementsByClassName("collapsible");

for (let i = 0; i < collapsible.length; i++) {
  collapsible[i].addEventListener("click", e => e.currentTarget.classList.toggle("active"));
}
          
         $(document).ready(function () {
            // $.ajaxSetup({
            //     headers: {
            //     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            //     }
            // });       
            LoadDataPage();
            // $('.jqselect2').select2();
            $('.select2').select2({

            });
            // $('#departments').select2({
            //     // placeholder: 'Select Departments'
            // });


            // $("#selected_divi").on("change", function() {
            // alert($(this).val()); 
            // console.log('Text1 changed!')
            // });

            $("#selected_divi").on("change", function() {
                var divids= $(this).val();
                console.log(divids);
                if(divids)
                {
                    $.ajax({
                        url : 'district/' +JSON.stringify(divids),
                        type : "GET",
                        dataType : "json",
                        success:function(data){
                            console.log(data);
                            $("#dum_p").hide();
                            $("#d_content").empty();
                            for(var i=0;i<data.length;i++){
                                
                                 $("#d_content").append('<input type="button" class="dist_input input_style" value="'+ data[i].district_name +'">');
                                // $('select[name="dist"]').append('<option value="'+ data[i].district_id +'">'+ data[i].district_name +'</option>');
                            }
                        }
                    });
                }
                else
                {
                    $("#dum_p").show();
                }
            });
            $('select[name="dist"]').on('change',function(e){
                e.preventDefault();
                var distds= $(this).val();
                // console.log(divids);
                if(distds)
                {
                    $.ajax({
                        url : 'tehsil/' +JSON.stringify(distds),
                        type : "GET",
                        dataType : "json",
                        success:function(data){
                            // console.log(data);
                            $('select[name="distds"]').empty();
                            for(var i=0;i<data.length;i++){
                                $('select[name="teh"]').append('<option value="'+ data[i].tehsil_id +'">'+ data[i].tehsil_name +'</option>');
                            }
                        }
                    });
                }
                else
                {
                    $('select[name="teh"]').empty();
                }
            });

            $('#srchbtn').on('click',function(){
                
                // e.preventDefault();
                var loaderId = showLoader("Loading Data..", "warning");
                var alldata={
                        // page: page,
                        Departments: $('#deps').val(),
                        Divisions: $('#divis').val(),
                        Districts: $('#dists').val(),
                        Tehsils: $('#tehs').val(),
                        };
                        console.log(alldata)
                $.ajax({
                    url : 'searchdata/' +JSON.stringify(alldata),
                    type : "GET",
                    success:function(data){
                        console.log(data);
                        // $("#tblData").empty();
                        hideLoader(loaderId);
                        $("#tblData").html(data);
                    }
                });
            });


        });

       
           function LoadDataPage() {
                var loaderId = showLoader("Loading Data..", "warning");
                $.ajax({
                    type : "GET", 
                    url : 'loaddata/',
                    success:function(data){
                        // console.log(data);
                        hideLoader(loaderId);
                        $("#tblData").html(data);
                        
                    }
                });
            }
            function detailbtn(data){
                var loaderId = showLoader("Loading Data..", "warning");
                $.ajax({
                    type : "GET", 
                    url : 'deatilbtn/'+data,
                    success:function(data){
                        // console.log(data);
                        hideLoader(loaderId);
                        $("#tblData").html(data);
                        
                    }
                });
            }
            function Requestbtn(id){
                var loaderId = showLoader("Requesting Data..", "warning");
                $.ajax({
                    type : "GET", 
                    url : 'reqbtnf/'+JSON.stringify(id),
                    dataType : "json",
                    success:function(res){
                        var r=JSON.parse(res)
                        if (r == true) {
                        hideLoader(loaderId);
                        autoLoader("Your Request is Sent  and Please Wait For Approval", "success", "Request Sent!");
                        // console.log(res)
                        // Reset();
                        }
                        else
                        {
                            autoLoader('Request can not be Sent", "error", "Error !"');
                        }
                        
                        
                    }
                });
            }

                // function downloadbtn(id){
                //     var loaderId = showLoader("Preparing for Download..", "warning");
                //     $.ajax({
                //         type : "GET", 
                //         url : 'download/'+id,
                        
                //         success:function(res){
                        
                //             hideLoader(loaderId);
                //             autoLoader("Downloaded Successfully...", "success");
                            
                //         }
                //     });
                // }

            function Reset() {
                $('#deps').val(null);
                $('#deps').trigger('change');
                $('#divis').val(null);
                $('#divis').trigger('change');
                $('#dists').val(null);
                $('#dists').trigger('change');
                $('#tehs').val(null);
                $('#tehs').trigger('change');
            }

            function fetch_select(v){}

            
            function showUpdateAccessModal(id) {
                $('#hidDataId').val(id);
                $("#UpdateAccessModal").modal("show");
            }

            function savebtn() {
                var reqdata={
                        level:$('#ddlPrivacyUpdate').val(),
                        data_id:$('#hidDataId').val()
                    };
                $.ajax({
                    type: "get",
                    url: "updateaccesslevel/" +JSON.stringify(reqdata),
                    // dataType : "json",
                    success: function (res) {
                        var r=JSON.parse(res)
                        if(r == true){
                            autoLoader("Privacy Access level Updated Successfully ", "success", "Success!");
                            $('#UpdateAccessModal').modal('hide');
                        }
                        else {
                            autoLoader("can't Update", "error", "Error !");
                            $('#UpdateAccessModal').modal('hide');
                        }
                    }
                });   
            }
          
           
            $(document).on('click', '.panel-heading span.clickable', function (e) {
                var $this = $(this);
                if (!$this.hasClass('panel-collapsed')) {
                    $this.parents('.panel').find('.panel-body').slideUp();
                    $this.addClass('panel-collapsed');
                    $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                } else {
                    $this.parents('.panel').find('.panel-body').slideDown();
                    $this.removeClass('panel-collapsed');
                    $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                }
            })
            // function RequestData(id) {
            //     var accessLevel = $('#ddlPrivacyUpdate').val();
            //     $.ajax({
            //         type: "GET",
            //         url: "/Admin/RequestData",
            //         data: {
            //             id: id
            //         },
            //         success: function (res) {
            //             if (res == "true") {
            //                 autoLoader("Your Request is Sent  and Please Wait For Approval", "success", "Request Sent!");
            //                 // LoadDataPage();
            //                 $('#hidDataId').val(null);
            //             }
            //             else {
            //                 autoLoader("Request can not be Sent", "error", "Error !");
            //             }
            //         },
            //         error: function (err) {
            //             autoLoader(err.statusText, "error", "Error !");
            //         }
            //     });
            // }
            function UpdateAccess() {
                var id = $('#hidDataId').val();
                var accessLevel = $('#ddlPrivacyUpdate').val();
                $.ajax({
                    type: "GET",
                    url: "/Admin/UpdateAccess",
                    data: {
                        id: id,
                        accessLevel: accessLevel
                    },
                    success: function (res) {
                        if (res == "true") {
                            autoLoader("Record Updated", "success", "Update !");
                            // LoadDataPage();
                            $('#hidDataId').val(null);
                            $('#UpdateAccessModal').modal('hide');
                        }
                        else {
                            autoLoader("Record can not be Updated", "error", "Error !");
                        }
                    },
                    error: function (err) {
                        autoLoader(err.statusText, "error", "Error !");
                    }
                });
            }
           
            function getDistricts(elem) {
                var id = $(elem).val();
                var formData = new FormData();
                formData.append("Divisions", id);
                //alert(id);
                $.ajax({
                    type: "POST",
                    url: "/Admin/bind_combo_Districts",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) { bind_combo_Districts(data); },
                    error: function () {
                        autoLoader(res, "error");
                    }
                });
            }
            // function LoadDataPage(page) {
            //     var loaderId = showLoader("Loading Data..", "warning");
            //     var Departments = $('#deps').val();
            //     var Divisions = $('#divis').val();
            //     var Districts = $('#dists').val();
            //     var Tehsils = $('#tehs').val();
            //     $.ajax({
            //         type: "POST",
            //         url: "/Admin/Load_DataPage",
            //         data: {
            //             page: page,
            //             Departments: Departments,
            //             Divisions: Divisions,
            //             Districts: Districts,
            //             Tehsils: Tehsils
            //         },
            //         success: function (res) {
            //             $("#tblData").html(res);
            //             hideLoader(loaderId);
            //         },
            //         error: function (err) {
            //             autoLoader(err.statusText, "error", "Error !");
            //         }
            //     });
            // }
            
            function getTehsils(elem) {
                var id = $(elem).val();
                var formData = new FormData();
                formData.append("Districts", id);
                //alert(id);
                $.ajax({
                    type: "POST",
                    url: "/Admin/bind_combo_Tehsil",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) { bind_combo_Tehsil(data); },
                    error: function () {
                        autoLoader(res, "error");
                    }
                });
            }
            function bind_combo_Districts(data) {
                $("#ddlDistrictsSearch option:selected").prop("selected", false);
                $("#ddlDistrictsSearch option").remove();
                var markup = null;
                for (var x = 0; x < data.length; x++) {
                    markup += "<option value=" + data[x].district_id + ">" + data[x].district_name + "</option>";
                }
                $("#ddlDistrictsSearch").html(markup);
                $('#ddlDistrictsSearch').multiselect('rebuild');
            }
            
            function bind_combo_Tehsil(data) {
                $("#ddlTehsil option:selected").prop("selected", false);
                $("#ddlTehsil option").remove();
                var markup = null;
                for (var x = 0; x < data.length; x++) {
                    markup += "<option value=" + data[x].tehsil_id + ">" + data[x].tehsil_name + "</option>";
                }
                $("#ddlTehsil").html(markup);
                $('#ddlTehsil').multiselect('rebuild');
            }



           


            //remove seat from list
function removeSeat(seatListElm, seatValue) {
    var arr=seatListElm.value.split(',');
     
     var p=arr.indexOf(seatValue);
     if(p!=-1){
         arr.splice(p, 1);
         seatListElm.value=arr.join(',');
     }
     $("#selected_divi").trigger( 'change' ); // Triggers the change event
    
}


//add seat to list
function addSeat(seatListElm, seatValue) {
    var arr=seatListElm.value.split(',');
    if(arr.join()==''){ arr=[]; }
    
    var p=arr.indexOf(seatValue);
    if(p==-1){
        arr.push(seatValue); //append
        arr=arr.sort(); //sort list
        seatListElm.value=arr.join(',');
    } 

    $("#selected_divi").trigger( 'change' ); // Triggers the change event
   
}

//called everytime a seat is clicked
function depClick(seat) {
    seat = (this instanceof HTMLInputElement ) ? this : seat;
    var firstSelected;
    var selectedSeats = [];
    var thisInputHasAlreadyBeenSeen = false;
    var confirmedSeats = [];
    if (seat.classList.contains('reserved')==false) {

        if (seat.classList.toggle('selected')) {
            addSeat(document.getElementById('selected_dep'), seat.value);
            $(".dep_input").each(function() {
                if(this != seat) {
                if(firstSelected == null && this.classList.contains('selected')) {
                    firstSelected = this;
                    selectedSeats.push(firstSelected);
                    confirmedSeats = selectedSeats.slice();
                } else if (firstSelected) {
                    if(this.classList.contains('selected')) {
                        selectedSeats.push(this);
                    confirmedSeats = selectedSeats.slice();
                       }
                    if(!this.classList.contains('reserved')) {
                    selectedSeats.push(this);
                     }
                else{
                    if(!thisInputHasAlreadyBeenSeen) {
                    selectedSeats = [];
                    firstSelected = null;
                    } else {
                        return false;
                    }
                }
                }
                } else {
                    selectedSeats.push(this);
                    confirmedSeats = selectedSeats.slice();
                    if(firstSelected == null) {
                        thisInputHasAlreadyBeenSeen = true;
                        firstSelected = this;
                    }
                }
            });
            // if(confirmedSeats.length > 1) {
            // selectAll(confirmedSeats);
            // }
        } else {
            removeSeat(document.getElementById('selected_dep'), seat.value);
        }
      
    } else {
        alert("This seat is reserved!\nPlease select another seat");
        removeSeat(document.getElementById('selected_dep'), seat.value);
        return;
    }
}


//adding event click to seats
var elms=document.getElementsByClassName('dep_input');
for(var i=0, l=elms.length ; i<l ; i++){
    elms[i].onclick=depClick;
}

// function selectAll(seats) {
//     seats.forEach(function(seat) {
//         seat.className = seat.className + ' selected';
//     });
// }










//called everytime a seat is clicked
function divisionClick(seat) {
    seat = (this instanceof HTMLInputElement ) ? this : seat;
    var firstSelected;
    var selectedSeats = [];
    var thisInputHasAlreadyBeenSeen = false;
    var confirmedSeats = [];
    if (seat.classList.contains('reserved')==false) {

        if (seat.classList.toggle('selected')) {
            addSeat(document.getElementById('selected_divi'), seat.value);
            $(".divi_input").each(function() {
                if(this != seat) {
                if(firstSelected == null && this.classList.contains('selected')) {
                    firstSelected = this;
                    selectedSeats.push(firstSelected);
                    confirmedSeats = selectedSeats.slice();
                } else if (firstSelected) {
                    if(this.classList.contains('selected')) {
                        selectedSeats.push(this);
                    confirmedSeats = selectedSeats.slice();
                       }
                    if(!this.classList.contains('reserved')) {
                    selectedSeats.push(this);
                     }
                else{
                    if(!thisInputHasAlreadyBeenSeen) {
                    selectedSeats = [];
                    firstSelected = null;
                    } else {
                        return false;
                    }
                }
                }
                } else {
                    selectedSeats.push(this);
                    confirmedSeats = selectedSeats.slice();
                    if(firstSelected == null) {
                        thisInputHasAlreadyBeenSeen = true;
                        firstSelected = this;
                    }
                }
            });
            // if(confirmedSeats.length > 1) {
            // selectAll(confirmedSeats);
            // }
        } else {
            removeSeat(document.getElementById('selected_divi'), seat.value);
        }
      
    } else {
        alert("This seat is reserved!\nPlease select another seat");
        removeSeat(document.getElementById('selected_divi'), seat.value);
        return;
    }
}


//adding event click to seats
var elms=document.getElementsByClassName('divi_input');
for(var i=0, l=elms.length ; i<l ; i++){
    elms[i].onclick=divisionClick;
}



        </script>



@endsection