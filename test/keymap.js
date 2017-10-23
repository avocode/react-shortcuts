export default {
  'Test': {
    MOVE_LEFT: 'left',
    MOVE_RIGHT: 'right',
    MOVE_UP: ['up', 'w'],
    DELETE: {
      osx: 'alt+backspace',
      windows: 'delete',
      linux: 'alt+backspace',
      other: 'alt+backspace',
    },
  },
  'Next': {
    OPEN: 'alt+o',
    ABORT: ['d', 'c'],
    CLOSE: {
      osx: ['esc', 'enter'],
      windows: ['esc', 'enter'],
      linux: ['esc', 'enter'],
      other: ['esc', 'enter'],
    },
  },
  'TESTING': {
    'OPEN': 'enter',
    'CLOSE': 'esc',
  },
  'PARENT': {
    'OPEN': 'enter',
    'NEXT': 'tab',
  },
  'NO-SHORTCUTS': {},
};
