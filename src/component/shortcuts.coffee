React = require 'react'
ReactDOM = require 'react-dom'
invariant = require 'invariant'
Combokeys = require 'combokeys'

shortcuts = React.createFactory 'shortcuts'


module.exports = React.createClass
  displayName: 'Shortcuts'

  # NOTE: combokeys must be instance per component
  _combokeys: null

  contextTypes:
    shortcuts: React.PropTypes.object.isRequired

  propTypes:
    handler: React.PropTypes.func.isRequired
    name: React.PropTypes.string.isRequired
    tabIndex: React.PropTypes.number
    className: React.PropTypes.string
    eventType: React.PropTypes.string
    stopPropagation: React.PropTypes.bool
    preventDefault: React.PropTypes.bool
    targetNodeSelector: React.PropTypes.string
    global: React.PropTypes.bool

  getDefaultProps: ->
    tabIndex: null
    className: null
    eventType: null
    stopPropagation: true
    preventDefault: false
    targetNodeSelector: null
    global: false

  _bindShortcuts: (shortcutsArr) ->
    element = @_getElementToBind()
    element.setAttribute('tabindex', @props.tabIndex or -1)
    @_combokeys = new Combokeys(element)
    @_decorateCombokeys()
    @_combokeys.bind(shortcutsArr, @_handleShortcuts, @props.eventType)

    if @props.global
      element.addEventListener 'shortcuts:global', @_customGlobalHandler

  _customGlobalHandler: (e) ->
    { character, modifiers, event } = e.detail

    targetNode = null
    if @props.targetNodeSelector
      targetNode = document.querySelector(@props.targetNodeSelector)

    if e.target isnt ReactDOM.findDOMNode(this) and
        e.target isnt targetNode
      @_combokeys.handleKey(character, modifiers, event, true)

  _decorateCombokeys: ->
    element = @_getElementToBind()
    originalHandleKey = @_combokeys.handleKey.bind(@_combokeys)

    # NOTE: stopCallback is a method that is called to see
    # if the keyboard event should fire
    @_combokeys.stopCallback = (event, element, combo) ->
      isInputLikeElement = element.tagName == 'INPUT' or
        element.tagName == 'SELECT' or element.tagName == 'TEXTAREA' or
          (element.contentEditable and element.contentEditable == 'true')
      isReturnString = event.key?.length == 1

      if isInputLikeElement and isReturnString
        return true

      return false

    @_combokeys.handleKey = (character, modifiers, event, customEvent) =>
      if not customEvent
        element.dispatchEvent new CustomEvent 'shortcuts:global',
          detail: {character, modifiers, event}
          bubbles: true
          cancelable: true

      event.preventDefault() if @props.preventDefault
      event.stopPropagation() if @props.stopPropagation and not customEvent

      originalHandleKey(character, modifiers, event)

  _getElementToBind: ->
    if @props.targetNodeSelector
      element = document.querySelector(@props.targetNodeSelector)
      invariant(element, "Node selector '#{@props.targetNodeSelector}'  was not found.")
    else
      element = ReactDOM.findDOMNode(this)

    return element

  _unbindShortcuts: ->
    element = @_getElementToBind()
    element.removeAttribute('tabindex')

    if @_combokeys
      @_combokeys.detach()
      @_combokeys.reset()

  _onUpdate: ->
    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_unbindShortcuts()
    @_bindShortcuts(shortcutsArr)

  componentDidMount: ->
    @_onUpdate()
    @context.shortcuts.addUpdateListener(@_onUpdate)

  componentWillUnmount: ->
    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_unbindShortcuts(shortcutsArr)
    @context.shortcuts.removeUpdateListener(@_onUpdate)

    if @props.global
      element = @_getElementToBind()
      element.removeEventListener 'shortcuts:global', @_customGlobalHandler

  _handleShortcuts: (event, keyName) ->
    shortcutName = @context.shortcuts.findShortcutName(keyName, @props.name)
    @props.handler(shortcutName, event)

  render: ->
    shortcuts
      tabIndex: @props.tabIndex or -1
      className: @props.className,

      @props.children
