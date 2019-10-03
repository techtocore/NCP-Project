function personaldetails() {
    var sslcInstitution = document.getElementById('sslcInstitution').value;
    var sslcBoard = document.getElementById('sslcboard').value;
    var sslcYearOfPassing = document.getElementById('sslcYearOfPassing').value;
    var sslcMarks = document.getElementById('sslcMarks').value;
    var hscInstitution = document.getElementById('hscInstitution').value;
    var hscBoard = document.getElementById('hscBoard').value;
    var hscYearOfPassing = document.getElementById('hscYearOfPassing').value;
    var hscMarks = document.getElementById('hscMarks').value;
    var ugAdmissionNumber = document.getElementById('ugAdmissionNumber').value;
    var ugAcademicProgram = document.getElementById('ugAcademicProgram').value;
    var ugYearOfJoining = document.getElementById('ugYearOfJoining').value;
    var ugEnrollmentStatus = document.getElementById('ugEnrollmentStatus').value;
    var ugYearofPassing = document.getElementById('ugYearofPassing').value;
    var ugSemester = document.getElementById('ugSemester').value;
    var ugSGPA = document.getElementById('ugSGPA').value;
    var ugCGPA = document.getElementById('ugCGPA').value;


    var payload = {
        "sslcInstitution": sslcInstitution,
        "sslcBoard": sslcBoard,
        "sslcYearOfPassing": sslcYearOfPassing,
        "sslcMarks": sslcMarks,
        "hscInstitution": hscInstitution,
        "hscBoard": hscBoard,
        "hscYearOfPassing": hscYearOfPassing,
        "hscMarks": hscMarks,
        "ugAdmissionNumber": ugAdmissionNumber,
        "ugAcademicProgram": ugAcademicProgram,
        "ugYearOfJoining": ugYearOfJoining,
        "ugYearofPassing": ugYearofPassing,
        "ugEnrollmentStatus": ugEnrollmentStatus,
        "ugSemester": ugSemester,
        "ugSGPA": ugSGPA,
        "ugCGPA": ugCGPA
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": baseURL + "/api/academicdetails",
        "method": "POST",
        "headers": {
            "Authorization": "Bearer " + localStorage.getItem('token'),
            "Content-Type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(payload)
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert("Updation Successful");
    }).fail(function (jqXHR, textStatus) {
        alert(jqXHR.responseJSON.message);
    });
}

function getpersonaldetails() {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": baseURL + "/api/academicdetails",
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + localStorage.getItem('token'),
            "Content-Type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        var res = response.data;
        document.getElementById('sslcInstitution').value = res.sslcInstitution;
        document.getElementById('sslcBoard').value = res.sslcBoard;
        document.getElementById('sslcYearOfPassing').value = res.sslcYearOfPassing;
        document.getElementById('sslcMarks').value = res.sslcMarks;
        document.getElementById('hscInstitution').value = res.hscInstitution;
        document.getElementById('hscBoard').value = res.hscBoard;
        document.getElementById('hscYearOfPassing').value = res.hscYearOfPassing;
        document.getElementById('hscMarks').value = res.hscMarks;
        document.getElementById('ugAdmissionNumber').value = res.ugAdmissionNumber;
        document.getElementById('ugAcademicProgram').value = res.ugAcademicProgram;
        document.getElementById('ugYearOfJoining').value = res.ugYearOfJoining;
        document.getElementById('ugEnrollmentStatus').value = res.ugEnrollmentStatus;
        document.getElementById('ugYearofPassing').value = res.ugYearofPassing;
        document.getElementById('ugSemester').value = res.ugSemester;
        document.getElementById('ugSGPA').value = res.ugSGPA;
        document.getElementById('ugCGPA').value = res.ugCGPA;
    }).fail(function (jqXHR, textStatus) {
        //alert(jqXHR.responseJSON.message);
    });
}

window.onload = function () {
    getpersonaldetails();
};