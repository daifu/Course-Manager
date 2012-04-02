(function(){
    var database_path;
   
    //{title: "Spring 2012", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Spring 2012"}, js:"ui/SubDirectories/SubjectAreas.js"}
    exports.getTerms = function() {
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
    
    function createTermsTable(db) {
        // Write string in multiple lines
        var create_query = ["CREATE TABLE IF NOT EXISTS",
                            "'terms' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,",
                            "'key' TEXT NOT NULL,",
                            "'name' TEXT NOT NULL,",
                            "'created_at' TEXT NOT NULL)"].join(' ');
        db.execute(create_query);
    }
    
    // Update the terms
    exports.updateAndGetTerms = function(terms) {
        // Delete all the data from the database
        // Insert the new data to the database.
        var delete_query, insert_query, rowData, retData = [];
        // Connect to the database
        var db = Ti.Database.open('courses');
        // Handle table if it is not exists;
        createTermsTable(db);
        delete_query = "DELETE FROM terms";
        db.execute(delete_query);
        insert_query = "INSERT INTO terms VALUES (?, ?, ?, ?)";

        for(var i = 0; i < terms.length; i++) {
            db.execute(insert_query, terms[i].key, terms[i].name, terms[i].created_at, i + 1);
            rowData = {
                title : terms[i].name,
                dataToPass : {
                    "term" : terms[i].key
                },
                js : "ui/SubDirectories/SubjectAreas.js",
                hasChild : true,
                searchFilter : terms[i].name
            };
            retData.push(rowData);

        }
        
        db.close();
        return retData;
    };
    
    var addHeaderToData = function(data) {
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var breaker = 0;
        for(var i = 0; i < letters.length; i++) {
            for(var j = 0; j < data.length; j++) {
                var res = data[j].title.toUpperCase().indexOf(letters[i]);
                if(res === 0) {
                    data[j].header = letters[i];
                    breaker = j++;
                    break;
                }
            }
        }
        return data;
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
                js : "Subjects.js",
                hasChild: true,
                searchFilter: rows.fieldByName('name')
            };
            dataArray.push(rowData);
            rows.next();
        }
        dataArray = addHeaderToData(dataArray);
        db.close();
        rows.close();
        return dataArray;
    };
    
    function createSubjectAreasTable (db) {
        // Write string in multiple lines
        var create_query = ["CREATE TABLE IF NOT EXISTS",
                            "'subject_areas' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,",
                            "'key' TEXT NOT NULL,",
                            "'name' TEXT NOT NULL,",
                            "'term' TEXT NOT NULL, ",
                            "'created_at' TEXT NOT NULL)"].join(' ');
        db.execute(create_query);
    }
    
    exports.updateAndGetSubjectAreas = function(subject_areas) {
        var delete_query,
            insert_query,
            sa = subject_areas.subject_areas,
            rowData,
            retData = [];
        // Connect to the database
        var db = Ti.Database.open('courses');
        createSubjectAreasTable(db);
        delete_query = "DELETE FROM subject_areas where term = ?";
        db.execute(delete_query, subject_areas.term);
        insert_query = "INSERT INTO subject_areas (key, name, term, created_at) VALUES (?, ?, ?, ?)";


        for(var i = 0; i < sa.length; i++) {
            db.execute(insert_query, sa[i].key, sa[i].name, subject_areas.term, sa[i].created_at);
            rowData = {
                title : sa[i].name,
                dataToPass : {
                    "term" : subject_areas.term,
                    "subject" : sa[i].key
                },
                js : "Subjects.js",
                hasChild : true,
                searchFilter : sa[i].name
            };
            retData.push(rowData);

        }
        retData = addHeaderToData(retData);
        db.close();
        return retData;
    };

    exports.getSubjects = function(term_key, subject_key) {
        var query, dataArray = [], rows, rowData;
        //Open the database
        var db = Ti.Database.open('courses');
        query = "SELECT * FROM subjects WHERE term = ? AND subject = ?";
        rows = db.execute(query, term_key, subject_key);

        while(rows.isValidRow()) {
            rowData = {
                title : rows.fieldByName('name'),
                dataToPass : {
                    "term" : rows.fieldByName('term'),
                    "course_id": rows.fieldByName('key'),
                    "subject": rows.fieldByName('subject') 
                },
                js : "Courses.js",
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

    function createSubjectsTable (db) {
        // Write string in multiple lines
        var create_query = ["CREATE TABLE IF NOT EXISTS",
                            "'subjects' ('id' integer NOT NULL PRIMARY KEY AUTOINCREMENT,",
                            "'key' TEXT NOT NULL,",
                            "'name' TEXT NOT NULL,",
                            "'term' TEXT NOT NULL, ",
                            "'subject' TEXT NOT NULL,",
                            "'created_at' TEXT NOT NULL)"].join(' ');
        db.execute(create_query);
    }
    
    exports.updateAndGetSubjects = function(subjects) {
        var delete_query,
            insert_query,
            sc = subjects.classes,
            rowData,
            retData = [];
        // Connect to the database
        var db = Ti.Database.open('courses');
        createSubjectsTable(db);
        delete_query = "DELETE FROM subjects where term = ? AND subject = ?";
        db.execute(delete_query, subjects.term, subjects.subject);
        insert_query = "INSERT INTO subjects (key, name, term, subject, created_at) VALUES (?, ?, ?, ?, ?)";

        for(var i = 0; i < sc.length; i++) {
            db.execute(insert_query,
                       sc[i].key,
                       sc[i].name, 
                       subjects.term,
                       subjects.subject,
                       sc[i].created_at);
            rowData = {
                title : sc[i].name,
                dataToPass : {
                    "term" : subjects.term,
                    "course_id" : sc[i].key,
                    "subject" : sc[i].subject
                },
                js : "Courses.js",
                hasChild : true,
                searchFilter : sc[i].name
            };
            retData.push(rowData);
        }
        
        db.close();
        //return update data
        return retData;
    };


})();
