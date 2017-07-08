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

// _showNav is the mobile navigation.
var _showNav = false;

// UIStore is the store for user interface state data.
var UIStore = assign({}, EventEmitter.prototype, {
  // Returns whether or not _showNav is toggled.
  getShowNav: function () {
    return _showNav;
  },

  // Called on change.
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  // In js/components/MyApp.react.js we can define a function to call on change
  // events with UIStore.addChangeListener(cb)
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  // In js/components/MyApp.react.js we can remove a function we once called on
  // change events with UIStore.addChangeListener(cb) using 
  // UIStore.removeChangeListener(cb)
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

// Register actions and emit changes.
AppDispatcher.register(function(action) {
  switch (action.ActionType) {

    // show_nav is used for toggling the mobile navigation dialog.
    case 'show_nav':
      _showNav = !_showNav;
      UIStore.emitChange();
      break;

    default: //
  }
});

module.exports = UIStore;
