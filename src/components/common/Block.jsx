import React from 'react';
import PropTypes from 'prop-types';

class Block extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { title, content, icon } = this.props;
    return (
      <div className="Block">
        {icon}
        <div className="BlockContent">
          <span className="key">{title}</span>
          <span className="value">
            {content}
          </span>
        </div>
      </div>
    );
  }
}

export default Block;

Block.propTypes = {
  content: PropTypes.string,
  icon: PropTypes.element,
  title: PropTypes.string,
};
