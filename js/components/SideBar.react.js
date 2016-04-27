var React = require('react');
var WebAPI = require('../utils/WebAPIUtils.js');
var UserInfoStore = require('../stores/UserInfoStore.js');
var AudioActions = require('../actions/AudioActions.js');

const SideBar = React.createClass({
  render: function () {
    return (
      <div>
         <button
           id="sortByDate"
           onClick={this._changeSort}>
           date
         </button>
         <button
           id="sortByLikes"
           onClick={this._changeSort}>
           likes
         </button>
         <button
           id="sortByMine"
           onClick={this._changeSort}>
           mine
         </button>
      </div>
    );
  },

  _changeSort: function (event) {
    var order = event.target.id;
    var user = UserInfoStore.getUser();
    AudioActions.changeSort(order, user.user);
  }
});

module.exports = SideBar;
