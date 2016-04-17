var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var WebAPIUtils = require('../utils/WebAPIUtils.js');
var CHANGE_EVENT = 'change';

//var user = {success: false};
var user = WebAPIUtils.auth({}, 'checktoken');

function signup(credentials) {
  WebAPIUtils.auth(credentials, 'signup');
}

function login(credentials) {
  WebAPIUtils.auth(credentials, 'login');
}

function setuser(credentials) {
  if (credentials.success === true) {
    localStorage.setItem('token', credentials.token);
    $.ajaxSetup({
      headers: {'x-access-token': credentials.token}
    });
  };
  user = credentials;
}

function logout() {
  localStorage.setItem('token', 'meatball');
  document.cookie = "auth='meatball'";
  $.ajaxSetup({
    headers: {'x-access-token': 'meatball'}
  });
  user = {success: false};
}

var UserInfoStore = assign({}, EventEmitter.prototype, {
  getUser: function () {
    return user;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

});

AppDispatcher.register(function(action) {
  switch (action.ActionType) {
    case 'user_signup':
      signup(action.data);
      UserInfoStore.emitChange();
      break;

    case 'user_login':
      login(action.data);
      UserInfoStore.emitChange();
      break;

    case 'set_user':
      setuser(action.data);
      UserInfoStore.emitChange();
      break;

    case 'user_logout':
      logout();
      UserInfoStore.emitChange();
      break;

    default: //
  }
});

module.exports = UserInfoStore;
