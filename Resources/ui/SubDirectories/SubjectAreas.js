// Create a table view for all the subject areas
(function(){
    
    // Working with the current window
    var win;
    win = Titanium.UI.currentWindow;
    var label = Titanium.UI.createLabel({
        text:win.dataToPass,//This text is loaded from variables passed into the window through the dataToPass property
        width:"auto",
        height:"auto",
        textAlign:"center"
    });

    win.add(label);

})();
