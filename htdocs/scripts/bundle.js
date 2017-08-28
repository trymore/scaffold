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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_view_ui_anchor__ = __webpack_require__(1);


window.addEventListener('DOMContentLoaded', function() {
  var el, i, len, ref, results;
  ref = document.querySelectorAll('a[href^="#"]');
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    el = ref[i];
    results.push(new __WEBPACK_IMPORTED_MODULE_0_view_ui_anchor__["a" /* default */](el));
  }
  return results;
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var Anchor,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Anchor = (function() {

  /*
  @param el [HTMLElement]
   */
  function Anchor(el) {
    this.el = el;
    this.scroll = bind(this.scroll, this);
    this.targetEl = (function(_this) {
      return function() {
        var elName, href;
        href = _this.el.getAttribute('href');
        elName = href === '#' ? 'body' : href;
        return document.querySelector(elName);
      };
    })(this)();
    if (this.targetEl.length) {
      return;
    }
    this.duration = 500;
    this.timer = null;
    this.el.addEventListener('click', this.scroll.bind(this));
  }


  /*
  @private
   */

  Anchor.prototype.scroll = function(e) {
    this.beforeTop = window.pageYOffset;
    this.changeTop = this.targetEl.getBoundingClientRect().top;
    e.preventDefault();
    this.startTime = new Date().getTime();
    return this.animate();
  };


  /*
  @private
   */

  Anchor.prototype.animate = function() {
    var currentTime, newTime;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    newTime = new Date().getTime();
    currentTime = (function(_this) {
      return function() {
        if (_this.duration > (newTime - _this.startTime)) {
          return newTime - _this.startTime;
        } else {
          return _this.duration;
        }
      };
    })(this)();
    window.scrollTo(0, this.easing(currentTime, this.beforeTop, this.changeTop, this.duration));
    if (this.duration > currentTime) {
      return this.timer = setTimeout(this.animate.bind(this), 15);
    }
  };


  /*
  @private
   */

  Anchor.prototype.easing = function(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  };

  return Anchor;

})();

/* harmony default export */ __webpack_exports__["a"] = (Anchor);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map