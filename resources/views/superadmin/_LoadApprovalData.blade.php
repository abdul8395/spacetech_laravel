@model IEnumerable<SpaceTechPG.Models.tbl_data_upload>
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
        @foreach (var item in Model)
        {
            <tr>

                <td>
                    @Html.DisplayFor(modelItem => item.tbl_data_types.datatype_name)
                </td>

                <td>
                    @Html.DisplayFor(modelItem => item.tbl_sources.source_name)
                </td>

                <td>
                    @Html.DisplayFor(modelItem => item.data_name)
                </td>

                <td>
                    @Html.DisplayFor(modelItem => item.data_storage_date)
                </td>

                <td>
                    @Html.DisplayFor(modelItem => item.data_creation_date)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.data_description)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.data_crs)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.data_usage_purpose)
                </td>
                <td>
                    @Html.CheckBoxFor(modelItem => item.data_isvector)
                </td>
                <td>
                    @Html.DisplayFor(modelItem => item.data_resolution)
                </td>

                <td>
                    @if (Role == "SuperAdmin")
                    {
                        @Html.ActionLink("Download", "Download",
                         new { filepath = item.file_url }
                         , new { target = "_blank", @class = "glyphicon glyphicon-download btn btn-warning", @style = "color:black;" }
                     )
                        if (item.isapproved == null)
                        {
                            <input type="hidden" id="hidDataId" />
                            <input type="button" class="btn btn-danger" value="Reject" onclick="showAddFileModal('@item.data_id')" />
                            @*<input type="button" class="btn btn-danger" value="Reject" onclick="Reject('@item.data_id')" />*@
                            @*<input type="button" class="btn btn-success" value="Approve" onclick="ShowApproveModal('@item.data_id')" />*@
                            @*if (item.tbl_data_types.datatype_name.ToLower() == "shape")
                                                {
                                    <input type="button" class="btn btn-success" value="Approve" onclick="ShowApproveModal('@item.data_id')" />
                                }
                                else
                                {
                                    <input type="button" class="btn btn-success" value="Approve" onclick="Approve('@item.data_id')" />
                                }*@
                            <input type="button" class="btn btn-success" value="Approve" onclick="Approve('@item.data_id')" />
                        }

                    }
                </td>

            </tr>
        }
    </tbody>
</table>
