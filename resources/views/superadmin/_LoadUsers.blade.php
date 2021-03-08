@model IEnumerable<SpaceTechPG.Models.tbl_users>
<style>
    .btn-info, .btn-warning, .btn-danger {
        border-radius: 0px;
    }

    thead {
        background-color: #3f3f3f;
        color: #fff;
    }
</style>

<table class="table table-striped" id="tbl_Users" style="width:100%;">
    <thead>
        <tr>
            <th>
              First Name
            </th>
            <th>
                Last Name
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
        @foreach (var item in Model)
        {
            <tr>
                <td>
                    @Html.DisplayFor(modelItem => item.first_name)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.last_name)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.mobile_no)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.email)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.tbl_sources.source_name)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.tbl_role.role_name)
                </td>
              
            </tr>
        }
    </tbody>
</table>
