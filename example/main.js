import ReactDOM from 'react-dom'
import './main.less'
import keymap from './keymap'
import App from './app'
import { ShortcutManager } from '../src'

let shortcutManager = new ShortcutManager(keymap)

// Just for testing
window.shortcutManager = shortcutManager

let element = React.createElement(App, {shortcuts: shortcutManager})
ReactDOM.render(element, document.getElementById('app'))
