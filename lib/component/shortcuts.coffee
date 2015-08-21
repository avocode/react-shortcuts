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

  _element: null

  getDefaultProps: ->
    eventType: null

  _bindShortcuts: (shortcuts) ->
    mousetrap(@_element).bind(shortcuts, @_handleShortcuts, @props.eventType)

  _unbindShortcuts: (shortcuts) ->
    mousetrap(@_element).unbind(shortcuts)

  componentDidMount: ->
    @_element = React.findDOMNode(@refs.shortcuts)

    shortcuts = @context.shortcuts.getShortcuts(@props.name)
    @_bindShortcuts(shortcuts)

    @context.shortcuts.onUpdate =>
      shortcuts = @context.shortcuts.getShortcuts(@props.name)
      @_unbindShortcuts(shortcuts)
      @_bindShortcuts(shortcuts)

  componentWillUnmount: ->
    @context.shortcuts.dispose()
    @_unbindShortcuts()

  _handleShortcuts: (e, keyName) ->
    e.preventDefault()
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
