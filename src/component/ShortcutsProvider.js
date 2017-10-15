import React, { Component } from 'react';
import PropTypes from 'prop-types';

import shortcutManager from '../shortcut-manager';

class ShortcutsProvider extends Component {

  getChildContext() {
    const { keymap } = this.props;

    return {
      shortcuts: new shortcutManager(keymap),
    };
  }

  render() {
    return this.props.children;
  }

}

ShortcutsProvider.propTypes = {
  children: PropTypes.node,
  keymap: PropTypes.object.isRequired,
};

ShortcutsProvider.defaultProps = {
  children: null,
};

ShortcutsProvider.childContextTypes = {
  shortcuts: PropTypes.object.isRequired,
};

export default ShortcutsProvider;
