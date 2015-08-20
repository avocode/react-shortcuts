global.expect = require 'expect'
global.jsdom = require 'jsdom'
global.React = require 'react'
global.ReactTestUtils = require 'react/lib/ReactTestUtils'
global._ = require 'lodash'

before (done) ->
  jsdom.env '', [], (errs, window) ->
    global.window = window
    global.document = window.document
    global.Image = window.Image
    global.navigator = window.navigator

    done()
