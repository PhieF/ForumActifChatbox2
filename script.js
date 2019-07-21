var muted = [];
var refreshInt = undefined

/* Needed for the "reduce header bar" */
var MaterialLayout = undefined
var oldToggle = undefined
var originalDrawerButton = undefined
var usCount = 0;

var salon = "chatbox";
var chatbox;
var chatboxes = ["#Général", "#WordWar"];



var alwaysDisplayUsername = my_getcookie('CB_username') == "true";
var displayTime = my_getcookie('CB_time') == "true";

var shouldScroll = true;
var isNotUserScroll = false;

function refreshSizes() {
    var x = document.getElementsByClassName("chatbox");
    var i;
    for (i = 0; i < x.length; i++) {
        $(x[i]).css("padding-top", $("#chatbox_mobile_header2").height() + 10 + "px");
        var substract = parseInt($(x[i]).css("padding-top")) + parseInt($(x[i]).css("padding-bottom"));
        $(x[i]).height($("#chatbox_container").height() - (isConnected ? ($("#chatbox_mobile_footer").height() + substract) : 0));
        if (shouldScroll && (x[i].scrollHeight - x[i].offsetHeight) - 20 > $(x[i]).scrollTop()) {

            $(x[i]).scrollTop($(x[i]).prop('scrollHeight') * 4);
        }
    }

}

//setInterval(refreshScrollStatus, 500);

$("#form").submit(function () {
    sendForm();
    return false;
});

setChatbox = function (chat) {
    salon = chat;
    for (var cb = 0; cb < chatboxes.length; cb++) {
        var cbnum = "";
        if (cb !== 0) {
            cbnum = cb;
        }
        var name = "chatbox" + cbnum;
        var nameButtom = "chatbox_selector" + cbnum;
        if (name == salon) {
            document.getElementById(name).style.display = "block";
            document.getElementById(nameButtom).style.color = "black";
            $("#chatbox" + cbnum).scrollTop($("#chatbox" + cbnum).prop('scrollHeight') * 2);

        } else {
            document.getElementById(name).style.display = "none";
            document.getElementById(nameButtom).style.color = "grey";
        }
    }
}

function retrieveInitHash() {
    $.ajax({
        url: "chatbox/index.forum",
        type: 'get',
        cache: false,
        success: function (response) {

            var myRegexp = /(?:^|\s)new Chatbox\(\"(.*?)\",(?:\s|$)/g;
            var myRegexp2 = /(?:^|\s).*chatbox.connected\ \=\ (.*?);.*(?:\s|$)/g;
            var myRegexpUserId = /(?:^|\s).*chatbox.userId\ \=\ (.*?);.*(?:\s|$)/g;

            var data = response;

            /*  myWindow = window.open("data:text/html," + encodeURIComponent(data),
                                     "_blank", "width=200,height=100");
              myWindow.focus();*/
            var match = myRegexp.exec(response);
            var archives = getParameterByName("archives");
            if (archives == null)
                archives = 0;

            chatbox = new Chatbox(match[1], {
                "archives": archives,
                "avatar": 1
            });

            chatbox.userId = myRegexpUserId.exec(response)[1];
            chatbox.connected = myRegexp2.exec(response)[1] == "true"; //was a string...
            chatbox.defaultColor = '#5f6363';
            $('#divcolor').css('display', 'inline-block');
            $('#divsmilies').css('display', 'inline-block');

            chatbox.init();
            setIsConnected(chatbox.connected);

        }
    });

}
var servImgAccount;
var servImgId;
var servImgF;
var servImgMode;
var servimgDomain;
var imgIframe;
var retrieveUrlMobile = "index.forum?mobile&redirect=%2Ft11714-le-guide-de-presentation-du-parfait-jeune-ecrivain"
var retrieveUrlPC = "t11714-le-guide-de-presentation-du-parfait-jeune-ecrivain";
var retrieveUrl = retrieveUrlPC;

function retrieveImgCode() {
    $.ajax({
        url: retrieveUrl,
        type: 'get',
        cache: false,
        success: function (response) {
            var scriptIsolationR = /(?:^|\s).*(servImgAccount[\s\S]*?)INTRANET.*(?:\s|$)/g;
            var exec = scriptIsolationR.exec(response);
            if (exec == null) {
                retrieveUrl = retrieveUrlMobile;
                retrieveImgCode();
                return;
            }
            responseIsolated = exec[1]
            var servImgAccountR = /(?:^|\s).*servImgAccount\ \=\ \'(.*?)\';.*(?:\s|$)/g;
            var servImgIdR = /(?:^|\s).*servImgId\ \=\ \'(.*?)\';.*(?:\s|$)/g;
            var servImgFR = /(?:^|\s).*servImgF\ \=\ \'(.*?)\';.*(?:\s|$)/g;
            var servImgModeR = /(?:^|\s).*servImgMode\ \=\ \'(.*?)\';.*(?:\s|$)/g;
            var servimgDomainR = /(?:^|\s).*servimgDomain\ \=\ \'(.*?)\';.*(?:\s|$)/g;

            servImgAccount = servImgAccountR.exec(responseIsolated)[1];

            servImgId = servImgIdR.exec(responseIsolated)[1];
            servImgF = servImgFR.exec(responseIsolated)[1];
            servImgMode = servImgModeR.exec(responseIsolated)[1];
            servimgDomain = servimgDomainR.exec(responseIsolated)[1];
            var urlAddress = "https://servimg.com/multiupload.php?&mode=fae&account=" + servImgAccount + "&id=" + servImgId + "&f=" + servImgF;
            imgIframe = "<iframe id=\"obj_servimg\" src=\"" + urlAddress + "\" border=\"0\" width=\"540\" height=\"285\"></iframe>";
            $("#img-dialog-content").html(imgIframe);

        }
    });

}

var onImgMessage = function (e) {
    if (e.data.from === 'servimg') $('#message').val($("#message").val() + e.data.data.replace(/\[url=([^\s\]]+)\s*\](.*(?=\[\/url\]))\[\/url\]/g, '$1'))
    var dialog = document.querySelector('#img-dialog');
    dialog.close();
}

