import { connect } from 'react-redux';
import UserDashboard from 'components/UserDashboard';
import {
  joinChat, sendMessage, fetchUsers, fetchMessages,
} from 'actions/chatAction';
import { fetchBotResponse } from 'actions/dialogflowAction';

const mapStateToProps = (state) => {
  return {
    username: state.accountReducer.name,
    id: state.accountReducer.email,
    groupName: state.accountReducer.groupName,
    messages: state.chatReducer.messages,
    unreadTexts: state.dialogflowReducer.unreadTexts,
    dialogflowResponse: state.dialogflowReducer.dialogflowResponse,
    help: state.dialogflowReducer.help,
    lastTransactionView: state.miscReducer.lastTransactionView,
    passwordResetView: state.miscReducer.passwordResetView,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    joinChat: payload => dispatch(joinChat(payload)),
    sendMessage: payload => dispatch(sendMessage(payload)),
    fetchMessages: payload => dispatch(fetchMessages(payload)),
    fetchBotResponse: payload => dispatch(fetchBotResponse(payload)),
  };
};

const UserDashboardContainer = connect(mapStateToProps, mapDispatchToProps)(UserDashboard);

export default UserDashboardContainer;
