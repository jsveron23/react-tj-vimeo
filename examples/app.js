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
      stateMsg    : '',
      volume      : 100,
      loop        : false,
      isFullscreen: true
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

            <Act title="Volume Control">
              <Input type="range"
                     onChange={::this.handleVolume}
                     value={this.state.volume} />
            </Act>

            <Act title="Information">
              <Text label="Id:"
                    text={this.state.videoId} />
              <Text label="Title:"
                    text={this.state.title} />
              <Text label="State:"
                    text={this.state.stateMsg} />
              <Text label="Duration:"
                    text={this.state.duration} />
              <Text label="Timeupdate:"
                    text={this.state.seconds} />
              <Text label="Loop:"
                    text={this.state.loop ? 'on' : 'off'} />
              <Text label="Fullscreen:"
                    text={this.state.isFullscreen ? 'on' : 'off'} />
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
      percent: res.percent,
      seconds: res.seconds
    });
  }

  handleError(err) {
    console.error(err);
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
