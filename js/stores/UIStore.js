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
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

var _showNav = false;

var UIStore = assign({}, EventEmitter.prototype, {
  getShowNav: function () {
    return _showNav;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});


AppDispatcher.register(function(action) {
  switch (action.ActionType) {

    case 'show_nav':
      _showNav = !_showNav;
      UIStore.emitChange();
      break;

    default: //
  }
});

module.exports = UIStore;
