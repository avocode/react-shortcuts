import _ from 'lodash'
import invariant from 'invariant'
import { EventEmitter } from 'events'
import helpers from './helpers'

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

  _parseShortcutDescriptor(item) {
    if (_.isPlainObject(item)) {
      return _.get(item, this._platformName)
    } else {
      return item
    }
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

  getShortcuts(componentName) {
    invariant(componentName,
      'getShortcuts: name argument is not defined or falsy.')

    let cursor = this._keymap[componentName]
    invariant(cursor,
      `getShortcuts: There are no shortcuts with name ${componentName}.`)

    let _parseShortcutDescriptor = this._parseShortcutDescriptor.bind(this)
    let shortcuts = _(cursor).map(_parseShortcutDescriptor).flatten().value()

    return shortcuts
  }

  _parseShortcutKeyName(obj, keyName) {
    let result = _.findKey(obj, item => {
      if (_.isPlainObject(item)) {
        item = _.get(item, this._platformName)
      }
      if (_.isArray(item)) {
        let index = item.indexOf(keyName)
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

    let cursor = this._keymap[componentName]
    let result = this._parseShortcutKeyName(cursor, keyName)

    return result
  }
}


export default ShortcutManager
