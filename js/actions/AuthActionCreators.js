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

var AppDispatcher = require('../dispatcher/AppDispatcher.js');

// AuthActionCreators are actions related to authorization
var AuthActionCreators = {

  // Signup takes credentials and sends them to the server in an attempt to
  // signup a new user. The credentials are created using the FormData()
  // constructor like so:
  //   var data = new FormData();
  //   data.append('password', this.state.Password);
  //   data.append('username', this.state.User);
  //   return data;
  signup: function(credentials) {
    AppDispatcher.dispatch({
      ActionType: 'user_signup',
      data: credentials,
    });
  },

  // login is done the same as signup, but will access a different api path on
  // the server.
  login: function (credentials) {
    AppDispatcher.dispatch({
      ActionType: 'user_login',
      data: credentials,
    });
  },
  
  // logout action initializes a logout.
  logout: function () {
    AppDispatcher.dispatch({
      ActionType: 'user_logout',
    });
  },

  // showLoginForm action shows the login form.
  showLoginForm: function () {
    AppDispatcher.dispatch({
      ActionType: 'show_login',
    });
  },
}

module.exports = AuthActionCreators;
