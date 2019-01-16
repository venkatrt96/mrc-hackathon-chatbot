import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import ChatIcon from '@material-ui/icons/ChatBubble';
import ChatClose from '@material-ui/icons/Close';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';
import { socket } from 'utils';
import ChatLogo from 'images/ChatbotIcon.png';

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

    // Trigger Dialogflow
    this.props.fetchBotResponse({
      sessionID: this.props.id,
      userInput: 'Hi',
    });
    this.props.fetchBotResponse({
      sessionID: this.props.id,
      userInput: 'I am facing an issue',
    });
    this.updateSocket(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateSocket(nextProps);
    this.updateState(nextProps);
  }

  componentDidUpdate() {
    if (this.chatLogHolder) {
      this.chatLogHolder.scrollTop = this.chatLogHolder.scrollHeight;
    }
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
      this.setState({ message: '' });
    }
  }

  handleTextChange(event) {
    const message = event.target.value;
    this.setState({ message });
  }

  payloadResponse(reply) { // eslint-disable-line
    const { payloadType, payloadContent } = reply; // eslint-disable-line
    const { id, username } = this.props;
    const options = map((payloadContent[payloadContent.kind].values), (option, index) => {
      return (
        <button
          key={index}
          onClick={() => {
            this.props.sendMessage({
              sender: {
                id,
                username,
              },
              message: option[option.kind],
            });
            if (!this.props.help) {
              this.props.fetchBotResponse({
                sessionID: id,
                userInput: option[option.kind],
              });
            }
          }}
        >
          {option[option.kind]}
        </button>
      );
    });
    return (
      <div className="ChatTextFromBotOptsHolder">
        {isEqual(payloadType[payloadType.kind], 'collection') && options}
      </div>
    );
  }

  chatlog() {
    const { messages } = this.state;
    return (
      map((messages), (value, index) => {
        const { sender, message } = value;
        const { username } = sender;
        const userTextFlag = !isEqual(username, 'BOT') && !username.includes('SERVICER');
        const payloadReceivedFlag = isEqual(username, 'BOT') && isObject(message);
        const textReceivedFlag = (username.includes('SERVICER') || isEqual(username, 'BOT'))
        && isString(message);
        const alert = isObject(message) && message.type && isEqual(message.type, 'ALERT');
        return (
          <div key={index} className="ChatLog">
            {userTextFlag && !alert
            && (
            <span key={`${index}_${value}_Bot`} className="ChatTextFromUser">
              {message}
            </span>
            )
          }
            {payloadReceivedFlag
            && (
            <div key={`${index}_${value}_Bot`} className="ChatTextFromBotOpts">
              {this.payloadResponse(message)}
            </div>
            )
          }
            {textReceivedFlag && !alert
            && (
            <span key={`${index}_${value}_User`} className="ChatTextFromBot">
              {message}
            </span>
            )
          }
            {alert && <span key={`${index}_${value}_User`} className="ChatTextAlert">{message.content}</span>}
          </div>
        );
      })
    );
  }

  chatWindow() {
    const { username } = this.props;
    const { message } = this.state;
    return (
      <div className="ChatHolder">
        <div className="ChatHolderHeader">
          <div className="ChatImg">
            <img alt="No ChatLogo" src={ChatLogo} />
          </div>
          <span className="ChatName">Pay Bot</span>
        </div>
        <div
          ref={(chatLogHolder) => { this.chatLogHolder = chatLogHolder; }}
          className="ChatLogHolder"
        >
          {this.chatlog()}
        </div>
        {/* {map(messages, (messageObject, key) => {
          return (
            <div key={key}>
              <span>
                {messageObject.sender && messageObject.sender.username}
                {' : '}
              </span>
              <span>{messageObject.message}</span>
            </div>
          );
        })} */}
        <div className="ChatInput">
          <div className="InputControls">
            {username && (
            <input
              onChange={this.handleTextChange}
              onKeyPress={this.handleKeyPress}
              placeholder="Leave a message"
              type="text"
              value={message}
            />
            )}

          </div>
          <div className="AddOns">
            <InsertEmoticon className="EmoticonButton" />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="ChatBot">
        {this.state.chatOpen && this.chatWindow()}
        <div className="ChatBotIconHolder">
          <button
            className="ChatButton"
            onClick={() => {
              this.setState({
                chatOpen: !this.state.chatOpen,
              });
            }}
          >
            {this.state.chatOpen ? <ChatClose />
              : (
                <div>
                  {this.props.unreadTexts > 0 && <span className="unread">{this.props.unreadTexts}</span>}
                  <ChatIcon />
                </div>
              )}
          </button>
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
  messages: PropTypes.array, // eslint-disable-line
  sendMessage: PropTypes.func,
  unreadTexts: PropTypes.number,
  username: PropTypes.string,
};
