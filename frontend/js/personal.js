function signup() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var phone = document.getElementById('phone').value;
    var username = document.getElementById('reg').value;

    var payload = {
        'name': name,
        'email': email,
        'username': username,
        'password': password,
        'phoneNumber': phone
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": baseURL + "/api/auth/register",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(payload)
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        alert("Registration Successful");
        location.href = location.href.replace(/\/[^\/]*$/, '/login.html');
    }).fail(function (jqXHR, textStatus) {
        alert(jqXHR.responseJSON.message);
    });
}