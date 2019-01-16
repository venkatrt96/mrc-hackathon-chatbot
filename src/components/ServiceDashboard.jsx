import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import { socket } from 'utils';
import Chat from 'components/common/Chat';

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

  handleKeyPress(event) {
    const message = event.target.value;
    const { receiverId } = this.state;
    const { username, sendMessage } = this.props;
    if (isEqual(event.key, 'Enter') && !isEqual(message, '')) {
      sendMessage({
        sender: {
          id: receiverId,
          username: `SERVICER-${username}`,
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

  render() {
    const {
      sendMessage, unreadTexts, username, fetchMessages,
    } = this.props;
    const {
      chatOpen, message, messages, users, receiverId,
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
                  fetchMessages(user.id);

                  this.setState({
                    receiverId: user.id,
                  });
                  socket.emit('subscribe', user.id);

                  socket.on('send', (data) => {
                    this.setState({ messages: data });
                  });

                  sendMessage({
                    sender: {
                      id: user.id,
                      username: `SERVICER-${username}`,
                    },
                    message: {
                      type: 'ALERT',
                      content: `******${username} has joined the chat******`,
                    },
                  });
                }}
                >
                  Join
                </button>
              </div>
            );
          })}
        </div>
        <Chat
          handleKeyPress={this.handleKeyPress}
          handleMessageChange={this.handleTextChange}
          help={false}
          id={receiverId}
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
          userFlag={false}
          username={`SERVICER-${username}`}
        />
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
