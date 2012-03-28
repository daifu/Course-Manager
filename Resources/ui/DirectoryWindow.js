(function() {

	exports.DirectoryWindow = function(args) {
		var instance,
            table = require('lib/tables'),
            quarter_year_table,
            data;
		
		// TODO: changed to with real data
		data = [{title: "Spring 2012", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Spring 2012"}, js:"ui/SubDirectories/SubjectAreas.js"},
				{title: "Summer 2012", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Summer 2012"}, js:"ui/SubDirectories/SubjectAreas.js"},
				{title: "Winter 2012", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Winter 2012"}, js:"ui/SubDirectories/SubjectAreas.js"},
				{title: "Fall 2011", className: "tableRow", hasChild:true, dataToPass:{"quarter_year":"Fall 2011"}, js:"ui/SubDirectories/SubjectAreas.js"}];
		
        quarter_year_table = table.createDefaultTableView(data);
		
		//Create instance of the window
		instance = Ti.UI.createWindow(args);
		//Add table view to the instance
		instance.add(quarter_year_table);
		
		
		return instance;
	};

})();
