var AppDispatcher = require('../dispatcher/AppDispatcher.js');

// UIActions are actions for changing the UI. Currently only used for mobile
var UIActions = {
  // showNav toggles the navigation menu for mobile users.
  showNav: function() {
    AppDispatcher.dispatch({
      ActionType: 'show_nav',
    });
  },
}

module.exports = UIActions;
