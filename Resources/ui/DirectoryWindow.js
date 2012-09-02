require('lib/require_patch').monkeypatch(this);
// Directory path:
// Terms > SubjectAreas > Subjects > Courses

(function() {

	exports.DirectoryWindow = function(args) {
		var win = Ti.UI.createWindow(args),
			table = require('lib/tables'),
			quarter_year_table,
			data,
			db = require('model/db'),
			httpReq = require('lib/http_requests'),
			dbData;

		// HTTP request callback
		var callback = function (retData) {
			var dbData = db.updateAndGetTerms(retData);
			quarter_year_table = new table.createPullToRefreshView(dbData, "../../images/whiteArrow.png", "terms");

			//Add table view to the instance
			win.add(quarter_year_table);
			return win;
		};

		// retrieve data from database
		dbData = db.getTerms();
		Ti.API.info(dbData);
		if (dbData.length === 0) {
			httpReq.httpGetTerms(callback);
		} else{
			quarter_year_table = new table.createPullToRefreshView(dbData, "images/whiteArrow.png", 'terms');

			//Add table view to the instance
			win.add(quarter_year_table);
			return win;
		}
	};

})();
