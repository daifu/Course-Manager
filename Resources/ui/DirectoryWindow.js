(function() {

	exports.DirectoryWindow = function(args) {
		var win,
            table = require('lib/tables'),
            quarter_year_table,
            data,
            db = require('model/db'),
            dbData;
		
		// Test the db
		dbData = db.getCoursesTerm();
		
		// TODO: changed to with real data
		// data = [{title: "Spring 2012", className: "tableRow", hasChild:true, dataToPass:{"term":"Spring 2012"}, js:"ui/SubDirectories/SubjectAreas.js"},
				// {title: "Summer 2012", className: "tableRow", hasChild:true, dataToPass:{"term":"Summer 2012"}, js:"ui/SubDirectories/SubjectAreas.js"},
				// {title: "Winter 2012", className: "tableRow", hasChild:true, dataToPass:{"term":"Winter 2012"}, js:"ui/SubDirectories/SubjectAreas.js"},
				// {title: "Fall 2011", className: "tableRow", hasChild:true, dataToPass:{"term":"Fall 2011"}, js:"ui/SubDirectories/SubjectAreas.js"}];
        
        quarter_year_table = new table.createPullToRefreshView(dbData, "images/whiteArrow.png", 'terms');
		
		//Create instance of the window
		win = Ti.UI.createWindow(args);
		//Add table view to the instance
		win.add(quarter_year_table);
		
		return win;
	};

})();
