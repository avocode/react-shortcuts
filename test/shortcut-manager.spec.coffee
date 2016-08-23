chai = require 'chai'
_ = require 'lodash'
sinonChai = require 'sinon-chai'
sinon = require 'sinon'

keymap = require './keymap'
ShortcutManager = require '../src'

chai.use(sinonChai)

expect = chai.expect


describe 'Shortcut manager: ', ->
  it 'should return empty object when calling empty constructor', ->
    manager = new ShortcutManager()
    expect(manager.getAllShortcuts()).to.be.empty

  it 'should return all shortcuts', ->
    manager = new ShortcutManager(keymap)
    expect(manager.getAllShortcuts()).to.not.be.empty
    expect(manager.getAllShortcuts()).to.be.equal(keymap)

    manager.setKeymap({})
    expect(manager.getAllShortcuts()).to.be.empty

    manager.setKeymap(keymap)
    expect(manager.getAllShortcuts()).to.be.equal(keymap)

  it 'should expose the change event type as a static constant', ->
    expect(ShortcutManager.CHANGE_EVENT).to.exist

  it 'should have static CHANGE_EVENT', ->
    expect(ShortcutManager.CHANGE_EVENT).to.be.equal('shortcuts:update')

  it 'should call onUpdate', ->
    manager = new ShortcutManager()
    spy = sinon.spy()
    manager.addUpdateListener(spy)
    manager.setKeymap({})
    expect(spy).to.have.beenCalled

  it 'should throw an error when setKeymap is called without arg', ->
    manager = new ShortcutManager(keymap)
    error = /setKeymap: keymap argument is not defined or falsy./
    expect(manager.setKeymap).to.throw(error)

  it 'should return array of shortcuts', ->
    manager = new ShortcutManager(keymap)
    shortcuts = manager.getShortcuts('Test')
    expect(shortcuts).to.be.an.array

    shouldContainStrings = _.every(shortcuts, _.isString)
    expect(shouldContainStrings).to.be.equal(true)
    expect(shortcuts.length).to.be.equal(5)

    shortcuts = manager.getShortcuts('Next')
    expect(shortcuts).to.be.an.array
    shouldContainStrings = _.every(shortcuts, _.isString)
    expect(shouldContainStrings).to.be.equal(true)
    expect(shortcuts.length).to.be.equal(5)

  it 'should throw an error', ->
    manager = new ShortcutManager(keymap)
    notExist = ->
      manager.getShortcuts('NotExist')
    expect(notExist).to.throw(/getShortcuts: There are no shortcuts with name NotExist./)

  it 'findShortcutName: should return correct key label', ->
    manager = new ShortcutManager()
    manager.setKeymap(keymap)

    # Test
    expect(manager.findShortcutName('alt+backspace', 'Test')).to.be.equal('DELETE')
    expect(manager.findShortcutName('w', 'Test')).to.be.equal('MOVE_UP')
    expect(manager.findShortcutName('up', 'Test')).to.be.equal('MOVE_UP')
    expect(manager.findShortcutName('left', 'Test')).to.be.equal('MOVE_LEFT')
    expect(manager.findShortcutName('right', 'Test')).to.be.equal('MOVE_RIGHT')

    # Next
    expect(manager.findShortcutName('alt+o', 'Next')).to.be.equal('OPEN')
    expect(manager.findShortcutName('d', 'Next')).to.be.equal('ABORT')
    expect(manager.findShortcutName('c', 'Next')).to.be.equal('ABORT')
    expect(manager.findShortcutName('esc', 'Next')).to.be.equal('CLOSE')
    expect(manager.findShortcutName('enter', 'Next')).to.be.equal('CLOSE')


  it 'findShortcutName: should throw an error', ->
    manager = new ShortcutManager()
    fn = ->
      manager.findShortcutName('left')
    expect(manager.findShortcutName).to.throw(/findShortcutName: keyName argument is not defined or falsy./)
    expect(fn).to.throw(/findShortcutName: componentName argument is not defined or falsy./)
