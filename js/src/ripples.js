{
  const doc = document;

  class Ripples {
    constructor(className) {
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

    delegateClass(className, cb) {
      if (className[0] === ".") className = className.slice(1);

      return e => {
        let target = e.target;

        while (!target.classList.contains(className)) {
          target = target.parentElement;
          // stop function if class wasn't found
          // documentElement.parentElement will return null
          if (!target) return;
        }
        cb(e, target);
      }
    }

    // https://learn.javascript.ru/mousemove-mouseover-mouseout-mouseenter-mouseleave#делегирование
    delegateMouseleave(cb) {
      return e => {
        // don't proceed if there wasn't a click
        if (!this.clickFlag) return;
        let relatedTarget = e.relatedTarget;

        while (relatedTarget) {
          if (relatedTarget === this.rippleBox) return;
          relatedTarget = relatedTarget.parentElement;
        }

        cb.call(this);
      }
    }

    // thx to https://codepen.io/pixelass/post/material-design-ripple for main idea
    newRipple(e, target) {
      const posBox = target.getBoundingClientRect();
      const ePageX = e.pageX || e.touches[0].pageX;
      const ePageY = e.pageY || e.touches[0].pageY;
      const posX = ePageX - (posBox.left + window.pageXOffset);
      const posY = ePageY - (posBox.top + window.pageYOffset);
      const w = target.offsetWidth;
      const h = target.offsetHeight;
      // distance from the center of the element
      const offsetX = Math.abs(w / 2 - posX);
      const offsetY = Math.abs(h / 2 - posY);
      // ditance to the farthest side
      const deltaX = w / 2 + offsetX;
      const deltaY = h / 2 + offsetY;

      // ditance to the farthest corner
      const size = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) * 2;

      this.clickFlag = true;
      this.rippleBox = target;

      this.appendRipple({
        top: posY,
        left: posX,
        size
      });
    }

    appendRipple({ top, left, size }) {
      const ripple = doc.createElement("div");
      const cssString = `
        width: ${size}px;
        height: ${size}px;
        top: ${top}px;
        left: ${left}px;
        margin-top: ${-size/2}px;
        margin-left: ${-size/2}px;
      `;
      const background = this.rippleBox.getAttribute("data-ripple-color");

      ripple.style.cssText = cssString;
      ripple.style.background = background;
      ripple.className += " ripple-effect";

      this.rippleBox.appendChild(ripple);

      this.createdRipple = ripple;
    }

    removeRipple() {
      if (!this.clickFlag) return;
      this.createdRipple.className += " ripple-effect-out";

      // a little bit hacky, but easier and there's less listeners
      // same as $ripple-duration in scss file or longest animation/transition
      setTimeout(this.rippleBox.removeChild.bind(this.rippleBox, this.createdRipple), this.removeRippleTimeout);

      this.clickFlag = false;
    }
  }

  const ripples = new Ripples("ripple");
};
