// Create a table view for all the subject areas
(function(){
    
    // Working with the current window
    var instance,
        table = require('lib/tables'),
        subjects_table,
        data;

    instance = Ti.UI.currentWindow;
    // TODO: changed to with real data
    data = [{title: "Aerospace Studies Course", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Spring 2012", "course": "Aerospace Studies"}, js:"Courses.js"},
            {title: "Anthropology Course", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Summer 2012", "course": "Anthropology"}, js:"Courses.js"},
            {title: "Art Course", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Winter 2012", "course": "Art"}, js:"Courses.js"},
            {title: "Computer Science Course", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Fall 2011", "course": "Computer Science"}, js:"Courses.js"}];

    subjects_table = table.createPullToRefreshView(data, "../../images/whiteArrow.png", "subjects");

    //Add table view to the instance
    instance.add(subjects_table);

})();
