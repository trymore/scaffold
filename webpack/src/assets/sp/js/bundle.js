import Anchor from 'view/ui/anchor';

window.addEventListener('DOMContentLoaded', () => {

  Array.from(document.querySelectorAll('a[href^="#"]'), ($el) => {
    new Anchor($el);
  });

});
