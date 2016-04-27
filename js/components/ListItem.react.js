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
    let isPlaying = this.props.isPlaying
                 && this.props.currentTrack._id
                === this.props.post._id
                  ? true
                  : false;

    let playpause = isPlaying
                  ? '||'
                  : '►';

    let isFav     = this.props.isLiked
                  ? '💖 '
                  : '💛 ';

    return (
      <li id={this.props.post._id}>
        <button
          className="arrow"
          onClick={this._playOrPauseTrack}>
            {playpause}
        </button>
        {this.props.post.Artist} - {this.props.post.Title}
        <button onClick={this._updateLikes}>
        {isFav}
        </button>
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
