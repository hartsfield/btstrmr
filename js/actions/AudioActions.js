var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var AudioActions = {
  updateLikes: function(key) {
   AppDispatcher.dispatch({
     ActionType: 'updateLikes',
     data: key,
   });
 },
}

module.exports = AudioActions;
