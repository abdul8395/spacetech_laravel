@model IEnumerable<SpaceTechPG.Models.tbl_approval_log>
<style>
    .btn-info, .btn-warning, .btn-danger {
        border-radius: 0px;
    }

    thead {
        background-color: #3f3f3f;
        color: #fff;
    }
</style>
@{
    string Role = string.Empty;
    string Email = string.Empty;
    int UserId = 0;
    if (Session["Role"] != null)
    {
        Role = Session["Role"].ToString();
    }
    if (Session["UserId"] != null)
    {
        UserId = int.Parse(Session["UserId"].ToString());
    }
}
<table class="table table-striped" id="tbl_Data" style="width:100%;">
    <thead>
        <tr>
            
            <th>
                Type
            </th>
            <th>
                Name
            </th>
            <th>
                Storage Date
            </th>
            <th>
                Data Source
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
                Approval Desc.
            </th>
             <th>
                    Status
             </th>
          

        </tr>
    </thead>
    <tbody>
        @foreach (var item in Model)
        {
        <tr>

            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.tbl_data_types.datatype_name)
            </td>
            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.data_name)
            </td>

            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.data_storage_date)
            </td>
            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.tbl_sources.source_name)
            </td>
            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.data_creation_date)
            </td>
            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.data_description)
            </td>
            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.data_crs)
            </td>
            <td>
                @Html.DisplayFor(modelItem => item.tbl_data_upload.data_usage_purpose)
            </td>
            <td>
                @Html.CheckBoxFor(modelItem => item.tbl_data_upload.data_isvector)
            </td>
            <td>
                @Html.DisplayFor(modelItem => item.description)
            </td>
            
            <td>
                @if (item.tbl_data_upload.isapproved == null)
                {
                    <p>Pending</p>
                }
                else if (item.tbl_data_upload.isapproved == true)
                {
                    <p>Approved</p>
                }
                else
                {
                    <p>Rejected</p>
                }

            </td>

        </tr>
        }
    </tbody>
</table>
