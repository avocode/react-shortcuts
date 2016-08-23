jsdom = require 'jsdom'
chai = require 'chai'
sinonChai = require 'sinon-chai'
sinon = require 'sinon'
_ = require 'lodash'


keymap = require './keymap'
ShortcutManager = require '../src'

shortcutsManager = new ShortcutManager(keymap)


describe 'Shortcuts component', ->
  baseProps = null
  baseContext = null

  simulant = null
  Mousetrap = null
  Shortcuts = null
  ReactDOM = null
  React = null
  enzyme = null

  chai.use(sinonChai)
  expect = chai.expect

  beforeEach ->
    global.document = jsdom.jsdom('<html><body></body></html>')
    global.window = document.defaultView
    global.Image = window.Image
    global.navigator = window.navigator
    global.CustomEvent = window.CustomEvent
    simulant = require 'simulant'
    ReactDOM = require 'react-dom'
    React = require 'react'
    enzyme = require 'enzyme'
    chaiEnzyme = require 'chai-enzyme'

    chai.use(chaiEnzyme())

    Shortcuts = require '../src/component'

    baseProps =
      handler: sinon.spy()
      name: 'TESTING'
      className: null
    baseContext =
      shortcuts: shortcutsManager

  it 'should render component', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.find('shortcuts')).to.have.length(1)

  it 'should not have tabIndex attribute by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().tabIndex).to.be.equal(null)

    props = _.assign {}, baseProps,
      tabIndex: 42
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().tabIndex).to.be.equal(props.tabIndex)
    realTabIndex = ReactDOM.findDOMNode(wrapper.instance()).getAttribute('tabindex')
    expect(realTabIndex).to.have.equal(String(props.tabIndex))

  it 'should not have className by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().className).to.be.equal(null)

  it 'should have className', ->
    props = _.assign {}, baseProps,
      className: 'testing'
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().className).to.be.equal('testing')
    expect(wrapper).to.have.className('testing')

  it 'should not have children by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().children).to.be.equal(undefined)

  it 'should have children', ->
    props = _.assign {}, baseProps,
      children: React.DOM.div()
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper).to.contain(React.DOM.div())

  it 'should have handler prop', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().handler).to.be.function

  it 'should have name prop', ->
    props = _.assign {}, baseProps,
      name: 'TESTING'
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().name).to.be.equal('TESTING')

  it 'should not have eventType prop by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().eventType).to.be.equal(null)

  it 'should have eventType prop', ->
    props = _.assign {}, baseProps,
      eventType: 'keyUp'
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().eventType).to.be.equal('keyUp')

  it 'should have stopPropagation prop by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().stopPropagation).to.be.equal(true)

  it 'should have stopPropagation prop set to false', ->
    props = _.assign {}, baseProps,
      stopPropagation: false
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().stopPropagation).to.be.equal(false)

  it 'should have preventDefault prop set to false by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().preventDefault).to.be.equal(false)

  it 'should have preventDefault prop set to true', ->
    props = _.assign {}, baseProps,
      preventDefault: true
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().preventDefault).to.be.equal(true)

  it 'should not have targetNode prop by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().targetNode).to.be.equal(null)

  it 'should have targetNode prop', ->
    props = _.assign {}, baseProps,
      targetNode: document.body
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().targetNode).to.be.equal(document.body)

  it 'should have global prop set to false by default', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().global).to.be.equal(false)

  it 'should have global prop set to true', ->
    props = _.assign {}, baseProps,
      global: true
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().global).to.be.equal(true)

  it 'should fire the handler prop with the correct argument', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.have.been.calledWith('OPEN')

    esc = 27
    simulant.fire(node, 'keydown', { keyCode: esc })

    expect(wrapper.props().handler).to.have.been.calledWith('CLOSE')

  it 'should not fire the handler', ->
    props = _.assign {}, baseProps,
      name: 'NON-EXISTING'
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.not.have.been.called

  it 'should not fire twice when global prop is truthy', ->
    props = _.assign {}, baseProps,
      global: true
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.have.been.calledOnce

  it 'should not fire when the component has been unmounted', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    wrapper.unmount()

    enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.not.have.been.called

  it 'should update the shortcuts and fire the handler', ->
    shortcutComponent = React.createElement(Shortcuts, baseProps)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    space = 32
    simulant.fire(node, 'keydown', { keyCode: space })

    expect(wrapper.props().handler).to.not.have.been.called

    editedKeymap = _.assign {}, keymap,
      'TESTING':
        'SPACE': 'space'
    baseContext.shortcuts.setKeymap(editedKeymap)

    simulant.fire(node, 'keydown', { keyCode: space })

    expect(baseProps.handler).to.have.been.called

    # NOTE: rollback the previous keymap
    baseContext.shortcuts.setKeymap(keymap)

  it 'should fire the handler from a child input', ->
    props = _.assign {}, baseProps,
      children: React.DOM.input({ type: 'text', className: 'input' })
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    parentNode = ReactDOM.findDOMNode(wrapper.instance())
    node = parentNode.querySelector('.input')
    node.focus()

    enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter, key: 'Enter' })

    expect(wrapper.props().handler).to.have.been.called


  describe 'Shortcuts component inside Shortcuts component:', ->

    it 'should not fire parent handler when child handler is fired', ->
      props = _.assign {}, baseProps,
        children: React.createElement Shortcuts, _.assign({}, baseProps, { className: 'test' })
      shortcutComponent = React.createElement(Shortcuts, props)
      wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      parentNode = ReactDOM.findDOMNode(wrapper.instance())
      node = parentNode.querySelector('.test')

      node.focus()

      enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledOnce

    it 'should fire parent handler when child handler is fired', ->
      props = _.assign {}, baseProps,
        children: React.createElement Shortcuts, _.assign({}, baseProps, { className: 'test', stopPropagation: false })
      shortcutComponent = React.createElement(Shortcuts, props)
      wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      parentNode = ReactDOM.findDOMNode(wrapper.instance())
      node = parentNode.querySelector('.test')

      node.focus()

      enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice

    it 'should fire parent handler when parent handler has global prop', ->
      props = _.assign {}, baseProps,
        children: React.createElement Shortcuts, _.assign({}, baseProps, { className: 'test' })
        global: true
      shortcutComponent = React.createElement(Shortcuts, props)
      wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      parentNode = ReactDOM.findDOMNode(wrapper.instance())
      node = parentNode.querySelector('.test')

      node.focus()

      enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice

    it 'should fire parent handler but not the child handler', ->
      props = _.assign {}, baseProps,
        children: React.createElement Shortcuts, _.assign({}, baseProps, { name: 'NON-EXISTING', className: 'test' })
        global: true
      shortcutComponent = React.createElement(Shortcuts, props)
      wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      parentNode = ReactDOM.findDOMNode(wrapper.instance())
      node = parentNode.querySelector('.test')

      node.focus()

      enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledOnce

    it 'should fire for all global components', ->
      props = _.assign {}, baseProps,
        children: React.createElement Shortcuts, _.assign({}, baseProps, {
          global: true
          children: React.createElement Shortcuts, _.assign({}, baseProps, { name: 'NON-EXISTING', className: 'test' })
        })
        global: true
      shortcutComponent = React.createElement(Shortcuts, props)
      wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      parentNode = ReactDOM.findDOMNode(wrapper.instance())
      node = parentNode.querySelector('.test')

      node.focus()

      enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice
