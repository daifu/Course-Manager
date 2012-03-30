(function(){

    exports.createDefaultTableView = function(data) {
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

})();
