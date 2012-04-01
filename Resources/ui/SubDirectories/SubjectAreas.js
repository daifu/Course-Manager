// Create a table view for all the subject areas
(function(){
    
    // Working with the current window
    var table = require('lib/tables'),
        subject_area_table,
        db = require('model/db'),
        dbData;
   
    dbData = db.getSubjectAreas(Ti.UI.currentWindow.dataToPass.term);
    subject_area_table = new table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "subject_areas");

    //Add table view to the instance
    Ti.UI.currentWindow.add(subject_area_table);
    
})();
