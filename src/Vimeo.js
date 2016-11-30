import React, {
  Component,
  PropTypes
} from 'react';
import VimeoPlayer from '@vimeo/player';

const noop = function() {};

/**
 * @class TJVimeo Component
 * @extends {React.Component}
 */
class Vimeo extends Component {
  /**
   * @constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      videoId  : props.videoId,
      supportFS: props.supportFS
    };

    this.player = null;
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.player = new VimeoPlayer(this.iframe);

    this.addEvents(this.player);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.removeEvents(this.player);
  }

  /**
   * shouldComponentUpdate
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * render
   */
  render() {
    return (
      <iframe ref={(el) => this.iframe = el}
              src={`https://player.vimeo.com/video/${this.props.videoId}`}
              width={this.props.width}
              height={this.props.height}
              frameBorder="0"
              allowFullScreen={this.state.supportFS} />
    );
  }

  addEvents(player) {
    const {
      onLoaded,
      onPlay,
      onPause,
      onEnded,
      onProgress,
      onSeeked,
      onTimeupdate,
      onVolumeChange,
      onError
    } = this.props;

    // event listeners
    player.on('loaded', (res) => {
      onLoaded(player, this.iframe);
    });
    player.on('play', onPlay);
    player.on('pause', onPause);
    player.on('ended', onEnded);
    player.on('progress', onProgress);
    player.on('seeked', onSeeked);
    player.on('timeupdate', onTimeupdate);
    player.on('volumechange', onVolumeChange);
    player.on('error', onError);
  }

  removeEvents(player) {
    player.off('loaded');
    player.off('play');
    player.off('pause');
    player.off('ended');
    player.off('progress');
    player.off('timeupdate');
    player.off('seeked');
    player.off('volumechange');
    player.off('error');
  }
}

Vimeo.defaultProps = {
  width         : '100%',
  height        : '100%',
  isFullscreen  : true,
  onLoaded      : noop,
  onPlay        : noop,
  onPause       : noop,
  onEnded       : noop,
  onProgress    : noop,
  onSeeked      : noop,
  onTimeupdate  : noop,
  onVolumeChange: noop,
  onError       : noop
};

Vimeo.propTypes = {
  videoId: PropTypes.number.isRequired
};

export default Vimeo;
