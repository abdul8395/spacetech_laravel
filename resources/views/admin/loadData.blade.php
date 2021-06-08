
@if($data)
    <!-- @foreach ($data as $d)
        @foreach ($d['dtup'] as $dt)
               {{ $dt->datatype_name }}


        @endforeach
    @endforeach -->
    @php
        $uid;
        $reqchk;
        
    @endphp
    @foreach ($data as $d)
       @if(Auth::check())
            @php
                $uid=$d['logusrid'];
                $reqchk=$d['reqchk'];
            @endphp
        @endif
    @endforeach


    @foreach($data as $p)
        <div class="list-items dataset-content dataset-content2 shadowboxTable">
            <div class="row">
                <div class="col-xs-6 ">
                @foreach($p['dtup'] as $dtup)
                    <span style="color: #007CE0;">{{$dtup->data_name}} </span>
                    <br />
                    <span style="font-family: 'Source Sans Pro', sans-serif; font-weight: 600; font-size: 13.25px; color: #888888; margin-top:3px;"><b>Source: </b>{{$dtup->name}}</span>
                    <br />

                        <!-- <small style="color: #888888;"><b>IsVector: </b>{{$dtup->data_isvector}} </small> -->
                    @if($dtup->data_isvector == true)
                    <input type="checkbox" checked></td>
                    @else
                    <input type="checkbox"></td>
                    @endif

                        <!-- <small style="color: #888887;"><b>IsVector: </b><input type="checkbox" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Resolution:</b> xy</small> -->
                    <br />
                    <small style="color:dimgrey;font-size:12px;">{{$dtup->data_storage_date}} | Dataset date: {{$dtup->data_creation_date}}</small>
                    <br />
                    <small style="color:dimgrey;font-size:12px;">CRS: {{$dtup->data_crs}}</small>
                @endforeach
                        <br />
                        <small><b>Divisions:</b></small>
                        @foreach($p['divinames'] as $divnames)
                            <small class="badge badge-success" style="background-color:#17a2b8;margin:0;font-size:12px;">{{$divnames->division_name}}</small>
                        @endforeach
                        <br />
                        <small><b>Districts:</b></small>
                        @foreach($p['distnames'] as $distnames)
                            <small class="badge badge-success" style="background-color:#17a2b8;margin:0;font-size:12px;">{{$distnames->district_name}}</small>
                        @endforeach
                            <br />
                        <small><b>Tehsils:</b></small>
                        @foreach($p['tehnames'] as $tehnames)
                            <small class="badge badge-success" style="background-color:#17a2b8;margin:0;font-size:12px;">{{$tehnames->tehsil_name}}</small>
                        @endforeach
                </div>

                <div class="col-xs-6">
                @foreach($p['dtup'] as $dtup)
                    <small style="font-size:12px;">
                        <strong>Description: </strong>
                        {{$dtup->data_description}}
                        
                    </small>
                    <hr />
                    <br />
                    <small style="font-size:12px;">
                        <strong>Usage: </strong>
                        {{$dtup->data_usage_purpose}}
                    </small>
                    <hr />

                    <small><b>File Type:</b></small>
                    <small class="badge badge-success" style="background-color:#2db55d;font-size:12px;">{{$dtup->datatype_name}}</small>
                    @endforeach
                        <br />
                        <small><b>Departments:</b></small>
                        @foreach($p['depname'] as $depname)
                            <small class="badge badge-success" style="background-color:#dfb100;margin:0;font-size:12px;">{{$depname->department_name}}</small>
                        @endforeach
                            <br />
                            @if(Auth::check())
                                @php
                                    $plvl;
                                    $duaccid;
                                @endphp
                                    @foreach($p['dtup'] as $dtup) @php $plvl=$dtup->privacy_level @endphp  @endforeach
                                    @foreach($p['download_access_user'] as $duid) @php $duaccid= $duid->user_id @endphp @endforeach
                                @if($uid== $duaccid || $plvl == 'Public')
                                    <div  class="pull-right" style="margin:5px;">
                                        <a href="{{ route('downloadfile', $dtup->data_id) }}" class="btn btn-warning btn-sm " style="color: white;
                                            height: 25px;
                                            font-size: 13px;
                                            ">Download</a>
                                    </div>
                                @endif
                            @else
                                @foreach($p['dtup'] as $dtup)
                                    @if($dtup->privacy_level == 'Public')
                                        <div  class="pull-right" style="margin:5px;">
                                            <a href="{{ route('downloadfile', $dtup->data_id) }}" class="btn btn-warning btn-sm " style="color: white;
                                                height: 25px;
                                                font-size: 13px;
                                                ">Download</a>
                                        </div>
                                    @endif
                                @endforeach
                            @endif
                            @foreach($p['dtup'] as $dtup)
                                @if(Auth::check())
                                    @if(Auth::user()->role==2 && $dtup->privacy_level == 'Protected' && $reqchk =='0' && $uid!=$dtup->user_id)
                                        <span class="btn btn-primary btn-sm pull-right" onclick="Requestbtn({{$dtup->data_id}})" style="color: white;
                                                height: 25px;
                                                font-size: 13px;
                                                margin-top:5px;"
                                        >Request</span>
                                    @endif
                                @endif
                                @if(Auth::check())
                                <!-- && $dtup->privacy_level == 'Private' -->
                                    @if(Auth::user()->role==2 && $uid==$dtup->user_id)
                                        <input type="hidden" id="hidDataId" />
                                        <span class="btn btn-success btn-sm pull-right" onclick="showUpdateAccessModal({{$dtup->data_id}})" style="height:25px; font-size:13px; margin-top:5px;">
                                        Update Access Level</span>
                                    @endif
                                @endif
                            @endforeach
                            
                <!-- <div class="pull-right" style="margin:5px;">
                    <span class="btn btn-success btn-sm" onclick="LoadDataPage()" style="height:25px; font-size:14px;"><span>Back</span></span>
                </div> -->



                </div>


            </div>

        </div>
        <br />
    @endforeach
@else

<h1 class="colspan-5">no data found</h1>

@endif 