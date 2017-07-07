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

  // 
  changeSort: function (order, user) {
    WebAPIUtils.getListData(order, user);
  },

  // getNextPage gets the next page. The order is specified by the current
  // sort order the user is navigated to (fresh, hot, etc), the page is used
  // so that the server can detect which songs to send back, and the user, if
  // any, so that the "favorited" tracks can be retrieved.
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
