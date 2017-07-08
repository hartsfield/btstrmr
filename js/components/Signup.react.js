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
var AuthActionCreators = require('../actions/AuthActionCreators.js');
var UserInfoStore = require('../stores/UserInfoStore.js');

// SignUp is the component for the signin/login forms
var SignUp = React.createClass({
  // By default, leave password and user name blank and don't show the forms.
  // When the forms are shown, it shows the login form by default.
  getInitialState: function () {
    return {
      Password: "",
      User: "",
      showForms: false,
      showSignup: false, 
      showLogin: true,
    };
  },

  // Used to detect when a user performs an action which requires the login
  // form to be displayed and closes the form on a successful signin.
  componentWillReceiveProps: function(nextProps) {
    if (UserInfoStore.showLogin()) {
      this.setState({
        showForms: true,
      });
    } else {
      this.setState({
        showForms: false,
      });
    };

    if (nextProps.user.success) {
      this.setState({
        showForms: false,
      });
    };
  },

  // Some code in this section is more portable than in other sections, so 
  // checking for mobile platforms is done per-element.
  render: function () {
    return (
      <div>
        <div className={this.props.mobile === null ? "auth" : "mobile_auth" }>
          { this.state.showForms ? 
          // Form starts here
          <form
            className={this.props.mobile === null ? "loginForm" : "mobile_loginForm" }
            encType="multipart/form-data"
            onSubmit={this._handleSubmit}>
            {/* .cover dims the background of the website when the login form is 
               shown. When clicked, it closes the login form. */}
            <div className="cover" onClick={AuthActionCreators.showLoginForm}></div>
            {/* #verification will only be shown if the user chooses a 
               user name that's already been taken or if their password is 
               invalid. */}
            <div id={this.props.mobile === null ? "verification" : "mobile_verification" }>
              { !this.props.user.success && !this.props.user.ignore 
               ? this.props.user.message : "" }
            </div>
            {/* username */}
            <input className="usernameInput"
              pattern="[a-zA-Z0-9\-]{4,15}"
              required
              title="4-15 characters and one dash '-'"
              className={this.props.mobile === null ? "" : "mobile_User" }
              id="User"
              autocapitalize="none"
              placeholder="username"
              onChange={this._handleValueChange}
              defaultValue={this.state.User}>
            </input>
            {/* password */}
            <input className="passwordInput"
              pattern=".{4,15}"
              required
              title="4-15 characters"
              className={this.props.mobile === null ? "" : "mobile_Password" }
              id="Password"
              type="password"
              placeholder="password"
              onChange={this._handleValueChange}
              defaultValue={this.state.Password}>
            </input>
            <div>
              {/* This button will change depending on whether the user is 
                 signing up a new account or logging into an existing account. */}
              <button
                className={this.props.mobile === null ? "activeAuthButt" : "mobile_activeAuthButt" }
                onClick={!this.state.showSignup ? this._handleLogin : this._handleSignup }>
                  { !this.state.showSignup ? "Login" : "SignUp" }
              </button>
              <div
                className={this.props.mobile === null
                         ? "authButt" : "mobile_authButt" }
                onClick={this._toggleShowSignup}>
                { this.state.showSignup ? "Login" : "SignUp" }
              </div>
              <div
                className={this.props.mobile === null
                         ? "authButt" : "mobile_authButt grey" }
                onClick={AuthActionCreators.showLoginForm}>
                no thanks
              </div>
            </div>
          </form>
          : //  Don't show the login/signup form.
          <div></div>
          }
        </div>
      </div>
    );
  },

  // _checkIfHidden is used for hiding and showing the mobile navigation.
  _checkIfHidden: function() {
    if (this.props.mobile !== null) {
      var a = document.getElementById("mobile_nav-1").style;
      if (a.visibility === "hidden") {
        a.visibility = "visible"
      } else {
        a.visibility = "hidden"
      };
    }
  },

  // Toggle between signup and login forms (not for showing the form).
  _toggleShowSignup: function (e) {
    // e.preventDefault();
    this.setState({
      showSignup: !this.state.showSignup,
      showLogin: !this.state.showLogin,
    });
  },

  // Prevent the page from reloading.
  _handleSubmit: function (event) {
    event.preventDefault();
  },

  // JavaScript witchcraft?
  // et.id are the id fields of the signup/login/password form input fields and
  // this function is used for setting the state of those properties in React.
  _handleValueChange: function (event) {
    var et = event.target;
    this.setState({
      [et.id]: et.value,
    });
  },

  // _mkdata validates and packages the data for its journey to the server
  // (it's validated server side too).
  _mkdata: function () {
    var p = this.state.Password;
    var u = this.state.User;
    if ((p.length > 20 || p.length < 4) && (u.length > 15 || u.length < 4)) {
        return {error: true, errPass: "4 - 20 characters", errName: "4 - 15 characters, alphanumeric"}
    } else if ((p.length > 20 || p.length < 4)) {
        return {error: true, errPass: "4 - 20 characters"}
    } else if ((u.length > 15 || u.length < 4)) {
        return {error: true, errName: "4 - 15 characters, alphanumeric"}
    } else {
      var data = new FormData();
      data.append('password', this.state.Password);
      data.append('username', this.state.User);
      return data;
    }
  },

  // _handleSignup handles initial user signup.
  _handleSignup: function (e) {
    // Sanitize and package the data.
    var data = this._mkdata();
    if (data.error) {
      // Error handled by browsers validator.
    } else {
      e.preventDefault();
      AuthActionCreators.signup(data);
      this.setState({
        showSignup: !this.state.showSignup,
        showLogin: false, 
      });
    };
    this._checkIfHidden();
  },


  // _handleLogin handles user logins.
  _handleLogin: function (e) {
    // Sanitize and package user credentials.
    var data = this._mkdata();
    if (data.error) {
      // Error handled by browsers validator.
    } else {
      AuthActionCreators.login(data);
      this.setState({
        showLogin: false,
      });
    }
    this._checkIfHidden();
  },

  // _showForms is used to toggle whether or not the signup/login forms are 
  // shown.
  _showForms: function () {
   if (this.state.showForms) {
     this.setState({
       showForms: false,
    });
   } else {
     this.setState({
       showForms: true,
     }); 
   }
    this._checkIfHidden();
  },

});

module.exports = SignUp;
