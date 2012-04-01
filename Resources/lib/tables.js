(function(){

    var createDefaultTableView = function(data) {
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
                // TODO: fixed this without using try catch.
                try {
                    globals.tabs.currentTab.open(w, {
                        animated : true
                    });
                } catch(err) {
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
        var me = this;
        var tableView = createDefaultTableView(data);
        
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
        
        function handleReloading() {
            var httpReq = require('lib/http_requests'), db = require('model/db');
            if(tableType === "terms") {
                Ti.API.info("uning inside the term handler");
                // just mock out the reload
                httpReq.httpGetTerms(db.updateCoursesTerm);
                //Get New data
                var new_terms = db.getCoursesTerm();
                // Update the view
                tableView.setData(new_terms);
            } else if(tableType === "subject_areas") {
                // Runing inside the subject areas handler
                Ti.API.info("uning inside the subject areas handler");
                var term_key = Ti.UI.currentWindow.dataToPass.term;
                // HTTP Get subject areas
                httpReq.httpGetSubjectAreas(db.updateSubjectAreas, term_key);
                //Get New data
                var new_subject_areas = db.getSubjectAreas(term_key);
                // Update the view
                tableView.setData(new_subject_areas);
            } else if(tableType === "subjects") {

            } else if(tableType === "courses") {

            }
            
            tableView.setFilterAttribute('searchFilter');
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
