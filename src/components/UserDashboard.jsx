import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Chat from 'components/common/Chat';
import { socket } from 'utils';
import Table from 'components/common/Table';
import MrCooperLogo from '../images/logoWhite.png';

class UserDashboard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      message: '',
      messages: [],
      chatOpen: false,
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.props.joinChat({
      id: this.props.id,
      username: this.props.username,
    });
    if (this.props.id) {
      this.props.fetchMessages(this.props.id);
    }
    this.welcomeAction();
    this.updateSocket(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateSocket(nextProps);
    // this.updateState(nextProps);
  }

  updateState(props) {
    this.setState({
      messages: props.messages,
    });
  }

  updateSocket(payload) { // eslint-disable-line
    socket.emit('subscribe', payload.id);
    socket.on('send', (data) => {
      this.setState({ messages: data });
    });
  }

  welcomeAction() {
    this.props.fetchBotResponse({
      sessionID: this.props.id,
      userInput: 'Hi',
    });
    this.props.fetchBotResponse({
      sessionID: this.props.id,
      userInput: 'i have a Payment related Issue',
    });
  }

  clearMessage() {
    this.setState({ message: '' });
  }

  handleKeyPress(event) {
    const message = event.target.value;
    const { id, username } = this.props;
    if (isEqual(event.key, 'Enter') && !isEqual(message, '')) {
      this.props.sendMessage({
        sender: {
          id,
          username,
        },
        message,
      });
      if (!this.props.help) {
        this.props.fetchBotResponse({
          sessionID: id,
          userInput: message,
        });
      }
      this.clearMessage();
    }
  }

  handleTextChange(event) {
    const message = event.target.value;
    this.setState({ message });
  }

  render() {
    const {
      fetchBotResponse, sendMessage, unreadTexts, username, id, lastTransactionView, passwordResetView,
    } = this.props;
    const {
      chatOpen, help, message, messages,
    } = this.state;
    return (
      <div className="container">
        <div className="Header">
          <img alt="Mr. Cooper" className="MrCooperLogo" src={MrCooperLogo} />
          <span>/ Paybot</span>
        </div>
        <div className="LogContainer">
          <div className="Heading">
            <span className="Title">{`Welcome ${username}`}</span>
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
            <div className="Login">
              <input placeholder="Loan #" type="text" />
              <input placeholder="SSN" type="text" />
              <input placeholder="DOB" type="text" />
              <input placeholder="Phone #" type="text" />
              <button>Reset Password Link</button>
            </div>
            )}
          </div>
          <Chat
            fetchBotResponse={fetchBotResponse}
            handleKeyPress={this.handleKeyPress}
            handleMessageChange={this.handleTextChange}
            help={help}
            id={id}
            message={message}
            messages={messages}
            open={chatOpen}
            sendMessage={sendMessage}
            toggleChat={() => {
              this.setState({
                chatOpen: !chatOpen,
              });
            }}
            unreadTexts={unreadTexts}
            userFlag
            username={username}
          />
        </div>
      </div>
    );
  }
}

export default UserDashboard;

UserDashboard.propTypes = {
  fetchBotResponse: PropTypes.func,
  fetchMessages: PropTypes.func,
  help: PropTypes.bool,
  id: PropTypes.string,
  joinChat: PropTypes.func,
  lastTransactionView: PropTypes.bool,
  messages: PropTypes.array, // eslint-disable-line
  passwordResetView: PropTypes.bool,
  sendMessage: PropTypes.func,
  unreadTexts: PropTypes.number,
  username: PropTypes.string,
};
