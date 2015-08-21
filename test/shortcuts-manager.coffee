keymap = require './keymap'
ShortcutsManager = require '../lib'

describe 'Shortcuts manager: ', ->
  manager = null

  beforeEach ->
    manager = null

  it 'should return empty object when calling empty constructor', ->
    manager = new ShortcutsManager()
    expect(manager._keymap).toExist(_.isEqual(manager._keymap, {}))

  it 'should return _keymap obj that is not empty', ->
    manager = new ShortcutsManager(keymap)
    expect(manager._keymap).toExist(not _.isEmpty(manager._keymap))

  it 'CHANGE_EVENT: should have static CHANGE_EVENT method', ->
    expect(ShortcutsManager.CHANGE_EVENT).toExist()

  it 'CHANGE_EVENT: should have static CHANGE_EVENT with defined value', ->
    expect(ShortcutsManager.CHANGE_EVENT).toBe('shortcuts:update')

  it 'emitUpdate: should call onUpdate when update called', ->
    manager = new ShortcutsManager()
    spy = expect.createSpy()
    manager.onUpdate(spy)
    manager.update(true)
    expect(spy).toHaveBeenCalled()

  it 'onUpdate: should throw an error when onUpdate called without arg', ->
    manager = new ShortcutsManager(keymap)
    error = /Error: Invariant Violation: onUpdate: callback argument is not defined or falsy/
    expect(manager.onUpdate).toThrow(error)

  it 'add: should throw an error when add called without arg', ->
    manager = new ShortcutsManager(keymap)
    error = /Error: Invariant Violation: add: Keymap argument is not defined or falsy/
    expect(manager.add).toThrow(error)

  it 'add: should return _keymap obj that is not empty', ->
    manager = new ShortcutsManager()
    manager.add(keymap)
    expect(manager._keymap).toExist(not _.isEmpty(manager._keymap))

  it 'getAllShortcuts: should return _keymap that is not empty', ->
    manager = new ShortcutsManager(keymap)
    expect(manager.getAllShortcuts()).toExist(not _.isEmpty(manager._keymap))

  it 'getShortcuts: should return array of shortcuts', ->
    manager = new ShortcutsManager(keymap)
    arr = manager.getShortcuts('Test')
    expect(_.isArray(arr)).toExist()

    expect(arr.length).toBe(5)

  it 'getShortcuts: should throw an error', ->
    manager = new ShortcutsManager(keymap)
    notExist = ->
      manager.getShortcuts('NotExist')
    expect(notExist).toThrow(/Error: Invariant Violation: getShortcuts: There is no shortcuts with name NotExist./)

  it 'findShortcutName: should return correct key label', ->
    manager = new ShortcutsManager()
    manager.add(keymap)
    manager.getShortcuts('Test')

    expect(manager.findShortcutName('command+backspace')).toBe('DELETE')
    expect(manager.findShortcutName('w')).toBe('MOVE_UP')
    expect(manager.findShortcutName('left')).toBe('MOVE_LEFT')
    expect(manager.findShortcutName('right')).toBe('MOVE_RIGHT')

  it 'findShortcutName: should throw an error', ->
    manager = new ShortcutsManager()
    fn = ->
      manager.findShortcutName('left')
    expect(manager.findShortcutName).toThrow(/Error: Invariant Violation: findShortcutName: name argument is not defined or falsy./)
    expect(fn).toThrow(/Error: Invariant Violation: findShortcutName: you must call/)
