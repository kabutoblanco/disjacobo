import React, { Component } from 'react';

import { ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';

export class ProgressAction extends Component {
  render() {
    return (
      <ProgressBar
        animated
        now={100}
        style={{
          borderRadius: 0,
          display: this.props.isRunning ? 'flex' : 'none',
        }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  isRunning: state.auth.isRunning,
});

export default connect(mapStateToProps)(ProgressAction);