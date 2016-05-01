var React = require('react');
var ListItem = require('./ListItem.react');
var AudioActions = require('../actions/AudioActions.js');

var List = React.createClass({

  render: function () {
    if (Object.keys(this.props.myList).length < 1) {
      return null;
    }

    var allItems = this.props.myList;
    var item = [];

    for (var key in allItems) {
      item.push(
        <ListItem
          key={key}
          post={allItems[key]}
          isPlaying={this.props.isPlaying}
          currentTrack={this.props.currentTrack}
          isLiked={allItems[key].isLiked}
          user={this.props.user.user}
        />
      );
    }

    return (
      <div style={{height: "0"}}>
        <ul id="listarea">
          {item}
        </ul>
        <button onClick={this._nextPage}>load more</button>
      </div>
    );
  },

  _nextPage: function () {
    AudioActions.getNextPage(this.props.currentOrder, this.props.myList.length, this.props.user.user);
  },
});

module.exports = List;
