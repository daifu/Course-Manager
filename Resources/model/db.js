(function(){
    var database_path;

    //{title: "Spring 2012", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Spring 2012"}, js:"ui/SubDirectories/SubjectAreas.js"}
    exports.getTerms = function() {
        var query, dataArray = [], rows, rowData;
        // Connect to the database
        var db = Ti.Database.open('courses');
        if (!tableExists(db, 'terms')) {
            createTermsTable(db);
        }
        query = "SELECT * FROM terms";
        rows = db.execute(query);

        while(rows.isValidRow()) {
            rowData = {
                title : rows.fieldByName('name'),
                dataToPass : {
                    "term" : rows.fieldByName('term')
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
                            "'term' TEXT NOT NULL,",
                            "'name' TEXT NOT NULL,",
                            "'created_at' TEXT NOT NULL)"].join(' ');
        db.execute(create_query);
    }

    // Update the terms
    // passed terms sample
    // [{"key":"13S","name":"Tentative Spring 2013","created_at":"2012-09-01T02:14:43.432Z"}...]
    exports.updateAndGetTerms = function(terms) {
        // Delete all the data from the database
        // Insert the new data to the database.
        var delete_query, insert_query, rowData, retData = [];
        // Connect to the database
        var db = Ti.Database.open('courses');
        if (!tableExists(db, 'terms')) {
            // Handle table if it is not exists;
            createTermsTable(db);
        }
        delete_query = "DELETE FROM terms";
        db.execute(delete_query);
        insert_query = "INSERT INTO terms (term, name, created_at) VALUES (?, ?, ?)";
        for(var i = 0; i < terms.length; i++) {
            row = db.execute(insert_query, terms[i].key, terms[i].name, terms[i].created_at);
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
        if (!tableExists(db, 'subject_areas')) {
            createSubjectAreasTable(db);
        }
        query = "SELECT * FROM subject_areas WHERE term = ?";
        rows = db.execute(query, term_key);

        while(rows.isValidRow()) {
            rowData = {
                title : rows.fieldByName('name'),
                dataToPass : {
                    "term" : rows.fieldByName('term'),
                    "subject": rows.fieldByName('subject')
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
                            "'subject' TEXT NOT NULL,",
                            "'name' TEXT NOT NULL,",
                            "'term' TEXT NOT NULL, ",
                            "'created_at' TEXT NOT NULL)"].join(' ');
        db.execute(create_query);
    }

    // passed subject_areas sample:
    // {"term":"12F", "subject_areas":[{"key":"AERO+ET",name:"Aerospace Studies","created_at":"..."....}]}
    exports.updateAndGetSubjectAreas = function(subject_areas) {
        var delete_query,
            insert_query,
            sa = subject_areas.subject_areas,
            rowData,
            retData = [],
            row;
        // Connect to the database
        var db = Ti.Database.open('courses');
        createSubjectAreasTable(db);
        Ti.API.info("updateAndGetSubjectAreas...");
        // Ti.API.info(subject_areas);
        delete_query = "DELETE FROM subject_areas where term = ?";
        db.execute(delete_query, subject_areas.term);
        insert_query = "INSERT INTO subject_areas (subject, name, term, created_at) VALUES (?, ?, ?, ?)";


        for(var i = 0; i < sa.length; i++) {
            row = db.execute(insert_query, sa[i].key, sa[i].name, subject_areas.term, sa[i].created_at);
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
        if (!tableExists(db, 'subjects')) {
            createSubjectsTable(db);
        }
        query = "SELECT * FROM subjects WHERE term = ? AND subject = ?";
        rows = db.execute(query, term_key, subject_key);

        while(rows.isValidRow()) {
            rowData = {
                title : rows.fieldByName('name'),
                dataToPass : {
                    "term" : rows.fieldByName('term'),
                    "subject": rows.fieldByName('subject'),
                    "course_id": rows.fieldByName('course_id')
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
                            "'course_id' TEXT NOT NULL,",
                            "'name' TEXT NOT NULL,",
                            "'term' TEXT NOT NULL,",
                            "'subject' TEXT NOT NULL,",
                            "'created_at' TEXT NOT NULL)"].join(' ');
        db.execute(create_query);
    }

    // passed subjects sample:
    // {"term":"12F", "subject":"AP+LANG", "classes":[{"key":"0001A+++",name:"AF ... Swahili","created_at":"..."....}]}
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
        insert_query = "INSERT INTO subjects (course_id, name, term, subject, created_at) VALUES (?, ?, ?, ?, ?)";

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
                    "course_id" : sc[i].key,
                    "term" : subjects.term,
                    "subject" : subjects.subject
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



    exports.getCourse = function(term_key, subject_key, course_id) {
        // TODO: figure out how to manipulate the data.
        Ti.API.info("getCourse() Not implemented. Pass in: term_key: " + term_key + " subject_key: " + subject_key + " course_id: " + course_id);
        return [];
    };

    // passed course sample:
    // Check this link to see the sample:
    // http://uclacourse.herokuapp.com/api/course/12F/BIOL+CH/0254A+++
    exports.updateAndGetCourse = function(course) {
        Ti.API.info("updateAndGetCourse Not implemented.");
        return[];
    };

    function tableExists( dbObj, table) {
        var rs;
        if ( ! dbObj ) {
            return false;
        }
        try {
            rs = dbObj.execute("SELECT count(*) FROM sqlite_master WHERE type = 'table' and name = '" + table + "'");
        }
        catch(e2) {
            return false;
        }
        if ( (! rs) || (! rs.isValidRow()) || ( rs.field(0) === 0 ) ) {
            return false;
        }

        return true;
    }

    function dropTable(dbObj, table) {
        var rs;
        if (!dbObj) {
            return false;
        }
        try {
            Ti.API.info("drop table if exists "+table+"");
            rs = dbObj.execute("drop table if exists "+ table +"");
            if (!tableExists(dbObj, 'terms')) {
                return true;
            } else {
                return false;
            }
        } catch(e2) {
            return false;
        }
        if (!rs) {
            return false;
        }
    }
})();
