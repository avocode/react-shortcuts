_ = require 'lodash'
invariant = require 'invariant'
{EventEmitter} = require 'events'
helpers = require './helpers'

class ShortcutManager extends EventEmitter

  @CHANGE_EVENT = 'shortcuts:update'

  constructor: (keymap = {}) ->
    @_keymap = keymap

  addUpdateListener: (callback) ->
    invariant(callback, 'addUpdateListener: callback argument is not defined or falsy')
    @on(ShortcutManager.CHANGE_EVENT, callback)

  removeUpdateListener: (callback) ->
    @removeListener(ShortcutManager.CHANGE_EVENT, callback)

  _platformName: helpers.getPlatformName()

  _parseShortcutDescriptor: (item) ->
    if _.isPlainObject(item)
      return _.get(item, @_platformName)
    else
      return item

  addKeymap: (keymap) ->
    invariant(keymap, 'addKeymap: keymap argument is not defined or falsy.')
    @_keymap = keymap

  setKeymap: (keymap) ->
    invariant(keymap, 'setKeymap: keymap argument is not defined or falsy.')
    @_keymap = keymap
    @emit(ShortcutManager.CHANGE_EVENT)

  getAllShortcuts: ->
    return @_keymap

  getShortcuts: (componentName) ->
    invariant(componentName, 'getShortcuts: name argument is not defined or falsy.')

    cursor = @_keymap[componentName]
    invariant(cursor, "getShortcuts: There are no shortcuts with name #{componentName}.")

    _parseShortcutDescriptor = @_parseShortcutDescriptor.bind(this)
    shortcuts = _(cursor).map(_parseShortcutDescriptor).flatten().value()

    return shortcuts

  findShortcutName: (keyName, componentName) ->
    invariant(keyName, 'findShortcutName: keyName argument is not defined or falsy.')
    invariant(componentName, 'findShortcutName: componentName argument is not defined or falsy.')

    cursor = @_keymap[componentName]
    result = _.findKey cursor, (item) =>
      if _.isArray(item)
        index = item.indexOf(keyName)
        item[index] is keyName if index >= 0
      else if _.isPlainObject(item)
        _.get(item, @_platformName) is keyName
      else
        item is keyName

    return result



module.exports = ShortcutManager
