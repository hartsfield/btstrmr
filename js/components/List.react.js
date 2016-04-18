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
      console.log(allItems[key]);
      item.push(
        <ListItem
          key={key}
          num={allItems[key]._id}
          post={allItems[key]}
          user={this.props.user.user}
          changeFav={this.props.changeFav}
        />
      );
    }

    return (
      <ul id={this.props.myList}>
        {item}
      </ul>
    );
  },

});

module.exports = List;
