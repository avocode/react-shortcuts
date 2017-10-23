/**
 * This file initialises the test environment with tools used for
 * defining the test suite.
 *
 * It is run once before the test suite is executed and should only
 * include setup code that is applicable to the entire suite.
 *
 * For configuration options of mocha itself, see the mocha.opts file.
 */

// React testing framework for traversing React components' output
import Enzyme from 'enzyme';
import Adaptor from 'enzyme-adapter-react-15';

// Assertion library for more expressive syntax
import chai from 'chai';

// chai plugin that allows React-specific assertions for enzyme
import chaiEnzyme from 'chai-enzyme';

// chai plugin that allows assertions on function calls
import sinonChai from 'sinon-chai';

// JS implementation of DOM and HTML spec
import jsdom from 'jsdom';

chai.use(chaiEnzyme());
chai.use(sinonChai);

Enzyme.configure({ adapter: new Adaptor() });

global.document = jsdom.jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.Image = window.Image;
global.navigator = window.navigator;
global.CustomEvent = window.CustomEvent;
