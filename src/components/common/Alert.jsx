import React from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import DarkOverlay from './DarkOverlay';

const Alert = ({
  open, alerts, handleClose,
}) => {
  return (open
    && (
    <DarkOverlay>
      <div className="AlertHolder">
        <div className="Alert">
          {map(alerts, (alert, key) => {
            const { type, message } = alert;
            return (
              <div key={key} className="AlertHeading">
                {isEqual(type, 'error') && <span className="error">Error</span>}
                {isEqual(type, 'warning') && <span className="warning">Warning</span>}
                {isEqual(type, 'info') && <span className="info">Info</span>}
                <span className="Message">{message}</span>
              </div>
            );
          })}
          <div className="AlertButtonHolder">
            <button
              onClick={handleClose}
            >
          Okay
            </button>
          </div>
        </div>
      </div>
    </DarkOverlay>
    ));
};

export default Alert;

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
