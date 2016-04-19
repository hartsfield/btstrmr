var React = require('react');
var AudioActions = require('../actions/AudioActions');

var ListItem = React.createClass({

  getInitialState: function () {
    // SEED DATA, NOT AN ANTI-PATTERN,
    // SEE REACT DOCS
    return {
      isLikedState: this.props.isLiked,
    };
  },

  render: function () {
    return (
      <li id={this.props.key}>
        <button onClick={this._playTrack}>play</button>
        {this.props.post.Artist} - {this.props.post.Title}
        {this.props.post.Posted}
        <button onClick={this._updateLikes}>
          { this.state.isLikedState ? "unfav" : "fav" }
        </button>
      </li>
    )
  },

  _updateLikes: function () {
    this.setState({
      isLikedState: !this.state.isLikedState,
    });
    let info = {
      post: this.props.post._id,
      user: this.props.user
    };
    AudioActions.updateLikes(info);
  },

  _playTrack: function () {
    let ga = document.getElementById('globalAudio');
    ga.src= '../..' + this.props.post.Audio + '.mp3';
    ga.load();
    ga.play();
  },
});

module.exports = ListItem;
