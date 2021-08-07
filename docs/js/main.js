/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/lits-template/components/contentarea/contentarea.less":
/*!****************************************************************************!*\
  !*** ./node_modules/lits-template/components/contentarea/contentarea.less ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/footer/footer.less":
/*!******************************************************************!*\
  !*** ./node_modules/lits-template/components/footer/footer.less ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/hamburger/hamburger.less":
/*!************************************************************************!*\
  !*** ./node_modules/lits-template/components/hamburger/hamburger.less ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/landing.less":
/*!************************************************************!*\
  !*** ./node_modules/lits-template/components/landing.less ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/layout/layout.less":
/*!******************************************************************!*\
  !*** ./node_modules/lits-template/components/layout/layout.less ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/main.less":
/*!*********************************************************!*\
  !*** ./node_modules/lits-template/components/main.less ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/navbar/navbar.less":
/*!******************************************************************!*\
  !*** ./node_modules/lits-template/components/navbar/navbar.less ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/pagemenu/pagemenu.less":
/*!**********************************************************************!*\
  !*** ./node_modules/lits-template/components/pagemenu/pagemenu.less ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/syntax/solarized-light.less":
/*!***************************************************************************!*\
  !*** ./node_modules/lits-template/components/syntax/solarized-light.less ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/tocmenu/tocmenu.less":
/*!********************************************************************!*\
  !*** ./node_modules/lits-template/components/tocmenu/tocmenu.less ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/tooltips/tooltips.less":
/*!**********************************************************************!*\
  !*** ./node_modules/lits-template/components/tooltips/tooltips.less ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/lits-template/components/common/accordion.ts":
/*!*******************************************************************!*\
  !*** ./node_modules/lits-template/components/common/accordion.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initAccordions = void 0;
const $ = __webpack_require__(/*! ./myquery */ "./node_modules/lits-template/components/common/myquery.ts");
function initAccordions(element) {
    let accordions = element.getElementsByClassName($.accordion);
    for (let i = 0; i < accordions.length; ++i) {
        let acc = accordions[i];
        let panel = acc.nextElementSibling;
        let initHeight = panel.scrollHeight + "px";
        panel.style.maxHeight = initHeight;
        acc.onclick = () => {
            acc.classList.toggle($.collapsed);
            panel.style.maxHeight = panel.style.maxHeight === "0px" ?
                initHeight : "0px";
        };
    }
}
exports.initAccordions = initAccordions;


/***/ }),

/***/ "./node_modules/lits-template/components/common/myquery.ts":
/*!*****************************************************************!*\
  !*** ./node_modules/lits-template/components/common/myquery.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.attr = exports.create = exports.each = exports.isHTMLCollection = exports.elementsWithStyle = exports.firstElementWithStyle = exports.infobox = exports.closepopups = exports.scrollingarea = exports.navbar = exports.hamburger = exports.accordion = exports.collapsed = exports.expanded = void 0;
exports.expanded = "expanded";
exports.collapsed = "collapsed";
exports.accordion = "accordion";
exports.hamburger = "hamburger";
exports.navbar = "navbar";
exports.scrollingarea = "scrollingarea";
exports.closepopups = "closepopups";
exports.infobox = "info-box";
function firstElementWithStyle(className, parent = document) {
    let res = parent.getElementsByClassName(className)[0];
    if (!res)
        throw ReferenceError(`Cannot find element with class "${className}".`);
    return res;
}
exports.firstElementWithStyle = firstElementWithStyle;
function elementsWithStyle(className, parent = document) {
    return parent.getElementsByClassName(className);
}
exports.elementsWithStyle = elementsWithStyle;
function isHTMLCollection(elem) {
    return elem.length !== undefined;
}
exports.isHTMLCollection = isHTMLCollection;
function each(elem, action) {
    if (isHTMLCollection(elem))
        for (let i = 0; i < elem.length; ++i)
            action(elem[i]);
    else
        action(elem);
}
exports.each = each;
function create(tag, children = null) {
    let elem = document.createElement(tag);
    if (children) {
        if (typeof (children) === "string")
            elem.appendChild(document.createTextNode(children));
        else
            each(children, c => elem.appendChild(c));
    }
    return elem;
}
exports.create = create;
function attr(elem, attrName, attrValue) {
    each(elem, e => e.setAttribute(attrName, attrValue));
    return elem;
}
exports.attr = attr;


/***/ }),

/***/ "./node_modules/lits-template/components/common/popups.ts":
/*!****************************************************************!*\
  !*** ./node_modules/lits-template/components/common/popups.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toggleClassOnClick = exports.popupOnClick = void 0;
const $ = __webpack_require__(/*! ./myquery */ "./node_modules/lits-template/components/common/myquery.ts");
let closepopups = $.firstElementWithStyle($.closepopups);
function popupOnClick(element, toggle, hide) {
    element.addEventListener("click", toggle);
    closepopups.addEventListener("mouseup", hide);
    document.addEventListener("keydown", e => {
        if (e.key === "Escape")
            hide();
    });
}
exports.popupOnClick = popupOnClick;
function toggleClassOnClick(element, cls, target = element) {
    popupOnClick(element, () => $.each(target, e => e.classList.toggle(cls)), () => $.each(target, e => e.classList.remove(cls)));
}
exports.toggleClassOnClick = toggleClassOnClick;


/***/ }),

/***/ "./node_modules/lits-template/components/contentarea/contentarea.ts":
/*!**************************************************************************!*\
  !*** ./node_modules/lits-template/components/contentarea/contentarea.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./contentarea.less */ "./node_modules/lits-template/components/contentarea/contentarea.less");
__webpack_require__(/*! syntaxhighlight */ "./node_modules/lits-template/components/syntax/solarized-light.less");


/***/ }),

/***/ "./node_modules/lits-template/components/footer/footer.ts":
/*!****************************************************************!*\
  !*** ./node_modules/lits-template/components/footer/footer.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./footer.less */ "./node_modules/lits-template/components/footer/footer.less");


/***/ }),

/***/ "./node_modules/lits-template/components/hamburger/hamburger.ts":
/*!**********************************************************************!*\
  !*** ./node_modules/lits-template/components/hamburger/hamburger.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./hamburger.less */ "./node_modules/lits-template/components/hamburger/hamburger.less");
