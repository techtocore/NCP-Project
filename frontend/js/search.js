const token = localStorage.getItem('token');

if (!token)
    location.href = location.href.replace(/\/[^\/]*$/, '/login.html');

function populateTable() {
    $('#example').html('');

    function generate(d) {
        let s = '';

        if (d.personalDetials)
            s += `Personal Details : <br>
        
            <table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
            <tr>
            <td>Address : </td>
            <td>  ${d.personalDetials.address}</td>
            </tr>
            <tr>
            <td>Caste : </td>
            <td>  ${d.personalDetials.caste}</td>
            </tr>
            <tr>
            <td>Hostller : </td>
            <td>  ${d.personalDetials.hosteller}</td>
            </tr>
            <tr>
            <td>Gaurdian Name : </td>
            <td>  ${d.personalDetials.gaurdianName}</td>
            </tr>
            <tr>
            <td>Gender : </td>
            <td>  ${d.personalDetials.gender}</td>
            </tr>
            <tr>
            <td>Religion : </td>
            <td>  ${d.personalDetials.religion}</td>
            </tr>
            </table>
            <br> `;
        if (d.otherDetails)
            s += `Other Details : <br>

            <table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
            <tr>
            <td>Clubs : </td>
            <td>  ${d.otherDetails.clubs}</td>
            </tr>
            <tr>
            <td>Competitive Exams Appeared : </td>
            <td>  ${d.otherDetails.competitiveExamsAppeared}</td>
            </tr>
            <tr>
            <td>Computer Languages Known : </td>
            <td>  ${d.otherDetails.computerLanguagesKnown}</td>
            </tr>
            <tr>
            <td>events Attended : </td>
            <td>  ${d.otherDetails.eventsAttended}</td>
            </tr>
            <tr>
            <td>Events Organised : </td>
            <td>  ${d.otherDetails.eventsOrganised}</td>
            </tr>
            <tr>
            <td>Fields Of Specialization : </td>
            <td>  ${d.otherDetails.fieldsOfSpecialization}</td>
            </tr>
            <tr>
            <td>Papers And Project : </td>
            <td>  ${d.otherDetails.papersAndProject}</td>
            </tr>
            <tr>
            <td>Papers And Project Status : </td>
            <td>  ${d.otherDetails.papersAndProjectStatus}</td>
            </tr>
            <tr>
            <td>Workshops Attended : </td>
            <td>  ${d.otherDetails.workshopsAttended}</td>
            </tr>
            <tr>
            <td>Workshops Organised : </td>
            <td>  ${d.otherDetails.workshopsOrganised}</td>
            </tr>
            </table>
            <br>`;
        if (d.academicDetails)
            s += `Academic Deatils : <br>

            <table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">
            <tr>
            <td>ugAdmissionNumber : </td>
            <td>  ${d.academicDetails.ugAdmissionNumber}</td>
            </tr>
            <tr>
            <td>ugAcademicProgram : </td>
            <td>  ${d.academicDetails.ugAcademicProgram}</td>
            </tr>
            <tr>
            <td>ugSemester : </td>
            <td>  ${d.academicDetails.ugSemester}</td>
            </tr>
            <tr>
            <td>ugEnrollmentStatus : </td>
            <td>  ${d.academicDetails.ugEnrollmentStatus}</td>
            </tr>
            <tr>
            <td>ugSGPA : </td>
            <td>  ${d.academicDetails.ugSGPA}</td>
            </tr>
            <tr>
            <td>ugCGPA : </td>
            <td>  ${d.academicDetails.ugCGPA}</td>
            </tr>
            <tr>
            <td>ugYearOfJoining : </td>
            <td>  ${d.academicDetails.ugYearOfJoining}</td>
            </tr>
            <tr>
            <td>ugYearofPassing : </td>
            <td>  ${d.academicDetails.ugYearofPassing}</td>
            </tr>
            <tr>
            <td>hscBoard : </td>
            <td>  ${d.academicDetails.hscBoard}</td>
            </tr>
            <tr>
            <td>hscInstitution : </td>
            <td>  ${d.academicDetails.hscInstitution}</td>
            </tr>
            <tr>
            <td>hscMarks : </td>
            <td>  ${d.academicDetails.hscMarks}</td>
            </tr>
            <tr>
            <td>hscYearOfPassing : </td>
            <td>  ${d.academicDetails.hscYearOfPassing}</td>
            </tr>
            <tr>
            <td>sslcBoard : </td>
            <td>  ${d.academicDetails.sslcBoard}</td>
            </tr>
            <tr>
            <td>sslcInstitution : </td>
            <td>  ${d.academicDetails.sslcInstitution}</td>
            </tr>
            <tr>
            <td>sslcMarks : </td>
            <td>  ${d.academicDetails.sslcMarks}</td>
            </tr>
            <tr>
            <td>sslcYearOfPassing : </td>
            <td>  ${d.academicDetails.sslcYearOfPassing}</td>
            </tr>
            </table>
            `;
        return s;
    }

    $.ajax({
        async: true,
        url: baseURL + "/api/users/data/all",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        success: function (res, textStatus, xmLHttpRequest) {
            var stringToAppend = [];
            for (let i = 0; i < res.data.length; i++) {
                var val = res.data[i];
                var data = {
                    username: val.username,
                    name: val.name,
                    email: val.email,
                    phoneNumber: val.phoneNumber,
                    faculty: val.isFaculty,
                    active: val.active

                }
                data['personalDetials'] = val.personalDetail;
                data['academicDetails'] = val.academicDetail;
                data['otherDetails'] = val.otherDetail;
                stringToAppend.push(data);
            }

            const table = $('#example').DataTable({
                data: stringToAppend,
                lengthChange: false,
                "order": [],
                columns: [
                    {
                        className: 'details-control',
                        orderable: false,
                        data: null,
                        defaultContent: ''
                    },
                    {
                        title: "Roll Number",
                        data: "username"
                    },
                    {
                        title: "Name",
                        data: "name"

                    },
                    {
                        title: "Email",
                        data: "email"
                    },
                    {
                        title: "Phone Number",
                        data: "phoneNumber"
                    },
                    {
                        title: "Active",
                        data: "active"
                    },
                    {
                        title: "Is Faculty",
                        data: "faculty"
                    }
                ],
                dom: 'Bfrtip',
                buttons: ['copy', 'excel', 'pdf', 'csv']
            });
            table.buttons().container()
                .insertBefore('#example_filter');
            $('#example tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = table.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child(generate(row.data())).show();
                    tr.addClass('shown');
                }
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseJSON.message);
            location.href = location.href.replace(/\/[^\/]*$/, '/login.html');
        }
    });
}

$(document).ready(function () {

    $.ajax({
        async: true,
        url: baseURL + "/api/auth/me",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        success: function (res, textStatus, xmLHttpRequest) {
            if (!res.roles.includes("Faculty"))
                location.href = location.href.replace(/\/[^\/]*$/, '/personal.html');
            populateTable();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseJSON.message);
            location.href = location.href.replace(/\/[^\/]*$/, '/login.html');
        }
    });
});