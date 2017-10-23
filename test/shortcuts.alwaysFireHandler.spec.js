import React from 'react';

import { expect } from 'chai';
import simulant from 'simulant';

import keymap from './keymap';
import KeyCodes from './support/KeyCodes';
import ShortcutManager from '../src/shortcut-manager';
import renderComponent from './support/renderComponent';

describe('<Shortcuts /> alwaysFireHandler prop:', () => {
  beforeEach(function () {
    const keymapWithPrintableChar = {
      ...keymap,
      'TESTING': {
        ...keymap.TESTING,
        'All': 'a',
      },
    };

    const shortcutsManager = new ShortcutManager(keymapWithPrintableChar);
    this.context = { shortcuts: shortcutsManager };
  });

  context('when no alwaysFireHandler value has been provided', () => {
    beforeEach(function () {
      const { wrapper, node } = renderComponent({
        mergeWithBaseProps: {
          children: <input type="text" className="input" />,
        },
        context: this.context,
      });

      this.wrapper = wrapper;
      this.node = node;
    });

    it('then has a default value of false', () => {

    });
    context('and an input element is focused', () => {
      beforeEach(function () {
        this.childNode = this.node.querySelector('.input');
        this.childNode.focus();
      });

      context('and a non-printable key matching a shortcut is pressed', () => {
        it('then calls the handler with the correct arguments', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: KeyCodes.ENTER, key: 'ENTER' });

          expect(this.wrapper.props().handler).to.have.been.calledWith('OPEN');
        });
      });

      context('and a non-printable key NOT matching a shortcut is pressed', () => {
        it('then does NOT call the handler', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: KeyCodes.TAB, key: 'TAB' });

          expect(this.wrapper.props().handler).to.not.have.been.called;
        });
      });

      context('and a printable key matching a shortcut is pressed', () => {
        it('then does NOT calls the handler', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: 65, key: 'a' });

          expect(this.wrapper.props().handler).to.not.have.been.called;
        });
      });

      context('and a printable key NOT matching a shortcut is pressed', () => {
        it('then does NOT calls the handler', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: 66, key: 'b' });

          expect(this.wrapper.props().handler).to.not.have.been.called;
        });
      });
    });
  });

  context('when a truthy alwaysFireHandler value has been provided', () => {
    beforeEach(function () {
      const { wrapper, node } = renderComponent({
        mergeWithBaseProps: {
          children: <input type="text" className="input" />,
          alwaysFireHandler: true,
        },
        context: this.context,
      });

      this.wrapper = wrapper;
      this.node = node;
    });

    context('and an input element is focused', () => {
      beforeEach(function () {
        this.childNode = this.node.querySelector('.input');
        this.childNode.focus();
      });

      context('and a non-printable key matching a shortcut is pressed', () => {
        it('then calls the handler with the correct arguments', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: KeyCodes.ENTER, key: 'ENTER' });

          expect(this.wrapper.props().handler).to.have.been.calledWith('OPEN');
        });
      });

      context('and a non-printable key NOT matching a shortcut is pressed', () => {
        it('then does NOT call the handler', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: KeyCodes.TAB, key: 'TAB' });

          expect(this.wrapper.props().handler).to.not.have.been.called;
        });
      });

      context('and a printable key matching a shortcut is pressed', () => {
        it('then does NOT calls the handler', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: 65, key: 'a' });

          expect(this.wrapper.props().handler).to.not.have.been.called;
        });
      });

      context('and a printable key NOT matching a shortcut is pressed', () => {
        it('then does NOT calls the handler', function () {
          simulant.fire(this.childNode, 'keydown', { keyCode: 66, key: 'b' });

          expect(this.wrapper.props().handler).to.not.have.been.called;
        });
      });
    });
  });
});
