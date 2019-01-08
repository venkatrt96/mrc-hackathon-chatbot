import { connect } from 'react-redux';
import Alert from 'components/common/Alert';
import { closeAlert } from 'actions/alertAction';

const mapStateToProps = (state) => {
  return {
    alerts: state.alertReducer.alerts,
    open: state.alertReducer.open,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleClose: () => dispatch(closeAlert()),
  };
};

const AlertContainer = connect(mapStateToProps, mapDispatchToProps)(Alert);

export default AlertContainer;
