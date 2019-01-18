import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

class AgentChat extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentDidUpdate() {
    if (this.chatLogHolder) {
      this.chatLogHolder.scrollTop = this.chatLogHolder.scrollHeight;
    }
  }

  payloadResponse(reply) { // eslint-disable-line
    const { payloadType, payloadContent } = reply; // eslint-disable-line
    const {
      id, username, sendMessage, help, fetchBotResponse, userFlag,
    } = this.props;
    const options = map((payloadContent[payloadContent.kind].values), (option, index) => {
      return (
        <button
          key={index}
          disabled={!userFlag}
          onClick={() => {
            sendMessage({
              sender: {
                id,
                username,
              },
              message: option[option.kind],
            });
            if (!help) {
              fetchBotResponse({
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
    const { messages, userFlag } = this.props;
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
            <span
              key={`${index}_${value}_Bot`}
              className={userFlag ? 'ChatTextFromUser' : 'ChatTextFromBot'}
            >
              {message}
            </span>
            )
          }
            {payloadReceivedFlag
            && (
            <div
              key={`${index}_${value}_Bot`}
              className={userFlag ? 'ChatTextFromBotOpts' : 'ChatTextFromBotOpts ChatTextFromBotOptsInverse'}
            >
              {this.payloadResponse(message)}
            </div>
            )
          }
            {textReceivedFlag && !alert
            && (
            <span
              key={`${index}_${value}_User`}
              className={userFlag ? 'ChatTextFromBot' : 'ChatTextFromUser'}
            >
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
    const {
      username, message, handleMessageChange, handleKeyPress,
    } = this.props;
    return (
      <div className="AgentChatHolder">
        <div
          ref={(chatLogHolder) => { this.chatLogHolder = chatLogHolder; }}
          className="AgentChatLogHolder"
        >
          {this.chatlog()}
        </div>

        <div className="AgentChatInput">
          <div className="InputControls">
            {username && (
            <input
              onChange={handleMessageChange}
              onKeyPress={(e) => {
                handleKeyPress(e);
              }}
              placeholder="Leave a message"
              type="text"
              value={message}
            />
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { open } = this.props;
    return (
      <div className="AgentChat">
        {open && this.chatWindow()}
      </div>
    );
  }
}

export default AgentChat;

AgentChat.propTypes = {
  fetchBotResponse: PropTypes.func,
  handleKeyPress: PropTypes.func,
  handleMessageChange: PropTypes.func,
  help: PropTypes.bool,
  id: PropTypes.string,
  message: PropTypes.string,
  messages: PropTypes.array,
  open: PropTypes.bool,
  sendMessage: PropTypes.func,
  userFlag: PropTypes.bool,
  username: PropTypes.string,
};
