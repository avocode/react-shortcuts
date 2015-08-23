React Shortcuts
=========

**Manage keyboard shortcuts from one place.**

[![Build Status](https://travis-ci.org/avocode/react-shortcuts.svg)](https://travis-ci.org/avocode/react-shortcuts)


Intro
------


Managing keyboard shortcuts imperatively could be a mess.

- It can't be easily said which component bind which shortcut
- It has to be written a lot of boilerplate code (`addEventListeners`, `removeEventListeners`, ...)
- There is a potential memory leak problem when components don't `removeListeners`
- Platform specific shortcuts is another headache
- It's more difficult to implement feature like user-defined shortcuts
- It can't be easily displayed all application shortcuts (e.g. in settings)


**React shortcuts to the rescue!**
-----------

With `react-shortcuts` you can declaratively manage shortcuts for each React component.

**Important parts of React Shortcuts:**

- Your `keymap` definition
- `ShortcutManager` which handles `keymap`
- `<Shortcut>` component for handling shortcuts

**DEMO:** http://avocode.github.io/react-shortcuts/

Quick tour
----------


#### 1. `npm install react-shortcuts`


#### 2. **Define application shortcuts**

Create a new JS, Coffee, JSON or CSON file whether you want (probably in your project root). And define your shortcuts for your React component.

**Keymap definition**

```
{
 "Namespace": {
   "Action": "Shortcut",
   "Action_2": ["Shortcut", "Shortcut"],
   "Action_3": {
     "osx": "Shortcut",
     "windows": ["Shortcut", "Shortcut"],
     "linux": "Shortcut"
   }
 }
}
```

- `Namespace` should ideally be a component `displayName`.
- `Action` describes what is happening. For example `MODAL_CLOSE`.
- `Keyboard shortcut` could be defined as string, array of strings or as an object where you can specify platform differences (Windows, OSX, Linux). The shortcut may contain single keys (`a`, `6`), combinations (`command+shift+k`) or sequences (`up up`). **Mousetrap** is used under the hood for handling shortcuts. [Read more](https://craig.is/killing/mice) about how you can specify keys.

Example `keymap` definition (in CoffeeScript):

```
module.exports =
  TodoItem:
    MOVE_LEFT: 'left'
    MOVE_RIGHT: 'right'
    MOVE_UP: ['up', 'w']
    COPY:
      osx: 'command+c'
      windows: 'ctrl+c'
      linux: 'ctrl+c'
```

Save this file as `keymap.[js|coffee|json|cson]` and require it into your main file.

```
keymap = require './keymap'
```

#### 3. Rise of the ShortcutsManager

Define your `keymap` in which format you want but in the end it **must be an object**. ShortcutsManager doesn't parse JSON.

```
keymap = require './keymap'
ShortcutsManager = require 'react-shortcuts'

shortcutManager = new ShortcutsManager(keymap)

# Or like this

shortcutManager = new ShortcutsManager()
shortcutManager.setKeymap(keymap)

```

#### 4. Include shortcutManager into `getChildContext` of some parent component. So `<shortcuts>` can receive it.

```
App = React.createClass
  displayName: 'App'

  childContextTypes:
    shortcuts: React.PropTypes.object.isRequired

  getChildContext: ->
    shortcuts: shortcutManager

```

#### 5. Require `<shortcuts>` component wherever you want to use it. For example `<TodoItem>`.

```
Shortcuts = require `react-shortcuts/component`

TodoItem = React.createClass
  displayName: 'TodoItem'

  _handleShortcuts: (action) ->
    switch action
      when 'MOVE_LEFT' then console.log('moving left')
      when 'MOVE_RIGHT' then console.log('moving right')
      when 'MOVE_UP' then console.log('moving up')
      when 'COPY' then console.log('copying stuff')

  render: ->

      div className: 'todo-item',

      Shortcuts
        name: @constructor.displayName
        handler: @_handleShortcuts,

        div null,
          'Buy some milk'

```

`<Shortcuts>` component creates `<shortcuts>` element in HTML, bind listeners and add tabIndex to the element to being focusable. `_handleShortcuts` is invoked when some of the defined shortcuts fire.

Here is a list of props:

- `handler`: func.isRequired
- `name`: string.isRequired
- `element`: func (React.DOM)
  - For rendering custom element
- `tabIndex`: number
  - Default is `-1`
- `className`: string
- `eventType`: string
  - Just for gourmets
- `stopPropagation`: bool
- `trigger`: string (querySelector)
  - Use this one with caution. It binds listeners to passed string instead of <Shortcuts> component.



Thanks, Atom
-------------

This library is inspired by [Atom Keymap](https://github.com/atom/atom-keymap/).
