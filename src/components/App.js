import React from 'react';

const titleStyle = {
  textAlign: 'center',
  padding: '15px'
};

export default function App() {
  return (
    <div className="container">
      <div className="columns">
        <div className="column is-2" />
        <div className="column is-8">
          <div className="content">
            <h1 style={titleStyle}>A Brief History of Human Time</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
