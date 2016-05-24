var React = require('react');
var WebAPI = require('../utils/WebAPIUtils.js');
var Signup = require('./Signup.react');
var AudioActions = require('../actions/AudioActions.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');
var UIActions = require('../actions/UIActions.js');

var SideBar = React.createClass({

  render: function () {
    if (this.props.mobile === null) {
    return (
      <ul className="sidebar">
      <Signup user={this.props.user} mobile={this.props.mobile}/>
          <p className="btlogo">BTSTRMR</p>
          <p className="glogo">GLOBAL</p>
        <li
          className="sidebar-img"
          id="fresh"
          onClick={this._changeSort}>
          FRESH
        </li>
        <li
          className="sidebar-img"
          id="hot"
          onClick={this._changeSort}>
          HOT
        </li>
        {this.props.user.success ?
        <li
          className="sidebar-img"
          id="favs"
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
    } else {
      if (this.props.showNav) {
        return (
          <div id="mobile_nav">
      <Signup user={this.props.user} mobile={this.props.mobile}/>
     <ul className="mobile_sidebar" id="mobile_nav-1">
        <li
          className="mobile_li_first mobile_sidebar-img"
          id="fresh"
          onClick={this._changeSort}>
          FRESH
        </li>
        <li
          className="mobile_sidebar-img"
          id="hot"
          onClick={this._changeSort}>
          HOT
        </li>
        {this.props.user.success ?
        <li
          className="mobile_sidebar-img"
          id="favs"
          onClick={this._changeSort}>
          FAVS
        </li>
        :
        <div></div>
        }
        </ul>
          </div>
        );
      } else {
        return (
          <div></div>      
        );
      };
    };
  },

  _changeSort: function (event) {
    window.location.hash =  event.target.innerHTML.toLowerCase();
    window.scrollTo(0, 0);
    var order = event.target.id;
    UIActions.showNav();
    AudioActions.changeSort(order, this.props.user.user);
  },

});

module.exports = SideBar;
