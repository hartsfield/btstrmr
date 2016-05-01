var React = require('react');
var AudioActions = require('../actions/AudioActions');
var AudioStore = require('../stores/AudioStore.js');

var ListItem = React.createClass({

  componentDidMount: function () {
    AudioStore.addChangeListener(this._listenForTrack);
  },

  componentWillUnmount: function () {
    AudioStore.removeChangeListener(this._listenForTrack);
  },

  render: function () {
    var isPlaying = this.props.isPlaying
                 && this.props.currentTrack._id
                === this.props.post._id
                  ? true
                  : false;

    var playpause = isPlaying
                  ? '../../assets/icons/white/pause.svg'
                  : '../../assets/icons/white/play.svg';

    var toggleFav     = this.props.isLiked
                  ? '../../assets/icons/white/heart5.svg'
                  : '../../assets/icons/white/heart2.svg';

    return (
      <li id={this.props.post._id} className="post">
        <img className="postimg" onClick={this._playOrPauseTrack} src={this.props.post.Image}></img>
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
          </div>
        </div>
      </li>
    )
  },

  _updateLikes: function () {
    let info = {
      post: this.props.post._id,
      user: this.props.user
    };
    AudioActions.updateLikes(info);
    if (this.props.currentTrack !== null &&
        this.props.currentTrack._id === this.props.post._id) {
      let isLiked = !this.props.isLiked;
      AudioActions.setCurrentSong(null, isLiked);
    }
  },

  _playOrPauseTrack: function () {
    let ga = document.getElementById('globalAudio');
    if (this.props.currentTrack === null
     || this.props.currentTrack._id !== this.props.post._id) {
      let isLiked = this.props.isLiked;
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

  _listenForTrack: function () {
    let audio = AudioStore.getCurrentSong();
    let isModified = this.props.currentTrack !== null
                  && audio._id
                 === this.props.post._id
                   ? true
                   : false;
    if (isModified) {
    this.setState({
      isLikedState: AudioStore.getIsLiked()
    });
    }
  },

});

module.exports = ListItem;
