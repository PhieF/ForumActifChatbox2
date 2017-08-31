var muted = [];
function refreshSizes() {
    var x = document.getElementsByClassName("chatbox");
var i;
for (i = 0; i < x.length; i++) {
     $(x[i]).css("padding-top", $("#chatbox_mobile_header2").height()+10 + "px");
     var substract = parseInt($(x[i]).css("padding-top"))+parseInt($(x[i]).css("padding-bottom"));
     $(x[i]).height($("#chatbox_container").height() - (isConnected ? ($("#chatbox_mobile_footer").height() + substract) : 0));

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
            case '/exit':
                window.chatbox.disconnect();
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
Chatbox.prototype.clearUserList = function(){
    if(document.getElementById('online-users').getElementsByClassName('is-visible').length<=0){
        $("#online-users").empty();
    }
      if(document.getElementById('away-users').getElementsByClassName('is-visible').length<=0){
        $("#away-users").empty();
    }
}
var MaterialMenu = undefined

var usCount = 0;
Chatbox.prototype.appendUserToList = function(user) {
    var me = this.users[this.userId];
    usCount = usCount+1;
    if (user.color == "none" && isDarkTheme)
        user.color = "grey";
    var username = "\
		<li id='user-"+usCount+"'>\
                    <span class=\"chatbox-user-list-item\">\
		<span style='color:" + user.color + "'>" +
        (user.admin ? "@ " : "") +
        "<span class='chatbox-username chatbox-user-username' data-user='" + user.id + "' >" + user.username + "</span>" +
        '<button id="demo-menu-lower-'+usCount+'"\
            class="mdl-button mdl-js-button mdl-button--icon">\
      <i class="material-icons">more_vert</i>\
    </button>';
    username = username +'<ul id="user-menu-'+usCount+'" class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"\
        for="demo-menu-lower-'+usCount+'">\
    </ul>';
    username = username +"</span></span>\
                </li>";

    // Insert the user in the online or away list of users
    var list = user.online ? '#online-users' : '#away-users';
     if(user.online&&document.getElementById('online-users').getElementsByClassName('is-visible').length<=0||!user.online&&document.getElementById('away-users').getElementsByClassName('is-visible').length<=0){
    $(list).append('<li>' + username + '</li>');
    var element =document.getElementById('user-menu-'+usCount);
     var elemMaterial = new MaterialMenu(element)
     //adding items
    var profil = document.createElement('li');
    profil.classList.add("mdl-menu__item");
    profil.innerHTML="Profil";
    profil.addEventListener('click', function(){
        var win = window.open("/u"+user.id, '_blank');
        win.focus();
    });
    $(element).append(profil)
    var mp = document.createElement('li');
    mp.classList.add("mdl-menu__item");
    mp.innerHTML="Message";
    mp.addEventListener('click', function(){
        var win = window.open('/privmsg?mode=post&u='+user.id, '_blank');
        win.focus();
    });
    $(element).append(mp)

    var mute = document.createElement('li');
    mute.classList.add("mdl-menu__item");
    if($.inArray(user.id, muted)!==-1)
      $(mute).attr("data-mdl-disabled",true);
    else
        $(mute).removeAttr("data-mdl-disabled");
    mute.innerHTML="Masquer"
  
    $(element).append(mute)
     var unmute = document.createElement('li');
    unmute.classList.add("mdl-menu__item");
    if($.inArray(user.id, muted)!==-1)
        $(unmute).removeAttr("data-mdl-disabled");

    else
        $(unmute).attr("data-mdl-disabled",true);

    unmute.innerHTML="Afficher"
    mute.addEventListener('click', function(){
        muted.push(user.id);
        $(mute).attr("data-mdl-disabled",true);
        $(unmute).removeAttr("data-mdl-disabled");
                chatbox.refresh(lastData);


    });
    unmute.addEventListener('click', function(){
        muted.splice(muted.indexOf(user.id),1);
        $(unmute).attr("data-mdl-disabled",true);
        $(mute).removeAttr("data-mdl-disabled");
        chatbox.refresh(lastData);

    });
    $(element).append(unmute)
    if (me!=undefined&&me.admin) {
        user.username = user.username.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'');
        if (user.chatLevel != 2 && !user.admin) {
            var kick = document.createElement('li');
            kick.classList.add("mdl-menu__item");
            kick.innerHTML="Kicker";
            kick.addEventListener('click', function(){
                action_user("kick", user.username);
            });
            element.append(kick)
            var ban = document.createElement('li');
            ban.classList.add("mdl-menu__item");
            ban.innerHTML="Bannir";
            ban.addEventListener('click', function(){
                action_user("ban", user.username);
            });
            $(element).append(ban);
        }
        if (user.chatLevel == 2 && user.userLevel != 1 && user.id != me.id) {
            var mod = document.createElement('li');
            mod.classList.add("mdl-menu__item");
            mod.innerHTML="Retirer modération";
            mod.addEventListener('click', function(){
                action_user("unmod", user.username);
            });
            $(element).append(mod)
        } else if (!user.admin) {
            var mod = document.createElement('li');
            mod.classList.add("mdl-menu__item");
            mod.innerHTML="Donner modération";
            mod.addEventListener('click', function(){
                action_user("mod", user.username);
            });
            $(element).append(mod)
        }
    }


    elemMaterial.init()
    }
      
}
$("head").append("<meta name=\"viewport\" content=\"width=device-width, height=device-height, user-scalable=no\" />");
$("head").append("<meta name=\"mobile-web-app-capable\" content=\"yes\">");
