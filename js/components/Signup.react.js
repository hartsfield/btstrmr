var React = require('react');
var AuthActionCreators = require('../actions/AuthActionCreators.js');

const SignUp = React.createClass({
  getInitialState: function () {
    return {
      Password: "",
      User: "",
    };
  },

  handleSubmit: function (event) {
    event.preventDefault();
  },

  handleValueChange: function (event) {
    const et = event.target;
    this.setState({
      [et.id]: et.value,
    });
  },

  handleSignup: function () {
    var data = new FormData();
    data.append('password', this.state.Password);
    data.append('username', this.state.User);
    AuthActionCreators.signup(data);
  },

  render: function () {
    return (
    <div>
    <form
      className="loginForm"
      encType="multipart/form-data"
      onSubmit={this.handleSubmit}>
        <input className="usernameInput"
            id="User"
            placeholder="username"
            onChange={this.handleValueChange}
            defaultValue={this.state.User}>
        </input>
        <input className="passwordInput"
            id="Password"
            type="password"
            placeholder="password"
            onChange={this.handleValueChange}
            defaultValue={this.state.Password}>
        </input>
      <button onClick={this.handleSignup}>SignUp</button>
    </form>
    :
    <div></div>

    </div>
    );
  }
});

module.exports = SignUp;
