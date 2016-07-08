/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Anchor;
	
	Anchor = __webpack_require__(1);
	
	window.addEventListener('DOMContentLoaded', function() {
	  var el, i, len, ref, results;
	  ref = document.querySelectorAll('a[href^="#"]');
	  results = [];
	  for (i = 0, len = ref.length; i < len; i++) {
	    el = ref[i];
	    results.push(new Anchor(el));
	  }
	  return results;
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	var Anchor,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	module.exports = Anchor = (function() {
	
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
	        elName = href === '#' ? 'html, body' : href;
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


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map