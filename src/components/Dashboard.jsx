import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { socket } from 'utils';
import AlertContainer from 'containers/AlertContainer';
import UserDashboardContainer from 'containers/UserDashboardContainer';
import ServiceDashboardContainer from 'containers/ServiceDashboardContainer';
import MrCooperLogo from '../images/logoWhite.png';

class Dashboard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      socketConnected: false,
    };
  }

  componentDidMount() {
    socket.on('connect', () => {
      this.setState({
        socketConnected: true,
      });
    });
  }

  render() {
    const {
      email, name, groupName,
    } = this.props;
    return (
      <div className="container">
        <div className="Header">
          <img alt="Mr. Cooper" className="MrCooperLogo" src={MrCooperLogo} />
          <span>/ Chatbot</span>
        </div>

        <div className="LogContainer">
          <div className="Heading">
            <span className="Title">{`Welcome ${name}`}</span>
          </div>
          {isEqual(groupName, 'SERVICE')
          && email && name && this.state.socketConnected
          && (<ServiceDashboardContainer />)}
          {isEqual(groupName, 'USER')
          && email && name && this.state.socketConnected
          && (<UserDashboardContainer />)}
        </div>
        <AlertContainer />
      </div>
    );
  }
}

export default Dashboard;

Dashboard.propTypes = {
  email: PropTypes.string,
  groupName: PropTypes.string,
  name: PropTypes.string,
};
