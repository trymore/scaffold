Anchor = require '../../../requires/view/ui/anchor'

window.addEventListener 'DOMContentLoaded', ->

  for el in document.querySelectorAll('a[href^="#"]')
    new Anchor(el)
