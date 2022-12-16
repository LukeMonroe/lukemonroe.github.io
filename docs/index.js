function openTab(event, tabName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "flex";
}

function email() {
    emailjs.init("I4v5nKkBfKnOtb346");
    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault();
        emailjs.sendForm("contact_service", "contact_form", this)
            .then(function () {
                console.log("SUCCESS!");
            }, function (error) {
                console.log("FAILED...", error);
            });
    });
}