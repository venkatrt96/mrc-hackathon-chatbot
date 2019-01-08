import React from 'react';
import map from 'lodash/map';
import PropTypes from 'prop-types';

const Table = (props) => {
  return (
    <div className="CustomTableHolder">
      {props.title && (
      <div className="TableHeading">
        <span>{props.title}</span>
      </div>
      )}
      <table className="CustomTable">
        <thead>
          <tr>
            {map(props.head, (title, key) => {
              return (<th key={key}>{title}</th>);
            })}
          </tr>
        </thead>
        <tbody>
          {map(props.body, (row, index) => {
            return (
              <tr key={index}>
                {map(row, (content, key) => {
                  return (
                    <td
                      key={key}
                      style={props.bodyStyle && props.bodyStyle[key]
                        && props.bodyStyle[key].style(content)}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

Table.propTypes = {
  body: PropTypes.array,
  bodyStyle: PropTypes.object,
  head: PropTypes.object,
  title: PropTypes.string,
};
