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
  let ShortcutManager = null
  let Shortcuts = null
  let ReactDOM = null
  let React = null
  let enzyme = null
  let DOM = null

  chai.use(sinonChai)
  const { expect } = chai

  beforeEach(() => {
    global.document = jsdom.jsdom('<html><body></body></html>')
    global.window = document.defaultView
    global.Image = window.Image
    global.navigator = window.navigator
    global.CustomEvent = window.CustomEvent
    simulant = require('simulant')
    ReactDOM = require('react-dom')
    DOM = require('react-dom-factories')
    React = require('react')
    enzyme = require('enzyme')
    const Adapter = require('enzyme-adapter-react-16')
    enzyme.configure({ adapter: new Adapter() })
    const chaiEnzyme = require('chai-enzyme')

    chai.use(chaiEnzyme())

    ShortcutManager = require('../src').ShortcutManager
    const shortcutsManager = new ShortcutManager(keymap)

    Shortcuts = require('../src/').Shortcuts

    baseProps = {
      handler: sinon.spy(),
      name: 'TESTING',
      className: null,
    }
    baseContext = { shortcuts: shortcutsManager }
  })

  it('should render component', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.find('div')).to.have.length(1)
  })

  it('should have a tabIndex of -1 by default', () => {
    let shortcutComponent = React.createElement(Shortcuts, baseProps)
    let wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().tabIndex).to.be.equal(-1)

    let props = _.assign({}, baseProps, { tabIndex: 42 })
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().tabIndex).to.be.equal(props.tabIndex)
    let realTabIndex = ReactDOM.findDOMNode(wrapper.instance()).getAttribute('tabindex')
    expect(realTabIndex).to.have.equal(String(props.tabIndex))

    props.tabIndex = 0
    shortcutComponent = React.createElement(Shortcuts, props)
    wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().tabIndex).to.be.equal(props.tabIndex)
    realTabIndex = ReactDOM.findDOMNode(wrapper.instance()).getAttribute('tabindex')
    expect(realTabIndex).to.have.equal(String(props.tabIndex))
  })

  it('should not have className by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().className).to.be.equal(null)
  })

  it('should have className', () => {
    const props = _.assign({}, baseProps, { className: 'testing' })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().className).to.be.equal('testing')
    expect(wrapper).to.have.className('testing')
  })

  it('should have isolate prop set to false by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().isolate).to.be.equal(false)
  })

  it('should have isolate prop', () => {
    const props = _.assign({}, baseProps, { isolate: true })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().isolate).to.be.equal(true)
  })

  it('should not have children by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().children).to.be.equal(undefined)
  })

  it('should have children', () => {
    const props = _.assign({}, baseProps, { children: DOM.div() })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper).to.contain(DOM.div())
  })

  it('should have handler prop', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().handler).to.be.a('function')
  })

  it('should have name prop', () => {
    const props = _.assign({}, baseProps,
      {name: 'TESTING'})
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().name).to.be.equal('TESTING')
  })

  it('should not have eventType prop by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().eventType).to.be.equal(null)
  })

  it('should have eventType prop', () => {
    const props = _.assign({}, baseProps, { eventType: 'keyUp' })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().eventType).to.be.equal('keyUp')
  })

  it('should have stopPropagation prop by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().stopPropagation).to.be.equal(true)
  })

  it('should have stopPropagation prop set to false', () => {
    const props = _.assign({}, baseProps, { stopPropagation: false })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().stopPropagation).to.be.equal(false)
  })

  it('should have preventDefault prop set to false by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().preventDefault).to.be.equal(false)
  })

  it('should have preventDefault prop set to true', () => {
    const props = _.assign({}, baseProps, { preventDefault: true })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().preventDefault).to.be.equal(true)
  })

  it('should not have targetNodeSelector prop by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().targetNodeSelector).to.be.equal(null)
  })

  it('should have targetNode prop', () => {
    const props = _.assign({}, baseProps, { targetNodeSelector: 'body' })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().targetNodeSelector).to.be.equal('body')
  })

  it('should have global prop set to false by default', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().global).to.be.equal(false)
  })

  it('should have global prop set to true', () => {
    const props = _.assign({}, baseProps, { global: true })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    expect(wrapper.props().global).to.be.equal(true)
  })

  it('should fire the handler prop with the correct argument', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    const enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.have.been.calledWith('OPEN')

    const esc = 27
    simulant.fire(node, 'keydown', { keyCode: esc })

    expect(wrapper.props().handler).to.have.been.calledWith('CLOSE')
  })

  it('should not fire the handler', () => {
    const props = _.assign({}, baseProps, { name: 'NON-EXISTING' })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    const enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.not.have.been.called
  })

  it('should not fire twice when global prop is truthy', () => {
    const props = _.assign({}, baseProps, { global: true })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    const enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.have.been.calledOnce
  })

  it('should not fire when the component has been unmounted', () => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    const handler = wrapper.props().handler
    wrapper.unmount()

    const enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(handler).to.not.have.been.called
  })

  it('should update the shortcuts and fire the handler', (done) => {
    const shortcutComponent = React.createElement(Shortcuts, baseProps)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const node = ReactDOM.findDOMNode(wrapper.instance())
    node.focus()

    const space = 32
    simulant.fire(node, 'keydown', { keyCode: space })

    expect(wrapper.props().handler).to.not.have.been.called

    const editedKeymap = _.assign({}, keymap, {
      'TESTING': {
        'SPACE': 'space',
      },
    }
    )

    baseContext.shortcuts.setKeymap(editedKeymap)

    // sometimes node loose focus, so I added this timeout to fix it
    setTimeout(() => {
      node.focus()

      simulant.fire(node, 'keydown', { keyCode: space })
      expect(baseProps.handler).to.have.been.called

       // NOTE: rollback the previous keymap
      baseContext.shortcuts.setKeymap(keymap)
      done()
    }, 100)
  })

  it('should fire the handler from a child input', () => {
    const props = _.assign({}, baseProps, {
      children: DOM.input({ type: 'text', className: 'input' }),
    })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const parentNode = ReactDOM.findDOMNode(wrapper.instance())
    const node = parentNode.querySelector('.input')
    node.focus()

    const enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter, key: 'Enter' })

    expect(wrapper.props().handler).to.have.been.called
  })

  it('should fire the handler when using targetNodeSelector', () => {
    const props = _.assign({}, baseProps, { targetNodeSelector: 'body' })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const enter = 13
    simulant.fire(document.body, 'keydown', { keyCode: enter, key: 'Enter' })

    expect(wrapper.props().handler).to.have.been.called
  })

  it('should throw and error if targetNodeSelector is not found', () => {
    const props = _.assign({}, baseProps, { targetNodeSelector: 'non-existing' })
    const shortcutComponent = React.createElement(Shortcuts, props)

    const fn = () => enzyme.mount(shortcutComponent, { context: baseContext })
    expect(fn).to.throw()
  })

  it('should fire the handler from focused input', () => {
    const props = _.assign({}, baseProps, { 
      alwaysFireHandler: true, 
      children: DOM.input({type: 'text', className: 'input'}) 
    })
    const shortcutComponent = React.createElement(Shortcuts, props)
    const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

    const parentNode = ReactDOM.findDOMNode(wrapper.instance())
    const node = parentNode.querySelector('.input')
    node.focus()

    const enter = 13
    simulant.fire(node, 'keydown', { keyCode: enter })

    expect(wrapper.props().handler).to.have.been.called
  })


  describe('Shortcuts component inside Shortcuts component:', () => {

    it('should not fire parent handler when child handler is fired', () => {
      const props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test' })),
      })
      const shortcutComponent = React.createElement(Shortcuts, props)
      const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      const parentNode = ReactDOM.findDOMNode(wrapper.instance())
      const node = parentNode.querySelector('.test')

      node.focus()

      const enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledOnce
    })

    it('should fire parent handler when child handler is fired', () => {
      const props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test', stopPropagation: false })),
      })
      const shortcutComponent = React.createElement(Shortcuts, props)
      const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      const parentNode = ReactDOM.findDOMNode(wrapper.instance())
      const node = parentNode.querySelector('.test')

      node.focus()

      const enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice
    })

    it('should fire parent handler when parent handler has global prop', () => {
      const props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test' })),
        global: true,
      })

      const shortcutComponent = React.createElement(Shortcuts, props)
      const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      const parentNode = ReactDOM.findDOMNode(wrapper.instance())
      const node = parentNode.querySelector('.test')

      node.focus()

      const enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice
    })

    it('should fire parent handler but not the child handler', () => {
      const props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { name: 'NON-EXISTING', className: 'test' })),
        global: true,
      })

      const shortcutComponent = React.createElement(Shortcuts, props)
      const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      const parentNode = ReactDOM.findDOMNode(wrapper.instance())
      const node = parentNode.querySelector('.test')

      node.focus()

      const enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledOnce
    })

    it('should fire for all global components', () => {
      const props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, {
          global: true,
          children: React.createElement(Shortcuts, _.assign({}, baseProps, { name: 'NON-EXISTING', className: 'test' })),
        })),
        global: true,
      })

      const shortcutComponent = React.createElement(Shortcuts, props)
      const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      const parentNode = ReactDOM.findDOMNode(wrapper.instance())
      const node = parentNode.querySelector('.test')

      node.focus()

      const enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.calledTwice
    })

    it('should not fire parent handler when a child has isolate prop set to true', () => {
      const childHandlerSpy = sinon.spy()
      const props = _.assign({}, baseProps, {
        children: React.createElement(Shortcuts, _.assign({}, baseProps, {
          className: 'test',
          isolate: true,
          handler: childHandlerSpy,
        })),
      })

      const shortcutComponent = React.createElement(Shortcuts, props)
      const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      const parentNode = ReactDOM.findDOMNode(wrapper.instance())
      const node = parentNode.querySelector('.test')

      node.focus()

      const enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(childHandlerSpy).to.have.been.called
      expect(baseProps.handler).to.not.have.been.called
    })

    it('should fire parent handler when is global and a child has isolate prop set to true', () => {
      const props = _.assign({}, baseProps, {
        global: true,
        children: React.createElement(Shortcuts, _.assign({}, baseProps, { className: 'test', isolate: true })),
      })

      const shortcutComponent = React.createElement(Shortcuts, props)
      const wrapper = enzyme.mount(shortcutComponent, { context: baseContext })

      const parentNode = ReactDOM.findDOMNode(wrapper.instance())
      const node = parentNode.querySelector('.test')

      node.focus()

      const enter = 13
      simulant.fire(node, 'keydown', { keyCode: enter })

      expect(baseProps.handler).to.have.been.called
    })
  })
})
