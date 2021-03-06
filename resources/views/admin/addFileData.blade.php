  

@extends('main')

@section('content')
<br />
<br />

<div class="col-md-offset-1 col-md-9 shadowboxTable" style="float:left; width:80%;" >
    <div class="col-md-3">
        <div class="rowPanel">
            <div class="col-md-12">
                <div class="panel panel-info ">
                    <div class="panel-heading ">
                        <h3 class="panel-title">Departments</h3>
                        <span class="pull-right panel-collapsed clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                    </div>
                    <div class="panel-body collapse">
                        <input type="checkbox" id="chkAllDepts" value="" onchange="SelectAllDepts();"><b> Select All</b><br />
                            @foreach($depts as $id => $n)
                                <input type="checkbox" value="{{$id}}" name="Department"> <label for="{{$id}}" style="font-weight:normal;"> {{$n}}</label><br />
                            @endforeach
                                
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="rowPanel">
            <div class="col-md-12">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title">Divisions</h3>
                        <span class="pull-right panel-collapsed  clickable"><i class="glyphicon glyphicon-chevron-down"></i></span>
                    </div>
                    <div class="panel-body collapse">
                        <input type="checkbox" id="chkAllDivisions" value="" onchange="chkAllDivisions();"><b> Select All</b><br />
                        @foreach($div as $id => $n)
                                <input type="checkbox" value="{{$id}}" name="Divisions" onchange="getDistricts();"><label for="{{$id}}" style="font-weight:normal;"> {{$n}}</label> <br />
                        @endforeach
                                
                    </div>
                </div>
            </div>
        </div>
        <div class="rowPanel">
            <div class="col-md-12">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title">Districts</h3>
                        <span class="pull-right clickable panel-collapsed "><i class="glyphicon glyphicon-chevron-down"></i></span>
                    </div>
                    <div class="panel-body collapse">
                    
                        <div id="dists"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="rowPanel">
            <div class="col-md-12">
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title">Tehsils</h3>
                        <span class="pull-right clickable panel-collapsed "><i class="glyphicon glyphicon-chevron-down"></i></span>
                    </div>
                    <div class="panel-body collapse">
                        <div id="tehs"></div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="col-md-9">
     <!-- Success message -->
     <!-- @if(Session::has('success'))
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
        <form action="{{url('/add_data_store')}}" method="POST" enctype="multipart/form-data">
                @csrf -->

            <div class="col-md-12" style="margin-top:5px;">
                <strong>Privacy Level</strong>
                <select id="ddlPrivacy" class="form-control" name="privacy_level">
                <option selected disabled>--Select Privacy Level--</option>
                    <option value="Public">Public</option>
                    <option value="Protected">Protected</option>
                    <option value="Private">Private</option>
                </select>
            </div>
    
            <div class="clearfix"></div>

            <div class="col-md-12" style="margin-top:5px;">
                <strong>Data Type</strong>
                <select id="ddlType" class="form-control" name="dtype" onchange = "FindAccept()">
                <option selected disabled>--Select Type of Data--</option>
                @foreach($type as $id => $n)
                <option value="{{$id}}">{{$n}}</option>
                @endforeach
                </select>
            </div>

            <div class="clearfix"></div>

            <div class="col-md-12" style="margin-top:5px;">
                <strong>Name</strong>
                <input type="text" id="txtDataName" name="name" class="form-control" style="margin-top: 10px;" placeholder="Enter Name Here" />
            </div>
            <div class="col-md-12" style="margin-top:5px;">
                <strong>File</strong>

                <input type='file' id="Data_Atachment" name="file" class='btn btn-default' />
            </div>
            <div class="clearfix"></div>
            <div class="col-md-12" style="margin-top:5px;">
                <strong>Description</strong>
                <textarea id="txtDescription" class="form-control" name="description" id="txtDescription" style="margin-top: 10px;" placeholder="Enter Description Here"></textarea>
            </div>
            <div class="col-md-12" style="margin-top:5px;">
                <strong>Usage</strong>
                <textarea id="txtUsage" class="form-control" name="usage" id="txtUsage" style="margin-top: 10px;" placeholder="Enter Usage Here"></textarea>
            </div>
            <div class="clearfix"></div>
            <div class="col-md-12" style="margin-top:5px;">
                <strong>CRS</strong>
                <input type="text" id="txtDataCRS" name="crs" class="form-control" style="margin-top: 10px;" placeholder="Enter CRS Here" />
            </div>
            <div class="col-md-12" style="margin-top:25px;">
                <strong class="col-md-2">Year of Data</strong>
                <div class="col-md-3">
                    <input type="text" name="datayear" class="datepicker form-control" value="09-08-2020" id="txtCreationDate">
                </div>
                <div class="col-md-7" id="divPDF">
                    <strong class="col-md-3">Page No Of Map</strong>
                    <div class=" col-md-9">
                        <input type="text" name="pagemap" class="form-control" id="PDFPages" placeholder="Page# With Comma Seprated String" />
                    </div>
                    
                </div>
                <div class="col-md-4" id="divRadioButtons">
                    <input type="radio" name="rdBtnImg" value="XY" id="rdBtnXY" onchange="ChngChkBox()" />&nbsp;<label for="male">XY</label><br>
                    <input type="radio" name="rdBtnImg" value="B-Box" id="rdBtnBBox" onchange="ChngChkBox()" />&nbsp;<label for="male">B-Box</label><br>
                </div>

            </div>
            <div class="clearfix"></div>
            <div class="col-md-6" style="margin-top:30px;">
                <strong>IsVector</strong><input type="checkbox" id="chkVector" style="margin-top:-5px; margin-left:50px;" />
            </div>
            <div id="rowResolution" class="col-md-6" style="margin-top:5px;">
                <strong>Resolution</strong>
                <input type="text" name="reso" class="form-control" style="margin-top: 10px;" placeholder="Enter Resolution Here..." id="txtResolution" />
            </div>
            <div class="clearfix"></div>
            <div class="col-md-12" id="rowImage" style="margin-top:15px;">
                <strong><label id="lblrowImage"></label></strong>
                <input type="text" class="form-control" id="txtrowImage" style="margin-top: 10px;" />
            </div>
            <div class="col-md-6 pull-right" style="margin-top:15px;">
                <div>
                    <button type="button" class=" btn btn-success" onclick="UpdateData()" id="btnUpdate">Update</button>
                    <button type="" class=" btn btn-success pull-right" onclick="saveData()"  id="btnSave" style="color:white;">Save</button>
                </div>
            </div>
        <!-- </form> -->
           
    </div>
