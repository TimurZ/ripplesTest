;(function() {
	"use strict";

	var doc = document,
			wnd = window;

	var ripples = {
		init: function() {
			this.ripplesQueue = [];
			this.clicked = false;
			this.clickedFlag = false;

			this.listeners();
		},

		listeners: function() {
			$(doc).on("touchstart mousedown", ".ripple", function() {
				// http://stackoverflow.com/questions/7018919/how-to-bind-touchstart-and-click-events-but-not-respond-to-both
				if (!ripples.clickedFlag) {
					ripples.newRipple.apply(this, arguments);
					ripples.clickedFlag = true;
				}
			});
			$(doc).on("touchend touchcancel mouseup mouseleave", ".ripple", function() {
				ripples.removeRipple.apply(this, arguments);
				setTimeout(function() {ripples.clickedFlag = false;}, 100);
			});
		},

		// thx to https://codepen.io/pixelass/post/material-design-ripple for main idea
		newRipple: function(e) {
			var posBox = this.getBoundingClientRect(),
					ePageX = e.pageX || e.originalEvent.touches[0].pageX,
					ePageY = e.pageY || e.originalEvent.touches[0].pageY,
					posX = ePageX - (posBox.left + wnd.pageXOffset),
					posY = ePageY - (posBox.top + wnd.pageYOffset),
					w = this.offsetWidth,
					h = this.offsetHeight,
					// distance from the center of the element
					offsetX = Math.abs(w / 2 - posX),
					offsetY = Math.abs(h / 2 - posY),
					// ditance to the farthest side
					deltaX = w / 2 + offsetX,
					deltaY = h / 2 + offsetY;

			// ditance to the farthest corner
			var size = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) * 2;
			
			ripples.addRipple({
				top: posY,
				left: posX,
				size: size
			}, this);

			ripples.clicked = true;
		},
		
		addRipple: function(data, rippleBox) {
			var ripple = doc.createElement("span"),
					cssStr = "width:" + data.size + "px;" +
									 "height:" + data.size + "px;" +
									 "top:" + data.top + "px;" +
									 "left:" + data.left + "px;",
					rippleBg = rippleBox.getAttribute("data-ripple-color");

			ripple.style.cssText = cssStr;
			ripple.style.background = rippleBg;

			ripple.className += " ripple-effect";
			rippleBox.appendChild(ripple);
			ripples.ripplesQueue.push(ripple);
		},

		removeRipple: function() {
			var remRipple;
			if (!ripples.clicked) return;

			remRipple = ripples.ripplesQueue.pop();

			if (remRipple) {
				remRipple.className += " ripple-effect-out";
				// a little bit hacky, but easier and there's less listeners
				// same as longest animation/transition
				setTimeout(this.removeChild.bind(this, remRipple), 900);
			}

			ripples.clicked = false;
		}
	};

	ripples.init();
}());