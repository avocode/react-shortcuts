React = require 'react'
ReactDOM = require 'react-dom'
invariant = require 'invariant'
createMousetrap = require 'mousetrap'

shortcuts = React.createFactory 'shortcuts'


module.exports = React.createClass
  displayName: 'Shortcuts'

  # NOTE: mousetrap must be instance per component
  _mousetrap: null

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
    targetNode: React.PropTypes.object
    ref: React.PropTypes.string
    isGlobal: React.PropTypes.bool

  getDefaultProps: ->
    tabIndex: null
    className: null
    ref: null
    eventType: null
    stopPropagation: true
    preventDefault: false
    targetNode: null
    isGlobal: false

  _bindShortcuts: (shortcutsArr) ->
    element = @_getElementToBind()
    element.setAttribute('tabindex', @props.tabIndex or -1)
    @_mousetrap = createMousetrap(element)
    @_monkeyPatchMousetrap()
    @_mousetrap.bind(shortcutsArr, @_handleShortcuts, @props.eventType)

    if @props.isGlobal
      element.addEventListener 'shortcuts:global', @_customGlobalHandler

  _customGlobalHandler: (e) ->
    {character, modifiers, event} = e.detail

    if e.target isnt ReactDOM.findDOMNode(this) and
        e.target isnt @props.targetNode
      # NOTE: this is kind of hack
      @_mousetrap._handleKey(character, modifiers, event, true)

  _lastEvent: null

  _monkeyPatchMousetrap: ->
    element = @_getElementToBind()
    originalHandleKey = @_mousetrap._handleKey

    @_mousetrap._handleKey = (character, modifiers, event, customEvent) =>
      if not customEvent
        element.dispatchEvent new CustomEvent 'shortcuts:global',
          detail: {character, modifiers, event}
          bubbles: true
          cancelable: true

        return null if @_lastEvent is event

      @_lastEvent = event
      event.preventDefault() if @props.preventDefault
      event.stopPropagation() if @props.stopPropagation and not customEvent
      originalHandleKey(character, modifiers, event)

  _getElementToBind: ->
    if @props.targetNode
      element = @props.targetNode
    else
      element = ReactDOM.findDOMNode(this)

    invariant(element, 'TargetNode was not found.')
    return element

  _unbindShortcuts: (shortcutsArr) ->
    element = @_getElementToBind()
    element.removeAttribute('tabindex')

    if @_mousetrap
      @_mousetrap.unbind(shortcutsArr, @props.eventType)
      @_mousetrap.reset()

  _onUpdate: ->
    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_unbindShortcuts(shortcutsArr)
    @_bindShortcuts(shortcutsArr)

  componentDidMount: ->
    @_onUpdate()
    @context.shortcuts.addUpdateListener(@_onUpdate)

  componentWillUnmount: ->
    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_unbindShortcuts(shortcutsArr)
    @context.shortcuts.removeUpdateListener(@_onUpdate)
    @_lastEvent = null

    if @props.isGlobal
      element = @_getElementToBind()
      element.removeEventListener 'shortcuts:global', @_customGlobalHandler

  _handleShortcuts: (event, keyName) ->
    shortcutName = @context.shortcuts.findShortcutName(keyName, @props.name)
    @props.handler(shortcutName, event)

  render: ->
    element = shortcuts

    element
      tabIndex: @props.tabIndex or -1
      ref: @props.ref
      className: @props.className,

      @props.children