</div>
<div class="clearfix"></div>
<br />
<br />
<br />


<script>

    $(document).ready(function () {

        document.getElementById('rowResolution').style.display = "none";
        document.getElementById('divPDF').style.display = "none";
        document.getElementById('rowImage').style.display = "none";
        var divChkBox = document.getElementById('divRadioButtons');
        divChkBox.style.visibility = "hidden";
        $("#chkVector").prop("checked", true);
        showAddFileModal();
        const checkbox = document.getElementById('chkVector')
        checkbox.addEventListener('change', (event) => {
            var rowResolution = document.getElementById('rowResolution');
            if (event.currentTarget.checked) {
                //alert('checked');
                rowResolution.style.display = "none";

            } else {
                //alert('not checked');
                rowResolution.style.display = "block";
            }
            $('#txtResolution').val('');
        })

    });

    $(document).on('click', '.panel-heading span.clickable', function (e) {
        var $this = $(this);
        //alert($this);
        //console.log($this);
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

    function ChngChkBox() {
        if (document.getElementById("rdBtnXY").checked == true) {
            document.getElementById('lblrowImage').innerHTML = 'XY-Des.';
        }
        else {
            document.getElementById('lblrowImage').innerHTML = 'B-Box-Des.';
        }
    }


    function getDistricts() {
        var Divisions = [];
        $.each($("input[name='Divisions']:checked"), function () {
            Divisions.push($(this).val());
        });
        console.log(Divisions)

        var str=''

            $.ajax({
                url : 'district/' +JSON.stringify(Divisions),
                type : "GET",
                dataType : "json",
                success:function(data){
                    $("#dists").empty();
                    // console.log(data);
                    str = '<input type="checkbox" id="chkAllDistricts" value="" onchange="chkAllDistricts();"><b> Select All</b><br />';
                    for(var i=0;i<data.length;i++){
                        str += '<input type="checkbox" value="'+ data[i].district_id +'" name="Districts" onchange="getTehsils();"><label for="'+ data[i].district_id +'" style="font-weight:normal;"> '+ data[i].district_name +'</label> <br />';
                    }
                    $('#dists').html(str);
                }
            });
    }
    
    function getTehsils() {
        var dist = [];
        $.each($("input[name='Districts']:checked"), function () {
            dist.push($(this).val());
        });
        console.log(dist)

        var str=''

            $.ajax({
                url : 'tehsil/' +JSON.stringify(dist),
                type : "GET",
                dataType : "json",
                success:function(data){
                    $("#tehs").empty();
                    // console.log(data);
                    str = '<input type="checkbox" id="chkAllTehsils" value="" onchange="chkAllTehsils();"><b> Select All</b><br />';
                    for(var i=0;i<data.length;i++){
                        str += '<input type="checkbox" value="'+ data[i].tehsil_id +'" name="Tehsils" ><label for="'+ data[i].tehsil_id +'" style="font-weight:normal;"> '+ data[i].tehsil_name +'</label> <br />';
                    }
                    $('#tehs').html(str);
                }
            });
    }
    
    
    function SelectAllDepts()
    {
        var chkAllDepts = $('#chkAllDepts').is(":checked");
        if (chkAllDepts == true)
        {
            $.each($("input[name='Department']"), function () {
                $(this).prop("checked", true);
            });
        }
        else
        {
            $.each($("input[name='Department']"), function () {
                $(this).prop("checked", false);
            });
        }

    }
    function chkAllDivisions()
    {
        var chkAllDivisions = $('#chkAllDivisions').is(":checked");
        if (chkAllDivisions == true)
        {
            $.each($("input[name='Divisions']"), function () {
                $(this).prop("checked", true);
            });
        }
        else
        {
            $.each($("input[name='Divisions']"), function () {
                $(this).prop("checked", false);
            });
        }
        getDistricts();
    }
    function chkAllDistricts() {
        var chkAllDistricts = $('#chkAllDistricts').is(":checked");
        if (chkAllDistricts == true) {
            $.each($("input[name='Districts']"), function () {
                $(this).prop("checked", true);
            });
        }
        else {
            $.each($("input[name='Districts']"), function () {
                $(this).prop("checked", false);
            });
        }
        getTehsils();
    }
    function chkAllTehsils() {
        var chkAllTehsils = $('#chkAllTehsils').is(":checked");
        if (chkAllTehsils == true) {
            $.each($("input[name='Tehsils']"), function () {
                $(this).prop("checked", true);
            });
        }
        else {
            $.each($("input[name='Tehsils']"), function () {
                $(this).prop("checked", false);
            });
        }

    }
    
    
    
    function saveData() {
        var Departments = [];
        var Division = [];
        var District = [];
        var Tehsil = [];
        var DeptText = [];
        $.each($("input[name='Department']:checked"), function () {
        var t = $(this).next("label").html();
            DeptText.push(t);
            Departments.push($(this).val());
        });
        var DivisionText = [];
        $.each($("input[name='Divisions']:checked"), function () {
        var t = $(this).next("label").html();
            DivisionText.push(t);
            Division.push($(this).val());
        });
        var DistrictText = [];
        $.each($("input[name='Districts']:checked"), function () {
        var t = $(this).next("label").html();
            DistrictText.push(t);
            District.push($(this).val());
        });
        var TehsilText = [];
        $.each($("input[name='Tehsils']:checked"), function () {
        var t = $(this).next("label").html();
            TehsilText.push(t);
            Tehsil.push($(this).val());
        });
        // console.log(TehsilText);
        
        var formData = new FormData();
        formData.append('_token', '{{ csrf_token() }}');
        if (document.getElementById("rdBtnXY").checked == true)
        {
            var ImageType = $('#rdBtnXY').val();
            formData.append("ImageType", ImageType);
        }
        else if (document.getElementById("rdBtnBBox").checked == true)
        {
            var ImageType = $('#rdBtnBBox').val();
            formData.append("ImageType", ImageType);
        }
        else
        {
            formData.append("ImageType", '');
        }

        var ImgDesc = $('#txtrowImage').val();
        formData.append("ImgDesc", ImgDesc);
        var DataId = 0; // $('#hidDataId').val();
        formData.append("Data_Id", DataId);
        var DataPrivacy = $('#ddlPrivacy').val();
        formData.append("DataPrivacy", DataPrivacy);
        var DataLevel = 'nolevel';
        if (Departments != '')
        {
            DataLevel = 'Province';
        }
        if (Division != '')
        {
            DataLevel = 'Division';
        }
        if (District != '') {
            DataLevel = 'District';
        }
        if (Tehsil != '') {
            DataLevel = 'Tehsil';
        }
        formData.append("DataLevel", DataLevel);
        formData.append("Departments", Departments);
        formData.append("DepartmentsText", DeptText);
        formData.append("Divisions", Division);
        formData.append("DivisionsText", DivisionText);
        formData.append("Districts", District);
        formData.append("DistrictsText", DistrictText);
        formData.append("Tehsils", Tehsil);
        formData.append("TehsilsText", TehsilText);
        var DataType = $('#ddlType').val();
        formData.append("DataType_Id", DataType);
        // var Department = '@Session["SectorId"]'; //$('#ddlDept').val();
        // formData.append("Dept_Id", Department);
        var Name = $('#txtDataName').val();
        formData.append("Data_Name", Name);
        var objA = $('#Data_Atachment').val();
        var Attachment = $('#Data_Atachment')[0].files[0];
        if (objA != undefined && objA != null && objA !== "") {
            var Attachment = $('#Data_Atachment')[0].files[0];
            if (Attachment.size > 999999999)
            {
                alert("Cannot upload! File is greater then 999GB");
                return;
            }
            else {
                formData.append("Data_URL", Attachment);
            }
        }
        else {
            autoLoader("Select a File First", "error", "Error !");
            return;
        }
        var CreationDate = $('#txtCreationDate').val();
        //alert(CreationDate);
        formData.append("Data_CreationDate", CreationDate);
        var Description = $('#txtDescription').val();
        formData.append("Data_Description", Description);
        var DataCRS = $('#txtDataCRS').val();
        formData.append("Data_CRS", DataCRS);
        var Usage = $('#txtUsage').val();
        formData.append("Data_Usage_Purpose", Usage);
        var IsVector = $('#chkVector').is(":checked");
        formData.append("Data_IsVector", IsVector);
        var Resolution = $('#txtResolution').val();
        formData.append("Data_Resolution", Resolution);
        var map_page_no_for_pdf = $('#PDFPages').val();
        formData.append("map_page_no_for_pdf", map_page_no_for_pdf);

        for (const formElement of formData) {
            console.log(formElement);
        }
        
        if (validate() == true) {
            var loaderId = showLoader("Saving Data..", "warning");
            $.ajax({
                type: "POST",
                url: "add_data_store",
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res == 'true') {
                        hideLoader(loaderId);
                        autoLoader("Saved Successfully...", "success");
                        console.log(res)
                        Reset();
                    }
                    else
                    {
                        autoLoader(res, "error");
                    }
                }
            });
        }
        else {

            autoLoader("Please fill neccessory fields.", "error");

        }

    }

    function Reset() {
        document.getElementById('rowResolution').style.display = "none";
        document.getElementById('rowImage').style.display = "none";
        var divChkBox = document.getElementById('divRadioButtons');
        divChkBox.style.visibility = "hidden";
        $("#chkVector").prop("checked", true);
        $('#txtrowImage').val(null);
        $('#ddlType').val(null);
        //$('#ddlDept').val(null);
        $('#Data_Atachment').val(null);
        $('#txtDataName').val('');
        $('#File').val('');
        //$('#txtCreationDate').val('');
        $('#txtDescription').val('');
        $('#txtDataCRS').val('');
        $('#txtUsage').val('');
        $("#chkVector").prop("checked", true);
        $('#txtResolution').val('');
        $('#ddlDpt').val(null);
        $('#ddlDpt').trigger('change');
        $('#ddlDivision').val(null);
        $('#ddlDivision').trigger('change');
        $('#ddlDistrict').val(null);
        $('#ddlDistrict').trigger('change');
        $('#ddlTehsil').val(null);
        $('#ddlTehsil').trigger('change');

    }

    function validate() {
        var DataPrivacy = $('#ddlPrivacy').val();
        var type = $("#ddlType").find("option:selected").text();
        var DataType = $('#ddlType').val();
        //var DataLevel = $('#ddlLevel').val();
        var Name = $('#txtDataName').val();
        var CreationDate = $('#txtCreationDate').val();
        var Description = $('#txtDescription').val();
        var DataCRS = $('#txtDataCRS').val();
        var Usage = $('#txtUsage').val();
        var PDFPages = $('#PDFPages').val();
        
        if (DataPrivacy == null || DataPrivacy == '' || DataType == null  || Name == '' || CreationDate == '' || Description == '' || DataCRS == '' || Usage == '') {
            return false;
        }
        if (type == 'PDF') {
            if (PDFPages == '') {
                return false;
            }
        }
        if ($('#chkVector').is(":checked")) {
            return true;
        }
        else {
            var Resolution = $('#txtResolution').val();
            if (Resolution == '') {
                return false;
            }
            else {
                return true;
            }

        }

    }

    function showAddFileModal() {

        var btnSave = document.getElementById('btnSave');
        btnSave.style.visibility = "visible";
        var btnUpdate = document.getElementById('btnUpdate');
        btnUpdate.style.visibility = "hidden";
        var html = "<input type='file' class='btn btn-default' id='Data_Atachment' />";
        $('#divAttachment').html(html);
        //$('#hidDataId').val(id);
        //$("#addFileModal").modal("show");

    }

    function FindAccept() {
        var id = $('#ddlType').val();
        if (id == '') {
            return false;
        }
        $('#txtrowImage').val(null);
        var type = $("#ddlType").find("option:selected").text();
        var divChkBox = document.getElementById('divRadioButtons');
        var divPDF = document.getElementById('divPDF');
        var rowImage = document.getElementById('rowImage');
        if (type == "Image") {
            divChkBox.style.visibility = "visible";
            rowImage.style.display = "table-row";
        }
        else {
            divChkBox.style.visibility = "hidden";
            rowImage.style.display = "none";
        }
        if (type == "PDF") {
            divPDF.style.display = "inline";
        }
        else {
            divPDF.style.display = "none";
        }
        $.ajax({
            url : 'getfiletype/' +JSON.stringify(id),
            type : "GET",
            success: function (res) {
                var r=JSON.parse(res)
                // console.log(r[0].datatype_extension)
                    document.getElementById("Data_Atachment").accept = r[0].datatype_extension;
            }
        });


    }
    
    
    
</script>
@endsection