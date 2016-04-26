var AppDispatcher = require('../dispatcher/AppDispatcher.js');

const WebAPIUtils = {
  getListData: function (order) {
    $.ajax({
      url: '/api/getListData',
      type: 'POST',
      dataType: 'json',
      data: {"order": order},
      success: function (data, textStatus, jqXHR) {
        AppDispatcher.dispatch({
          ActionType: 'new_list_data',
          data: data,
        });
      }
    });
  },

  updateLike: function (info) {
    $.post('/auth/likeTrack', info,
      function (data, textStatus, jqXHR) {
        AppDispatcher.dispatch({
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






