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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./webpack/src/assets/js/bundle.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./webpack/imports/view/ui/anchor.js":
/*!*******************************************!*\
  !*** ./webpack/imports/view/ui/anchor.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Anchor; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Anchor =
/*#__PURE__*/
function () {
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
    key: "_scroll",
    value: function _scroll(e) {
      var _$target = this._$target;
      this._beforeTop = window.pageYOffset;
      this._changeTop = _$target.getBoundingClientRect().top;
      e.preventDefault();
      this._startTime = new Date().getTime();

      this._animate();
    }
  }, {
    key: "_animate",
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
    key: "_easing",
    value: function _easing(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    }
  }]);

  return Anchor;
}();



/***/ }),

/***/ "./webpack/src/assets/js/bundle.js":
/*!*****************************************!*\
  !*** ./webpack/src/assets/js/bundle.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var view_ui_anchor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! view/ui/anchor */ "./webpack/imports/view/ui/anchor.js");

window.addEventListener('DOMContentLoaded', function () {
  Array.from(document.querySelectorAll('a[href^="#"]'), function (el) {
    new view_ui_anchor__WEBPACK_IMPORTED_MODULE_0__["default"](el);
  });
});

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map