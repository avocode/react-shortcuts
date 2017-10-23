import React from 'react';

import { expect } from 'chai';
import simulant from 'simulant';

import KeyCodes from './support/KeyCodes';
import renderComponent from './support/renderComponent';

describe('Shortcuts component', () => {
  describe('Calling the handler function:', () => {
    context('when an element in a namespace with defined shortcuts is focused', () => {
      beforeEach(function () {
        const { wrapper, node } = renderComponent();
        node.focus();

        this.node = node;
        this.wrapper = wrapper;
        this.handler = wrapper.props().handler;
      });

      context('and a matching key is pressed', () => {
        it('then calls the handler with the correct action', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });
          expect(this.handler).to.have.been.calledWith('OPEN');

          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ESC });
          expect(this.handler).to.have.been.calledWith('CLOSE');
        });
      });

      context('and a key that doesn\'t match any shortcuts is pressed', () => {
        it('then does NOT call the handler', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.TAB });

          expect(this.handler).to.not.have.been.called;
        });
      });

      context('and the component has been unmounted', () => {
        it('then does not call the handler when a matching key is pressed', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });

          expect(this.handler).to.have.been.calledOnce;

          this.wrapper.unmount();
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });

          expect(this.handler).to.have.been.calledOnce;
        });
      });
    });

    context('when an element in a namespace WITHOUT defined shortcuts is focused and a key is pressed', () => {
      beforeEach(function () {
        const { wrapper, node } = renderComponent({ mergeWithBaseProps: { name: 'NO-SHORTCUTS' } });
        node.focus();

        this.node = node;
        this.wrapper = wrapper;
        this.handler = wrapper.props().handler;
      });

      it('then does NOT call the handler', function () {
        simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });

        expect(this.handler).to.not.have.been.called;
      });
    });

    context('when an element in a namespace NOT defined in the keymap is focused', () => {
      beforeEach(function () {
        const { wrapper, node } = renderComponent({ mergeWithBaseProps: { name: 'NO-SHORTCUTS' } });
        node.focus();

        this.node = node;
        this.wrapper = wrapper;
        this.handler = wrapper.props().handler;
      });

      it('then does NOT call the handler', function () {
        simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });

        expect(this.handler).to.not.have.been.called;
      });
    });
  });

  context('when a child element is focused and a key matching a shortcut is pressed', () => {
    beforeEach(function () {
      const { wrapper, node, context } = renderComponent({
        mergeWithBaseProps: { children: <input type="text" className="input" /> },
      });

      node.focus();

      const childNode = node.querySelector('.input');
      childNode.focus();

      this.childNode = childNode;
      this.wrapper = wrapper;
      this.shortcuts = context.shortcuts;
      this.handler = wrapper.props().handler;
    });

    it('then calls the handler', function () {
      simulant.fire(this.childNode, 'keydown', { keyCode: KeyCodes.ENTER, key: 'Enter' });

      expect(this.handler).to.have.been.calledWith('OPEN');
    });
  });
});
