import React from 'react';
import {render} from 'react-dom';
import {defaultTheme as reactSelectTheme} from 'react-select';
import App from './components/App';
import manager from './assets';

import './style/main.scss';

reactSelectTheme.borderRadius = 0;
reactSelectTheme.colors.primary = '#d42a20';
reactSelectTheme.colors.primary75 = '#ff9793';
reactSelectTheme.colors.primary50 = '#ff9793';
reactSelectTheme.colors.primary25 = '#ffcbc9';

const container = document.getElementById('app');

render(<App />, container);

window.manager = manager;
