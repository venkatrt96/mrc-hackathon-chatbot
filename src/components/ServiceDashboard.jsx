import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import { socket } from 'utils';

class ServiceDashboard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      receiverId: '',
      users: [],
      message: '',
      messages: [],
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

  updateState(props) {
    console.log('PROPS:', props);
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

  render() {
    const {
      users, receiverId, message, messages,
    } = this.state;
    return (
      <div>
        <div>
          {map(users, (user, key) => {
            return (
              <div key={key}>
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
                  {user.id}
                </button>

                <span>
                  {' : '}
                  {user.username}
                </span>
              </div>
            );
          })}

          {receiverId && map(messages, (messageObject, key) => {
            return (
              <div key={key}>
                <span>
                  {messageObject.sender && messageObject.sender.username}
                  {' : '}
                </span>
                <span>{messageObject.message}</span>
              </div>
            );
          })}
          {receiverId && (
          <input
            onChange={this.handleTextChange}
            onKeyPress={e => this.handleKeyPress(e, receiverId, `SERVICER-${this.props.username}`)}
            placeholder="Leave a message"
            type="text"
            value={message}
          />
          )}
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
  username: PropTypes.string,
  users: PropTypes.array, // eslint-disable-line
};
