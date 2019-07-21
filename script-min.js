function refreshSizes() { var e, t = document.getElementsByClassName("chatbox"); for (e = 0; e < t.length; e++) { $(t[e]).css("padding-top", $("#chatbox_mobile_header2").height() + 10 + "px"); var o = parseInt($(t[e]).css("padding-top")) + parseInt($(t[e]).css("padding-bottom"));
        $(t[e]).height($("#chatbox_container").height() - (isConnected ? $("#chatbox_mobile_footer").height() + o : 0)) } }

function retrieveInitHash() { $.ajax({ url: "chatbox/index.forum", type: "get", cache: !1, success: function(e) { var t = /(?:^|\s)new Chatbox\(\"(.*?)\",(?:\s|$)/g,
                o = /(?:^|\s).*chatbox.connected\ \=\ (.*?);.*(?:\s|$)/g,
                a = /(?:^|\s).*chatbox.userId\ \=\ (.*?);.*(?:\s|$)/g,
                s = t.exec(e),
                n = getParameterByName("archives");
            null == n && (n = 0), chatbox = new Chatbox(s[1], { archives: n, avatar: 1 }), chatbox.userId = a.exec(e)[1], chatbox.connected = "true" == o.exec(e)[1], chatbox.defaultColor = "#5f6363", $("#divcolor").css("display", "inline-block"), $("#divsmilies").css("display", "inline-block"), chatbox.init(), setIsConnected(chatbox.connected) } }) }

function retrieveImgCode() { $.ajax({ url: retrieveUrl, type: "get", cache: !1, success: function(e) { var t = /(?:^|\s).*(servImgAccount[\s\S]*?)INTRANET.*(?:\s|$)/g,
                o = t.exec(e); if (null == o) return retrieveUrl = retrieveUrlMobile, void retrieveImgCode();
            responseIsolated = o[1]; var a = /(?:^|\s).*servImgAccount\ \=\ \'(.*?)\';.*(?:\s|$)/g,
                s = /(?:^|\s).*servImgId\ \=\ \'(.*?)\';.*(?:\s|$)/g,
                n = /(?:^|\s).*servImgF\ \=\ \'(.*?)\';.*(?:\s|$)/g,
                i = /(?:^|\s).*servImgMode\ \=\ \'(.*?)\';.*(?:\s|$)/g,
                r = /(?:^|\s).*servimgDomain\ \=\ \'(.*?)\';.*(?:\s|$)/g;
            servImgAccount = a.exec(responseIsolated)[1], servImgId = s.exec(responseIsolated)[1], servImgF = n.exec(responseIsolated)[1], servImgMode = i.exec(responseIsolated)[1], servimgDomain = r.exec(responseIsolated)[1]; var l = "https://servimg.com/multiupload.php?&mode=fae&account=" + servImgAccount + "&id=" + servImgId + "&f=" + servImgF;
            imgIframe = '<iframe id="obj_servimg" src="' + l + '" border="0" width="540" height="285"></iframe>', $("#img-dialog-content").html(imgIframe) } }) }

function openImg(e) { null == imgIframe && retrieveImgCode(); var t = document.querySelector("#img-dialog"); return $(document).width() > 550 ? t.style.width = "540px" : t.style.width = $(document).width() - 20 + "px", t.addEventListener("click", function(e) { var o = t.getBoundingClientRect(),
            a = o.top <= e.clientY && e.clientY <= o.top + o.height && o.left <= e.clientX && e.clientX <= o.left + o.width;
        a || t.close() }), t.showModal(), !1 }

function processSmileyAndDisplay(e) { var t = document.querySelector("#smiley-dialog"),
        o = /<body.*?>([\s\S]*)/.exec(e)[1];
    console.log(o), $("#smiley-dialog-content").html(o), $("#smiley-dialog-content .forumline")[0].style = "background-color:transparent !important; border: 0px solid #d6c8c3 !important;", $("#smiley-dialog-content  .genmed")[1].onclick = "                 var dialog = document.querySelector('#smiley-dialog');                dialog.close();                return false;            ", $("#smiley-dialog-content  .genmed")[1].href = "javascript:closeSmilieDialog()", t.addEventListener("click", function(e) { var o = t.getBoundingClientRect(),
            a = o.top <= e.clientY && e.clientY <= o.top + o.height && o.left <= e.clientX && e.clientX <= o.left + o.width;
        a || t.close() }), t.showModal() }

function openColors(e) { return $.ajax({ url: "/chatbox/selectcolor", type: "get", cache: !1, beforeSend: function(e) { e.setRequestHeader("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:53.0) Gecko/20100101 Firefox/53.0") }, success: function(e) { var t = document.querySelector("#color-dialog");
            $("#color-dialog-content").html(e + '            <script type="text/javascript">                function Set(string) {                    setColor(string);                    return false;                }                </script>            '), t.addEventListener("click", function(e) { var o = t.getBoundingClientRect(),
                    a = o.top <= e.clientY && e.clientY <= o.top + o.height && o.left <= e.clientX && e.clientX <= o.left + o.width;
                a || t.close() }), t.showModal() } }), !1 }

function openVocal() { navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) ? confirm("Si vous n'avez pas l'application Jitsy Meet (gratuite et opensource) le chat vocal ne fonctionnera pas. Souhaitez vous l'installer ?") ? navigator.userAgent.match(/Android/i) ? window.open("https://play.google.com/store/apps/details?id=org.jitsi.meet", "_empty") : window.open("https://itunes.apple.com/us/app/jitsi-meet/id1165103905?mt=8", "_empty") : window.open("org.jitsi.meet:https://framatalk.org/jeunesecrivains", "_empty") : window.open("https://framatalk.org/jeunesecrivains", "_empty") }

