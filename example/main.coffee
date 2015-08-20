require './main.less'
keymap = require './keymap'
App = require './app'
ShortcutsManager = require '../lib'

shortcutsManager = new ShortcutsManager(keymap)

window.shortcutsManager = shortcutsManager

React.render(React.createElement(App, shortcuts: shortcutsManager), document.getElementById('app'))
