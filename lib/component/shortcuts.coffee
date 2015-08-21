React = require 'react'
_ = require 'lodash'
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

  _element: null

  getDefaultProps: ->
    eventType: null
    stopPropagation: null

  _bindShortcuts: (shortcutsArr) ->
    mousetrap(@_element).bind(shortcutsArr, @_handleShortcuts, @props.eventType)

  _unbindShortcuts: (shortcutsArr) ->
    mousetrap(@_element).unbind(shortcutsArr)

  componentDidMount: ->
    @_element = React.findDOMNode(@refs.shortcuts)

    shortcutsArr = @context.shortcuts.getShortcuts(@props.name)
    @_bindShortcuts(shortcutsArr)

    @context.shortcuts.onUpdate =>
      shortcuts = @context.shortcuts.getShortcuts(@props.name)
      @_unbindShortcuts(shortcutsArr)
      @_bindShortcuts(shortcutsArr)

  componentWillUnmount: ->
    @context.shortcuts.dispose()
    @_unbindShortcuts()

  _handleShortcuts: (e, keyName) ->
    e.preventDefault()
    e.stopPropagation() if @props.stopPropagation
    shortcutName = @context.shortcuts.findShortcutName(keyName)
    @props.handler(shortcutName)

  render: ->
    element = shortcuts
    element = @props.element if _.isFunction(@props.element)

    element
      tabIndex: @props.tabIndex or -1
      className: @props.className
      ref: 'shortcuts',

      @props.children
