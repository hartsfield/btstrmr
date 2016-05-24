var React = require('react');
var ListItem = require('./ListItem.react');
var AudioActions = require('../actions/AudioActions.js');
var Footer = require('./Footer.react.js');
var Signup = require('./Signup.react.js');
var title = 'FRESHEST BEATS';
var titleimg = '../../assets/icons/white/time.svg';

var List = React.createClass({

  getInitialState: function() {
    return {
      noMoreData: false,
      nextPageClicked: false,
    };
  },

  componentWillReceiveProps: function (newProps) {
    if ((newProps.myList.length === this.props.myList.length)
       && (this.state.nextPageClicked === true)){ 
      this.setState({
        noMoreData: true,
      });
    };

    if (this.state.nextPageClicked === true) {
      this.setState({
        nextPageClicked: false,
      });
    };

    if (newProps.myList.length < this.props.myList.length
        || newProps.currentOrder !== this.props.currentOrder) {
      this.setState({
        noMoreData: false,
      });
    };
  },

  render: function () {
    if (Object.keys(this.props.myList).length < 1) {
      return null;
    }
    if (this.props.currentOrder === 'fresh') {
      title = 'FRESHEST BEATS';
      titleimg = '../../assets/icons/white/time.svg';
    } else if (this.props.currentOrder === 'hot') {
      title = 'HOTTEST TRACKS';
      titleimg = '../../assets/icons/white/fire.svg';
    } else if (this.props.currentOrder === 'favs') {
      title = 'MY FAVS';
      titleimg = '../../assets/icons/white/heart2.svg';
    } else {
      title = 'FRESHEST BEATS';
      titleimg = '../../assets/icons/white/time.svg';
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
          mobile={this.props.mobile}
        />
      );
    }

    return (
      <div style={{height: "0"}}>
        <ul id={ this.props.mobile === null ? "listarea" : "listarea_mobile"}>
        <div className={ this.props.mobile === null ? "title" : "mobile_title"}>
        {title}
        <img className="titleimg" src={titleimg}></img>
        </div>
          {item}
        {this.state.noMoreData ?
        <button className="loadmore" >NO MORE TRACKS</button>
        :
        <button className="loadmore" onClick={this._nextPage}>•••</button>
        }
        <Footer />
        </ul>
      </div>
    );
  },

  _nextPage: function () {
    this.setState({
      nextPageClicked: true,          
    });
    AudioActions.getNextPage(this.props.currentOrder, this.props.myList.length, this.props.user.user);
  },
});

module.exports = List;
