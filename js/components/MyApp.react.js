var React = require('react');
var List = require('./List.react');
var AudioStore = require('../stores/AudioStore.js');
var SideBar = require('./SideBar.react.js');
var GlobalPlayer = require('./GlobalPlayer.react.js');
var Upload = require('./Upload.react.js');
var UserInfoStore = require('../stores/UserInfoStore.js');
var UIStore = require('../stores/UIStore.js');
var AudioActions = require('../actions/AudioActions');
var MobileDetect = require('mobile-detect');
var md = new MobileDetect(window.navigator.userAgent);
var _order_hash = window.location.hash.slice(1, window.location.hash.length);
var a = 0;

function getDataForState() {
  return {
    myList: AudioStore.getList(_order_hash),
    user: UserInfoStore.getUser(),
    currentTrack: AudioStore.getCurrentSong(),
    isLiked: AudioStore.getIsLiked(),
    currentOrder: AudioStore.getOrder(),
    mobile: md.mobile(),
    showNav: UIStore.getShowNav(),
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
    UIStore.addChangeListener(this._onChange);
    UserInfoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AudioStore.removeChangeListener(this._onChange);
    UIStore.removeChangeListener(this._onChange);
    UserInfoStore.removeChangeListener(this._onChange);
  },

  render: function () {
    if (this.state.myList !== undefined) {
      return (
      <div>
        <div id="main-container">
          <SideBar
            user={this.state.user}
            mobile={this.state.mobile}
            showNav={this.state.showNav}
          />
          <div className="mainpane">
          <GlobalPlayer
            myList={this.state.myList}
            user={this.state.user}
            isPlaying={this.state.isPlaying}
            currentTrack={this.state.currentTrack}
            isLiked={this.state.isLiked}
            _playNext={this._playNext}
            mobile={this.state.mobile}
          />
         <audio
            id="globalAudio"
            onPlay={this._onPlay}
            onPause={this._onPause}
            onTimeUpdate={this._onProgress}
            onEnded={this._playNext}>
          </audio>
          </div>
        </div>
          <List
            className="list"
            myList={this.state.myList}
            user={this.state.user}
            isPlaying={this.state.isPlaying}
            currentTrack={this.state.currentTrack}
            currentOrder={this.state.currentOrder}
            mobile={this.state.mobile}
          />
        </div>
      );
    } else {
      return <div>hello</div>
    }
  },

  _onProgress: function (e) {
    var prog = document.getElementById("progressbar");
    var perc = (e.target.currentTime/e.target.duration)*100;
    prog.style.width = perc + "%";

     a = a + 3;
     document.getElementById("spinny").style.transform = "rotate(" + a + "deg)"; 

  },

  _onChange: function () {
    this.setState(getDataForState());
  },

  _onPlay: function () {
    this.setState({
      isPlaying: true,
    });
  },

  _onPause: function () {
    this.setState({
      isPlaying: false,
    });
  },

  _playNext: function () {
    let ga = document.getElementById("globalAudio");
    var next = document.getElementById(
                 this.state.currentTrack._id).nextSibling.id;
    var result = $.grep(this.state.myList, function(e) {
                   return e._id == next;
                 });
    if (this.state.user.success === true) {
    AudioActions.setCurrentSong(result[0], this._checkIfLiked(result[0]._id));
    } else {
    AudioActions.setCurrentSong(result[0], false);
    };
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