const $ = __webpack_require__(/*! ../../components/common/myquery */ "./node_modules/lits-template/components/common/myquery.ts");
const popups_1 = __webpack_require__(/*! ../../components/common/popups */ "./node_modules/lits-template/components/common/popups.ts");
$.each($.elementsWithStyle("hamburger"), hamb => popups_1.toggleClassOnClick(hamb, "open"));


/***/ }),

/***/ "./node_modules/lits-template/components/landing.ts":
/*!**********************************************************!*\
  !*** ./node_modules/lits-template/components/landing.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./landing.less */ "./node_modules/lits-template/components/landing.less");
const $ = __webpack_require__(/*! ./common/myquery */ "./node_modules/lits-template/components/common/myquery.ts");
revealInfoBoxes();
createInfoMenu();
function revealInfoBoxes() {
    let arrows = $.elementsWithStyle("scroll-indicator");
    if (!arrows || arrows.length != 2)
        return;
    let arrowUp = arrows[0];
    let arrowDown = arrows[1];
    window.addEventListener("scroll", setBoxOpacities);
    window.addEventListener("resize", setBoxOpacities);
    setBoxOpacities();
    function setBoxOpacities() {
        arrowUp.style.opacity = "0";
        arrowDown.style.opacity = "0";
        for (let ib of $.elementsWithStyle('info-box')) {
            let hib = ib;
            let scrtop = window.pageYOffset;
            let scrbot = window.pageYOffset + window.innerHeight;
            let marginFactor = 6;
            let top = hib.offsetTop;
            let bot = top + hib.offsetHeight;
            let margin = window.innerHeight / marginFactor;
            if (scrtop == 0) {
                hib.style.opacity = "0";
                arrowDown.style.opacity = "1";
            }
            else if (top < scrbot - margin && bot > scrtop + margin)
                hib.style.opacity = "1";
            else {
                hib.style.opacity = "0";
                if (bot > scrtop && bot < scrtop + margin)
                    arrowUp.style.opacity = "1";
                if (top < scrbot && top > scrtop - margin)
                    arrowDown.style.opacity = "1";
            }
        }
    }
}
function createInfoMenu() {
    let infoArea = $.elementsWithStyle("info-area")[0];
    if (!infoArea)
        return;
    let headingOffsets = [];
    let headings = infoArea.querySelectorAll("h2");
    let menu = $.firstElementWithStyle("info-menu");
    let ul = document.createElement('ul');
    menu.appendChild(ul);
    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        let link = $.attr($.create("a", heading.textContent), "href", "#" + heading.id);
        let li = $.create("li", link);
        ul.appendChild(li);
        headingOffsets[i] = { heading, li };
    }
    window.addEventListener("scroll", () => {
        let pos = window.pageYOffset;
        let found = false;
        let prev = null;
        for (let i = 0; i < headingOffsets.length; i++) {
            let ho = headingOffsets[i];
            ho.li.classList.remove("highlight");
            if (!found && ho.heading.offsetTop > (pos + ho.heading.offsetHeight)) {
                (prev || ho).li.classList.add("highlight");
                found = true;
            }
            prev = ho;
        }
        if (!found && prev)
            prev.li.classList.add("highlight");
    });
}


/***/ }),

/***/ "./node_modules/lits-template/components/layout/layout.ts":
/*!****************************************************************!*\
  !*** ./node_modules/lits-template/components/layout/layout.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./layout.less */ "./node_modules/lits-template/components/layout/layout.less");
const $ = __webpack_require__(/*! ../../components/common/myquery */ "./node_modules/lits-template/components/common/myquery.ts");
const popups_1 = __webpack_require__(/*! ../../components/common/popups */ "./node_modules/lits-template/components/common/popups.ts");
// Hook hamburger icon to closing side pane.
let layout = $.elementsWithStyle("layout")[0];
if (layout) {
    let hamb = $.firstElementWithStyle("hamburger", layout);
    popups_1.toggleClassOnClick(hamb, "expanded", layout.getElementsByClassName("collapsible"));
    // Set the top offset of sticky pane.
    let stickypane = $.firstElementWithStyle("stickypane");
    let stickyStyle = getComputedStyle(stickypane);
    let initialStickyTop = parseInt(stickyStyle.top, 10);
    setStickyTop();
    window.addEventListener("resize", setStickyTop);
    function setStickyTop() {
        let offs = Math.min((window.innerHeight - stickypane.offsetHeight) / 2, initialStickyTop);
        stickypane.style.top = `${offs}px`;
    }
}


/***/ }),

/***/ "./node_modules/lits-template/components/navbar/navbar.ts":
/*!****************************************************************!*\
  !*** ./node_modules/lits-template/components/navbar/navbar.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./navbar.less */ "./node_modules/lits-template/components/navbar/navbar.less");
const $ = __webpack_require__(/*! ../common/myquery */ "./node_modules/lits-template/components/common/myquery.ts");
const popups_1 = __webpack_require__(/*! ../../components/common/popups */ "./node_modules/lits-template/components/common/popups.ts");
// Set up responsive menu.
let navbar = $.firstElementWithStyle($.navbar);
let hamb = $.firstElementWithStyle($.hamburger, navbar);
let hidden = false;
popups_1.toggleClassOnClick(hamb, $.expanded, navbar);
// Hide navbar when scrolling down.
let dockedTop = navbar.offsetTop === 0;
let prevScroll = window.pageYOffset;
window.addEventListener("scroll", () => {
    var currScroll = window.pageYOffset;
    setNavbarOffset(dockedTop, prevScroll > currScroll ? 0 : -(navbar.offsetHeight - (dockedTop ? 1 : 2)));
    prevScroll = currScroll;
});
navbar.addEventListener("mouseenter", () => {
    if (hidden)
        setNavbarOffset(dockedTop, 0);
});
function setNavbarOffset(dockedTop, offs) {
    hidden = offs !== 0;
    if (!navbar.classList.contains($.expanded)) {
        if (dockedTop)
            navbar.style.top = `${offs}px`;
        else
            navbar.style.bottom = `${offs}px`;
    }
}


/***/ }),

/***/ "./node_modules/lits-template/components/pagemenu/pagemenu.ts":
/*!********************************************************************!*\
  !*** ./node_modules/lits-template/components/pagemenu/pagemenu.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./pagemenu.less */ "./node_modules/lits-template/components/pagemenu/pagemenu.less");
