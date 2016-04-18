var React = require('react');
var AudioActions = require('../actions/AudioActions');

var ListItem = React.createClass({

  render: function () {
    return (
      <li id={this.props.key}>
        {/*this.props.post ? "true" : "false"*/}
        {this.props.key}
        {this.props.post.Artist} - {this.props.post.Title}
        <button onClick={this._updateLikes}>fav</button>
      </li>
    )
  },

  _updateLikes: function () {
    let info = {
      post: this.props.num,
      user: this.props.user
    };
    console.log(info, "test");
    AudioActions.updateLikes(info);
  },
});

module.exports = ListItem;
