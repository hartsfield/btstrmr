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
var AudioActions = require('../actions/AudioActions.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');
var UIActions = require('../actions/UIActions.js');

var SideBar = React.createClass({

  render: function () {
    // For mobile devices
    if (this.props.mobile !== null) {
      // JSX for mobile nav bar pop-up
      if (this.props.showNav) {
        return (
          <div id="mobile_nav">
            <ul className="mobile_sidebar" id="mobile_nav-1">
          {/* Show a different icon based on whether the user is signed in */}
          { this.props.user.success ?
            <button
              id={ this.props.mobile === null ? "logoutDoor" :  "mobile_logoutDoor"  }
              className="loginShow"
              onClick={this._userlogout}>
            </button>
          :
            <button
              class="loginShow"
              id={ this.props.mobile === null ? "loginKey" :  "mobile_loginKey"  }
              onClick={this._showForms}>
            </button>
          }

          {/* logo and record icon */}
          <div id={this.props.mobile ? "mobile_logodiv" : "" }>
            <img
              id={this.props.mobile ? "mobile_spinny" : "spinny" }
              className={this.props.mobile ? "mobile_sidebar-img-logo" : "sidebar-img-logo"} 
              src="../../assets/SVG-TESTING/disk.svg"
            />
            <p className="mobile_btlogo">BTSTRMR</p>
            {/* Navigation */}
            </div>
              <li
                className="mobile_li_first mobile_sidebar-img"
                id="fresh"
                onClick={this._changeSort}>
                FRESH
              </li>
              <li
                className="mobile_sidebar-img"
                id="hot"
                onClick={this._changeSort}>
                HOT
              </li>
              {this.props.user.success ? // only show "favs" section if signed in
              <li
                className="mobile_sidebar-img"
                id="favs"
                onClick={this._changeSort}>
                FAVS
              </li>
              :
              <div></div>
              }
            </ul>
          </div>
        );
      } else {
        // Don't show nav
        return (
          <div></div>      
        );
      };

    } else {
      // non mobile navigation
      return (
        <ul className="sidebar">
          {/* Show a different icon based on whether the user is signed in */}
          { this.props.user.success ?
            <button
              id={ this.props.mobile === null ? "logoutDoor" :  "mobile_logoutDoor"  }
              className="loginShow"
              onClick={this._userlogout}>
              <img src="../assets/icons/black/log-out.svg" ></img>
            </button>
          :
            <button
              class="loginShow"
              id={ this.props.mobile === null ? "loginKey" :  "mobile_loginKey"  }
              onClick={this._showForms}>
              <img src="../assets/icons/black/key2.svg" ></img>
            </button>
          }

          {/* logo and record icon */}
          <div id={this.props.mobile ? "mobile_logodiv" : "" }>
            <img
              id={this.props.mobile ? "mobile_spinny" : "spinny" }
              className={this.props.mobile ? "mobile_sidebar-img-logo" : "sidebar-img-logo"} 
              src="../../assets/SVG-TESTING/disk.svg"
            />
            {this.props.mobile ? 
            <p className="mobile_btlogo">BTSTRMR</p>
            :
            <div></div>
            }
            </div>

          <p className="btlogo">BTSTRMR</p>
          <p className="glogo">GLOBAL</p>
          {/* Navigation */}
          <li
            className={ this.props.currentOrder === "fresh" 
                      ? "sidebar-img selected" : "sidebar-img" }
            id="fresh"
            onClick={this._changeSort}>
            FRESH
          </li>
          <li
            className={ this.props.currentOrder === "hot" 
                      ? "sidebar-img selected" : "sidebar-img" }
 
            id="hot"
            onClick={this._changeSort}>
            HOT
          </li>
       
         {this.props.user.success ?
        
          <li
            className={ this.props.currentOrder === "favs" 
                      ? "sidebar-img selected" : "sidebar-img" }
            id="favs"
            onClick={this._changeSort}>
            FAVS
          </li>
        
         :
        
          <div></div>
       
         }
         
         // just some white stripes for aesthetics that turn into a rainbow on
         // mouse over.
         <div id="rainbow">
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          <li className="rainbow" ></li>
          </div>
        </ul>
      );
    };
  },

  // _changeSort is triggered when a user presses a button on the nav bar
  // indicating that they want to change the sort order.
  _changeSort: function (e) {
    // set the url
    window.location.hash =  e.target.innerHTML.toLowerCase();
    // scroll back up
    window.scrollTo(0,0);
    var order = e.target.id;
    UIActions.showNav();
    AudioActions.changeSort(order, this.props.user.user);
  },

  // _userlogout logs the user out
  _userlogout: function () {
    AuthActionCreators.logout();
  },


  // _showForms shows the login/signup forms
  _showForms: function () {
    AuthActionCreators.showLoginForm();
    if (this.props.mobile !== null) {
      UIActions.showNav();
    }
  },

});

module.exports = SideBar;
