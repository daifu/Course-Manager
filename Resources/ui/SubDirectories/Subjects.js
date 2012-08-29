require('lib/require_patch').monkeypatch(this);
// Create a table view for all the subject areas
(function(){
    
    // Working with the current window
    var instance,
        table = require('lib/tables'),
        subjects_table,
        dbData,
        db = require('model/db'),
        httpReq = require('lib/http_requests'),
        term = Ti.UI.currentWindow.dataToPass.term,
        subject = Ti.UI.currentWindow.dataToPass.subject;

    instance = Ti.UI.currentWindow;
    dbData = db.getSubjects(term, subject);
    

    var callback = function(retData) {
        var dbData = db.updateAndGetSubjects(retData);
        subjects_table = new table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "subjects");

        //Add table view to the instance
        Ti.UI.currentWindow.add(subjects_table);
    };
    
    dbData = db.getSubjects(term, subject);

    if(dbData.length === 0) {
        httpReq.httpGetSubjects(callback, term, subject);
    } else {
        subjects_table = new table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "subjects");

        //Add table view to the instance
        Ti.UI.currentWindow.add(subjects_table);
    }
    
})();
