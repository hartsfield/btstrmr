var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var _audio = WebAPIUtils.getListData('date');
var _currentSong = null;
var _isCurrentSongLiked = false;
/*
function getAudioContent(order) {
  _audio = WebAPIUtils.getInitialData(order)
  return _audio;
}*/

function updateLike(info) {
  WebAPIUtils.updateLike(info);
}

function setCurrentSong(song, isLiked) {
  if (song === null) {
    _isCurrentSongLiked = isLiked;
  } else {
    _currentSong = song;
    _isCurrentSongLiked = isLiked;
  };
}

var AudioStore = assign({}, EventEmitter.prototype, {
  getList: function () {
    return _audio;
  },

  getCurrentSong: function () {
    return _currentSong;
  },

  getIsLiked: function () {
    return _isCurrentSongLiked;
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

    case 'update_likes':
      updateLike(action.data);
      AudioStore.emitChange();
      break;

    case 'new_list_data':
      _audio = action.data;
      AudioStore.emitChange();
      break;

    case 'set_current_song':
      setCurrentSong(action.data, action.isLiked);
      AudioStore.emitChange();
      break;


    default: //
  }
});

module.exports = AudioStore;
