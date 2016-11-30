import React, { Component } from 'react';

// SASS
import './scss/app.scss';

// components
import Act    from './components/Act';
import Button from './components/Button';
import Input  from './components/Input';
import Text   from './components/Text';

// TJ Vimeo API
import Vimeo from 'react-tj-vimeo';

const __STATE__ = {
  0: 'end',
  1: 'playing',
  2: 'pause'
};

/**
 * @class App
 */
export default class App extends Component {
  /**
   * @constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      videoId     : 193391290,
      stateMsg    : 'Loading...',
      title       : 'Loading...',
      volume      : 100,
      loop        : false,
      isFullscreen: false,
      color       : '#00adef',
      duration    : 0,
      seconds     : 0,
      percent     : 0
    };
  }

  render() {
    return (
      <div>
        <section className="cp">
          <h1 className="cp-title">Vimeo API Component</h1>

          <div className="cp-actions">
            <Act title="Video Control">
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
            </Act>

            <div className="flex flex-row">
              <Act title="Volume Control">
                <Input type="range"
                       onChange={::this.handleVolume}
                       value={this.state.volume} />
              </Act>

              <Act title="Progress Video">
                <Input type="range"
                       onChange={::this.handleProgress}
                       value={this.state.percent} />
              </Act>
            </div>

            <Act title="Color">
              <Input type="color"
                     onChange={::this.handleColor}
                     value={this.state.color} />
            </Act>

            <Act title="Information">
              <Text label="Video ID/Title:"
                    text={`${this.state.videoId} / ${this.state.title}`} />
              <Text label="State/Duration/Time:"
                    text={`${this.state.stateMsg} / ${this.state.duration} / ${this.state.seconds}`} />
              <Text label="Loop/Fullscreen:"
                    text={`${this.state.loop ? 'on' : 'off'} / ${this.state.isFullscreen ? 'on' : 'off'}`} />
            </Act>
          </div>

          <div className="cp-wrap">
            <Vimeo videoId={this.state.videoId}
                   isFullscreen={this.state.isFullscreen}
                   onReady={::this.handleReady}
                   onPlay={::this.handlePlay}
                   onPause={::this.handlePause}
                   onEnded={::this.handleEnded}
                   onProgress={::this.handleProgress}
                   onSeeked={::this.handleSeeked}
                   onTimeupdate={::this.handleTimeupdate}
                   onVolumeChange={::this.handleVolumeChange}
                   onError={::this.handleError} />
          </div>
        </section>
      </div>
    );
  }

  changeState(obj) {
    this.setState(obj);
  }

  handleProgress(val) {
    this.player.setCurrentTime(parseInt(val, 10) / 100 * this.state.duration).then(() => {
      this.changeState({
        percent: parseInt(val, 10)
      });
    });
  }

  handleColor(val) {
    this.player.setColor(val).then((color) => {
      this.changeState({
        color: color
      });
    });
  }

  handleLoopVideo() {
    const loop = this.state.loop;

    this.player.setLoop(!loop);
    this.changeState({
      loop: !loop
    });
  }

  handleReady(player) {
    this.player = player;

    this.player.play();

    this.player.setColor(this.state.color);

    this.player.getVideoTitle().then((title) => {
      this.changeState({
        title : title
      });
    });

    this.player.getVolume().then((vol) => {
      this.changeState({
        volume: vol * 100
      });
    });
  }

  handlePlay(res) {
    this.changeState({
      currentState: 1,
      stateMsg    : __STATE__[1],
      duration    : res.duration
    });
  }

  handlePause(res) {
    this.changeState({
      currentState: 2,
      stateMsg    : __STATE__[2]
    });
  }

  handleEnded(res) {
    this.changeState({
      currentState: 0,
      stateMsg    : __STATE__[0]
    });
  }

  handleProgress(res) {}

  handleSeeked(res) {}

  handleTimeupdate(res) {
    this.changeState({
      percent: res.percent * 100,
      seconds: res.seconds
    });
  }

  handleError(err) {
    console.error(`${err.method}/${err.name}: ${err.message}`);
  }

  handleVolumeChange(res) {
    this.changeState({
      volume: res.volume * 100
    });
  }

  handleToggleVideo(evt) {
    if (this.state.currentState === 1) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  handlePlayVideo(evt) {
    this.player.play();
  }

  handlePauseVideo(evt) {
    this.player.pause();
  }

  handleStopVideo(evt) {
    this.player.unload().then(() => {
      this.changeState({
        currentState: 0,
        stateMsg    : __STATE__[0]
      });
    });
  }

  handleVideoId(val) {
    this.changeState({
      videoId: val
    });
  }

  handleVolume(val) {
    const vol = parseInt(val, 10);

    this.changeState({
      volume: vol
    });

    this.player.setVolume(parseInt(vol, 10) / 100);
  }
};
