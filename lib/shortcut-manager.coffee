_ = require 'lodash'
invariant = require 'invariant'
{EventEmitter} = require 'events'
helpers = require './helpers'

class ShortcutManager extends EventEmitter

  @CHANGE_EVENT = 'shortcuts:update'

  constructor: (keymap = {}) ->
    @_keymap = keymap

  addUpdateListener: (callback) ->
    invariant callback,
      'addUpdateListener: callback argument is not defined or falsy'
    @on(ShortcutManager.CHANGE_EVENT, callback)

  removeUpdateListener: (callback) ->
    @removeListener(ShortcutManager.CHANGE_EVENT, callback)

  _platformName: helpers.getPlatformName()

  _parseShortcutDescriptor: (item) ->
    if _.isPlainObject(item)
      return _.get(item, @_platformName)
    else
      return item

  setKeymap: (keymap) ->
    invariant keymap,
      'setKeymap: keymap argument is not defined or falsy.'
    @_keymap = keymap
    @emit(ShortcutManager.CHANGE_EVENT)

  getAllShortcuts: ->
    return @_keymap

  getShortcuts: (componentName) ->
    invariant componentName,
      'getShortcuts: name argument is not defined or falsy.'

    cursor = @_keymap[componentName]
    invariant cursor,
      "getShortcuts: There are no shortcuts with name #{componentName}."

    _parseShortcutDescriptor = @_parseShortcutDescriptor.bind(this)
    shortcuts = _(cursor).map(_parseShortcutDescriptor).flatten().value()

    return shortcuts

  _parseShortcutKeyName: (obj, keyName) ->
    result = _.findKey obj, (item) =>
      if _.isPlainObject(item)
        item = _.get(item, @_platformName)
      if _.isArray(item)
        index = item.indexOf(keyName)
        item = item[index] if index >= 0
      return item is keyName

    return result

  findShortcutName: (keyName, componentName) ->
    invariant keyName,
      'findShortcutName: keyName argument is not defined or falsy.'
    invariant componentName,
      'findShortcutName: componentName argument is not defined or falsy.'

    cursor = @_keymap[componentName]
    result = @_parseShortcutKeyName(cursor, keyName)

    return result



module.exports = ShortcutManager
