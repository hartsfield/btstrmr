var React = require('react');
var AuthActionCreators = require('../actions/AuthActionCreators.js');
var UserInfoStore = require('../stores/UserInfoStore.js');

const SignUp = React.createClass({
  getInitialState: function () {
    return {
      Password: "",
      User: "",
      showSignup: true,
      showLogin: false, 
    };
  },

  render: function () {
    return (
    <div>
        <div className="auth">
          { this.props.user.success ?
            <button id="logoutDoor" className="loginShow" onClick={this._userlogout}></button>
          :
            <button id="loginKey" className="loginShow" onClick={this._showLogin}></button>
          }
          { this.state.showLogin || UserInfoStore.showLogin() ? 
    <form
      className="loginForm"
      encType="multipart/form-data"
      onSubmit={this._handleSubmit}>
        <input className="usernameInput"
            id="User"
            placeholder="username"
            onChange={this._handleValueChange}
            defaultValue={this.state.User}>
        </input>
        <input className="passwordInput"
            id="Password"
            type="password"
            placeholder="password"
            onChange={this._handleValueChange}
            defaultValue={this.state.Password}>
        </input>
        { this.state.showSignup ?
          <div>
            <button className="activeAuthButt" onClick={this._handleLogin}>Login</button>
            <button className="authButt" onClick={this._toggleShowSignup}>or SignUp</button>
          </div>

        :
          <div>
            <button className="activeAuthButt" onClick={this._handleSignup}>SignUp</button>
            <button className="authButt" onClick={this._toggleShowSignup}>or Login</button>
          </div>

        }

    </form>
          :
            <img
              id="spinny"
              className="sidebar-img-logo" 
              src="../../assets/SVG-TESTING/disk.svg"
            />
          }
          </div>


    </div>
    );
  },

  _toggleShowSignup: function () {
    this.setState({
      showSignup: !this.state.showSignup,
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
    var data = new FormData();
    data.append('password', this.state.Password);
    data.append('username', this.state.User);
    return data;
  },

  _handleSignup: function (e) {
    e.preventDefault();
    AuthActionCreators.signup(this._mkdata());
    this.setState({
      showLogin: false,
    });
  },


  _handleLogin: function (e) {
    e.preventDefault();
    AuthActionCreators.login(this._mkdata());
    this.setState({
      showLogin: false,
    });

  },

  _userlogout: function () {
    AuthActionCreators.logout();
    this.setState({
      showLogin: false,
    });
  },

  _showLogin: function () {
    this.setState({
      showLogin: !this.state.showLogin,
    });
  }



});

module.exports = SignUp;
