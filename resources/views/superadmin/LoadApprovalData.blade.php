
<style>
    .btn-info, .btn-warning, .btn-danger {
        border-radius: 0px;
    }

    thead {
        background-color: #3f3f3f;
        color: #fff;
    }
</style>

<table class="table table-striped" id="tbl_ApproveData" style="width:100%;">
    <thead>
        <tr>

            <th>
                Type
            </th>

            <th>
                Source
            </th>

            <th>
                Name
            </th>

            <th>
                Storage Date
            </th>

            <th>
                Creation Date
            </th>
            <th>
                Description
            </th>
            <th>
                CRS
            </th>
            <th>
                Usage Purpose
            </th>
            <th>
                IsVector
            </th>
            <th>
                Resolution
            </th>

            <th>
                Action
            </th>


        </tr>
    </thead>
    <tbody>
    @foreach ($data as $p)
            <tr>
                <td>
                {{$p->datatype_name}}
                </td>

                <td>
                {{$p->first_name}}
                </td>

                <td>
                {{$p->data_name}}
                </td>

                <td>
                {{$p->data_storage_date}}
                </td>

                <td>
                {{$p->data_creation_date}}
                </td>
                <td>
                {{$p->data_description}}
                </td>
                <td>
                {{$p->data_crs}}
                </td>
                <td>
                {{$p->data_usage_purpose}}
                </td>
                <td>
                    @if($p->data_isvector == true)
                    <input type="checkbox" checked></td>
                    @else
                    <input type="checkbox"></td>
                    @endif
                </td>
                <td>
                {{$p->data_resolution}}
                </td>
                <td>
                    <input type="button" class="btn btn-warning" value="Download" onclick="showAddFileModal('{{$p->data_id}}')" />
                    <input type="button" class="btn btn-danger" value="Reject" onclick="Reject('{{$p->data_id}}')" />
                    <input type="button" class="btn btn-success" value="Approve" onclick="ShowApproveModal('{{$p->data_id}}')" />    
                </td>
            </tr>
            @endforeach
    </tbody>
</table>
