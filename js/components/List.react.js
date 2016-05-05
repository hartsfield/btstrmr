var React = require('react');
var ListItem = require('./ListItem.react');
var AudioActions = require('../actions/AudioActions.js');
var Footer = require('./Footer.react.js');
var title = 'FRESHEST BEATS';

var List = React.createClass({

  render: function () {
    if (Object.keys(this.props.myList).length < 1) {
      return null;
    }
    if (this.props.currentOrder === 'fresh') {
      title = 'FRESHEST BEATS';
    } else if (this.props.currentOrder === 'hot') {
      title = 'HOTTEST TRACKS';
    } else if (this.props.currentOrder === 'favs') {
      title = 'MY FAVS';
    } else {
      title = 'FRESHEST BEATS';
    };
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
        <div className="title">{title}</div>
          {item}
        <button className="loadmore" onClick={this._nextPage}>•••</button>
        <Footer />
        </ul>
      </div>
    );
  },

  _nextPage: function () {
    AudioActions.getNextPage(this.props.currentOrder, this.props.myList.length, this.props.user.user);
  },
});

module.exports = List;
