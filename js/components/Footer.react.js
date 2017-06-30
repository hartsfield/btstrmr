var React = require('react');

// A very simple footer, located at the bottom of the page.
var Footer = React.createClass({
  render: function () {
    return (
      <div className="foot">
        <img id="recycle" src="../../assets/icons/white/earth.svg"></img>
        <div className="footLogo">♫ BTSTRMR</div>
        <div id="textme">TXT@(681)222.5982</div>
      </div>
    )    
  }
});

module.exports = Footer;
