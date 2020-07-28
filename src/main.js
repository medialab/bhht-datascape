import React from 'react';
import {render} from 'react-dom';
import App from './components/App';
import manager from './assets';

import './style/main.scss';

const container = document.getElementById('app');

render(<App />, container);

window.manager = manager;