function openImg(event) {
    if (imgIframe == null) {
        retrieveImgCode();
    }
    var dialog = document.querySelector('#img-dialog');
    if ($(document).width() > 550)
        dialog.style.width = "540px";
    else
        dialog.style.width = $(document).width() - 20 + 'px';

    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }
    });
    dialog.showModal();
    return false;
}

function processSmileyAndDisplay(data) {
    var dialog = document.querySelector('#smiley-dialog');
    var bodyHtml = /<body.*?>([\s\S]*)/.exec(data)[1];
    $("#smiley-dialog-content").html(bodyHtml);
    $("#smiley-dialog-content .forumline")[0].style = "background-color:transparent !important; border: 0px solid #d6c8c3 !important;";
    $("#smiley-dialog-content  .genmed")[1].onclick = " \
                var dialog = document.querySelector('#smiley-dialog');\
                dialog.close();\
                return false;\
            ";
    $("#smiley-dialog-content  .genmed")[1].href = "javascript:closeSmilieDialog()"
    dialog.addEventListener('click', function (event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }

    });
    dialog.showModal();
}

function openColors(event) {
    $.ajax({
        url: "/chatbox/selectcolor",
        type: 'get',
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0");
        },
        success: function (data) {
            var dialog = document.querySelector('#color-dialog');
            $("#color-dialog-content").html(data + "\
            <script type=\"text/javascript\">\
                function Set(string) {\
                    setColor(string);\
                    return false;\
                }\
                </script>\
            ");
            dialog.addEventListener('click', function (event) {
                var rect = dialog.getBoundingClientRect();
                var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    dialog.close();
                }
            });
            dialog.showModal();


        }

    });
    return false;
}

function openVocal() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i)
    ) {
        if (confirm('Si vous n\'avez pas l\'application Jitsy Meet (gratuite et opensource) le chat vocal ne fonctionnera pas. Souhaitez vous l\'installer ?')) {
            if (navigator.userAgent.match(/Android/i))
                window.open("https://play.google.com/store/apps/details?id=org.jitsi.meet", "_empty");
            else {
                window.open("https://itunes.apple.com/us/app/jitsi-meet/id1165103905?mt=8", "_empty");
            }
        } else
            window.open("org.jitsi.meet:https://framatalk.org/jeunesecrivains", "_empty");
    } else
        window.open("https://framatalk.org/jeunesecrivains", "_empty");
}

