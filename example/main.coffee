require './main.less'
keymap = require './keymap'
App = require './app'
ShortcutManager = require '../lib'

shortcutManager = new ShortcutManager(keymap)

window.shortcutManager = shortcutManager

React.render(React.createElement(App, shortcuts: shortcutManager), document.getElementById('app'))
