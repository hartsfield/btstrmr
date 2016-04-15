var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var AuthActionCreators = {
  signup: function(credentials) {
    AppDispatcher.dispatch({
      ActionType: 'user_signup',
      data: credentials,
    });
  },
}

module.exports = AuthActionCreators;
