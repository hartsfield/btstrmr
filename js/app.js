var ReactDOM = require('react-dom');
var React = require('react');
var MyApp = require('./components/MyApp.react');

// This is where our app hooks into the html element with ID "myapp" found in 
// the build/index.html file
ReactDOM.render(
  <MyApp />,
  document.getElementById('myapp')
);
