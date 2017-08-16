$("#chatbox").scrollTop($("#chatbox").prop('scrollHeight') * 2);

$("#smiley-button").click(function(event) {
    openSmiley(event);
});
$("#color-button").click(function(event) {
    openColors(event);
});
var refreshInt = undefined
var oldToggle = undefined
var MaterialLayout = undefined
var originalDrawerButton = undefined
$("#refresh-button").click(function(se) {
    if (refreshInt != undefined) {
        clearInterval(refreshInt);
    }
    refreshInt = setInterval(chatbox.get, 1000);

});
$("#hide-button").click(function(se) {
    /*if (refreshInt != undefined) {
        clearInterval(refreshInt);
    }
    refreshInt = setInterval(chatbox.get, 1000);*/
    $("#chatbox_mobile_header2").css("opacity", "0.5");

    $("#chatbox_mobile_header2").css("width", "0px");

    $("#full-width-buttons").css("display", "none");
    //needed for animation :( :(
    setTimeout(function() {
        if (originalDrawerButton == undefined)
            originalDrawerButton = $(".mdl-layout__drawer-button")[0].innerHTML;
        $(".mdl-layout__drawer-button")[0].innerHTML = "<i class=\"material-icons\">arrow_forward</i>"
        var elemLay = document.getElementById("drawer_layout");
        var elemMaterial = new MaterialLayout(elemLay)
        elemMaterial.init()
            /* */
        if (MaterialLayout.prototype.oldToggle == undefined)
            MaterialLayout.prototype.oldToggle = MaterialLayout.prototype.toggleDrawer;
        MaterialLayout.prototype.toggleDrawer = function(e) {
            MaterialLayout.prototype.toggleDrawer = MaterialLayout.prototype.oldToggle;
            $(".mdl-layout__drawer-button")[0].innerHTML = originalDrawerButton
            $("#chatbox_mobile_header2").css("width", "100%");
            $("#chatbox_mobile_header2").css("opacity", "1");
            $("#full-width-buttons").css("display", "inline");

        }
    }, 1000);



});


$("#format-button").click(function(event) {
    if (document.getElementById("format-line").style.display == "none" || document.getElementById("format-line").style.display == "") {
        document.getElementById("format-line").style.display = "table-row";
        document.getElementById("format-line").style.opacity = "1";
    } else {
        document.getElementById("format-line").style.display = "none";
        document.getElementById("format-line").style.opacity = "0";

    }
    document.getElementById('message').focus();
    return false;
});
var dialogButton = document.querySelector('#button');
var dialog = document.querySelector('#smiley-dialog');
dialogPolyfill.registerDialog(dialog);

dialog = document.querySelector('#color-dialog');
dialogPolyfill.registerDialog(dialog);
$("#message").keypress(function(e) {
    if (e.which == 13) {
        //submit form via ajax, this is not JS but server side scripting so not showing here
        sendForm();
        return false;
    }

});
/*if (getParameterByName("dark") == 1)
    setTheme(1)
else
    setTheme(0)*/
$("#chatbox").scrollTop($("#chatbox").prop('scrollHeight') * 2);

color = my_getcookie('CB_color');
if (color) {
    $("#scolor").val(color);
}
$(".format-message").each(function(i, obj) {
    $(obj).on("change", function() {
        var name = $(obj).attr('name');
        my_setcookie('CB_' + name, $(obj).is(':checked') ? 1 : 0);
        window.chatbox.format();
    });

});

Chatbox.prototype.format = function() {
    var input = $("#message");
    input.css('font-weight', parseInt(my_getcookie('CB_bold')) ? 'bold' : 'normal');
    input.css('font-style', parseInt(my_getcookie('CB_italic')) ? 'italic' : 'normal');
    input.css('text-decoration', (parseInt(my_getcookie('CB_underline')) ? 'underline ' : '') + (parseInt(my_getcookie('CB_strike')) ? 'line-through' : ''));
    color = my_getcookie('CB_color');
    if (color) {
        $("#scolor").val(color);
        $("#divcolor-preview").css('background-color', color);
        input.css('color', "#" + color);
    }
}
setTimeout(function() {}, 5000);

$(document).on('click', 'body *', function() {
    document.getElementById('message').focus();
});

$('#chatbox').bind("DOMSubtreeModified", function() {});




var salon = "chatbox";
var chatbox;
var chatboxes=["#TratyChat","#NaNo"];

for(var cb = 0; cb< chatboxes.length; cb ++ ){
    var cbnum = "";
    if(cb!==0)
        cbnum =cb;

    $("#chatbox_container").append("<div class='chatbox' id='chatbox"+cbnum+"'> </div>");
    $("#chatbox_room_container").append("<li><a href=\"#\" class='mobile-room' id='chatbox_selector"+cbnum+"'onclick=\"setChatbox('chatbox"+cbnum+"'); return false;\">"+chatboxes[cb]+" </a>");
                    
}
setChatbox("chatbox");
	
