import React from 'react';
import PropTypes from 'prop-types';

const DarkOverlay = ({ children }) => (<div className="DarkOverlay">{children}</div>);

export default DarkOverlay;

DarkOverlay.propTypes = {
  children: PropTypes.object,
};
