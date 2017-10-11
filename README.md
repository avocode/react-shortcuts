React Shortcuts
=========

**Manage keyboard shortcuts from one place.**

[![Build Status](https://travis-ci.org/avocode/react-shortcuts.svg)][travis]


Intro
------


Managing keyboard shortcuts can sometimes get messy. Or always, if not implemented the right way.

Real problems:

- You can't easily tell which shortcut is bound to which component
- You have to write a lot of boilerplate code (`addEventListeners`, `removeEventListeners`, ...)
- Memory leaks are a real problem if components don’t remove their listeners properly
- Platform specific shortcuts is another headache
- It's more difficult to implement feature like user-defined shortcuts
- You can't easily get allthe application shortcuts and display it (e.g. in settings)


**React shortcuts to the rescue!**
-----------

With `react-shortcuts` you can declaratively manage shortcuts for each one of your React components.

**Important parts of React Shortcuts:**

- Your `keymap` definition
- `ShortcutManager` which handles `keymap`
- `<Shortcut>` component for handling shortcuts


Try online demo
-------

[![Edit l40jjo48nl](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/l40jjo48nl)


Quick tour
----------


#### 1. `npm install react-shortcuts`


#### 2. **Define application shortcuts**

Create a new JS, Coffee, JSON or CSON file wherever you want (which probably is your project root). And define the shortcuts for your React component.

**Keymap definition**

```json
{
 "Namespace": {
   "Action": "Shortcut",
   "Action_2": ["Shortcut", "Shortcut"],
   "Action_3": {
     "osx": "Shortcut",
     "windows": ["Shortcut", "Shortcut"],
     "linux": "Shortcut",
     "other": "Shortcut"
   }
 }
}
```

- `Namespace` should ideally be the component’s `displayName`.
- `Action` describes what will be happening. For example `MODAL_CLOSE`.
- `Keyboard shortcut` can be a string, array of strings or an object which
  specifies platform differences (Windows, OSX, Linux, other). The
  shortcut may be composed of single keys (`a`, `6`,…), combinations
  (`command+shift+k`) or sequences (`up up down down left right left right B A`).

> **Combokeys** is used under the
  hood for handling the shortcuts. [Read more][mousetrap] about how you can
  specify keys.


##### Example `keymap` definition:


```javascript
export default {
  TODO_ITEM: {
    MOVE_LEFT: 'left',
    MOVE_RIGHT: 'right',
    MOVE_UP: ['up', 'w'],
    DELETE: {
      osx: ['command+backspace', 'k'],
      windows: 'delete',
      linux: 'delete',
    },
  },
}

```

Save this file as `keymap.[js|coffee|json|cson]` and require it into your main
file.

```javascript
import keymap from './keymap'
```

#### 3. Rise of the ShortcutsManager

Define your keymap in whichever supported format but in the end it must be an
object. `ShortcutsManager` can’t parse JSON and will certainly not be happy
about the situation.

```javascript
import keymap from './keymap'
import { ShortcutManager } from 'react-shortcuts'

const shortcutManager = new ShortcutManager(keymap)

// Or like this

const shortcutManager = new ShortcutManager()
shortcutManager.setKeymap(keymap)
```

#### 4. Include `shortcutManager` into getChildContext of some parent component. So that `<shortcuts>` can receive it.

```javascript
class App extends React.Component {
  getChildContext() {
    return { shortcuts: shortcutManager }
  }
}

App.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
}
```

#### 5. Require the <shortcuts> component

You need to require the component in the file you want to use shortcuts in.
For example `<TodoItem>`.

```javascript
import { Shortcuts } from `react-shortcuts`

class TodoItem extends React.Component {
  _handleShortcuts = (action, event) => {
    switch (action) {
      case 'MOVE_LEFT':
        console.log('moving left')
        break
      case 'MOVE_RIGHT':
        console.log('moving right')
        break
      case 'MOVE_UP':
        console.log('moving up')
        break
      case 'COPY':
        console.log('copying stuff')
        break
    }
  }

  render() {
    return (
      <Shortcuts
        name='TODO_ITEM'
        handler={this._handleShortcuts}
      >
        <div>Make something amazing today</div>
      </Shortcuts>
    )
  }
}
```

> The `<Shortcuts>` component creates a `<shortcuts>` element in HTML, binds
  listeners and adds tabIndex to the element so that it’s focusable.
  `_handleShortcuts` is invoked when some of the defined shortcuts fire.

## Custom props for `<Shortcuts>` component

- `handler`: func
  - callback function that will fire when a shortcut occurs
- `name`: string
  - The name of the namespace specified in keymap file
- `tabIndex`: number
  - Default is `-1`
- `className`: string
- `eventType`: string
  - Just for gourmets (keyup, keydown, keypress)
- `stopPropagation`: bool
- `preventDefault`: bool
- `targetNodeSelector`: DOM Node Selector like `body` or `.my-class`
  - Use this one with caution. It binds listeners to the provided string instead
  of the component.
- `global`: bool
  - Use this when you have some global app wide shortcuts like `CMD+Q`.
- `isolate`: bool
  - Use this when a child component has React's key handler (onKeyUp, onKeyPress, onKeyDown). Otherwise, React Shortcuts stops propagation of that event due to nature of event delegation that React uses internally.
- `alwaysFireHandler`: bool
  - Use this when you want events keep firing on the focused input elements. 


## Thanks, Atom


This library is inspired by [Atom Keymap].


[Atom Keymap]: https://github.com/atom/atom-keymap/
[travis]: https://travis-ci.org/avocode/react-shortcuts
[mousetrap]: https://craig.is/killing/mice
[keymaps]: https://github.com/atom/atom-keymap/
