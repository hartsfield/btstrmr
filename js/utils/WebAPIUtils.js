var AppDispatcher = require('../dispatcher/AppDispatcher.js');

const WebAPIUtils = {
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
        console.log(data);
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
          type: 'user_like',
          data: data,
        });
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






