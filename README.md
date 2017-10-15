React Shortcuts
=========

**Manage keyboard shortcuts from one place; inspired by [Atom Keymap].**

[![Build Status](https://travis-ci.org/avocode/react-shortcuts.svg)][travis]


## The problems React Shortcut solves

Managing keyboard shortcuts can sometimes get messy. Or always, if not implemented the right way.

Real problems:

- You can't easily tell which shortcut is bound to which component
- You have to write a lot of boilerplate code (`addEventListeners`, `removeEventListeners`, ...)
- Memory leaks are a real problem if components don’t remove their listeners properly
- Platform specific shortcuts is another headache
- It's more difficult to implement feature like user-defined shortcuts
- You can't easily get all the application shortcuts and display it (e.g. in settings)


## React shortcuts to the rescue!

With `react-shortcuts` you can declaratively manage shortcuts for each one of your React components.

**Important parts of React Shortcuts:**

- Your `keymap` definition
- `ShortcutManager` which handles `keymap`
- `<Shortcut>` component for handling shortcuts


## Online demo

[![Edit l40jjo48nl](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/l40jjo48nl)


## Installation

```
npm install react-shortcuts --save
```


## Getting started

#### Define application shortcuts

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

- **Namespace** should ideally be the component’s `displayName`.
- **Action** describes what will be happening. For example `MODAL_CLOSE`.
- **Keyboard shortcut** can be a string, array of strings or an object which
  specifies platform differences (Windows, OSX, Linux, other). The
  shortcut may be composed of single keys (`a`, `6`,…), combinations
  (`command+shift+k`) or sequences (`up up down down left right left right B A`).

> **Combokeys** is used under the
  hood for handling the shortcuts. [Read more][mousetrap] about how you can
  specify keys.


###### Example `keymap` definition:


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

#### Rise of the ShortcutsManager

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

#### Include `shortcutManager` into getChildContext of some parent component. So that `<shortcuts>` can receive it.

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

#### Require the \<Shortcuts\> component

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

> The `<Shortcuts>` component creates a `<div>` element in HTML, binds
  listeners and adds a `tabindex` attribute to the element so that it’s focusable.
  `_handleShortcuts` is invoked when some of the defined shortcuts fire.

## How it works

`react-shortcuts` passes key events to the closest `<Shortcuts>` parent of the browser element that is currently focused.

If the `<Shortcuts>`'s `name` prop matches a **namespace** in the specified keymap *and* the keys pressed match a corresponding **keyboard shortcut**, the **action** is passed to the `handler` function.

It's in this `handler` function that you can specify what should happen as a result of the shortcut being activated.

### Order used to match actions

Actions are **not** matched by the order that they appear in the keymap, but instead in the order that `<Shortcuts>` are mounted in the DOM. This means:

* Child `<Shortcuts>` are matched before their parents
* Sibling `<Shortcuts>` that appear earlier in the list are matched before those that appear at the end

## Default keyboard shortcuts

These events occur by default, when no explicit values are passed to `stopPropagation` or `global`.

### Triggering keyboard shortcuts

The `<div>` rendered by a `<Shortcuts>` tag, or one of its children, must be focused in order for that `<Shortcuts>` handler to be called. If a parent element of a `<Shortcuts>` tag is focused when keys are pressed, the event will **not** be passed to the specified handler.

### Event propagation

If a keypress does not match a shortcut in the current namespace, it will propagate to parent and sibling namespaces according to the [order used to match actions](#order-used-to-match-actions) until the first match is found (if any).

By default, when the keypress is matched to a shortcut, the corresponding handler will be called and the event will **not** be propagated to any other matching handlers.

## Propagating keyboard shortcuts

You can tell `<Shortcuts>` to propagate matched events to parents and siblings (and not stop at the first match) by explicitly defining `stopPropagation`.

```javascript
<Shortcuts name='TODO_ITEM' stopPropagation={ false } handler={ myHandler }>
    // ...
</Shortcuts>
```

### Triggering keyboard shortcuts

Like default events, child `<Shortcuts>` handlers will not be called if it is a parent that is focused at the time the keyboard shortcuts are activated.

### Event propagation

The [order used to match actions](#order-used-to-match-actions) is still used, but when a matching action is found, it continues to be applied until all ancestor and sibling `<Shortcuts>` with matching actions have had their handlers called.


## Global keyboard shortcuts

You can tell `<Shortcuts>` to call its handler for a matching keyboard shortcut when it, or any of its children, are in focus (regardless of whether their is a more direct `<Shorcuts>` parent) using the `global` prop.

```javascript
<Shortcuts name='TODO_ITEM' global handler={ myHandler }>
    // ...
</Shortcuts>
```

### Triggering keyboard shortcuts

As long as the element currently focused is enclosed by a `<Shortcuts global ... >`, the handler will be called.

If you want to ensure keyboard shortcuts are applicable throughout your entire application, place `<Shortcuts global ... >` towards the root of your render tree so it encloses all focusable elements in the document.

### Event propagation

Matching global keyboard shortcut handlers are called *before* non-global shortcuts and they do **not** propagate.

If you have multiple matching global keyboard shortcuts defined, the [order used to match actions](#order-used-to-match-actions) is applied to establish which global keyboard shortcut is effective. There is no way to propogate such events to any other matching global shortcut, beyond the first match.

Once the handler for the first matching global keyboard shortcut has been called (if any), matching non-global keyboard shortcuts are activated according to the [order used to match actions](#order-used-to-match-actions).

## Integrating with existing onKey handlers

By default `react-shortcuts` will capture key events - both matching and not - before they reach React's event system. This means that any existing React elements with `onKeyDown`, `onKeyUp` or `onKeyPress` handlers that are ancestors or descendents of `<Shortcuts>` will not receive these events.

If you don't want this behaviour, you can use the `isolate` prop to instruct `react-shortcuts` to allow these key events to propagate to React's event system. React's event handlers will be called *after* `react-shortcut`'s, irrespective of whether they are closer to the event's `target` than `<Shortcuts>`, or not.

```javascript
<Shortcuts name='TODO_ITEM' isolate handler={ myHandler }>
    // ...
</Shortcuts>
```

One common situation where this is necessary is when you have `<Shortcuts>` wrapping a controlled `<input>` element, or some other form element, and need to respond to each key event.

> Currently, `onKeyPress` handlers do not seem to be called, regardless of the value of `isolate` - consider changing to `onKeyDown` or `onKeyUp` where possible

`isolate` has no effect on event propagation *within* `react-shortcuts` own event system - for that, see [Propagating keyboard shortcuts](#propagating-keyboard-shortcuts).

## Handler function

### When a handler is called

The handler function is called when (all must be true):

* The `<div>` rendered by `<Shortcuts>`, or one of its children in the DOM, is focused
* A matching a namespace is defined in the keymap
* A keyboard shortcut is pressed that matches one defined within the matching namespace
* None of the conditions for [when a handler is NOT called](#when-a-handler-is-not-called) are true

### When a handler is NOT called

The handler function is **not** called when (any can be true):

* The `<div>` rendered by `<Shortcuts>`, or one of its children in the DOM, are not focused
* There are no namespaces in the keymap that match the `<Shortcuts>`'s `name` prop
* There are no matching keyboard shortcuts defined in the matching namespace
* The action has already been matched by another shortcut (see [order used to match actions](#order-used-to-match-actions)) and the matching `<Shortcuts>` has **not** [enabled event propagation](#propagating-keyboard-shortcuts)
* It is a [global keyboard shortcut](#global-keyboard-shortcut) and it has already been matched by another global keyboard shortcut (see [order used to match actions](#order-used-to-match-actions)).

## `<Shortcuts>` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` |  string |  | Keyboard shortcuts' namespace - must match one specified in keymap file. (See [Define application shortcuts](#define-application-shortcuts)) |
|`handler` |  func |  | Callback function fired when a matching shortcut occurs. (See [Handler function](#handler-function)) |
| `tabIndex` | number | `-1` |  Determines element's `tabindex` HTML attribute. (See [Tab order](#tab-order)) |
| `className` | string | | HTML `class` attribute |
| `eventType` | string | `keydown`| What input event to listen to (keyup, keydown, keypress) |
| `stopPropagation` | bool | `true` | Whether to stop events that match keyboard shortcuts propagating to parent `<Shortcuts>` elements. (See [Propagating keyboard shortcuts](#propagating-keyboard-shortcuts)) |
| `isolate` | bool | `false` | Whether to stop keyboard events reaching React's event system. (See [Integrating with existing onKey handlers](#integrating-with-existing-onkey-handlers).) |
| `preventDefault` | bool | `false` | Whether to prevent the default behaviour for the keyboard event |
| `alwaysFireHandler` | bool | `false` | Whether to keep firing events on the focused input elements. |
| `targetNodeSelector` | CSS query string | | Binds listeners to the element that matches the CSS query string instead of the `<div>` created by `<Shortcuts>`. Use with caution.|
| `global` | bool | `false` | Use this when you have some global app wide shortcuts (See [Global keyboard shortcuts](#global-keyboard-shortcuts))|


## Managing focus in the browser

### Focusable elements

If you wish to support HTML4 you are limited to the following focusable elements:

* `<a>`
* `<area>`
* `<button>`
* `<input>`
* `<object>`
* `<select>`
* `<textarea>`


HTML5 allows any element with a `tabindex` attribute to receive focus.

### Tab order

If no elements have a `tabindex` in a HTML document, the browser will tab between [focusable elements](#focusable-elements) in the order that they appear in the DOM.

If there are elements with `tabindex` values greater than zero, they are iterated over first, according their `tabindex` value (from smallest to largest). Then the browser tabs over the focusable elements with a `0` or unspecified `tabindex` in the order that they appear in the DOM.

If any element is given a negative `tabindex`, it will be skipped when a user tabs through the document. However, a user may still click or touch on that element and it can be focused programmatically (see below). By default, `<Shortcuts>` elements are given a `tabindex` of `-1`.

### Programmatically manage focus

To programmatically focus an DOM element, it must meet two requirements:

* It must be a [focusable elements](#focusable-element)
* You must have a reference to it

You can get a reference to an element using React's `ref` property:


```javascript
class MyComponent extends Component {

    componentDidUpdate(prevProps) {

        if(!prevProps.isFocused && this.props.isFocused) {
            this._container.focus();
        }

    }

    render() {
        return (
            <div ref={ (c) => this._container = c } >
                My focusable content
            </div>
        )
    }

}
```

### Get the element currently in focus

You can retrieve the element that is currently focused using the following:

```javascript
document.activeElement
```

## Troubleshooting

#### Keyboard shortcut handlers are not being triggered

Check your [namespace and shortcut definitions](#define-application-shortcuts) match the keys you are pressing and and the [pre-requisites for when an keyboard event is triggered](#handler-function) are being satisfied.

#### Keyboard shortcuts for parent \<Shortcuts\> are not being triggered

Check there are no descendent `<Shortcuts>` that also have matching keyboard shortcuts and *don't* use the `stopPropagation={false}` prop. See [Propagating keyboard shortcuts](#propagating-keyboard-shortcuts) for more information).


#### Global keyboard shortcuts are not being triggered

Check that you do not have a more deeply nested `<Shortcuts>` that also defines a matching keyboard shortcut. See [Global keyboard shortcuts](#global-keyboard-shortcuts) for more information.

#### onKeyDown or onKeyUp events are no longer triggered

Use the [isolate prop](#integrating-with-existing-onkey-handlers) to re-enable them.

#### onKeyPress events are no longer triggered

Switch to using `onKeyDown` or `onKeyUp` events instead. See the [isolate prop](#integrating-with-existing-onkey-handlers)) for more information.

#### warning: possible EventEmitter memory leak detected

`react-shortcuts` use a separate listener for every `<Shortcuts>` tag used in your document. Try consolidating some of them by moving them higher up your React render tree.

[Atom Keymap]: https://github.com/atom/atom-keymap/
[travis]: https://travis-ci.org/avocode/react-shortcuts
[mousetrap]: https://craig.is/killing/mice
[keymaps]: https://github.com/atom/atom-keymap/
