var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AudioStore = require('../stores/AudioStore.js');

const WebAPIUtils = {
  getInitialData: function (order) {
    $.ajax({
      url: '/api/getInitialData',
      type: 'GET',
      dataType: 'json',
      data: {"hello":"world"},
      success: function (data, textStatus, jqXHR) {
        AppDispatcher.dispatch({
          ActionType: 'newList',
          data: data,
        });
      }
    });
  },

  updateLike: function (key) {
    $.post('/api/updateLikes', { key: key });
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






