import { connect } from 'react-redux';
import Dashboard from 'components/Dashboard';
import { joinChat, sendMessage, fetchUsers } from 'actions/chatAction';

const mapStateToProps = (state) => {
  return {
    name: state.accountReducer.name,
    email: state.accountReducer.email,
    groupName: state.accountReducer.groupName,
    messagesLoading: state.chatReducer.messagesLoading,
    messagesLoaded: state.chatReducer.messagesLoaded,
    messages: state.chatReducer.messages,
    messagesError: state.chatReducer.messagesError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    joinChat: payload => dispatch(joinChat(payload)),
    sendMessage: payload => dispatch(sendMessage(payload)),
  };
};

const DashboardContainer = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default DashboardContainer;
