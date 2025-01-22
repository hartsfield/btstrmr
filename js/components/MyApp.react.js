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

// Stores
var AudioStore = require('../stores/AudioStore.js');
var UIStore = require('../stores/UIStore.js');
var UserInfoStore = require('../stores/UserInfoStore.js');

// Actions
var AudioActions = require('../actions/AudioActions');

// Components
var List = require('./List.react');
var SideBar = require('./SideBar.react.js');
var GlobalPlayer = require('./GlobalPlayer.react.js');
var Signup = require('./Signup.react');

// MobileDetect is used to detect if the user is on mobile or not
var MobileDetect = require('mobile-detect');
var md = new MobileDetect(window.navigator.userAgent);
// Analyze the links hash to determine what page to open
var _order_hash = window.location.hash.slice(1, window.location.hash.length);
// spinDegree is used foor the record icon in the logo. Whenever a song is 
// playing the record rotates by 3 degree but starts at 0.
var spinDegree = 0;
var createReactClass = require('create-react-class');
// getDataForState is run whenever state data is needed or needs to be refreshed
function getDataForState() {
  return {
    // get the list of songs and song data
    myList: AudioStore.getList(_order_hash),
    // user credentials
    user: UserInfoStore.getUser(),
    currentTrack: AudioStore.getCurrentSong(),
    isLiked: AudioStore.getIsLiked(),
    currentOrder: AudioStore.getOrder(),
    mobile: md.mobile(),
    showNav: UIStore.getShowNav(),
  };
}

// MyApp is the entry point for most of our components.
var MyApp = createReactClass({

  getInitialState: function () {
    // Get state.
    var state = getDataForState();
    // This is set here because refreshing this data causes bugs.
    state.isPlaying = false;
    return state;
  },

  componentDidMount: function () {
    // Listen for changes and reload components.
    AudioStore.addChangeListener(this._onChange);
    UIStore.addChangeListener(this._onChange);
    UserInfoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    // Remove change listeners to prevent memory leaks.
    AudioStore.removeChangeListener(this._onChange);
    UIStore.removeChangeListener(this._onChange);
    UserInfoStore.removeChangeListener(this._onChange);
  },

  render: function () {
    // Once the list data is loaded, render the components.
    // if (this.state.myList !== undefined) {
    this.state.myList = []
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
          {/* Global audio stuff */}
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

  // _onProgress is triggered whenever the song progresses in the audio player.
  // It expands the progress div and rotates the record icon.
  _onProgress: function (e) {
    var prog = document.getElementById("progressbar");
    var perc = (e.target.currentTime/e.target.duration)*100;
    prog.style.width = perc + "%";

    spinDegree = spinDegree + 3;
    document.getElementById("spinny").style.transform = "rotate(" + spinDegree + "deg)"; 

  },

  // _onChange is used above in the event listeners to reload our state on
  // change.
  _onChange: function () {
    this.setState(getDataForState());
  },

  // _onPlay sets the play state.
  _onPlay: function () {
    this.setState({
      isPlaying: true,
    });
  },

  // _onPause sets the pause state, combining _onPlay and _onPause causes
  // bugs because of the multiple pause buttons on the page.
  _onPause: function () {
    this.setState({
      isPlaying: false,
    });
  },

  // _playNext is used to load the next song into the global audio player.
  _playNext: function () {
    var ga = document.getElementById("globalAudio");
    // Find the current track, then get the next element and extract track data.
    var next = document.getElementById(
               this.state.currentTrack._id).nextSibling.id;
    var result = $.grep(this.state.myList, function(e) {
                   return e._id == next;
                 });
    // If the user is logged in check if the song is liked.
    if (this.state.user.success === true) {
      AudioActions.setCurrentSong(
        result[0], this._checkIfLiked(result[0]._id)
      );
    } else {
      // Set the current song to the next song.
      AudioActions.setCurrentSong(result[0], false);
    };
    // Load and play the next song.
    ga.src = '../..' + result[0].Audio + '.mp3';
    ga.load();
    ga.play();
  },

  // _checkIfLiked is used when the user switches to the next song to check 
  // whether the user has liked it.
  _checkIfLiked: function (id) {
    // If the song ID is in the users liked array we return true, else false
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
