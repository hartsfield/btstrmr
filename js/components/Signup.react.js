var React = require('react');
var AuthActionCreators = require('../actions/AuthActionCreators.js');
var UserInfoStore = require('../stores/UserInfoStore.js');

function checkIfHidden() {
  var a = document.getElementById("mobile_nav-1").style;
  if (a.visibility === "hidden") {
    a.visibility = "visible"
  } else {
    a.visibility = "hidden"
  };
}


const SignUp = React.createClass({
  getInitialState: function () {
    return {
      Password: "",
      User: "",
      showForms: false,
      showSignup: false, 
      showLogin: true,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.user.success) {
      this.setState({
        showForms: false,
      });
    };
  },

  render: function () {
    return (
    <div>
        <div 
      className={this.props.mobile === null ? "auth" : "mobile_auth" }>
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
          { this.state.showForms ? /*|| UserInfoStore.showLogin() ? */
    <form
      className={this.props.mobile === null ? "loginForm" : "mobile_loginForm" }
      encType="multipart/form-data"
      onSubmit={this._handleSubmit}>
      <div id="verification">{!this.props.user.success && !this.props.user.ignore 
            ?this.props.user.message : "" }
      </div>
        <input className="usernameInput"
            pattern=".{4,15}"
            required
            title="4-15 characters"
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
        { !this.state.showSignup ?
          <div>
            <button
              className={this.props.mobile === null
                       ? "activeAuthButt" : "mobile_activeAuthButt" }
              onClick={this._handleLogin}>
              Login
            </button>
            <div
              className={this.props.mobile === null
                       ? "authButt" : "mobile_authButt" }
              onClick={this._toggleShowSignup}>
              or SignUp
            </div>
          </div>
        :
          <div>
            <button
              className={this.props.mobile === null
                       ? "activeAuthButt" : "mobile_activeAuthButt" }

              onClick={this._handleSignup}>
              SignUp
            </button>
            <div
              className={this.props.mobile === null
                       ? "authButt" : "mobile_authButt" }
              onClick={this._toggleShowSignup}>
              or Login
            </div>
          </div>

        }

    </form>
          :
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
          }
          </div>
    </div>
    );
  },

  _toggleShowSignup: function (e) {
 //   e.preventDefault();
    this.setState({
      showSignup: !this.state.showSignup,
      showLogin: !this.state.showLogin,
    });
    AuthActionCreators.showLoginForm(); 
  },

  _handleSubmit: function (event) {
    event.preventDefault();
  },

  _handleValueChange: function (event) {
    const et = event.target;
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
    checkIfHidden();
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
    checkIfHidden();
  },

  _userlogout: function () {
    AuthActionCreators.logout();
    this.setState({
      showLogin: false,
    });
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
    checkIfHidden();
  },

});

module.exports = SignUp;
