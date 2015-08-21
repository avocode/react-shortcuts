React = require 'react'
_ = require 'lodash'
invariant = require 'invariant'
mousetrap = require 'mousetrap'

shortcuts = React.createFactory 'shortcuts'

module.exports = React.createClass

  displayName: 'Shortcuts'

  contextTypes:
    shortcuts: React.PropTypes.object.isRequired

  propTypes:
    handler: React.PropTypes.func.isRequired
    name: React.PropTypes.string.isRequired
    element: React.PropTypes.func
    tabIndex: React.PropTypes.number
    className: React.PropTypes.string
    eventType: React.PropTypes.string
    stopPropagation: React.PropTypes.bool
    trigger: React.PropTypes.string

  getDefaultProps: ->
    element: null
    tabIndex: null
    className: null
    eventType: null
    stopPropagation: null
    trigger: null

  _bindShortcuts: (shortcutsArr) ->
    if @props.trigger
      element = document.querySelector(@props.trigger)
      invariant(element, 'Trigger DOM node was not found.')
      element.setAttribute('tabindex', @props.tabIndex or -1)
    else
      element = React.findDOMNode(@refs.shortcuts)
    mousetrap(element).bind(shortcutsArr, @_handleShortcuts, @props.eventType)

  _unbindShortcuts: (shortcutsArr) ->
    if @props.trigger
      element = document.querySelector(@props.trigger)
      element.removeAttribute('tabindex')
    else
      element = React.findDOMNode(@refs.shortcuts)
    mousetrap(element).unbind(shortcutsArr)

  _onUpdate: ->
    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_unbindShortcuts(shortcutsArr)
    @_bindShortcuts(shortcutsArr)

  componentDidMount: ->
    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_bindShortcuts(shortcutsArr)
    @context.shortcuts.addUpdateListener(@_onUpdate)

  componentWillUnmount: ->
    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_unbindShortcuts(shortcutsArr)
    @context.shortcuts.removeUpdateListener(@_onUpdate)

  _handleShortcuts: (e, keyName) ->
    e.preventDefault()
    e.stopPropagation() if @props.stopPropagation
    shortcutName = @context.shortcuts.findShortcutName(keyName, @props.name)
    @props.handler(shortcutName)

  render: ->
    element = shortcuts
    element = @props.element if _.isFunction(@props.element)

    element
      tabIndex: @props.tabIndex or -1
      className: @props.className
      ref: 'shortcuts',

      @props.children
