(function() {

  exports.AppTabGroup = function() {
    var arg, i, instance, tab, _len;
    instance = Ti.UI.createTabGroup();
    for (i = 0, _len = arguments.length; i < _len; i++) {
      arg = arguments[i];
      tab = Ti.UI.createTab(arg);
      if (i === 0) {
      	instance.currentTab = tab;
      }
      instance.addTab(tab);
    }
    instance.addEventListener('focus', function(e) {
      instance.currentTab = e.tab;
    });
    return instance;
  };

}).call(this);
