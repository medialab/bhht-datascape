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

function MenuItem({children, disabled = false}) {
  return (
    <li
      style={{
        marginBottom: '8px',
        cursor: 'pointer'
      }}>
      <strong style={{color: disabled ? 'grey' : 'black'}}>{children}</strong>
    </li>
  );
}

export default function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="columns">
          <div className="column is-1" />
          <div className="column is-10">
            <div className="content">
              <Link to="/">
                <h1 style={titleStyle}>A Brief History of Human Time</h1>
              </Link>
              <p style={{textAlign: 'center'}}>
                <em>
                  <small>
                    Since the time Plutarch’s Parallel Lives was written in the
                    beginning of the second century AD and his 23 biographies
                    have survived two thousand years (or even more ancient, the
                    Epic of Gilgamesh dates back to 2000 BC), the task of
                    registering famous individuals and their influence has been
                    a recurrent field of study. Over the last few years, this
                    task has been undertaken to a much larger scale, with a
                    growing number of databases documenting history, allowing
                    statistical analysis of socio-historical facts, at a scale
                    that had never been reached so far.
                  </small>
                </em>
              </p>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-1" />

          <div className="column is-2">
            <div style={{position: 'sticky', top: '20px'}}>
              <h2
                style={{
                  borderBottom: '1px solid black',
                  fontSize: '2em',
                  marginBottom: '25px'
                }}>
                Menu
              </h2>
              <ul>
                <MenuItem disabled>Papers</MenuItem>
                <MenuItem disabled>About</MenuItem>
                <MenuItem disabled>Authors</MenuItem>
                <MenuItem>Interactive visualizations</MenuItem>
                <MenuItem disabled>Files &amp; database</MenuItem>
                <MenuItem disabled>References</MenuItem>
                <MenuItem disabled>Figures</MenuItem>
              </ul>
              <div
                style={{
                  fontSize: '0.7em',
                  textAlign: 'center',
                  marginTop: '15px'
                }}>
                <em>Work in progress...</em>
              </div>
            </div>
          </div>

          <div className="column is-8">
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
