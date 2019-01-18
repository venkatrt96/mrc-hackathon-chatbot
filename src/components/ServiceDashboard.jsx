import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';
import { socket } from 'utils';
import AgentChat from 'components/common/AgentChat';
import Location from '@material-ui/icons/LocationOn';
import cImage from 'images/C.png';
import chatImage from 'images/chat.png';
import profile from 'images/profile.jpg';
import ClientProfile from 'images/client_profile.jpg';

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

  subcribeAndGetMessages(user) {
    this.setState({
      receiverId: user.id,
      receiverName: user && user.username && user.username,
    });

    socket.emit('subscribe', user.id);
    socket.on('send', (data) => {
      this.setState({ messages: data });
    });
  }

  subscribeToChatRoom(user) {
    const {
      sendMessage, username, fetchMessages,
    } = this.props;
    const { receiverId } = this.state;
    if (!isEqual(receiverId, user.id)) {
      this.unsubscribeRoom(receiverId);
    }

    fetchMessages(user.id);
    this.subcribeAndGetMessages(user);

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
  }

  unsubscribeRoom(receiverId) { // eslint-disable-line
    socket.emit('unsubscribe', receiverId);
    this.setState({
      receiverId: '',
      receiverName: '',
    });
  }

  render() {
    const {
      sendMessage, username,
    } = this.props;
    const {
      message, messages, users, receiverId, receiverName,
    } = this.state;
    return (
      <div className="container">
        <div className="RowContainer">
          <div className="AgentSideBar">
            <img alt="-" className="CLogo" src={cImage} />
            <div className="ChatImage">
              <img alt="-" src={chatImage} />
            </div>
          </div>
          <div className="LogContainer">
            <div className="Tabs">
              {receiverId && (
              <div className="UserButton">
                <span>{receiverName}</span>
                <button onClick={() => this.unsubscribeRoom(receiverId)}>
                  x
                </button>
              </div>
              )}
              <div className="SearchAndProfile">
                <input placeholder="Search" type="text" />
                <img alt="" src={profile} />
              </div>
            </div>
            {!receiverId && (
            <div className="AdminPanel">
              <div className="ChatsTags">
                <div className="ChatsTagsHolder">
                  <div className="AdminPanelHeading">
                    <span className="Title">Chats</span>
                    <span className="Count">5</span>
                  </div>
                  <div className="AdminPanelSubMenu">
                    <span className="Title">Live Chats</span>
                    <span className="Count">2</span>
                  </div>
                  <div className="AdminPanelSubMenu">
                    <span className="Title">Unanswered Chats</span>
                    <span className="Count">3</span>
                  </div>
                  <div className="AdminPanelSubMenu">
                    <span className="Title">Chat History</span>
                  </div>
                </div>
                <div className="ChatsTagsHolder">
                  <div className="AdminPanelHeading">
                    <span className="Title">Tags</span>
                  </div>
                  <div className="AdminPanelSubMenu">
                    <span className="Title"># Payment</span>
                  </div>
                  <div className="AdminPanelSubMenu">
                    <span className="Title"># Escrow</span>
                  </div>
                  <div className="AdminPanelSubMenu">
                    <span className="Title"># Password Reset</span>
                  </div>
                  <div className="AdminPanelSubMenu">
                    <span className="Title"># Account Status</span>
                  </div>
                </div>
              </div>
              <div className="ActiveUsersHolder">
                <table className="UsersTable">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Conversation</th>
                      <th>Tag</th>
                      <th>Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {map(users, (user, key) => {
                      return (
                        <tr
                          key={key}
                          onClick={() => this.subscribeToChatRoom(user)}
                        >
                          <td>
                            {user.username}
                          </td>
                          <td>
                          Need my last payment transaction invoice
                          </td>
                          <td>
                          Payment
                          </td>
                          <td>
                          10 sec ago
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            )}
            {receiverId && messages && (
            <div className="AgentView">
              <div className="ChatContainer">
                <AgentChat
                  handleKeyPress={this.handleKeyPress}
                  handleMessageChange={this.handleTextChange}
                  help={false}
                  id={receiverId}
                  message={message}
                  messages={messages}
                  open
                  sendMessage={sendMessage}
                  userFlag={false}
                  username={`SERVICER-${username}`}
                />
              </div>
              <div className="UserDetails">
                <div className="UserProfile">
                  <div className="UserProfileImage">
                    <img alt="" src={ClientProfile} />
                  </div>
                  <div className="UserProfileData">
                    {receiverName && <span className="UserName">{receiverName}</span>}
                    <div className="UserLocation">
                      <Location style={{ color: '#00b4d2', marginBottom: '-5px' }} />
                      <span>Texas</span>
                    </div>
                  </div>
                </div>

                <div className="UserPersonalData">
                  <div className="Data">
                    <span className="Key">Phone</span>
                    <span className="BlueValue">+1-541-754-3010</span>
                  </div>
                  <div className="Data">
                    <span className="Key">Email ID</span>
                    <span className="BlueValue">taylor@gmail.com</span>
                  </div>
                  <div className="Data">
                    <span className="Key">Address</span>
                    <span className="Value">150 Woodsman St. Elmhurst, TX 11373</span>
                  </div>
                </div>

                <div className="UserLoanData">
                  <span className="Title">Loan Information</span>
                  <div className="LoanDataContainer">
                    <span className="Key">Loan #</span>
                    <span className="BlueValue">312029123</span>
                  </div>
                  <div className="LoanDataContainer">
                    <span className="Key">Loan Status</span>
                    <span className="BlueValue">Active</span>
                  </div>
                  <div className="LoanDataContainer">
                    <span className="Key">UPB</span>
                    <span className="DarkBlueValue">$ 344,123</span>
                  </div>
                  <div className="LoanDataContainer">
                    <span className="Key">Monthly Due</span>
                    <span className="DarkBlueValue">$ 2,301</span>
                  </div>
                  <div className="LoanDataContainer">
                    <span className="Key">Last Payment Date</span>
                    <span className="DarkBlueValue">08/10/2018</span>
                  </div>
                  <div className="LoanDataContainer">
                    <span className="Key">Next Payment Date</span>
                    <span className="DarkBlueValue">09/15/2018</span>
                  </div>
                </div>
              </div>
            </div>
            )}
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
  username: PropTypes.string,
  users: PropTypes.array, // eslint-disable-line
};
