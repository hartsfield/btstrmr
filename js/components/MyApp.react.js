var React = require('react');
var List = require('./List.react');
var AudioStore = require('../stores/AudioStore.js');
var Signup = require('./Signup.react');
var SideBar = require('./SideBar.react.js');
var GlobalPlayer = require('./GlobalPlayer.react.js');
var Upload = require('./Upload.react.js');
var UserInfoStore = require('../stores/UserInfoStore.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');
var AudioActions = require('../actions/AudioActions');

function getDataForState() {
  return {
    myList: AudioStore.getList(),
    user: UserInfoStore.getUser(),
    currentTrack: AudioStore.getCurrentSong(),
    isLiked: AudioStore.getIsLiked(),
  };
}

var MyApp = React.createClass({

  getInitialState: function () {
    let state = getDataForState();
    state.isPlaying = false;
    return state;
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
          <GlobalPlayer
            myList={this.state.myList}
            user={this.state.user}
            isPlaying={this.state.isPlaying}
            currentTrack={this.state.currentTrack}
            isLiked={this.state.isLiked}
            _playNext={this._playNext}
          />
          <p>{this.state.user.success? "logged in" : "not logged in"}</p>
          <SideBar
            user={this.state.user}
          />
          <List
            myList={this.state.myList}
            user={this.state.user}
            isPlaying={this.state.isPlaying}
            isLikedStore={this.state.isLiked}
            currentTrack={this.state.currentTrack}
          />
          <Signup />
          <button onClick={this._userlogout}>logout</button>
          <audio
            controls
            id="globalAudio"
            onPlay={this._onPlay}
            onPause={this._onPause}
            onEnded={this._playNext}>
          </audio>
          <Upload />
        </div>
      );
    } else {
      return <div>hello</div>
    }
  },


  _onChange: function () {
    this.setState(getDataForState());
    console.log(this.state.myList);
  },

  _userlogout: function () {
    AuthActionCreators.logout();
  },

  _onPlay: function () {
   // console.log(AudioStore.getIsLiked(), "kigiugiugig");
    this.setState({
      isPlaying: true,
    //  isLiked: this.state.currentTrack.isLiked
    });
  },

  _onPause: function () {
    this.setState({
      isPlaying: false,
    });
  },
//wont work if no user
  _playNext: function () {
    let ga = document.getElementById("globalAudio");
    var next = document.getElementById(
                 this.state.currentTrack._id).nextSibling.id;
    var result = $.grep(this.state.myList, function(e) {
                   return e._id == next;
                 });
    AudioActions.setCurrentSong(result[0], this._checkIfLiked(result[0]._id));
    ga.src = '../..' + result[0].Audio + '.mp3';
    ga.load();
    ga.play();
  },

  _checkIfLiked: function (id) {
    let liked = this.state.user.user.liked;
    for (var i = 0, len = liked.length; i < len; i++) {
      if (liked[i] == id ) {
        console.log("true");
        return true;
      };
    };
    console.log("false");
    return false
  },

});

module.exports = MyApp;
