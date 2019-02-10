function get(selector) {
  	return document.querySelector(selector);
}
function show(el) {
  	el.style.visibility = "visible";
}
function hide(el) {
  	el.style.visibility = "hidden";
}
function clear(el) {
  	el.innerHTML = "";
}
function addClass(el, classname) {
  	el.classList.add(classname);
}
function removeClass(el, classname) {
  	el.classList.remove(classname);
}
function onPressEnter(el, cb) {
	el.addEventListener("keyup", (event) => {
		event.preventDefault();
		// ENTER is 13
		if (event.keyCode === 13) {
			if(cb) cb();
		}
	});
}
function onHover(el, cbOver, cbOut) {
	el.addEventListener("mouseenter", (event) => {
		cbOver(event.target);
	});
	el.addEventListener("mouseleave", (event) => {
		cbOut(event.target);
	});
}
function onClick(el, cb) {
	el.addEventListener("click", (event) => {
		cb(event.target);
	});
}
function onAnimationEnd(el, cb) {
  	function whichTransitionEvent() {
		var t, el = document.createElement("fakeelement");
		var transitions = {
			transition: "animationend",
			MSTransition: "MSAnimationEnd",
			OTransition: "oanimationend",
			MozTransition: "mozAnimationEnd",
			WebkitTransition: "webkitAnimationEnd"
		};
		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
  	}
  	var transitionEvent = whichTransitionEvent();
  	function func() {
    	el.removeEventListener(transitionEvent, func);
    	cb();
  	}
  	el.addEventListener(transitionEvent, func);
}

function measureElement(el) {
	return el.getBoundingClientRect();
}

function addNewElement(parent, elName) {
  	var el = document.createElement(elName);
  	parent.appendChild(el);
  	return el;
}
function addNewText(parent, text) {
  	var el = document.createTextNode(text);
  	parent.appendChild(el);
  	return el;
}

export {
	get,
  	show,
  	hide,
  	clear,
  	addClass,
	removeClass,
	onPressEnter,
	onHover,
	onClick,
	onAnimationEnd,
	measureElement,
  	addNewElement,
  	addNewText
};