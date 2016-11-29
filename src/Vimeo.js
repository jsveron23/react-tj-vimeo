import React, {
  Component,
  PropTypes
} from 'react';
import { extend as _extend } from 'lodash';
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
      videoId     : props.videoId,
      isFullscreen: props.isFullscreen
    };

    this.player = null;
  }

  componentDidMount() {
    this.initPlayer();
  }

  componentWillUnmount() {
    this.player.off('play');
    this.player.off('pause');
    this.player.off('ended');
    this.player.off('progress');
    this.player.off('timeupdate');
    this.player.off('seeked');
    this.player.off('volumechange');
    this.player.off('error');
  }

  render() {
    return (
      <iframe ref={(el) => this.iframe = el}
              src={`https://player.vimeo.com/video/${this.props.videoId}`}
              width={this.props.width}
              height={this.props.height}
              frameBorder="0"
              allowFullScreen={this.state.isFullscreen} />
    );
  }

  initPlayer() {
    const {
      onReady,
      onPlay,
      onPause,
      onEnded,
      onProgress,
      onSeeked,
      onTimeupdate,
      onVolumeChange,
      onError } = this.props;

    this.player = new VimeoPlayer(this.iframe);
    this.player.ready().then(() => {
      onReady(this.player);
    });
    this.player.on('play', onPlay);
    this.player.on('pause', onPause);
    this.player.on('ended', onEnded);
    this.player.on('progress', onProgress);
    this.player.on('seeked', onSeeked);
    this.player.on('timeupdate', onTimeupdate);
    this.player.on('volumechange', onVolumeChange);
    this.player.on('error', onError);
  }
}

Vimeo.defaultProps = {
  width         : '100%',
  height        : '100%',
  isFullscreen  : true,
  onReady       : noop,
  onPlay        : noop,
  onPause       : noop,
  onEnded       : noop,
  onProgress    : noop,
  onTimeupdate  : noop,
  onVolumeChange: noop,
  onError       : noop
};

// Vimeo.propTypes = {
//   videoId: PropTypes.string.isRequired
// };

export default Vimeo;
