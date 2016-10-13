import Anchor from 'view/ui/anchor'

window.addEventListener 'DOMContentLoaded', ->

  for el in document.querySelectorAll('a[href^="#"]')
    new Anchor(el)
