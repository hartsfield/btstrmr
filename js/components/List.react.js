var React = require('react');
var ListItem = require('./ListItem.react');
var AudioActions = require('../actions/AudioActions.js');
var Footer = require('./Footer.react.js');

// Page title in the header
var title = 'FRESHEST BEATS';
// Image will be aligned to the right
var titleimg = '../../assets/icons/white/time.svg';
// used for detecting whether the user has already requested the next page
var useraction = false;

var List = React.createClass({

  getInitialState: function() {
    return {
      noMoreData: false,      // will be true when there is no more data in
                              // the list
      nextPageClicked: false, 
    };
  },

  componentWillReceiveProps: function (newProps) {
    // if you request more tracks but the length of songs hasn't changed that
    // means there's no more data. We check if next page was clicked because
    // sometimes componentWillReceiveProps is triggered by other actions
    if ((newProps.myList.length === this.props.myList.length)
       && (this.state.nextPageClicked === true)){ 
      this.setState({
        noMoreData: true,
      });
    };

    // nextPageClicked is used to detect when an action was performed. This
    // basically "resets" it, making the logic much simpler
    if (this.state.nextPageClicked === true) {
      this.setState({
        nextPageClicked: false,
      });
    };

    // If the user signs out or signs in we need to 
    if (newProps.user.success !== this.props.user.success && !useraction) {
      useraction = true;
      AudioActions.getNextPage(this.props.currentOrder,
                               this.props.myList.length,
                               this.props.user.user);
    };

    // If the length of the list resets or the order changes we need to tell 
    // the app that in fact there is more data
    if (newProps.myList.length < this.props.myList.length
        || newProps.currentOrder !== this.props.currentOrder) {
      this.setState({
        noMoreData: false,
      });
    };
  },

  render: function () {
    if (Object.keys(this.props.myList).length < 1) {
      return (
      <div className="listwrap">
        <ul id={ this.props.mobile === null ? "listarea" : "listarea_mobile"}>
          <div className={ this.props.mobile === null ? "title" : "mobile_title"}>
            <div className="nosongs">It doesn't look like you've liked any songs yet!</div>
          </div>
          <Footer />
        </ul>
      </div>

      );
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
      <div className="listwrap">
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
  
  // _nextPage gets the next page of data
  _nextPage: function () {
    this.setState({
      nextPageClicked: true,          
    });
    AudioActions.getNextPage(this.props.currentOrder,
                             this.props.myList.length,
                             this.props.user.user);
  },
});

module.exports = List;
