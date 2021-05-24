
<style>
    .btn-info, .btn-warning, .btn-danger {
        border-radius: 0px;
    }

    thead {
        background-color: #3f3f3f;
        color: #fff;
    }
</style>
<table class="table table-striped shadowboxTable" id="tbl_FileType" style="width:100%;">
    <thead>
        <tr>
            <th>
              Name
            </th>
            <th>
                Extension
            </th>
            <th style="width:50px;">
                Is Active
            </th>
            <!-- <th>
                Action
            </th> -->
            
        </tr>
    </thead>
    <tbody>
        @foreach ($ext as $p)
            <tr>
                <td>
                    {{$p->datatype_name}}
                </td>
                <td>
                    {{$p->datatype_extension}}
                </td>
                <td>
                <label onclick="IsActive('{{$p->datatype_id}}')"  class="btn btn-success" style="border-radius:10px;"> <input type="checkbox" checked />InActive</label>
                   
                   
                </td>
                <!-- <td>
                    <label onclick="DeleteType('@item.datatype_id')" class="btn btn-danger" style="border-radius:10px;">Delete</label>

                </td> -->
            </tr>
        @endforeach
    </tbody>
</table>

<!-- 