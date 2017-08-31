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

var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = rootUrl + '/polyfill/dialog-polyfill.css';
link.media = 'all';
head.appendChild(link);

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