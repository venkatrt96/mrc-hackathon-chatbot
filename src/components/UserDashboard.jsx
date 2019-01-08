import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import { socket } from 'utils';

class UserDashboard extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      message: '',
      messages: [],
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.props.joinChat({
      id: this.props.id,
      username: this.props.username,
    });
    this.updateMessages(this.props);
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateMessages(nextProps);
    this.updateState(nextProps);
  }

  updateMessages(props) {
    this.setState({
      messages: props.messages,
    });
  }

  updateState(payload) { // eslint-disable-line
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
      this.setState({ message: '' });
    }
  }

  handleTextChange(event) {
    const message = event.target.value;
    this.setState({ message });
  }

  render() {
    const { username } = this.props;
    const { messages, message } = this.state;
    return (
      <div>
        <div>
          {map(messages, (messageObject, key) => {
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
          <span>{username}</span>
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
      </div>
    );
  }
}

export default UserDashboard;

UserDashboard.propTypes = {
  id: PropTypes.string,
  joinChat: PropTypes.func,
  sendMessage: PropTypes.func,
  username: PropTypes.string,
};
