import React, { Component } from 'react';

const noop = function() {};

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    const val = nextProps.value;

    this.setState({
      value: val
    });
  }

  onChange(evt) {
    const {
      onChange
    } = this.props,
    val = evt.target.value;

    this.setState({
      value: val
    });

    onChange(val);
  }

  render() {
    return (
      <input type={this.props.type}
             onChange={::this.onChange}
             value={this.state.value}
             max={this.props.max}
             min={this.props.min} />
    );
  }
};

Input.defaultProps = {
  type    : 'text',
  onChange: noop,
  value   : ''
};

export default Input;
