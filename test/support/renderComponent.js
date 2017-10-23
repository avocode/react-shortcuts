import React from 'react';
import ReactDOM from 'react-dom';
import enzyme from 'enzyme';

import sinon from 'sinon';

import keymap from '../keymap';
import Shortcuts from '../../src/component/shortcuts';
import ShortcutManager from '../../src/shortcut-manager';

function renderComponent({ props, mergeWithBaseProps, context } = {}) {
  const effectiveProps = (() => {
    if (props) {
      return props;
    }

    const baseProps = {
      handler: sinon.spy(),
      name: 'TESTING',
      className: null,
    };

    if (mergeWithBaseProps) {
      return { ...baseProps, ...mergeWithBaseProps };
    }

    return baseProps;
  })();

  const component = (
    <Shortcuts{ ...effectiveProps } />
  );

  const effectiveContext = (() => {
    if (context) {
      return context;
    }

    const shortcutsManager = new ShortcutManager(keymap);
    return { shortcuts: shortcutsManager };
  })();

  const wrapper = enzyme.mount(component, { context: effectiveContext });
  const node = ReactDOM.findDOMNode(wrapper.instance());

  return {
    wrapper, component, node, context: effectiveContext,
  };
}

export default renderComponent;
