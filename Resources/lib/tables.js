require('lib/require_patch').monkeypatch(this);
(function(){
    

    var createSettingsProfileImageView = function(image_url) {
        var imageView = Ti.UI.createImageView({
            image : image_url,
            borderRadius : 5,
            left : 5,
            top : 5,
            bottom : 5,
            height : 50,
            width : 50
        });
        return imageView;
    };


    var createSettingsProfileTextView = function(title) {
        var textView = Ti.UI.createView({
            height : 'auto',
            layout : 'vertical',
            left : 70,
            top : 10,
            bottom : 10,
            right : 10
        });

        var text = Ti.UI.createLabel({
            text : title,
            height : 'auto'
        });
        textView.add(text);

        return textView;
    };
    
    exports.createSettingsTableView = function(data) {
        var table, rowData = [];
        // Add data to rowView
        for (var i=0; i < data.length; i++) {
            var row = Ti.UI.createTableViewRow({
                height: 'auto',
                className: data[i].className
            });
            
            if (data[i].className === "settingsProfile") {
                row.add(createSettingsProfileTextView(data[i].title));
                row.add(createSettingsProfileImageView(data[i].leftImage));
            } else {
                Ti.API.info("createSettingsTableView: Not Implemented Yet.");
            }
            rowData.push(row);
        }
        table = Titanium.UI.createTableView({
            data: rowData,
            style:Titanium.UI.iPhone.TableViewStyle.GROUPED
        });
        
        return table;
    };
    
    
    var createDefaultTableView = function(data, tableType) {
        var table, rowData = [], filterBar;
        
        // filterBar to filter out the result on the table
        filterBar = Titanium.UI.createSearchBar({
            hintText: "Search for title"
        });
        

        // Add data to rowView
        for (var i=0; i < data.length; i++) {
            var row = Titanium.UI.createTableViewRow({
                title: data[i].title,
                className: data[i].className,
                hasChild: data[i].hasChild,
                searchFilter: data[i].title,
                dataToPass: data[i].dataToPass,
                js: data[i].js
            });
            if (data[i].header !== undefined) {
                row.header = data[i].header; 
            }
            rowData.push(row);
        }
        
        table = Titanium.UI.createTableView({
            data: rowData,
            search: filterBar,
            filterAttribute: "searchFilter"
        });
        
        // Handle row click event
        table.addEventListener('click', function(e){
            if (e.source.hasChild) {
                // Create window for the row
                var w = Titanium.UI.createWindow({
                    title: e.source.title,
                    backgroundColor: "white",
                    dataToPass: e.source.dataToPass,
                    url: e.source.js
                });

                if(tableType === "terms") {
                    globals.tabs.currentTab.open(w, {
                        animated : true
                    });
                } else {
                    Ti.UI.currentTab.open(w, {
                        animated : true
                    });
                }
            } else {
                alert("No window to open :(");
            }
        });
        
        return table;
    };
    

    var createHeaderFilterTableView = function(data, tableType) {
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                       'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                       'U', 'V', 'W', 'X', 'Y', 'Z'];
        var breaker = 0;
        var indexArray = [];
        for(var i = 0; i < letters.length; i++) {
            for(var j = 0; j < data.length; j++) {
                var res = data[j].title.toUpperCase().indexOf(letters[i]);
                if (res === 0) {
                    data[j].header = letters[i];
                    indexArray.push({title: letters[i], index: j});
                    breaker = j++;
                    break;
                }
            }
        }

        var FilterTableView = createDefaultTableView(data, tableType);
        FilterTableView.index = indexArray;
        
        return FilterTableView; 
    };

    
    function formatDate() {
        var date = new Date();
        var datestr = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
        if(date.getHours() >= 12) {
            datestr += ' ' + (date.getHours() === 12 ? date.getHours() : date.getHours() - 12) + ':' + date.getMinutes() + ' PM';
        } else {
            datestr += ' ' + date.getHours() + ':' + date.getMinutes() + ' AM';
        }
        return datestr;
    }

    exports.createPullToRefreshView = function(data, arrowImage, tableType) {
        var tableView;
        if (tableType === "subject_areas") {
            tableView = createHeaderFilterTableView(data, tableType);
        } else{
            tableView = createDefaultTableView(data, tableType);
        }
        var db = require('model/db');
        
        var border = Ti.UI.createView({
            backgroundColor : "#576c89",
            height : 2,
            bottom : 0
        });

        var tableHeader = Ti.UI.createView({
            backgroundColor : "#e2e7ed",
            width : 320,
            height : 60
        });

        // fake it til ya make it..  create a 2 pixel
        // bottom border
        tableHeader.add(border);

        var arrow = Ti.UI.createView({
            backgroundImage : arrowImage,
            width : 23,
            height : 60,
            bottom : 10,
            left : 20
        });

        var statusLabel = Ti.UI.createLabel({
            text : "Pull to reload",
            left : 55,
            width : 200,
            bottom : 30,
            height : "auto",
            color : "#576c89",
            textAlign : "center",
            font : {
                fontSize : 13,
                fontWeight : "bold"
            },
            shadowColor : "#999",
            shadowOffset : {
                x : 0,
                y : 1
            }
        });

        var lastUpdatedLabel = Ti.UI.createLabel({
            text : "Last Updated: " + formatDate(),
            left : 55,
            width : 200,
            bottom : 15,
            height : "auto",
            color : "#576c89",
            textAlign : "center",
            font : {
                fontSize : 12
            },
            shadowColor : "#999",
            shadowOffset : {
                x : 0,
                y : 1
            }
        });

        var actInd = Titanium.UI.createActivityIndicator({
            left : 20,
            bottom : 13,
            width : 30,
            height : 30
        });

        tableHeader.add(arrow);
        tableHeader.add(statusLabel);
        tableHeader.add(lastUpdatedLabel);
        tableHeader.add(actInd);

        tableView.headerPullView = tableHeader;

        var pulling = false;
        var reloading = false;

        function endReloading() {
            // when you're done, just reset
            tableView.setContentInsets({
                top : 0
            }, {
                animated : true
            });
            reloading = false;
            lastUpdatedLabel.text = "Last Updated: " + formatDate();
            statusLabel.text = "Pull down to refresh...";
            actInd.hide();
            arrow.show();
        }
        
        function callbackHandlerForSubjects(retData) {
            var new_subjects = db.updateAndGetSubjects(retData);
            // Get new subject data
            tableView.setData(new_subjects);
        }
        
        function callbackHandlerForSubjectAreas(retData) {
            var new_subjectAreas = db.updateAndGetSubjectAreas(retData);
            // Get new subject area data
            tableView.setData(new_subjectAreas);
        }
        
        function callbackHandlerForTerms(retData) {
            var new_terms = db.updateAndGetTerms(retData);
            tableView.setData(new_terms);
        }
        
        function handleReloading() {
            var httpReq = require('lib/http_requests'),
                term_key,
                subject_key;
            if(tableType === "terms") {
                Ti.API.info("uning inside the term handler");
                // just mock out the reload
                httpReq.httpGetTerms(callbackHandlerForTerms);
                
            } else if(tableType === "subject_areas") {
                // Runing inside the subject areas handler
                Ti.API.info("uning inside the subject areas handler");
                term_key = Ti.UI.currentWindow.dataToPass.term;
                // HTTP Get subject areas
                httpReq.httpGetSubjectAreas(callbackHandlerForSubjectAreas,
                                            term_key);
            } else if(tableType === "subjects") {
                term_key = Ti.UI.currentWindow.dataToPass.term;
                subject_key = Ti.UI.currentWindow.dataToPass.subject;
                // HTTP Get subjects data
                var done = httpReq.httpGetSubjects(callbackHandlerForSubjects,
                                                  term_key,
                                                  subject_key);
            } else if(tableType === "courses") {

            }
        }

        function beginReloading() {
            handleReloading();
            endReloading();
        }

        tableView.addEventListener('scroll', function(e) {
            var offset = e.contentOffset.y;
            if(offset <= -65.0 && !pulling) {
                var t1 = Ti.UI.create2DMatrix();
                t1 = t1.rotate(-180);
                pulling = true;
                arrow.animate({
                    transform : t1,
                    duration : 180
                });
                statusLabel.text = "Release to refresh...";
            } else if(pulling && offset > -65.0 && offset < 0) {
                pulling = false;
                var t2 = Ti.UI.create2DMatrix();
                arrow.animate({
                    transform : t2,
                    duration : 180
                });
                statusLabel.text = "Pull down to refresh...";
            }
        });

        tableView.addEventListener('scrollEnd', function(e) {
            if(pulling && !reloading && e.contentOffset.y <= -65.0) {
                reloading = true;
                pulling = false;
                arrow.hide();
                actInd.show();
                statusLabel.text = "Reloading...";
                tableView.setContentInsets({
                    top : 60
                }, {
                    animated : true
                });
                arrow.transform = Ti.UI.create2DMatrix();
                beginReloading();
            }
        });
        
        return tableView;
    };


})();
