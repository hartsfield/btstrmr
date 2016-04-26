var React = require('react');
var ListItem = require('./ListItem.react');

var List = React.createClass({

  render: function () {
    if (Object.keys(this.props.myList).length < 1) {
      return null;
    }

    var allItems = this.props.myList;
    var item = [];

    for (var key in allItems) {
/*      let isLiked =    this.props.user.user !== undefined
                    && this.props.user.user.liked.length > 0
                    ?  this._checkIfLiked(allItems[key]._id)
                    :  false;*/
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
      <div>
        <ul id={this.props.myList}>
          {item}
        </ul>
        <button>load more</button>
      </div>
    );
  },
/*
  _checkIfLiked: function (id) {
    let liked = this.props.user.user.liked;
    for (var i = 0, len = liked.length; i < len; i++) {
      if (liked[i] == id ) {
        return true;
      };
    };
    return false
  },
*/
});

module.exports = List;
