///////////////////////////////////////////////////////////////////////////////
//  Copyright (c) 2017 J. Hartsfield
                                                                               
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
                                                                               
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
                                                                               
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
///////////////////////////////////////////////////////////////////////////////

var React = require('react');
var ListItem = require('./ListItem.react');
var AudioActions = require('../actions/AudioActions.js');
var Footer = require('./Footer.react.js');

// Page title in the header
var title = 'FRESHEST BEATS';
// Image will be aligned to the right
var titleimg = '../../assets/icons/white/time.svg';
var useraction = false;

// List is the list of songs loaded from the database and presented to the 
// user.
var List = React.createClass({

  getInitialState: function() {
    return {
      noMoreData: false,      // will be true when there is no more data in
                              // the list.

      nextPageClicked: false, // used for detecting whether the user has
                              // already requested the next page.
    };
  },

  componentWillReceiveProps: function (newProps) {
    // If you request more tracks but the length of songs hasn't changed that
    // means there's no more data. We check if next page was clicked because
    // sometimes componentWillReceiveProps is triggered by other actions.
    if ((newProps.myList.length === this.props.myList.length)
       && (this.state.nextPageClicked === true)){ 
      this.setState({
        noMoreData: true,
      });
    };

    // nextPageClicked is used to detect when an action was performed. This
    // basically "resets" it, making the logic here much simpler.
    if (this.state.nextPageClicked === true) {
      this.setState({
        nextPageClicked: false,
      });
    };

    // This reloads the song data on user sign in to detect which songs they
    // may have "liked".
    if (newProps.user.success !== this.props.user.success && !useraction) {
      useraction = true;
      AudioActions.getNextPage(this.props.currentOrder,
                               this.props.myList.length,
                               this.props.user.user);
    };

    // If the length of the list resets or the order changes we need to tell 
    // the app that in fact there is more data.
    if (newProps.myList.length < this.props.myList.length
        || newProps.currentOrder !== this.props.currentOrder) {
      this.setState({
        noMoreData: false,
      });
    };
  },

  render: function () {
    // If the user visits their "favorites" page before they've "liked" any
    // songs, they'll see this:
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

    // This is the logic that decides what the header title and image is based 
    // on the currentOrder.
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

    // For each item, we create a <ListItem> component and add it to the list.
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
        {/* Title */}
        <div className={ this.props.mobile === null ? "title" : "mobile_title"}>
        {title}
        {/* Image */}
        <img className="titleimg" src={titleimg}></img>
        </div>
        {/* Post */}
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

