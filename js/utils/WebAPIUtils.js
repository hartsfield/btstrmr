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

var WebAPIUtils = {
  getListData: function (order, user) {
    $.ajax({
      url: '/api/getListData',
      type: 'POST',
      dataType: 'json',
      data: {"order": order, "user": user},
      success: function (data, textStatus, jqXHR) {
        AppDispatcher.dispatch({
          ActionType: 'new_list_data',
          data: data,
          order: order,
        });
      }
    });
  },

  getNextPage: function (order, page, user) {
    $.post('/api/nextPage', {order:order, page:page, user:user},
           function (data, textStatus, jqXHR) {
             AppDispatcher.dispatch({
               ActionType: 'next_page',
               data: data,
             });
           }
          );
  },

  updateLike: function (info) {
    $.post('/auth/likeTrack', info,
           function (data, textStatus, jqXHR) {
             AppDispatcher.dispatch({
               //does this even do anything?
               Actiontype: 'user_like',
               data: data,
             });
             //   WebAPIUtils.getListData()
           }
          );
  },

  auth: function (credentials, type) {
    var path = '/api/' + type;
    $.post({
      url: path,
      processData: false,
      contentType: false,
      data: credentials,
      success: function (data, textStatus, jqXHR) {
        AppDispatcher.dispatch({
          ActionType: 'set_user',
          data: data,
        });
      }
    });
  },
};

module.exports = WebAPIUtils;






