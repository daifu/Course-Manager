(function() {

	exports.SearchWindow = function(args) {
		var instance, form, fields, search_form, style;
		form = require('lib/forms');
		fields = [{
			title: 'Quarter + Year', type: 'picker', id: 'quarter_year', data:[
			'Spring 2012', 'Summer 2012', 'Winter 2012', 'Fall 2011'
			]
		}, {
			title: 'Course Title', type: 'text', id: 'course_title'
		}, {
			title: 'Search', type: 'submit', id: 'search_course'
		}];
	
		instance = Ti.UI.createWindow(args);
		style = {
			top: 10
		};
		search_form = form.createForm({
			style: form.STYLE_HINT,
			fields: fields
		}, style);

		search_form.addEventListener('search_course', function(e){
			// Add logic to searching
			Ti.API.info(e);
		});
		
		instance.add(search_form);
		
		return instance;
	};

})();