import React from 'react';

import { expect } from 'chai';

import renderComponent from './support/renderComponent';

describe('<Shortcuts/> props:', () => {
  describe('when no overriding values are provided', () => {
    beforeEach(function () {
      const { wrapper } = renderComponent({ props: {} });
      this.defaultProps = wrapper.props();
    });

    it('then tabIndex has a value of -1', function () {
      expect(this.defaultProps.tabIndex).to.be.equal(-1);
    });

    it('then className has a value of null', function () {
      expect(this.defaultProps.className).to.be.equal(null);
    });

    it('then isolate has a value of false', function () {
      expect(this.defaultProps.isolate).to.be.equal(false);
    });

    it('then there are no children', function () {
      expect(this.defaultProps.children).to.be.equal(undefined);
    });

    it('then eventType has a value of null', function () {
      expect(this.defaultProps.eventType).to.be.equal(null);
    });

    it('then preventDefault has a value of false', function () {
      expect(this.defaultProps.preventDefault).to.be.equal(false);
    });

    it('has no handler function', function () {
      expect(this.defaultProps.handler).to.be.equal(undefined);
    });
  });

  context('when overriding the default prop values', () => {
    it('then renders positive tabIndex values correctly', () => {
      const { wrapper } = renderComponent({ props: { tabIndex: 42 } });

      expect(wrapper).to.have.attr('tabindex').equal('42');
    });

    it('then renders zero tabIndex values correctly', () => {
      const { wrapper } = renderComponent({ props: { tabIndex: 0 } });

      expect(wrapper).to.have.attr('tabindex').equal('0');
    });

    it('then renders className values correctly', () => {
      const mergeWithBaseProps = { className: 'testing' };
      const { wrapper } = renderComponent({ props: mergeWithBaseProps });

      expect(wrapper).to.have.className(mergeWithBaseProps.className);
    });

    it('then renders children correctly', () => {
      const mergeWithBaseProps = { children: <div /> };
      const { wrapper } = renderComponent({ props: mergeWithBaseProps });

      expect(wrapper).to.contain(mergeWithBaseProps.children);
    });

    it('then correctly sets the isolate value', () => {
      const mergeWithBaseProps = { isolate: true };
      const { wrapper } = renderComponent({ props: mergeWithBaseProps });

      expect(wrapper.props().isolate).to.be.equal(true);
    });

    it('then correctly sets the handler value', () => {
      const mergeWithBaseProps = { handler: () => {} };
      const { wrapper } = renderComponent({ props: mergeWithBaseProps });

      expect(wrapper.props().handler).to.be.equal(mergeWithBaseProps.handler);
    });

    it('then correctly sets the name value', () => {
      const mergeWithBaseProps = { name: 'TESTING' };
      const { wrapper } = renderComponent({ props: mergeWithBaseProps });

      expect(wrapper.props().name).to.be.equal(mergeWithBaseProps.name);
    });

    it('then correctly sets the eventType value', () => {
      const mergeWithBaseProps = { eventType: 'keyUp' };
      const { wrapper } = renderComponent({ props: mergeWithBaseProps });

      expect(wrapper.props().eventType).to.be.equal(mergeWithBaseProps.eventType);
    });

    it('then correctly sets preventDefault to true', () => {
      const mergeWithBaseProps = { preventDefault: true };
      const { wrapper } = renderComponent({ props: mergeWithBaseProps });

      expect(wrapper.props().preventDefault).to.be.equal(true);
    });
  });
});
