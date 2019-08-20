function logout() {
    localStorage.removeItem('token');
    location.href = location.href.replace(/\/[^\/]*$/, '/logout.html');
}

function getName() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": baseURL + "/api/auth/me",
        "method": "GET",
        "headers": {
            "Authorization": "Bearer " + localStorage.getItem('token'),
            "Accept": "*/*",
            "Cache-Control": "no-cache",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "cache-control": "no-cache"
        }
    }

    $.ajax(settings).done(function (response) {
        document.getElementById('myname').innerHTML = response.data.name;
    });
}

getName();
document.getElementById('myname').onclick = function () {
    location.href = location.href.replace(/\/[^\/]*$/, '/account.html');
};
