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

class ServiceDashboard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      receiverId: '',
      users: [],
      message: '',
      messages: [],
      chatOpen: false,
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.props.fetchUsers();
    this.updateState(this.props);
    this.updateSocket();
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(nextProps);
    this.updateSocket();
  }

  componentDidUpdate() {
    if (this.chatLogHolder) {
      this.chatLogHolder.scrollTop = this.chatLogHolder.scrollHeight;
    }
  }

  updateState(props) {
    this.setState({
      users: props.users,
      messages: props.messages,
    });
  }

  updateSocket() {
    socket.on('chatUsers', (data) => {
      if (data && data.users) {
        this.setState({ users: data.users });
      }
    });
  }

  handleKeyPress(event, id, username) {
    const message = event.target.value;
    if (isEqual(event.key, 'Enter') && !isEqual(message, '')) {
      this.props.sendMessage({
        sender: {
          id,
          username,
        },
        message,
      });
      this.setState({ message: '' });
    }
  }

  handleTextChange(event) {
    const message = event.target.value;
    this.setState({ message });
  }

  payloadResponse(id, reply) { // eslint-disable-line
    const { payloadType, payloadContent } = reply; // eslint-disable-line
    const options = map((payloadContent[payloadContent.kind].values), (option, index) => {
      return (
        <button
          key={index}
          disabled
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
    const { receiverId, messages } = this.state;
    return (
      map((messages), (value, index) => {
        const { sender, message } = value;
        const { username } = sender;
        const userTextFlag = !isEqual(username, 'BOT') && !username.includes('SERVICER');
        const payloadReceivedFlag = isEqual(username, 'BOT') && isObject(message);
        const textReceivedFlag = (username.includes('SERVICER') || isEqual(username, 'BOT'))
        && isString(message);
        return (
          <div key={index} className="ChatLog">
            {userTextFlag
            && (
            <span key={`${index}_${value}_Bot`} className="ChatTextFromUser">
              {message}
            </span>
            )
          }
            {payloadReceivedFlag
            && (
            <div key={`${index}_${value}_Bot`} className="ChatTextFromBotOpts">
              {this.payloadResponse(receiverId, message)}
            </div>
            )
          }
            {textReceivedFlag
            && (
            <span key={`${index}_${value}_User`} className="ChatTextFromBot">
              {message}
            </span>
            )
          }
          </div>
        );
      })
    );
  }

  chatWindow() {
    const { username } = this.props;
    const { message, receiverId } = this.state;
    return (
      <div className="ChatHolder">
        <div className="ChatHolderHeader">
          <div className="ChatImg">
            <img alt="No ChatLogo" src={ChatLogo} />
          </div>
          <span className="ChatName">Cooper Bot</span>
        </div>
        <div
          ref={(chatLogHolder) => { this.chatLogHolder = chatLogHolder; }}
          className="ChatLogHolder"
        >
          {this.chatlog()}
        </div>

        <div className="ChatInput">
          <div className="InputControls">
            {username && (
            <input
              onChange={this.handleTextChange}
              onKeyPress={e => this.handleKeyPress(e, receiverId, `SERVICER-${this.props.username}`)}
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
    const {
      users, receiverId,
    } = this.state;
    return (
      <div>
        <div className="ActiveUsersHolder">
          <span className="ActiveUsersHeading">Online Users</span>
          {map(users, (user, key) => {
            return (
              <div key={key} className="ActiveUsers">
                <span>
                  {user.username}
                </span>

                <button onClick={() => {
                  if (!isEqual(receiverId, user.id)) {
                    socket.emit('unsubscribe', receiverId);
                  }
                  this.props.fetchMessages(user.id);

                  this.setState({
                    receiverId: user.id,
                  });
                  socket.emit('subscribe', user.id);

                  socket.on('send', (data) => {
                    this.setState({ messages: data });
                  });
                }}
                >
                  Join
                </button>
              </div>
            );
          })}
        </div>
        <div className="ChatBot">
          {/* {receiverId && map(messages, (messageObject, key) => {
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

          {receiverId && this.state.chatOpen && this.chatWindow()}
          {/* {receiverId && (
          <input
            onChange={this.handleTextChange}
            onKeyPress={e => this.handleKeyPress(e, receiverId, `SERVICER-${this.props.username}`)}
            placeholder="Leave a message"
            type="text"
            value={message}
          />
          )} */}
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
      </div>
    );
  }
}

export default ServiceDashboard;

ServiceDashboard.propTypes = {
  fetchMessages: PropTypes.func,
  fetchUsers: PropTypes.func,
  messages: PropTypes.array, // eslint-disable-line
  sendMessage: PropTypes.func,
  unreadTexts: PropTypes.number,
  username: PropTypes.string,
  users: PropTypes.array, // eslint-disable-line
};
