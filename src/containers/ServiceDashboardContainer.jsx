import { connect } from 'react-redux';
import ServiceDashboard from 'components/ServiceDashboard';
import { joinChat, sendMessage, fetchUsers } from 'actions/chatAction';

const mapStateToProps = (state) => {
  return {
    username: state.accountReducer.name,
    email: state.accountReducer.email,
    groupName: state.accountReducer.groupName,
    messages: state.chatReducer.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsers: () => dispatch(fetchUsers()),
    joinChat: payload => dispatch(joinChat(payload)),
    sendMessage: payload => dispatch(sendMessage(payload)),
  };
};

const ServiceDashboardContainer = connect(mapStateToProps, mapDispatchToProps)(ServiceDashboard);

export default ServiceDashboardContainer;
