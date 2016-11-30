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
    this.player.off('loaded');
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

    this.player = new VimeoPlayer(this.iframe);

    // event listeners
    this.player.on('loaded', (res) => {
      onLoaded(this.player, res.id);
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
