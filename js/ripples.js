"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

{
  var doc = document;

  var Ripples = function () {
    function Ripples(className) {
      _classCallCheck(this, Ripples);

      this.createdRipple = null;
      this.rippleBox = null;
      this.clickFlag = false;
      this.removeRippleTimeout = 400; // same as $ripple-duration in scss file
      this.newRipple = this.newRipple.bind(this);
      this.removeRipple = this.removeRipple.bind(this);

      doc.addEventListener("mousedown", this.delegateClass(className, this.newRipple));
      doc.addEventListener("mouseup", this.removeRipple);
      doc.addEventListener("mouseout", this.delegateMouseleave(this.removeRipple));
    }

    _createClass(Ripples, [{
      key: "delegateClass",
      value: function delegateClass(className, cb) {
        if (className[0] === ".") className = className.slice(1);

        return function (e) {
          var target = e.target;

          while (!target.classList.contains(className)) {
            target = target.parentElement;
            // stop function if class wasn't found
            // documentElement.parentElement will return null
            if (!target) return;
          }
          cb(e, target);
        };
      }

      // https://learn.javascript.ru/mousemove-mouseover-mouseout-mouseenter-mouseleave#делегирование

    }, {
      key: "delegateMouseleave",
      value: function delegateMouseleave(cb) {
        var _this = this;

        return function (e) {
          // don't proceed if there wasn't a click
          if (!_this.clickFlag) return;
          var relatedTarget = e.relatedTarget;

          while (relatedTarget) {
            if (relatedTarget === _this.rippleBox) return;
            relatedTarget = relatedTarget.parentElement;
          }

          cb.call(_this);
        };
      }

      // thx to https://codepen.io/pixelass/post/material-design-ripple for main idea

    }, {
      key: "newRipple",
      value: function newRipple(e, target) {
        var posBox = target.getBoundingClientRect();
        var ePageX = e.pageX || e.touches[0].pageX;
        var ePageY = e.pageY || e.touches[0].pageY;
        var posX = ePageX - (posBox.left + window.pageXOffset);
        var posY = ePageY - (posBox.top + window.pageYOffset);
        var w = target.offsetWidth;
        var h = target.offsetHeight;
        // distance from the center of the element
        var offsetX = Math.abs(w / 2 - posX);
        var offsetY = Math.abs(h / 2 - posY);
        // ditance to the farthest side
        var deltaX = w / 2 + offsetX;
        var deltaY = h / 2 + offsetY;

        // ditance to the farthest corner
        var size = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) * 2;

        this.clickFlag = true;
        this.rippleBox = target;

        this.appendRipple({
          top: posY,
          left: posX,
          size: size
        });
      }
    }, {
      key: "appendRipple",
      value: function appendRipple(_ref) {
        var top = _ref.top,
            left = _ref.left,
            size = _ref.size;

        var ripple = doc.createElement("div");
        var cssString = "\n        width: " + size + "px;\n        height: " + size + "px;\n        top: " + top + "px;\n        left: " + left + "px;\n        margin-top: " + -size / 2 + "px;\n        margin-left: " + -size / 2 + "px;\n      ";
        var background = this.rippleBox.getAttribute("data-ripple-color");

        ripple.style.cssText = cssString;
        ripple.style.background = background;
        ripple.className += " ripple-effect";

        this.rippleBox.appendChild(ripple);

        this.createdRipple = ripple;
      }
    }, {
      key: "removeRipple",
      value: function removeRipple() {
        if (!this.clickFlag) return;
        this.createdRipple.className += " ripple-effect-out";

        // a little bit hacky, but easier and there's less listeners
        // same as $ripple-duration in scss file or longest animation/transition
        setTimeout(this.rippleBox.removeChild.bind(this.rippleBox, this.createdRipple), this.removeRippleTimeout);

        this.clickFlag = false;
      }
    }]);

    return Ripples;
  }();

  var ripples = new Ripples("ripple");
};