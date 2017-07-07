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
  location.reload();
}

var UserInfoStore = assign({}, EventEmitter.prototype, {
  getUser: function () {
    return user;
  },

  showLogin: function () {
    return _showLogin;
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

    case 'show_login':
      _showLogin = !_showLogin;
      UserInfoStore.emitChange();
      break;

    default: //
  }
});

module.exports = UserInfoStore;
