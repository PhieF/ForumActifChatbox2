function refreshSizes() {
    var x = document.getElementsByClassName("chatbox");
var i;
for (i = 0; i < x.length; i++) {
     $(x[i]).height($(window).height() - (isConnected ? ($("#chatbox_mobile_footer").height() + 75) : 20));
     $(x[i]).css("padding-top", $("#chatbox_mobile_header2").height()+10 + "px");
}
}

setInterval(refreshSizes, 500);

$("#form").submit(function() {
    sendForm();
    return false;
});
/*sorry had to go through an sxternal method otherwise changing color was buggy */
function sendForm() {

    var message = $("#message").val().trim();
    if (message != "") {
        switch (message) {
            case '/banlist':
                window.chatbox.openBanlistPage();
                break;
            case '/help':
                window.chatbox.openHelpPage();
                break;
            default:
                window.chatbox.send();
                break;
        }
        $("#message").val("").focus();
    } else {
        $("#message").focus();
    }
}


Chatbox.prototype.appendUserToList = function(user) {
    if (user.color == "none" && isDarkTheme)
        user.color = "grey";
    var username = "\
		<li>\
                    <span class=\"chatbox-user-list-item\">\
		<span style='color:" + user.color + "'>" +
        (user.admin ? "@ " : "") +
        "<span class='chatbox-username chatbox-user-username' data-user='" + user.id + "' >" + user.username + "</span>" +
        "</span></span>\
                </li>";

    // Insert the user in the online or away list of users
    var list = user.online ? '#online-users' : '#away-users';
    $(list).append('<li>' + username + '</li>');
}

$("head").append("<meta name=\"viewport\" content=\"width=device-width, height=device-height, user-scalable=no\" />");
$("head").append("<meta name=\"mobile-web-app-capable\" content=\"yes\">");
