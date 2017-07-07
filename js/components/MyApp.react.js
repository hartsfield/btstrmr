///////////////////////////////////////////////////////////////////////////////
//  Copyright (c) 2017 J. Hartsfield
                                                                               
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
                                                                               
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
                                                                               
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
///////////////////////////////////////////////////////////////////////////////

var React = require('react');

var AudioStore = require('../stores/AudioStore.js');
var UIStore = require('../stores/UIStore.js');
var UserInfoStore = require('../stores/UserInfoStore.js');

var AudioActions = require('../actions/AudioActions');

var List = require('./List.react');
var SideBar = require('./SideBar.react.js');
var GlobalPlayer = require('./GlobalPlayer.react.js');
var Signup = require('./Signup.react');

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
    var state = getDataForState();
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
            currentOrder={this.state.currentOrder}
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
          <Signup 
            user={this.state.user}
            mobile={this.state.mobile}
          />
        </div>
      );
    } else {
      return <div>LOADING....</div>
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
    var ga = document.getElementById("globalAudio");
    var next = document.getElementById(
                 this.state.currentTrack._id
               ).nextSibling.id;
    var result = $.grep(this.state.myList, function(e) {
                   return e._id == next;
                 });
    if (this.state.user.success === true) {
      AudioActions.setCurrentSong(
        result[0], this._checkIfLiked(result[0]._id)
      );
    } else {
      AudioActions.setCurrentSong(result[0], false);
    };
    ga.src = '../..' + result[0].Audio + '.mp3';
    ga.load();
    ga.play();
  },

  _checkIfLiked: function (id) {
    var liked = this.state.user.user.liked;
    for (var i = 0, len = liked.length; i < len; i++) {
      if (liked[i] === id ) {
        return true;
      };
    };
    return false
  },

});

module.exports = MyApp;
