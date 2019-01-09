import { connect } from 'react-redux';
import UserDashboard from 'components/UserDashboard';
import {
  joinChat, sendMessage, fetchUsers, fetchMessages,
} from 'actions/chatAction';

const mapStateToProps = (state) => {
  return {
    username: state.accountReducer.name,
    id: state.accountReducer.email,
    groupName: state.accountReducer.groupName,
    messages: state.chatReducer.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    joinChat: payload => dispatch(joinChat(payload)),
    sendMessage: payload => dispatch(sendMessage(payload)),
    fetchMessages: payload => dispatch(fetchMessages(payload)),
  };
};

const UserDashboardContainer = connect(mapStateToProps, mapDispatchToProps)(UserDashboard);

export default UserDashboardContainer;
