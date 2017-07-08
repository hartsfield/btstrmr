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

var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var WebAPIUtils = require('../utils/WebAPIUtils.js');
var UserInfoStore = require('../stores/UserInfoStore.js');

// Determine the order based on the window location. If the window location is
// invalid, default to "fresh". Use this information to request the appropriate
// song data.
var _order_hash = window.location.hash.slice(1, window.location.hash.length);
if (_order_hash !== 'fresh' && _order_hash !== 'hot' && _order_hash !== 'favs') {
  var _audio = WebAPIUtils.getListData("fresh");
} else {
  var _audio = WebAPIUtils.getListData(_order_hash);
}

// _user is the current logged in user. Defaults to false, but will be 
// auto updated.
var _user = {success: false};
// _currentSong is the current song. Defaults to null, but will be auto updated when
// a user plays a song.
var _currentSong = null;
var _isCurrentSongLiked = false;
// _currentOrder is the current order in string format.
var _currentOrder = 'sortByDate'

// This function updates the UI when a user "likes" or "unlikes" a song.
function updateLike(info) {
  var index = findSong(info.post);
  // Send update to the server.
  WebAPIUtils.updateLike(info);
  // Update the UI
  if (_audio[index]) {
    _user = UserInfoStore.getUser();
    // If the user has already liked the song, unlike it and decrement the 
    // number of likes.
    if (_audio[index].isLiked === true) {
      _audio[index].isLiked = false;
      _audio[index].Likes -= 1;
      var idex = _user.user.liked.indexOf(info.post);
      _user.user.liked.splice(idex, 1);
    } else {
      // Else if the user has not liked the song yet, like it, and increment
      // the number of likes.
      _audio[index].isLiked = true;
      _audio[index].Likes += 1;
      _user.user.liked.push(info.post);
    };
  } else {
    if (_user.user.liked.indexOf(info.post)) {
      _user.user.liked.push(info.post);
    } else {
      _user.user.liked.splice(idex, 1);
    }
  }
}

// findsong finds a matching song in the _audio array based on ID.
function findSong(id) {
  for (var i = 0, len = _audio.length; i < len; i++) {
    if (_audio[i]._id === id) {
      return i;  
    } 
  };
}

// setCurrentSong sets the current song and it's liked status globally so that
// this info can be provided to components.
function setCurrentSong(song, isLiked) {
  if (song === null) {
    _isCurrentSongLiked = isLiked;
  } else {
    _currentSong = song;
    _isCurrentSongLiked = isLiked;
  };
}

// checkIfLiked is used to mark which songs have been liked by the user.
function checkIfLiked(audioList) {
  // Get user.
  _user = UserInfoStore.getUser();
  // If we have a user and they have liked songs, mark them
  if (_user.success === true && _user.user.liked.length >= 1) {
    var liked = _user.user.liked;
    for (var key in audioList) {
      for (var i = 0, len = liked.length; i < len; i++) {
        if (liked[i] === audioList[key]._id ) {
          audioList[key].isLiked = true;
          break;
        } else {
          continue;
        }
      }; 
    };
    _audio = audioList;
  };
    _audio = audioList;
}

// AudioStore is the store for song/audio state data.
var AudioStore = assign({}, EventEmitter.prototype, {
  // Returns the list of audio data.
  getList: function () {
    return _audio;
  },

  // Returns the current song loaded into the global player.
  getCurrentSong: function () {
    return _currentSong;
  },

  // Returns the current order of tracks ("fresh", "hot", etc).
  getOrder: function () {
    return _currentOrder;
  },

  // Returns whether or not the current song is liked by the current user.
  getIsLiked: function () {
    return _isCurrentSongLiked;
  },

  // Called on change.
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  // In js/components/MyApp.react.js we can define a function to call on change
  // events with AudioStore.addChangeListener(cb)
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },
 
  // In js/components/MyApp.react.js we can remove a function we once called on
  // change events with AudioStore.addChangeListener(cb) using 
  // AudioStore.removeChangeListener(cb)
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

// Register actions and emit changes.
AppDispatcher.register(function(action) {
  switch (action.ActionType) {

    // When a song is liked or unliked, this action is performed.
    case 'update_likes':
      updateLike(action.data);
      AudioStore.emitChange();
      break;
    
    // This action is performed when a user logs in. It's in the UIStore
    // because this info is used to determine whether or not to mark a song as
    // liked.
    case 'user_login':
      checkIfLiked(AudioStore.getList());
      break;

    // This action is performed when more data is loaded into the list or the 
    // view changes.
    case 'new_list_data':
      checkIfLiked(action.data);
      _currentOrder = action.order;
      AudioStore.emitChange();
      break;

    // This action is performed when the current song changes.
    case 'set_current_song':
      setCurrentSong(action.data, action.isLiked);
      AudioStore.emitChange();
      break;

    // This action is performed when the next page of data is loaded.
    case 'next_page':
      _audio = _audio.concat(action.data);
      checkIfLiked(_audio);
      AudioStore.emitChange();
      break;

    default: //
  }
});

module.exports = AudioStore;
