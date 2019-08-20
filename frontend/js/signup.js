function signup() {
    var name = document.getElementById('name').nodeValue;
    var email = document.getElementById('email').nodeValue;
    var password = document.getElementById('password').nodeValue;
    var phone = '9876543210';
    var username = document.getElementById('reg').nodeValue;

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
        "url": "http://localhost:3000/api/auth/register",
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
        alert("Registration Successfull");
      });
}