/**
 * BHHT Datascape Application Component
 * =====================================
 *
 * Root component of the application.
 */
import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import MacroView from './views/macro/MacroView';

export default function Application() {
  return (
    <div id="application">

      <HashRouter>
        <div className="container is-fluid">
          <Route exact path="/" component={MacroView} />
        </div>
      </HashRouter>
    </div>
  );
}

// <nav className="nav">
//   <div className="container is-fluid">
//     <div className="nav-left">
//       <a className="nav-item">
//         A Brief History of Human Time
//       </a>
//     </div>
//   </div>
// </nav>
