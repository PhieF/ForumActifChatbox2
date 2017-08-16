var lastUserId = -1;
var first = 0;
Chatbox.prototype.refresh = function(data) {
    if (data.error) {
        $("body").html(data.error);
    } else {
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
            setIsConnected(true)

            $("#chatbox_display_archives").show();
            $("#chatbox_option_co").hide();
            $("#chatbox_option_disco, #chatbox_footer").show();

            $(".format-message").each(function() {
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
            setIsConnected(true);
        }

        if (data.users) {
            this.users = [];
            // Display the list of the users
            $(".online-users, .away-users").empty();
            $(".member-title").hide();

            for (var i in data.users) {
                var user = data.users[i];
                this.users[user.id] = user;
                // Format the name
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

            for (var cb = 0; cb < chatboxes.length; cb++) {
                var cbnum = "";
                if (cb !== 0) cbnum = cb;

                content["chatbox" + cbnum] = "";
            }

            if (this.messages) {

                for (var j = 0; j < this.messages.length; j++) {
                    var message = this.messages[j];
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
                    if (!(j > 0 && this.messages[j].userId != -1 && lastUsername[chatboxId] == message.userId)) {
                        html += "<p class='chatbox_row_" + (j % 2 == 1 ? 2 : 1) + " clearfix'>";
                    }

                    if (message.userId == -10) {
                        // this is a system message
                        if (message.msgColor == undefined && isDarkTheme)
                            message.msgColor = "brown";
                        html += "<span class='msg'>" +
                            "<span style='color:" + message.msgColor + "'>" +
                            "<strong> " +
                            message.msg +
                            "</strong>" +
                            "</span>" +
                            "</span>";

                    } else {
                        // This is a user message
                        html += "<span class='user-msg'>";
                        if (message.userId != lastUsername[chatboxId]) {
                            if (isDarkTheme && message.user.color == "none")
                                message.user.color = "#C0BEBF";
                            html += "	<span class='user' style='color:" + (message.username == "Jasmin" ? "#49875C" : (message.username == "Noxer" ? "#FF00FD" : message.user.color)) + "'>" +
                                "<strong> " +
                                (message.user.admin ? "@ " : "") + "<span class='chatbox-username chatbox-message-username'  data-user='" + message.userId + "' >" + message.username + "</span>&nbsp;:&nbsp;" +
                                "</strong>" +
                                "</span>";
                        }
                        html += "<span class='msg'" + (isDarkTheme ? "style = \"color:#C0BEBF !important;\"> " : ">") +
                            (isDarkTheme ? message.msg.replace("color", "c") : message.msg) +
                            "</span>" +
                            "</span>";

                    }
                    if (!(j < this.messages.length - 1 && this.messages[j + 1].userId != -1 && this.messages[j + 1].userId == message.userId)) {
                    } else html += "<br />";
                    lastUsername[chatboxId] = message.userId;
                    if (message.userId != -10)
                        content[chatboxId] += html;
                    else {
                        for (var cb = 0; cb < chatboxes.length; cb++) {
                            var cbnum = "";
                            if (cb !== 0) cbnum = cb;
                            content["chatbox" + cbnum] += html+"</p>";
                            lastUsername["chatbox" + cbnum] = message.userId;

                        }
                    }

                }

                for (var cb = 0; cb < chatboxes.length; cb++) {
                    var cbnum = "";
                    if (cb !== 0) cbnum = cb;
                    if (true) {
                        //alert($("#chatbox"+cbnum).prop('scrollHeight'));
                        var elem = document.getElementById('chatbox' + cbnum);
                        if (elem != null) {
                            elem.innerHTML = content["chatbox" + cbnum];

                            $(elem).animate({ scrollTop: $(elem).prop('scrollHeight') }, duration = 1000);

                            first = first + 1;
                        }

                    }
                }
                
            }
        }
    }
};
if (Chatbox.prototype.appendUserToList == undefined) {
    Chatbox.prototype.appendUserToList = function(user) {
        var username = "<span style='color:" + user.color + "'>" +
            (user.admin ? "@ " : "") +
            "<span class='chatbox-username chatbox-user-username' data-user='" + user.id + "' >" + user.username + "</span>" +
            "</span>";

        // Insert the user in the online or away list of users
        var list = user.online ? '.online-users' : '.away-users';
        $(list).append('<li>' + username + '</li>');
    }
}
Chatbox.prototype.send = function(params) {
    if (!params) {
        toAdd = "";
        if (salon !== "chatbox" && salon != undefined && document.getElementById("message").value.indexOf("/me") == -1)
            toAdd = "/" + salon + " ";
        document.getElementById("message").value = toAdd + document.getElementById("message").value.replace('Lo.mel', 'zizi pissou !!!').replace("kick phoenamandre", "kick Red-scarf").replace("Phie", "Ph[b][/b]ie").replace("kick Phoenamandre", "kick Red-scarf").replace(":snif:", "[img]http://pix.toile-libre.org/upload/original/1479152421.png[/img]").replace(":christclown:", "[img]http://pix.toile-libre.org/upload/original/1479206957.png[/img]").replace(":flown:", "[img]http://phoenamandre.fr/WebNewChatbox/images/flown.png[/img]").replace(":jlm:", "[img]http://phoenamandre.fr/WebNewChatbox/images/melenchon.png[/img]").replace(":jlmc:", "[img]http://phoenamandre.fr/WebNewChatbox/images/melenchonc.png[/img]").replace(":fork:", "[img]http://phoenamandre.fr/WebNewChatbox/images/fork.png[/img]").replace(":nose:", "[img]http://phoenamandre.fr/WebNewChatbox/images/nose.png[/img]").replace(":flowey:", "[img]http://phoenamandre.fr/WebNewChatbox/images/flowey.png[/img]").replace(":morano:", "[img]http://phoenamandre.fr/WebNewChatbox/images/morano.png[/img]").replace(":boutin:", "[img]http://phoenamandre.fr/WebNewChatbox/images/boutin.png[/img]").replace(":coolchrist:", "[img]http://pix.toile-libre.org/upload/original/1481118404.gif[/img]").replace(":bigbounce:", "[img]http://pix.toile-libre.org/upload/original/1490026326.gif[/img]").replace(":sadchrist:", "[img]http://pix.toile-libre.org/upload/original/1479249114.gif[/img]").replace(":sadclown:", "[img]http://pix.toile-libre.org/upload/original/1490027809.png[/img]").replace(":minerva:", "[img]http://phoenamandre.fr/WebNewChatbox/images/mcgonagall.jpg[/img]").replace('Phoenamandre', 'Phœnamandre').replace('Nutella', 'Marijuana').replace("kick Machin", "kick Raven");
        params = $("form[name='post']").serialize();
    }
    chatbox.oldsend(params);
}