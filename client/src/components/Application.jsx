/**
 * BHHT Datascape Application Component
 * =====================================
 *
 * Root component of the application.
 */
import React, {Component} from 'react';
import debounce from 'lodash/debounce';
import client from '../client';

export default class Application extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: '',
      people: []
    };

    // Binding callbacks
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    client.topPeople({}, (err, response) => {
      this.setState({people: response.result});
    });
  }

  handleSearch(e) {
    const value = e.target.value;

    this.setState({value});

    if (value) {
      client.topPeople({data: {name: value}}, (err, response) => {
        this.setState({people: response.result});
      });
    }
    else {
      this.componentDidMount();
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={this.state.value}
          onChange={this.handleSearch} />
        <ul>
          {this.state.people.map(person => {
            return (
              <li key={person._id}>
                {!person._source.dead ?
                  <strong>{person._source.label}</strong> :
                  <strike>{person._source.label}</strike>} (Notoriety: {person._source.notoriety.en})
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
