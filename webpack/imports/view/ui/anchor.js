export default class Anchor {

  constructor($el) {
    const _$target = this._$target = (() => {
      const _href   = $el.getAttribute('href');
      const _elName = _href === '#' ? 'body' : _href;
      return document.querySelector(_elName);
    })();

    if(_$target.length) return;

    this._duration = 500
    this._timer    = null

    $el.addEventListener('click', this._scroll.bind(this))
  }

  _scroll(e) {
    const { _$target } = this;

    this._beforeTop = window.pageYOffset;
    this._changeTop = _$target.getBoundingClientRect().top;

    e.preventDefault();
    this._startTime = new Date().getTime();
    this._animate();
  }

  _animate() {
    const { _timer, _startTime, _duration, _beforeTop, _changeTop } = this;

    if(_timer) {
      clearTimeout(_timer);
    }

    const _newTime = new Date().getTime();

    const _currentTime = (() => {
      if(_duration > (_newTime - _startTime)) {
        return _newTime - _startTime;
      } else {
        return _duration;
      }
    })();

    window.scrollTo(0, this._easing(_currentTime, _beforeTop, _changeTop, _duration));

    if(_duration > _currentTime) {
      this._timer = setTimeout(this._animate.bind(this), 15);
    }
  }

  _easing(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  }

}
