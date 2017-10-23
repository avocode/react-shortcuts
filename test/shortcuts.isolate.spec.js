import { expect } from 'chai';
import simulant from 'simulant';

import KeyCodes from './support/KeyCodes';
import renderComponent from './support/renderComponent';

describe('<Shortcuts /> isolate prop:', () => {
  context('when no isolate value has been provided', () => {
    beforeEach(function () {
      const { wrapper, node } = renderComponent({ props: {} });
      node.focus();

      this.node = node;
      this.wrapper = wrapper;
      this.handler = wrapper.props().handler;
    });

    it('then has a value of false', function () {
      expect(this.wrapper.props().isolate).to.be.equal(false);
    });
  });

  context('when isolate is set to true', () => {
    context('and the <Shortcuts /> component is rendered under another <Shortcuts /> as a child', () => {
      beforeEach(function () {
        const { wrapper: childWrapper, component: childComponent } = renderComponent({
          mergeWithBaseProps: {
            className: 'test',
            isolate: true,
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

      context('and a matching key is pressed', () => {
        beforeEach(function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });
        });

        it('then calls the child handler once with the correct arguments', function () {
          expect(this.childWrapper.props().handler).to.have.been.calledOnce;
          expect(this.childWrapper.props().handler).to.have.been.calledWith('OPEN');
        });

        it('then DOES NOT call the parent handler', function () {
          expect(this.parentWrapper.props().handler).to.not.have.been.called;
        });
      });
    });

    context('and the <Shortcuts /> component is rendered under another (global) <Shortcuts /> as a child', () => {
      beforeEach(function () {
        const { wrapper: childWrapper, component: childComponent } = renderComponent({
          mergeWithBaseProps: {
            className: 'test',
            isolate: true,
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

      context('and a matching key is pressed', () => {
        beforeEach(function () {
          simulant.fire(this.node, 'keydown', { keyCode: KeyCodes.ENTER });
        });

        it('then calls the child handler once with the correct arguments', function () {
          expect(this.childWrapper.props().handler).to.have.been.calledOnce;
          expect(this.childWrapper.props().handler).to.have.been.calledWith('OPEN');
        });

        it('then calls the parent handler once with the correct arguments', function () {
          expect(this.parentWrapper.props().handler).to.have.been.calledOnce;
          expect(this.parentWrapper.props().handler).to.have.been.calledWith('OPEN');
        });
      });
    });
  });
});
