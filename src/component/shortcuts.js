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
    handler: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    tabIndex: React.PropTypes.number,
    className: React.PropTypes.string,
    eventType: React.PropTypes.string,
    stopPropagation: React.PropTypes.bool,
    preventDefault: React.PropTypes.bool,
    targetNodeSelector: React.PropTypes.string,
    global: React.PropTypes.bool
  }

  static defaultProps = {
    tabIndex: null,
    className: null,
    eventType: null,
    stopPropagation: true,
    preventDefault: false,
    targetNodeSelector: null,
    global: false
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
      let isReturnString = event.key && event.key.length === 1

      if (isInputLikeElement && isReturnString) {
        return true
      }

      return false
    }

    this._combokeys.handleKey = (character, modifiers, event, isGlobalHandler) => {
      if (this._lastEvent && event.timeStamp === this._lastEvent.timeStamp && event.type === this._lastEvent.type) { return }
      this._lastEvent = event

      if (!isGlobalHandler) {
        element.dispatchEvent(new CustomEvent('shortcuts:global', {
          detail: {character, modifiers, event},
          bubbles: true,
          cancelable: true
        }))
      }

      // NOTE: works normally if it's not a React event
      if (!this._isReactEvent(event)) {
        if (this.props.preventDefault) { event.preventDefault() }
        if (this.props.stopPropagation && !isGlobalHandler) { event.stopPropagation() }
        originalHandleKey(character, modifiers, event)
        return
      }

      // NOTE: global shortcuts should work even if it's a React event
      if (this.props.global) {
        originalHandleKey(character, modifiers, event)
      }
    }
  }

  _isReactEvent = (event) => {
    let result = false
    if (event && event.target && event.target._reactInternalComponent
        && event.target._reactInternalComponent._currentElement
        && event.target._reactInternalComponent._currentElement.props) {
      const props = event.target._reactInternalComponent._currentElement.props

      if (props.onKeyDown || props.onKeyPress || props.onKeyUp) {
        result = true
      }
    }
    return result
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
    let element = this._getElementToBind()
    element.removeAttribute('tabindex')

    if (this._combokeys) {
      this._combokeys.detach()
      this._combokeys.reset()
    }
  }

  _onUpdate = () => {
    let shortcutsArr = this.context.shortcuts.getShortcuts(this.props.name)
    this._unbindShortcuts()
    this._bindShortcuts(shortcutsArr)
  }

  componentDidMount() {
    this._onUpdate()
    this.context.shortcuts.addUpdateListener(this._onUpdate)
  }

  componentWillUnmount() {
    let shortcutsArr = this.context.shortcuts.getShortcuts(this.props.name)
    this._unbindShortcuts(shortcutsArr)
    this.context.shortcuts.removeUpdateListener(this._onUpdate)

    if (this.props.global) {
      let element = this._getElementToBind()
      element.removeEventListener('shortcuts:global', this._customGlobalHandler)
    }
  }

  _handleShortcuts = (event, keyName) => {
    let shortcutName = this.context.shortcuts.findShortcutName(keyName, this.props.name)
    this.props.handler(shortcutName, event)
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
