var globals;

require('lib/require_patch').monkeypatch(this);

globals = {};

(function() {
  var AppTabGroup, AppWindow;
  AppTabGroup = require('ui/AppTabGroup');
  AppWindow = require('ui/AppWindow');
  globals.tabs = new AppTabGroup({
    title: 'Search',
    icon: 'images/Search_24.png',
    window: new AppWindow({
      title: 'Search',
      backgroundColor: 'white'
    })
  }, {
    title: 'Directory',
    icon: 'images/list_24.png',
    window: new AppWindow({
      title: 'Directory',
      backgroundColor: 'white'
    })
  }, {
    title: 'Starred',
    icon: 'images/star_24.png',
    window: new AppWindow({
      title: 'Starred',
      backgroundColor: 'white'
    })
  }, {
    title: 'Settings',
    icon: 'images/settings_24.png',
    window: new AppWindow({
      title: 'Settings',
      backgroundColor: 'white'
    })
  });
  return globals.tabs.open();
})();
