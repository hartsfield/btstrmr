var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var AudioActions = {

  // updateLikes adds or removes a like from a specific song and user profile
  // using the key object which looks like: 
  //   var key = {
  //     post: this.props.post._id, // post ID
  //     user: this.props.user      // user
  //   };
  updateLikes: function(key) {
    AppDispatcher.dispatch({
      ActionType: 'update_likes',
      data: key,
    });
  },

  changeSort: function (order, user) {
    WebAPIUtils.getListData(order, user);
  },

  getNextPage: function (order, page, user) {
    WebAPIUtils.getNextPage(order, page, user);
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
