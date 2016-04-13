var React = require('react');
var List = require('./List.react');
var AudioStore = require('../stores/AudioStore');
var Signup = require('./Signup.react');
var UserInfoStore = require('../stores/UserInfoStore.js');

function getDataForState() {
  return {
    myList: AudioStore.getList() 
  };
}

var MyApp = React.createClass({
  
  getInitialState: function () {
    return getDataForState();
  },

  componentDidMount: function () {
    AudioStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AudioStore.removeChangeListener(this._onChange);
  },

  render: function () {
    if (this.state.myList !== undefined) {
      return (
        <div>
          <List myList={this.state.myList}/> 
          <Signup />
        </div>
      );
    } else {
      return <div>hello</div>
    }
  },

  _onChange: function () {
    this.setState(getDataForState());
  }

});

module.exports = MyApp;
