import _ from 'lodash'
import invariant from 'invariant'
import { EventEmitter } from 'events'
import helpers from './helpers'


const warning = (text) => {
  if (process && process.env.NODE_ENV !== 'production') {
    console.warn(text)
  }
}

class ShortcutManager extends EventEmitter {
  static CHANGE_EVENT = 'shortcuts:update'

  constructor(keymap = {}) {
    super()
    this._keymap = keymap
  }

  addUpdateListener(callback) {
    invariant(callback,
      'addUpdateListener: callback argument is not defined or falsy')
    this.on(ShortcutManager.CHANGE_EVENT, callback)
  }

  removeUpdateListener(callback) {
    this.removeListener(ShortcutManager.CHANGE_EVENT, callback)
  }

  _platformName = helpers.getPlatformName()

  _parseShortcutDescriptor = (item) => {
    if (_.isPlainObject(item)) {
      return _.get(item, this._platformName)
    }
    return item
  }

  setKeymap(keymap) {
    invariant(keymap,
      'setKeymap: keymap argument is not defined or falsy.')
    this._keymap = keymap
    this.emit(ShortcutManager.CHANGE_EVENT)
  }

  getAllShortcuts() {
    return this._keymap
  }

  getAllShortcutsForPlatform(platformName) {
    const _transformShortcuts = (shortcuts) => {
      return _.reduce(shortcuts, (result, keyValue, keyName) => {
        if (_.isPlainObject(keyValue)) {
          if (keyValue[platformName]) {
            keyValue = keyValue[platformName]
          } else {
            result[keyName] = _transformShortcuts(keyValue)
            return result
          }
        }

        result[keyName] = keyValue
        return result
      }, {})
    }

    return _transformShortcuts(this._keymap)
  }

  getAllShortcutsForCurrentPlatform() {
    return this.getAllShortcutsForPlatform(this._platformName)
  }

  getShortcuts(componentName) {
    invariant(componentName,
      'getShortcuts: name argument is not defined or falsy.')

    const cursor = this._keymap[componentName]
    if (!cursor) {
      warning(`getShortcuts: There are no shortcuts with name ${componentName}.`)
      return
    }

    const shortcuts = _(cursor)
      .map(this._parseShortcutDescriptor)
      .flatten()
      .compact()
      .value()

    return shortcuts
  }

  _parseShortcutKeyName(obj, keyName) {
    const result = _.findKey(obj, (item) => {
      if (_.isPlainObject(item)) {
        item = _.get(item, this._platformName)
      }
      if (_.isArray(item)) {
        const index = item.indexOf(keyName)
        if (index >= 0) { item = item[index] }
      }
      return item === keyName
    })

    return result
  }

  findShortcutName(keyName, componentName) {
    invariant(keyName,
      'findShortcutName: keyName argument is not defined or falsy.')
    invariant(componentName,
      'findShortcutName: componentName argument is not defined or falsy.')

    const cursor = this._keymap[componentName]
    const result = this._parseShortcutKeyName(cursor, keyName)

    return result
  }
}


export default ShortcutManager
