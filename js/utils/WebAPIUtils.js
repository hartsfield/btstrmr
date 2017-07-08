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

// WebAPIUtils are our AJAX calls and dispatch flux processes on success.
var WebAPIUtils = {
  // getListData gets the first page of tracks/track info.
  // order is the order in which to get the songs (newest, most favorited, etc).
  // We also send back the user so the API can retreive their "liked" songs.
  getListData: function (order, user) {
    $.ajax({
      url: '/api/getListData',
      type: 'POST',
      dataType: 'json',
      data: {"order": order, "user": user},
      success: function (data, textStatus, jqXHR) {
        // Flux dispatch. AudioStore.js.
        AppDispatcher.dispatch({
          ActionType: 'new_list_data',
          data: data,
          order: order,
        });
      }
    });
  },

  // getNextPage gets the next page of track/track info.
  // order is the order in which to get the songs (newest, most favorited, etc).
  // page indicates to the server the number of songs we already have loaded so
  // that it can programatically determine the page. We also send back the user 
  // so the API can retreive their "liked" songs.
  getNextPage: function (order, page, user) {
    $.post('/api/nextPage', {order:order, page:page, user:user},
      function (data, textStatus, jqXHR) {
        // Flux dispatch. AudioStore.js.
        AppDispatcher.dispatch({
          ActionType: 'next_page',
          data: data,
        });
      }
    );
  },

  // updateLike updates the likes associated with a particular track and updates
  // the users liked tracks.
  // info is an object of the form:
  //  var info = {
  //    post: this.props.post._id,
  //    user: this.props.user
  //  };
  updateLike: function (info) {
    $.post('/auth/likeTrack', info/*,
      function (data, textStatus, jqXHR) {
        // Flux dispatch. AudioStore.js.
        AppDispatcher.dispatch({
          Actiontype: 'user_like',
          data: data,
        });
        //   WebAPIUtils.getListData()
      } */
    );
  },

  // auth is used for logging in and signing up. It takes credentials and sends 
  // them to the server in an attempt to signup a new user. The credentials are 
  // created using the FormData() constructor like so:
  //   var data = new FormData();
  //   data.append('password', this.state.Password);
  //   data.append('username', this.state.User);
  //   return data;
  //
  //   type indicates whether the user is intending to signin or signup.
  auth: function (credentials, type) {
    var path = '/api/' + type;
    $.post({
      url: path,
      processData: false,
      contentType: false,
      data: credentials,
      success: function (data, textStatus, jqXHR) {
        // Flux dispatch. UserInfoStore.js.
        AppDispatcher.dispatch({
          ActionType: 'set_user',
          data: data,
        });
      }
    });
  },
};

module.exports = WebAPIUtils;
