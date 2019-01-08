import React, { PureComponent } from 'react'; //eslint-disable-line
import PropTypes from 'prop-types';

class App extends PureComponent {
  componentDidMount() {
    this.props.fetchAccount();
  }

  render() {
    return (
      this.props.children
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  fetchAccount: PropTypes.func,
};

export default App;