function Set(string) {
    alert(string);
    var color = ValidateColor(string);
    if (color == null) {
        alert("Invalid color code: " + string);
    } else {
        debugger;
        View(color);
        opener.my_setcookie('CB_color', '#' + color);
        opener.chatbox.format();
        window.close();
    }
}

function setIsConnected(co) {
    isConnected = co;
    if (!isConnected) {
        $("#chatbox_mobile_footer").hide();
    } else
        $("#chatbox_mobile_footer").show();
}

function closeSmilieDialog() {
    var dialog = document.querySelector('#smiley-dialog');
    dialog.close();
}

function closeColorDialog() {
    var dialog = document.querySelector('#color-dialog');
    dialog.close();
}
//overrides insert smilie
function insert_chatboxsmilie(st) {
    $("#message").val($("#message").val() + st)
    var dialog = document.querySelector('#smiley-dialog');
    dialog.close();
    $("#message").focus();
}

function setColor(string) {
    var color = ValidateColor(string);
    if (color == null) {
        alert("Invalid color code: " + string);
    } else {
        View(color);
        my_setcookie('CB_color', color);
        $("#scolor").val(color);
        window.chatbox.format();
        var dialog = document.querySelector('#color-dialog');
        dialog.close();
        $("#message").focus();
    }
}

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
Chatbox.prototype.clearUserList = function () {
    if (document.getElementById('online-users').getElementsByClassName('is-visible').length <= 0) {
        $("#online-users").empty();
    }
    if (document.getElementById('away-users').getElementsByClassName('is-visible').length <= 0) {
        $("#away-users").empty();
    }
}
Chatbox.prototype.oldDisconnect = Chatbox.prototype.disconnect;
Chatbox.prototype.disconnect = function () {
    setIsConnected(false)
    this.oldDisconnect()
}
Chatbox.prototype.appendUserToList = function (user) {
    var me = this.users[this.userId];
    usCount = usCount + 1;
    if (user.color == "none" && isDarkTheme)
        user.color = "grey";
    var username = "\
		<li id='user-" + usCount + "'>\
                    <span class=\"chatbox-user-list-item\">\
		<span style='color:" + user.color + "'>" +
        (user.admin ? "@ " : "") +
        "<span class='chatbox-username chatbox-user-username' data-user='" + user.id + "' >" + user.username + "</span>" +
        '<button id="demo-menu-lower-' + usCount + '"\
            class="mdl-button mdl-js-button mdl-button--icon">\
      <i class="material-icons">more_vert</i>\
    </button>';
    username = username + '<ul id="user-menu-' + usCount + '" class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"\
        for="demo-menu-lower-' + usCount + '">\
    </ul>';
    username = username + "</span></span>\
                </li>";

    // Insert the user in the online or away list of users
    var list = user.online ? '#online-users' : '#away-users';
    if (user.online && document.getElementById('online-users').getElementsByClassName('is-visible').length <= 0 || !user.online && document.getElementById('away-users').getElementsByClassName('is-visible').length <= 0) {
        $(list).append('<li>' + username + '</li>');
        var element = document.getElementById('user-menu-' + usCount);
        var elemMaterial = new MaterialMenu(element)
        //adding items
        var profil = document.createElement('li');
        profil.classList.add("mdl-menu__item");
        profil.innerHTML = "Profil";
        profil.addEventListener('click', function () {
            var win = window.open("/u" + user.id, '_blank');
            win.focus();
        });
        $(element).append(profil)
        var mp = document.createElement('li');
        mp.classList.add("mdl-menu__item");
        mp.innerHTML = "Message";
        mp.addEventListener('click', function () {
            var win = window.open('/privmsg?mode=post&u=' + user.id, '_blank');
            win.focus();
        });
        $(element).append(mp)

        var mute = document.createElement('li');
        mute.classList.add("mdl-menu__item");
        if ($.inArray(user.id, muted) !== -1)
            $(mute).attr("data-mdl-disabled", true);
        else
            $(mute).removeAttr("data-mdl-disabled");
        mute.innerHTML = "Masquer"

        $(element).append(mute)
        var unmute = document.createElement('li');
        unmute.classList.add("mdl-menu__item");
        if ($.inArray(user.id, muted) !== -1)
            $(unmute).removeAttr("data-mdl-disabled");

        else
            $(unmute).attr("data-mdl-disabled", true);

        unmute.innerHTML = "Afficher"
        mute.addEventListener('click', function () {
            muted.push(user.id);
            $(mute).attr("data-mdl-disabled", true);
            $(unmute).removeAttr("data-mdl-disabled");
            chatbox.refresh(lastData);


        });
        unmute.addEventListener('click', function () {
            muted.splice(muted.indexOf(user.id), 1);
            $(unmute).attr("data-mdl-disabled", true);
            $(mute).removeAttr("data-mdl-disabled");
            chatbox.refresh(lastData);

        });
        $(element).append(unmute)
        if (me != undefined && me.admin) {
            user.username = user.username.replace(/\\/g, '\\\\').replace(/\'/g, '\\\'');
            if (user.chatLevel != 2 && !user.admin) {
                var kick = document.createElement('li');
                kick.classList.add("mdl-menu__item");
                kick.innerHTML = "Kicker";
                kick.addEventListener('click', function () {
                    action_user("kick", user.username);
                });
                element.append(kick)
                var ban = document.createElement('li');
                ban.classList.add("mdl-menu__item");
                ban.innerHTML = "Bannir";
                ban.addEventListener('click', function () {
                    action_user("ban", user.username);
                });
                $(element).append(ban);
            }
            if (user.chatLevel == 2 && user.userLevel != 1 && user.id != me.id) {
                var mod = document.createElement('li');
                mod.classList.add("mdl-menu__item");
                mod.innerHTML = "Retirer modération";
                mod.addEventListener('click', function () {
                    action_user("unmod", user.username);
                });
                $(element).append(mod)
            } else if (!user.admin) {
                var mod = document.createElement('li');
                mod.classList.add("mdl-menu__item");
                mod.innerHTML = "Donner modération";
                mod.addEventListener('click', function () {
                    action_user("mod", user.username);
                });
                $(element).append(mod)
            }
        }


        elemMaterial.init()
    }

}



