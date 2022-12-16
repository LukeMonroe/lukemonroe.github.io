function openTab(tabName) {
    var tabContent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    document.getElementById(tabName).style.display = "flex";
}

function initEmail() {
    emailjs.init("I4v5nKkBfKnOtb346");
    document.getElementById("contact-form").addEventListener("submit", sendEmail);
}

function sendEmail(event) {
    event.preventDefault();
    emailjs.sendForm("contact_service", "contact_form", document.getElementById("contact-form"))
        .then(function (response) {
            console.log("SUCCESS:", response.status, response.text);
        }, function (error) {
            console.log("FAILED:", error);
        });

    document.getElementById("first-name").value = "";
    document.getElementById("last-name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";

    alert("Message sent successfully!");
}

function clickSubmit() {
    var elem = document.getElementById("send");
    var pos = 0;
    var interval = setInterval(frame, 10);
    function frame() {
        if (pos == 2000) {
            pos = -2000;
        } else if (pos == -10) {
            pos += 10;
            elem.style.left = pos + "px";
            clearInterval(interval);
        } else {
            pos += 10;
            elem.style.left = pos + "px";
        }
    }
}