const $ = __webpack_require__(/*! ../../components/common/myquery */ "./node_modules/lits-template/components/common/myquery.ts");
let pagemenu = $.elementsWithStyle("pagemenu")[0];
if (pagemenu) {
    let headingOffsets = [];
    let contentarea = $.firstElementWithStyle("contentarea");
    let pagetree = $.firstElementWithStyle("pagetree", pagemenu);
    let headings = contentarea.querySelectorAll("h1, h2, h3, h4, h5");
    buildTree(pagetree, null, 1, headings, 0);
    window.addEventListener("scroll", () => {
        let pos = window.pageYOffset;
        let found = false;
        let prev = null;
        for (let i = 0; i < headingOffsets.length; i++) {
            let ho = headingOffsets[i];
            ho.link.classList.remove("highlight");
            if (!found && ho.heading.offsetTop > (pos + ho.heading.offsetHeight)) {
                (prev || ho).link.classList.add("highlight");
                found = true;
            }
            prev = ho;
        }
        if (!found && prev)
            prev.link.classList.add("highlight");
    });
    function buildTree(parentList, prevItem, level, headings, index) {
        while (index < headings.length) {
            let heading = headings[index];
            let currLevel = parseInt(heading.tagName.substr(1, 1));
            if (currLevel < level)
                return index;
            if (currLevel > level) {
                if (prevItem) {
                    let subList = document.createElement("ul");
                    prevItem.appendChild(subList);
                    index = buildTree(subList, null, currLevel, headings, index);
                }
                else
                    index = buildTree(parentList, null, currLevel, headings, index);
            }
            else {
                let link = $.attr($.create("a", heading.textContent), "href", "#" + heading.id);
                let listItem = $.create("li", link);
                parentList.appendChild(listItem);
                headingOffsets[index] = { heading, link };
                index = buildTree(parentList, listItem, level, headings, index + 1);
            }
        }
        return index;
    }
}


/***/ }),

/***/ "./node_modules/lits-template/components/tocmenu/tocmenu.ts":
/*!******************************************************************!*\
  !*** ./node_modules/lits-template/components/tocmenu/tocmenu.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./tocmenu.less */ "./node_modules/lits-template/components/tocmenu/tocmenu.less");
const $ = __webpack_require__(/*! ../../components/common/myquery */ "./node_modules/lits-template/components/common/myquery.ts");
const accordion_1 = __webpack_require__(/*! ../../components/common/accordion */ "./node_modules/lits-template/components/common/accordion.ts");
let tocmenu = $.elementsWithStyle("tocmenu")[0];
if (tocmenu) {
    if (!document.fonts || document.fonts.status == "loaded")
        accordion_1.initAccordions(tocmenu);
    else
        document.fonts.onloadingdone = () => accordion_1.initAccordions(tocmenu);
}


/***/ }),

/***/ "./node_modules/lits-template/components/tooltips/tooltips.ts":
/*!********************************************************************!*\
  !*** ./node_modules/lits-template/components/tooltips/tooltips.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tooltip = void 0;
const $ = __webpack_require__(/*! ../../components/common/myquery */ "./node_modules/lits-template/components/common/myquery.ts");
__webpack_require__(/*! ./tooltips.less */ "./node_modules/lits-template/components/tooltips/tooltips.less");
// let body = document.getElementsByTagName('body')[0]
document.querySelectorAll('[data-toggle="tooltip"]').forEach(elem => tooltip(elem, elem.getAttribute("data-title")));
const id = "tooltip";
function tooltip(elem, text) {
    elem.addEventListener('mouseenter', () => showTooltip(elem, text));
    elem.addEventListener('mouseleave', hideTooltip);
}
exports.tooltip = tooltip;
function showTooltip(elem, contents) {
    hideTooltip();
    if (!contents)
        return;
    let tt = $.create('legend');
    document.body.appendChild(tt);
    tt.id = id;
    tt.innerHTML = contents;
    let bb = elem.getBoundingClientRect();
    tt.style.left = `${Math.round(bb.left) + window.scrollX}px`;
    tt.style.top = `${Math.round(bb.top) + window.scrollY}px`;
    tt.style.opacity = "95%";
}
function hideTooltip() {
    let tt = document.getElementById(id);
    if (tt)
        tt.remove();
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*******************************************************!*\
  !*** ./node_modules/lits-template/components/main.ts ***!
  \*******************************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./main.less */ "./node_modules/lits-template/components/main.less");
