var script = ""
var rootUrl = "http://phoenamandre.fr/WebNewChatbox/git";
var userId = -1;
var isConnected = false;
var isDarkTheme = false;

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function teardown(fnc) {}

function setup(fnc) {}

function suite(fnc, tet) {}

function reload_js() {
    i++;
    var head = document.getElementsByTagName('head')[0];

    if (script != "")
        head.removeChild(script)
    script = document.createElement('script');
    script.type = 'text/javascript';

    script.src = rootUrl + '/scriptcbtoadd.js?vd=' + Math.random();
    head.appendChild(script);
}

function retrieveInitHash() {
    $.ajax({
        url: "chatbox/index.forum",
        type: 'get',
        cache: false,
        success: function(response) {

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

            chatbox = new Chatbox(match[1], { "archives": archives, "avatar": 1 });

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
        success: function(response) {
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

var onImgMessage = function(e) {
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

    dialog.addEventListener('click', function(event) {
        var rect = dialog.getBoundingClientRect();
        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }
    });
    dialog.showModal();
    return false;
}


/*
function openSmiley(event) {
    $.ajax({
        url: "/post.forum?mode=smilies",
        type: 'get',
        cache: false,
        beforeSend: function(request) {
            request.setRequestHeader("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0");
        },
        success: function(data) {
            var dialog = document.querySelector('#smiley-dialog');
            var bodyHtml = /<body.*?>([\s\S]*)/.exec(data)[1];
            console.log(bodyHtml)
            $("#smiley-dialog-content").html(bodyHtml);
            $("#smiley-dialog-content .forumline")[0].style = "background-color:transparent !important; border: 0px solid #d6c8c3 !important;";
            $("#smiley-dialog-content  .genmed")[1].onclick = " \
                var dialog = document.querySelector('#smiley-dialog');\
                dialog.close();\
                return false;\
            ";
            $("#smiley-dialog-content  .genmed")[1].href = "javascript:closeSmilieDialog()"
            dialog.showModal();
        }

    });
}*/

function processSmileyAndDisplay(data) {
    var dialog = document.querySelector('#smiley-dialog');
    var bodyHtml = /<body.*?>([\s\S]*)/.exec(data)[1];
    console.log(bodyHtml)
    $("#smiley-dialog-content").html(bodyHtml);
    $("#smiley-dialog-content .forumline")[0].style = "background-color:transparent !important; border: 0px solid #d6c8c3 !important;";
    $("#smiley-dialog-content  .genmed")[1].onclick = " \
                var dialog = document.querySelector('#smiley-dialog');\
                dialog.close();\
                return false;\
            ";
    $("#smiley-dialog-content  .genmed")[1].href = "javascript:closeSmilieDialog()"
    dialog.addEventListener('click', function(event) {
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
        beforeSend: function(request) {
            request.setRequestHeader("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0");
        },
        success: function(data) {
            var dialog = document.querySelector('#color-dialog');
            $("#color-dialog-content").html(data + "\
            <script type=\"text/javascript\">\
                function Set(string) {\
                    setColor(string);\
                    return false;\
                }\
                </script>\
            ");
            dialog.addEventListener('click', function(event) {
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

var chatboxes = ["TratyChat", "NaNo", ""];
Chatbox.prototype.oldsend = Chatbox.prototype.send;
$("body").empty()
var head = document.getElementsByTagName('head')[0];
var script2 = document.createElement('script');
script2.type = 'text/javascript';
script2.src = rootUrl + '/index.js?vd=' + Math.random();
head.appendChild(script2);
script2 = document.createElement('script');
script2.type = 'text/javascript';
script2.src = rootUrl + '/polyfill/dialog-polyfill.js?vd=' + Math.random();
head.appendChild(script2);
script2 = document.createElement('script');
script2.type = 'text/javascript';
script2.src = rootUrl + '/polyfill/suite.js?vd=' + Math.random();
head.appendChild(script2);
var script3 = document.createElement('script');
script3.type = 'text/javascript';
script3.src = rootUrl + '/script.js?vd=' + Math.random();
head.appendChild(script3);
var script4 = document.createElement('script');
script4.type = 'text/javascript';
script4.src = rootUrl + '/smileys cb/index.js?vd=' + Math.random();
head.appendChild(script4);

setChatbox = function(chat) {
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

function showChatboxMembers() {
    document.getElementById("chatbox_members").style.display = "inline";


}

var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = rootUrl + '/polyfill/dialog-polyfill.css';
link.media = 'all';
head.appendChild(link);
reload_js();

function setTheme(th) {
    if (th == 0) {
        isDarkTheme = false;
        document.getElementById("chatbox").style.background = "white";
        document.getElementById("drawer").style.background = "#FAFAFA";


    } else {
        isDarkTheme = true;
        document.getElementById("chatbox").style.background = "#2F3136";
        document.getElementById("drawer").style.background = "#1E2124";
        document.getElementById("chatbox_mobile_footer").style.background = "#1E2124";
        document.getElementById("chatbox_mobile_footer").style.textColor = "grey";


    }
}


//smileys

var alwaysDisplayUsername = false;
var displayTime = false;