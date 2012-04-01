(function(){
    var database_path;
   
    //{title: "Spring 2012", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Spring 2012"}, js:"ui/SubDirectories/SubjectAreas.js"}
    exports.getCoursesTerm = function() {
        var query, dataArray = [], rows, rowData;
        // Connect to the database
        var db = Ti.Database.open('courses');
        query = "SELECT * FROM terms";
        rows = db.execute(query);

        while(rows.isValidRow()) {
            rowData = {
                title : rows.fieldByName('name'),
                dataToPass : {
                    "term" : rows.fieldByName('key')
                },
                js : "ui/SubDirectories/SubjectAreas.js",
                hasChild: true,
                searchFilter: rows.fieldByName('name')
            };
            dataArray.push(rowData);
            rows.next();
        }
        db.close();
        rows.close();
        return dataArray;
    };
    
    function createCourseTermTable (db) {
        var create_query = "CREATE TABLE IF NOT EXISTS terms (id integer, key TEXT, name TEXT, created_at TEXT)";
        db.execute(create_query);
    }
    
    // Update the terms
    exports.updateCoursesTerm = function(terms) {
        // Delete all the data from the database
        // Insert the new data to the database.
        var delete_query, insert_query;
        // Connect to the database
        var db = Ti.Database.open('courses');
        // Handle table if it is not exists;
        createCourseTermTable(db);
        delete_query = "DELETE FROM terms";
        db.execute(delete_query);
        insert_query = "INSERT INTO terms VALUES (?, ?, ?, ?)";
        for (var i=0; i < terms.length; i++) {
          db.execute(insert_query,
                     terms[i].key,
                     terms[i].name,
                     terms[i].created_at,
                     i + 1);
        }
        
        db.close();
    };
    
    exports.getSubjectAreas = function(term_key) {
        var query, dataArray = [], rows, rowData;
        //Open the database
        var db = Ti.Database.open('courses');
        query = "SELECT * FROM subject_areas WHERE term = ?";
        rows = db.execute(query, term_key);

        while(rows.isValidRow()) {
            rowData = {
                title : rows.fieldByName('name'),
                dataToPass : {
                    "term" : rows.fieldByName('term'),
                    "subject": rows.fieldByName('key')
                },
                js : "ui/SubDirectories/Subjects.js",
                hasChild: true,
                searchFilter: rows.fieldByName('name')
            };
            dataArray.push(rowData);
            rows.next();
        }
        db.close();
        rows.close();
        return dataArray;
    };

    function createSubjectAreasTable (db) {
        var create_query = ["CREATE TABLE IF NOT EXISTS",
                            "'subject_areas' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,",
                            "'key' TEXT NOT NULL,",
                            "'name' TEXT NOT NULL,",
                            "'term' TEXT NOT NULL, ",
                            "'created_at' TEXT NOT NULL)"].join(' ');
        db.execute(create_query);
    }
    
    exports.updateSubjectAreas = function(subject_areas) {
        var delete_query, insert_query, sa = subject_areas.subject_areas;
        // Connect to the database
        var db = Ti.Database.open('courses');
        createSubjectAreasTable(db);
        delete_query = "DELETE FROM subject_areas where term = ?";
        db.execute(delete_query, subject_areas.term);
        insert_query = "INSERT INTO subject_areas (key, name, term, created_at) VALUES (?, ?, ?, ?)";
        for (var i=0; i < sa.length; i++) {
          db.execute(insert_query,
                     sa[i].key,
                     sa[i].name,
                     subject_areas.term,
                     sa[i].created_at);
        }
        
        db.close();
    };

})();