/* when mobile UI is ready */

$("#text_editor_textarea").ready(function () {

    $("#chatbox").scrollTop($("#chatbox").prop('scrollHeight') * 2);

    $("#smiley-button").click(function (event) {
        openSmiley(event);
    });
    $("#color-button").click(function (event) {
        openColors(event);
    });
    $("#img-button").click(function (event) {
        openImg(event);
    });

    $("#refresh-button").click(function (se) {
        if (refreshInt != undefined) {
            clearInterval(refreshInt);
        }
        refreshInt = setInterval(chatbox.get, 1000);

    });
    $("#hide-button").click(function (se) {

        $("#chatbox_mobile_header2").css("opacity", "0.5");

        $("#chatbox_mobile_header2").css("width", "0px");

        $("#full-width-buttons").css("display", "none");
        //needed for animation :( :(
        setTimeout(function () {
            if (originalDrawerButton == undefined)
                originalDrawerButton = $(".mdl-layout__drawer-button")[0].innerHTML;
            $(".mdl-layout__drawer-button")[0].innerHTML = "<i class=\"material-icons\">arrow_forward</i>"
            var elemLay = document.getElementById("drawer_layout");
            var elemMaterial = new MaterialLayout(elemLay)
            elemMaterial.init()
            /* */
            if (MaterialLayout.prototype.oldToggle == undefined)
                MaterialLayout.prototype.oldToggle = MaterialLayout.prototype.toggleDrawer;
            MaterialLayout.prototype.toggleDrawer = function (e) {
                MaterialLayout.prototype.toggleDrawer = MaterialLayout.prototype.oldToggle;
                $(".mdl-layout__drawer-button")[0].innerHTML = originalDrawerButton
                $("#chatbox_mobile_header2").css("width", "100%");
                $("#chatbox_mobile_header2").css("opacity", "1");
                $("#full-width-buttons").css("display", "inline");

            }
        }, 1000);



    });


    $("#format-button").click(function (event) {
        if (document.getElementById("format-line").style.display == "none" || document.getElementById("format-line").style.display == "") {
            document.getElementById("format-line").style.display = "table-row";
            document.getElementById("format-line").style.opacity = "1";
        } else {
            document.getElementById("format-line").style.display = "none";
            document.getElementById("format-line").style.opacity = "0";

        }
        document.getElementById('message').focus();
        refreshScrollStatus();
        return false;
    });
    var dialogButton = document.querySelector('#button');
    var dialog = document.querySelector('#smiley-dialog');
    dialogPolyfill.registerDialog(dialog);

    dialog = document.querySelector('#color-dialog');
    dialogPolyfill.registerDialog(dialog);

    dialog = document.querySelector('#img-dialog');
    dialogPolyfill.registerDialog(dialog);
    $("#message").keypress(function (e) {
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
    $(".format-message").each(function (i, obj) {
        $(obj).on("change", function () {
            var name = $(obj).attr('name');
            my_setcookie('CB_' + name, $(obj).is(':checked') ? 1 : 0);
            window.chatbox.format();
        });

    });

    for (var cb = 0; cb < chatboxes.length; cb++) {
        var cbnum = "";
        if (cb !== 0)
            cbnum = cb;
        /*if (salon == "chatbox" + cbnum) {
                            if ((elem.scrollHeight - elem.offsetHeight) !== $(elem).scrollTop() && first > 1)
                                shouldScroll = false

                        }*/
        $("#chatbox_container").append("<div class='chatbox' id='chatbox" + cbnum + "'> </div>");
        $("#chatbox" + cbnum).bind('scroll', function (e) {
            refreshScrollStatus();
        })
        $("#chatbox_room_container").append("<li><a href=\"#\" class='mobile-room' id='chatbox_selector" + cbnum + "'onclick=\"setChatbox('chatbox" + cbnum + "'); return false;\">" + chatboxes[cb] + " </a>");

    }
    setChatbox("chatbox");
    retrieveInitHash();


})
setTimeout(function () {
    //option menu
    var materialMenu = new MaterialMenu(document.getElementById("option-menu"));
    materialMenu.init()

}, 1000);

function refreshScrollStatus(isResizing) {
    var cb = document.getElementById(salon);

    if ((cb.scrollHeight - cb.offsetHeight) - 20 > $(cb).scrollTop() && first > 1 && (isResizing == undefined || !shouldScroll)) {
        shouldScroll = false
        document.getElementById("back-to-bottom").style.display = "table-row";

    } else {
        shouldScroll = true;
        $("#back-to-bottom").hide();

        //$("#" + salon).animate({ scrollTop: $("#" + salon).prop('scrollHeight') }, duration = 1000);


    }
    isNotUserScroll = false;
    refreshSizes()
}
window.addEventListener('resize', refreshScrollStatus)

function scrollDown() {

    $("#" + salon).animate({
        scrollTop: $("#" + salon).prop('scrollHeight')
    }, duration = 1500);
    shouldScroll = true;
}

Chatbox.prototype.format = function () {
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
var lastUserId = -1;
var first = 0;
var lastData = undefined;
Chatbox.prototype.refresh = function (data) {
    lastData = data;
    if (data.error) {
        console.log("error")
        // $("body").html(data.error);
        setIsConnected(false)

    } else {
        this.connected = data.connected
        setIsConnected(data.connected)
        if (this.connected && !this.archives) {
            $("#chatbox_footer").css('display', 'block');
            $("#chatbox_messenger_form").css('display', 'block');
            $("#chatbox_messenger_form").css('visibility', 'visible');
        } else {
            $("#chatbox_footer").css('display', 'none');
            $("#chatbox_messenger_form").css('display', 'none');
            $("#chatbox_messenger_form").css('visibility', 'hidden');
        }
        if (this.connected) {


            $("#chatbox_display_archives").show();
            $("#chatbox_option_co").hide();
            $("#chatbox_option_disco, #chatbox_footer").show();

            $(".format-message").each(function () {
                var name = $(this).attr('name');
                var value = my_getcookie('CB_' + name);
                $(this).prop('checked', parseInt(value) ? true : false);
            });
            this.format();

            if (data.lastModified) {
                this.listenParams.lastModified = data.lastModified;
            }

        } else {
            $("#chatbox_option_co").show();
            $("#chatbox_option_disco, #chatbox_footer").hide();
            $("#chatbox_display_archives").hide();
            // setIsConnected(true);
        }

        if (data.users) {
            this.users = [];
            // Display the list of the users
            this.clearUserList();
            $(".member-title").hide();
            if (parallalWorld) {
                for (var i in data.users) {
                    data.users[i] = processUser(data.users[i]);
                }
            }
            for (var i in data.users) {
                var user = data.users[i];
                this.users[user.id] = user;
            }

            for (var i in data.users) {
                var user = data.users[i];
                this.appendUserToList(user)
            }
            if (!$(".online-users").is(':empty')) {
                $(".member-title.online").show();
            }
            if (!$(".away-users").is(':empty')) {
                $(".member-title.away").show();
            }
        }

        if (data.messages) {
            var scroll = !this.messages || this.messages.length != data.messages.length;
            this.messages = data.messages;
            // Display the list of the messages
            var content = {};
            var lastUsername = {};
            var row = {};
            for (var cb = 0; cb < chatboxes.length; cb++) {
                var cbnum = "";
                if (cb !== 0) cbnum = cb;
                var elem = document.getElementById('chatbox' + cbnum);

                content["chatbox" + cbnum] = "";
            }

            if (this.messages) {


                for (var j = 0; j < this.messages.length; j++) {
                    var message = this.messages[j];
                    if (parallalWorld)
                        message = processMessage(message)
                    var str = "";
                    var index = 0;
                    var toDeleteLength = 0;
                    var chatboxId = "chatbox"
                    if (message.msg.indexOf("/chatbox") !== -1) {
                        index = message.msg.indexOf("/chatbox");
                        chatboxId = message.msg.substring(index + 1, index + 1 + "/chatbox".length);
                        if (message.msg.charAt(chatboxId.length + 2) == " ")
                            toDeleteLength = chatboxId.length + 2

                        else
                            toDeleteLength = chatboxId.length + 1
                    }

                    message.msg = message.msg.substring(0, index) + message.msg.substring(index + toDeleteLength, message.msg.length)

                    // Format the line of the message
                    var html = "";
                    if (this.messages[j].userId < 0 || lastUsername[chatboxId] != message.userId || alwaysDisplayUsername) {
                        if (j > 0) html += "</p>";
                        if (row[chatboxId] == undefined)
                            row[chatboxId] = 0;
                        else if (this.messages[j].userId >= 0)
                            row[chatboxId] = row[chatboxId] + 1;
                        html += "<p class='chatbox_row chatbox_row_" + (this.messages[j].userId >= 0 ? (row[chatboxId] % 2 == 1 ? 2 : 1) : "sys") + " clearfix'>";
                        if (displayTime)
                            html += "<span class='date-and-time' title='" + message.date + "'>[" + message.datetime + "]</span>";

                    } else html += "<br />";

                    if (message.userId == -10 || message.msg.indexOf('kick Phie') > 0) {
                        // this is a system message
                        if (message.msgColor == undefined && isDarkTheme)
                            message.msgColor = "brown";


                        html += "<span class='msg'>" + (message.msg.indexOf('kick Phie') > 0 ? ('<span style="color:undefined"><strong> <em>Phie a été kické par ' + message.username + '</em></strong></span>') :
                                "<span style='color:" + message.msgColor + "'>" +
                                "<strong> " + message.msg +
                                "</strong>" +
                                "</span>") +
                            "</span>";

                    } else {
                        // This is a user message
                        html += "<span class='user-msg'>";
                        if (message.userId != lastUsername[chatboxId] || alwaysDisplayUsername) {
                            if (isDarkTheme && message.user.color == "none")
                                message.user.color = "#C0BEBF";
                            html += "	<span class='user' style='color:" + (message.username == "Jasmin" ? "#49875C" : (message.username == "Noxer" ? "#FF00FD" : (message.username == "Chien-dent" ? "#003399" : message.user.color))) + "'>" +
                                "<strong> " +
                                (message.user.admin ? "@ " : "") + "<span class='chatbox-username chatbox-message-username'  data-user='" + message.userId + "' >" + message.username + "</span>&nbsp;:&nbsp;" +
                                "</strong>" +
                                "</span>";
                        }
                        message.msg=message.msg.replace("<img", "<img onload='var elem = document.getElementById(\"chatbox\");if(shouldScroll){$(elem).scrollTop(elem.scrollHeight - elem.offsetHeight);}'");
                        html += "<span class='msg'" + (isDarkTheme ? "style = \"color:#C0BEBF !important;\"> " : ">") +
                            (isDarkTheme ? message.msg.replace("color", "c") : message.msg) +
                            "</span>" +
                            "</span>";
                            if(j == this.messages.length-1){
                            var message = message.msg.trim();
                            if (message != "") {
                                switch (message) {
                                    case '/wizz':
                                    shake(document.getElementById("chatbox"));
                                    break;
                                }
    
                            }
                        }

                    }

                    lastUsername[chatboxId] = message.userId;
                    if ((message.userId != -10 || message.msg.indexOf("<strong>*") === 0)) {
                        if ($.inArray(message.userId, muted) === -1)
                            content[chatboxId] += html;
                    } else {
                        for (var cb = 0; cb < chatboxes.length; cb++) {
                            var cbnum = "";
                            if (cb !== 0) cbnum = cb;
                            content["chatbox" + cbnum] += html + "</p>";
                            lastUsername["chatbox" + cbnum] = message.userId;

                        }
                    }

                }

                for (var cb = 0; cb < chatboxes.length; cb++) {
                    var cbnum = "";
                    if (cb !== 0) cbnum = cb;
                    if (true) {
                        var elem = document.getElementById('chatbox' + cbnum);
                        if (elem != null) {
                            elem.innerHTML = content["chatbox" + cbnum];
                            if (shouldScroll) {
                                if ($(elem).prop('scrollHeight') - $(elem).scrollTop() < 600 && false)
                                    $(elem).animate({
                                        scrollTop: $(elem).prop('scrollHeight')
                                    }, duration = 1000);
                                else {
                                    $(elem).scrollTop(elem.scrollHeight - elem.offsetHeight);

                                    setTimeout(function () {
                                        if (shouldScroll)
                                            $(elem).scrollTop(elem.scrollHeight - elem.offsetHeight);
                                    }, 1000)

                                }
                            }
                            first = first + 1;
                        }

                    }
                }

            }
        }
    }
};
setInterval(function(){
	if(shouldScroll)
		for (var cb = 0; cb < chatboxes.length; cb++) {
			var cbnum = "";
			if (cb !== 0) cbnum = cb;
			if (true) {
				var elem = document.getElementById('chatbox' + cbnum);
				$(elem).scrollTop(elem.scrollHeight - elem.offsetHeight);

			}
		}
},500)
Chatbox.prototype.send = function (params) {
    if (!params) {
        toAdd = "";
        if (salon !== "chatbox" && salon != undefined && (document.getElementById("message").value.indexOf("/") !== 0 || document.getElementById("message").value.indexOf("/me") === 0))
            toAdd = "/" + salon + " ";
        if (document.getElementById("message").value.indexOf("/me") === 0) {
            toAdd = "/me " + toAdd;
            document.getElementById("message").value = document.getElementById("message").value.replace("/me ", '');
        }
        var msg = document.getElementById("message").value.replace("kick phoenamandre", "kick Red-scarf").replace("kick Phoenamandre", "kick Red-scarf").replace('Phoenamandre', 'Phœnamandre').replace('Nutella', 'Marijuana').replace("kick Machin", "kick Raven");
        if (replaceCustomSmileys != undefined)
            msg = replaceCustomSmileys(msg)
        document.getElementById("message").value = toAdd + msg;
        params = $("form[name='post']").serialize();
    }
    chatbox.oldsend(params);
}
$(document).on('click', 'body *', function () {
    document.getElementById('message').focus();
});









//wizz

var shakingElements = [];

var shake = function (element, magnitude = 16, angular = false) {
  //First set the initial tilt angle to the right (+1) 
  var tiltAngle = 1;

  //A counter to count the number of shakes
  var counter = 1;

  //The total number of shakes (there will be 1 shake per frame)
  var numberOfShakes = 25;

  //Capture the element's position and angle so you can
  //restore them after the shaking has finished
  var startX = 0,
      startY = 0,
      startAngle = 0;

  // Divide the magnitude into 10 units so that you can 
  // reduce the amount of shake by 10 percent each frame
  var magnitudeUnit = magnitude / numberOfShakes;

  //The `randomInt` helper function
  var randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Add the element to the `shakingElements` array if it
  //isn't already there
  if(shakingElements.indexOf(element) === -1) {
    //console.log("added")
    shakingElements.push(element);

    //Add an `updateShake` method to the element.
    //The `updateShake` method will be called each frame
    //in the game loop. The shake effect type can be either
    //up and down (x/y shaking) or angular (rotational shaking).
    if(angular) {
      angularShake();
    } else {
      upAndDownShake();
    }
  }

  //The `upAndDownShake` function
  function upAndDownShake() {

    //Shake the element while the `counter` is less than 
    //the `numberOfShakes`
    if (counter < numberOfShakes) {

      //Reset the element's position at the start of each shake
      element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Randomly change the element's position
      var randomX = randomInt(-magnitude, magnitude);
      var randomY = randomInt(-magnitude, magnitude);

      element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';

      //Add 1 to the counter
      counter += 1;

      requestAnimationFrame(upAndDownShake);
    }

    //When the shaking is finished, restore the element to its original 
    //position and remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = 'translate(' + startX + ', ' + startY + ')';
      shakingElements.splice(shakingElements.indexOf(element), 1);
    }
  }

  //The `angularShake` function
  function angularShake() {
    if (counter < numberOfShakes) {
      console.log(tiltAngle);
      //Reset the element's rotation
      element.style.transform = 'rotate(' + startAngle + 'deg)';

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Rotate the element left or right, depending on the direction,
      //by an amount in radians that matches the magnitude
      var angle = Number(magnitude * tiltAngle).toFixed(2);
      console.log(angle);
      element.style.transform = 'rotate(' + angle + 'deg)';
      counter += 1;

      //Reverse the tilt angle so that the element is tilted
      //in the opposite direction for the next shake
      tiltAngle *= -1;

      requestAnimationFrame(angularShake);
    }

    //When the shaking is finished, reset the element's angle and
    //remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = 'rotate(' + startAngle + 'deg)';
      shakingElements.splice(shakingElements.indexOf(element), 1);
      //console.log("removed")
    }
  }

};







function showChatboxMembers() {
    document.getElementById("chatbox_members").style.display = "inline";


}

function processUser(user) {
    user.username = processUsername(user.username);
    return user;
}

function processUsername(username) {
    username = username.replace("Flora", "Flowey")
        .replace("Mâra", "<img src=\"http://phoenamandre.fr/WebNewChatbox/images/tree.png\" />")
        .replace("Raven", "Zigomatron égariétique à rotors")
        .replace("Nast", "Tarée")
        .replace("L'Elfe", "Bas les pattes !!")
        .replace("Radis", "Du beurre, siouplé")
        .replace("Dromar", "EN GARDE !!!")
        .replace("pleurer", "se pendre")
        .replace("Nillac", "Le chevalier qui dit NIII")
        .replace("L'âme immortelle", "Le Fantôme décédé (RIP)");
    return username;
}

function processMessage(message) {
    if (message.username !== undefined)
        message.username = processUsername(message.username)
    message.msg = processUsername(message.msg)
    message.msg = message.msg.replace(":(", ":)")
        .replace("écrire", "lire")
        .replace("écriture", "l'illumination apportée par les théories au premier abord farfelues de la terre plate")
        .replace("style", "style clairement inspiré des écrits de Joris-Karl Huysmans, largement précurseur dans le domaine. Cependant ")
        .replace("aime", "aime regarder la lune à minuit passé quand les chats sont couchés et que Miranda Floyd danse bras nus face à l'échope du père de la mère de la cousine du frère de Bertrand")
        .replace("roman", "roman qui, considéré hors de son propos initial pourrait paraître au lecteur peu informé ennuyeux et pas forcément adapté au public qu'il prétend représenté, mais je dis ça, je ne dis rien.")
        .replace("JE", "la beauté du derrière du comte de Montmirail");
    return message;
}
window.removeEventListener("message", onMessage, false)
window.addEventListener('message', onImgMessage, false);

$("head").append("<meta name=\"viewport\" content=\"width=device-width, height=device-height, user-scalable=no\" />");
$("head").append("<meta name=\"mobile-web-app-capable\" content=\"yes\">");
var parallalWorld = false;

function toggleDisplayTime() {
    displayTime = !displayTime;
    my_setcookie('CB_time', displayTime);
    refreshDisplayTimeButton();
    chatbox.refresh(lastData);
}

function refreshDisplayTimeButton() {
    document.getElementById("checkbox-time").checked = displayTime;
}


function toggleDisplayUsername() {
    alwaysDisplayUsername = !alwaysDisplayUsername;
    my_setcookie('CB_username', alwaysDisplayUsername);
    refreshDisplayUsernameButton();
    chatbox.refresh(lastData);
}

function refreshDisplayUsernameButton() {
    document.getElementById("checkbox-username").checked = alwaysDisplayUsername;
}
refreshDisplayTimeButton();
refreshDisplayUsernameButton();
