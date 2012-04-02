require('lib/require_patch').monkeypatch(this);
(function(){

    
    // it is a window requires people to logged in with FB
    exports.FBLoggedInWindow = function(args) {
        var win, loggedInButton,
            ogoText,
            loginView;
        win = Ti.UI.createWindow(args);
        
        //
        // Login Button
        //
        var createFacebookButton = function() {
            if(Ti.Platform.osname === 'iphone') {
                return Ti.Facebook.createLoginButton({
                    style : Ti.Facebook.BUTTON_STYLE_WIDE,
                    top: 80
                });
            } else {
                return Ti.Facebook.createLoginButton({
                    style : 'wide',
                    top: 80
                });
            }
        };
 
        
        loginView = Ti.UI.createView({
            height: 'auto',
            widht: 'auto',
            top: 150
        });
        
        logoText = Ti.UI.createLabel({
            text: "UCLA Course Manager",
            height: "auto",
            width: "auto",
            shadowColor: "#333",
            shadowOffset: {x: 1, y: 1},
            font: {
                fontSize: 25,
                fontStyle: 'italic',
                fontFamily: Ti.App.logoFont
            },
            textAlign: "center",
            color: 'white'
        });
        
        loginView.add(logoText);
        
        loggedInButton = createFacebookButton();
        
        loginView.add(loggedInButton);
        win.add(loginView);

        return win;
    }
    
})();
