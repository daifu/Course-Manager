(function() {

  exports.AppWindow = function(args) {
    var button, instance;
    instance = Ti.UI.createWindow(args);
    button = Ti.UI.createButton({
      height: 44,
      width: 200,
      title: 'Open new window on tab',
      top: 20
    });
    instance.add(button);
    button.addEventListener('click', function() {
      globals.tabs.currentTab.open(Ti.UI.createWindow({
        title: 'New Window',
        backgroundColor: 'white'
      }));
    });
    return instance;
  };

}).call(this);
