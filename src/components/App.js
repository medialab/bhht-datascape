import React from 'react';
import {HashRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './Home';
import People from './People';
import Separator from './Separator';

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
              <Link to="/">
                <h1 style={titleStyle}>A Brief History of Human Time</h1>
              </Link>
              <p style={{textAlign: 'center'}}><em>Work in progress...</em></p>
            </div>
            <Switch>
              <Route path="/p/:name">
                <People />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="*">
                <Separator />
                <div className="content" style={{textAlign: 'center'}}>
                  <h2>This Page Does Not Exist!</h2>
                  <h3>Sorry :(</h3>
                </div>
              </Route>
            </Switch>
          </div>
        </div>
        <footer className="footer">
          <div className="content has-text-centered" />
        </footer>
      </div>
    </Router>
  );
}
