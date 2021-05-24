

<table class="table table-striped" id="tbl_Users" style="width:100%;">
    <thead>
        <tr>
            <th>
               Name
            </th>
            <th>
               Mobile
            </th>
            <th>
               Email
            </th>
            <th>
               Source
            </th>
            <th>
               Role
            </th>
           
        </tr>
    </thead>
    <tbody>
        @foreach ($adms as $p)
        
            <tr>
                <td>
                    {{$p->name}}
                </td>
                <td>
                    {{$p->mobile_no}}
                </td>
                <td>
                    {{$p->email}}
                </td>
                <td>
                    {{$p->source_name}}
                <td>
                    Admin
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
<!-- <div><h1 class="colspan-5">no data found</h1></div> -->
