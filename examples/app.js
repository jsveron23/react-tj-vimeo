import React, {
  Component
} from 'react';
import fetch from 'fetch-jsonp';

// SASS
import './scss/app.scss';

// components
import Act    from './components/Act';
import Button from './components/Button';
import Input  from './components/Input';
import Text   from './components/Text';

// TJ Vimeo API
import Vimeo from 'react-tj-vimeo';

// Video state
const __STATE__ = {
  0: 'end',
  1: 'playing',
  2: 'pause'
};

/**
 * @class App
 * @extends {React.Component}
 */
export default class App extends Component {
  /**
   * @constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      // video id
      videoId: 193391290,

      // controlable
      volume: 100,
      color : '#00adef',
      loop  : false,

      // text
      author  : 'Loading...',
      stateMsg: 'Loading...',
      title   : 'Loading...',

      // thumbail
      thumbnail: '',

      // fullscreen
      supportFS: false,

      // time
      duration: 0,
      seconds : 0,
      percent : 0,

      // detach
      detachBtnName: 'Detach'
    };

    this.autoPlay = true;
  }

  /**
   * Render
   * @return {jsx}
   */
  render() {
    return (
      <div>
        <section className="cp">
          <h1 className="cp-title">Vimeo API Component</h1>

          <div className="cp-actions">
            <div className="flex flex-row">
              <div style={{
                flex: 1
              }}>
                <Act title="Control Video">
                  <Button title="Toggle"
                          onClick={::this.handleToggleVideo} />
                  <Button title="Play"
                          onClick={::this.handlePlayVideo} />
                  <Button title="Pause"
                          onClick={::this.handlePauseVideo} />
                  <Button title="Stop"
                          onClick={::this.handleStopVideo} />
                  <Button title="Loop"
                          onClick={::this.handleLoopVideo} />
                  <Button title={this.state.detachBtnName}
                          onClick={::this.handleDetachVideo} />
                </Act>


                <Act title="Control Volume / Progress">
                  <div className="flex flex-row">
                    <Input type="range"
                           onChange={::this.handleVolume}
                           value={this.state.volume} />
                    <Input type="range"
                           onChange={::this.handleProgress}
                           value={this.state.percent} />
                  </div>
                </Act>

                <Act title="Control Color">
                  <Input type="color"
                         onChange={::this.handleColor}
                         value={this.state.color} />
                </Act>
              </div>

              <div style={{
                width : 300,
                height: 169
              }}>
                {
                  this.state.thumbnail ?
                  <img src={this.state.thumbnail} alt={this.state.title} style={{
                    width : '100%',
                    height: '100%'
                  }} />
                  : 'Loading...'
                }
              </div>
            </div>

            <Act title="Information">
              <Text label="Video ID/Title:"
                    text={`${this.state.videoId} / ${this.state.title} by ${this.state.author}`} />
              <Text label="State/Duration/Time/%:"
                    text={`${this.state.stateMsg} / ${this.state.duration} / ${this.state.seconds} / ${this.state.percent}%`} />
              <Text label="Loop/Fullscreen:"
                    text={`${this.state.loop ? 'on' : 'off'} / ${this.state.supportFS ? 'on' : 'off'}`} />
            </Act>
          </div>

          <div className="cp-wrap">
            <Vimeo videoId={this.state.videoId}
                   supportFS={this.state.supportFS}
                   onLoaded={::this.handleLoaded}
                   onPlay={::this.handlePlay}
                   onPause={::this.handlePause}
                   onEnded={::this.handleEnded}
                   onTimeupdate={::this.handleTimeupdate}
                   onVolumeChange={::this.handleVolumeChange}
                   onError={::this.handleError} />
          </div>

          <div ref={(el) => this.detachElement = el}
               id="detach-video"
               className="is-hidden" />
        </section>
      </div>
    );
  }

  /**
   * Play video
   * @return {promise}
   */
  play() {
    return this.player.play();
  }

  /**
   * Pause video
   * @return {promise}
   */
  pause() {
    return this.player.pause();
  }

