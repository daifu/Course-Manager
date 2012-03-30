(function(){
    var database_path;
   
    //{title: "Spring 2012", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Spring 2012"}, js:"ui/SubDirectories/SubjectAreas.js"}
    exports.getCoursesTerm = function() {
        var query, dataArray = [], rows, rowData;
        // Connect to the database
        var db = Ti.Database.install('../ucla_courses.sqlite', 'term');
        query = "SELECT * FROM terms";
        rows = db.execute(query);

        while(rows.isValidRow()) {
            rowData = {
                title : rows.fieldByName('name'),
                dataToPass : {
                    "quarter_year" : rows.fieldByName('key')
                },
                js : "ui/SubDirectories/SubjectAreas.js",
                hasChild: true
            };
            dataArray.push(rowData);
            rows.next();
        }
        // db.close();
        rows.close();
        return dataArray;
    };
        
})();
