function openTab(event, tabName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "flex";
}

function initEmail(event) {
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
}