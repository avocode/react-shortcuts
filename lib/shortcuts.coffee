_ = require 'lodash'
invariant = require 'invariant'
{EventEmitter} = require 'events'
helpers = require './helpers'

class ShortcutsManager extends EventEmitter

  @CHANGE_EVENT = 'shortcuts:update'

  constructor: (@_keymap = {}) ->

  onUpdate: (callback) ->
    invariant(callback, 'onUpdate: callback argument is not defined or falsy')
    @on(ShortcutsManager.CHANGE_EVENT, callback)

  dispose: (callback) ->
    @removeEvent(ShortcutsManager.CHANGE_EVENT)

  _platformName: helpers.getPlatformName()

  _mapShortcuts: (item) ->
    return _.get(item, @_platformName) if _.isPlainObject(item)
    item

  add: (@_keymap) ->
    invariant(@_keymap, 'add: Keymap argument is not defined or falsy.')

  update: (@_keymap) ->
    invariant(@_keymap, 'update: Keymap argument is not defined or falsy.')
    @emit(ShortcutsManager.CHANGE_EVENT)

  getAllShortcuts: ->
    @_keymap

  getShortcuts: (name) ->
    invariant(name, 'getShortcuts: name argument is not defined or falsy.')

    @_cursor = @_keymap[name]
    invariant(@_cursor, "getShortcuts: There is no shortcuts with name #{name}.")

    shortcuts = _(@_cursor).map(@_mapShortcuts.bind(@)).flatten().value()

  findShortcutName: (name) ->
    invariant(name, 'findShortcutName: name argument is not defined or falsy.')
    invariant(@_cursor, 'findShortcutName: you must call .getShortcuts() first.')

    _.findKey @_cursor, (item) =>
      if _.isArray(item)
        index = item.indexOf(name)
        item[index] is name if index >= 0
      else if _.isPlainObject(item)
        _.get(item, @_platformName) is name
      else
        item is name



module.exports = ShortcutsManager
