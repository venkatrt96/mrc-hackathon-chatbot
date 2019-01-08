import { connect } from 'react-redux';
import App from 'components/App';
import { fetchMessages } from 'actions/chatAction';
import { fetchAccount } from 'actions/fetchAccountAction';

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMessages: () => dispatch(fetchMessages()),
    fetchAccount: () => dispatch(fetchAccount()),
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
