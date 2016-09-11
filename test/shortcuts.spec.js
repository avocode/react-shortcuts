import jsdom from 'jsdom'
import chai from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import _ from 'lodash'

import keymap from './keymap'

describe('Shortcuts component', () => {
  let baseProps = null
  let baseContext = null

  let simulant = null
  let Mousetrap = null
  let ShortcutManager = null
  let Shortcuts = null
  let ReactDOM = null
  let React = null
  let enzyme = null

  chai.use(sinonChai)
  let { expect } = chai

  beforeEach(() => {
    global.document = jsdom.jsdom('<html><body></body></html>')
    global.window = document.defaultView
    global.Image = window.Image
    global.navigator = window.navigator
    global.CustomEvent = window.CustomEvent
    simulant = require('simulant')
    ReactDOM = require('react-dom')
    React = require('react')
    enzyme = require('enzyme')
    let chaiEnzyme = require('chai-enzyme')

    chai.use(chaiEnzyme())

    ShortcutManager = require('../src').ShortcutManager
    let shortcutsManager = new ShortcutManager(keymap)

    Shortcuts = require('../src/').Shortcuts

    baseProps = {
      handler: sinon.spy(),
      name: 'TESTING',
      className: null
    }
    baseContext = { shortcuts: shortcutsManager }
  })

  it('should render component', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.find('shortcuts')).to.have.length(1)
  })

  it('should not have tabIndex attribute by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().tabIndex).to.be.equal(null)

    let props = _.assign({}, baseProps, { tabIndex: 42 })
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().tabIndex).to.be.equal(props.tabIndex)
    let realTabIndex = ReactDOM.findDOMNode(wrapper.instance()).getAttribute('tabindex')
    expect(realTabIndex).to.have.equal(String(props.tabIndex))
  })

  it('should not have className by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().className).to.be.equal(null)
  })

  it('should have className', () => {
    let props = _.assign({}, baseProps, { className: 'testing' })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().className).to.be.equal('testing')
    expect(wrapper).to.have.className('testing')
  })

  it('should have isolate prop set to false by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().isolate).to.be.equal(false)
  })

  it('should have isolate prop', () => {
    let props = _.assign({}, baseProps, { isolate: true })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().isolate).to.be.equal(true)
  })

  it('should not have children by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().children).to.be.equal(undefined)
  })

  it('should have children', () => {
    let props = _.assign({}, baseProps, { children: React.DOM.div() })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper).to.contain(React.DOM.div())
  })

  it('should have handler prop', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().handler).to.be.function
  })

  it('should have name prop', () => {
    let props = _.assign({}, baseProps,
      {name: 'TESTING'})
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().name).to.be.equal('TESTING')
  })

  it('should not have eventType prop by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().eventType).to.be.equal(null)
  })

  it('should have eventType prop', () => {
    let props = _.assign({}, baseProps,
      {eventType: 'keyUp'})
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().eventType).to.be.equal('keyUp')
  })

  it('should have stopPropagation prop by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().stopPropagation).to.be.equal(true)
  })

  it('should have stopPropagation prop set to false', () => {
    let props = _.assign({}, baseProps, { stopPropagation: false })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().stopPropagation).to.be.equal(false)
  })

  it('should have preventDefault prop set to false by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().preventDefault).to.be.equal(false)
  })

  it('should have preventDefault prop set to true', () => {
    let props = _.assign({}, baseProps, { preventDefault: true })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().preventDefault).to.be.equal(true)
  })

  it('should not have targetNodeSelector prop by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().targetNodeSelector).to.be.equal(null)
  })

  it('should have targetNode prop', () => {
    let props = _.assign({}, baseProps, { targetNodeSelector: 'body' })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().targetNodeSelector).to.be.equal('body')
  })

  it('should have global prop set to false by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().global).to.be.equal(false)
  })

  it('should have global prop set to true', () => {
    let props = _.assign({}, baseProps, { global: true })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().global).to.be.equal(true)
  })

  it('should fire the handler prop with the correct argument', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    let node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    let enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.have.been.calledWith('OPEN')

    let esc = 27
    simulant.fire(node, 'keydown', { keyCode: esc })

    expect(wrapper.props().handler).to.have.been.calledWith('CLOSE')
  })

  it('should not fire the handler', () => {
    let props = _.assign({}, baseProps, { name: 'NON-EXISTING' })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    let node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    let enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.not.have.been.called
  })

  it('should not fire twice when global prop is truthy', () => {
    let props = _.assign({}, baseProps, { global: true })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    let node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    let enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.have.been.calledOnce
  })

  it('should not fire when the component has been unmounted', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    let node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    wrapper.unmount()

    let enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.not.have.been.called
  })

  it('should update the shortcuts and fire the handler', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    let node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    let space = 32
    simulant.fire(node, 'keydown', { keyCode: space })

    expect(wrapper.props().handler).to.not.have.been.called

    let editedKeymap = _.assign({}, keymap, {
      'TESTING': {
        'SPACE': 'space'
      }
    }
    )
    baseContext.shortcuts.setKeymap(editedKeymap)

    simulant.fire(node, 'keydown', { keyCode: space })

    expect(baseProps.handler).to.have.been.called

    // NOTE: rollback the previous keymap
    baseContext.shortcuts.setKeymap(keymap)
  })

  it('should fire the handler from a child input', () => {
    let props = _.assign({}, baseProps, {
      children: React.DOM.input({ type: 'text', className: 'input' })
    })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    let parentNode = ReactDOM.findDOMNode(wrapper.instance())
    let node = parentNode.querySelector('.input')
    node.focus()

    let enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter, key: 'Enter' })

    expect(wrapper.props().handler).to.have.been.called
  })

  it('should fire the handler when using targetNodeSelector', () => {
    let props = _.assign({}, baseProps, { targetNodeSelector: 'body' })
    let shortcutComponent = React.createElement(Shortcuts, props)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    let enter = 13
    simulant.fire(document.body, 'keydown', { keyCode: enter, key: 'Enter' })

    expect(wrapper.props().handler).to.have.been.called
  })

  it('should throw and error if targetNodeSelector is not found', () => {
    let props = _.assign({}, baseProps, { targetNodeSelector: 'non-existing' })
    let shortcutComponent = React.createElement(Shortcuts, props)

    try {
      enzyme.mount(shortcutComponent, { context: baseContext })
    } catch (err) {
      expect(err).to.match(/Node selector 'non-existing'  was not found/)
    }
  })


  describe('Shortcuts component inside Shortcuts component:', () => {

    it('should not fire parent handler when child handler is fired', () => {
      let props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test' }))
      })
      let shortcutComponent = React.createElement(Shortcuts, props)
      let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      let parentNode = ReactDOM.findDOMNode(wrapper.instance())
      let node = parentNode.querySelector('.test')

      node.focus()

      let enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledOnce
    })

    it('should fire parent handler when child handler is fired', () => {
      let props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test', stopPropagation: false }))
      })
      let shortcutComponent = React.createElement(Shortcuts, props)
      let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      let parentNode = ReactDOM.findDOMNode(wrapper.instance())
      let node = parentNode.querySelector('.test')

      node.focus()

      let enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice
    })

    it('should fire parent handler when parent handler has global prop', () => {
      let props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test' })),
        global: true
      })

      let shortcutComponent = React.createElement(Shortcuts, props)
      let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      let parentNode = ReactDOM.findDOMNode(wrapper.instance())
      let node = parentNode.querySelector('.test')

      node.focus()

      let enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice
    })

    it('should fire parent handler but not the child handler', () => {
      let props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { name: 'NON-EXISTING', className: 'test' })),
        global: true
      })

      let shortcutComponent = React.createElement(Shortcuts, props)
      let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      let parentNode = ReactDOM.findDOMNode(wrapper.instance())
      let node = parentNode.querySelector('.test')

      node.focus()

      let enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledOnce
    })

    it('should fire for all global components', () => {
      let props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, {
          global: true,
          children: React.createElement(Shortcuts, _.assign({}, baseProps, { name: 'NON-EXISTING', className: 'test' }))
        })),
        global: true
      })

      let shortcutComponent = React.createElement(Shortcuts, props)
      let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      let parentNode = ReactDOM.findDOMNode(wrapper.instance())
      let node = parentNode.querySelector('.test')

      node.focus()

      let enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice
    })

    it('should not fire parent handler when a child has isolate prop set to true', () => {
      let props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test', isolate: true }))
      })

      let shortcutComponent = React.createElement(Shortcuts, props)
      let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      let parentNode = ReactDOM.findDOMNode(wrapper.instance())
      let node = parentNode.querySelector('.test')

      node.focus()

      let enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.not.have.been.called
    })

    it('should fire parent handler when is global and a child has isolate prop set to true', () => {
      let props = _.assign({}, baseProps, {
        global: true,
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test', isolate: true }))
      })

      let shortcutComponent = React.createElement(Shortcuts, props)
      let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      let parentNode = ReactDOM.findDOMNode(wrapper.instance())
      let node = parentNode.querySelector('.test')

      node.focus()

      let enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.called
    })
  })
})
