import React from 'react';
import Home from './Home';

const titleStyle = {
  textAlign: 'center',
  padding: '25px',
  paddingBottom: '0px',
  fontSize: '2.5em',
  textDecoration: 'underline'
};

function MenuItem({id, children, disabled = false}) {
  return (
    <li
      style={{
        marginBottom: '8px',
        cursor: 'pointer'
      }}>
      <a href={`#${id}`}>
        <strong style={{color: disabled ? 'grey' : 'black'}}>{children}</strong>
      </a>
    </li>
  );
}

export default function App() {
  return (
    <div className="container-fluid">
      <div className="columns">
        <div className="column is-1" />
        <div className="column is-10">
          <div className="content">
            <h1 style={titleStyle}>A Brief History of Human Time</h1>
            <p style={{textAlign: 'center'}}>
              <em>
                <small>
                  Since the time Plutarch’s Parallel Lives was written in the
                  beginning of the second century AD and his 23 biographies have
                  survived two thousand years (or even more ancient, the Epic of
                  Gilgamesh dates back to 2000 BC), the task of registering
                  famous individuals and their influence has been a recurrent
                  field of study. Over the last few years, this task has been
                  undertaken to a much larger scale, with a growing number of
                  databases documenting history, allowing statistical analysis
                  of socio-historical facts, at a scale that had never been
                  reached so far.
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
              <MenuItem id="papers" disabled>
                Papers
              </MenuItem>
              <MenuItem id="about" disabled>
                About
              </MenuItem>
              <MenuItem id="authors" disabled>
                Authors
              </MenuItem>
              <MenuItem id="series">Time series</MenuItem>
              <MenuItem id="search">Search</MenuItem>
              <MenuItem id="database" disabled>
                Files &amp; database
              </MenuItem>
              <MenuItem id="references" disabled>
                References
              </MenuItem>
              <MenuItem id="figures" disabled>
                Figures
              </MenuItem>
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
          <Home />
        </div>
      </div>
      <footer className="footer">
        <div className="content has-text-centered" />
      </footer>
    </div>
  );
}
