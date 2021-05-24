@if($tbl_duplod)
    @foreach($tbl_duplod as $p)
        <div class="list-items dataset-content dataset-content2 shadowboxTable">
            <div class="row">
                <div class="col-xs-6 ">
                    <span style="color: #007CE0;">{{$p->data_name}} </span>
                    <br />
                    <span style="font-family: 'Source Sans Pro', sans-serif; font-weight: 600; font-size: 13.25px; color: #888888; margin-top:3px;"><b>Source: </b>{{$p->data_crs}}</span>
                    <br />

                        <small style="color: #888888;"><b>IsVector: </b>{{$p->data_isvector}} </small>

                        <!-- <small style="color: #888887;"><b>IsVector: </b><input type="checkbox" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Resolution:</b> xy</small> -->
                    <br />
                    <small style="color:dimgrey;font-size:12px;">{{$p->data_storage_date}} | Dataset date: {{$p->data_creation_date}}</small>
                    <br />
                    <small style="color:dimgrey;font-size:12px;">CRS: {{$p->data_crs}}</small>
                </div>

                <div class="col-xs-6">

                    <small style="font-size:12px;">
                        <strong>Description: </strong>
                        {{$p->data_description}}
                        
                    </small>
                    <hr />
                    <small style="font-size:12px;">
                        <strong>Usage: </strong>
                        {{$p->data_usage_purpose}}
                    </small>
                    <hr />

                    
                <div class="pull-right" style="margin:5px;">
                    <span class="btn btn-success btn-sm" onclick="detailbtn({{$p->data_id}})" style="height:25px; font-size:13px;"><span>Detail</span></span>
                </div>



                </div>


            </div>

        </div>
        <br />
    @endforeach
@else

    <h1 class="colspan-5">no data found</h1>

@endif 