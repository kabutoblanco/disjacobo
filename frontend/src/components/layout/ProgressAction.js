import React from 'react';

import { ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';

function ProgressAction(props) {
  return (
    <ProgressBar
      animated
      now={100}
      style={{
        borderRadius: 0,
        display: props.isRunning ? 'flex' : 'none',
      }}
    />
  );
}

const mapStateToProps = (state) => ({
  isRunning: state.auth.isRunning,
});

export default connect(mapStateToProps)(ProgressAction);
