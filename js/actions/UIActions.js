var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var UIActions = {
  showNav: function() {
    AppDispatcher.dispatch({
      ActionType: 'show_nav',
    });
  },
}

module.exports = UIActions;