  /**
   * Stop/Unload video
   */
  stop() {
    this.player.unload().then(() => {
      this.setState({
        currentState: 0,
        stateMsg    : __STATE__[0]
      });
    });
  }

  /**
   * Handle tootle button
   * @param {object} evt
   */
  handleToggleVideo(evt) {
    evt.preventDefault();

    if (this.state.currentState === 1) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Handle play button
   * @param {object} evt
   */
  handlePlayVideo(evt) {
    evt.preventDefault();

    this.play();
  }

  /**
   * Handle pause button
   * @param {object} evt
   */
  handlePauseVideo(evt) {
    evt.preventDefault();

    this.pause();
  }

  /**
   * Handle stop button
   * @param {object} evt
   */
  handleStopVideo(evt) {
    evt.preventDefault();

    this.stop();
  }

  /**
   * Handle loop button
   * @param {object} evt
   */
  handleLoopVideo(evt) {
    evt.preventDefault();

    const loop = this.state.loop;

    this.player.setLoop(!loop).then(() => {
      this.setState({
        loop: !loop
      });
    });
  }

  /**
   * Handle detach / attach video
   * @param {object} evt
   */
  handleDetachVideo(evt) {
    evt.preventDefault();

    if (this.iframe.getAttribute('id') === 'detach-video') {
      this.iframe.removeAttribute('id');
      this.setState({
        detachBtnName: 'Detach'
      });
    } else {
      this.iframe.setAttribute('id', 'detach-video');
      this.setState({
        detachBtnName: 'Attach'
      });
    }
  }

  /**
   * Handle volume bar
   * @param {string} val
   */
  handleVolume(val) {
    const vol = parseInt(val, 10);

    this.player.setVolume(vol / 100).then(() => {
      this.setState({
        volume: vol
      });
    });
  }

  /**
   * Handle progress bar
   * @param {string} val
   */
  handleProgress(val) {
    const
      nextPercent  = parseInt(val, 10),
      nextProgress = nextPercent / 100 * this.state.duration;

    this.player.setCurrentTime(nextProgress).then(() => {
      this.setState({
        percent: nextPercent
      });
    });
  }

  /**
   * Handle Player Color
   * @param {string} val
   */
  handleColor(val) {
    this.player.setColor(val).then((color) => {
      this.setState({
        color: color
      });
    });
  }

  /**
   * Handle Loaded
   * @event
   * @param {object} player
   * @param {object} iframe
   */
  handleLoaded(player, iframe) {
    this.player = player;
    this.iframe = iframe;
    this.player.setColor(this.state.color).then(() => {
      return this.player.getVolume();
    }).then((volume) => {
      this.setState({
        volume: volume * 100
      });

      return fetch(`https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${this.state.videoId}`);
    }).then((res) => {
      return res.json();
    }).then((json) => {
      this.setState({
        title    : json.title,
        duration : json.duration,
        author   : json.author_name,
        thumbnail: json.thumbnail_url
      });

      if (this.autoPlay) {
        this.play();
      }

      // console.log(json);
    });
  }

  /**
   * Handle Play
   * @event
   * @param {object} res
   */
  handlePlay(res) {
    this.setState({
      currentState: 1,
      stateMsg    : __STATE__[1]
    });
  }

  /**
   * Handle Pause
   * @event
   * @param {object} res
   */
  handlePause(res) {
    this.setState({
      currentState: 2,
      stateMsg    : __STATE__[2]
    });
  }

  /**
   * Handle Ended
   * @event
   * @param {object} res
   */
  handleEnded(res) {
    this.setState({
      currentState: 0,
      stateMsg    : __STATE__[0]
    });
  }

  /**
   * Handle Timeupdate
   * @event
   * @param {object} res
   */
  handleTimeupdate(res) {
    this.setState({
      percent: res.percent * 100,
      seconds: res.seconds
    });
  }

  /**
   * Handle Volumechange
   * @event
   * @param {object} res
   */
  handleVolumeChange(res) {
    this.setState({
      volume: res.volume * 100
    });
  }

  /**
   * Handle Error
   * @event
   * @param {object} err
   */
  handleError(err) {
    console.error(`${err.method}/${err.name}: ${err.message}`);
  }
};
