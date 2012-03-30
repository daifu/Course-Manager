require('lib/require_patch').monkeypatch(this);

var globals = {};

function resolveFontName(fontName) {
    if(Ti.Platform.name === "iPhone OS") {
        return fontName;
    } else {
        return fontMap[fontName];
    }
}

(function() {
    var AppTabGroup,
        AppWindow,
        SearchWindow,
        DirectoryWindow,
        SettingsWindow,
        FBLoggedInWindow;

    globals.fontMap = {
        "Frutiger LT Std" : "FrutigerLTStd-ltalic",
        "Futura Std" : "FuturaStd-Medium"
    };
    Ti.App.logoFont = resolveFontName("Frutiger LT Std");
    Ti.App.textFont = resolveFontName("Futura Std");

    Ti.Facebook.appid = "140022819458918";
    Ti.Facebook.permissions = ['publish_stream', 'user_about_me', 'email', 'friends_about_me', 'friends_photos'];
    
    var updateLoginStatus = function() {
        if(Ti.Facebook.loggedIn) {
            AppTabGroup = require('ui/AppTabGroup');
            AppWindow = require('ui/AppWindow');
            SearchWindow = require('ui/SearchWindow');
            DirectoryWindow = require('ui/DirectoryWindow');
            SettingsWindow = require('ui/SettingsWindow');

            globals.tabs = new AppTabGroup({
                title : 'Search',
                icon : 'images/Search_24.png',
                window : new SearchWindow({
                    title : 'Search',
                    backgroundColor : 'white'
                })
            }, {
                title : 'Directory',
                icon : 'images/list_24.png',
                window : new DirectoryWindow({
                    title : 'Directory',
                    backgroundColor : 'white'
                })
            }, {
                title : 'Starred',
                icon : 'images/star_24.png',
                window : new AppWindow({
                    title : 'Starred',
                    backgroundColor : 'white'
                })
            }, {
                title : 'Settings',
                icon : 'images/settings_24.png',
                window : new SettingsWindow({
                    title : 'Settings',
                    backgroundColor : 'white'
                })
            });
            return globals.tabs.open();
        } else {
            Ti.API.info("FB logging in at start.");
            FBLoggedInWindow = require("ui/FBLoggedInWindow");
            globals.fbLoggedIn = new FBLoggedInWindow({
                title: 'Logged In',
                backgroundColor: "#536895",
                left: 0,
                top: 0
            });
            globals.fbLoggedIn.open();
        }
    };


    // capture
    Ti.Facebook.addEventListener('login', updateLoginStatus);
    Ti.Facebook.addEventListener('logout', updateLoginStatus);
    
    updateLoginStatus();
})();
