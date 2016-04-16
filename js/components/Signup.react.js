var React = require('react');
var AuthActionCreators = require('../actions/AuthActionCreators.js');

const SignUp = React.createClass({
  getInitialState: function () {
    return {
      Password: "",
      User: "",
      showSignup: true,
    };
  },

  render: function () {
    return (
    <div>
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
            <button onClick={this._handleSignup}>SignUp</button>
            <button onClick={this._toggleShowSignup}>or Login</button>
          </div>
        :
          <div>
            <button onClick={this._handleLogin}>Login</button>
            <button onClick={this._toggleShowSignup}>or SignUp</button>
          </div>
        }

    </form>
    </div>
    );
  },

  _toggleShowSignup: function () {
    this.setState({
      showSignup: !this.state.showSignup,
    });
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

  _handleSignup: function () {
    AuthActionCreators.signup(this._mkdata());
  },


  _handleLogin: function () {
    AuthActionCreators.login(this._mkdata());
  },

});

module.exports = SignUp;