function Set(e) { alert(e); var t = ValidateColor(e);
    null == t ? alert("Invalid color code: " + e) : (View(t), opener.my_setcookie("CB_color", "#" + t), opener.chatbox.format(), window.close()) }

function setIsConnected(e) { isConnected = e, isConnected ? $("#chatbox_mobile_footer").show() : $("#chatbox_mobile_footer").hide() }

function closeSmilieDialog() { var e = document.querySelector("#smiley-dialog");
    e.close() }

function closeColorDialog() { var e = document.querySelector("#color-dialog");
    e.close() }

function insert_chatboxsmilie(e) { $("#message").val($("#message").val() + e); var t = document.querySelector("#smiley-dialog");
    t.close(), $("#message").focus() }

function setColor(e) { var t = ValidateColor(e); if (null == t) alert("Invalid color code: " + e);
    else { View(t), my_setcookie("CB_color", t), $("#scolor").val(t), window.chatbox.format(); var o = document.querySelector("#color-dialog");
        o.close(), $("#message").focus() } }

function sendForm() { var e = $("#message").val().trim(); if ("" != e) { switch (e) {
            case "/banlist":
                window.chatbox.openBanlistPage(); break;
            case "/help":
                window.chatbox.openHelpPage(); break;
            case "/exit":
                window.chatbox.disconnect(); break;
            default:
                window.chatbox.send() }
        $("#message").val("").focus() } else $("#message").focus() }

function showChatboxMembers() { document.getElementById("chatbox_members").style.display = "inline" }
var muted = [],
    refreshInt = void 0,
    MaterialLayout = void 0,
    oldToggle = void 0,
    originalDrawerButton = void 0,
    MaterialMenu = void 0,
    usCount = 0,
    salon = "chatbox",
    chatbox, chatboxes = ["#Général", "#WordWar"];
setInterval(refreshSizes, 500), $("#form").submit(function() { return sendForm(), !1 }), setChatbox = function(e) { salon = e; for (var t = 0; t < chatboxes.length; t++) { var o = "";
        0 !== t && (o = t); var a = "chatbox" + o,
            s = "chatbox_selector" + o;
        a == salon ? (document.getElementById(a).style.display = "block", document.getElementById(s).style.color = "black", $("#chatbox" + o).scrollTop(2 * $("#chatbox" + o).prop("scrollHeight"))) : (document.getElementById(a).style.display = "none", document.getElementById(s).style.color = "grey") } };
