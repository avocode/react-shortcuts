import React from 'react'
import invariant from 'invariant'
import Combokeys from 'combokeys'
import PropTypes from 'prop-types'

import helpers from '../helpers'

export default class extends React.Component {
  static displayName = 'Shortcuts';

  static contextTypes = {
    shortcuts: PropTypes.object.isRequired,
  };

  static propTypes = {
    children: PropTypes.node,
    handler: PropTypes.func,
    name: PropTypes.string,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    eventType: PropTypes.string,
    stopPropagation: PropTypes.bool,
    preventDefault: PropTypes.bool,
    targetNodeSelector: PropTypes.string,
    global: PropTypes.bool,
    isolate: PropTypes.bool,
    alwaysFireHandler: PropTypes.bool,
  };

  static defaultProps = {
    tabIndex: null,
    className: null,
    eventType: null,
    stopPropagation: true,
    preventDefault: false,
    targetNodeSelector: null,
    global: false,
    isolate: false,
    alwaysFireHandler: false,
  };

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
      const element = this._getElementToBind()
      element.removeEventListener(
        'shortcuts:global',
        this._customGlobalHandler
      )
    }
  }

  // NOTE: combokeys must be instance per component
  _combokeys = null;

  _lastEvent = null;

  _bindShortcuts = (shortcutsArr) => {
    const element = this._getElementToBind()
    element.setAttribute('tabindex', this.props.tabIndex || -1)
    this._combokeys = new Combokeys(element)
    this._decorateCombokeys()
    this._combokeys.bind(
      shortcutsArr,
      this._handleShortcuts,
      this.props.eventType
    )

    if (this.props.global) {
      element.addEventListener('shortcuts:global', this._customGlobalHandler)
    }
  };

  _customGlobalHandler = (e) => {
    const { character, modifiers, event } = e.detail

    let targetNode = null
    if (this.props.targetNodeSelector) {
      targetNode = document.querySelector(this.props.targetNodeSelector)
    }

    if (e.target !== this._domNode && e.target !== targetNode) {
      this._combokeys.handleKey(character, modifiers, event, true)
    }
  };

  _decorateCombokeys = () => {
    const element = this._getElementToBind()
    const originalHandleKey = this._combokeys.handleKey.bind(this._combokeys)

    // NOTE: stopCallback is a method that is called to see
    // if the keyboard event should fire
    this._combokeys.stopCallback = (event, domElement, combo) => {
      const isInputLikeElement = domElement.tagName === 'INPUT' ||
        domElement.tagName === 'SELECT' ||
        domElement.tagName === 'TEXTAREA' ||
        (domElement.contentEditable && domElement.contentEditable === 'true')

      let isReturnString
      if (event.key) {
        isReturnString = event.key.length === 1
      } else {
        isReturnString = Boolean(helpers.getCharacter(event))
      }

      if (
        isInputLikeElement && isReturnString && !this.props.alwaysFireHandler
      ) {
        return true
      }

      return false
    }

    this._combokeys.handleKey = (
      character,
      modifiers,
      event,
      isGlobalHandler
    ) => {
      if (
        this._lastEvent &&
        event.timeStamp === this._lastEvent.timeStamp &&
        event.type === this._lastEvent.type
      ) {
        return
      }
      this._lastEvent = event

      let isolateOwner = false
      if (this.props.isolate && !event.__isolateShortcuts) {
        event.__isolateShortcuts = true
        isolateOwner = true
      }

      if (!isGlobalHandler) {
        element.dispatchEvent(
          new CustomEvent('shortcuts:global', {
            detail: { character, modifiers, event },
            bubbles: true,
            cancelable: true,
          })
        )
      }

      // NOTE: works normally if it's not an isolated event
      if (!event.__isolateShortcuts) {
        if (this.props.preventDefault) {
          event.preventDefault()
        }
        if (this.props.stopPropagation && !isGlobalHandler) {
          event.stopPropagation()
        }
        originalHandleKey(character, modifiers, event)
        return
      }

      // NOTE: global shortcuts should work even for an isolated event
      if (this.props.global || isolateOwner) {
        originalHandleKey(character, modifiers, event)
      }
    }
  };

  _getElementToBind = () => {
    let element = null
    if (this.props.targetNodeSelector) {
      element = document.querySelector(this.props.targetNodeSelector)
      invariant(
        element,
        `Node selector '${this.props.targetNodeSelector}'  was not found.`
      )
    } else {
      element = this._domNode
    }

    return element
  };

  _unbindShortcuts = () => {
    if (this._combokeys) {
      this._combokeys.detach()
      this._combokeys.reset()
    }
  };

  _onUpdate = () => {
    const shortcutsArr = this.props.name &&
      this.context.shortcuts.getShortcuts(this.props.name)
    this._unbindShortcuts()
    this._bindShortcuts(shortcutsArr || [])
  };

  _handleShortcuts = (event, keyName) => {
    if (this.props.name) {
      const shortcutName = this.context.shortcuts.findShortcutName(
        keyName,
        this.props.name
      )

      if (this.props.handler) {
        this.props.handler(shortcutName, event)
      }
    }
  };

  render() {
    return (
      <shortcuts
        ref={(node) => {
          this._domNode = node
        }}
        tabIndex={this.props.tabIndex || -1}
        className={this.props.className}
      >
        {this.props.children}
      </shortcuts>
    )
  }
}
