var React = require('react');
var AudioActions = require('../actions/AudioActions.js');
var AudioStore = require('../stores/AudioStore.js');

const GlobalPlayer = React.createClass({

  render: function() {
    var playpause = this.props.isPlaying
                  ? '||'
                  : '►';

    var toggleFav = this.props.isLiked
                  ? '💖 '
                  : '💛 ';

    if (this.props.currentTrack === null) {
      return (
        <div 
          className="logobar">
            &nbsp;&lt;BTSTRMR&nbsp;&#47;&gt;
        </div>
     );
    } else {
      return (
        <div className="globalplayer logobar">
          <div 
            onClick={this._playOrPauseTrack} 
            className="arrow-right">
              {playpause}
          </div>
          <div 
            onClick={this.props._playNext} 
            className="arrow-right gnext">
              ≫
          </div>
          <div id="progresscontainer">
            <div id="progressbar"></div>
          </div>
          <div id="globalInfo">
            {this.props.currentTrack.Artist} - {this.props.currentTrack.Title}
          </div>
          <div 
            className="arrow-left" 
            onClick={this._toggleFav}>
              {toggleFav}
          </div>
        </div>
      );
    };
  },

  _playOrPauseTrack: function () {
    let ga = document.getElementById('globalAudio');
    if (this.props.isPlaying) {
      ga.pause();
    } else if (!this.props.isPlaying) {
      ga.play();
    };
  },

  _toggleFav: function () {
    let info = {
      post: this.props.currentTrack._id,
      user: this.props.user.user
    };
    AudioActions.updateLikes(info);
    let isLiked = !this.props.isLiked;
    AudioActions.setCurrentSong(null, isLiked);
  },

});

module.exports = GlobalPlayer;
