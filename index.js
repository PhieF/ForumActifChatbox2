$("body").html("<script src=\"http://phoenamandre.fr/WebNewChatbox/git/test.js\"> \
</script> \
<link rel=\"stylesheet\" href=\"https://code.getmdl.io/1.3.0/material.indigo-pink.min.css\"> \
<!-- Material Design icon font --> \
<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\"> \
<link rel=\"stylesheet\" href=\"https://code.getmdl.io/1.3.0/material.blue_grey-indigo.min.css\" /> \
<button style=\"right:10px;\" id=\"display-button\" onclick=\"displayHeader()\" class=\"mdl-button mdl-js-button mdl-button--icon\"> \
                    <i class=\"material-icons\">input</i> \
                     \
        </button> \
<div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-drawer \
                mdl-layout--fixed-header\" id=\"drawer_layout\"> \
    <header id=\"chatbox_mobile_header2\" class=\"mdl-layout__header\"> \
        <div class=\"mdl-layout__header-row\"> \
            <div id=\"full-width-buttons\"> \
                <button style=\"right:10px;\" id=\"hide-button\" onclick=\"\" class=\"mdl-button mdl-js-button mdl-button--icon\"> \
                <i class=\"material-icons\">arrow_back</i> \
                </button> \
                <button style=\"right:10px;\" id=\"connect-button\" onclick=\"if(!chatbox.connected)chatbox.connect();else chatbox.disconnect();\" class=\"mdl-button mdl-js-button mdl-button--icon\"> \
                    <i class=\"material-icons\">input</i> \
                     \
                </button> \
 \
                <button style=\"right:10px;\" id=\"refresh-button\" onclick=\"\" class=\"mdl-button mdl-js-button mdl-button--icon\"> \
                   <i class=\"material-icons\">refresh</i> \
                </button> \
                <button id=\"option-menu-button\" class=\"mdl-button mdl-js-button mdl-button--icon\"> \
                     <i class=\"material-icons\">more_vert</i> \
                </button> \
                <ul id=\"option-menu\" class=\"mdl-menu mdl-menu--unaligned mdl-js-menu mdl-js-ripple-effect\" for=\"option-menu-button\"> \
                    <li class=\"mdl-menu__item\" id=\"display-time\" onclick=\"toggleDisplayTime()\"> \
                        <input id=\"checkbox-time\" type=\"checkbox\" onclick=\"return false;\" /> Afficher l'heure des messages \
                    </li> \
                    <li class=\"mdl-menu__item\" onclick=\"toggleDisplayUsername()\"> \
                        <input id=\"checkbox-username\" type=\"checkbox\" onclick=\"return false;\" /> Rappeler le pseudo à chaque ligne \
                    </li> \
                </ul> \
            </div> \
 \
        </div> \
    </header> \
 \
    <div class=\"mdl-layout__drawer\" id=\"drawer\"> \
        <!-- Icon List --> \
        <style> \
            .demo-list-icon { \
                width: 160px; \
            } \
        </style> \
 \
        <span style=\"text-align:center; margin-top:10px;\"> \
				Salons \
		</span> \
        <ul class=\"demo-list-icon mdl-list\" id=\"chatbox_room_container\"> \
 \
            <!-- <li><a href=\"org.jitsi.meet:https://framatalk.org/jeunesecrivains\" onclick = 'openVocal(); return false;' class='mobile-room' target=\"_blank\">Vidéoconférence</a></li>--> \
        </ul> \
        <span style=\"text-align:center; margin-top:10px;\"> \
				Membres du parti \
		</span> \
        <ul class=\"demo-list-icon mdl-list online-users\" id=\"online-users\"> \
 \
        </ul> \
        <span style=\"text-align:center; padding-right:5px;padding-left:5px;\"> \
				Goulag \
			</span> \
        <ul class=\"demo-list-icon mdl-list online-users\" id=\"away-users\"> \
 \
        </ul> \
        <span style=\"text-align:center; margin-top:10px;\"> \
                <a href=\"http://jeunesecrivains.superforum.fr/chatbox/index.forum\" class='mobile-room'>Ancienne chatbox</a> \
        </span> \
        <span style=\"text-align:center; margin-top:10px;\"> \
                <a href=\"http://jeunesecrivains.superforum.fr/login\" class='mobile-room'>Connexion</a> \
        </span> \
    </div> \
    <main class=\"mdl-layout__content\" style=\"overflow:hidden;height:100%;right:0px;\"> \
 \
        <div class=\"page-content\" style=\"height:100%;\"> \
            <div style=\" background:white;overflow-y:visible;\" id=\"chatbox_container\"> \
 \
            </div> \
            <div style=\"position:absolute; bottom:0; background:#F4F4F4; width:100%;\" id=\"chatbox_mobile_footer\"> \
                <div style=\"float: right; padding-right:0px;width:100%\"> \
                    <form id=\"form\" name=\"post\" method=\"post\" autocomplete=\"off\"> \
                        <table> \
                            <tr id=\"back-to-bottom\"> \
                                <td colspan=\"2\" style=\"padding:5px;padding-left:20px; background:#e7e7e7;\" onclick=\"scrollDown()\">Revenir aux messages actuels </td> \
                            </tr> \
                            <tr id=\"format-line\"> \
                                <td colspan=\"2\" style=\"padding-left:15px;\"> \
                                    <button id=\"smiley-button\" class=\"mdl-button mdl-js-button mdl-button--icon \" onclick=\"return false;\"> \
                                <i class=\"material-icons \">mood</i> \
                                </button> \
                                    <button onclick=\"getElementById('format-bold').click();return false;\" class=\"mdl-button mdl-js-button mdl-button--icon \"> \
                                        <i class=\"material-icons \">format_bold</i> \
                                </button> \
                                    <input name=\"bold\" id=\"format-bold\" class=\"format-message\" type=\"checkbox\"> \
                                    </input> \
                                    <button class=\"mdl-button mdl-js-button mdl-button--icon \" onclick=\"getElementById('format-italic').click(); return false;\"> \
                                <i class=\"material-icons \">format_italic</i> \
                                </button> \
                                    <input name=\"italic\" id=\"format-italic\" class=\"format-message\" type=\"checkbox\"> \
                                    </input> \
                                    <!-- \
                                    <button class=\"mdl-button mdl-js-button mdl-button--icon \" onclick=\"getElementById('format-underline').click(); return false;\"> \
                                        <i class=\"material-icons \">format_underline</i> \
                                    </button> \
 \
                                    <button class=\"mdl-button mdl-js-button mdl-button--icon \" onclick=\"getElementById('format-strike').click(); return false;\"> \
                                    <i class=\"material-icons\">format_strikethrough</i> \
                                </button>--> \
                                    <button id=\"color-button\" class=\"mdl-button mdl-js-button mdl-button--icon \" onclick=\"return false;\"> \
                                    <i class=\"material-icons\">color_lens</i> \
                                    </button> \
                                    <button id=\"img-button\" class=\"mdl-button mdl-js-button mdl-button--icon \" onclick=\"return false;\"> \
<i class=\"material-icons\">add_a_photo</i> \
                                    </button> \
                                    <button id=\"gif-button\" class=\"mdl-button mdl-js-button mdl-button--icon \" onclick=\"return false;\"> \
<i class=\"material-icons\">add_a_photo</i> \
                                    </button> \
 \
 \
                            </tr> \
                            <tr style=\" height:50px; \"> \
                                <td style=\"padding-left:15px;\"> \
                                    <button id=\"format-button\" class=\"mdl-button mdl-js-button mdl-button--icon \" style=\"display:inline; \"> \
                                <i class=\"material-icons \">text_format</i> \
                                </button> \
                                </td> \
                                <td style=\"width:100%; padding-right:5px;\"> \
 \
 \
                                    <input name=\"scolor\" id=\"scolor\" type=\"hidden\"> \
                                    <input onblur=\"this.focus()\" autofocus style=\"outline: none;width:100%;resize: none;height:20px; overflow:hidden;\" class=\"mdl-textfield__input \" type=\"text \" rows=\"1\" autocomplete=\"off\" name=\"message\" id=\"message\"></input> \
 \
                                </td> \
                            </tr> \
                        </table> \
                    </form> \
 \
                </div> \
 \
 \
 \
            </div> \
 \
        </div> \
 \
 \
    </main> \
</div> \
 \
 \
 \
<dialog id=\"smiley-dialog\" class=\"mdl-dialog\"> \
    <div class=\"mdl-dialog__content\" style=\"  padding:0px;\"> \
        <a onclick=\"closeSmilieDialog(); return false;\" href=\"#\">Fermer</a> \
        <div id=\"smiley-dialog-content\" style=\"overflow-x: auto;  padding:0px; height:250px;\"> \
 \
        </div> \
    </div> \
</dialog> \
 \
<dialog id=\"color-dialog\" class=\"mdl-dialog\"> \
    <div class=\"mdl-dialog__content\" style=\"padding:0px;\"> \
        <a onclick=\"closeColorDialog(); return false;\" href=\"#\">Fermer</a> \
        <div id=\"color-dialog-content\" style=\"overflow-x: auto;  padding:0px;\"></div> \
    </div> \
</dialog> \
 \
<dialog id=\"img-dialog\" class=\"mdl-dialog\"> \
    <div class=\"mdl-dialog__content\" style=\"padding:0px;\"> \
        <a onclick=\"closeImgDialog(); return false;\" href=\"#\">Fermer</a> \
 \
        <div id=\"img-dialog-content\" style=\"overflow-x: auto;  padding:0px;\"> \
            <div id=\"p2\" class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate\"></div> \
 \
        </div> \
    </div> \
</dialog> \
 \
 \
<dialog id=\"gif-dialog\" class=\"mdl-dialog\"> \
    <div class=\"mdl-dialog__content\" style=\"padding:0px;\"> \
        <a onclick=\"closeGifDialog(); return false;\" href=\"#\">Fermer</a> \
 \
        <div id=\"gif-dialog-content\" style=\"overflow-x: auto;  padding:0px;\"> \
            <div id=\"p2\" class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate\"></div> \
 \
        </div> \
    </div> \
</dialog> \
<input type=\"hidden\" id=\"text_editor_textarea\" /> \
 <script src='"+rootUrl+"/scriptAfterLoaded.js'> </script>\
 <link rel='stylesheet' href='"+rootUrl+"/design.css'/>");
