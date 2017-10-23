import { expect } from 'chai';
import simulant from 'simulant';

import KeyCodes from './support/KeyCodes';
import renderComponent from './support/renderComponent';

describe('<Shortcuts /> global prop:', () => {
  context('when no global value has been provided', () => {
    beforeEach(function () {
      const { wrapper, node } = renderComponent({ props: {} });
      node.focus();

      this.node = node;
      this.wrapper = wrapper;
      this.handler = wrapper.props().handler;
    });

    it('then has a value of false', function () {
      expect(this.wrapper.props().global).to.be.equal(false);
    });
  });

  context('when global is set to true', () => {
    beforeEach(function () {
      const { wrapper, node } = renderComponent({ mergeWithBaseProps: { global: true } });
      node.focus();

      this.node = node;
      this.wrapper = wrapper;
      this.handler = wrapper.props().handler;
    });

    context('and <Shortcuts /> component does NOT contain a <Shortcuts /> as a child', () => {
      context('and a matching key is pressed', () => {
        it('then calls the handler once with the correct arguments', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });

          expect(this.handler).to.have.been.calledOnce;
          expect(this.handler).to.have.been.calledWith('OPEN');
        });
      });

      context('and a key that does NOT match any shortcuts is pressed', () => {
        it('then does NOT call the handler', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.TAB });

          expect(this.handler).to.not.have.been.called;
        });
      });

      context('and the component has been unmounted', () => {
        it('then does NOT call the handler when a matching key is pressed', function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });
          expect(this.handler).to.have.been.calledOnce;

          this.wrapper.unmount();

          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });
          expect(this.handler).to.have.been.calledOnce;
        });
      });
    });

    context('and the <Shortcuts /> contains another (NON-global) <Shortcuts /> as a child, with overlapping shortcuts', () => {
      beforeEach(function () {
        const { wrapper: childWrapper, component: childComponent } = renderComponent({
          mergeWithBaseProps: {
            className: 'test',
          },
        });

        const { wrapper: parentWrapper, node: parentNode } = renderComponent({ mergeWithBaseProps: {
          children: childComponent,
          name: 'PARENT',
          global: true,
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
        beforeEach(function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });
        });

        it('then the parent Shortcuts\' handler is called with the correct arguments', function () {
          expect(this.childWrapper.props().handler).to.have.been.calledWith('OPEN');
          expect(this.parentWrapper.props().handler).to.have.been.calledWith('OPEN');
        });

        it('then calls the parent handler before the child handler', function () {
          expect(this.parentWrapper.props().handler).to.have.been.calledBefore(this.childWrapper.props().handler);
        });
      });
    });

    context('and the <Shortcuts /> contains another global <Shortcuts /> as a child, with overlapping shortcuts', () => {
      beforeEach(function () {
        const { wrapper: childWrapper, component: childComponent } = renderComponent({
          mergeWithBaseProps: {
            className: 'test',
            global: true,
          },
        });

        const { wrapper: parentWrapper, node: parentNode } = renderComponent({ mergeWithBaseProps: {
          children: childComponent,
          name: 'PARENT',
          global: true,
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
        beforeEach(function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });
        });

        it('then the parent Shortcuts\' handler is called with the correct arguments', function () {
          expect(this.childWrapper.props().handler).to.have.been.calledWith('OPEN');
          expect(this.parentWrapper.props().handler).to.have.been.calledWith('OPEN');
        });

        it('then calls the parent handler before the child handler', function () {
          expect(this.parentWrapper.props().handler).to.have.been.calledBefore(this.childWrapper.props().handler);
        });
      });
    });
  });
});
