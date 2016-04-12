var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var _audio = WebAPIUtils.getInitialData();

function getAudioContent(order) {
  return _audio;
}

function updateLike(key) {
  _audio[key].liked = !_audio[key].liked;
  WebAPIUtils.updateLike(key);
}

var AudioStore = assign({}, EventEmitter.prototype, {
  getList: function () {
      return _audio;
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

    case 'updateLikes':
      updateLike(action.data);
      AudioStore.emitChange();
      break;

    case 'newList':
      _audio = action.data;
      AudioStore.emitChange();
      break;

    default: //
  }
});

module.exports = AudioStore;
