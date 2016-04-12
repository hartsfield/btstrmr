var React = require('react');
var AudioActions = require('../actions/AudioActions');

var ListItem = React.createClass({

  render: function () {
    return (
      <li id={this.props.key}>
        {this.props.post ? "true" : "false"}
        {this.props.key}
        <button onClick={this._updateLikes}>fav</button>
      </li>
    )
  },

  _updateLikes: function () {
    AudioActions.updateLikes(this.props.num);
  },
});

module.exports = ListItem;
