var React = require('react');
var AudioActions = require('../actions/AudioActions');
var AudioStore = require('../stores/AudioStore.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');

// timeSince gets the time since the song was added to the database and
// properly formats the returned value (eg '6 months' ago)
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

var ListItem = React.createClass({
  render: function () {
    var posted = timeSince(new Date(this.props.post.Posted));
    // Check if the current item is playing or not
    var isPlaying = this.props.isPlaying
                 && this.props.currentTrack._id
                === this.props.post._id
                  ? true
                  : false;

    // For mobile devices
    if (this.props.mobile !== null) {
      // Set the play/pause icon state
      var playpause = isPlaying
                    ? '../../assets/icons/black/pause.svg'
                    : '../../assets/icons/black/play.svg';

      // check if the user has liked the song or not and set the icon state
      var toggleFav = this.props.isLiked
                    ? '../../assets/icons/red/heart5.svg'
                    : '../../assets/icons/black/heart2.svg';

      return (
      <li id={this.props.post._id} className="post">
        <div className="mobile_singleplayer">
          {/* list item play button */}
          <div 
            onClick={this._playOrPauseTrack} 
            className="mobile_aright">
              <img id="mobile_globalplaypause_image" src={playpause}></img>
          </div>
          {/* song info */}
          <div className="singleinfo mobile_singleinfo">
            {this.props.post.Artist} - {this.props.post.Title}
          </div>
          {/* like button */}
          <div 
            className="mobile_aleftpost" 
            onClick={this._updateLikes}>
              <img id="mobile_globalheart_image" src={toggleFav}></img>
              {/* number of likes */}
              &nbsp;{this.props.post.Likes}
          </div>
        </div>
      </li>
      )
    // For non-mobile devices
    } else {
      // Set the play/pause icon state
      var playpause = isPlaying
                    ? '../../assets/icons/white/pause.svg'
                    : '../../assets/icons/white/play.svg';

      // check if the user has liked the song or not and set the icon state
      var toggleFav = this.props.isLiked
                    ? '../../assets/icons/white/heart5.svg'
                    : '../../assets/icons/white/heart2.svg';

      return (
        <li id={this.props.post._id} className="post">
          {/* date song was posted */}
          <div className="posteddate">Posted {posted} ago</div>
          {/* image associated with song */}
          <img className="postimg"
               onClick={this._playOrPauseTrack}
               src={this.props.post.Image}>
          </img>
          <div className="singleplayer globalplayer logobar">
            {/* play button */}
            <div 
              onClick={this._playOrPauseTrack} 
              className="arrow-right arightsingle">
                <img id="globalplaypause_image" src={playpause}></img>
            </div>
            {/* song info */}
            <div className="singleinfo">
              {this.props.post.Artist} - {this.props.post.Title}
            </div>
            {/* like button */}
            <div 
              className="aleftpost" 
              onClick={this._updateLikes}>
                <img id="globalheart_image" src={toggleFav}></img>
                &nbsp;{this.props.post.Likes}
            </div>
          </div>
        </li>
      )
    };
  },

  // _updateLikes adds or removes a like from a specific song and user profile.
  // If no user is currently logged in, it prompts them with a login/signup form
  _updateLikes: function () {
    if (this.props.user !== undefined) {
      var info = {
        post: this.props.post._id,
        user: this.props.user
      };
      AudioActions.updateLikes(info);
      if (this.props.currentTrack !== null &&
        this.props.currentTrack._id === this.props.post._id) {
          var isLiked = !this.props.isLiked;
          AudioActions.setCurrentSong(null, isLiked);
      }
    } else {
      AuthActionCreators.showLoginForm(); 
    }
  },

  // _playOrPauseTrack toggles the play state of the song
  _playOrPauseTrack: function () {
    // Get the global audio player
    var ga = document.getElementById('globalAudio');
    // check if the current track is already loaded, if not; load it, 
    // if so and it's playing; pause it, if it's already paused; play it.
    if (this.props.currentTrack === null
     || this.props.currentTrack._id !== this.props.post._id) {
      // set the prop for whether the song is liked in the global player
      var isLiked = this.props.isLiked;
      // set the current song in props
      AudioActions.setCurrentSong(this.props.post, isLiked);
      // load the song into the player
      ga.src= '../..' + this.props.post.Audio + '.mp3';
      ga.load();
      // play the song
      ga.play();
    } else if (this.props.currentTrack._id === this.props.post._id
     && this.props.isPlaying) {
      ga.pause();
    } else if (this.props.currentTrack._id === this.props.post._id
     && !this.props.isPlaying) {
      ga.play();
    };
  },

});

module.exports = ListItem;
