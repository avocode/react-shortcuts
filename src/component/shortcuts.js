import React from 'react'
import ReactDOM from 'react-dom'
import invariant from 'invariant'
import Combokeys from 'combokeys'

let shortcuts = React.createFactory('shortcuts')


export default class extends React.Component {
  static displayName = 'Shortcuts'

  static contextTypes = {
    shortcuts: React.PropTypes.object.isRequired
  }

  static propTypes = {
    handler: React.PropTypes.func,
    name: React.PropTypes.string,
    tabIndex: React.PropTypes.number,
    className: React.PropTypes.string,
    eventType: React.PropTypes.string,
    stopPropagation: React.PropTypes.bool,
    preventDefault: React.PropTypes.bool,
    targetNodeSelector: React.PropTypes.string,
    global: React.PropTypes.bool,
    isolate: React.PropTypes.bool
  }

  static defaultProps = {
    tabIndex: null,
    className: null,
    eventType: null,
    stopPropagation: true,
    preventDefault: false,
    targetNodeSelector: null,
    global: false,
    isolate: false
  }

  // NOTE: combokeys must be instance per component
  _combokeys = null

  _lastEvent = null

  _bindShortcuts = (shortcutsArr) => {
    let element = this._getElementToBind()
    element.setAttribute('tabindex', this.props.tabIndex || -1)
    this._combokeys = new Combokeys(element)
    this._decorateCombokeys()
    this._combokeys.bind(shortcutsArr, this._handleShortcuts, this.props.eventType)

    if (this.props.global) {
      element.addEventListener('shortcuts:global', this._customGlobalHandler)
    }
  }

  _customGlobalHandler = (e) => {
    let { character, modifiers, event } = e.detail

    let targetNode = null
    if (this.props.targetNodeSelector) {
      targetNode = document.querySelector(this.props.targetNodeSelector)
    }

    if (e.target !== ReactDOM.findDOMNode(this) && e.target !== targetNode) {
      this._combokeys.handleKey(character, modifiers, event, true)
    }
  }

  _decorateCombokeys = () => {
    let element = this._getElementToBind()
    let originalHandleKey = this._combokeys.handleKey.bind(this._combokeys)

    // NOTE: stopCallback is a method that is called to see
    // if the keyboard event should fire
    this._combokeys.stopCallback = function(event, element, combo) {
      let isInputLikeElement = element.tagName === 'INPUT' ||
        element.tagName === 'SELECT' || element.tagName === 'TEXTAREA' ||
          (element.contentEditable && element.contentEditable === 'true')
        var isReturnString;
        if (event.key !== undefined) {
          isReturnString = event.key && event.key.length === 1;
        } else { // safari doesn't support KeyboardEvent.key
          isReturnString = (typeof event.which == "number") ? event.which : event.keyCode
        }
      
      if (isInputLikeElement && isReturnString) {
        return true
      }

      return false
    }

    this._combokeys.handleKey = (character, modifiers, event, isGlobalHandler) => {
      if (this._lastEvent && event.timeStamp === this._lastEvent.timeStamp && event.type === this._lastEvent.type) { return }
      this._lastEvent = event

      if (this.props.isolate) {
        event.__isolateShortcuts = true
      }

      if (!isGlobalHandler) {
        element.dispatchEvent(new CustomEvent('shortcuts:global', {
          detail: {character, modifiers, event},
          bubbles: true,
          cancelable: true
        }))
      }

      // NOTE: works normally if it's not an isolated event
      if (!event.__isolateShortcuts) {
        if (this.props.preventDefault) { event.preventDefault() }
        if (this.props.stopPropagation && !isGlobalHandler) { event.stopPropagation() }
        originalHandleKey(character, modifiers, event)
        return
      }

      // NOTE: global shortcuts should work even for an isolated event
      if (this.props.global || this.props.isolate) {
        originalHandleKey(character, modifiers, event)
      }
    }
  }

  _getElementToBind = () => {
    let element = null
    if (this.props.targetNodeSelector) {
      element = document.querySelector(this.props.targetNodeSelector)
      invariant(element, `Node selector '${this.props.targetNodeSelector}'  was not found.`)
    } else {
      element = ReactDOM.findDOMNode(this)
    }

    return element
  }

  _unbindShortcuts = () => {
    if (this._combokeys) {
      this._combokeys.detach()
      this._combokeys.reset()
    }
  }

  _onUpdate = () => {
    let shortcutsArr = this.props.name && this.context.shortcuts.getShortcuts(this.props.name)
    this._unbindShortcuts()
    this._bindShortcuts(shortcutsArr || [])
  }

  componentDidMount() {
    this._onUpdate()

    if (this.props.name) {
      this.context.shortcuts.addUpdateListener(this._onUpdate)
    }
  }

  componentWillUnmount() {
    this._unbindShortcuts()

    if (this.props.name) {
      this.context.shortcuts.removeUpdateListener(this._onUpdate)
    }

    if (this.props.global) {
      let element = this._getElementToBind()
      element.removeEventListener('shortcuts:global', this._customGlobalHandler)
    }
  }

  _handleShortcuts = (event, keyName) => {
    if (this.props.name) {
      let shortcutName = this.context.shortcuts.findShortcutName(keyName, this.props.name)

      if (this.props.handler) {
        this.props.handler(shortcutName, event)
      }
    }
  }

  render() {
    return (
      shortcuts({
        tabIndex: this.props.tabIndex || -1,
        className: this.props.className
      }, this.props.children)
    )
  }
}
