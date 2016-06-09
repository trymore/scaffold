$ = window.jQuery = require 'jquery'
Anchor            = require 'pencil/views/ui/anchor'
# Check             = require 'pencil/views/ui/check'
require 'html5shiv'

$ document
  .one 'ready', ->

    # new Check

    $ 'a[href^="#"]'
      .each ({}, el) ->
        new Anchor el
