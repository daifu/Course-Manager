// Create a table view for all the subject areas
(function(){
    
    // Working with the current window
    var table = require('lib/tables'),
        subject_area_table,
        db = require('model/db'),
        dbData,
        term = Ti.UI.currentWindow.dataToPass.term;
   
    // Ti.API.info("Subject Areas");
    // Ti.API.info(term);
    dbData = db.getSubjectAreas(term);
    // Ti.API.info(JSON.stringify(dbData));
    // TODO: if the dbData is empty, do the update on the table.
    subject_area_table = new table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "subject_areas");

    //Add table view to the instance
    Ti.UI.currentWindow.add(subject_area_table);
    
})();
