require('lib/require_patch').monkeypatch(this);
(function() {

	exports.DirectoryWindow = function(args) {
		var win,
            table = require('lib/tables'),
            quarter_year_table,
            data,
            db = require('model/db'),
            dbData;
		
		// retrieve data from database
		dbData = db.getTerms();
        quarter_year_table = new table.createPullToRefreshView(dbData, "images/whiteArrow.png", 'terms');
		
		//Create instance of the window
		win = Ti.UI.createWindow(args);
		//Add table view to the instance
		win.add(quarter_year_table);
		
		return win;
	};

})();
