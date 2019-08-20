function login() {
    var password = document.getElementById('password').nodeValue;
    var username = document.getElementById('reg').nodeValue;

    var payload = {
        'username': username,
        'password': password
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:3000/api/auth/login",
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