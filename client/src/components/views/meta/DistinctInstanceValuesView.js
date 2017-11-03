/**
 * BHHT Datascape Distinct Instance Values View Component
 * =======================================================
 *
 * A simple view displaying distinct instance values attached to location.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {loadDistinctInstanceValues} from '../../../modules/meta';

/**
 * Connector.
 */
const enhance = compose(
  connect(
    state => {
      return {
        values: state.meta.distinctInstanceValues
      };
    },
    dispatch => {
      return {
        actions: bindActionCreators({
          loadDistinctInstanceValues
        }, dispatch)
      };
    }
  )
);

/**
 * Main component.
 */
class DistinctInstanceValuesView extends Component {
  componentDidMount() {
    if (!this.props.values)
      this.props.actions.loadDistinctInstanceValues();
  }

  render() {
    const {values} = this.props;

    return (
      <div>
        <h1 className="title">
          Distinct Instance Values
        </h1>
        <p>
          <em>
            Wikidata links location page as being instance of entities. You can
            thus find a list of those entities and their weight thereafter:
          </em>
        </p>
        <hr />
        {values ? (
          <table>
            <thead>
              <tr>
                <th>Entity Label</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {values.map(value => {
                return (
                  <tr key={value.label}>
                    <td>{value.label}</td>
                    <td>{value.weight}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : 'Loading...'}
      </div>
    );
  }
}

export default enhance(DistinctInstanceValuesView);
