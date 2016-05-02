var React = require('react');
var WebAPI = require('../utils/WebAPIUtils.js');
var Signup = require('./Signup.react');
var AudioActions = require('../actions/AudioActions.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');
const SideBar = React.createClass({

  render: function () {
    return (
      <ul className="sidebar">
      <Signup user={this.props.user}/>
          <p className="btlogo">BTSTRMR</p>
          <p className="glogo">GLOBAL</p>
        <li
          className="sidebar-img"
          id="sortByDate"
          onClick={this._changeSort}>
          FRESH
        </li>
        <li
          className="sidebar-img"
          id="sortByLikes"
          onClick={this._changeSort}>
          HOT
        </li>
        {this.props.user.success ?
        <li
          className="sidebar-img"
          id="sortByMine"
          onClick={this._changeSort}>
          FAVS
        </li>
        :
        <div></div>
        }
        <div id="rainbow">
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        <li className="rainbow" ></li>
        </div>
      </ul>
    );
  },

  _changeSort: function (event) {
    window.scrollTo(0, 0);
    var order = event.target.id;
    AudioActions.changeSort(order, this.props.user.user);
  },

});

module.exports = SideBar;
