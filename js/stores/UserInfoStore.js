var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var WebAPIUtils = require('../utils/WebAPIUtils.js');
var CHANGE_EVENT = 'change';

var user = {success: false};

function signup(credentials) {
  WebAPIUtils.signup(credentials)
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

    default: //
  }
});

module.exports = UserInfoStore;
