var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var AudioActions = {
  updateLikes: function(key) {
    AppDispatcher.dispatch({
      ActionType: 'update_likes',
      data: key,
    });
  },

  changeSort: function (order) {
    WebAPIUtils.getListData(order);
  },

  setCurrentSong: function (song, isLiked) {
    AppDispatcher.dispatch({
      ActionType: 'set_current_song',
      data: song,
      isLiked: isLiked,
    });
  },

}

module.exports = AudioActions;
