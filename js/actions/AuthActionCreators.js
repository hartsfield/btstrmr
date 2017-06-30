var AppDispatcher = require('../dispatcher/AppDispatcher.js');

// AuthActionCreators are action related to authorization
var AuthActionCreators = {

  // signup takes credentials and sends them to the server in an attempt to
  // signup a new user. The credentials are created using the FormData()
  // constructor like so:
  //   var data = new FormData();
  //   data.append('password', this.state.Password);
  //   data.append('username', this.state.User);
  //   return data;
  signup: function(credentials) {
    AppDispatcher.dispatch({
      ActionType: 'user_signup',
      data: credentials,
    });
  },

  // login is done the same as signup, but will access a different api path on
  // the server.
  login: function (credentials) {
    AppDispatcher.dispatch({
      ActionType: 'user_login',
      data: credentials,
    });
  },
  
  // logout action initializes a logout
  logout: function () {
    AppDispatcher.dispatch({
      ActionType: 'user_logout',
    });
  },

  // showLoginForm action shows the login form 
  showLoginForm: function () {
    AppDispatcher.dispatch({
      ActionType: 'show_login',
    });
  },
}

module.exports = AuthActionCreators;
