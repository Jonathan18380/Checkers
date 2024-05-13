window.onload = function () {
    startUp();
};

function startUp() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                console.log(httpRequest.responseText);
            } else {
                console.error("Error fetching data from the server. Status: " + httpRequest.status);
            }
        }
    };
    httpRequest.open('GET', 'database.php', true);
    httpRequest.send();

}

