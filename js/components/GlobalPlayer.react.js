var React = require('react');
var AudioActions = require('../actions/AudioActions.js');
var AudioStore = require('../stores/AudioStore.js');

const GlobalPlayer = React.createClass({

  render: function() {
    let playpause = this.props.isPlaying
                  ? "pause"
                  : "play";

    let toggleFav = this.props.isLiked
                  ? "unfav"
                  : "fav";

    if (this.props.currentTrack === null) {
      return (<div>BTSTRMR</div>);
    } else {
      return (
        <div>
          <button onClick={this._playOrPauseTrack}>{playpause}</button>
          <button onClick={this.props._playNext}>next</button>
          <button onClick={this._toggleFav}>{toggleFav}</button>
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