__webpack_require__(/*! ./hamburger/hamburger */ "./node_modules/lits-template/components/hamburger/hamburger.ts");
__webpack_require__(/*! ./navbar/navbar */ "./node_modules/lits-template/components/navbar/navbar.ts");
__webpack_require__(/*! ./layout/layout */ "./node_modules/lits-template/components/layout/layout.ts");
__webpack_require__(/*! ./tocmenu/tocmenu */ "./node_modules/lits-template/components/tocmenu/tocmenu.ts");
__webpack_require__(/*! ./contentarea/contentarea */ "./node_modules/lits-template/components/contentarea/contentarea.ts");
__webpack_require__(/*! ./pagemenu/pagemenu */ "./node_modules/lits-template/components/pagemenu/pagemenu.ts");
__webpack_require__(/*! ./footer/footer */ "./node_modules/lits-template/components/footer/footer.ts");
__webpack_require__(/*! ./tooltips/tooltips */ "./node_modules/lits-template/components/tooltips/tooltips.ts");
__webpack_require__(/*! ./landing */ "./node_modules/lits-template/components/landing.ts");

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TyxDQUFDLHFHQUEyQjtBQUNuQyxtQkFBTyxDQUFDLHlGQUFxQjtBQUM3QixtQkFBTyxDQUFDLGlGQUFpQjtBQUN6QixtQkFBTyxDQUFDLHlGQUFxQjtBQUM3QixtQkFBTyxDQUFDLHFFQUFXIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9jb250ZW50YXJlYS9jb250ZW50YXJlYS5sZXNzPzA3ZjciLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLmxlc3M/YWMzNCIsIndlYnBhY2s6Ly9wYXJ6ZWMvLi9ub2RlX21vZHVsZXMvbGl0cy10ZW1wbGF0ZS9jb21wb25lbnRzL2hhbWJ1cmdlci9oYW1idXJnZXIubGVzcz9jOWNiIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvbGFuZGluZy5sZXNzPzFjYjEiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0Lmxlc3M/NmI5MSIsIndlYnBhY2s6Ly9wYXJ6ZWMvLi9ub2RlX21vZHVsZXMvbGl0cy10ZW1wbGF0ZS9jb21wb25lbnRzL21haW4ubGVzcz9iYWVjIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5sZXNzPzMzNjYiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9wYWdlbWVudS9wYWdlbWVudS5sZXNzPzYyNGQiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9zeW50YXgvc29sYXJpemVkLWxpZ2h0Lmxlc3M/ZDNlMSIsIndlYnBhY2s6Ly9wYXJ6ZWMvLi9ub2RlX21vZHVsZXMvbGl0cy10ZW1wbGF0ZS9jb21wb25lbnRzL3RvY21lbnUvdG9jbWVudS5sZXNzP2JhM2IiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy90b29sdGlwcy90b29sdGlwcy5sZXNzPzBmYWMiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9jb21tb24vYWNjb3JkaW9uLnRzIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvY29tbW9uL215cXVlcnkudHMiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9jb21tb24vcG9wdXBzLnRzIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvY29udGVudGFyZWEvY29udGVudGFyZWEudHMiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9mb290ZXIvZm9vdGVyLnRzIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvaGFtYnVyZ2VyL2hhbWJ1cmdlci50cyIsIndlYnBhY2s6Ly9wYXJ6ZWMvLi9ub2RlX21vZHVsZXMvbGl0cy10ZW1wbGF0ZS9jb21wb25lbnRzL2xhbmRpbmcudHMiLCJ3ZWJwYWNrOi8vcGFyemVjLy4vbm9kZV9tb2R1bGVzL2xpdHMtdGVtcGxhdGUvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LnRzIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci50cyIsIndlYnBhY2s6Ly9wYXJ6ZWMvLi9ub2RlX21vZHVsZXMvbGl0cy10ZW1wbGF0ZS9jb21wb25lbnRzL3BhZ2VtZW51L3BhZ2VtZW51LnRzIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvdG9jbWVudS90b2NtZW51LnRzIiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvdG9vbHRpcHMvdG9vbHRpcHMudHMiLCJ3ZWJwYWNrOi8vcGFyemVjL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BhcnplYy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhcnplYy8uL25vZGVfbW9kdWxlcy9saXRzLXRlbXBsYXRlL2NvbXBvbmVudHMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmluaXRBY2NvcmRpb25zID0gdm9pZCAwO1xyXG5jb25zdCAkID0gcmVxdWlyZShcIi4vbXlxdWVyeVwiKTtcclxuZnVuY3Rpb24gaW5pdEFjY29yZGlvbnMoZWxlbWVudCkge1xyXG4gICAgbGV0IGFjY29yZGlvbnMgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJC5hY2NvcmRpb24pO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY2NvcmRpb25zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgbGV0IGFjYyA9IGFjY29yZGlvbnNbaV07XHJcbiAgICAgICAgbGV0IHBhbmVsID0gYWNjLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBsZXQgaW5pdEhlaWdodCA9IHBhbmVsLnNjcm9sbEhlaWdodCArIFwicHhcIjtcclxuICAgICAgICBwYW5lbC5zdHlsZS5tYXhIZWlnaHQgPSBpbml0SGVpZ2h0O1xyXG4gICAgICAgIGFjYy5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBhY2MuY2xhc3NMaXN0LnRvZ2dsZSgkLmNvbGxhcHNlZCk7XHJcbiAgICAgICAgICAgIHBhbmVsLnN0eWxlLm1heEhlaWdodCA9IHBhbmVsLnN0eWxlLm1heEhlaWdodCA9PT0gXCIwcHhcIiA/XHJcbiAgICAgICAgICAgICAgICBpbml0SGVpZ2h0IDogXCIwcHhcIjtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaW5pdEFjY29yZGlvbnMgPSBpbml0QWNjb3JkaW9ucztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5hdHRyID0gZXhwb3J0cy5jcmVhdGUgPSBleHBvcnRzLmVhY2ggPSBleHBvcnRzLmlzSFRNTENvbGxlY3Rpb24gPSBleHBvcnRzLmVsZW1lbnRzV2l0aFN0eWxlID0gZXhwb3J0cy5maXJzdEVsZW1lbnRXaXRoU3R5bGUgPSBleHBvcnRzLmluZm9ib3ggPSBleHBvcnRzLmNsb3NlcG9wdXBzID0gZXhwb3J0cy5zY3JvbGxpbmdhcmVhID0gZXhwb3J0cy5uYXZiYXIgPSBleHBvcnRzLmhhbWJ1cmdlciA9IGV4cG9ydHMuYWNjb3JkaW9uID0gZXhwb3J0cy5jb2xsYXBzZWQgPSBleHBvcnRzLmV4cGFuZGVkID0gdm9pZCAwO1xyXG5leHBvcnRzLmV4cGFuZGVkID0gXCJleHBhbmRlZFwiO1xyXG5leHBvcnRzLmNvbGxhcHNlZCA9IFwiY29sbGFwc2VkXCI7XHJcbmV4cG9ydHMuYWNjb3JkaW9uID0gXCJhY2NvcmRpb25cIjtcclxuZXhwb3J0cy5oYW1idXJnZXIgPSBcImhhbWJ1cmdlclwiO1xyXG5leHBvcnRzLm5hdmJhciA9IFwibmF2YmFyXCI7XHJcbmV4cG9ydHMuc2Nyb2xsaW5nYXJlYSA9IFwic2Nyb2xsaW5nYXJlYVwiO1xyXG5leHBvcnRzLmNsb3NlcG9wdXBzID0gXCJjbG9zZXBvcHVwc1wiO1xyXG5leHBvcnRzLmluZm9ib3ggPSBcImluZm8tYm94XCI7XHJcbmZ1bmN0aW9uIGZpcnN0RWxlbWVudFdpdGhTdHlsZShjbGFzc05hbWUsIHBhcmVudCA9IGRvY3VtZW50KSB7XHJcbiAgICBsZXQgcmVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVswXTtcclxuICAgIGlmICghcmVzKVxyXG4gICAgICAgIHRocm93IFJlZmVyZW5jZUVycm9yKGBDYW5ub3QgZmluZCBlbGVtZW50IHdpdGggY2xhc3MgXCIke2NsYXNzTmFtZX1cIi5gKTtcclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuZXhwb3J0cy5maXJzdEVsZW1lbnRXaXRoU3R5bGUgPSBmaXJzdEVsZW1lbnRXaXRoU3R5bGU7XHJcbmZ1bmN0aW9uIGVsZW1lbnRzV2l0aFN0eWxlKGNsYXNzTmFtZSwgcGFyZW50ID0gZG9jdW1lbnQpIHtcclxuICAgIHJldHVybiBwYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpO1xyXG59XHJcbmV4cG9ydHMuZWxlbWVudHNXaXRoU3R5bGUgPSBlbGVtZW50c1dpdGhTdHlsZTtcclxuZnVuY3Rpb24gaXNIVE1MQ29sbGVjdGlvbihlbGVtKSB7XHJcbiAgICByZXR1cm4gZWxlbS5sZW5ndGggIT09IHVuZGVmaW5lZDtcclxufVxyXG5leHBvcnRzLmlzSFRNTENvbGxlY3Rpb24gPSBpc0hUTUxDb2xsZWN0aW9uO1xyXG5mdW5jdGlvbiBlYWNoKGVsZW0sIGFjdGlvbikge1xyXG4gICAgaWYgKGlzSFRNTENvbGxlY3Rpb24oZWxlbSkpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbGVtLmxlbmd0aDsgKytpKVxyXG4gICAgICAgICAgICBhY3Rpb24oZWxlbVtpXSk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgYWN0aW9uKGVsZW0pO1xyXG59XHJcbmV4cG9ydHMuZWFjaCA9IGVhY2g7XHJcbmZ1bmN0aW9uIGNyZWF0ZSh0YWcsIGNoaWxkcmVuID0gbnVsbCkge1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XHJcbiAgICBpZiAoY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAodHlwZW9mIChjaGlsZHJlbikgPT09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgICAgIGVsZW0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hpbGRyZW4pKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGVhY2goY2hpbGRyZW4sIGMgPT4gZWxlbS5hcHBlbmRDaGlsZChjKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZWxlbTtcclxufVxyXG5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZTtcclxuZnVuY3Rpb24gYXR0cihlbGVtLCBhdHRyTmFtZSwgYXR0clZhbHVlKSB7XHJcbiAgICBlYWNoKGVsZW0sIGUgPT4gZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSkpO1xyXG4gICAgcmV0dXJuIGVsZW07XHJcbn1cclxuZXhwb3J0cy5hdHRyID0gYXR0cjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy50b2dnbGVDbGFzc09uQ2xpY2sgPSBleHBvcnRzLnBvcHVwT25DbGljayA9IHZvaWQgMDtcclxuY29uc3QgJCA9IHJlcXVpcmUoXCIuL215cXVlcnlcIik7XHJcbmxldCBjbG9zZXBvcHVwcyA9ICQuZmlyc3RFbGVtZW50V2l0aFN0eWxlKCQuY2xvc2Vwb3B1cHMpO1xyXG5mdW5jdGlvbiBwb3B1cE9uQ2xpY2soZWxlbWVudCwgdG9nZ2xlLCBoaWRlKSB7XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b2dnbGUpO1xyXG4gICAgY2xvc2Vwb3B1cHMuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgaGlkZSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICAgICAgICBpZiAoZS5rZXkgPT09IFwiRXNjYXBlXCIpXHJcbiAgICAgICAgICAgIGhpZGUoKTtcclxuICAgIH0pO1xyXG59XHJcbmV4cG9ydHMucG9wdXBPbkNsaWNrID0gcG9wdXBPbkNsaWNrO1xyXG5mdW5jdGlvbiB0b2dnbGVDbGFzc09uQ2xpY2soZWxlbWVudCwgY2xzLCB0YXJnZXQgPSBlbGVtZW50KSB7XHJcbiAgICBwb3B1cE9uQ2xpY2soZWxlbWVudCwgKCkgPT4gJC5lYWNoKHRhcmdldCwgZSA9PiBlLmNsYXNzTGlzdC50b2dnbGUoY2xzKSksICgpID0+ICQuZWFjaCh0YXJnZXQsIGUgPT4gZS5jbGFzc0xpc3QucmVtb3ZlKGNscykpKTtcclxufVxyXG5leHBvcnRzLnRvZ2dsZUNsYXNzT25DbGljayA9IHRvZ2dsZUNsYXNzT25DbGljaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4vY29udGVudGFyZWEubGVzc1wiKTtcclxucmVxdWlyZShcInN5bnRheGhpZ2hsaWdodFwiKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4vZm9vdGVyLmxlc3NcIik7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnJlcXVpcmUoXCIuL2hhbWJ1cmdlci5sZXNzXCIpO1xyXG5jb25zdCAkID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvY29tbW9uL215cXVlcnlcIik7XHJcbmNvbnN0IHBvcHVwc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvY29tbW9uL3BvcHVwc1wiKTtcclxuJC5lYWNoKCQuZWxlbWVudHNXaXRoU3R5bGUoXCJoYW1idXJnZXJcIiksIGhhbWIgPT4gcG9wdXBzXzEudG9nZ2xlQ2xhc3NPbkNsaWNrKGhhbWIsIFwib3BlblwiKSk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnJlcXVpcmUoXCIuL2xhbmRpbmcubGVzc1wiKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoXCIuL2NvbW1vbi9teXF1ZXJ5XCIpO1xyXG5yZXZlYWxJbmZvQm94ZXMoKTtcclxuY3JlYXRlSW5mb01lbnUoKTtcclxuZnVuY3Rpb24gcmV2ZWFsSW5mb0JveGVzKCkge1xyXG4gICAgbGV0IGFycm93cyA9ICQuZWxlbWVudHNXaXRoU3R5bGUoXCJzY3JvbGwtaW5kaWNhdG9yXCIpO1xyXG4gICAgaWYgKCFhcnJvd3MgfHwgYXJyb3dzLmxlbmd0aCAhPSAyKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGxldCBhcnJvd1VwID0gYXJyb3dzWzBdO1xyXG4gICAgbGV0IGFycm93RG93biA9IGFycm93c1sxXTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHNldEJveE9wYWNpdGllcyk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBzZXRCb3hPcGFjaXRpZXMpO1xyXG4gICAgc2V0Qm94T3BhY2l0aWVzKCk7XHJcbiAgICBmdW5jdGlvbiBzZXRCb3hPcGFjaXRpZXMoKSB7XHJcbiAgICAgICAgYXJyb3dVcC5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XHJcbiAgICAgICAgYXJyb3dEb3duLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcclxuICAgICAgICBmb3IgKGxldCBpYiBvZiAkLmVsZW1lbnRzV2l0aFN0eWxlKCdpbmZvLWJveCcpKSB7XHJcbiAgICAgICAgICAgIGxldCBoaWIgPSBpYjtcclxuICAgICAgICAgICAgbGV0IHNjcnRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICAgICAgICAgICAgbGV0IHNjcmJvdCA9IHdpbmRvdy5wYWdlWU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICAgICAgbGV0IG1hcmdpbkZhY3RvciA9IDY7XHJcbiAgICAgICAgICAgIGxldCB0b3AgPSBoaWIub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgICBsZXQgYm90ID0gdG9wICsgaGliLm9mZnNldEhlaWdodDtcclxuICAgICAgICAgICAgbGV0IG1hcmdpbiA9IHdpbmRvdy5pbm5lckhlaWdodCAvIG1hcmdpbkZhY3RvcjtcclxuICAgICAgICAgICAgaWYgKHNjcnRvcCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBoaWIuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgYXJyb3dEb3duLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0b3AgPCBzY3Jib3QgLSBtYXJnaW4gJiYgYm90ID4gc2NydG9wICsgbWFyZ2luKVxyXG4gICAgICAgICAgICAgICAgaGliLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBoaWIuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvdCA+IHNjcnRvcCAmJiBib3QgPCBzY3J0b3AgKyBtYXJnaW4pXHJcbiAgICAgICAgICAgICAgICAgICAgYXJyb3dVcC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9wIDwgc2NyYm90ICYmIHRvcCA+IHNjcnRvcCAtIG1hcmdpbilcclxuICAgICAgICAgICAgICAgICAgICBhcnJvd0Rvd24uc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZUluZm9NZW51KCkge1xyXG4gICAgbGV0IGluZm9BcmVhID0gJC5lbGVtZW50c1dpdGhTdHlsZShcImluZm8tYXJlYVwiKVswXTtcclxuICAgIGlmICghaW5mb0FyZWEpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgbGV0IGhlYWRpbmdPZmZzZXRzID0gW107XHJcbiAgICBsZXQgaGVhZGluZ3MgPSBpbmZvQXJlYS5xdWVyeVNlbGVjdG9yQWxsKFwiaDJcIik7XHJcbiAgICBsZXQgbWVudSA9ICQuZmlyc3RFbGVtZW50V2l0aFN0eWxlKFwiaW5mby1tZW51XCIpO1xyXG4gICAgbGV0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcclxuICAgIG1lbnUuYXBwZW5kQ2hpbGQodWwpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZWFkaW5ncy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGhlYWRpbmcgPSBoZWFkaW5nc1tpXTtcclxuICAgICAgICBsZXQgbGluayA9ICQuYXR0cigkLmNyZWF0ZShcImFcIiwgaGVhZGluZy50ZXh0Q29udGVudCksIFwiaHJlZlwiLCBcIiNcIiArIGhlYWRpbmcuaWQpO1xyXG4gICAgICAgIGxldCBsaSA9ICQuY3JlYXRlKFwibGlcIiwgbGluayk7XHJcbiAgICAgICAgdWwuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgIGhlYWRpbmdPZmZzZXRzW2ldID0geyBoZWFkaW5nLCBsaSB9O1xyXG4gICAgfVxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG4gICAgICAgIGxldCBwb3MgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IHByZXYgPSBudWxsO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVhZGluZ09mZnNldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGhvID0gaGVhZGluZ09mZnNldHNbaV07XHJcbiAgICAgICAgICAgIGhvLmxpLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRcIik7XHJcbiAgICAgICAgICAgIGlmICghZm91bmQgJiYgaG8uaGVhZGluZy5vZmZzZXRUb3AgPiAocG9zICsgaG8uaGVhZGluZy5vZmZzZXRIZWlnaHQpKSB7XHJcbiAgICAgICAgICAgICAgICAocHJldiB8fCBobykubGkuY2xhc3NMaXN0LmFkZChcImhpZ2hsaWdodFwiKTtcclxuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmV2ID0gaG87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZm91bmQgJiYgcHJldilcclxuICAgICAgICAgICAgcHJldi5saS5jbGFzc0xpc3QuYWRkKFwiaGlnaGxpZ2h0XCIpO1xyXG4gICAgfSk7XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4vbGF5b3V0Lmxlc3NcIik7XHJcbmNvbnN0ICQgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9jb21tb24vbXlxdWVyeVwiKTtcclxuY29uc3QgcG9wdXBzXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9jb21tb24vcG9wdXBzXCIpO1xyXG4vLyBIb29rIGhhbWJ1cmdlciBpY29uIHRvIGNsb3Npbmcgc2lkZSBwYW5lLlxyXG5sZXQgbGF5b3V0ID0gJC5lbGVtZW50c1dpdGhTdHlsZShcImxheW91dFwiKVswXTtcclxuaWYgKGxheW91dCkge1xyXG4gICAgbGV0IGhhbWIgPSAkLmZpcnN0RWxlbWVudFdpdGhTdHlsZShcImhhbWJ1cmdlclwiLCBsYXlvdXQpO1xyXG4gICAgcG9wdXBzXzEudG9nZ2xlQ2xhc3NPbkNsaWNrKGhhbWIsIFwiZXhwYW5kZWRcIiwgbGF5b3V0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjb2xsYXBzaWJsZVwiKSk7XHJcbiAgICAvLyBTZXQgdGhlIHRvcCBvZmZzZXQgb2Ygc3RpY2t5IHBhbmUuXHJcbiAgICBsZXQgc3RpY2t5cGFuZSA9ICQuZmlyc3RFbGVtZW50V2l0aFN0eWxlKFwic3RpY2t5cGFuZVwiKTtcclxuICAgIGxldCBzdGlja3lTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoc3RpY2t5cGFuZSk7XHJcbiAgICBsZXQgaW5pdGlhbFN0aWNreVRvcCA9IHBhcnNlSW50KHN0aWNreVN0eWxlLnRvcCwgMTApO1xyXG4gICAgc2V0U3RpY2t5VG9wKCk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBzZXRTdGlja3lUb3ApO1xyXG4gICAgZnVuY3Rpb24gc2V0U3RpY2t5VG9wKCkge1xyXG4gICAgICAgIGxldCBvZmZzID0gTWF0aC5taW4oKHdpbmRvdy5pbm5lckhlaWdodCAtIHN0aWNreXBhbmUub2Zmc2V0SGVpZ2h0KSAvIDIsIGluaXRpYWxTdGlja3lUb3ApO1xyXG4gICAgICAgIHN0aWNreXBhbmUuc3R5bGUudG9wID0gYCR7b2Zmc31weGA7XHJcbiAgICB9XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxucmVxdWlyZShcIi4vbmF2YmFyLmxlc3NcIik7XHJcbmNvbnN0ICQgPSByZXF1aXJlKFwiLi4vY29tbW9uL215cXVlcnlcIik7XHJcbmNvbnN0IHBvcHVwc18xID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvY29tbW9uL3BvcHVwc1wiKTtcclxuLy8gU2V0IHVwIHJlc3BvbnNpdmUgbWVudS5cclxubGV0IG5hdmJhciA9ICQuZmlyc3RFbGVtZW50V2l0aFN0eWxlKCQubmF2YmFyKTtcclxubGV0IGhhbWIgPSAkLmZpcnN0RWxlbWVudFdpdGhTdHlsZSgkLmhhbWJ1cmdlciwgbmF2YmFyKTtcclxubGV0IGhpZGRlbiA9IGZhbHNlO1xyXG5wb3B1cHNfMS50b2dnbGVDbGFzc09uQ2xpY2soaGFtYiwgJC5leHBhbmRlZCwgbmF2YmFyKTtcclxuLy8gSGlkZSBuYXZiYXIgd2hlbiBzY3JvbGxpbmcgZG93bi5cclxubGV0IGRvY2tlZFRvcCA9IG5hdmJhci5vZmZzZXRUb3AgPT09IDA7XHJcbmxldCBwcmV2U2Nyb2xsID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCAoKSA9PiB7XHJcbiAgICB2YXIgY3VyclNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICAgIHNldE5hdmJhck9mZnNldChkb2NrZWRUb3AsIHByZXZTY3JvbGwgPiBjdXJyU2Nyb2xsID8gMCA6IC0obmF2YmFyLm9mZnNldEhlaWdodCAtIChkb2NrZWRUb3AgPyAxIDogMikpKTtcclxuICAgIHByZXZTY3JvbGwgPSBjdXJyU2Nyb2xsO1xyXG59KTtcclxubmF2YmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHtcclxuICAgIGlmIChoaWRkZW4pXHJcbiAgICAgICAgc2V0TmF2YmFyT2Zmc2V0KGRvY2tlZFRvcCwgMCk7XHJcbn0pO1xyXG5mdW5jdGlvbiBzZXROYXZiYXJPZmZzZXQoZG9ja2VkVG9wLCBvZmZzKSB7XHJcbiAgICBoaWRkZW4gPSBvZmZzICE9PSAwO1xyXG4gICAgaWYgKCFuYXZiYXIuY2xhc3NMaXN0LmNvbnRhaW5zKCQuZXhwYW5kZWQpKSB7XHJcbiAgICAgICAgaWYgKGRvY2tlZFRvcClcclxuICAgICAgICAgICAgbmF2YmFyLnN0eWxlLnRvcCA9IGAke29mZnN9cHhgO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbmF2YmFyLnN0eWxlLmJvdHRvbSA9IGAke29mZnN9cHhgO1xyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnJlcXVpcmUoXCIuL3BhZ2VtZW51Lmxlc3NcIik7XHJcbmNvbnN0ICQgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9jb21tb24vbXlxdWVyeVwiKTtcclxubGV0IHBhZ2VtZW51ID0gJC5lbGVtZW50c1dpdGhTdHlsZShcInBhZ2VtZW51XCIpWzBdO1xyXG5pZiAocGFnZW1lbnUpIHtcclxuICAgIGxldCBoZWFkaW5nT2Zmc2V0cyA9IFtdO1xyXG4gICAgbGV0IGNvbnRlbnRhcmVhID0gJC5maXJzdEVsZW1lbnRXaXRoU3R5bGUoXCJjb250ZW50YXJlYVwiKTtcclxuICAgIGxldCBwYWdldHJlZSA9ICQuZmlyc3RFbGVtZW50V2l0aFN0eWxlKFwicGFnZXRyZWVcIiwgcGFnZW1lbnUpO1xyXG4gICAgbGV0IGhlYWRpbmdzID0gY29udGVudGFyZWEucXVlcnlTZWxlY3RvckFsbChcImgxLCBoMiwgaDMsIGg0LCBoNVwiKTtcclxuICAgIGJ1aWxkVHJlZShwYWdldHJlZSwgbnVsbCwgMSwgaGVhZGluZ3MsIDApO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgKCkgPT4ge1xyXG4gICAgICAgIGxldCBwb3MgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XHJcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IHByZXYgPSBudWxsO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVhZGluZ09mZnNldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGhvID0gaGVhZGluZ09mZnNldHNbaV07XHJcbiAgICAgICAgICAgIGhvLmxpbmsuY2xhc3NMaXN0LnJlbW92ZShcImhpZ2hsaWdodFwiKTtcclxuICAgICAgICAgICAgaWYgKCFmb3VuZCAmJiBoby5oZWFkaW5nLm9mZnNldFRvcCA+IChwb3MgKyBoby5oZWFkaW5nLm9mZnNldEhlaWdodCkpIHtcclxuICAgICAgICAgICAgICAgIChwcmV2IHx8IGhvKS5saW5rLmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHRcIik7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJldiA9IGhvO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWZvdW5kICYmIHByZXYpXHJcbiAgICAgICAgICAgIHByZXYubGluay5jbGFzc0xpc3QuYWRkKFwiaGlnaGxpZ2h0XCIpO1xyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiBidWlsZFRyZWUocGFyZW50TGlzdCwgcHJldkl0ZW0sIGxldmVsLCBoZWFkaW5ncywgaW5kZXgpIHtcclxuICAgICAgICB3aGlsZSAoaW5kZXggPCBoZWFkaW5ncy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbGV0IGhlYWRpbmcgPSBoZWFkaW5nc1tpbmRleF07XHJcbiAgICAgICAgICAgIGxldCBjdXJyTGV2ZWwgPSBwYXJzZUludChoZWFkaW5nLnRhZ05hbWUuc3Vic3RyKDEsIDEpKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJMZXZlbCA8IGxldmVsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgICAgICAgICBpZiAoY3VyckxldmVsID4gbGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcmV2SXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdWJMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXZJdGVtLmFwcGVuZENoaWxkKHN1Ykxpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gYnVpbGRUcmVlKHN1Ykxpc3QsIG51bGwsIGN1cnJMZXZlbCwgaGVhZGluZ3MsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGJ1aWxkVHJlZShwYXJlbnRMaXN0LCBudWxsLCBjdXJyTGV2ZWwsIGhlYWRpbmdzLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluayA9ICQuYXR0cigkLmNyZWF0ZShcImFcIiwgaGVhZGluZy50ZXh0Q29udGVudCksIFwiaHJlZlwiLCBcIiNcIiArIGhlYWRpbmcuaWQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3RJdGVtID0gJC5jcmVhdGUoXCJsaVwiLCBsaW5rKTtcclxuICAgICAgICAgICAgICAgIHBhcmVudExpc3QuYXBwZW5kQ2hpbGQobGlzdEl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgaGVhZGluZ09mZnNldHNbaW5kZXhdID0geyBoZWFkaW5nLCBsaW5rIH07XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGJ1aWxkVHJlZShwYXJlbnRMaXN0LCBsaXN0SXRlbSwgbGV2ZWwsIGhlYWRpbmdzLCBpbmRleCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5yZXF1aXJlKFwiLi90b2NtZW51Lmxlc3NcIik7XHJcbmNvbnN0ICQgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9jb21tb24vbXlxdWVyeVwiKTtcclxuY29uc3QgYWNjb3JkaW9uXzEgPSByZXF1aXJlKFwiLi4vLi4vY29tcG9uZW50cy9jb21tb24vYWNjb3JkaW9uXCIpO1xyXG5sZXQgdG9jbWVudSA9ICQuZWxlbWVudHNXaXRoU3R5bGUoXCJ0b2NtZW51XCIpWzBdO1xyXG5pZiAodG9jbWVudSkge1xyXG4gICAgaWYgKCFkb2N1bWVudC5mb250cyB8fCBkb2N1bWVudC5mb250cy5zdGF0dXMgPT0gXCJsb2FkZWRcIilcclxuICAgICAgICBhY2NvcmRpb25fMS5pbml0QWNjb3JkaW9ucyh0b2NtZW51KTtcclxuICAgIGVsc2VcclxuICAgICAgICBkb2N1bWVudC5mb250cy5vbmxvYWRpbmdkb25lID0gKCkgPT4gYWNjb3JkaW9uXzEuaW5pdEFjY29yZGlvbnModG9jbWVudSk7XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy50b29sdGlwID0gdm9pZCAwO1xyXG5jb25zdCAkID0gcmVxdWlyZShcIi4uLy4uL2NvbXBvbmVudHMvY29tbW9uL215cXVlcnlcIik7XHJcbnJlcXVpcmUoXCIuL3Rvb2x0aXBzLmxlc3NcIik7XHJcbi8vIGxldCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXVxyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuZm9yRWFjaChlbGVtID0+IHRvb2x0aXAoZWxlbSwgZWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRpdGxlXCIpKSk7XHJcbmNvbnN0IGlkID0gXCJ0b29sdGlwXCI7XHJcbmZ1bmN0aW9uIHRvb2x0aXAoZWxlbSwgdGV4dCkge1xyXG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4gc2hvd1Rvb2x0aXAoZWxlbSwgdGV4dCkpO1xyXG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgaGlkZVRvb2x0aXApO1xyXG59XHJcbmV4cG9ydHMudG9vbHRpcCA9IHRvb2x0aXA7XHJcbmZ1bmN0aW9uIHNob3dUb29sdGlwKGVsZW0sIGNvbnRlbnRzKSB7XHJcbiAgICBoaWRlVG9vbHRpcCgpO1xyXG4gICAgaWYgKCFjb250ZW50cylcclxuICAgICAgICByZXR1cm47XHJcbiAgICBsZXQgdHQgPSAkLmNyZWF0ZSgnbGVnZW5kJyk7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHR0KTtcclxuICAgIHR0LmlkID0gaWQ7XHJcbiAgICB0dC5pbm5lckhUTUwgPSBjb250ZW50cztcclxuICAgIGxldCBiYiA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0dC5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5yb3VuZChiYi5sZWZ0KSArIHdpbmRvdy5zY3JvbGxYfXB4YDtcclxuICAgIHR0LnN0eWxlLnRvcCA9IGAke01hdGgucm91bmQoYmIudG9wKSArIHdpbmRvdy5zY3JvbGxZfXB4YDtcclxuICAgIHR0LnN0eWxlLm9wYWNpdHkgPSBcIjk1JVwiO1xyXG59XHJcbmZ1bmN0aW9uIGhpZGVUb29sdGlwKCkge1xyXG4gICAgbGV0IHR0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgaWYgKHR0KVxyXG4gICAgICAgIHR0LnJlbW92ZSgpO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5yZXF1aXJlKFwiLi9tYWluLmxlc3NcIik7XHJcbnJlcXVpcmUoXCIuL2hhbWJ1cmdlci9oYW1idXJnZXJcIik7XHJcbnJlcXVpcmUoXCIuL25hdmJhci9uYXZiYXJcIik7XHJcbnJlcXVpcmUoXCIuL2xheW91dC9sYXlvdXRcIik7XHJcbnJlcXVpcmUoXCIuL3RvY21lbnUvdG9jbWVudVwiKTtcclxucmVxdWlyZShcIi4vY29udGVudGFyZWEvY29udGVudGFyZWFcIik7XHJcbnJlcXVpcmUoXCIuL3BhZ2VtZW51L3BhZ2VtZW51XCIpO1xyXG5yZXF1aXJlKFwiLi9mb290ZXIvZm9vdGVyXCIpO1xyXG5yZXF1aXJlKFwiLi90b29sdGlwcy90b29sdGlwc1wiKTtcclxucmVxdWlyZShcIi4vbGFuZGluZ1wiKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9