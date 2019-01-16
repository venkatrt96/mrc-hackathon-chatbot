import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { socket } from 'utils';
import AlertContainer from 'containers/AlertContainer';
import UserDashboardContainer from 'containers/UserDashboardContainer';
import ServiceDashboardContainer from 'containers/ServiceDashboardContainer';
import Table from 'components/common/Table';
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
      email, name, groupName, passwordResetView, lastTransactionView,
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
          <div className="MiscContainer">
            {lastTransactionView && (
            <Table
              body={[{
                posted: '01/02/2019',
                effective: '12/31/2018',
                description: 'PAYMENT',
                total: '$1,903.14',
                PI: '$1,368.15',
                TI: '$534.99',
                nextDue: '02/01/2019',
              }]}
              head={{
                posted: 'POSTED',
                effective: 'EFFECTIVE',
                description: 'DESCRIPTION',
                total: 'TOTAL',
                PI: 'P&I',
                TI: 'T&I',
                nextDue: 'NEXT DUE',
              }}
              title="Last Transaction"
            />
            )}
            {passwordResetView && (
            <div>
              <div>
                <span>Loan #</span>
                <input type="text" />
              </div>
              <div>
                <span>SSN</span>
                <input type="text" />
              </div>
              <div>
                <span>DOB</span>
                <input type="text" />
              </div>
              <div>
                <span>Phone #</span>
                <input type="text" />
              </div>
              <div>
                <button>Reset Password Link</button>
              </div>
            </div>
            )}
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
  lastTransactionView: PropTypes.bool,
  name: PropTypes.string,
  passwordResetView: PropTypes.bool,
};
