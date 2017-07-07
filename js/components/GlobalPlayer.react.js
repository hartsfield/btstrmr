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
var AudioActions = require('../actions/AudioActions.js');
var UIActions = require('../actions/UIActions.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');

// GlobalPlayer is the player at the top of the page that can be seen anywhere
// on the site and is used to control the state of the audio
var GlobalPlayer = React.createClass({
  render: function() {
    // Check if the global player is playing and set the icon appropriately
    var playpause = this.props.isPlaying
                  ? '../../assets/icons/white/pause.svg'
                  : '../../assets/icons/white/play.svg';

    // For mobile devices
    if (this.props.mobile !== null) {
      // Set the favorite/unfavorite icon state
      var toggleFav = this.props.isLiked
                  ? '../../assets/icons/red/heart5.svg'
                  : '../../assets/icons/white/heart2.svg';

      return (
      <div>
        {/* If there is no track playing, just show the header */}
        {this.props.currentTrack === null ?
        <div id="mobile_header">
          {/* This button shows the navigation menu on mobile */}
          <div id="showNav" onClick={this._showNav}>
            <img id="showNav_image" src="../../assets/icons/white/list.svg"></img>
          </div>
          <div id="mobile_logo">BTSTRMR</div>
        </div>
        
        /* If there is a track playing, show the player */
        :
        
        <div id="mobile_header">

          {/* This button shows the navigation menu on mobile */}
          <div id="showNav" onClick={this._showNav}>
            <img id="showNav_image" src="../../assets/icons/white/list.svg"></img>
          </div>
         
          {/* Play/pause button */}
          <div onClick={this._playOrPauseTrack} className="mobile_play">
            <img id="mobile_play_image" src={playpause}></img>
          </div>
        
          {/* Track information */}
          <div id="mobile_globalInfo">
            {this.props.currentTrack.Artist} - 
            {this.props.currentTrack.Title}
          </div>
           
          {/* Favorite/unfavorite button */}
          <div className="mobile_globalheart" onClick={this._toggleFav}>
              <img id="mobile_globalheart_image-a" src={toggleFav}></img>
          </div>
        </div>
        }
      </div>
      );
    // For non-mobile devices
    } else {
      // Set the favorited/not-favorited icon state
      var toggleFav = this.props.isLiked
                    ? '../../assets/icons/white/heart5.svg'
                    : '../../assets/icons/white/heart2.svg';

      // If there is no track playing, just show the header
      if (this.props.currentTrack === null) {
        return (
          <div className="globalplayer logobar">
            <div className="arrow-right gnext0 arlogo">B</div>
            <div className="arrow-right gnext1 arlogo">T</div>
            <div className="arrow-right gnext2 arlogo">S</div>
            <div className="arrow-right gnext3 arlogo">T</div>
            <div className="arrow-right gnext4 arlogo">R</div>
            <div className="arrow-right gnext5 arlogo">M</div>
            <div className="arrow-right gnext6 arlogo">R</div>
          </div>
       );
      // If there is a song playing, show the global player
      } else {
        return (
          <div className="globalplayer logobar">

            {/* Play/pause button */}
            <div onClick={this._playOrPauseTrack} className="arrow-right">
              <img id="globalplaypause_image" src={playpause}></img>
            </div>
            
            {/* Play the next track in the list */}
            <div onClick={this.props._playNext} className="arrow-right gnext">
              <img id="globalnext_image" src={'../../assets/icons/white/playback-fast-forward.svg'}></img>
            </div>
            
            {/* Progress bar */}
            <div id="progresscontainer">
              <div id="progressbar"></div>
            </div>
            
            {/* Track information */}
            <div id="globalInfo">
              {this.props.currentTrack.Artist} - 
              {this.props.currentTrack.Title}
            </div>
            
            {/* Favorite/unfavorite button */}
            <div className="arrow-left" onClick={this._toggleFav}>
              <img id="globalheart_image" src={toggleFav}></img>
            </div>

          </div>
        );
      };  
    };
  },

  // _playOrPauseTrack checks if the song is playing, if so; it pauses the 
  // track, else it resumes it.
  _playOrPauseTrack: function () {
    var ga = document.getElementById('globalAudio');
    if (this.props.isPlaying) {
      ga.pause();
    } else if (!this.props.isPlaying) {
      ga.play();
    };
  },

  // _showNav shows the navigation menu on mobile.
  _showNav: function () {
    UIActions.showNav();
  },

  // _toggleFav checks if the user is logged in, if so; it toggles the like
  // button, else, it prompts the user to login/signup.
  _toggleFav: function () {
    if ( this.props.user.success ) {
      var info = {
        post: this.props.currentTrack._id,
        user: this.props.user.user
      };
      AudioActions.updateLikes(info);
      var isLiked = !this.props.isLiked;
      AudioActions.setCurrentSong(null, isLiked);
    } else {
      AuthActionCreators.showLoginForm(); 
    }
  },

});

module.exports = GlobalPlayer;
