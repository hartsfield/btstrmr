var React = require('react');
var AudioActions = require('../actions/AudioActions.js');
//var AudioStore = require('../stores/AudioStore.js');
var UIActions = require('../actions/UIActions.js');
var AuthActionCreators = require('../actions/AuthActionCreators.js');

var GlobalPlayer = React.createClass({

  render: function() {
    var playpause = this.props.isPlaying
                  ? '../../assets/icons/white/pause.svg'
                  : '../../assets/icons/white/play.svg';

    if (this.props.mobile === null) {
    var toggleFav = this.props.isLiked
                  ? '../../assets/icons/white/heart5.svg'
                  : '../../assets/icons/white/heart2.svg';
    if (this.props.currentTrack === null) {
      return (
        <div className="globalplayer logobar">
          <div className="arrow-right gnext0 arlogo">B</div>
          <div className="arrow-right gnext1 arlogo">T</div>
          <div className="arrow-right gnext2 arlogo">S</div>
          <div className="arrow-right gnext3 arlogo">T</div>
          <div className="arrow-right gnext4 arlogo">R</div>
          <div className="arrow-right gnext5 arlogo">M</div>
          <div className="arrow-right gnext6 arlogo">R</div>
        </div>
     );
    
    } else {
      return (
        <div className="globalplayer logobar">
          
          <div 
            onClick={this._playOrPauseTrack} 
            className="arrow-right">
              <img
                id="globalplaypause_image"
                src={playpause}>
              </img>
          </div>
          
          <div 
            onClick={this.props._playNext} 
            className="arrow-right gnext">
              <img
                id="globalnext_image"
                src={'../../assets/icons/wh' +
                     'ite/playback-fast-forward.svg'}>
              </img>
          </div>
          
          <div id="progresscontainer">
            <div id="progressbar"></div>
          </div>
          
          <div id="globalInfo">
            {this.props.currentTrack.Artist} - 
            {this.props.currentTrack.Title}
          </div>
          
          <div 
            className="arrow-left" 
            onClick={this._toggleFav}>
              <img
                id="globalheart_image"
                src={toggleFav}>
              </img>
          </div>

        </div>
      );

    };

    } else {
     var toggleFav = this.props.isLiked
                  ? '../../assets/icons/red/heart5.svg'
                  : '../../assets/icons/white/heart2.svg';

    return (


    <div>
      {this.props.currentTrack === null ?
      <div id="mobile_header">
        <div
          id="showNav"
          onClick={this._showNav}>
          <img
            id="showNav_image"
            src="../../assets/icons/white/list.svg">
          </img>
        </div>
        <div id="mobile_logo">
          BTSTRMR
        </div>
      </div>
      
      :
      
      <div id="mobile_header">
        
        <div
          id="showNav"
          onClick={this._showNav}>
          <img
             id="showNav_image"
             src="../../assets/icons/white/list.svg">
          </img>
        </div>
       
        <div 
          onClick={this._playOrPauseTrack} 
          className="mobile_play">
            <img
              id="mobile_play_image"
              src={playpause}>
            </img>
        </div>
      
        <div id="mobile_globalInfo">
          {this.props.currentTrack.Artist} - 
          {this.props.currentTrack.Title}
        </div>
         
        <div 
          className="mobile_globalheart" 
          onClick={this._toggleFav}>
            <img
              id="mobile_globalheart_image-a"
              src={toggleFav}>
            </img>
        </div>
      
      </div>
      }
    </div>
    );
    
    };
  },

  _playOrPauseTrack: function () {
    var ga = document.getElementById('globalAudio');
    if (this.props.isPlaying) {
      ga.pause();
    } else if (!this.props.isPlaying) {
      ga.play();
    };
  },

  _showNav: function () {
    UIActions.showNav();
  },

  _toggleFav: function () {
    if ( this.props.user.success ) {
      var info = {
        post: this.props.currentTrack._id,
        user: this.props.user.user
      };
      AudioActions.updateLikes(info);
      var isLiked = !this.props.isLiked;
      AudioActions.setCurrentSong(null, isLiked);
    } else {
      AuthActionCreators.showLoginForm(); 
    }
  },

});

module.exports = GlobalPlayer;

