@if($dtup)
    @foreach($dtup as $p)
        <div class="list-items dataset-content dataset-content2 shadowboxTable">
            <div class="row">
                <div class="col-xs-6 ">
                    <span style="color: #007CE0;">{{$p->data_name}} </span>
                    <br />
                    <span style="font-family: 'Source Sans Pro', sans-serif; font-weight: 600; font-size: 13.25px; color: #888888; margin-top:3px;"><b>Source: </b>{{$p->name}}</span>
                    <br />

                        <!-- <small style="color: #888888;"><b>IsVector: </b>{{$p->data_isvector}} </small> -->
                    @if($p->data_isvector == true)
                    <input type="checkbox" checked></td>
                    @else
                    <input type="checkbox"></td>
                    @endif

                        <!-- <small style="color: #888887;"><b>IsVector: </b><input type="checkbox" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Resolution:</b> xy</small> -->
                    <br />
                    <small style="color:dimgrey;font-size:12px;">{{$p->data_storage_date}} | Dataset date: {{$p->data_creation_date}}</small>
                    <br />
                    <small style="color:dimgrey;font-size:12px;">CRS: {{$p->data_crs}}</small>
    @endforeach
                        <br />
                        <small><b>Divisions:</b></small>
                        @foreach($divinames as $p)
                            <small class="badge badge-success" style="background-color:#17a2b8;margin:0;font-size:12px;">{{$p->division_name}}</small>
                        @endforeach
                         <br />
                        <small><b>Districts:</b></small>
                        @foreach($distnames as $p)
                            <small class="badge badge-success" style="background-color:#17a2b8;margin:0;font-size:12px;">{{$p->district_name}}</small>
                        @endforeach
                            <br />
                        <small><b>Tehsils:</b></small>
                        @foreach($tehnames as $p)
                            <small class="badge badge-success" style="background-color:#17a2b8;margin:0;font-size:12px;">{{$p->tehsil_name}}</small>
                        @endforeach
                </div>

                <div class="col-xs-6">
                @foreach($dtup as $p)
                    <small style="font-size:12px;">
                        <strong>Description: </strong>
                        {{$p->data_description}}
                        
                    </small>
                    <hr />
                    <br />
                    <small style="font-size:12px;">
                        <strong>Usage: </strong>
                        {{$p->data_usage_purpose}}
                    </small>
                    <hr />

                    <small><b>File Type:</b></small>
                    <small class="badge badge-success" style="background-color:#2db55d;font-size:12px;">{{$p->datatype_name}}</small>
                    @endforeach
                        <br />
                        <small><b>Departments:</b></small>
                        @foreach($depname as $p)
                            <small class="badge badge-success" style="background-color:#dfb100;margin:0;font-size:12px;">{{$p->department_name}}</small>
                        @endforeach
                            <br />
                        @foreach($dtup as $p)
                        @if($p->privacy_level == "Public")
                        <div  class="pull-right" style="margin:5px;">
                            <a href="{{ route('downloadfile', $p->data_id) }}" class="btn btn-warning btn-sm " style="color: white;
                                height: 25px;
                                font-size: 13px;
                                ">Download</a>
                        </div>
                        @endif
                        @endforeach
                            
               


                </div>
 <!-- <div class="pull-right" style="margin:5px;">
                    <span class="btn btn-success btn-sm" onclick="LoadDataPage()" style="height:25px; font-size:13px;"><span>Back</span></span>
                </div> -->


            </div>

        </div>
        <br />
    
@else

    <h1 class="colspan-5">no data found</h1>

@endif 