var servImgAccount, servImgId, servImgF, servImgMode, servimgDomain, imgIframe, retrieveUrlMobile = "index.forum?mobile&redirect=%2Ft11714-le-guide-de-presentation-du-parfait-jeune-ecrivain",
    retrieveUrlPC = "t11714-le-guide-de-presentation-du-parfait-jeune-ecrivain",
    retrieveUrl = retrieveUrlPC,
    onImgMessage = function(e) { "servimg" === e.data.from && $("#message").val($("#message").val() + e.data.data.replace(/\[url=([^\s\]]+)\s*\](.*(?=\[\/url\]))\[\/url\]/g, "$1")); var t = document.querySelector("#img-dialog");
        t.close() };
Chatbox.prototype.clearUserList = function() { document.getElementById("online-users").getElementsByClassName("is-visible").length <= 0 && $("#online-users").empty(), document.getElementById("away-users").getElementsByClassName("is-visible").length <= 0 && $("#away-users").empty() }, Chatbox.prototype.appendUserToList = function(e) { var t = this.users[this.userId];
    usCount += 1, "none" == e.color && isDarkTheme && (e.color = "grey"); var o = "		<li id='user-" + usCount + "'>                    <span class=\"chatbox-user-list-item\">		<span style='color:" + e.color + "'>" + (e.admin ? "@ " : "") + "<span class='chatbox-username chatbox-user-username' data-user='" + e.id + "' >" + e.username + '</span><button id="demo-menu-lower-' + usCount + '"            class="mdl-button mdl-js-button mdl-button--icon">      <i class="material-icons">more_vert</i>    </button>';
    o = o + '<ul id="user-menu-' + usCount + '" class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect"        for="demo-menu-lower-' + usCount + '">    </ul>', o += "</span></span>                </li>"; var a = e.online ? "#online-users" : "#away-users"; if (e.online && document.getElementById("online-users").getElementsByClassName("is-visible").length <= 0 || !e.online && document.getElementById("away-users").getElementsByClassName("is-visible").length <= 0) { $(a).append("<li>" + o + "</li>"); var s = document.getElementById("user-menu-" + usCount),
            n = new MaterialMenu(s),
            i = document.createElement("li");
        i.classList.add("mdl-menu__item"), i.innerHTML = "Profil", i.addEventListener("click", function() { var t = window.open("/u" + e.id, "_blank");
            t.focus() }), $(s).append(i); var r = document.createElement("li");
        r.classList.add("mdl-menu__item"), r.innerHTML = "Message", r.addEventListener("click", function() { var t = window.open("/privmsg?mode=post&u=" + e.id, "_blank");
            t.focus() }), $(s).append(r); var l = document.createElement("li");
        l.classList.add("mdl-menu__item"), -1 !== $.inArray(e.id, muted) ? $(l).attr("data-mdl-disabled", !0) : $(l).removeAttr("data-mdl-disabled"), l.innerHTML = "Masquer", $(s).append(l); var c = document.createElement("li"); if (c.classList.add("mdl-menu__item"), -1 !== $.inArray(e.id, muted) ? $(c).removeAttr("data-mdl-disabled") : $(c).attr("data-mdl-disabled", !0), c.innerHTML = "Afficher", l.addEventListener("click", function() { muted.push(e.id), $(l).attr("data-mdl-disabled", !0), $(c).removeAttr("data-mdl-disabled"), chatbox.refresh(lastData) }), c.addEventListener("click", function() { muted.splice(muted.indexOf(e.id), 1), $(c).attr("data-mdl-disabled", !0), $(l).removeAttr("data-mdl-disabled"), chatbox.refresh(lastData) }), $(s).append(c), void 0 != t && t.admin) { if (e.username = e.username.replace(/\\/g, "\\\\").replace(/\'/g, "\\'"), 2 != e.chatLevel && !e.admin) { var d = document.createElement("li");
                d.classList.add("mdl-menu__item"), d.innerHTML = "Kicker", d.addEventListener("click", function() { action_user("kick", e.username) }), s.append(d); var m = document.createElement("li");
                m.classList.add("mdl-menu__item"), m.innerHTML = "Bannir", m.addEventListener("click", function() { action_user("ban", e.username) }), $(s).append(m) } if (2 == e.chatLevel && 1 != e.userLevel && e.id != t.id) { var u = document.createElement("li");
                u.classList.add("mdl-menu__item"), u.innerHTML = "Retirer modération", u.addEventListener("click", function() { action_user("unmod", e.username) }), $(s).append(u) } else if (!e.admin) { var u = document.createElement("li");
                u.classList.add("mdl-menu__item"), u.innerHTML = "Donner modération", u.addEventListener("click", function() { action_user("mod", e.username) }), $(s).append(u) } }
        n.init() } }, $("#text_editor_textarea").ready(function() { $("#chatbox").scrollTop(2 * $("#chatbox").prop("scrollHeight")), $("#smiley-button").click(function(e) { openSmiley(e) }), $("#color-button").click(function(e) { openColors(e) }), $("#img-button").click(function(e) { openImg(e) }), $("#refresh-button").click(function(e) { void 0 != refreshInt && clearInterval(refreshInt), refreshInt = setInterval(chatbox.get, 1e3) }), $("#hide-button").click(function(e) { $("#chatbox_mobile_header2").css("opacity", "0.5"), $("#chatbox_mobile_header2").css("width", "0px"), $("#full-width-buttons").css("display", "none"), setTimeout(function() { void 0 == originalDrawerButton && (originalDrawerButton = $(".mdl-layout__drawer-button")[0].innerHTML), $(".mdl-layout__drawer-button")[0].innerHTML = '<i class="material-icons">arrow_forward</i>'; var e = document.getElementById("drawer_layout"),
                t = new MaterialLayout(e);
            t.init(), void 0 == MaterialLayout.prototype.oldToggle && (MaterialLayout.prototype.oldToggle = MaterialLayout.prototype.toggleDrawer), MaterialLayout.prototype.toggleDrawer = function(e) { MaterialLayout.prototype.toggleDrawer = MaterialLayout.prototype.oldToggle, $(".mdl-layout__drawer-button")[0].innerHTML = originalDrawerButton, $("#chatbox_mobile_header2").css("width", "100%"), $("#chatbox_mobile_header2").css("opacity", "1"), $("#full-width-buttons").css("display", "inline") } }, 1e3) }), $("#format-button").click(function(e) { return "none" == document.getElementById("format-line").style.display || "" == document.getElementById("format-line").style.display ? (document.getElementById("format-line").style.display = "table-row", document.getElementById("format-line").style.opacity = "1") : (document.getElementById("format-line").style.display = "none", document.getElementById("format-line").style.opacity = "0"), document.getElementById("message").focus(), !1 }); var e = (document.querySelector("#button"), document.querySelector("#smiley-dialog"));
    dialogPolyfill.registerDialog(e), e = document.querySelector("#color-dialog"), dialogPolyfill.registerDialog(e), e = document.querySelector("#img-dialog"), dialogPolyfill.registerDialog(e), $("#message").keypress(function(e) { return 13 == e.which ? (sendForm(), !1) : void 0 }), $("#chatbox").scrollTop(2 * $("#chatbox").prop("scrollHeight")), color = my_getcookie("CB_color"), color && $("#scolor").val(color), $(".format-message").each(function(e, t) { $(t).on("change", function() { var e = $(t).attr("name");
            my_setcookie("CB_" + e, $(t).is(":checked") ? 1 : 0), window.chatbox.format() }) }); for (var t = 0; t < chatboxes.length; t++) { var o = "";
        0 !== t && (o = t), $("#chatbox_container").append("<div class='chatbox' id='chatbox" + o + "'> </div>"), $("#chatbox_room_container").append("<li><a href=\"#\" class='mobile-room' id='chatbox_selector" + o + "'onclick=\"setChatbox('chatbox" + o + "'); return false;\">" + chatboxes[t] + " </a>") }
    setChatbox("chatbox"), retrieveInitHash() }), Chatbox.prototype.format = function() { var e = $("#message");
    e.css("font-weight", parseInt(my_getcookie("CB_bold")) ? "bold" : "normal"), e.css("font-style", parseInt(my_getcookie("CB_italic")) ? "italic" : "normal"), e.css("text-decoration", (parseInt(my_getcookie("CB_underline")) ? "underline " : "") + (parseInt(my_getcookie("CB_strike")) ? "line-through" : "")), color = my_getcookie("CB_color"), color && ($("#scolor").val(color), $("#divcolor-preview").css("background-color", color), e.css("color", "#" + color)) };
var lastUserId = -1,
    first = 0,
    lastData = void 0;
Chatbox.prototype.refresh = function(e) { if (lastData = e, e.error) $("body").html(e.error);
    else { if (setIsConnected(this.connected), this.connected && !this.archives ? ($("#chatbox_footer").css("display", "block"), $("#chatbox_messenger_form").css("display", "block"), $("#chatbox_messenger_form").css("visibility", "visible")) : ($("#chatbox_footer").css("display", "none"), $("#chatbox_messenger_form").css("display", "none"), $("#chatbox_messenger_form").css("visibility", "hidden")), this.connected ? ($("#chatbox_display_archives").show(), $("#chatbox_option_co").hide(), $("#chatbox_option_disco, #chatbox_footer").show(), $(".format-message").each(function() { var e = $(this).attr("name"),
                    t = my_getcookie("CB_" + e);
                $(this).prop("checked", parseInt(t) ? !0 : !1) }), this.format(), e.lastModified && (this.listenParams.lastModified = e.lastModified)) : ($("#chatbox_option_co").show(), $("#chatbox_option_disco, #chatbox_footer").hide(), $("#chatbox_display_archives").hide()), e.users) { this.users = [], this.clearUserList(), $(".member-title").hide(); for (var t in e.users) { var o = e.users[t];
                this.users[o.id] = o } for (var t in e.users) { var o = e.users[t];
                this.appendUserToList(o) }
            $(".online-users").is(":empty") || $(".member-title.online").show(), $(".away-users").is(":empty") || $(".member-title.away").show() } if (e.messages) {!this.messages || this.messages.length != e.messages.length;
            this.messages = e.messages; for (var a = {}, s = {}, n = {}, i = 0; i < chatboxes.length; i++) { var r = "";
                0 !== i && (r = i), a["chatbox" + r] = "" } if (this.messages) { for (var l = 0; l < this.messages.length; l++) { var c = this.messages[l],
                        d = 0,
                        m = 0,
                        u = "chatbox"; - 1 !== c.msg.indexOf("/chatbox") && (d = c.msg.indexOf("/chatbox"), u = c.msg.substring(d + 1, d + 1 + "/chatbox".length), m = " " == c.msg.charAt(u.length + 2) ? u.length + 2 : u.length + 1), c.msg = c.msg.substring(0, d) + c.msg.substring(d + m, c.msg.length); var g = ""; if (this.messages[l].userId < 0 || s[u] != c.userId || alwaysDisplayUsername ? (l > 0 && (g += "</p>"), void 0 == n[u] ? n[u] = 0 : this.messages[l].userId >= 0 && (n[u] = n[u] + 1), g += "<p class='chatbox_row chatbox_row_" + (this.messages[l].userId >= 0 ? n[u] % 2 == 1 ? 2 : 1 : "sys") + " clearfix'>", displayTime && (g += "<span class='date-and-time' title='" + c.date + "'>[" + c.datetime + "]</span>")) : g += "<br />", -10 == c.userId ? (void 0 == c.msgColor && isDarkTheme && (c.msgColor = "brown"), g += "<span class='msg'><span style='color:" + c.msgColor + "'><strong> " + c.msg + "</strong></span></span>") : (g += "<span class='user-msg'>", (c.userId != s[u] || alwaysDisplayUsername) && (isDarkTheme && "none" == c.user.color && (c.user.color = "#C0BEBF"), g += "	<span class='user' style='color:" + ("Jasmin" == c.username ? "#49875C" : "Noxer" == c.username ? "#FF00FD" : c.user.color) + "'><strong> " + (c.user.admin ? "@ " : "") + "<span class='chatbox-username chatbox-message-username'  data-user='" + c.userId + "' >" + c.username + "</span>&nbsp;:&nbsp;</strong></span>"), g += "<span class='msg'" + (isDarkTheme ? 'style = "color:#C0BEBF !important;"> ' : ">") + (isDarkTheme ? c.msg.replace("color", "c") : c.msg) + "</span></span>"), s[u] = c.userId, -10 != c.userId || 0 === c.msg.indexOf("<strong>*")) console.log($.inArray(c.userId, muted)), -1 === $.inArray(c.userId, muted) && (a[u] += g);
                    else
                        for (var i = 0; i < chatboxes.length; i++) { var r = "";
                            0 !== i && (r = i), a["chatbox" + r] += g + "</p>", s["chatbox" + r] = c.userId } } for (var i = 0; i < chatboxes.length; i++) { var r = "";
                    0 !== i && (r = i); var p = document.getElementById("chatbox" + r);
                    null != p && (p.innerHTML = a["chatbox" + r], $(p).prop("scrollHeight") - $(p).scrollTop() < 600 ? $(p).animate({ scrollTop: $(p).prop("scrollHeight") }, duration = 1e3) : $(p).scrollTop(4 * $(p).prop("scrollHeight")), first += 1) } } } } }, void 0 == Chatbox.prototype.appendUserToList && (Chatbox.prototype.appendUserToList = function(e) { var t = "<span style='color:" + e.color + "'>" + (e.admin ? "@ " : "") + "<span class='chatbox-username chatbox-user-username' data-user='" + e.id + "' >" + e.username + "</span></span>",
        o = e.online ? ".online-users" : ".away-users";
    $(o).append("<li>" + t + "</li>") }), Chatbox.prototype.send = function(e) { e || (toAdd = "", "chatbox" === salon || void 0 == salon || 0 === document.getElementById("message").value.indexOf("/") && 0 !== document.getElementById("message").value.indexOf("/me") || (toAdd = "/" + salon + " "), 0 === document.getElementById("message").value.indexOf("/me") && (toAdd = "/me " + toAdd, document.getElementById("message").value = document.getElementById("message").value.replace("/me ", "")), document.getElementById("message").value = toAdd + document.getElementById("message").value.replace("kick phoenamandre", "kick Red-scarf").replace("Phie", "Ph[b][/b]ie").replace("kick Phoenamandre", "kick Red-scarf").replace(":snif:", "[img]http://pix.toile-libre.org/upload/original/1479152421.png[/img]").replace(":christclown:", "[img]http://pix.toile-libre.org/upload/original/1479206957.png[/img]").replace(":flown:", "[img]http://phoenamandre.fr/WebNewChatbox/images/flown.png[/img]").replace(":jlm:", "[img]http://phoenamandre.fr/WebNewChatbox/images/melenchon.png[/img]").replace(":jlmc:", "[img]http://phoenamandre.fr/WebNewChatbox/images/melenchonc.png[/img]").replace(":fork:", "[img]http://phoenamandre.fr/WebNewChatbox/images/fork.png[/img]").replace(":nose:", "[img]http://phoenamandre.fr/WebNewChatbox/images/nose.png[/img]").replace(":flowey:", "[img]http://phoenamandre.fr/WebNewChatbox/images/flowey.png[/img]").replace(":morano:", "[img]http://phoenamandre.fr/WebNewChatbox/images/morano.png[/img]").replace(":boutin:", "[img]http://phoenamandre.fr/WebNewChatbox/images/boutin.png[/img]").replace(":coolchrist:", "[img]http://pix.toile-libre.org/upload/original/1481118404.gif[/img]").replace(":bigbounce:", "[img]http://pix.toile-libre.org/upload/original/1490026326.gif[/img]").replace(":sadchrist:", "[img]http://pix.toile-libre.org/upload/original/1479249114.gif[/img]").replace(":sadclown:", "[img]http://pix.toile-libre.org/upload/original/1490027809.png[/img]").replace(":minerva:", "[img]http://phoenamandre.fr/WebNewChatbox/images/mcgonagall.jpg[/img]").replace(":phie:", "[img]http://phoenamandre.fr/WebNewChatbox/images/phie.png[/img]").replace(":mdm:", "[img]http://phoenamandre.fr/WebNewChatbox/images/mdm.png[/img]").replace("Phoenamandre", "Phœnamandre").replace("Nutella", "Marijuana").replace("kick Machin", "kick Raven"), e = $("form[name='post']").serialize()), chatbox.oldsend(e) }, $(document).on("click", "body *", function() { document.getElementById("message").focus() }), window.removeEventListener("message", onMessage, !1), window.addEventListener("message", onImgMessage, !1), $("head").append('<meta name="viewport" content="width=device-width, height=device-height, user-scalable=no" />'), $("head").append('<meta name="mobile-web-app-capable" content="yes">');