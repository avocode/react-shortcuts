import React from 'react';

import { expect } from 'chai';
import simulant from 'simulant';

import KeyCodes from './support/KeyCodes';
import renderComponent from './support/renderComponent';

describe('<Shortcuts /> stopPropagation prop:', () => {
  context('when no stopPropagation value has been provided', () => {
    before(function () {
      const { wrapper } = renderComponent({ props: {} });

      this.wrapper = wrapper;
    });

    it('then has a value of null', function () {
      expect(this.wrapper.props().stopPropagation).to.be.equal(true);
    });

    context('and the <Shortcuts /> is rendered inside another with overlapping shortcuts', () => {
      beforeEach(function () {
        const { wrapper: childWrapper, component: childComponent } = renderComponent({
          mergeWithBaseProps: {
            className: 'test',
          },
        });

        const { wrapper: parentWrapper, node: parentNode } = renderComponent({ mergeWithBaseProps: {
          children: childComponent,
          name: 'PARENT',
        } });

        const node = parentNode.querySelector('.test');
        node.focus();

        this.node = node;
        this.childWrapper = childWrapper;
        this.parentWrapper = parentWrapper;
      });

      context('and a key corresponding to a shortcut only in the child <Shortcuts /> is pressed', () => {
        it('then the parent Shortcuts\' handler is NOT called', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ESC });

          expect(this.childWrapper.props().handler).to.have.been.calledWith('CLOSE');
          expect(this.parentWrapper.props().handler).to.not.have.been.called;
        });
      });

      context('and a key corresponding to a shortcut only in the parent <Shortcuts /> is pressed', () => {
        it('then the parent Shortcuts\' handler is NOT called', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.TAB });

          expect(this.childWrapper.props().handler).to.not.have.been.called;
          expect(this.parentWrapper.props().handler).to.not.have.been.called;
        });
      });

      context('and a key corresponding to a shortcut both in the child and parent <Shortcuts /> is pressed', () => {
        it('then the parent Shortcuts\' handler is NOT called', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });

          expect(this.childWrapper.props().handler).to.have.been.calledWith('OPEN');
          expect(this.parentWrapper.props().handler).to.not.have.been.called;
        });
      });
    });
  });

  context('when stopPropagation is set to false', () => {
    context('and the <Shortcuts /> is rendered inside another with overlapping shortcuts', () => {
      beforeEach(function () {
        const { wrapper: childWrapper, component: childComponent } = renderComponent({
          mergeWithBaseProps: {
            stopPropagation: false,
            className: 'test',
          },
        });

        const { wrapper: parentWrapper, node: parentNode } = renderComponent({ mergeWithBaseProps: {
          children: childComponent,
          name: 'PARENT',
        } });

        const node = parentNode.querySelector('.test');
        node.focus();

        this.node = node;
        this.childWrapper = childWrapper;
        this.parentWrapper = parentWrapper;
      });

      context('and a key corresponding to a shortcut only in the child <Shortcuts /> is pressed', () => {
        it('then the parent Shortcuts\' handler is NOT called', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ESC });

          expect(this.childWrapper.props().handler).to.have.been.calledWith('CLOSE');
          expect(this.parentWrapper.props().handler).to.not.have.been.called;
        });
      });

      context('and a key corresponding to a shortcut only in the parent <Shortcuts /> is pressed', () => {
        it('then the parent Shortcuts\' handler is called with the correct arguments', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.TAB });

          expect(this.childWrapper.props().handler).to.not.have.been.called;
          expect(this.parentWrapper.props().handler).to.have.been.calledWith('NEXT');
        });
      });

      context('and a key corresponding to a shortcut both in the child and parent <Shortcuts /> is pressed', () => {
        it('then the parent Shortcuts\' handler is called with the correct arguments', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });

          expect(this.childWrapper.props().handler).to.have.been.calledOnce;
          expect(this.parentWrapper.props().handler).to.have.been.calledOnce;
        });
      });
    });
  });
});
