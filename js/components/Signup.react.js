var React = require('react');
var AuthActionCreators = require('../actions/AuthActionCreators.js');
var UserInfoStore = require('../stores/UserInfoStore.js');

// SignUp is the component for the signin/login forms
var SignUp = React.createClass({
  // by default, leave password and user name blank and don't show the forms.
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

  // used to detect when a user performs an action which requires the login
  // form to be displayed and closes the form on a successful signin
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

  // some code in this section is more portable than in other sections, so 
  // checkig for mobile platforms is done per-element.
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
            <div id={this.props.mobile === null ? "verification" : "mobile_verification" }>
              { !this.props.user.success && !this.props.user.ignore 
               ? this.props.user.message : "" }
            </div>
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
              <button
                className={this.props.mobile === null
                         ? "activeAuthButt" : "mobile_activeAuthButt" }
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
          :
          <div></div>
          }
        </div>
      </div>
    );
  },

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

  _toggleShowSignup: function (e) {
 //   e.preventDefault();
      this.setState({
        showSignup: !this.state.showSignup,
        showLogin: !this.state.showLogin,
      });
  },

  _handleSubmit: function (event) {
    event.preventDefault();
  },

  _handleValueChange: function (event) {
    var et = event.target;
    this.setState({
      [et.id]: et.value,
    });
  },

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

  _handleSignup: function (e) {
    var data = this._mkdata();
    if (data.error) {
      // 
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


  _handleLogin: function (e) {
//   e.preventDefault();
   var data = this._mkdata();
   if (data.error) {
     //
   } else {
    AuthActionCreators.login(data);
    this.setState({
      showLogin: false,
    });
   }
    this._checkIfHidden();
  },

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
