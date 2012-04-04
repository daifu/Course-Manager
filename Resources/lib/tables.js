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
    
    ////////////////////////////////////////////////////////////
    ///////
    ///////  Below is for the table view of Directory
    ///////
   
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
        } else if (tableType === "course") {
            // Pass if thiere is course view
            Ti.API.info("Running into createPullToRefreshView... ");
            tableView = Ti.UI.createTableView({
                backgroundColor: "white",
                data: data
            });
        } else {
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
        
        function callbackHandlerForCourse(retData) {
            var new_course = db.updateAndGetCourse(retData);
            tableView.setData(new_course);
        }
        
        function handleReloading() {
            var httpReq = require('lib/http_requests'),
                term_key,
                subject_key,
                course_id;
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
                httpReq.httpGetSubjects(callbackHandlerForSubjects,
                                                  term_key,
                                                  subject_key);
            } else if(tableType === "course") {
                term_key = Ti.UI.currentWindow.dataToPass.term;
                subject_key = Ti.UI.currentWindow.dataToPass.subject;
                course_id = Ti.UI.currentWindow.dataToPass.course_id;
                //HTTP Get courses data
                httpReq.httpGetCourse(callbackHandlerForCourse,
                                      term_key,
                                      subject_key,
                                      course_id);
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


    var createCourseView = function(data, arrowImage, tableType) {
        // Requirement
        // One Scroll view as a background
        // Several group table views for the details and sections
        var mainView = Ti.UI.createView({
           width: '100%',
           height: '100%',
           backgroundColor: '#536895'
        });
        var view1 = Ti.UI.createView({
            backgroundColor : '#536895'
        });
        
        // create a table
        var detailsTableRow1 = Ti.UI.createTableViewRow({
            header: 'Details 1',
            touchEnabled: false
        });
        var detailsTableRow2 = Ti.UI.createTableViewRow({
            touchEnabled: false
        });
        var l1 = Ti.UI.createLabel({
            text : 'View 1',
            color : 'black',
            width : 'auto',
            height : 'auto',
            touchEnabled: false
        });
        var l11 = Ti.UI.createLabel({
            text : 'View 11',
            color : 'black',
            width : 'auto',
            height : 'auto',
            touchEnabled: false
        });
        detailsTableRow1.add(l1);
        detailsTableRow2.add(l11);
        
        var detailsTableRow3 = Ti.UI.createTableViewRow({
            header: 'Details 2'
        });
        var detailsTableRow4 = Ti.UI.createTableViewRow();
        var ll1 = Ti.UI.createLabel({
            text : 'View 1',
            color : 'black',
            width : 'auto',
            height : 'auto'
        });
        var ll11 = Ti.UI.createLabel({
            text : 'View l111',
            color : 'black',
            width : 'auto',
            height : 'auto'
        });
        detailsTableRow3.add(ll11);
        detailsTableRow4.add(ll1);
        
        //TODO: using the dynaimic crated data
        var tmpdata = [detailsTableRow1, detailsTableRow2, detailsTableRow3, detailsTableRow4];
        var detailsTable = exports.createPullToRefreshView(tmpdata, arrowImage, tableType);
        Ti.API.info(detailsTable);
        view1.add(detailsTable);


        var view2 = Ti.UI.createView({
            backgroundColor : '#536895'
        });
        var l2 = Ti.UI.createLabel({
            text : 'Click Me (View 2 - see log)',
            color : 'white',
            width : 'auto',
            height : 'auto'
        });
        view2.add(l2);

        var view3 = Ti.UI.createView({
            backgroundColor : '#536895'
        });
        var l3 = Ti.UI.createLabel({
            text : 'View 3',
            color : 'white',
            width : 'auto',
            height : 'auto'
        });
        view3.add(l3);

        var scrollView = Titanium.UI.createScrollableView({
            views : [view1, view2, view3],
            pagingControlHeight : 30,
            maxZoomScale : 2.0,
            currentPage : 0,
            top: 32
        });
        var i = 1;
        var activeView = view1;

        var tabbar = Ti.UI.createTabbedBar({
            labels: ['Details', 'Sections', 'Prof. Reviews'],
            backgroundColor: '#336699',
            top: 2,
            height: 28,
            width: 270,
            style: Ti.UI.iPhone.SystemButtonStyle.BAR,
            index: 0
        });

        scrollView.addEventListener('scroll', function(e) {
            activeView = e.view;
            // the object handle to the view that is about to become visible
            i = e.currentPage;
            if (i !== undefined) {
                tabbar.setIndex(i);
                Titanium.API.info("scroll called - current index " + i + ' active view ' + activeView);
            }
        });
        
        tabbar.addEventListener('click', function(e){
           // active index
           var currentIndex = e.index;
           // change the view when user click on the tabedbar
           scrollView.setCurrentPage(currentIndex);
        });
        
        scrollView.addEventListener('click', function(e) {
            Ti.API.info('ScrollView received click event, source = ' + e.source);
        });
        scrollView.addEventListener('touchend', function(e) {
            Ti.API.info('ScrollView received touchend event, source = ' + e.source);
        });
        

        
        mainView.add(scrollView);
        mainView.add(tabbar);
        return mainView;
    };


    exports.createCourseView = function(data, arrowImage, tableType) {
        // Create a main view
        Ti.API.info("running into createCourseView....");
        var tableView = createCourseView(data, arrowImage, tableType);
        return tableView;
    };

})();
