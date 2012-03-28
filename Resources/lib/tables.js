(function(){
    
    exports.createDefaultTableView = function(data) {
        var table, rowData = [], filterBar;
 
        // filterBar to filter out the result on the table
        filterBar = Titanium.UI.createSearchBar({
            showCancel: true,
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
                globals.tabs.currentTab.open(w, {animated: true});
            } else {
                alert("No window to open :(");
            }
        });
        
        return table;
    };

})();
