function login() {
  var password = document.getElementById('password').value;
  var username = document.getElementById('reg').value;

  var payload = {
    'username': username,
    'password': password
  }

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": baseURL + "/api/auth/login",
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
    localStorage.setItem('token', response.token);
    alert("Login Successful");
    location.href = location.href.replace(/\/[^\/]*$/, '/personal.html');
  }).fail(function (jqXHR, textStatus) {
    alert(jqXHR.responseJSON.message);
  });
}