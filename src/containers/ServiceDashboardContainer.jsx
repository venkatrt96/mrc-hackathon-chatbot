import { connect } from 'react-redux';
import ServiceDashboard from 'components/ServiceDashboard';
import {
  joinChat, sendMessage, fetchUsers, fetchMessages,
} from 'actions/chatAction';

const mapStateToProps = (state) => {
  return {
    username: state.accountReducer.name,
    email: state.accountReducer.email,
    groupName: state.accountReducer.groupName,
    messages: state.chatReducer.messages,
    users: state.chatReducer.users,
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

const ServiceDashboardContainer = connect(mapStateToProps, mapDispatchToProps)(ServiceDashboard);

export default ServiceDashboardContainer;
