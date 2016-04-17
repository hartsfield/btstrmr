var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var AuthActionCreators = {
  signup: function(credentials) {
    AppDispatcher.dispatch({
      ActionType: 'user_signup',
      data: credentials,
    });
  },
  login: function (credentials) {
    AppDispatcher.dispatch({
      ActionType: 'user_login',
      data: credentials,
    });
  },
  logout: function () {
    AppDispatcher.dispatch({
      ActionType: 'user_logout',
    });
  },
}

module.exports = AuthActionCreators;
