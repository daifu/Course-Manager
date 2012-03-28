(function(){
   
    // Working with the current window
    var instance, table = require('lib/tables'), courses_table, data;
    instance = Ti.UI.currentWindow;
    // TODO: changed to with real data
    data = [{
        title : "Aerospace Studies",
        className : "tableRow",
        hasChild : true,
        dataToPass : {
            "quarter_year" : "Spring 2012",
            "course" : "Aerospace Studies"
        },
        js : "ui/SubDirectories/Courses.js"
    }, {
        title : "Anthropology",
        className : "tableRow",
        hasChild : true,
        dataToPass : {
            "quarter_year" : "Summer 2012",
            "course" : "Anthropology"
        },
        js : "ui/SubDirectories/Courses.js"
    }, {
        title : "Art",
        className : "tableRow",
        hasChild : true,
        dataToPass : {
            "quarter_year" : "Winter 2012",
            "course" : "Art"
        },
        js : "ui/SubDirectories/Courses.js"
    }, {
        title : "Computer Science",
        className : "tableRow",
        hasChild : true,
        dataToPass : {
            "quarter_year" : "Fall 2011",
            "course" : "Computer Science"
        },
        js : "ui/SubDirectories/Courses.js"
    }];
    courses_table = table.createDefaultTableView(data);

    //Add table view to the instance
    instance.add(courses_table);
    
})();
