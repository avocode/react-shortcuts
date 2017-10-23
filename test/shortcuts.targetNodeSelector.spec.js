import React from 'react';

import enzyme from 'enzyme';
import { expect } from 'chai';
import simulant from 'simulant';

import KeyCodes from './support/KeyCodes';
import renderComponent from './support/renderComponent';

import Shortcuts from '../src/component/shortcuts';
import ShortcutManager from '../src/shortcut-manager';

describe('<Shortcuts /> targetNodeSelector prop:', () => {
  context('when no alwaysFireHandler value has been provided', () => {
    before(function () {
      const { wrapper } = renderComponent({ props: {} });

      this.wrapper = wrapper;
    });

    it('then has a value of null', function () {
      expect(this.wrapper.props().targetNodeSelector).to.be.equal(null);
    });
  });

  context('when provided a targetNodeSelector', () => {
    context('that matches an element in the DOM', () => {
      it('then calls the handler when a matching key is pressed', () => {
        const { wrapper } = renderComponent({ mergeWithBaseProps: { targetNodeSelector: 'body' } });

        simulant.fire(document.body, 'keydown', { keyCode: KeyCodes.ENTER, key: 'Enter' });

        expect(wrapper.props().handler).to.have.been.calledWith('OPEN');
      });
    });

    context('that does NOT match an element in the DOM', () => {
      it('then calls the handler when a matching key is pressed', () => {
        const component = (
          <Shortcuts targetNodeSelector="non-existent" />
        );

        const shortcutsManager = new ShortcutManager({});
        const context = { shortcuts: shortcutsManager };

        expect(() => enzyme.mount(component, { context })).to.throw(
          'Node selector \'non-existent\'  was not found.'
        );
      });
    });
  });
});
