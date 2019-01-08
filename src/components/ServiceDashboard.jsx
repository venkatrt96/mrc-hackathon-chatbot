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
    this.updateUsers(this.props);
    this.updateState();
  }

  componentWillReceiveProps(nextProps) {
    this.updateUsers(nextProps);
    this.updateState();
    if (this.state.receiverId) {
      this.props.fetchMessages(this.state.receiverId);
    }
  }

  updateUsers(props) {
    this.setState({
      users: props.users,
    });
  }

  updateState() {
    socket.on('chatUsers', (data) => {
      this.setState({ users: data.users });
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

          {receiverId && (
          <button onClick={() => {
            this.props.sendMessage({
              sender: {
                id: receiverId,
                username: `SERVICER-${this.props.username}`,
              },
              message: 'PING',
            });
          }}
          >
            Ping
            {' '}
            {receiverId}
          </button>
          )
          }
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
  sendMessage: PropTypes.func,
  username: PropTypes.string,
};
