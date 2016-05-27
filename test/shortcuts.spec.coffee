keymap = require './keymap'
ShortcutManager = require '../src'

shortcutsManager = new ShortcutManager(keymap)


describe 'Shortcuts component: ', ->

  Shortcuts = null
  Test = null
  props = {}
  spy = null

  beforeEach ->
    spy = expect.createSpy()
    spyFn = (spy) -> spy()

    Shortcuts = React.createFactory(require '../src/component')
    props.name = 'Test'
    props.handler = ->

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

        React.DOM.div className: 'root',
          Shortcuts props,
            React.DOM.span
              className: 'child'
              ref: 'child'


  it 'should have a displayName', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.displayName).toBeA('string')
    expect(element.type(props).type.displayName).toExist()

  it 'should have a contextTypes', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.contextTypes).toExist()
    expect(element.type(props).type.contextTypes.shortcuts).toExist()

  it 'should have a propTypes', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.propTypes).toExist()
    expect(element.type(props).type.propTypes.handler).toExist()
    expect(element.type(props).type.propTypes.name).toExist()
    expect(element.type(props).type.propTypes.tabIndex).toExist()
    expect(element.type(props).type.propTypes.eventType).toExist()
    expect(element.type(props).type.propTypes.isGlobal).toExist()


  it 'should default the eventType property to null', ->
    element = React.createElement(Shortcuts)
    expect(element.type(props).type.getDefaultProps().eventType).toBe(null)


  describe 'Rendered element into document', ->
    element = null

    before ->
      props.id = 'my-id'
      props.className = 'testing-class'
      props.style = color: 'blue'
      element = ReactTestUtils.renderIntoDocument React.createElement(Test)

    it 'should create a <shortcuts> DOM element', ->
      expect(ReactDOM.findDOMNode(element).querySelector('shortcuts')).toExist()

    it 'should add a tabindex attribute to the <shortcuts> element', ->
      el = ReactDOM.findDOMNode(element).querySelector('shortcuts')
      expect(el.getAttribute('tabindex')).toExist()
      expect(el.getAttribute('tabindex')).toBe('-1')

    it 'should add an id to the <shortcuts> element', ->
      el = ReactDOM.findDOMNode(element).querySelector('shortcuts')
      expect(el.id).toBe('my-id')

    it 'should add a className to the <shortcuts> element', ->
      el = ReactDOM.findDOMNode(element).querySelector('shortcuts')
      expect(el.className).toBe('testing-class')

    it 'should add a style to the <shortcuts> element', ->
      el = ReactDOM.findDOMNode(element).querySelector('shortcuts')
      expect(el.style.color).toBe('blue')

    it 'should use a custom tabindex attribute value', ->
      props.tabIndex = 666
      element = ReactTestUtils.renderIntoDocument React.createElement(Test)
      el = ReactDOM.findDOMNode(element).querySelector('.testing-class')
      expect(el.getAttribute('tabindex')).toBe('666')

    it 'should render its children as the children of the <shortcuts> element', ->
      el = ReactDOM.findDOMNode(element).querySelector('.child')
      expect(el).toExist()

    it 'should fire shortcuts handler', ->
      obj =
        preventDefault: ->
        stopPropagation: ->
      el = element.refs.shortcut._handleShortcuts(obj, 'left')
      expect(spy).toHaveBeenCalled()

    it 'should add tabIndex attr on targetNode', ->
      props.targetNode = document.querySelector('body')
      props.tabIndex = 123
      element = ReactDOM.render(React.createElement(Test), document.body)

      expect(document.body.getAttribute('tabindex')).toBe('123')
