React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'lodash'
invariant = require 'invariant'
createMousetrap = require 'mousetrap'

shortcuts = React.createFactory 'shortcuts'

{div, button} = React.DOM

module.exports = React.createClass

  displayName: 'Shortcuts'

  #HACK: mousetrap must be instance per component
  _mousetrap: null

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
    preventDefault: React.PropTypes.bool
    targetNode: React.PropTypes.object
    ref: React.PropTypes.string
    nativeKeyBindingsClassName: React.PropTypes.string

  getDefaultProps: ->
    element: null
    tabIndex: null
    className: null
    ref: null
    eventType: null
    stopPropagation: null
    preventDefault: true
    targetNode: null
    nativeKeyBindingsClassName: 'native-key-bindings'

  _bindShortcuts: (shortcutsArr) ->
    element = @_getElementToBind()
    #@_monkeyPatchMousetrap()
    element.setAttribute('tabindex', @props.tabIndex or -1)
    @_mousetrap = createMousetrap(element)
    @_mousetrap.bind(shortcutsArr, @_handleShortcuts, @props.eventType)

  # TODO: create a pull request on mousetrap's github page
  _monkeyPatchMousetrap: ->
    createMousetrap::stopCallback = (e, element) =>
      result = _.includes(element.className, @props.nativeKeyBindingsClassName)
      return result

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
    @_mousetrap?.unbind(shortcutsArr, @props.eventType)

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

  _handleShortcuts: (e, keyName) ->
    e.preventDefault() if @props.preventDefault
    e.stopPropagation() if @props.stopPropagation
    shortcutName = @context.shortcuts.findShortcutName(keyName, @props.name)
    @props.handler(shortcutName, e)

  _onClick: ->
    @_unbindShortcuts(@context.shortcuts.getShortcuts(@props.name))

  render: ->
    element = shortcuts
    element = @props.element if _.isFunction(@props.element)

    element
      tabIndex: @props.tabIndex or -1
      ref: @props.ref
      className: @props.className,

      @props.children
