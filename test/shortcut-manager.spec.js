import jsdom from 'jsdom'
import chai from 'chai'
import _ from 'lodash'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'

import keymap from './keymap'

chai.use(sinonChai)

const { expect } = chai

describe('Shortcut manager', () => {
  let ShortcutManager = null

  before(() => {
    global.document = jsdom.jsdom('<html><body></body></html>')
    global.window = document.defaultView
    global.Image = window.Image
    global.navigator = window.navigator
    global.CustomEvent = window.CustomEvent

    ShortcutManager = require('../src').ShortcutManager
  })

  it('should return empty object when calling empty constructor', () => {
    const manager = new ShortcutManager()
    expect(manager.getAllShortcuts()).to.be.empty
  })

  it('should return all shortcuts', () => {
    const manager = new ShortcutManager(keymap)
    expect(manager.getAllShortcuts()).to.not.be.empty
    expect(manager.getAllShortcuts()).to.be.equal(keymap)

    manager.setKeymap({})
    expect(manager.getAllShortcuts()).to.be.empty

    manager.setKeymap(keymap)
    expect(manager.getAllShortcuts()).to.be.equal(keymap)
  })

  it('should return all shortcuts for the Windows platform', () => {
    const manager = new ShortcutManager(keymap)
    const keyMapResult = {
      'Test': {
        MOVE_LEFT: 'left',
        MOVE_RIGHT: 'right',
        MOVE_UP: ['up', 'w'],
        DELETE: 'delete',
      },
      'Next': {
        OPEN: 'alt+o',
        ABORT: ['d', 'c'],
        CLOSE: ['esc', 'enter'],
      },
      'TESTING': {
        'OPEN': 'enter',
        'CLOSE': 'esc',
      },
      'NON-EXISTING': {},
    }

    expect(manager.getAllShortcutsForPlatform('windows')).to.eql(keyMapResult)
  })

  it('should return all shortcuts for the macOs platform', () => {
    const manager = new ShortcutManager(keymap)
    const keyMapResult = {
      'Test': {
        MOVE_LEFT: 'left',
        MOVE_RIGHT: 'right',
        MOVE_UP: ['up', 'w'],
        DELETE: 'alt+backspace',
      },
      'Next': {
        OPEN: 'alt+o',
        ABORT: ['d', 'c'],
        CLOSE: ['esc', 'enter'],
      },
      'TESTING': {
        'OPEN': 'enter',
        'CLOSE': 'esc',
      },
      'NON-EXISTING': {},
    }

    expect(manager.getAllShortcutsForPlatform('osx')).to.eql(keyMapResult)
  })

  it('should expose the change event type as a static constant', () =>
    expect(ShortcutManager.CHANGE_EVENT).to.exist
  )

  it('should have static CHANGE_EVENT', () =>
    expect(ShortcutManager.CHANGE_EVENT).to.be.equal('shortcuts:update')
  )

  it('should call onUpdate', () => {
    const manager = new ShortcutManager()
    const spy = sinon.spy()
    manager.addUpdateListener(spy)
    manager.setKeymap({})
    expect(spy).to.have.been.called
  })

  it('should throw an error when setKeymap is called without arg', () => {
    const manager = new ShortcutManager(keymap)
    const error = /setKeymap: keymap argument is not defined or falsy./
    expect(manager.setKeymap).to.throw(error)
  })

  it('should extend the keymap', () => {
    const manager = new ShortcutManager()
    const newKeymap = { 'TESTING-NAMESPACE': {} }
    const extendedKeymap = Object.assign({}, keymap, newKeymap)
    manager.setKeymap(keymap)
    manager.extendKeymap(newKeymap)

    expect(manager.getAllShortcuts()).to.eql(extendedKeymap)
  })

  it('should return array of shortcuts', () => {
    const manager = new ShortcutManager(keymap)
    let shortcuts = manager.getShortcuts('Test')
    expect(shortcuts).to.be.an('array')

    let shouldContainStrings = _.every(shortcuts, _.isString)
    expect(shouldContainStrings).to.be.equal(true)
    expect(shortcuts.length).to.be.equal(5)

    shortcuts = manager.getShortcuts('Next')
    expect(shortcuts).to.be.an('array')
    shouldContainStrings = _.every(shortcuts, _.isString)
    expect(shouldContainStrings).to.be.equal(true)
    expect(shortcuts.length).to.be.equal(5)
  })

  it('should not throw an error when getting not existing key from keymap', () => {
    const manager = new ShortcutManager(keymap)
    const notExist = () => manager.getShortcuts('NotExist')
    expect(notExist).to.not.throw()
  })

  it('should return correct key label', () => {
    const manager = new ShortcutManager()
    manager.setKeymap(keymap)

    // Test
    expect(manager.findShortcutName('alt+backspace', 'Test')).to.be.equal('DELETE')
    expect(manager.findShortcutName('w', 'Test')).to.be.equal('MOVE_UP')
    expect(manager.findShortcutName('up', 'Test')).to.be.equal('MOVE_UP')
    expect(manager.findShortcutName('left', 'Test')).to.be.equal('MOVE_LEFT')
    expect(manager.findShortcutName('right', 'Test')).to.be.equal('MOVE_RIGHT')

    // Next
    expect(manager.findShortcutName('alt+o', 'Next')).to.be.equal('OPEN')
    expect(manager.findShortcutName('d', 'Next')).to.be.equal('ABORT')
    expect(manager.findShortcutName('c', 'Next')).to.be.equal('ABORT')
    expect(manager.findShortcutName('esc', 'Next')).to.be.equal('CLOSE')
    expect(manager.findShortcutName('enter', 'Next')).to.be.equal('CLOSE')
  })

  it('should throw an error', () => {
    const manager = new ShortcutManager()
    const fn = () => manager.findShortcutName('left')
    expect(manager.findShortcutName).to.throw(/findShortcutName: keyName argument is not defined or falsy./)
    expect(fn).to.throw(/findShortcutName: componentName argument is not defined or falsy./)
  })
})
