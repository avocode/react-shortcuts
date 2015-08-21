keymap = require './keymap'
ShortcutsManager = require '../lib'

shortcutsManager = new ShortcutsManager(keymap)
Shortcuts = null
Test = null
props = {}
spy = expect.createSpy()
spyFn = (spy) -> spy()


describe 'Shortcuts component: ', ->

  before ->
    Shortcuts = React.createFactory(require '../lib/component')
    props =
      name: 'Test'
      handler: ->

    Test = React.createClass
      displayName: 'Test'

      childContextTypes:
        shortcuts: React.PropTypes.object.isRequired

      getChildContext: ->
        shortcuts: shortcutsManager

      _handleShortcuts: (command) ->
        switch command
          when 'MOVE_LEFT' then spyFn(spy)

      render: ->
        props.handler = @_handleShortcuts
        props.name = @constructor.displayName
        props.ref = 'shortcut'

        React.DOM.div null,
          Shortcuts props,
            React.DOM.span className: 'child'


  it 'has a displayName', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.displayName).toBeA('string')
    expect(element.type(props).type.displayName).toExist()

  it 'has a contextTypes', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.contextTypes).toExist()
    expect(element.type(props).type.contextTypes.shortcuts).toExist()

  it 'has a propTypes', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.propTypes).toExist()
    expect(element.type(props).type.propTypes.handler).toExist()
    expect(element.type(props).type.propTypes.name).toExist()
    expect(element.type(props).type.propTypes.element).toExist()
    expect(element.type(props).type.propTypes.tabIndex).toExist()
    expect(element.type(props).type.propTypes.eventType).toExist()


  it 'should return null for getDefaultProps eventType', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.getDefaultProps().eventType).toBe(null)

  describe 'Rendered element into document', ->
    element = null

    before ->
      props.className = 'testing-class'
      element = ReactTestUtils.renderIntoDocument React.createElement(Test)

    it 'should find dom element', ->
      expect(element.getDOMNode().querySelector('shortcuts')).toExist()

    it 'should have tabIndex attr', ->
      el = element.getDOMNode().querySelector('shortcuts')
      expect(el.getAttribute('tabindex')).toExist()
      expect(el.getAttribute('tabindex')).toBe('-1')

    it 'should have className', ->
      el = element.getDOMNode().querySelector('shortcuts')
      expect(el.className).toBe('testing-class')

    it 'should have different element', ->
      props.element = React.DOM.section
      element = ReactTestUtils.renderIntoDocument React.createElement(Test)
      expect(element.getDOMNode().querySelector('section.testing-class')).toExist()

    it 'should have different tabIndex', ->
      props.tabIndex = 666
      element = ReactTestUtils.renderIntoDocument React.createElement(Test)
      el = element.getDOMNode().querySelector('.testing-class')
      expect(el.getAttribute('tabindex')).toBe('666')

    it 'should have children', ->
      el = element.getDOMNode().querySelector('.child')
      expect(el).toExist()

    it 'should fire shortcuts handler', ->
      obj = preventDefault: ->
      el = element.refs.shortcut._handleShortcuts(obj, 'left')
      expect(spy).toHaveBeenCalled()
