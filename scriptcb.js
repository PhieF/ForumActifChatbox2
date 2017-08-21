var script = ""
var rootUrl = "https://rawgit.com/Phief/ForumActifChatbox2/master";
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
            var myRegexp2 = /(?:^|\s)chatbox\\\.userId(.*?),(?:\s|$)/g;
            //alert( myRegexp2.exec(response));
            var match = myRegexp.exec(response);
            var archives = getParameterByName("archives");
            if (archives == null)
                archives = 0;

            chatbox = new Chatbox(match[1], { "archives": archives, "avatar": 1 });

            chatbox.userId = 1;
            chatbox.connected = true;
            chatbox.defaultColor = '#5f6363';

            $('#divcolor').css('display', 'inline-block');
            $('#divsmilies').css('display', 'inline-block');

            chatbox.init();

        }
    });

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
script2.src = rootUrl + '/polyfill/bower.js?vd=' + Math.random();
head.appendChild(script2);
script2 = document.createElement('script');
script2.type = 'text/javascript';
script2.src = rootUrl + '/polyfill/package.js?vd=' + Math.random();
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

	setChatbox = function(chat){
		salon = chat;
		for(var cb = 0; cb< chatboxes.length; cb ++ ){
			var cbnum = "";
			if(cb!==0){
				cbnum =cb;
			}
			var name = "chatbox"+cbnum;
			var nameButtom = "chatbox_selector"+cbnum;
			if(name==salon){
				 document.getElementById(name).style.display="block";
		document.getElementById(nameButtom).style.color="black";
				 $("#chatbox"+cbnum).scrollTop($("#chatbox"+cbnum).prop('scrollHeight')*2);
				 
			 }
			else{
				 document.getElementById(name).style.display="none";
		document.getElementById(nameButtom).style.color="grey";
		}
	}
	}
	function showChatboxMembers(){
		document.getElementById("chatbox_members").style.display = "inline";


	}

var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = rootUrl + '/polyfill/dialog-polyfill.css';
link.media = 'all';
head.appendChild(link);
retrieveInitHash();
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
