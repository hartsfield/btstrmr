///////////////////////////////////////////////////////////////////////////////
//  Copyright (c) 2017 J. Hartsfield
                                                                               
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
                                                                               
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
                                                                               
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
///////////////////////////////////////////////////////////////////////////////

var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var WebAPIUtils = require('../utils/WebAPIUtils.js');
var CHANGE_EVENT = 'change';
var _showLogin = false;

// Check if the current user is logged in.
var user = WebAPIUtils.auth({}, 'checktoken');

// Send the signup event to the server, along with our credentials (see 
// WebAPIUtils.js).
function signup(credentials) {
  WebAPIUtils.auth(credentials, 'signup');
}

// Send the login event to the server, along with our credentials (see 
// WebAPIUtils.js).
function login(credentials) {
  WebAPIUtils.auth(credentials, 'login');
}

// setuser sets the current users information and gives them a token.
function setuser(credentials) {
  if (credentials.success === true) {
    localStorage.setItem('token', credentials.token);
    $.ajaxSetup({
      headers: {'x-access-token': credentials.token}
    });
  };
  user = credentials;
}

// logout logs the user out and replace their token with dummy text.
function logout() {
  localStorage.setItem('token', 'meatball');
  document.cookie = "auth='meatball'";
  $.ajaxSetup({
    headers: {'x-access-token': 'meatball'}
  });
  user = {success: false};
  location.reload();
}

// UserInfoStore is the store for user state data.
var UserInfoStore = assign({}, EventEmitter.prototype, {
  // Returns the current user, if any
  getUser: function () {
    return user;
  },

  // Toggles the visibility state of the login/signup forms.
  showLogin: function () {
    return _showLogin;
  },

  // Called on change.
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  // In js/components/MyApp.react.js we can define a function to call on change
  // events with UserInfoStore.addChangeListener(cb)
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  // In js/components/MyApp.react.js we can remove a function we once called on
  // change events with UserInfoStore.addChangeListener(cb) using 
  // UserInfoStore.removeChangeListener(cb)
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

});

// Register actions and emit changes.
AppDispatcher.register(function(action) {
  switch (action.ActionType) {
    // This action is performed on user signup.
    case 'user_signup':
      signup(action.data);
      UserInfoStore.emitChange();
      break;

    // This action is performed on user login.
    case 'user_login':
      login(action.data);
      UserInfoStore.emitChange();
      break;

    // This action is performed when a user logs in or out.
    case 'set_user':
      setuser(action.data);
      UserInfoStore.emitChange();
      break;

    // This action is performed when a user logs out.
    case 'user_logout':
      logout();
      UserInfoStore.emitChange();
      break;

    // This action is performed when the visibility state of the login/signup 
    // forms is toggled.
    case 'show_login':
      _showLogin = !_showLogin;
      UserInfoStore.emitChange();
      break;

    default: //
  }
});

module.exports = UserInfoStore;
