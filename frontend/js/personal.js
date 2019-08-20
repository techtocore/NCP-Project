function personaldetails() {
    var address = document.getElementById('address').value;
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var hosteller = document.querySelector('input[name="stay"]:checked').value;
    var religion = document.getElementById('religion').value;
    var caste = document.getElementById('caste').value;
    var gname = document.getElementById('gname').value;
    var gno = document.getElementById('gno').value;


    var payload = {
        'address': address,
        'gender': gender,
        'gaurdianName': gname,
        'gardainContactNumber': gno,
        'caste': caste,
        'religion': religion,
        'hosteller': hosteller
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": baseURL + "/api/personaldetails",
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
        "url": baseURL + "/api/personaldetails",
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
        document.getElementById('address').value = res.address;
        document.getElementById('religion').value = res.religion;
        document.getElementById('caste').value = res.caste;
        document.getElementById('gname').value = res.gaurdianName;

    }).fail(function (jqXHR, textStatus) {
        alert(jqXHR.responseJSON.message);
    });
}

window.onload = function () {
    getpersonaldetails();
};