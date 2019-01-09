import React from 'react';
import PropTypes from 'prop-types';

const Typing = ({ loadingText }) => {
  return (
    <div className="spinner">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
      {loadingText && <span>{loadingText}</span>}
    </div>
  );
};

export default Typing;

Typing.propTypes = {
  loadingText: PropTypes.string,
};
