require('lib/require_patch').monkeypatch(this);
(function(){
    
    var views = {};
    
    exports.SettingsWindow = function(args) {

        /*globals Titanium, Ti, alert, JSON */
        var win, data, animateStyle,
            table = require('lib/tables');
        win = Ti.UI.createWindow(args);
        //
        // Login Button
        //
        var createFacebookButton = function() {
            Ti.API.info("Adding facebook button.");
            if(Titanium.Platform.name === 'iPhone OS') {
                return Titanium.Facebook.createLoginButton({
                    style : Ti.Facebook.BUTTON_STYLE_WIDE,
                    bottom : 30
                });
            } else {
                return Titanium.Facebook.createLoginButton({
                    style : 'wide',
                    bottom : 30
                });
            }
        };
        
        //
        // Create window for loggedIn
        //
        var createLoggedInView = function() {
            var view;
            view = Ti.UI.createView();

            // Open a new window.
            Ti.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
                if(e.success) {
                    var result = JSON.parse(e.result);
                    data = [{
                        title : result.name,
                        leftImage : "https://graph.facebook.com/" + result.username + "/picture",
                        className : 'settingsProfile',
                        top : 10
                    }];
                    view.add(new table.createSettingsTableView(data));
                } else {
                    Ti.API.info(e.error);
                }
            });
            
            return view;
        };

        
        //
        // Logout Button
        //
        var createFacebookLogoutButton = function() {
            var logoutButton = Ti.UI.createButton({
                width : 200,
                height : 30,
                top : 10,
                bottom : 10,
                title : "Logout"
            });

            var optionDialog = Ti.UI.createOptionDialog({
                title : "Do you want to logout?",
                options : ["Yup, log out.", "No, keep me logged In."],
                cancel : 1
            });

            logoutButton.addEventListener('click', function(e) {
                optionDialog.show();
            });

            optionDialog.addEventListener("click", function(e) {
                if(e.index === 0) {
                    Ti.Facebook.logout();
                } else if(e.index === 1) {
                    Ti.API.info("Great! You still logged In.");
                }
            });
            return logoutButton;
        };
        
        //
        // Create logged out window
        //
        var createLoggedOutView = function() {
            var view;
            view = Ti.UI.createView({
                backgroundColor: 'white'
            });

            // Open a new window.
            var loginButton = createFacebookButton();
            view.add(loginButton);
            return view;
        };

        //
        // Login Status
        // Handle loggedIn and loggedOut events
        //
        var updateLoginStatus = function() {
            var curWin;
            if (typeof(win) === undefined) {
                curWin = Ti.UI.currentWindow;
            } else{
                curWin = win;
            }
            //label.text = 'Logged In = ' + Titanium.Facebook.loggedIn;
            if (Ti.Facebook.loggedIn) {
                Ti.API.info("Facebook logged in.");

                views.loggedInView = createLoggedInView();
                // Added animation
                animateStyle = Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT;
                curWin.animate({
                    view : views.loggedInView,
                    transition : animateStyle
                });
                curWin.add(views.loggedInView);
                curWin.setRightNavButton(createFacebookLogoutButton());
                // Clear memory
                if (views.loggedOutView !== undefined && views.loggedOutView !== null) {
                    Ti.API.info("Removing loggedOut view.");
                    views.loggedOutView.close();
                    views.loggedOutView = null;
                }
            } else {
                Ti.API.info("Logging out.");

                views.loggedOutView = createLoggedOutView();
                // Remove the loggout button on the navRight
                // win.getRightNavButton.hide();
                // Added animation
                animateStyle = Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT;
                curWin.animate({
                    view : views.loggedOutView,
                    transition : animateStyle
                });
                curWin.add(views.loggedOutView);
                // Remove the logout button
                curWin.setRightNavButton(null);
                if (views.loggedInView !== undefined && views.loggedInView !== null) {
                    Ti.API.info("Removing loggedIn view.");
                    Ti.API.info(views.loggedInView);
                    views.loggedInView.close();
                    views.loggedInView = null;
                }
            }
        };
        
        //
        // Handle already loggedIn and loggedOut events
        // If user is loggedin then create a table view
        if (Ti.Facebook.loggedIn) {
            win.add(createLoggedInView());
            win.setRightNavButton(createFacebookLogoutButton());
        } else {
            win.add(createLoggedOutView(win));
        }

        return win;
    };
    
})();
