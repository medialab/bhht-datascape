/**
 * BHHT Datascape Fuzzy Searcher Component
 * ========================================
 *
 * Generic component used to query the database for suggestions.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash/debounce';
import client from '../client';

/**
 * Helpers.
 */
function renderSuggestion(suggestion) {
  return (
    <div>
      {suggestion.label}
    </div>
  );
}

const getSuggestionValue = suggestion => suggestion.label;

/**
 * Main component.
 */
export default class FuzzySearcher extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: '',
      suggestions: []
    };

    this.debouncedFetchSuggestions = debounce(query => {
      this.fetchSuggestions(query);
    }, 300);

    this.onChange = this.onChange.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
  }

  fetchSuggestions(query) {
    const entityName = this.props.entityName;

    client[entityName].suggestions({data: {query}}, (err, response) => {
      if (err)
        return;

      this.setState({suggestions: response.result});
    });
  }

  onChange(event, {newValue}) {
    this.setState({value: newValue});
  }

  onSuggestionSelected(event, {suggestion}) {
    const entityName = this.props.entityName;

    this.context.history.push(`/${entityName}/${suggestion.name}`);
    this.setState({value: ''});
  }

  onSuggestionsFetchRequested({value}) {
    this.debouncedFetchSuggestions(value);
  }

  onSuggestionsClearRequested() {
    this.setState({suggestions: []});
  }

  render() {

    const inputProps = {
      className: 'input',
      placeholder: this.props.placeholder,
      onChange: this.onChange,
      value: this.state.value
    };

    return (
      <div className="control" style={this.props.style || {}}>
        <Autosuggest
          suggestions={this.state.suggestions}
          renderSuggestion={renderSuggestion}
          getSuggestionValue={getSuggestionValue}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          inputProps={inputProps} />
      </div>
    );
  }
}

FuzzySearcher.contextTypes = {
  history: PropTypes.object.isRequired
};
