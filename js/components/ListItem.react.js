var React = require('react');
var AudioActions = require('../actions/AudioActions');
var AudioStore = require('../stores/AudioStore.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');

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
  /*
  componentDidMount: function () {
  },

  componentWillUnmount: function () {
  },
  */
  render: function () {
    var posted = timeSince(new Date(this.props.post.Posted));
    var isPlaying = this.props.isPlaying
                 && this.props.currentTrack._id
                === this.props.post._id
                  ? true
                  : false;

    if (this.props.mobile !== null) {
    var playpause = isPlaying
                  ? '../../assets/icons/black/pause.svg'
                  : '../../assets/icons/black/play.svg';

    var toggleFav = this.props.isLiked
                  ? '../../assets/icons/red/heart5.svg'
                  : '../../assets/icons/black/heart2.svg';

      return (
      <li id={this.props.post._id} className="post">
        <div className="mobile_singleplayer">
          <div 
            onClick={this._playOrPauseTrack} 
            className="mobile_aright">
              <img id="mobile_globalplaypause_image" src={playpause}></img>
          </div>
          <div className="singleinfo mobile_singleinfo">
            {this.props.post.Artist} - {this.props.post.Title}
          </div>
          <div 
            className="mobile_aleftpost" 
            onClick={this._updateLikes}>
              <img id="mobile_globalheart_image" src={toggleFav}></img>
              &nbsp;{this.props.post.Likes}
          </div>
        </div>
      </li>
      )
    } else {
    var playpause = isPlaying
                  ? '../../assets/icons/white/pause.svg'
                  : '../../assets/icons/white/play.svg';

    var toggleFav = this.props.isLiked
                  ? '../../assets/icons/white/heart5.svg'
                  : '../../assets/icons/white/heart2.svg';

    return (
      <li id={this.props.post._id} className="post">
        <div className="posteddate">Posted {posted} ago</div>
        <img className="postimg"
             onClick={this._playOrPauseTrack}
             src={this.props.post.Image}>
        </img>
        <div className="singleplayer globalplayer logobar">
          <div 
            onClick={this._playOrPauseTrack} 
            className="arrow-right arightsingle">
              <img id="globalplaypause_image" src={playpause}></img>
          </div>
          <div className="singleinfo">
            {this.props.post.Artist} - {this.props.post.Title}
          </div>
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



  _updateLikes: function () {
    if (this.props.user !== undefined){
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

  _playOrPauseTrack: function () {
    var ga = document.getElementById('globalAudio');
    if (this.props.currentTrack === null
     || this.props.currentTrack._id !== this.props.post._id) {
      var isLiked = this.props.isLiked;
      AudioActions.setCurrentSong(this.props.post, isLiked);
      ga.src= '../..' + this.props.post.Audio + '.mp3';
      ga.load();
      ga.play();
    } else if (this.props.currentTrack._id === this.props.post._id
     && this.props.isPlaying) {
      ga.pause();
    } else if (this.props.currentTrack._id === this.props.post._id
     && !this.props.isPlaying) {
      ga.play();
    };
  },

  /* _listenForTrack: function () {
    var audio = AudioStore.getCurrentSong();
    var isModified = this.props.currentTrack !== null
                  && audio._id
                 === this.props.post._id
                   ? true
                   : false;
    if (isModified) {
      this.setState({
        isLikedState: AudioStore.getIsLiked()
      });
    };
    },*/

});

module.exports = ListItem;
