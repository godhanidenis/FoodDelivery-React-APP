import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Title(props) {
  return (
    <Typography component="h1" variant="h5" color="white" style={{background: props.bgcolor, color: props.color, padding: '10px 20px', margin: '-16px -16px 16px -16px'}} gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};
