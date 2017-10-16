import React from 'react';
import ReactDOM from 'react-dom';

import './main.less';

import keymap from './keymap';
import App from './App';

import { ShortcutManager } from '../src';

const shortcutManager = new ShortcutManager(keymap);

// Just for testing
window.shortcutManager = shortcutManager;

const element = React.createElement(App, { shortcuts: shortcutManager });
ReactDOM.render(element, document.getElementById('app'));
