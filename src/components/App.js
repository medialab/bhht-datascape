import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './Home';

const titleStyle = {
  textAlign: 'center',
  padding: '25px',
  paddingBottom: '0px',
  fontSize: '2.5em',
  textDecoration: 'underline'
};

export default function App() {
  return (
    <Router>
      <div className="container">
        <div className="columns">
          <div className="column is-1" />
          <div className="column is-10">
            <div className="content">
              <h1 style={titleStyle}>A Brief History of Human Time</h1>
            </div>
            <Switch>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
        <footer className="footer">
          <div className="content has-text-centered">Footer</div>
        </footer>
      </div>
    </Router>
  );
}
