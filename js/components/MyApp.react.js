var React = require('react');
var List = require('./List.react');
var AudioStore = require('../stores/AudioStore.js');
var Signup = require('./Signup.react');
var SideBar = require('./SideBar.react.js');
var Upload = require('./Upload.react.js');
var UserInfoStore = require('../stores/UserInfoStore.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');

function getDataForState() {
  return {
    myList: AudioStore.getList(),
    user: UserInfoStore.getUser(),
  };
}

var MyApp = React.createClass({

  getInitialState: function () {
    return getDataForState();
  },

  componentDidMount: function () {
    AudioStore.addChangeListener(this._onChange);
    UserInfoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AudioStore.removeChangeListener(this._onChange);
    UserInfoStore.removeChangeListener(this._onChange);
  },

  render: function () {
    if (this.state.myList !== undefined) {
      return (
        <div>
          <p>{this.state.user.success? "logged in" : "not logged in"}</p>
          <SideBar />
          <List
            myList={this.state.myList}
            user={this.state.user}
          />
          <Signup />
          <button onClick={this._userlogout}>logout</button>
          <Upload />
        </div>
      );
    } else {
      return <div>hello</div>
    }
  },

  _onChange: function () {
    this.setState(getDataForState());
  },

  _userlogout: function () {
    AuthActionCreators.logout();
  },

});

module.exports = MyApp;
