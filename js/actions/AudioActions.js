var AppDispatcher = require('../dispatcher/AppDispatcher.js');

var AudioActions = {
  updateLikes: function(key) {
   console.log(key);
   AppDispatcher.dispatch({
     ActionType: 'updateLikes',
     data: key,
   });
 },
}

module.exports = AudioActions;
