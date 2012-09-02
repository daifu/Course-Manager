
require('lib/require_patch').monkeypatch(this);
(function(){

    // Working with the current window
    var instance,
        table = require('lib/tables'),
        course_table,
        dbData,
        db = require('model/db'),
        httpReq = require('lib/http_requests'),
        term = Ti.UI.currentWindow.dataToPass.term,
        subject = Ti.UI.currentWindow.dataToPass.subject,
        course_id = Ti.UI.currentWindow.dataToPass.course_id;

    instance = Ti.UI.currentWindow;
    instance.setBackgroundColor = "#536895";

    var callback = function(retData) {
        var dbData = db.updateAndGetCourse(retData);
        course_table = new table.createCourseView(dbData, "../../images/whiteArrow.png", "course");

        //Add table view to the instance
        Ti.UI.currentWindow.add(course_table);
    };

    Ti.API.info("Course UI");
    Ti.API.info(subject);
    Ti.API.info(course_id);
    dbData = db.getCourse(term, subject, course_id);

    if(dbData.length === 0) {
        httpReq.httpGetCourse(callback, term, subject, course_id);
    } else {
        course_table = new table.createCourseView(dbData, "../../images/whiteArrow.png", "course");
        //Add table view to the instance
        Ti.UI.currentWindow.add(course_table);
    }


})();
