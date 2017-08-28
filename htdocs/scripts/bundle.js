/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _anchor = __webpack_require__(1);

var _anchor2 = _interopRequireDefault(_anchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('DOMContentLoaded', function () {

  Array.from(document.querySelectorAll('a[href^="#"]'), function (el) {
    new _anchor2.default(el);
  });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Anchor = function () {
  function Anchor($el) {
    _classCallCheck(this, Anchor);

    var _$target = this._$target = function () {
      var _href = $el.getAttribute('href');
      var _elName = _href === '#' ? 'body' : _href;
      return document.querySelector(_elName);
    }();

    if (_$target.length) return;

    this._duration = 500;
    this._timer = null;

    $el.addEventListener('click', this._scroll.bind(this));
  }

  _createClass(Anchor, [{
    key: '_scroll',
    value: function _scroll(e) {
      var _$target = this._$target;


      this._beforeTop = window.pageYOffset;
      this._changeTop = _$target.getBoundingClientRect().top;

      e.preventDefault();
      this._startTime = new Date().getTime();
      this._animate();
    }
  }, {
    key: '_animate',
    value: function _animate() {
      var _timer = this._timer,
          _startTime = this._startTime,
          _duration = this._duration,
          _beforeTop = this._beforeTop,
          _changeTop = this._changeTop;


      if (_timer) {
        clearTimeout(_timer);
      }

      var _newTime = new Date().getTime();

      var _currentTime = function () {
        if (_duration > _newTime - _startTime) {
          return _newTime - _startTime;
        } else {
          return _duration;
        }
      }();

      window.scrollTo(0, this._easing(_currentTime, _beforeTop, _changeTop, _duration));

      if (_duration > _currentTime) {
        this._timer = setTimeout(this._animate.bind(this), 15);
      }
    }
  }, {
    key: '_easing',
    value: function _easing(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    }
  }]);

  return Anchor;
}();

exports.default = Anchor;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map