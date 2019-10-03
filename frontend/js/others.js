function personaldetails() {
    var competitiveExamsAppeared = document.getElementById('competitiveExamsAppeared').value;
    var clubs = document.getElementById('clubs').value;
    var eventsOrganised = document.getElementById('eventsOrganised').value;
    var eventsAttended = document.getElementById('eventsAttended').value;
    var workshopsOrganised = document.getElementById('workshopsOrganised').value;
    var workshopsAttended = document.getElementById('workshopsAttended').value;
    var eventsAndWorkshopDescription = document.getElementById('eventsAndWorkshopDescription').value;
    var papersAndProject = document.getElementById('papersAndProject').value;
    var papersAndProjectStatus = document.querySelector('input[name="research"]:checked').value;
    var fieldsOfSpecialization = document.getElementById('fieldsOfSpecialization').value;
    var computerLanguagesKnown = document.getElementById('computerLanguagesKnown').value;


    var payload = {
        "competitiveExamsAppeared": competitiveExamsAppeared,
        "clubs": clubs,
        "eventsOrganised": eventsOrganised,
        "eventsAttended": eventsAttended,
        "workshopsOrganised": workshopsOrganised,
        "workshopsAttended": workshopsAttended,
        "eventsAndWorkshopDescription": eventsAndWorkshopDescription,
        "papersAndProject": papersAndProject,
        "papersAndProjectStatus": papersAndProjectStatus,
        "fieldsOfSpecialization": fieldsOfSpecialization,
        "computerLanguagesKnown": computerLanguagesKnown
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": baseURL + "/api/otherdetails",
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
        "url": baseURL + "/api/otherdetails",
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
        document.getElementById('competitiveExamsAppeared').value = res.competitiveExamsAppeared;
        document.getElementById('clubs').value = res.clubs;
        document.getElementById('eventsOrganised').value = res.eventsOrganised;
        document.getElementById('eventsAttended').value = res.eventsAttended;
        document.getElementById('workshopsOrganised').value = res.workshopsOrganised;
        document.getElementById('workshopsAttended').value = res.workshopsAttended;
        document.getElementById('eventsAndWorkshopDescription').value = res.eventsAndWorkshopDescription;
        document.getElementById('papersAndProject').value = res.papersAndProject;
        document.getElementById('fieldsOfSpecialization').value = res.fieldsOfSpecialization;
        document.getElementById('computerLanguagesKnown').value = res.computerLanguagesKnown;
    }).fail(function (jqXHR, textStatus) {
        //alert(jqXHR.responseJSON.message);
    });
}

window.onload = function () {
    getpersonaldetails();
};