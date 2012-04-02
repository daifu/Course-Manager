require('lib/require_patch').monkeypatch(this);

// Create a table view for all the subject areas
(function(){
   
    // Working with the current window
    var table = require('lib/tables'),
        subject_area_table,
        db = require('model/db'),
        httpReq = require('lib/http_requests'),
        dbData,
        term = Ti.UI.currentWindow.dataToPass.term;
        
    var callback = function (retData) {
        var dbData = db.updateAndGetSubjectAreas(retData);
        subject_area_table = new table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "subject_areas");

        //Add table view to the instance
        Ti.UI.currentWindow.add(subject_area_table);
    };
   
    dbData = db.getSubjectAreas(term);
    
    if (dbData.length === 0) {
        httpReq.httpGetSubjectAreas(callback, term);
    } else {
        subject_area_table = new table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "subject_areas");

        //Add table view to the instance
        Ti.UI.currentWindow.add(subject_area_table);

    }
    
    
})();
