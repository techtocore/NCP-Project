const token = localStorage.getItem('token');

if (!token)
    location.href = location.href.replace(/\/[^\/]*$/, '/login.html');

function upload() {
    var form = $('form')[0]; // You need to use standard javascript object here
    var formData = new FormData(form);

    $.ajax({
        async: true,
        url: baseURL + "/api/certificates/upload",
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        data: formData,
        success: function (res, textStatus, xmLHttpRequest) {
            alert("Upload successful")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseJSON.message);
        }
    });
}

function download(f) {

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    $.ajax({
        async: true,
        url: baseURL + "/api/certificates/download?fileName=" + f,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (response, status, xhr) {
            // If you want to use the image in your DOM:
            var blob = new File([response], f);
            var url = URL.createObjectURL(blob);
            a.href = url;
            a.download = f;
            a.click();
            window.URL.revokeObjectURL(url);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseJSON.message);
        }
    });
}

function docs() {
    $.ajax({
        async: true,
        url: baseURL + "/api/certificates",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        success: function (res, textStatus, xmLHttpRequest) {
            var f = res.data;
            console.log(f);
            if (f.length === 0) {
                $("#alist").hide();
                $("#blist").show();
            }
            else {
                for (let i = 0; i < f.length; i++) {
                    let s = f[i];
                    $("#alist").append("<li onclick=\"download('" + s + "')\">" + s + "</li>");
                }
                $("#alist").show();
                $("#blist").hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.responseJSON.message);
        }
    });
}

$("#blist").hide();

docs();
