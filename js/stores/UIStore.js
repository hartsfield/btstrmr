var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

var _showNav = false;

var UIStore = assign({}, EventEmitter.prototype, {
  getShowNav: function () {
    return _showNav;
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

    case 'show_nav':
      _showNav = !_showNav;
      UIStore.emitChange();
      break;

    default: //
  }
});

module.exports = UIStore;
