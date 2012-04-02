// Create a table view for all the subject areas
(function(){
    
    // Working with the current window
    var instance,
        table = require('lib/tables'),
        subjects_table,
        dbData,
        db = require('model/db'),
        term = Ti.UI.currentWindow.dataToPass.term,
        subject = Ti.UI.currentWindow.dataToPass.subject;

    instance = Ti.UI.currentWindow;
    dbData = db.getSubjects(term, subject);
    // Ti.API.info(JSON.stringify(dbData));
    subjects_table = table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "subjects");

    //Add table view to the instance
    instance.add(subjects_table);

})();
