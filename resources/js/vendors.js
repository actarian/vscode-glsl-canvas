// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.dat={})}(this,function(e){"use strict";function t(e,t){var n=e.__state.conversionName.toString(),o=Math.round(e.r),i=Math.round(e.g),r=Math.round(e.b),s=e.a,a=Math.round(e.h),l=e.s.toFixed(1),d=e.v.toFixed(1);if(t||"THREE_CHAR_HEX"===n||"SIX_CHAR_HEX"===n){for(var c=e.hex.toString(16);c.length<6;)c="0"+c;return"#"+c}return"CSS_RGB"===n?"rgb("+o+","+i+","+r+")":"CSS_RGBA"===n?"rgba("+o+","+i+","+r+","+s+")":"HEX"===n?"0x"+e.hex.toString(16):"RGB_ARRAY"===n?"["+o+","+i+","+r+"]":"RGBA_ARRAY"===n?"["+o+","+i+","+r+","+s+"]":"RGB_OBJ"===n?"{r:"+o+",g:"+i+",b:"+r+"}":"RGBA_OBJ"===n?"{r:"+o+",g:"+i+",b:"+r+",a:"+s+"}":"HSV_OBJ"===n?"{h:"+a+",s:"+l+",v:"+d+"}":"HSVA_OBJ"===n?"{h:"+a+",s:"+l+",v:"+d+",a:"+s+"}":"unknown format"}function n(e,t,n){Object.defineProperty(e,t,{get:function(){return"RGB"===this.__state.space?this.__state[t]:(I.recalculateRGB(this,t,n),this.__state[t])},set:function(e){"RGB"!==this.__state.space&&(I.recalculateRGB(this,t,n),this.__state.space="RGB"),this.__state[t]=e}})}function o(e,t){Object.defineProperty(e,t,{get:function(){return"HSV"===this.__state.space?this.__state[t]:(I.recalculateHSV(this),this.__state[t])},set:function(e){"HSV"!==this.__state.space&&(I.recalculateHSV(this),this.__state.space="HSV"),this.__state[t]=e}})}function i(e){if("0"===e||S.isUndefined(e))return 0;var t=e.match(U);return S.isNull(t)?0:parseFloat(t[1])}function r(e){var t=e.toString();return t.indexOf(".")>-1?t.length-t.indexOf(".")-1:0}function s(e,t){var n=Math.pow(10,t);return Math.round(e*n)/n}function a(e,t,n,o,i){return o+(e-t)/(n-t)*(i-o)}function l(e,t,n,o){e.style.background="",S.each(ee,function(i){e.style.cssText+="background: "+i+"linear-gradient("+t+", "+n+" 0%, "+o+" 100%); "})}function d(e){e.style.background="",e.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);",e.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",e.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",e.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);",e.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}function c(e,t,n){var o=document.createElement("li");return t&&o.appendChild(t),n?e.__ul.insertBefore(o,n):e.__ul.appendChild(o),e.onResize(),o}function u(e){X.unbind(window,"resize",e.__resizeHandler),e.saveToLocalStorageIfPossible&&X.unbind(window,"unload",e.saveToLocalStorageIfPossible)}function _(e,t){var n=e.__preset_select[e.__preset_select.selectedIndex];n.innerHTML=t?n.value+"*":n.value}function h(e,t,n){if(n.__li=t,n.__gui=e,S.extend(n,{options:function(t){if(arguments.length>1){var o=n.__li.nextElementSibling;return n.remove(),f(e,n.object,n.property,{before:o,factoryArgs:[S.toArray(arguments)]})}if(S.isArray(t)||S.isObject(t)){var i=n.__li.nextElementSibling;return n.remove(),f(e,n.object,n.property,{before:i,factoryArgs:[t]})}},name:function(e){return n.__li.firstElementChild.firstElementChild.innerHTML=e,n},listen:function(){return n.__gui.listen(n),n},remove:function(){return n.__gui.remove(n),n}}),n instanceof q){var o=new Q(n.object,n.property,{min:n.__min,max:n.__max,step:n.__step});S.each(["updateDisplay","onChange","onFinishChange","step","min","max"],function(e){var t=n[e],i=o[e];n[e]=o[e]=function(){var e=Array.prototype.slice.call(arguments);return i.apply(o,e),t.apply(n,e)}}),X.addClass(t,"has-slider"),n.domElement.insertBefore(o.domElement,n.domElement.firstElementChild)}else if(n instanceof Q){var i=function(t){if(S.isNumber(n.__min)&&S.isNumber(n.__max)){var o=n.__li.firstElementChild.firstElementChild.innerHTML,i=n.__gui.__listening.indexOf(n)>-1;n.remove();var r=f(e,n.object,n.property,{before:n.__li.nextElementSibling,factoryArgs:[n.__min,n.__max,n.__step]});return r.name(o),i&&r.listen(),r}return t};n.min=S.compose(i,n.min),n.max=S.compose(i,n.max)}else n instanceof K?(X.bind(t,"click",function(){X.fakeEvent(n.__checkbox,"click")}),X.bind(n.__checkbox,"click",function(e){e.stopPropagation()})):n instanceof Z?(X.bind(t,"click",function(){X.fakeEvent(n.__button,"click")}),X.bind(t,"mouseover",function(){X.addClass(n.__button,"hover")}),X.bind(t,"mouseout",function(){X.removeClass(n.__button,"hover")})):n instanceof $&&(X.addClass(t,"color"),n.updateDisplay=S.compose(function(e){return t.style.borderLeftColor=n.__color.toString(),e},n.updateDisplay),n.updateDisplay());n.setValue=S.compose(function(t){return e.getRoot().__preset_select&&n.isModified()&&_(e.getRoot(),!0),t},n.setValue)}function p(e,t){var n=e.getRoot(),o=n.__rememberedObjects.indexOf(t.object);if(-1!==o){var i=n.__rememberedObjectIndecesToControllers[o];if(void 0===i&&(i={},n.__rememberedObjectIndecesToControllers[o]=i),i[t.property]=t,n.load&&n.load.remembered){var r=n.load.remembered,s=void 0;if(r[e.preset])s=r[e.preset];else{if(!r[se])return;s=r[se]}if(s[o]&&void 0!==s[o][t.property]){var a=s[o][t.property];t.initialValue=a,t.setValue(a)}}}}function f(e,t,n,o){if(void 0===t[n])throw new Error('Object "'+t+'" has no property "'+n+'"');var i=void 0;if(o.color)i=new $(t,n);else{var r=[t,n].concat(o.factoryArgs);i=ne.apply(e,r)}o.before instanceof z&&(o.before=o.before.__li),p(e,i),X.addClass(i.domElement,"c");var s=document.createElement("span");X.addClass(s,"property-name"),s.innerHTML=i.property;var a=document.createElement("div");a.appendChild(s),a.appendChild(i.domElement);var l=c(e,a,o.before);return X.addClass(l,he.CLASS_CONTROLLER_ROW),i instanceof $?X.addClass(l,"color"):X.addClass(l,H(i.getValue())),h(e,l,i),e.__controllers.push(i),i}function m(e,t){return document.location.href+"."+t}function g(e,t,n){var o=document.createElement("option");o.innerHTML=t,o.value=t,e.__preset_select.appendChild(o),n&&(e.__preset_select.selectedIndex=e.__preset_select.length-1)}function b(e,t){t.style.display=e.useLocalStorage?"block":"none"}function v(e){var t=e.__save_row=document.createElement("li");X.addClass(e.domElement,"has-save"),e.__ul.insertBefore(t,e.__ul.firstChild),X.addClass(t,"save-row");var n=document.createElement("span");n.innerHTML="&nbsp;",X.addClass(n,"button gears");var o=document.createElement("span");o.innerHTML="Save",X.addClass(o,"button"),X.addClass(o,"save");var i=document.createElement("span");i.innerHTML="New",X.addClass(i,"button"),X.addClass(i,"save-as");var r=document.createElement("span");r.innerHTML="Revert",X.addClass(r,"button"),X.addClass(r,"revert");var s=e.__preset_select=document.createElement("select");if(e.load&&e.load.remembered?S.each(e.load.remembered,function(t,n){g(e,n,n===e.preset)}):g(e,se,!1),X.bind(s,"change",function(){for(var t=0;t<e.__preset_select.length;t++)e.__preset_select[t].innerHTML=e.__preset_select[t].value;e.preset=this.value}),t.appendChild(s),t.appendChild(n),t.appendChild(o),t.appendChild(i),t.appendChild(r),ae){var a=document.getElementById("dg-local-explain"),l=document.getElementById("dg-local-storage");document.getElementById("dg-save-locally").style.display="block","true"===localStorage.getItem(m(e,"isLocal"))&&l.setAttribute("checked","checked"),b(e,a),X.bind(l,"change",function(){e.useLocalStorage=!e.useLocalStorage,b(e,a)})}var d=document.getElementById("dg-new-constructor");X.bind(d,"keydown",function(e){!e.metaKey||67!==e.which&&67!==e.keyCode||le.hide()}),X.bind(n,"click",function(){d.innerHTML=JSON.stringify(e.getSaveObject(),void 0,2),le.show(),d.focus(),d.select()}),X.bind(o,"click",function(){e.save()}),X.bind(i,"click",function(){var t=prompt("Enter a new preset name.");t&&e.saveAs(t)}),X.bind(r,"click",function(){e.revert()})}function y(e){function t(t){return t.preventDefault(),e.width+=i-t.clientX,e.onResize(),i=t.clientX,!1}function n(){X.removeClass(e.__closeButton,he.CLASS_DRAG),X.unbind(window,"mousemove",t),X.unbind(window,"mouseup",n)}function o(o){return o.preventDefault(),i=o.clientX,X.addClass(e.__closeButton,he.CLASS_DRAG),X.bind(window,"mousemove",t),X.bind(window,"mouseup",n),!1}var i=void 0;e.__resize_handle=document.createElement("div"),S.extend(e.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"}),X.bind(e.__resize_handle,"mousedown",o),X.bind(e.__closeButton,"mousedown",o),e.domElement.insertBefore(e.__resize_handle,e.domElement.firstElementChild)}function w(e,t){e.domElement.style.width=t+"px",e.__save_row&&e.autoPlace&&(e.__save_row.style.width=t+"px"),e.__closeButton&&(e.__closeButton.style.width=t+"px")}function x(e,t){var n={};return S.each(e.__rememberedObjects,function(o,i){var r={},s=e.__rememberedObjectIndecesToControllers[i];S.each(s,function(e,n){r[n]=t?e.initialValue:e.getValue()}),n[i]=r}),n}function E(e){for(var t=0;t<e.__preset_select.length;t++)e.__preset_select[t].value===e.preset&&(e.__preset_select.selectedIndex=t)}function C(e){0!==e.length&&oe.call(window,function(){C(e)}),S.each(e,function(e){e.updateDisplay()})}var A=Array.prototype.forEach,k=Array.prototype.slice,S={BREAK:{},extend:function(e){return this.each(k.call(arguments,1),function(t){(this.isObject(t)?Object.keys(t):[]).forEach(function(n){this.isUndefined(t[n])||(e[n]=t[n])}.bind(this))},this),e},defaults:function(e){return this.each(k.call(arguments,1),function(t){(this.isObject(t)?Object.keys(t):[]).forEach(function(n){this.isUndefined(e[n])&&(e[n]=t[n])}.bind(this))},this),e},compose:function(){var e=k.call(arguments);return function(){for(var t=k.call(arguments),n=e.length-1;n>=0;n--)t=[e[n].apply(this,t)];return t[0]}},each:function(e,t,n){if(e)if(A&&e.forEach&&e.forEach===A)e.forEach(t,n);else if(e.length===e.length+0){var o=void 0,i=void 0;for(o=0,i=e.length;o<i;o++)if(o in e&&t.call(n,e[o],o)===this.BREAK)return}else for(var r in e)if(t.call(n,e[r],r)===this.BREAK)return},defer:function(e){setTimeout(e,0)},debounce:function(e,t,n){var o=void 0;return function(){var i=this,r=arguments,s=n||!o;clearTimeout(o),o=setTimeout(function(){o=null,n||e.apply(i,r)},t),s&&e.apply(i,r)}},toArray:function(e){return e.toArray?e.toArray():k.call(e)},isUndefined:function(e){return void 0===e},isNull:function(e){return null===e},isNaN:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){return isNaN(e)}),isArray:Array.isArray||function(e){return e.constructor===Array},isObject:function(e){return e===Object(e)},isNumber:function(e){return e===e+0},isString:function(e){return e===e+""},isBoolean:function(e){return!1===e||!0===e},isFunction:function(e){return e instanceof Function}},O=[{litmus:S.isString,conversions:{THREE_CHAR_HEX:{read:function(e){var t=e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return null!==t&&{space:"HEX",hex:parseInt("0x"+t[1].toString()+t[1].toString()+t[2].toString()+t[2].toString()+t[3].toString()+t[3].toString(),0)}},write:t},SIX_CHAR_HEX:{read:function(e){var t=e.match(/^#([A-F0-9]{6})$/i);return null!==t&&{space:"HEX",hex:parseInt("0x"+t[1].toString(),0)}},write:t},CSS_RGB:{read:function(e){var t=e.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);return null!==t&&{space:"RGB",r:parseFloat(t[1]),g:parseFloat(t[2]),b:parseFloat(t[3])}},write:t},CSS_RGBA:{read:function(e){var t=e.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);return null!==t&&{space:"RGB",r:parseFloat(t[1]),g:parseFloat(t[2]),b:parseFloat(t[3]),a:parseFloat(t[4])}},write:t}}},{litmus:S.isNumber,conversions:{HEX:{read:function(e){return{space:"HEX",hex:e,conversionName:"HEX"}},write:function(e){return e.hex}}}},{litmus:S.isArray,conversions:{RGB_ARRAY:{read:function(e){return 3===e.length&&{space:"RGB",r:e[0],g:e[1],b:e[2]}},write:function(e){return[e.r,e.g,e.b]}},RGBA_ARRAY:{read:function(e){return 4===e.length&&{space:"RGB",r:e[0],g:e[1],b:e[2],a:e[3]}},write:function(e){return[e.r,e.g,e.b,e.a]}}}},{litmus:S.isObject,conversions:{RGBA_OBJ:{read:function(e){return!!(S.isNumber(e.r)&&S.isNumber(e.g)&&S.isNumber(e.b)&&S.isNumber(e.a))&&{space:"RGB",r:e.r,g:e.g,b:e.b,a:e.a}},write:function(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}},RGB_OBJ:{read:function(e){return!!(S.isNumber(e.r)&&S.isNumber(e.g)&&S.isNumber(e.b))&&{space:"RGB",r:e.r,g:e.g,b:e.b}},write:function(e){return{r:e.r,g:e.g,b:e.b}}},HSVA_OBJ:{read:function(e){return!!(S.isNumber(e.h)&&S.isNumber(e.s)&&S.isNumber(e.v)&&S.isNumber(e.a))&&{space:"HSV",h:e.h,s:e.s,v:e.v,a:e.a}},write:function(e){return{h:e.h,s:e.s,v:e.v,a:e.a}}},HSV_OBJ:{read:function(e){return!!(S.isNumber(e.h)&&S.isNumber(e.s)&&S.isNumber(e.v))&&{space:"HSV",h:e.h,s:e.s,v:e.v}},write:function(e){return{h:e.h,s:e.s,v:e.v}}}}}],T=void 0,L=void 0,R=function(){L=!1;var e=arguments.length>1?S.toArray(arguments):arguments[0];return S.each(O,function(t){if(t.litmus(e))return S.each(t.conversions,function(t,n){if(T=t.read(e),!1===L&&!1!==T)return L=T,T.conversionName=n,T.conversion=t,S.BREAK}),S.BREAK}),L},B=void 0,N={hsv_to_rgb:function(e,t,n){var o=Math.floor(e/60)%6,i=e/60-Math.floor(e/60),r=n*(1-t),s=n*(1-i*t),a=n*(1-(1-i)*t),l=[[n,a,r],[s,n,r],[r,n,a],[r,s,n],[a,r,n],[n,r,s]][o];return{r:255*l[0],g:255*l[1],b:255*l[2]}},rgb_to_hsv:function(e,t,n){var o=Math.min(e,t,n),i=Math.max(e,t,n),r=i-o,s=void 0,a=void 0;return 0===i?{h:NaN,s:0,v:0}:(a=r/i,s=e===i?(t-n)/r:t===i?2+(n-e)/r:4+(e-t)/r,(s/=6)<0&&(s+=1),{h:360*s,s:a,v:i/255})},rgb_to_hex:function(e,t,n){var o=this.hex_with_component(0,2,e);return o=this.hex_with_component(o,1,t),o=this.hex_with_component(o,0,n)},component_from_hex:function(e,t){return e>>8*t&255},hex_with_component:function(e,t,n){return n<<(B=8*t)|e&~(255<<B)}},H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},F=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},P=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),D=function e(t,n,o){null===t&&(t=Function.prototype);var i=Object.getOwnPropertyDescriptor(t,n);if(void 0===i){var r=Object.getPrototypeOf(t);return null===r?void 0:e(r,n,o)}if("value"in i)return i.value;var s=i.get;if(void 0!==s)return s.call(o)},j=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},V=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t},I=function(){function e(){if(F(this,e),this.__state=R.apply(this,arguments),!1===this.__state)throw new Error("Failed to interpret color arguments");this.__state.a=this.__state.a||1}return P(e,[{key:"toString",value:function(){return t(this)}},{key:"toHexString",value:function(){return t(this,!0)}},{key:"toOriginal",value:function(){return this.__state.conversion.write(this)}}]),e}();I.recalculateRGB=function(e,t,n){if("HEX"===e.__state.space)e.__state[t]=N.component_from_hex(e.__state.hex,n);else{if("HSV"!==e.__state.space)throw new Error("Corrupted color state");S.extend(e.__state,N.hsv_to_rgb(e.__state.h,e.__state.s,e.__state.v))}},I.recalculateHSV=function(e){var t=N.rgb_to_hsv(e.r,e.g,e.b);S.extend(e.__state,{s:t.s,v:t.v}),S.isNaN(t.h)?S.isUndefined(e.__state.h)&&(e.__state.h=0):e.__state.h=t.h},I.COMPONENTS=["r","g","b","h","s","v","hex","a"],n(I.prototype,"r",2),n(I.prototype,"g",1),n(I.prototype,"b",0),o(I.prototype,"h"),o(I.prototype,"s"),o(I.prototype,"v"),Object.defineProperty(I.prototype,"a",{get:function(){return this.__state.a},set:function(e){this.__state.a=e}}),Object.defineProperty(I.prototype,"hex",{get:function(){return"HEX"!==this.__state.space&&(this.__state.hex=N.rgb_to_hex(this.r,this.g,this.b),this.__state.space="HEX"),this.__state.hex},set:function(e){this.__state.space="HEX",this.__state.hex=e}});var z=function(){function e(t,n){F(this,e),this.initialValue=t[n],this.domElement=document.createElement("div"),this.object=t,this.property=n,this.__onChange=void 0,this.__onFinishChange=void 0}return P(e,[{key:"onChange",value:function(e){return this.__onChange=e,this}},{key:"onFinishChange",value:function(e){return this.__onFinishChange=e,this}},{key:"setValue",value:function(e){return this.object[this.property]=e,this.__onChange&&this.__onChange.call(this,e),this.updateDisplay(),this}},{key:"getValue",value:function(){return this.object[this.property]}},{key:"updateDisplay",value:function(){return this}},{key:"isModified",value:function(){return this.initialValue!==this.getValue()}}]),e}(),M={HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},G={};S.each(M,function(e,t){S.each(e,function(e){G[e]=t})});var U=/(\d+(\.\d+)?)px/,X={makeSelectable:function(e,t){void 0!==e&&void 0!==e.style&&(e.onselectstart=t?function(){return!1}:function(){},e.style.MozUserSelect=t?"auto":"none",e.style.KhtmlUserSelect=t?"auto":"none",e.unselectable=t?"on":"off")},makeFullscreen:function(e,t,n){var o=n,i=t;S.isUndefined(i)&&(i=!0),S.isUndefined(o)&&(o=!0),e.style.position="absolute",i&&(e.style.left=0,e.style.right=0),o&&(e.style.top=0,e.style.bottom=0)},fakeEvent:function(e,t,n,o){var i=n||{},r=G[t];if(!r)throw new Error("Event type "+t+" not supported.");var s=document.createEvent(r);switch(r){case"MouseEvents":var a=i.x||i.clientX||0,l=i.y||i.clientY||0;s.initMouseEvent(t,i.bubbles||!1,i.cancelable||!0,window,i.clickCount||1,0,0,a,l,!1,!1,!1,!1,0,null);break;case"KeyboardEvents":var d=s.initKeyboardEvent||s.initKeyEvent;S.defaults(i,{cancelable:!0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,keyCode:void 0,charCode:void 0}),d(t,i.bubbles||!1,i.cancelable,window,i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,i.keyCode,i.charCode);break;default:s.initEvent(t,i.bubbles||!1,i.cancelable||!0)}S.defaults(s,o),e.dispatchEvent(s)},bind:function(e,t,n,o){var i=o||!1;return e.addEventListener?e.addEventListener(t,n,i):e.attachEvent&&e.attachEvent("on"+t,n),X},unbind:function(e,t,n,o){var i=o||!1;return e.removeEventListener?e.removeEventListener(t,n,i):e.detachEvent&&e.detachEvent("on"+t,n),X},addClass:function(e,t){if(void 0===e.className)e.className=t;else if(e.className!==t){var n=e.className.split(/ +/);-1===n.indexOf(t)&&(n.push(t),e.className=n.join(" ").replace(/^\s+/,"").replace(/\s+$/,""))}return X},removeClass:function(e,t){if(t)if(e.className===t)e.removeAttribute("class");else{var n=e.className.split(/ +/),o=n.indexOf(t);-1!==o&&(n.splice(o,1),e.className=n.join(" "))}else e.className=void 0;return X},hasClass:function(e,t){return new RegExp("(?:^|\\s+)"+t+"(?:\\s+|$)").test(e.className)||!1},getWidth:function(e){var t=getComputedStyle(e);return i(t["border-left-width"])+i(t["border-right-width"])+i(t["padding-left"])+i(t["padding-right"])+i(t.width)},getHeight:function(e){var t=getComputedStyle(e);return i(t["border-top-width"])+i(t["border-bottom-width"])+i(t["padding-top"])+i(t["padding-bottom"])+i(t.height)},getOffset:function(e){var t=e,n={left:0,top:0};if(t.offsetParent)do{n.left+=t.offsetLeft,n.top+=t.offsetTop,t=t.offsetParent}while(t);return n},isActive:function(e){return e===document.activeElement&&(e.type||e.href)}},K=function(e){function t(e,n){F(this,t);var o=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n)),i=o;return o.__prev=o.getValue(),o.__checkbox=document.createElement("input"),o.__checkbox.setAttribute("type","checkbox"),X.bind(o.__checkbox,"change",function(){i.setValue(!i.__prev)},!1),o.domElement.appendChild(o.__checkbox),o.updateDisplay(),o}return j(t,z),P(t,[{key:"setValue",value:function(e){var n=D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"setValue",this).call(this,e);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),this.__prev=this.getValue(),n}},{key:"updateDisplay",value:function(){return!0===this.getValue()?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=!0,this.__prev=!0):(this.__checkbox.checked=!1,this.__prev=!1),D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"updateDisplay",this).call(this)}}]),t}(),Y=function(e){function t(e,n,o){F(this,t);var i=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n)),r=o,s=i;if(i.__select=document.createElement("select"),S.isArray(r)){var a={};S.each(r,function(e){a[e]=e}),r=a}return S.each(r,function(e,t){var n=document.createElement("option");n.innerHTML=t,n.setAttribute("value",e),s.__select.appendChild(n)}),i.updateDisplay(),X.bind(i.__select,"change",function(){var e=this.options[this.selectedIndex].value;s.setValue(e)}),i.domElement.appendChild(i.__select),i}return j(t,z),P(t,[{key:"setValue",value:function(e){var n=D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"setValue",this).call(this,e);return this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue()),n}},{key:"updateDisplay",value:function(){return X.isActive(this.__select)?this:(this.__select.value=this.getValue(),D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"updateDisplay",this).call(this))}}]),t}(),J=function(e){function t(e,n){function o(){r.setValue(r.__input.value)}F(this,t);var i=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n)),r=i;return i.__input=document.createElement("input"),i.__input.setAttribute("type","text"),X.bind(i.__input,"keyup",o),X.bind(i.__input,"change",o),X.bind(i.__input,"blur",function(){r.__onFinishChange&&r.__onFinishChange.call(r,r.getValue())}),X.bind(i.__input,"keydown",function(e){13===e.keyCode&&this.blur()}),i.updateDisplay(),i.domElement.appendChild(i.__input),i}return j(t,z),P(t,[{key:"updateDisplay",value:function(){return X.isActive(this.__input)||(this.__input.value=this.getValue()),D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"updateDisplay",this).call(this)}}]),t}(),W=function(e){function t(e,n,o){F(this,t);var i=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n)),s=o||{};return i.__min=s.min,i.__max=s.max,i.__step=s.step,S.isUndefined(i.__step)?0===i.initialValue?i.__impliedStep=1:i.__impliedStep=Math.pow(10,Math.floor(Math.log(Math.abs(i.initialValue))/Math.LN10))/10:i.__impliedStep=i.__step,i.__precision=r(i.__impliedStep),i}return j(t,z),P(t,[{key:"setValue",value:function(e){var n=e;return void 0!==this.__min&&n<this.__min?n=this.__min:void 0!==this.__max&&n>this.__max&&(n=this.__max),void 0!==this.__step&&n%this.__step!=0&&(n=Math.round(n/this.__step)*this.__step),D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"setValue",this).call(this,n)}},{key:"min",value:function(e){return this.__min=e,this}},{key:"max",value:function(e){return this.__max=e,this}},{key:"step",value:function(e){return this.__step=e,this.__impliedStep=e,this.__precision=r(e),this}}]),t}(),Q=function(e){function t(e,n,o){function i(){l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())}function r(e){var t=d-e.clientY;l.setValue(l.getValue()+t*l.__impliedStep),d=e.clientY}function s(){X.unbind(window,"mousemove",r),X.unbind(window,"mouseup",s),i()}F(this,t);var a=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n,o));a.__truncationSuspended=!1;var l=a,d=void 0;return a.__input=document.createElement("input"),a.__input.setAttribute("type","text"),X.bind(a.__input,"change",function(){var e=parseFloat(l.__input.value);S.isNaN(e)||l.setValue(e)}),X.bind(a.__input,"blur",function(){i()}),X.bind(a.__input,"mousedown",function(e){X.bind(window,"mousemove",r),X.bind(window,"mouseup",s),d=e.clientY}),X.bind(a.__input,"keydown",function(e){13===e.keyCode&&(l.__truncationSuspended=!0,this.blur(),l.__truncationSuspended=!1,i())}),a.updateDisplay(),a.domElement.appendChild(a.__input),a}return j(t,W),P(t,[{key:"updateDisplay",value:function(){return this.__input.value=this.__truncationSuspended?this.getValue():s(this.getValue(),this.__precision),D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"updateDisplay",this).call(this)}}]),t}(),q=function(e){function t(e,n,o,i,r){function s(e){e.preventDefault();var t=_.__background.getBoundingClientRect();return _.setValue(a(e.clientX,t.left,t.right,_.__min,_.__max)),!1}function l(){X.unbind(window,"mousemove",s),X.unbind(window,"mouseup",l),_.__onFinishChange&&_.__onFinishChange.call(_,_.getValue())}function d(e){var t=e.touches[0].clientX,n=_.__background.getBoundingClientRect();_.setValue(a(t,n.left,n.right,_.__min,_.__max))}function c(){X.unbind(window,"touchmove",d),X.unbind(window,"touchend",c),_.__onFinishChange&&_.__onFinishChange.call(_,_.getValue())}F(this,t);var u=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n,{min:o,max:i,step:r})),_=u;return u.__background=document.createElement("div"),u.__foreground=document.createElement("div"),X.bind(u.__background,"mousedown",function(e){document.activeElement.blur(),X.bind(window,"mousemove",s),X.bind(window,"mouseup",l),s(e)}),X.bind(u.__background,"touchstart",function(e){1===e.touches.length&&(X.bind(window,"touchmove",d),X.bind(window,"touchend",c),d(e))}),X.addClass(u.__background,"slider"),X.addClass(u.__foreground,"slider-fg"),u.updateDisplay(),u.__background.appendChild(u.__foreground),u.domElement.appendChild(u.__background),u}return j(t,W),P(t,[{key:"updateDisplay",value:function(){var e=(this.getValue()-this.__min)/(this.__max-this.__min);return this.__foreground.style.width=100*e+"%",D(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"updateDisplay",this).call(this)}}]),t}(),Z=function(e){function t(e,n,o){F(this,t);var i=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n)),r=i;return i.__button=document.createElement("div"),i.__button.innerHTML=void 0===o?"Fire":o,X.bind(i.__button,"click",function(e){return e.preventDefault(),r.fire(),!1}),X.addClass(i.__button,"button"),i.domElement.appendChild(i.__button),i}return j(t,z),P(t,[{key:"fire",value:function(){this.__onChange&&this.__onChange.call(this),this.getValue().call(this.object),this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue())}}]),t}(),$=function(e){function t(e,n){function o(e){u(e),X.bind(window,"mousemove",u),X.bind(window,"touchmove",u),X.bind(window,"mouseup",r),X.bind(window,"touchend",r)}function i(e){_(e),X.bind(window,"mousemove",_),X.bind(window,"touchmove",_),X.bind(window,"mouseup",s),X.bind(window,"touchend",s)}function r(){X.unbind(window,"mousemove",u),X.unbind(window,"touchmove",u),X.unbind(window,"mouseup",r),X.unbind(window,"touchend",r),c()}function s(){X.unbind(window,"mousemove",_),X.unbind(window,"touchmove",_),X.unbind(window,"mouseup",s),X.unbind(window,"touchend",s),c()}function a(){var e=R(this.value);!1!==e?(p.__color.__state=e,p.setValue(p.__color.toOriginal())):this.value=p.__color.toString()}function c(){p.__onFinishChange&&p.__onFinishChange.call(p,p.__color.toOriginal())}function u(e){-1===e.type.indexOf("touch")&&e.preventDefault();var t=p.__saturation_field.getBoundingClientRect(),n=e.touches&&e.touches[0]||e,o=n.clientX,i=n.clientY,r=(o-t.left)/(t.right-t.left),s=1-(i-t.top)/(t.bottom-t.top);return s>1?s=1:s<0&&(s=0),r>1?r=1:r<0&&(r=0),p.__color.v=s,p.__color.s=r,p.setValue(p.__color.toOriginal()),!1}function _(e){-1===e.type.indexOf("touch")&&e.preventDefault();var t=p.__hue_field.getBoundingClientRect(),n=1-((e.touches&&e.touches[0]||e).clientY-t.top)/(t.bottom-t.top);return n>1?n=1:n<0&&(n=0),p.__color.h=360*n,p.setValue(p.__color.toOriginal()),!1}F(this,t);var h=V(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e,n));h.__color=new I(h.getValue()),h.__temp=new I(0);var p=h;h.domElement=document.createElement("div"),X.makeSelectable(h.domElement,!1),h.__selector=document.createElement("div"),h.__selector.className="selector",h.__saturation_field=document.createElement("div"),h.__saturation_field.className="saturation-field",h.__field_knob=document.createElement("div"),h.__field_knob.className="field-knob",h.__field_knob_border="2px solid ",h.__hue_knob=document.createElement("div"),h.__hue_knob.className="hue-knob",h.__hue_field=document.createElement("div"),h.__hue_field.className="hue-field",h.__input=document.createElement("input"),h.__input.type="text",h.__input_textShadow="0 1px 1px ",X.bind(h.__input,"keydown",function(e){13===e.keyCode&&a.call(this)}),X.bind(h.__input,"blur",a),X.bind(h.__selector,"mousedown",function(){X.addClass(this,"drag").bind(window,"mouseup",function(){X.removeClass(p.__selector,"drag")})}),X.bind(h.__selector,"touchstart",function(){X.addClass(this,"drag").bind(window,"touchend",function(){X.removeClass(p.__selector,"drag")})});var f=document.createElement("div");return S.extend(h.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"}),S.extend(h.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:h.__field_knob_border+(h.__color.v<.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1}),S.extend(h.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1}),S.extend(h.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"}),S.extend(f.style,{width:"100%",height:"100%",background:"none"}),l(f,"top","rgba(0,0,0,0)","#000"),S.extend(h.__hue_field.style,{width:"15px",height:"100px",border:"1px solid #555",cursor:"ns-resize",position:"absolute",top:"3px",right:"3px"}),d(h.__hue_field),S.extend(h.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:h.__input_textShadow+"rgba(0,0,0,0.7)"}),X.bind(h.__saturation_field,"mousedown",o),X.bind(h.__saturation_field,"touchstart",o),X.bind(h.__field_knob,"mousedown",o),X.bind(h.__field_knob,"touchstart",o),X.bind(h.__hue_field,"mousedown",i),X.bind(h.__hue_field,"touchstart",i),h.__saturation_field.appendChild(f),h.__selector.appendChild(h.__field_knob),h.__selector.appendChild(h.__saturation_field),h.__selector.appendChild(h.__hue_field),h.__hue_field.appendChild(h.__hue_knob),h.domElement.appendChild(h.__input),h.domElement.appendChild(h.__selector),h.updateDisplay(),h}return j(t,z),P(t,[{key:"updateDisplay",value:function(){var e=R(this.getValue());if(!1!==e){var t=!1;S.each(I.COMPONENTS,function(n){if(!S.isUndefined(e[n])&&!S.isUndefined(this.__color.__state[n])&&e[n]!==this.__color.__state[n])return t=!0,{}},this),t&&S.extend(this.__color.__state,e)}S.extend(this.__temp.__state,this.__color.__state),this.__temp.a=1;var n=this.__color.v<.5||this.__color.s>.5?255:0,o=255-n;S.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toHexString(),border:this.__field_knob_border+"rgb("+n+","+n+","+n+")"}),this.__hue_knob.style.marginTop=100*(1-this.__color.h/360)+"px",this.__temp.s=1,this.__temp.v=1,l(this.__saturation_field,"left","#fff",this.__temp.toHexString()),this.__input.value=this.__color.toString(),S.extend(this.__input.style,{backgroundColor:this.__color.toHexString(),color:"rgb("+n+","+n+","+n+")",textShadow:this.__input_textShadow+"rgba("+o+","+o+","+o+",.7)"})}}]),t}(),ee=["-moz-","-o-","-webkit-","-ms-",""],te={load:function(e,t){var n=t||document,o=n.createElement("link");o.type="text/css",o.rel="stylesheet",o.href=e,n.getElementsByTagName("head")[0].appendChild(o)},inject:function(e,t){var n=t||document,o=document.createElement("style");o.type="text/css",o.innerHTML=e;var i=n.getElementsByTagName("head")[0];try{i.appendChild(o)}catch(e){}}},ne=function(e,t){var n=e[t];return S.isArray(arguments[2])||S.isObject(arguments[2])?new Y(e,t,arguments[2]):S.isNumber(n)?S.isNumber(arguments[2])&&S.isNumber(arguments[3])?S.isNumber(arguments[4])?new q(e,t,arguments[2],arguments[3],arguments[4]):new q(e,t,arguments[2],arguments[3]):S.isNumber(arguments[4])?new Q(e,t,{min:arguments[2],max:arguments[3],step:arguments[4]}):new Q(e,t,{min:arguments[2],max:arguments[3]}):S.isString(n)?new J(e,t):S.isFunction(n)?new Z(e,t,""):S.isBoolean(n)?new K(e,t):null},oe=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)},ie=function(){function e(){F(this,e),this.backgroundElement=document.createElement("div"),S.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear",transition:"opacity 0.2s linear"}),X.makeFullscreen(this.backgroundElement),this.backgroundElement.style.position="fixed",this.domElement=document.createElement("div"),S.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear",transition:"transform 0.2s ease-out, opacity 0.2s linear"}),document.body.appendChild(this.backgroundElement),document.body.appendChild(this.domElement);var t=this;X.bind(this.backgroundElement,"click",function(){t.hide()})}return P(e,[{key:"show",value:function(){var e=this;this.backgroundElement.style.display="block",this.domElement.style.display="block",this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)",this.layout(),S.defer(function(){e.backgroundElement.style.opacity=1,e.domElement.style.opacity=1,e.domElement.style.webkitTransform="scale(1)"})}},{key:"hide",value:function(){var e=this,t=function t(){e.domElement.style.display="none",e.backgroundElement.style.display="none",X.unbind(e.domElement,"webkitTransitionEnd",t),X.unbind(e.domElement,"transitionend",t),X.unbind(e.domElement,"oTransitionEnd",t)};X.bind(this.domElement,"webkitTransitionEnd",t),X.bind(this.domElement,"transitionend",t),X.bind(this.domElement,"oTransitionEnd",t),this.backgroundElement.style.opacity=0,this.domElement.style.opacity=0,this.domElement.style.webkitTransform="scale(1.1)"}},{key:"layout",value:function(){this.domElement.style.left=window.innerWidth/2-X.getWidth(this.domElement)/2+"px",this.domElement.style.top=window.innerHeight/2-X.getHeight(this.domElement)/2+"px"}}]),e}(),re=function(e){if(e&&"undefined"!=typeof window){var t=document.createElement("style");return t.setAttribute("type","text/css"),t.innerHTML=e,document.head.appendChild(t),e}}(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");te.inject(re);var se="Default",ae=function(){try{return!!window.localStorage}catch(e){return!1}}(),le=void 0,de=!0,ce=void 0,ue=!1,_e=[],he=function e(t){var n=this,o=t||{};this.domElement=document.createElement("div"),this.__ul=document.createElement("ul"),this.domElement.appendChild(this.__ul),X.addClass(this.domElement,"dg"),this.__folders={},this.__controllers=[],this.__rememberedObjects=[],this.__rememberedObjectIndecesToControllers=[],this.__listening=[],o=S.defaults(o,{closeOnTop:!1,autoPlace:!0,width:e.DEFAULT_WIDTH}),o=S.defaults(o,{resizable:o.autoPlace,hideable:o.autoPlace}),S.isUndefined(o.load)?o.load={preset:se}:o.preset&&(o.load.preset=o.preset),S.isUndefined(o.parent)&&o.hideable&&_e.push(this),o.resizable=S.isUndefined(o.parent)&&o.resizable,o.autoPlace&&S.isUndefined(o.scrollable)&&(o.scrollable=!0);var i=ae&&"true"===localStorage.getItem(m(this,"isLocal")),r=void 0,s=void 0;if(Object.defineProperties(this,{parent:{get:function(){return o.parent}},scrollable:{get:function(){return o.scrollable}},autoPlace:{get:function(){return o.autoPlace}},closeOnTop:{get:function(){return o.closeOnTop}},preset:{get:function(){return n.parent?n.getRoot().preset:o.load.preset},set:function(e){n.parent?n.getRoot().preset=e:o.load.preset=e,E(this),n.revert()}},width:{get:function(){return o.width},set:function(e){o.width=e,w(n,e)}},name:{get:function(){return o.name},set:function(e){o.name=e,s&&(s.innerHTML=o.name)}},closed:{get:function(){return o.closed},set:function(t){o.closed=t,o.closed?X.addClass(n.__ul,e.CLASS_CLOSED):X.removeClass(n.__ul,e.CLASS_CLOSED),this.onResize(),n.__closeButton&&(n.__closeButton.innerHTML=t?e.TEXT_OPEN:e.TEXT_CLOSED)}},load:{get:function(){return o.load}},useLocalStorage:{get:function(){return i},set:function(e){ae&&(i=e,e?X.bind(window,"unload",r):X.unbind(window,"unload",r),localStorage.setItem(m(n,"isLocal"),e))}}}),S.isUndefined(o.parent)){if(this.closed=o.closed||!1,X.addClass(this.domElement,e.CLASS_MAIN),X.makeSelectable(this.domElement,!1),ae&&i){n.useLocalStorage=!0;var a=localStorage.getItem(m(this,"gui"));a&&(o.load=JSON.parse(a))}this.__closeButton=document.createElement("div"),this.__closeButton.innerHTML=e.TEXT_CLOSED,X.addClass(this.__closeButton,e.CLASS_CLOSE_BUTTON),o.closeOnTop?(X.addClass(this.__closeButton,e.CLASS_CLOSE_TOP),this.domElement.insertBefore(this.__closeButton,this.domElement.childNodes[0])):(X.addClass(this.__closeButton,e.CLASS_CLOSE_BOTTOM),this.domElement.appendChild(this.__closeButton)),X.bind(this.__closeButton,"click",function(){n.closed=!n.closed})}else{void 0===o.closed&&(o.closed=!0);var l=document.createTextNode(o.name);X.addClass(l,"controller-name"),s=c(n,l);X.addClass(this.__ul,e.CLASS_CLOSED),X.addClass(s,"title"),X.bind(s,"click",function(e){return e.preventDefault(),n.closed=!n.closed,!1}),o.closed||(this.closed=!1)}o.autoPlace&&(S.isUndefined(o.parent)&&(de&&(ce=document.createElement("div"),X.addClass(ce,"dg"),X.addClass(ce,e.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(ce),de=!1),ce.appendChild(this.domElement),X.addClass(this.domElement,e.CLASS_AUTO_PLACE)),this.parent||w(n,o.width)),this.__resizeHandler=function(){n.onResizeDebounced()},X.bind(window,"resize",this.__resizeHandler),X.bind(this.__ul,"webkitTransitionEnd",this.__resizeHandler),X.bind(this.__ul,"transitionend",this.__resizeHandler),X.bind(this.__ul,"oTransitionEnd",this.__resizeHandler),this.onResize(),o.resizable&&y(this),r=function(){ae&&"true"===localStorage.getItem(m(n,"isLocal"))&&localStorage.setItem(m(n,"gui"),JSON.stringify(n.getSaveObject()))},this.saveToLocalStorageIfPossible=r,o.parent||function(){var e=n.getRoot();e.width+=1,S.defer(function(){e.width-=1})}()};he.toggleHide=function(){ue=!ue,S.each(_e,function(e){e.domElement.style.display=ue?"none":""})},he.CLASS_AUTO_PLACE="a",he.CLASS_AUTO_PLACE_CONTAINER="ac",he.CLASS_MAIN="main",he.CLASS_CONTROLLER_ROW="cr",he.CLASS_TOO_TALL="taller-than-window",he.CLASS_CLOSED="closed",he.CLASS_CLOSE_BUTTON="close-button",he.CLASS_CLOSE_TOP="close-top",he.CLASS_CLOSE_BOTTOM="close-bottom",he.CLASS_DRAG="drag",he.DEFAULT_WIDTH=245,he.TEXT_CLOSED="Close Controls",he.TEXT_OPEN="Open Controls",he._keydownHandler=function(e){"text"===document.activeElement.type||72!==e.which&&72!==e.keyCode||he.toggleHide()},X.bind(window,"keydown",he._keydownHandler,!1),S.extend(he.prototype,{add:function(e,t){return f(this,e,t,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(e,t){return f(this,e,t,{color:!0})},remove:function(e){this.__ul.removeChild(e.__li),this.__controllers.splice(this.__controllers.indexOf(e),1);var t=this;S.defer(function(){t.onResize()})},destroy:function(){if(this.parent)throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");this.autoPlace&&ce.removeChild(this.domElement);var e=this;S.each(this.__folders,function(t){e.removeFolder(t)}),X.unbind(window,"keydown",he._keydownHandler,!1),u(this)},addFolder:function(e){if(void 0!==this.__folders[e])throw new Error('You already have a folder in this GUI by the name "'+e+'"');var t={name:e,parent:this};t.autoPlace=this.autoPlace,this.load&&this.load.folders&&this.load.folders[e]&&(t.closed=this.load.folders[e].closed,t.load=this.load.folders[e]);var n=new he(t);this.__folders[e]=n;var o=c(this,n.domElement);return X.addClass(o,"folder"),n},removeFolder:function(e){this.__ul.removeChild(e.domElement.parentElement),delete this.__folders[e.name],this.load&&this.load.folders&&this.load.folders[e.name]&&delete this.load.folders[e.name],u(e);var t=this;S.each(e.__folders,function(t){e.removeFolder(t)}),S.defer(function(){t.onResize()})},open:function(){this.closed=!1},close:function(){this.closed=!0},hide:function(){this.domElement.style.display="none"},show:function(){this.domElement.style.display=""},onResize:function(){var e=this.getRoot();if(e.scrollable){var t=X.getOffset(e.__ul).top,n=0;S.each(e.__ul.childNodes,function(t){e.autoPlace&&t===e.__save_row||(n+=X.getHeight(t))}),window.innerHeight-t-20<n?(X.addClass(e.domElement,he.CLASS_TOO_TALL),e.__ul.style.height=window.innerHeight-t-20+"px"):(X.removeClass(e.domElement,he.CLASS_TOO_TALL),e.__ul.style.height="auto")}e.__resize_handle&&S.defer(function(){e.__resize_handle.style.height=e.__ul.offsetHeight+"px"}),e.__closeButton&&(e.__closeButton.style.width=e.width+"px")},onResizeDebounced:S.debounce(function(){this.onResize()},50),remember:function(){if(S.isUndefined(le)&&((le=new ie).domElement.innerHTML='<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>'),this.parent)throw new Error("You can only call remember on a top level GUI.");var e=this;S.each(Array.prototype.slice.call(arguments),function(t){0===e.__rememberedObjects.length&&v(e),-1===e.__rememberedObjects.indexOf(t)&&e.__rememberedObjects.push(t)}),this.autoPlace&&w(this,this.width)},getRoot:function(){for(var e=this;e.parent;)e=e.parent;return e},getSaveObject:function(){var e=this.load;return e.closed=this.closed,this.__rememberedObjects.length>0&&(e.preset=this.preset,e.remembered||(e.remembered={}),e.remembered[this.preset]=x(this)),e.folders={},S.each(this.__folders,function(t,n){e.folders[n]=t.getSaveObject()}),e},save:function(){this.load.remembered||(this.load.remembered={}),this.load.remembered[this.preset]=x(this),_(this,!1),this.saveToLocalStorageIfPossible()},saveAs:function(e){this.load.remembered||(this.load.remembered={},this.load.remembered[se]=x(this,!0)),this.load.remembered[e]=x(this),this.preset=e,g(this,e,!0),this.saveToLocalStorageIfPossible()},revert:function(e){S.each(this.__controllers,function(t){this.getRoot().load.remembered?p(e||this.getRoot(),t):t.setValue(t.initialValue),t.__onFinishChange&&t.__onFinishChange.call(t,t.getValue())},this),S.each(this.__folders,function(e){e.revert(e)}),e||_(this.getRoot(),!1)},listen:function(e){var t=0===this.__listening.length;this.__listening.push(e),t&&C(this.__listening)},updateDisplay:function(){S.each(this.__controllers,function(e){e.updateDisplay()}),S.each(this.__folders,function(e){e.updateDisplay()})}});var pe={Color:I,math:N,interpret:R},fe={Controller:z,BooleanController:K,OptionController:Y,StringController:J,NumberController:W,NumberControllerBox:Q,NumberControllerSlider:q,FunctionController:Z,ColorController:$},me={dom:X},ge={GUI:he},be=he,ve={color:pe,controllers:fe,dom:me,gui:ge,GUI:be};e.color=pe,e.controllers=fe,e.dom=me,e.gui=ge,e.GUI=be,e.default=ve,Object.defineProperty(e,"__esModule",{value:!0})});

/**
 * @license glsl-canvas-js v0.2.8
 * (c) 2022 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).glsl={})}(this,(function(t){"use strict";function e(t,e){for(var r=0;r<e.length;r++){var i=e[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function r(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,i(t,e)}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function n(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var o="\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nattribute vec4 a_position;\nattribute vec4 a_normal;\nattribute vec2 a_texcoord;\nattribute vec4 a_color;\n\nvarying vec4 v_position;\nvarying vec4 v_normal;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\n",s="\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvarying vec4 v_position;\nvarying vec4 v_normal;\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\n",a="#version 300 es\n\nprecision mediump float;\n\nin vec4 a_position;\nin vec4 a_normal;\nin vec2 a_texcoord;\nin vec4 a_color;\n\nout vec4 v_position;\nout vec4 v_normal;\nout vec2 v_texcoord;\nout vec4 v_color;\n",u="#version 300 es\n\nprecision mediump float;\n\nin vec4 v_position;\nin vec4 v_normal;\nin vec2 v_texcoord;\nin vec4 v_color;\n\nout vec4 outColor;\n",h="\nuniform mat4 u_projectionMatrix;\nuniform mat4 u_modelViewMatrix;\nuniform mat4 u_normalMatrix;\n\nuniform vec2 u_resolution;\nuniform float u_time;\n",f="\nvoid main() {\n\tv_position = a_position;\n\tv_normal = a_normal;\n\tv_texcoord = a_texcoord;\n\tv_color = a_color;\n\tgl_Position = a_position;\n}\n",c="\nvoid main(void) {\n\tv_position = u_projectionMatrix * u_modelViewMatrix * a_position;\n\tv_normal = u_normalMatrix * a_normal;\n\tv_texcoord = a_texcoord;\n\tv_color = a_color;\n\tgl_Position = v_position;\n}\n",l=o+h+c,d=a+h+c,m=s+h+"\nvoid main() {\n\tvec2 st = gl_FragCoord.xy / u_resolution.xy;\n\tst.x *= u_resolution.x / u_resolution.y;\n\tvec3 color = vec3(\n\t\tabs(cos(u_time * 0.1)) * st.y,\n\t\tabs(cos(u_time * 0.2)) * st.y,\n\t\tabs(sin(u_time)) * st.y\n\t);\n\tgl_FragColor = vec4(color, 1.0);\n}\n",v=u+h+"\nvoid main() {\n\tvec2 st = gl_FragCoord.xy / u_resolution.xy;\n\tst.x *= u_resolution.x / u_resolution.y;\n\tvec3 color = vec3(\n\t\tabs(cos(u_time * 0.1)) * st.y,\n\t\tabs(cos(u_time * 0.2)) * st.y,\n\t\tabs(sin(u_time)) * st.y\n\t);\n\toutColor = vec4(color, 1.0);\n}\n",p=s+h+"\nvoid main() {\n\tvec2 uv = v_texcoord;\n\tvec3 color = vec3(\n\t\tabs(cos(u_time * 0.1)) * uv.y,\n\t\tabs(cos(u_time * 0.2)) * uv.y,\n\t\tabs(sin(u_time)) * uv.y\n\t);\n\tfloat incidence = max(dot(v_normal.xyz, vec3(0.0, 1.0, 0.0)), 0.0);\n\tvec3 light = vec3(0.2) + (vec3(1.0) * incidence);\n\tgl_FragColor = vec4(v_color.rgb * color * light, 1.0);\n}\n",g=u+h+"\nvoid main() {\n\tvec2 uv = v_texcoord;\n\tvec3 color = vec3(\n\t\tabs(cos(u_time * 0.1)) * uv.y,\n\t\tabs(cos(u_time * 0.2)) * uv.y,\n\t\tabs(sin(u_time)) * uv.y\n\t);\n\tfloat incidence = max(dot(v_normal.xyz, vec3(0.0, 1.0, 0.0)), 0.0);\n\tvec3 light = vec3(0.2) + (vec3(1.0) * incidence);\n\toutColor = vec4(v_color.rgb * color * light, 1.0);\n}\n",_=o+h+f,y=a+h+f,x=s+h+"\nvoid main(){\n\tgl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n}",T=u+h+"\nvoid main() {\n\toutColor = vec4(0.0, 0.0, 0.0, 1.0);\n}\n";var E=setTimeout;function U(t){return Boolean(t&&void 0!==t.length)}function M(){}function b(t){if(!(this instanceof b))throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],S(t,this)}function A(t,e){for(;3===t._state;)t=t._value;0!==t._state?(t._handled=!0,b._immediateFn((function(){var r=1===t._state?e.onFulfilled:e.onRejected;if(null!==r){var i;try{i=r(t._value)}catch(t){return void w(e.promise,t)}F(e.promise,i)}else(1===t._state?F:w)(e.promise,t._value)}))):t._deferreds.push(e)}function F(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var r=e.then;if(e instanceof b)return t._state=3,t._value=e,void L(t);if("function"==typeof r)return void S((i=r,n=e,function(){i.apply(n,arguments)}),t)}t._state=1,t._value=e,L(t)}catch(e){w(t,e)}var i,n}function w(t,e){t._state=2,t._value=e,L(t)}function L(t){2===t._state&&0===t._deferreds.length&&b._immediateFn((function(){t._handled||b._unhandledRejectionFn(t._value)}));for(var e=0,r=t._deferreds.length;e<r;e++)A(t,t._deferreds[e]);t._deferreds=null}function R(t,e,r){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=r}function S(t,e){var r=!1;try{t((function(t){r||(r=!0,F(e,t))}),(function(t){r||(r=!0,w(e,t))}))}catch(t){if(r)return;r=!0,w(e,t)}}b.prototype.catch=function(t){return this.then(null,t)},b.prototype.then=function(t,e){var r=new this.constructor(M);return A(this,new R(t,e,r)),r},b.prototype.finally=function(t){var e=this.constructor;return this.then((function(r){return e.resolve(t()).then((function(){return r}))}),(function(r){return e.resolve(t()).then((function(){return e.reject(r)}))}))},b.all=function(t){return new b((function(e,r){if(!U(t))return r(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(t);if(0===i.length)return e([]);var n=i.length;function o(t,s){try{if(s&&("object"==typeof s||"function"==typeof s)){var a=s.then;if("function"==typeof a)return void a.call(s,(function(e){o(t,e)}),r)}i[t]=s,0==--n&&e(i)}catch(t){r(t)}}for(var s=0;s<i.length;s++)o(s,i[s])}))},b.allSettled=function(t){return new this((function(e,r){if(!t||void 0===t.length)return r(new TypeError(typeof t+" "+t+" is not iterable(cannot read property Symbol(Symbol.iterator))"));var i=Array.prototype.slice.call(t);if(0===i.length)return e([]);var n=i.length;function o(t,r){if(r&&("object"==typeof r||"function"==typeof r)){var s=r.then;if("function"==typeof s)return void s.call(r,(function(e){o(t,e)}),(function(r){i[t]={status:"rejected",reason:r},0==--n&&e(i)}))}i[t]={status:"fulfilled",value:r},0==--n&&e(i)}for(var s=0;s<i.length;s++)o(s,i[s])}))},b.resolve=function(t){return t&&"object"==typeof t&&t.constructor===b?t:new b((function(e){e(t)}))},b.reject=function(t){return new b((function(e,r){r(t)}))},b.race=function(t){return new b((function(e,r){if(!U(t))return r(new TypeError("Promise.race accepts an array"));for(var i=0,n=t.length;i<n;i++)b.resolve(t[i]).then(e,r)}))},b._immediateFn="function"==typeof setImmediate&&function(t){setImmediate(t)}||function(t){E(t,0)},b._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)};var P,O=function(){function t(){}return t.fetch=function(t){return new Promise((function(e,r){var i=new XMLHttpRequest;i.onload=function(){e(i.response||i.responseText)},i.onerror=function(e){console.log("Common.error",e),r(new Error("Network request failed for url "+t))},i.ontimeout=function(e){r(new Error("Network request failed for url "+t))},i.onabort=function(){r(new Error("Aborted"))},i.open("GET",t,!0),i.send(null)}))},t.getResource=function(e,r){return void 0===r&&(r=""),-1===e.indexOf(":/")?t.join(r,e):e},t.join=function(){for(var e=[],r=arguments.length,i=new Array(r),n=0;n<r;n++)i[n]=arguments[n];return i.forEach((function(r){0===r.indexOf("/")&&(e=[]),t.comps(r).forEach((function(t){switch(t){case".":break;case"..":e.pop();break;default:e.push(t)}}))})),e.join("/")},t.dirname=function(e){var r=t.comps(e);return r.pop(),r.join("/")},t.comps=function(t){return t.replace(/\/$/,"").split(/\/+/)},t}();!function(t){t[t.None=0]="None",t[t.Error=1]="Error",t[t.Warn=2]="Warn",t[t.Log=3]="Log"}(P||(P={}));var B,D,C,I=function(){function t(){}return t.log=function(){var e;t.enabled&&t.level>=P.Log&&(e=console).log.apply(e,arguments)},t.warn=function(){var e;t.enabled&&t.level>=P.Warn&&(e=console).warn.apply(e,arguments)},t.error=function(){var e;t.enabled&&t.level>=P.Error&&(e=console).error.apply(e,arguments)},t}();I.level=P.Warn,I.enabled=!0,(B=t.ContextVersion||(t.ContextVersion={})).WebGl="webgl",B.WebGl2="webgl2",function(t){t.LowP="lowp",t.MediumP="mediump",t.HighP="highp"}(D||(D={})),function(t){t.Flat="flat",t.Box="box",t.Sphere="sphere",t.Torus="torus",t.Mesh="mesh"}(C||(C={}));var G,k={webgl:{flat:{vertex:l,fragment:m},mesh:{vertex:l,fragment:p}},webgl2:{flat:{vertex:d,fragment:v},mesh:{vertex:d,fragment:g}}};(G=t.ContextError||(t.ContextError={}))[G.BrowserSupport=1]="BrowserSupport",G[G.Other=2]="Other";var W=function(){},V=function(){function e(){}return e.getContext_=function(t,e){for(var r=["webgl","experimental-webgl"],i=null,n=0;n<r.length;++n)try{i=t.getContext(r[n],e)}catch(t){if(i)break}return i},e.getContext2_=function(t,e){var r=null;try{r=t.getContext("webgl2",e)}catch(t){}return r},e.getFragmentVertex=function(r,i){var n;if(i){var o=e.inferVersion(i);o===t.ContextVersion.WebGl2&&(i=i.replace(/^\#version\s*300\s*es.*?\n/,""));null!==/(?:^\s*)((?:#if|#elif)(?:\s*)(defined\s*\(\s*VERTEX)(?:\s*\))|(?:#ifdef)(?:\s*VERTEX)(?:\s*))/gm.exec(i)&&(n=o===t.ContextVersion.WebGl2?"#version 300 es\n#define VERTEX\n"+i:"#define VERTEX\n"+i)}return n},e.getIncludes=function(t,r){if(void 0===r&&(r=""),void 0===t)return Promise.resolve(t);for(var i,n=/#include\s*['|"](.*.glsl)['|"]/gm,o=[],s=0,a=function(){o.push(Promise.resolve(t.slice(s,i.index))),s=i.index+i[0].length;var n=i[1],a=O.getResource(n,r),u=-1===n.indexOf(":/")?O.dirname(a):"";o.push(O.fetch(a).then((function(t){return e.getIncludes(t,u)})))};null!==(i=n.exec(t));)a();return o.push(Promise.resolve(t.slice(s))),Promise.all(o).then((function(t){return t.join("")}))},e.isWebGl=function(t){return t instanceof WebGLRenderingContext},e.isWebGl2=function(t){return window.WebGL2RenderingContext&&t instanceof WebGL2RenderingContext},e.inferVersion=function(e,r){var i=e||r;return i&&0===i.indexOf("#version 300 es")?t.ContextVersion.WebGl2:t.ContextVersion.WebGl},e.inferPrecision=function(t){var r=t.match(/precision\s+(.+)\s+float/);return r&&r.length>1&&(e.precision=r[1]),e.precision},e.versionDiffers=function(r,i,n){if(r){var o=this.isWebGl2(r)?t.ContextVersion.WebGl2:t.ContextVersion.WebGl;return e.inferVersion(i,n)!==o}return!1},e.getBufferVertex=function(t){return this.isWebGl2(t)?y:_},e.getVertex=function(t,e,r){if(void 0===r&&(r=C.Flat),t)return t;var i=this.inferVersion(t,e);return k[i][r===C.Flat?"flat":"mesh"].vertex},e.getFragment=function(t,e,r){if(void 0===r&&(r=C.Flat),e)return e;var i=this.inferVersion(t,e);return k[i][r===C.Flat?"flat":"mesh"].fragment},e.tryInferContext=function(r,i,n,o,s,a){function u(t,e){if("function"==typeof a)a(t);else{var r=n.parentNode;r&&(r.innerHTML='<div class="glsl-canvas--error">'+e+"</div>")}}if(void 0===s&&(s=[]),!WebGLRenderingContext)return u(t.ContextError.BrowserSupport,'This page requires a browser that supports WebGL.<br/>\n\t\t\t<a href="http://get.webgl.org">Click here to upgrade your browser.</a>'),null;var h=e.inferContext(r,i,n,o);if(h){this.isWebGl2(h)||-1!==s.indexOf("OES_standard_derivatives")||s.push("OES_standard_derivatives");var f=h.getSupportedExtensions();s.forEach((function(t){-1!==f.indexOf(t)?h.getExtension(t):I.warn("GlslCanvas "+t+" not supported")}))}else u(t.ContextError.Other,'It does not appear your computer can support WebGL.<br/>\n\t\t\t<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>');return h},e.tryGetContext=function(r,i,n){function o(t,e){if("function"==typeof n)n(t);else{var i=r.parentNode;i&&(i.innerHTML='<div class="glsl-canvas--error">'+e+"</div>")}}if(!WebGLRenderingContext)return o(t.ContextError.BrowserSupport,'This page requires a browser that supports WebGL.<br/>\n\t\t\t<a href="http://get.webgl.org">Click here to upgrade your browser.</a>'),null;var s=e.getContext_(r,i);return s?s.getExtension("OES_standard_derivatives"):o(t.ContextError.Other,'It does not appear your computer can support WebGL.<br/>\n\t\t\t<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>'),s},e.inferContext=function(e,r,i,n){return this.inferVersion(e,r)===t.ContextVersion.WebGl2?this.getContext2_(i,n):this.getContext_(i,n)},e.createShader=function(t,r,i,n){void 0===n&&(n=0);var o=t.createShader(i);if(r=r.replace(/precision\s+(.+)\s+float/,"precision "+e.precision+" float"),t.shaderSource(o,r),t.compileShader(o),!t.getShaderParameter(o,t.COMPILE_STATUS))throw e.lastError=t.getShaderInfoLog(o),I.error("*** Error compiling shader: "+e.lastError),t.deleteShader(o),{shader:o,source:r,type:i,error:e.lastError,offset:n};return o},e.createProgram=function(t,r,i,n){for(var o=t.createProgram(),s=0;s<r.length;++s)t.attachShader(o,r[s]);if(i&&n)for(var a=0;a<i.length;++a)t.bindAttribLocation(o,n?n[a]:a,i[a]);return t.linkProgram(o),t.validateProgram(o),t.getProgramParameter(o,t.LINK_STATUS)?(t.useProgram(o),o):(e.lastError=t.getProgramInfoLog(o),I.error("Error in program linking: "+e.lastError),t.deleteProgram(o),null)},e.createVertexBuffers=function(t,e){var r=new W,i=t.getAttribLocation(e,"a_texcoord");r.texcoord=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,r.texcoord),t.bufferData(t.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(i),t.vertexAttribPointer(i,2,t.FLOAT,!1,0,0);var n=t.getAttribLocation(e,"a_position");return r.position=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,r.position),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(n),t.vertexAttribPointer(n,2,t.FLOAT,!1,0,0),r},e}();V.precision=D.MediumP,V.lastError="";var N,z=function(){},X=function(){function t(){this.values=new z}var e=t.prototype;return e.has=function(t){return t in this.values},e.set=function(t,e){this.values[t]=e},e.get=function(t){return this.values[t]},e.forEach=function(t){var e=this,r=0;Object.keys(this.values).forEach((function(i){t(e.values[i],r,e.values),r++}))},e.reduce=function(t,e){var r=this,i=e,n=0;return Object.keys(this.values).forEach((function(e){i=t(i,r.values[e],n,r.values),n++})),i},t}(),j=function(){function t(t){t&&(Object.assign(this,t),this.positions&&(this.size=this.positions.length/3))}var e=t.prototype;return e.create=function(t,e){this.createData_(),this.createAttributes_(t,e)},e.createBufferData_=function(t,e,r){var i=t.createBuffer();return t.bindBuffer(e,i),t.bufferData(e,r,t.STATIC_DRAW),i},e.createAttribLocation_=function(t,e,r,i,n){var o=t.getAttribLocation(e,r);return t.enableVertexAttribArray(o),t.vertexAttribPointer(o,i,n,!1,0,0),o},e.createAttributes_=function(t,e){this.positions&&(this.positionBuffer=this.createBufferData_(t,t.ARRAY_BUFFER,new Float32Array(this.positions)),this.positionLocation=this.createAttribLocation_(t,e,"a_position",this.positions.length/this.size,t.FLOAT),t.bindAttribLocation(e,this.positionLocation,"a_position")),this.texcoords&&(this.texcoordBuffer=this.createBufferData_(t,t.ARRAY_BUFFER,new Float32Array(this.texcoords)),this.texcoordLocation=this.createAttribLocation_(t,e,"a_texcoord",this.texcoords.length/this.size,t.FLOAT),t.bindAttribLocation(e,this.texcoordLocation,"a_texcoord")),this.normals&&(this.normalBuffer=this.createBufferData_(t,t.ARRAY_BUFFER,new Float32Array(this.normals)),this.normalLocation=this.createAttribLocation_(t,e,"a_normal",this.normals.length/this.size,t.FLOAT),t.bindAttribLocation(e,this.normalLocation,"a_normal")),this.colors&&(this.colorBuffer=this.createBufferData_(t,t.ARRAY_BUFFER,new Float32Array(this.colors)),this.colorLocation=this.createAttribLocation_(t,e,"a_color",this.colors.length/this.size,t.FLOAT),t.bindAttribLocation(e,this.colorLocation,"a_color"))},e.attachAttributes_=function(t,e){var r;this.positions&&(r=t.getAttribLocation(e,"a_position"),t.enableVertexAttribArray(r),t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(r,this.positions.length/this.size,t.FLOAT,!1,0,0)),this.texcoords&&(r=t.getAttribLocation(e,"a_texcoord"),t.enableVertexAttribArray(this.texcoordLocation),t.bindBuffer(t.ARRAY_BUFFER,this.texcoordBuffer),t.vertexAttribPointer(this.texcoordLocation,this.texcoords.length/this.size,t.FLOAT,!1,0,0)),this.normals&&(r=t.getAttribLocation(e,"a_normal"),t.enableVertexAttribArray(this.normalLocation),t.bindBuffer(t.ARRAY_BUFFER,this.normalBuffer),t.vertexAttribPointer(this.normalLocation,this.normals.length/this.size,t.FLOAT,!1,0,0)),this.colors&&(r=t.getAttribLocation(e,"a_color"),t.enableVertexAttribArray(this.colorLocation),t.bindBuffer(t.ARRAY_BUFFER,this.colorBuffer),t.vertexAttribPointer(this.colorLocation,this.colors.length/this.size,t.FLOAT,!1,0,0))},e.bindAttributes_=function(t,e){this.positions&&t.bindAttribLocation(e,this.positionLocation,"a_position"),this.texcoords&&t.bindAttribLocation(e,this.texcoordLocation,"a_texcoord"),this.normals&&t.bindAttribLocation(e,this.normalLocation,"a_normal"),this.colors&&t.bindAttribLocation(e,this.colorLocation,"a_color")},e.createData_=function(){this.positions=[],this.normals=[],this.texcoords=[],this.colors=[],this.size=0},t.fromIndices=function(t,e,r){var i=[];return t.forEach((function(t){i.push.apply(i,e.slice(t*r,t*r+r))})),i},t}(),H=function(t){function e(){return t.apply(this,arguments)||this}return r(e,t),e.prototype.createData_=function(){this.size=6,this.positions=[-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0],this.texcoords=[0,0,1,0,1,1,0,0,1,1,0,1],this.normals=[0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],this.colors=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]},e}(j);(N=t.BufferFloatType||(t.BufferFloatType={}))[N.FLOAT=0]="FLOAT",N[N.HALF_FLOAT=1]="HALF_FLOAT";var Y=function(){function e(t,r,i,n){var o=t.createFramebuffer(),s=e.getTexture(t,r,i,n);t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.texture=s,this.buffer=o,this.BW=r,this.BH=i,this.index=n}return e.getFloatType=function(t){return V.isWebGl2(t)&&t.getExtension("EXT_color_buffer_float")||t.getExtension("OES_texture_float")?t.FLOAT:null},e.getHalfFloatType=function(t){var e;return V.isWebGl2(t)&&(e=t.getExtension("EXT_color_buffer_half_float")||t.getExtension("EXT_color_buffer_float"))?t.HALF_FLOAT:(e=t.getExtension("OES_texture_half_float"))&&e.HALF_FLOAT_OES||null},e.getInternalFormat=function(t){return V.isWebGl2(t)?t.RGBA16F:t.RGBA},e.getType=function(r){return e.type===t.BufferFloatType.HALF_FLOAT?e.getHalfFloatType(r)||(e.type=t.BufferFloatType.FLOAT,e.getType(r)):e.getFloatType(r)||(e.type=t.BufferFloatType.HALF_FLOAT,e.getType(r))},e.getTexture=function(r,i,n,o){var s=e.getInternalFormat(r),a=r.RGBA,u=e.getType(r),h=r.createTexture();return r.activeTexture(r.TEXTURE0+o),r.bindTexture(r.TEXTURE_2D,h),r.texImage2D(r.TEXTURE_2D,0,s,i,n,0,a,u,null),r.checkFramebufferStatus(r.FRAMEBUFFER)!==r.FRAMEBUFFER_COMPLETE?(e.type===t.BufferFloatType.FLOAT?e.type=t.BufferFloatType.HALF_FLOAT:e.type=t.BufferFloatType.FLOAT,e.getTexture(r,i,n,o)):h},e.prototype.resize=function(t,r,i){if(r!==this.BW||i!==this.BH){var n=this.buffer,o=this.texture,s=this.index;t.bindFramebuffer(t.FRAMEBUFFER,n);var a,u=t.checkFramebufferStatus(t.FRAMEBUFFER),h=Math.min(r,this.BW),f=Math.min(i,this.BH),c=e.getType(t);u===t.FRAMEBUFFER_COMPLETE&&(a=new Float32Array(h*f*4),t.readPixels(0,0,h,f,t.RGBA,c,a)),t.bindFramebuffer(t.FRAMEBUFFER,null);var l=s+1,d=e.getTexture(t,r,i,l);c=e.getType(t),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),a&&t.texSubImage2D(t.TEXTURE_2D,0,0,0,h,f,t.RGBA,c,a);var m=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,null),t.deleteTexture(o),t.activeTexture(t.TEXTURE0+s),t.bindTexture(t.TEXTURE_2D,d),this.index=s,this.texture=d,this.buffer=m,this.BW=r,this.BH=i}},e}();Y.type=t.BufferFloatType.HALF_FLOAT;var q=function(){function t(t,e,r,i){this.isValid=!1,this.index=t,this.key=e,this.vertexString=r,this.fragmentString=i,this.geometry=new H}var e=t.prototype;return e.create=function(t,e,r){var i=V.createShader(t,this.vertexString,t.VERTEX_SHADER),n=V.createShader(t,this.fragmentString,t.FRAGMENT_SHADER,1);n?this.isValid=!0:(n=V.createShader(t,V.isWebGl2(t)?T:x,t.FRAGMENT_SHADER),this.isValid=!1);var o=V.createProgram(t,[i,n]);if(!o)return this.isValid=!1,t.deleteShader(i),void t.deleteShader(n);this.geometry.create(t,o),t.deleteShader(i),t.deleteShader(n);var s=new Y(t,e,r,this.index+0),a=new Y(t,e,r,this.index+2);this.program=o,this.input=s,this.output=a},e.render=function(t,e,r){t.useProgram(this.program),t.bindFramebuffer(t.FRAMEBUFFER,this.output.buffer),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,this.output.texture,0),t.checkFramebufferStatus(t.FRAMEBUFFER)===t.FRAMEBUFFER_COMPLETE&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT)),t.viewport(0,0,e,r),t.drawArrays(t.TRIANGLES,0,this.geometry.size);var i=this.input;this.input=this.output,this.output=i},e.resize=function(t,e,r){t.useProgram(this.program),t.viewport(0,0,e,r),this.input.resize(t,e,r),this.output.resize(t,e,r)},e.destroy=function(t){t.deleteProgram(this.program),this.program=null,this.input=null,this.output=null},t}(),K=function(t){function i(){return t.apply(this,arguments)||this}var n,o,s;return r(i,t),i.getBuffers=function(t,e,r){var n=new i,o=0;if(e){V.isWebGl2(t)&&(e=e.replace(/^\#version\s*300\s*es\s*\n/,""));for(var s,a=/(?:^\s*)((?:#if|#elif)(?:\s*)(defined\s*\(\s*BUFFER_)(\d+)(?:\s*\))|(?:#ifdef)(?:\s*BUFFER_)(\d+)(?:\s*))/gm;null!==(s=a.exec(e));){var u=s[3]||s[4],h="u_buffer"+u,f=V.isWebGl2(t)?"#version 300 es\n#define BUFFER_"+u+"\n"+e:"#define BUFFER_"+u+"\n"+e,c=new q(o,h,r,f);if(c.create(t,t.drawingBufferWidth,t.drawingBufferHeight),!c.program)throw"buffer error "+h;n.set(h,c),o+=4}}return n},n=i,(o=[{key:"count",get:function(){return 4*Object.keys(this.values).length}}])&&e(n.prototype,o),s&&e(n,s),i}(X),$=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.isVector2=!0,this.x=t,this.y=e}var e=t.prototype;return e.copy=function(t){return this.x=t.x,this.y=t.y,this},e.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},e.normalize=function(){return this.divideScalar(this.length()||1)},e.divideScalar=function(t){return this.multiplyScalar(1/t)},e.multiplyScalar=function(t){return this.x*=t,this.y*=t,this},e.subVectors=function(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this},e.addVectors=function(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this},t}(),J=function(){function t(t,e,r){void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0),this.isVector3=!0,this.x=t,this.y=e,this.z=r}var e=t.prototype;return e.copy=function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this},e.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},e.normalize=function(){return this.divideScalar(this.length()||1)},e.divideScalar=function(t){return this.multiplyScalar(1/t)},e.multiplyScalar=function(t){return this.x*=t,this.y*=t,this.z*=t,this},e.subVectors=function(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this},e.addVectors=function(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this},e.crossVectors=function(t,e){var r=t.x,i=t.y,n=t.z,o=e.x,s=e.y,a=e.z;return this.x=i*a-n*s,this.y=n*o-r*a,this.z=r*s-i*o,this},t}(),Q=Math.PI/180,Z=function(t){function e(e,r,i){var n;return(n=t.call(this)||this).position=new J,n.value=new Float32Array([0,0,0]),n.mouse=null,n.dirty=!1,n.theta=(e||0)*Q,n.phi=(r||0)*Q,n.radius=i||6,n}r(e,t);var i=e.prototype;return i.down=function(t,e){this.mouse=new $(t,e)},i.move=function(t,e){var r=this.mouse;if(r&&(r.x!==t||r.y!==e)){var i=180*(t-r.x)*Q,n=180*(e-r.y)*Q;r.x=t,r.y=e,this.theta+=i,this.phi=Math.max(-60*Q,Math.min(60*Q,this.phi+n))}},i.up=function(){this.mouse=null},i.wheel=function(t){this.radius=Math.max(4,Math.min(10,this.radius+.02*t))},e.fromVector=function(t){var r=t.length();return new e(Math.acos(t.y/r),Math.atan(t.x/t.z),r)},e.toArray=function(t){var e=Math.sin(t.phi)*t.radius;return[e*Math.sin(t.theta),Math.cos(t.phi)*t.radius,e*Math.cos(t.theta)]},e}(J),tt="undefined"!=typeof Float32Array?Float32Array:Array;function et(){var t=new tt(16);return tt!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function rt(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function it(t,e,r,i){var n,o,s,a,u,h,f,c,l,d,m,v,p,g,_,y,x,T,E,U,M,b,A,F,w=i[0],L=i[1],R=i[2],S=Math.hypot(w,L,R);return S<1e-6?null:(w*=S=1/S,L*=S,R*=S,n=Math.sin(r),s=1-(o=Math.cos(r)),a=e[0],u=e[1],h=e[2],f=e[3],c=e[4],l=e[5],d=e[6],m=e[7],v=e[8],p=e[9],g=e[10],_=e[11],y=w*w*s+o,x=L*w*s+R*n,T=R*w*s-L*n,E=w*L*s-R*n,U=L*L*s+o,M=R*L*s+w*n,b=w*R*s+L*n,A=L*R*s-w*n,F=R*R*s+o,t[0]=a*y+c*x+v*T,t[1]=u*y+l*x+p*T,t[2]=h*y+d*x+g*T,t[3]=f*y+m*x+_*T,t[4]=a*E+c*U+v*M,t[5]=u*E+l*U+p*M,t[6]=h*E+d*U+g*M,t[7]=f*E+m*U+_*M,t[8]=a*b+c*A+v*F,t[9]=u*b+l*A+p*F,t[10]=h*b+d*A+g*F,t[11]=f*b+m*A+_*F,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});var nt,ot,st=function(){function t(){this.delay=0,this.current=0,this.delta=0,this.paused=!1,this.start=this.previous=this.now()}var e=t.prototype;return e.now=function(){return performance.now()},e.play=function(){if(this.previous){var t=this.now();this.delay+=t-this.previous,this.previous=t}this.paused=!1},e.pause=function(){this.paused=!0},e.next=function(){var t=this.now();return this.delta=t-this.previous,this.current=t-this.start-this.delay,this.previous=t,this},t}(),at=function(t,e){this.event=t,this.callback=e},ut=function(){function t(){this.listeners=new Set}var e=t.prototype;return e.logListeners=function(){this.listeners.forEach((function(t){return I.log(t)}))},e.subscribe=function(t){this.listeners.add(t)},e.unsubscribe=function(t){this.listeners.delete(t)},e.unsubscribeAll=function(){this.listeners.clear()},e.on=function(t,e){return this.listeners.add(new at(t,e)),this},e.off=function(t,e){var r=this;return e?this.listeners.delete(new at(t,e)):this.listeners.forEach((function(e){e.event===t&&r.listeners.delete(e)})),this},e.trigger=function(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];return this.listeners.forEach((function(e){e.event===t&&"function"==typeof e.callback&&e.callback.apply(e,r)})),this},t}(),ht=function(t){function e(){return t.apply(this,arguments)||this}return r(e,t),e.prototype.createData_=function(){this.size=36,this.positions=[-1,-1,1,1,-1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,-1,-1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,-1,1,-1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,-1,-1,-1,1,1,-1,1,-1],this.texcoords=[0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1],this.normals=[0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0];for(var t=[[1,1,1,1],[1,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,1],[1,0,1,1]],e=[],r=0;r<t.length;++r){var i=t[r];e=e.concat(i,i,i,i,i,i)}this.colors=e},e}(j),ft=function(t){function e(){return t.apply(this,arguments)||this}return r(e,t),e.prototype.createData_=function(){var t,e,r=2*Math.PI,i=Math.PI,n=new J,o=new J,s=[],a=[],u=[],h=[],f=[],c=Math.min(0+i,Math.PI),l=0,d=[];for(e=0;e<=60;e++){var m=[],v=e/60,p=0;for(0==e?p=.5/80:60==e&&c==Math.PI&&(p=-.5/80),t=0;t<=80;t++){var g=t/80;n.x=-1.4*Math.cos(0+g*r)*Math.sin(0+v*i),n.y=1.4*Math.cos(0+v*i),n.z=1.4*Math.sin(0+g*r)*Math.sin(0+v*i),a.push(n.x,n.y,n.z),o.copy(n).normalize(),u.push(o.x,o.y,o.z);var _=g+p,y=1-v;h.push(_,y),f.push(1,1,1,1),m.push(l++)}d.push(m)}for(e=0;e<60;e++)for(t=0;t<80;t++){var x=d[e][t+1],T=d[e][t],E=d[e+1][t],U=d[e+1][t+1];0!==e&&s.push(x,T,U),(59!==e||c<Math.PI)&&s.push(T,E,U)}this.size=s.length,this.positions=j.fromIndices(s,a,3),this.texcoords=j.fromIndices(s,h,2),this.normals=j.fromIndices(s,u,3),this.colors=j.fromIndices(s,f,4)},e}(j),ct=function(t){function e(){return t.apply(this,arguments)||this}r(e,t);var i=e.prototype;return i.createData_=function(){for(var t=200,e=40,r=[],i=[],n=[],o=[],s=[],a=new J,u=new J,h=new J,f=new J,c=new J,l=new J,d=new J,m=0;m<=t;++m){var v=m/t*2*Math.PI*2;this.calculatePositionOnCurve(v,2,3,1,h),this.calculatePositionOnCurve(v+.01,2,3,1,f),l.subVectors(f,h),d.addVectors(f,h),c.crossVectors(l,d),d.crossVectors(c,l),c.normalize(),d.normalize();for(var p=0;p<=e;++p){var g=p/e*Math.PI*2,_=-.25*Math.cos(g),y=.25*Math.sin(g);a.x=h.x+(_*d.x+y*c.x),a.y=h.y+(_*d.y+y*c.y),a.z=h.z+(_*d.z+y*c.z),i.push(a.x,a.y,a.z),u.subVectors(a,h).normalize(),n.push(u.x,u.y,u.z),o.push(m/t*2*Math.round(3)),o.push(p/e),s.push(1,1,1,1)}}for(var x=1;x<=t;x++)for(var T=1;T<=e;T++){var E=41*(x-1)+(T-1),U=41*x+(T-1),M=41*x+T,b=41*(x-1)+T;r.push(E,U,b),r.push(U,M,b)}this.size=r.length,this.positions=j.fromIndices(r,i,3),this.texcoords=j.fromIndices(r,o,2),this.normals=j.fromIndices(r,n,3),this.colors=j.fromIndices(r,s,4)},i.calculatePositionOnCurve=function(t,e,r,i,n){var o=Math.cos(t),s=Math.sin(t),a=r/e*t,u=Math.cos(a);n.x=i*(2+u)*.5*o,n.y=i*(2+u)*s*.5,n.z=i*Math.sin(a)*.5},e}(j),lt=[[1,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[0,1,1]],dt=0,mt=function(){function t(){}var e=t.prototype;return e.load=function(t){var e=this;return new Promise((function(r,i){O.fetch(t).then((function(n){var o=e.parse(n);if(o.positions.length){var s=new j(o);r(s)}else i("ObjLoader error: empty positions "+t)}),(function(e){console.log("ObjLoader error:",e,t),i(e)}))}))},e.parseIndices=function(t,e,r,i,n,o){for(var s=0;s<=t.length-3;){var a=void 0,u=void 0,h=void 0;0===s?(a=s,u=s+1,h=s+2):(a=s-1,u=s+1,h=s+2),s++;for(var f=[a,u,h],c=0;c<f.length;c++){var l=t[f[c]][e],d=void 0;l&&NaN!==l&&(d=i[l-1])&&(d=d.slice(0,r),n.push.apply(n,d))}}},e.parseFaces=function(t,e,r,i,n,o,s,a){var u=this,h=n.length;t.forEach((function(t){u.parseIndices(t,0,3,e,n,"positions"),u.parseIndices(t,2,3,r,o,"normals"),u.parseIndices(t,1,2,i,s,"texcoords")}));var f=n.length-h;f>0&&(new Array(f/3).fill(0).forEach((function(){var t=lt[dt%lt.length];a.push(t[0],t[1],t[2],1)})),dt++)},e.parse=function(t){var e=this,r=[],i=[],n=[],o=[];dt=0;var s=[],a=[],u=[],h=[];-1!==t.indexOf("\r\n")&&(t=t.replace(/\r\n/g,"\n")),(t=t.replace(/  /g," ")).split("\n").forEach((function(t,f){if(0===t.indexOf("v ")){h.length&&(e.parseFaces(h,s,a,u,r,i,n,o),h=[]);var c=t.replace("v","").trim().split(" ").map((function(t){return parseFloat(t)}));s.push(c)}else if(0===t.indexOf("vn ")){var l=t.replace("vn","").trim().split(" ").map((function(t){return parseFloat(t)})),d=new J(l[0],l[1],l[2]).normalize();a.push([d.x,d.y,d.z])}else if(0===t.indexOf("vt ")){var m=t.replace("vt","").trim().split(" ").map((function(t){return parseFloat(t)}));u.push(m)}else if(0===t.indexOf("f ")){var v=t.replace("f","").trim().split(" ").map((function(t){var e=t.split("/").map((function(t){return parseInt(t)}));return 2===e.length&&e.push(null),e}));h[h.length]=v}})),h.length&&this.parseFaces(h,s,a,u,r,i,n,o);for(var f={min:new J(Number.POSITIVE_INFINITY),max:new J(Number.NEGATIVE_INFINITY)},c=0;c<r.length;c+=3)f.min.x=Math.min(f.min.x,r[c]),f.min.y=Math.min(f.min.y,r[c+1]),f.min.z=Math.min(f.min.z,r[c+2]),f.max.x=Math.max(f.max.x,r[c]),f.max.y=Math.max(f.max.y,r[c+1]),f.max.z=Math.max(f.max.z,r[c+2]);for(var l=-(f.min.x+f.max.x)/2,d=-(f.min.y+f.max.y)/2,m=-(f.min.z+f.max.z)/2,v=0;v<r.length;v+=3)r[v]+=l,r[v+1]+=d,r[v+2]+=m;var p=r.reduce((function(t,e){return Math.max(t,e)}),0);return r.forEach((function(t,e){return r[e]=t/p*2})),i.length||(i=r.slice()),n.length||(n=this.unrapUvw(r)),{positions:r,normals:i,texcoords:n,colors:o}},e.unrapUvw=function(t){for(var e=[],r=0;r<t.length;r+=3){var i=new J(t[r],t[r+1],t[r+2]);i.normalize();var n=Math.asin(-i.y),o=Math.atan2(i.x,i.z),s=.5+n/Math.PI,a=.5+o/(2*Math.PI);e.push(s,a)}return e},t}(),vt=["jpg","jpeg","png"],pt=["ogv","webm","mp4"],gt=vt.concat(pt);function _t(t){return"data"in t&&"width"in t&&"height"in t}(nt=t.TextureSourceType||(t.TextureSourceType={}))[nt.Data=0]="Data",nt[nt.Element=1]="Element",nt[nt.Url=2]="Url",(ot=t.TextureFilteringType||(t.TextureFilteringType={})).MipMap="mipmap",ot.Linear="linear",ot.Nearest="nearest";var yt,xt,Tt=function(e){function i(r,i,n,o,s){var a;return void 0===o&&(o={filtering:t.TextureFilteringType.Linear}),(a=e.call(this)||this).valid=!1,a.dirty=!1,a.animated=!1,a.powerOf2=!1,a.key=i,a.index=n,a.options=o,a.workpath=s,a.create(r),a}r(i,e),i.isPowerOf2=function(t){return 0==(t&t-1)},i.isSafari=function(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)},i.isTextureUrl=function(t){return t&&/\.(jpg|jpeg|png|ogv|webm|mp4)$/i.test(t.split("?")[0])},i.isTexture=function(t){return void 0!==i.getTextureOptions(t)},i.getMaxTextureSize=function(t){return t.getParameter(t.MAX_TEXTURE_SIZE)},i.getTextureOptions=function(t,e){if(void 0===e&&(e={}),"string"==typeof t&&""!==t){if(i.isTextureUrl(t))return e.url=t,-1!==t.indexOf("?")&&(e=t.split("?")[1].split("&").reduce((function(t,e){var r=e.split("="),i=decodeURIComponent(r[0]),n=decodeURIComponent(r[1]);switch(i){case"filtering":t[i]=n;break;case"repeat":case"UNPACK_FLIP_Y_WEBGL":t[i]=Boolean(n);break;case"UNPACK_PREMULTIPLY_ALPHA_WEBGL":case"TEXTURE_WRAP_S":case"TEXTURE_WRAP_T":t[i]=Number(n)}return t}),e)),e;document&&(t=document.querySelector(t))}return t instanceof HTMLCanvasElement||t instanceof HTMLImageElement||t instanceof HTMLVideoElement?(e.element=t,e):_t(t)?(e.data=t.data,e.width=t.width,e.height=t.height,e):null};var n=i.prototype;return n.create=function(t){this.texture=t.createTexture(),this.texture&&(this.valid=!0),this.setData(t,1,1,new Uint8Array([0,0,0,0]),this.options)},n.load=function(t,e){return void 0===e&&(e={}),this.options=e,"string"==typeof e.url?void 0===this.url||e.url!==this.url?this.setUrl(t,e.url,e):Promise.resolve(this):e.element?this.setElement(t,e.element,e):e.data&&e.width&&e.height?this.setData(t,e.width,e.height,e.data,e):Promise.reject(this)},n.setUrl=function(e,r,n){if(void 0===n&&(n={}),!this.valid)return Promise.reject(this);this.url=r,this.source=r,this.sourceType=t.TextureSourceType.Url,this.options=Object.assign(this.options,n);var o,s,a=r.split("?")[0].split(".").pop().toLowerCase(),u=-1!==pt.indexOf(a),h=O.getResource(r,this.workpath);return u?(I.log("GlslCanvas.setUrl video",h),(o=document.createElement("video")).setAttribute("preload","auto"),o.setAttribute("loop","true"),o.setAttribute("muted","true"),o.setAttribute("playsinline","true"),o.loop=!0,o.muted=!0,s=this.setElement(e,o,n),o.src=h,o.addEventListener("canplay",(function(){o.play()}))):(I.log("GlslCanvas.setUrl image",h),o=document.createElement("img"),s=this.setElement(e,o,n),i.isSafari()&&"data:"===r.slice(0,5)||(o.crossOrigin="anonymous"),o.src=h),s},n.setElement=function(e,r,i){var n=this;return void 0===i&&(i={}),i=this.options=Object.assign(this.options,i),new Promise((function(o,s){var a=r;if("string"==typeof r&&(r=document.querySelector(r)),r instanceof HTMLCanvasElement||r instanceof HTMLImageElement||r instanceof HTMLVideoElement)if(n.source=r,n.sourceType=t.TextureSourceType.Element,r instanceof HTMLVideoElement){var u=r;u.addEventListener("loadeddata",(function(t){n.update(e,i),n.setFiltering(e,i),o(n)})),u.addEventListener("error",(function(t){s(t)})),u.load()}else r instanceof HTMLImageElement?(r.addEventListener("load",(function(){n.update(e,i),n.setFiltering(e,i),o(n)})),r.addEventListener("error",(function(t){s(t)}))):(n.update(e,i),n.setFiltering(e,i),o(n));else{var h="the 'element' parameter (`element: "+JSON.stringify(a)+"`) must be a CSS selector string, or a <canvas>, <image> or <video> object";I.log("Texture '"+n.key+"': "+h,i),s(h)}}))},n.setData=function(e,r,i,n,o){return void 0===o&&(o={}),this.width=r,this.height=i,this.options=Object.assign(this.options,o),this.source=n,this.sourceType=t.TextureSourceType.Data,this.update(e,o),this.setFiltering(e,o),Promise.resolve(this)},n.update=function(e,r){if(this.valid){if(e.activeTexture(e.TEXTURE0+this.index),e.bindTexture(e.TEXTURE_2D,this.texture),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1===r.UNPACK_FLIP_Y_WEBGL?0:1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.UNPACK_PREMULTIPLY_ALPHA_WEBGL||0),this.sourceType===t.TextureSourceType.Element)this.source instanceof HTMLImageElement&&this.source.naturalWidth&&this.source.naturalHeight?(this.width=this.source.naturalWidth,this.height=this.source.naturalHeight,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.source)):this.source instanceof HTMLVideoElement&&this.source.videoWidth&&this.source.videoHeight?(this.width=this.source.videoWidth,this.height=this.source.videoHeight,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.source)):this.source instanceof HTMLCanvasElement&&(this.width=this.source.width,this.height=this.source.height,e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,this.source));else if(this.sourceType===t.TextureSourceType.Data){var i=this.source;e.texImage2D(e.TEXTURE_2D,0,e.RGBA,this.width,this.height,0,e.RGBA,e.UNSIGNED_BYTE,i)}this.trigger("loaded",this)}},n.tryUpdate=function(t){var e=!1;return this.animated&&(e=!0,this.update(t,this.options)),e},n.destroy=function(t){this.valid&&(t.deleteTexture(this.texture),this.texture=null,delete this.source,this.source=null,this.valid=!1)},n.setFiltering=function(e,r){if(this.valid){var n=i.isPowerOf2(this.width)&&i.isPowerOf2(this.height),o=r.filtering||t.TextureFilteringType.MipMap,s=r.TEXTURE_WRAP_S||(r.repeat?e.REPEAT:e.CLAMP_TO_EDGE),a=r.TEXTURE_WRAP_T||(r.repeat?e.REPEAT:e.CLAMP_TO_EDGE);n||(o=o===t.TextureFilteringType.MipMap?t.TextureFilteringType.Linear:o,s=a=e.CLAMP_TO_EDGE,(r.repeat||r.TEXTURE_WRAP_S||r.TEXTURE_WRAP_T)&&I.warn("GlslCanvas: cannot repeat texture "+r.url+" cause is not power of 2.")),this.powerOf2=n,this.filtering=o,e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,a),this.filtering===t.TextureFilteringType.MipMap?(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.generateMipmap(e.TEXTURE_2D)):this.filtering===t.TextureFilteringType.Nearest?(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST)):this.filtering===t.TextureFilteringType.Linear&&(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR))}},i}(ut),Et=function(t){function e(){var e;return(e=t.apply(this,arguments)||this).count=0,e.dirty=!1,e.animated=!1,e}r(e,t);var i=e.prototype;return i.clean=function(){var t=this;Object.keys(this.values).forEach((function(e){t.values[e].dirty=!1})),this.dirty=!1},i.createOrUpdate=function(t,e,r,i,n,o){var s,a=this;void 0===i&&(i=0),void 0===n&&(n={});var u=Tt.getTextureOptions(r,n);return(s=this.get(e))||(s=new Tt(t,e,i+this.count,u,o),this.count++,this.set(e,s)),void 0!==u?s.load(t,u).then((function(e){if(e.source instanceof HTMLVideoElement){var r=e.source;r.addEventListener("play",(function(){e.animated=!0,a.animated=!0})),r.addEventListener("pause",(function(){e.animated=!1,a.animated=a.reduce((function(t,e){return t||e.animated}),!1)})),r.addEventListener("seeked",(function(){e.update(t,e.options),a.dirty=!0}))}return e})):Promise.resolve(s)},e}(X);(yt=t.UniformMethod||(t.UniformMethod={}))[yt.Unknown=0]="Unknown",yt.Uniform1i="uniform1i",yt.Uniform2i="uniform2i",yt.Uniform3i="uniform3i",yt.Uniform4i="uniform4i",yt.Uniform1f="uniform1f",yt.Uniform2f="uniform2f",yt.Uniform3f="uniform3f",yt.Uniform4f="uniform4f",yt.Uniform1iv="uniform1iv",yt.Uniform2iv="uniform2iv",yt.Uniform3iv="uniform3iv",yt.Uniform4iv="uniform4iv",yt.Uniform1fv="uniform1fv",yt.Uniform2fv="uniform2fv",yt.Uniform3fv="uniform3fv",yt.Uniform4fv="uniform4fv",yt.UniformMatrix2fv="uniformMatrix2fv",yt.UniformMatrix3fv="uniformMatrix3fv",yt.UniformMatrix4fv="uniformMatrix4fv",(xt=t.UniformType||(t.UniformType={}))[xt.Unknown=0]="Unknown",xt[xt.Float=1]="Float",xt[xt.Int=2]="Int",xt[xt.Bool=3]="Bool",xt[xt.Sampler2D=4]="Sampler2D",xt[xt.SamplerCube=5]="SamplerCube",xt[xt.Matrix2fv=6]="Matrix2fv",xt[xt.Matrix3fv=7]="Matrix3fv",xt[xt.Matrix4fv=8]="Matrix4fv";var Ut=[t.UniformMethod.Uniform1i,t.UniformMethod.Uniform2i,t.UniformMethod.Uniform3i,t.UniformMethod.Uniform4i],Mt=[t.UniformMethod.Uniform1f,t.UniformMethod.Uniform2f,t.UniformMethod.Uniform3f,t.UniformMethod.Uniform4f],bt=[t.UniformMethod.Uniform1iv,t.UniformMethod.Uniform2iv,t.UniformMethod.Uniform3iv,t.UniformMethod.Uniform4iv],At=[t.UniformMethod.Uniform1fv,t.UniformMethod.Uniform2fv,t.UniformMethod.Uniform3fv,t.UniformMethod.Uniform4fv],Ft=function(e){var r=this;switch(this.dirty=!0,e&&Object.assign(this,e),this.method){case t.UniformMethod.UniformMatrix2fv:case t.UniformMethod.UniformMatrix3fv:case t.UniformMethod.UniformMatrix4fv:this.apply=function(t,e){if(r.dirty){t.useProgram(e);var i=t.getUniformLocation(e,r.key);t[r.method].apply(t,[i,!1].concat(r.values))}};break;default:this.apply=function(t,e){if(r.dirty){t.useProgram(e);var i=t.getUniformLocation(e,r.key);t[r.method].apply(t,[i].concat(r.values))}}}},wt=function(t){function e(e){return t.call(this,e)||this}return r(e,t),e}(Ft),Lt=function(e){function i(){var t;return(t=e.apply(this,arguments)||this).dirty=!1,t}r(i,e),i.isArrayOfInteger=function(t){return t.reduce((function(t,e){return t&&Number.isInteger(e)}),!0)},i.isArrayOfNumber=function(t){return t.reduce((function(t,e){return t&&"number"==typeof e}),!0)},i.isArrayOfBoolean=function(t){return t.reduce((function(t,e){return t&&"boolean"==typeof e}),!0)},i.isArrayOfTexture=function(t){return t.reduce((function(t,e){return t&&Tt.isTexture(e)}),!0)},i.isArrayOfSampler2D=function(e){return e.reduce((function(e,r){return e&&r.type===t.UniformType.Sampler2D}),!0)},i.getType_=function(e){var r=t.UniformType.Unknown,n=1===e.length&&Array.isArray(e[0])?e[0]:e;return i.isArrayOfNumber(n)?r=t.UniformType.Float:i.isArrayOfBoolean(n)?r=t.UniformType.Bool:i.isArrayOfTexture(n)&&(r=t.UniformType.Sampler2D),r},i.getMethod_=function(e,r){var i=t.UniformMethod.Unknown,n=1===r.length&&Array.isArray(r[0]),o=(n?r[0]:r).length,s=o-1;switch(e){case t.UniformType.Float:i=n?s<At.length?At[s]:t.UniformMethod.Unknown:s<Mt.length?Mt[s]:t.UniformMethod.Uniform1fv;break;case t.UniformType.Int:case t.UniformType.Bool:i=n?s<bt.length?bt[s]:t.UniformMethod.Unknown:s<Ut.length?Ut[s]:t.UniformMethod.Uniform1iv;break;case t.UniformType.Sampler2D:i=n?t.UniformMethod.Uniform1iv:1===o?t.UniformMethod.Uniform1i:t.UniformMethod.Uniform1iv}return i},i.parseUniform=function(e,r,n){var o;void 0===n&&(n=null),n=n||i.getType_(r);var s=i.getMethod_(n,r);if(n!==t.UniformType.Unknown&&s!==t.UniformMethod.Unknown){if(n===t.UniformType.Sampler2D&&s===t.UniformMethod.Uniform1iv)return r[0].map((function(t,r){return new Ft({method:s,type:n,key:e+"["+r+"]",values:[t]})}));o=new Ft({method:s,type:n,key:e,values:r})}else I.error("Uniforms.parseUniform.Unknown",e,r);return o};var n=i.prototype;return n.create=function(t,e,r,i){var n=new Ft({method:t,type:e,key:r,values:i});return this.set(r,n),this.dirty=!0,n},n.createTexture=function(e,r){var i;return i=-1!==e.indexOf("]")?new wt({method:t.UniformMethod.Uniform1iv,type:t.UniformType.Sampler2D,key:e,values:[[r]]}):new wt({method:t.UniformMethod.Uniform1i,type:t.UniformType.Sampler2D,key:e,values:[r]}),this.set(e,i),this.dirty=!0,i},n.update=function(t,e,r,i){var n=this.get(r);n&&(n.method=t,n.type=e,n.values=i,n.dirty=!0,this.dirty=!0)},n.createOrUpdate=function(t,e,r,i){this.has(r)?this.update(t,e,r,i):this.create(t,e,r,i)},n.apply=function(t,e){var r=this;t.useProgram(e),Object.keys(this.values).forEach((function(i){r.values[i].apply(t,e)}))},n.clean=function(){var t=this;Object.keys(this.values).forEach((function(e){t.values[e].dirty=!1})),this.dirty=!1},i.isDifferent=function(t,e){return t.length!==e.length||t.reduce((function(t,r,i){return t||r!==e[i]}),!1)},i}(X),Rt=function(e){function i(){var t;return(t=e.call(this)||this).uniforms=new Lt,t.buffers=new K,t.textures=new Et,t.textureList=[],t.W=0,t.H=0,t.mouse=new $,t.radians=0,t.dirty=!0,t.animated=!1,t.camera=new Z,t.cache={},t.drawFunc_=t.drawArrays_,t}r(i,e);var n=i.prototype;return n.render=function(){var t=this,e=this.gl;if(e){var r=e.drawingBufferWidth,i=e.drawingBufferHeight;this.update_(),e.viewport(0,0,r,i);var n=this.uniforms;Object.keys(this.buffers.values).forEach((function(o){var s=t.buffers.values[o];s.geometry.attachAttributes_(e,s.program),n.apply(e,s.program),s.render(e,r,i)})),this.geometry.attachAttributes_(e,this.program),n.apply(e,this.program),this.drawFunc_(this.timer.delta),n.clean(),this.textures.clean(),this.dirty=!1,this.trigger("render",this)}},n.drawArrays_=function(t){var e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.W,this.H),e.clearColor(0,0,0,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.enable(e.CULL_FACE),this.doubleSided&&this.mode!==C.Flat&&(e.cullFace(e.FRONT),e.drawArrays(e.TRIANGLES,0,this.geometry.size),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA)),e.cullFace(e.BACK),e.drawArrays(e.TRIANGLES,0,this.geometry.size)},n.create_=function(){this.createGeometry_(),this.createUniforms_()},n.createGeometry_=function(){this.parseGeometry_(),this.setMode(this.mode)},n.parseGeometry_=function(){var t=/^attribute\s+vec4\s+a_position\s*;\s*\/\/\s*([\w|\:\/\/|\.|\-|\_|\?|\&|\=]+)/gm.exec(this.vertexString);t&&t.length>1?this.mesh=t[1]:this.mesh=this.defaultMesh},n.createUniforms_=function(){var e=this.gl,r=this.fragmentString,i=e.drawingBufferWidth,n=e.drawingBufferHeight,o=this.timer=new st,s=(r.match(/u_delta/g)||[]).length>1,a=(r.match(/u_time/g)||[]).length>1,u=(r.match(/u_date/g)||[]).length>1,h=(r.match(/u_mouse/g)||[]).length>1,f=(r.match(/u_camera/g)||[]).length>1;this.animated=!0;var c=this.uniforms;if(c.create(t.UniformMethod.Uniform2f,t.UniformType.Float,"u_resolution",[i,n]),s?(c.create(t.UniformMethod.Uniform1f,t.UniformType.Float,"u_delta",[o.delta/1e3]),this.updateUniformDelta_=this.updateUniformDelta__):this.updateUniformDelta_=this.updateUniformNoop_,a?(c.create(t.UniformMethod.Uniform1f,t.UniformType.Float,"u_time",[o.current/1e3]),this.updateUniformTime_=this.updateUniformTime__):this.updateUniformTime_=this.updateUniformNoop_,u){var l=new Date;c.create(t.UniformMethod.Uniform4f,t.UniformType.Float,"u_date",[l.getFullYear(),l.getMonth(),l.getDate(),3600*l.getHours()+60*l.getMinutes()+l.getSeconds()+.001*l.getMilliseconds()]),this.updateUniformDate_=this.updateUniformDate__}else this.updateUniformDate_=this.updateUniformNoop_;h?(c.create(t.UniformMethod.Uniform2f,t.UniformType.Float,"u_mouse",[0,0]),this.updateUniformMouse_=this.updateUniformMouse__):this.updateUniformMouse_=this.updateUniformNoop_,f?(c.create(t.UniformMethod.Uniform3f,t.UniformType.Float,"u_camera",[0,0,0]),this.updateUniformCamera_=this.updateUniformCamera__):this.updateUniformCamera_=this.updateUniformNoop_,this.projectionMatrix=et(),c.create(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_projectionMatrix",this.projectionMatrix),this.modelViewMatrix=et(),c.create(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_modelViewMatrix",this.modelViewMatrix),this.normalMatrix=et(),c.create(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_normalMatrix",this.normalMatrix)},n.update_=function(){var e=this.gl,r=e.drawingBufferWidth,i=e.drawingBufferHeight;if(this.timer){var n=this.timer.next();this.uniforms.update(t.UniformMethod.Uniform2f,t.UniformType.Float,"u_resolution",[r,i]),this.updateUniformDelta_(n),this.updateUniformTime_(n),this.updateUniformDate_(),this.updateUniformMouse_(),this.updateUniformCamera_(),this.updateUniformMesh_()}},n.updateUniformNoop_=function(){},n.updateUniformDelta__=function(e){this.uniforms.update(t.UniformMethod.Uniform1f,t.UniformType.Float,"u_delta",[e.delta/1e3])},n.updateUniformTime__=function(e){this.uniforms.update(t.UniformMethod.Uniform1f,t.UniformType.Float,"u_time",[e.current/1e3])},n.updateUniformDate__=function(){var e=this.uniforms,r=new Date;e.update(t.UniformMethod.Uniform4f,t.UniformType.Float,"u_date",[r.getFullYear(),r.getMonth(),r.getDate(),3600*r.getHours()+60*r.getMinutes()+r.getSeconds()+.001*r.getMilliseconds()])},n.updateUniformMouse__=function(){var e=this.uniforms,r=this.mouse;e.update(t.UniformMethod.Uniform2f,t.UniformType.Float,"u_mouse",[r.x,r.y])},n.updateUniformCamera__=function(){var e=this.uniforms,r=Z.toArray(this.camera);e.update(t.UniformMethod.Uniform3f,t.UniformType.Float,"u_camera",r)},n.updateUniformMesh__=function(){var e=this.uniforms;e.update(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_projectionMatrix",this.updateProjectionMatrix_()),e.update(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_modelViewMatrix",this.updateModelViewMatrix_(this.timer.delta)),e.update(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_normalMatrix",this.updateNormalMatrix_(this.modelViewMatrix))},n.updateUniformFlat__=function(){var e=this.uniforms;e.update(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_projectionMatrix",et()),e.update(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_modelViewMatrix",et()),e.update(t.UniformMethod.UniformMatrix4fv,t.UniformType.Float,"u_normalMatrix",et())},n.updateProjectionMatrix_=function(){var t=this.gl,e=45*Math.PI/180,r=t.drawingBufferWidth/t.drawingBufferHeight;return function(t,e,r,i,n){var o,s=1/Math.tan(e/2);t[0]=s/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,null!=n&&n!==1/0?(o=1/(i-n),t[10]=(n+i)*o,t[14]=2*n*i*o):(t[10]=-1,t[14]=-2*i)}(this.projectionMatrix,e,r,.1,100),this.projectionMatrix},n.updateModelViewMatrix_=function(t){var e,r,i,n,o,s,a,u,h,f,c,l,d,m,v,p,g,_,y=this.camera,x=this.modelViewMatrix;return x=rt(x),e=x,r=x,i=[0,0,-y.radius],p=i[0],g=i[1],_=i[2],r===e?(e[12]=r[0]*p+r[4]*g+r[8]*_+r[12],e[13]=r[1]*p+r[5]*g+r[9]*_+r[13],e[14]=r[2]*p+r[6]*g+r[10]*_+r[14],e[15]=r[3]*p+r[7]*g+r[11]*_+r[15]):(n=r[0],o=r[1],s=r[2],a=r[3],u=r[4],h=r[5],f=r[6],c=r[7],l=r[8],d=r[9],m=r[10],v=r[11],e[0]=n,e[1]=o,e[2]=s,e[3]=a,e[4]=u,e[5]=h,e[6]=f,e[7]=c,e[8]=l,e[9]=d,e[10]=m,e[11]=v,e[12]=n*p+u*g+l*_+r[12],e[13]=o*p+h*g+d*_+r[13],e[14]=s*p+f*g+m*_+r[14],e[15]=a*p+c*g+v*_+r[15]),it(x,x,y.theta+this.radians,[0,1,0]),it(x,x,y.phi,[1,0,0]),y.mouse||(y.theta+=(0-y.theta)/20,y.phi+=(0-y.phi)/20,this.radians+=5e-4*t),x},n.updateNormalMatrix_=function(t){var e,r,i,n,o,s,a,u,h,f,c,l,d,m,v,p,g,_,y,x,T,E,U,M,b,A,F,w,L,R,S,P=this.normalMatrix;return P=rt(P),e=P,i=(r=t)[0],n=r[1],o=r[2],s=r[3],a=r[4],u=r[5],h=r[6],f=r[7],c=r[8],l=r[9],d=r[10],m=r[11],v=r[12],p=r[13],g=r[14],_=r[15],(S=(y=i*u-n*a)*(R=d*_-m*g)-(x=i*h-o*a)*(L=l*_-m*p)+(T=i*f-s*a)*(w=l*g-d*p)+(E=n*h-o*u)*(F=c*_-m*v)-(U=n*f-s*u)*(A=c*g-d*v)+(M=o*f-s*h)*(b=c*p-l*v))&&(S=1/S,e[0]=(u*R-h*L+f*w)*S,e[1]=(o*L-n*R-s*w)*S,e[2]=(p*M-g*U+_*E)*S,e[3]=(d*U-l*M-m*E)*S,e[4]=(h*F-a*R-f*A)*S,e[5]=(i*R-o*F+s*A)*S,e[6]=(g*T-v*M-_*x)*S,e[7]=(c*M-d*T+m*x)*S,e[8]=(a*L-u*F+f*b)*S,e[9]=(n*F-i*L-s*b)*S,e[10]=(v*U-p*T+_*y)*S,e[11]=(l*T-c*U-m*y)*S,e[12]=(u*A-a*w-h*b)*S,e[13]=(i*w-n*A+o*b)*S,e[14]=(p*x-v*E-g*y)*S,e[15]=(c*E-l*x+d*y)*S),function(t,e){if(t===e){var r=e[1],i=e[2],n=e[3],o=e[6],s=e[7],a=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=r,t[6]=e[9],t[7]=e[13],t[8]=i,t[9]=o,t[11]=e[14],t[12]=n,t[13]=s,t[14]=a}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15]}(P,P),P},n.setMode=function(t){var e,r=this;if(t===C.Mesh&&(e=this.cache[this.mesh]))return this.geometry=e,this.mode=C.Mesh,this.updateUniformMesh_=this.updateUniformMesh__,void(this.dirty=!0);switch(t){case C.Flat:e=new H,this.updateUniformMesh_=this.updateUniformNoop_,this.updateUniformFlat__();break;case C.Box:e=new ht,this.updateUniformMesh_=this.updateUniformMesh__;break;case C.Sphere:e=new ft,this.updateUniformMesh_=this.updateUniformMesh__;break;case C.Torus:e=new ct,this.updateUniformMesh_=this.updateUniformMesh__;break;case C.Mesh:e=new H,this.mesh?(new mt).load(O.getResource(this.mesh,this.workpath)).then((function(t){t.createAttributes_(r.gl,r.program);var e={};e[r.mesh]=t,r.cache=e,r.geometry=t,r.dirty=!0}),(function(t){I.warn("GlslCanvas",t),r.mode=C.Flat})):t=C.Flat,this.updateUniformMesh_=this.updateUniformMesh__}e.create(this.gl,this.program),this.geometry=e,this.mode=t,this.dirty=!0},n.setMesh=function(t){this.mesh=t},i}(ut),St=function(e){function i(t,r){var o;return void 0===r&&(r={}),(o=e.call(this)||this).valid=!1,o.visible=!1,o.controls=!1,o.vertexPath="",o.fragmentPath="",t?(o.options=r,o.canvas=t,o.width=0,o.height=0,o.rect=t.getBoundingClientRect(),o.devicePixelRatio=window.devicePixelRatio||1,o.mode=r.mode||C.Flat,o.mesh=r.mesh||void 0,o.doubleSided=r.doubleSided||!1,o.defaultMesh=o.mesh,o.workpath=r.workpath,t.style.backgroundColor=r.backgroundColor||"rgba(0,0,0,0)",o.getShaders_().then((function(t){o.load().then((function(t){o.program&&(o.addListeners_(),o.onLoop())}))}),(function(t){I.error("GlslCanvas.getShaders_.error",t)})),i.items.push(n(o)),o):n(o)}r(i,e);var o=i.prototype;return o.getShaders_=function(){var t=this;return new Promise((function(e){t.vertexString=t.options.vertexString||t.vertexString,t.fragmentString=t.options.fragmentString||t.fragmentString;var r=t.canvas,i={};r.hasAttribute("data-vertex-url")&&(i.vertex=r.getAttribute("data-vertex-url")),r.hasAttribute("data-fragment-url")&&(i.fragment=r.getAttribute("data-fragment-url")),r.hasAttribute("data-vertex")&&(t.vertexString=r.getAttribute("data-vertex")),r.hasAttribute("data-fragment")&&(t.fragmentString=r.getAttribute("data-fragment")),Object.keys(i).length?Promise.all(Object.keys(i).map((function(e){var r=O.getResource(i[e],t.workpath);return O.fetch(r).then((function(r){var n=O.dirname(i[e]);return"vertex"===e?(t.vertexPath=n,t.vertexString=r):(t.fragmentPath=n,t.fragmentString=r)}))}))).then((function(r){e([t.vertexString,t.fragmentString])})):e([t.vertexString,t.fragmentString])}))},o.addListeners_=function(){this.onScroll=this.onScroll.bind(this),this.onWheel=this.onWheel.bind(this),this.onClick=this.onClick.bind(this),this.onMove=this.onMove.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseOver=this.onMouseOver.bind(this),this.onMouseOut=this.onMouseOut.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.onLoop=this.onLoop.bind(this),window.addEventListener("scroll",this.onScroll),document.addEventListener("mousemove",this.onMouseMove,!1),document.addEventListener("touchmove",this.onTouchMove),this.addCanvasListeners_()},o.addCanvasListeners_=function(){this.controls=this.canvas.hasAttribute("controls"),this.canvas.addEventListener("wheel",this.onWheel),this.canvas.addEventListener("click",this.onClick),this.canvas.addEventListener("mousedown",this.onMouseDown),this.canvas.addEventListener("touchstart",this.onTouchStart),this.controls&&(this.canvas.addEventListener("mouseover",this.onMouseOver),this.canvas.addEventListener("mouseout",this.onMouseOut),this.canvas.hasAttribute("data-autoplay")||this.pause())},o.removeCanvasListeners_=function(){this.canvas.removeEventListener("wheel",this.onWheel),this.canvas.removeEventListener("click",this.onClick),this.canvas.removeEventListener("mousedown",this.onMouseDown),this.canvas.removeEventListener("mouseup",this.onMouseUp),this.canvas.removeEventListener("touchstart",this.onTouchStart),this.canvas.removeEventListener("touchend",this.onTouchEnd),this.controls&&(this.canvas.removeEventListener("mouseover",this.onMouseOver),this.canvas.removeEventListener("mouseout",this.onMouseOut))},o.removeListeners_=function(){window.cancelAnimationFrame(this.rafId),window.removeEventListener("scroll",this.onScroll),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("touchmove",this.onTouchMove),this.removeCanvasListeners_()},o.onScroll=function(t){this.rect=this.canvas.getBoundingClientRect()},o.onWheel=function(t){this.camera.wheel(t.deltaY),this.dirty=this.mode!==C.Flat,this.trigger("wheel",t)},o.onClick=function(t){this.controls&&this.toggle(),this.trigger("click",t)},o.onDown=function(t,e){var r=this.rect;t-=r.left,e=r.height-(e-r.top);var i=t*this.devicePixelRatio,n=e*this.devicePixelRatio;this.mouse.x=i,this.mouse.y=n;var o=Math.min(r.width,r.height);this.camera.down(t/o,e/o),this.trigger("down",this.mouse)},o.onMove=function(t,e){var r=this.rect;t-=r.left,e=r.height-(e-r.top);var i=t*this.devicePixelRatio,n=e*this.devicePixelRatio;if(i!==this.mouse.x||n!==this.mouse.y){this.mouse.x=i,this.mouse.y=n;var o=Math.min(r.width,r.height);this.camera.move(t/o,e/o),this.dirty=this.mode!==C.Flat&&null!==this.camera.mouse,this.trigger("move",this.mouse)}},o.onUp=function(t){this.camera.up(),this.controls&&this.pause(),this.trigger("out",t)},o.onMouseDown=function(t){this.onDown(t.clientX,t.clientY),document.addEventListener("mouseup",this.onMouseUp),document.removeEventListener("touchstart",this.onTouchStart),document.removeEventListener("touchmove",this.onTouchMove)},o.onMouseMove=function(t){this.onMove(t.clientX,t.clientY)},o.onMouseUp=function(t){this.onUp(t)},o.onMouseOver=function(t){this.play(),this.trigger("over",t)},o.onMouseOut=function(t){this.pause(),this.trigger("out",t)},o.onTouchStart=function(t){var e=[].slice.call(t.touches).reduce((function(t,e){return(t=t||new $).x+=e.clientX,t.y+=e.clientY,t}),null);e&&this.onDown(e.x/t.touches.length,e.y/t.touches.length),this.controls&&this.play(),this.trigger("over",t),document.addEventListener("touchend",this.onTouchEnd),document.removeEventListener("mousedown",this.onMouseDown),document.removeEventListener("mousemove",this.onMouseMove),this.controls&&(this.canvas.removeEventListener("mouseover",this.onMouseOver),this.canvas.removeEventListener("mouseout",this.onMouseOut))},o.onTouchMove=function(t){var e=[].slice.call(t.touches).reduce((function(t,e){return(t=t||new $).x+=e.clientX,t.y+=e.clientY,t}),null);e&&this.onMove(e.x/t.touches.length,e.y/t.touches.length)},o.onTouchEnd=function(t){this.onUp(t),document.removeEventListener("touchend",this.onTouchEnd)},o.onLoop=function(t){this.checkRender(),this.rafId=window.requestAnimationFrame(this.onLoop)},o.setUniform_=function(e,r,i,n){var o=this;void 0===i&&(i={}),void 0===n&&(n=null);var s=Lt.parseUniform(e,r,n);if(Array.isArray(s))Lt.isArrayOfSampler2D(s)?s.forEach((function(t){return o.loadTexture(t.key,t.values[0],i)})):s.forEach((function(t){return o.uniforms.set(t.key,t.values[0])}));else if(s)switch(s.type){case t.UniformType.Sampler2D:this.loadTexture(e,r[0],i);break;default:this.uniforms.set(e,s)}},o.isVisible_=function(){var t=this.rect;return t.top+t.height>0&&t.top<(window.innerHeight||document.documentElement.clientHeight)},o.isAnimated_=function(){return(this.animated||this.textures.animated||this.mode!==C.Flat)&&!this.timer.paused},o.isDirty_=function(){return this.dirty||this.uniforms.dirty||this.textures.dirty},o.sizeDidChanged_=function(){var t=this,e=this.gl,r=Math.ceil(this.canvas.clientWidth),i=Math.ceil(this.canvas.clientHeight);if(this.width!==r||this.height!==i){this.width=r,this.height=i;var n=Math.ceil(r*this.devicePixelRatio),o=Math.ceil(i*this.devicePixelRatio);return this.W=n,this.H=o,this.canvas.width=n,this.canvas.height=o,Object.keys(this.buffers.values).forEach((function(r){t.buffers.values[r].resize(e,n,o)})),this.rect=this.canvas.getBoundingClientRect(),this.trigger("resize"),!0}return!1},o.parseTextures_=function(t){for(var e,r=this,i=/uniform\s*sampler2D\s*([\w]*);(\s*\/\/\s*([\w|\:\/\/|\.|\-|\_|\?|\&|\=]*)|\s*)/gm;null!==(e=i.exec(t));){var n=e[1],o=e[3];Tt.isTextureUrl(o)?this.textureList.push({key:n,url:o}):this.buffers.has(n)||this.textureList.push({key:n,url:null})}this.canvas.hasAttribute("data-textures")&&this.canvas.getAttribute("data-textures").split(",").forEach((function(t,e){var i="u_texture"+e;r.textureList.push({key:i,url:t})}));return this.textureList.length>0},o.load=function(t,e){var r=this,i=V.getFragmentVertex(this.gl,t||this.fragmentString);return Promise.all([V.getIncludes(t||this.fragmentString,""===this.fragmentPath?this.workpath:this.fragmentPath),V.getIncludes(i||e||this.vertexString,""===this.vertexPath?this.workpath:this.vertexPath)]).then((function(t){return r.fragmentString=t[0],r.vertexString=t[1],r.createContext_()}))},o.getContext_=function(){var t=this.vertexString,e=this.fragmentString;if(this.vertexString=V.getVertex(t,e,this.mode),this.fragmentString=V.getFragment(t,e,this.mode),V.versionDiffers(this.gl,t,e)&&(this.destroyContext_(),this.swapCanvas_(),this.uniforms=new Lt,this.buffers=new K,this.textures=new Et,this.textureList=[]),!this.gl){var r=V.tryInferContext(t,e,this.canvas,this.options,this.options.extensions,this.options.onError);if(!r)return null;this.gl=r}return this.gl},o.createContext_=function(){var t,e,r=this.getContext_();if(!r)return!1;try{if(V.inferPrecision(this.fragmentString),t=V.createShader(r,this.vertexString,r.VERTEX_SHADER),e=V.createShader(r,this.fragmentString,r.FRAGMENT_SHADER))this.valid=!0;else{var i=V.getFragment(null,null,this.mode);e=V.createShader(r,i,r.FRAGMENT_SHADER),this.valid=!1}}catch(t){return this.trigger("error",t),!1}var n=V.createProgram(r,[t,e]);if(!n)return this.trigger("error",V.lastError),!1;if(r.deleteShader(t),r.deleteShader(e),this.program=n,this.valid){try{this.buffers=K.getBuffers(r,this.fragmentString,V.getBufferVertex(r))}catch(t){return this.valid=!1,this.trigger("error",t),!1}this.create_(),this.animated?this.canvas.classList.add("animated"):this.canvas.classList.remove("animated")}return this.trigger("load",this),this.valid},o.create_=function(){this.parseMode_(),this.parseMesh_(),e.prototype.create_.call(this),this.createBuffers_(),this.createTextures_()},o.parseMode_=function(){if(this.canvas.hasAttribute("data-mode")){var t=this.canvas.getAttribute("data-mode");-1!==["flat","box","sphere","torus","mesh"].indexOf(t)&&(this.mode=t)}},o.parseMesh_=function(){if(this.canvas.hasAttribute("data-mesh")){var t=this.canvas.getAttribute("data-mesh");-1!==t.indexOf(".obj")&&(this.mesh=this.defaultMesh=t)}},o.createBuffers_=function(){var e=this;Object.keys(this.buffers.values).forEach((function(r){var i=e.buffers.values[r];e.uniforms.create(t.UniformMethod.Uniform1i,t.UniformType.Sampler2D,i.key,[i.input.index])}))},o.createTextures_=function(){var t=this;this.parseTextures_(this.fragmentString)&&(this.textureList.filter((function(t){return t.url})).forEach((function(e){t.setTexture(e.key,e.url,e.options)})),this.textureList=[])},o.update_=function(){e.prototype.update_.call(this),this.updateBuffers_(),this.updateTextures_()},o.updateBuffers_=function(){var e=this;Object.keys(this.buffers.values).forEach((function(r){var i=e.buffers.values[r];e.uniforms.update(t.UniformMethod.Uniform1i,t.UniformType.Sampler2D,i.key,[i.input.index])}))},o.updateTextures_=function(){var e=this,r=this.gl;Object.keys(this.textures.values).forEach((function(i){var n=e.textures.values[i];n.tryUpdate(r),e.uniforms.update(t.UniformMethod.Uniform1i,t.UniformType.Sampler2D,n.key,[n.index])}))},o.destroyContext_=function(){var t=this,e=this.gl;e.useProgram(null),this.program&&e.deleteProgram(this.program),Object.keys(this.buffers.values).forEach((function(r){t.buffers.values[r].destroy(e)})),Object.keys(this.textures.values).forEach((function(r){t.textures.values[r].destroy(e)})),this.buffers=null,this.textures=null,this.uniforms=null,this.program=null,this.gl=null},o.swapCanvas_=function(){var t=this.canvas,e=t.cloneNode();t.parentNode.replaceChild(e,t),this.canvas=e,this.addCanvasListeners_()},o.destroy=function(){this.removeListeners_(),this.destroyContext_(),this.animated=!1,this.valid=!1;var t=i.items.indexOf(this);-1!==t&&i.items.splice(t,1)},o.loadTexture=function(e,r,i){var n=this;void 0===i&&(i={}),this.valid?this.textures.createOrUpdate(this.gl,e,r,this.buffers.count,i,this.options.workpath).then((function(r){var i=r.index;n.uniforms.createTexture(e,i).texture=r;var o=-1!==e.indexOf("[")?e.replace("[","Resolution["):e+"Resolution";return n.uniforms.create(t.UniformMethod.Uniform2f,t.UniformType.Float,o,[r.width,r.height]),r}),(function(t){var i=Array.isArray(t.path)?t.path.map((function(t){return t.error?t.error.message:""})).join(", "):t.message;I.error("GlslCanvas.loadTexture.error",e,r,i),n.trigger("textureError",{key:e,urlElementOrData:r,message:i})})):this.textureList.push({key:e,url:r,options:i})},o.setTexture=function(t,e,r){return void 0===r&&(r={}),this.setUniform_(t,[e],r)},o.setUniform=function(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];return this.setUniform_(t,r)},o.setUniformOfInt=function(e,r){return this.setUniform_(e,r,null,t.UniformType.Int)},o.setUniforms=function(t){var e=this;Object.keys(t).forEach((function(r){e.setUniform(r,t[r])}))},o.pause=function(){this.valid&&(this.timer.pause(),this.canvas.classList.add("paused"),this.trigger("pause"))},o.play=function(){this.valid&&(this.timer.play(),this.canvas.classList.remove("paused"),this.trigger("play"))},o.toggle=function(){this.valid&&(this.timer.paused?this.play():this.pause())},o.checkRender=function(){this.isVisible_()&&(this.sizeDidChanged_()||this.isDirty_()||this.isAnimated_())?(this.render(),this.canvas.classList.add("playing")):this.canvas.classList.remove("playing")},i}(Rt);function Pt(t,e){return St.items.find((function(e){return e.canvas===t}))||new St(t,e)}function Ot(){return[].slice.call(document.getElementsByClassName("glsl-canvas")).filter((function(t){return t instanceof HTMLCanvasElement})).map((function(t){return Pt(t)}))}St.items=[],document&&document.addEventListener("DOMContentLoaded",(function(){Ot()})),t.BoxGeometry=ht,t.Buffer=Y,t.Buffers=K,t.Canvas=St,t.CanvasTimer=st,t.Common=O,t.Context=V,t.ContextVertexBuffers=W,t.DefaultWebGL2BufferFragment=T,t.DefaultWebGL2BufferVertex=y,t.DefaultWebGL2FlatFragment=v,t.DefaultWebGL2MeshFragment=g,t.DefaultWebGL2MeshVertex=d,t.DefaultWebGLBufferFragment=x,t.DefaultWebGLBufferVertex=_,t.DefaultWebGLFlatFragment=m,t.DefaultWebGLMeshFragment=p,t.DefaultWebGLMeshVertex=l,t.FlatGeometry=H,t.Geometry=j,t.IOBuffer=q,t.IterableStringMap=X,t.Listener=at,t.Logger=I,t.METHODS_FLOAT=Mt,t.METHODS_FLOATV=At,t.METHODS_INT=Ut,t.METHODS_INTV=bt,t.ObjLoader=mt,t.OrbitCamera=Z,t.Renderer=Rt,t.SphereGeometry=ft,t.Subscriber=ut,t.Texture=Tt,t.TextureExtensions=gt,t.TextureImageExtensions=vt,t.TextureVideoExtensions=pt,t.Textures=Et,t.TorusGeometry=ct,t.Uniform=Ft,t.UniformTexture=wt,t.Uniforms=Lt,t.Vector2=$,t.Vector3=J,t.isTextureData=_t,t.loadAll=Ot,t.of=Pt,Object.defineProperty(t,"__esModule",{value:!0})}));

;(function() {

"use strict";

var objectTypes = {
'function': true,
'object': true
};

function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat,
  freeParseInt = parseInt;

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
? exports
: undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
? module
: undefined;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = (freeModule && freeModule.exports === freeExports)
? freeExports
: undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
* Used as a reference to the global object.
*
* The `this` value is used if it's the global object to avoid Greasemonkey's
* restricted `window` object, otherwise the `window` object is used.
*/
var root = freeGlobal ||
((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
  freeSelf || thisGlobal || Function('return this')();

if( !('gc' in window ) ) {
	window.gc = function(){}
}

if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}

// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015


// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed


(function(){

  if ("performance" in window == false) {
      window.performance = {};
  }

  Date.now = (Date.now || function () {  // thanks IE8
	  return new Date().getTime();
  });

  if ("now" in window.performance == false){

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }

})();


function pad( n ) {
	return String("0000000" + n).slice(-7);
}
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers

var g_startTime = window.Date.now();

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function CCFrameEncoder( settings ) {

	var _handlers = {};

	this.settings = settings;

	this.on = function(event, handler) {

		_handlers[event] = handler;

	};

	this.emit = function(event) {

		var handler = _handlers[event];
		if (handler) {

			handler.apply(null, Array.prototype.slice.call(arguments, 1));

		}

	};

	this.filename = settings.name || guid();
	this.extension = '';
	this.mimeType = '';

}

CCFrameEncoder.prototype.start = function(){};
CCFrameEncoder.prototype.stop = function(){};
CCFrameEncoder.prototype.add = function(){};
CCFrameEncoder.prototype.save = function(){};
CCFrameEncoder.prototype.dispose = function(){};
CCFrameEncoder.prototype.safeToProceed = function(){ return true; };
CCFrameEncoder.prototype.step = function() { console.log( 'Step not set!' ) }

function CCTarEncoder( settings ) {

  CCFrameEncoder.call( this, settings );

  this.extension = '.tar'
  this.mimeType = 'application/x-tar'
  this.fileExtension = '';
  this.baseFilename = this.filename;

  this.tape = null
  this.count = 0;
  this.part = 1;
  this.frames = 0;

}

CCTarEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCTarEncoder.prototype.start = function(){

  this.dispose();

};

CCTarEncoder.prototype.add = function( blob ) {

  var fileReader = new FileReader();
  fileReader.onload = function() {
    this.tape.append( pad( this.count ) + this.fileExtension, new Uint8Array( fileReader.result ) );

    if( this.settings.autoSaveTime > 0 && ( this.frames / this.settings.framerate ) >= this.settings.autoSaveTime ) {
      this.save( function( blob ) {
        this.filename = this.baseFilename + '-part-' + pad( this.part );
        download( blob, this.filename + this.extension, this.mimeType );
        var count = this.count;
        this.dispose();
        this.count = count+1;
        this.part++;
        this.filename = this.baseFilename + '-part-' + pad( this.part );
        this.frames = 0;
        this.step();
      }.bind( this ) )
    } else {
      this.count++;
      this.frames++;
      this.step();
    }

  }.bind( this );
  fileReader.readAsArrayBuffer(blob);

}

CCTarEncoder.prototype.save = function( callback ) {

  callback( this.tape.save() );

}

CCTarEncoder.prototype.dispose = function() {

  this.tape = new Tar();
  this.count = 0;

}

function CCPNGEncoder( settings ) {

	CCTarEncoder.call( this, settings );

	this.type = 'image/png';
	this.fileExtension = '.png';

}

CCPNGEncoder.prototype = Object.create( CCTarEncoder.prototype );

CCPNGEncoder.prototype.add = function( canvas ) {

	canvas.toBlob( function( blob ) {
		CCTarEncoder.prototype.add.call( this, blob );
	}.bind( this ), this.type )

}

function CCJPEGEncoder( settings ) {

	CCTarEncoder.call( this, settings );

	this.type = 'image/jpeg';
	this.fileExtension = '.jpg';
	this.quality = ( settings.quality / 100 ) || .8;

}

CCJPEGEncoder.prototype = Object.create( CCTarEncoder.prototype );

CCJPEGEncoder.prototype.add = function( canvas ) {

	canvas.toBlob( function( blob ) {
		CCTarEncoder.prototype.add.call( this, blob );
	}.bind( this ), this.type, this.quality )

}

/*

	WebM Encoder

*/

function CCWebMEncoder( settings ) {

	var canvas = document.createElement( 'canvas' );
	if( canvas.toDataURL( 'image/webp' ).substr(5,10) !== 'image/webp' ){
		console.log( "WebP not supported - try another export format" )
	}

	CCFrameEncoder.call( this, settings );

	this.quality = ( settings.quality / 100 ) || .8;

	this.extension = '.webm'
	this.mimeType = 'video/webm'
	this.baseFilename = this.filename;
  this.framerate = settings.framerate;

	this.frames = 0;
	this.part = 1;

  this.videoWriter = new WebMWriter({
    quality: this.quality,
    fileWriter: null,
    fd: null,
    frameRate: this.framerate
  });

}

CCWebMEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCWebMEncoder.prototype.start = function( canvas ) {

	this.dispose();

}

CCWebMEncoder.prototype.add = function( canvas ) {

  this.videoWriter.addFrame(canvas);

	if( this.settings.autoSaveTime > 0 && ( this.frames / this.settings.framerate ) >= this.settings.autoSaveTime ) {
		this.save( function( blob ) {
			this.filename = this.baseFilename + '-part-' + pad( this.part );
			download( blob, this.filename + this.extension, this.mimeType );
			this.dispose();
			this.part++;
			this.filename = this.baseFilename + '-part-' + pad( this.part );
			this.step();
		}.bind( this ) )
	} else {
    this.frames++;
		this.step();
	}

}

CCWebMEncoder.prototype.save = function( callback ) {

  this.videoWriter.complete().then(callback);

}

CCWebMEncoder.prototype.dispose = function( canvas ) {

	this.frames = 0;
  this.videoWriter = new WebMWriter({
    quality: this.quality,
    fileWriter: null,
    fd: null,
    frameRate: this.framerate
  });

}

function CCFFMpegServerEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	settings.quality = ( settings.quality / 100 ) || .8;

	this.encoder = new FFMpegServer.Video( settings );
    this.encoder.on( 'process', function() {
        this.emit( 'process' )
    }.bind( this ) );
    this.encoder.on('finished', function( url, size ) {
        var cb = this.callback;
        if ( cb ) {
            this.callback = undefined;
            cb( url, size );
        }
    }.bind( this ) );
    this.encoder.on( 'progress', function( progress ) {
        if ( this.settings.onProgress ) {
            this.settings.onProgress( progress )
        }
    }.bind( this ) );
    this.encoder.on( 'error', function( data ) {
        alert(JSON.stringify(data, null, 2));
    }.bind( this ) );

}

CCFFMpegServerEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCFFMpegServerEncoder.prototype.start = function() {

	this.encoder.start( this.settings );

};

CCFFMpegServerEncoder.prototype.add = function( canvas ) {

	this.encoder.add( canvas );

}

CCFFMpegServerEncoder.prototype.save = function( callback ) {

    this.callback = callback;
    this.encoder.end();

}

CCFFMpegServerEncoder.prototype.safeToProceed = function() {
    return this.encoder.safeToProceed();
};

/*
	HTMLCanvasElement.captureStream()
*/

function CCStreamEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	this.framerate = this.settings.framerate;
	this.type = 'video/webm';
	this.extension = '.webm';
	this.stream = null;
	this.mediaRecorder = null;
	this.chunks = [];

}

CCStreamEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCStreamEncoder.prototype.add = function( canvas ) {

	if( !this.stream ) {
		this.stream = canvas.captureStream( this.framerate );
		this.mediaRecorder = new MediaRecorder( this.stream );
		this.mediaRecorder.start();

		this.mediaRecorder.ondataavailable = function(e) {
			this.chunks.push(e.data);
		}.bind( this );

	}
	this.step();

}

CCStreamEncoder.prototype.save = function( callback ) {

	this.mediaRecorder.onstop = function( e ) {
		var blob = new Blob( this.chunks, { 'type' : 'video/webm' });
		this.chunks = [];
		callback( blob );

	}.bind( this );

	this.mediaRecorder.stop();

}

/*function CCGIFEncoder( settings ) {

	CCFrameEncoder.call( this );

	settings.quality = settings.quality || 6;
	this.settings = settings;

	this.encoder = new GIFEncoder();
	this.encoder.setRepeat( 1 );
  	this.encoder.setDelay( settings.step );
  	this.encoder.setQuality( 6 );
  	this.encoder.setTransparent( null );
  	this.encoder.setSize( 150, 150 );

  	this.canvas = document.createElement( 'canvas' );
  	this.ctx = this.canvas.getContext( '2d' );

}

CCGIFEncoder.prototype = Object.create( CCFrameEncoder );

CCGIFEncoder.prototype.start = function() {

	this.encoder.start();

}

CCGIFEncoder.prototype.add = function( canvas ) {

	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	this.ctx.drawImage( canvas, 0, 0 );
	this.encoder.addFrame( this.ctx );

	this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );

}

CCGIFEncoder.prototype.stop = function() {

	this.encoder.finish();

}

CCGIFEncoder.prototype.save = function( callback ) {

	var binary_gif = this.encoder.stream().getData();

	var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
	window.location = data_url;
	return;

	var blob = new Blob( [ binary_gif ], { type: "octet/stream" } );
	var url = window.URL.createObjectURL( blob );
	callback( url );

}*/

function CCGIFEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	settings.quality = 31 - ( ( settings.quality * 30 / 100 ) || 10 );
	settings.workers = settings.workers || 4;

	this.extension = '.gif'
	this.mimeType = 'image/gif'

  	this.canvas = document.createElement( 'canvas' );
  	this.ctx = this.canvas.getContext( '2d' );
  	this.sizeSet = false;

  	this.encoder = new GIF({
		workers: settings.workers,
		quality: settings.quality,
		workerScript: settings.workersPath + 'gif.worker.js'
	} );

    this.encoder.on( 'progress', function( progress ) {
        if ( this.settings.onProgress ) {
            this.settings.onProgress( progress )
        }
    }.bind( this ) );

    this.encoder.on('finished', function( blob ) {
        var cb = this.callback;
        if ( cb ) {
            this.callback = undefined;
            cb( blob );
        }
    }.bind( this ) );

}

CCGIFEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCGIFEncoder.prototype.add = function( canvas ) {

	if( !this.sizeSet ) {
		this.encoder.setOption( 'width',canvas.width );
		this.encoder.setOption( 'height',canvas.height );
		this.sizeSet = true;
	}

	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	this.ctx.drawImage( canvas, 0, 0 );

	this.encoder.addFrame( this.ctx, { copy: true, delay: this.settings.step } );
	this.step();

	/*this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );*/

}

CCGIFEncoder.prototype.save = function( callback ) {

    this.callback = callback;

	this.encoder.render();

}

function CCapture( settings ) {

	var _settings = settings || {},
		_date = new Date(),
		_verbose,
		_display,
		_time,
		_startTime,
		_performanceTime,
		_performanceStartTime,
		_step,
        _encoder,
		_timeouts = [],
		_intervals = [],
		_frameCount = 0,
		_intermediateFrameCount = 0,
		_lastFrame = null,
		_requestAnimationFrameCallbacks = [],
		_capturing = false,
        _handlers = {};

	_settings.framerate = _settings.framerate || 60;
	_settings.motionBlurFrames = 2 * ( _settings.motionBlurFrames || 1 );
	_verbose = _settings.verbose || false;
	_display = _settings.display || false;
	_settings.step = 1000.0 / _settings.framerate ;
	_settings.timeLimit = _settings.timeLimit || 0;
	_settings.frameLimit = _settings.frameLimit || 0;
	_settings.startTime = _settings.startTime || 0;

	var _timeDisplay = document.createElement( 'div' );
	_timeDisplay.style.position = 'absolute';
	_timeDisplay.style.left = _timeDisplay.style.top = 0
	_timeDisplay.style.backgroundColor = 'black';
	_timeDisplay.style.fontFamily = 'monospace'
	_timeDisplay.style.fontSize = '11px'
	_timeDisplay.style.padding = '5px'
	_timeDisplay.style.color = 'red';
	_timeDisplay.style.zIndex = 100000
	if( _settings.display ) document.body.appendChild( _timeDisplay );

	var canvasMotionBlur = document.createElement( 'canvas' );
	var ctxMotionBlur = canvasMotionBlur.getContext( '2d' );
	var bufferMotionBlur;
	var imageData;

	_log( 'Step is set to ' + _settings.step + 'ms' );

    var _encoders = {
		gif: CCGIFEncoder,
		webm: CCWebMEncoder,
		ffmpegserver: CCFFMpegServerEncoder,
		png: CCPNGEncoder,
		jpg: CCJPEGEncoder,
		'webm-mediarecorder': CCStreamEncoder
    };

    var ctor = _encoders[ _settings.format ];
    if ( !ctor ) {
		throw "Error: Incorrect or missing format: Valid formats are " + Object.keys(_encoders).join(", ");
    }
    _encoder = new ctor( _settings );
    _encoder.step = _step

	_encoder.on('process', _process);
    _encoder.on('progress', _progress);

    if ("performance" in window == false) {
    	window.performance = {};
    }

	Date.now = (Date.now || function () {  // thanks IE8
		return new Date().getTime();
	});

	if ("now" in window.performance == false){

		var nowOffset = Date.now();

		if (performance.timing && performance.timing.navigationStart){
			nowOffset = performance.timing.navigationStart
		}

		window.performance.now = function now(){
			return Date.now() - nowOffset;
		}
	}

	var _oldSetTimeout = window.setTimeout,
		_oldSetInterval = window.setInterval,
	    	_oldClearInterval = window.clearInterval,
		_oldClearTimeout = window.clearTimeout,
		_oldRequestAnimationFrame = window.requestAnimationFrame,
		_oldNow = window.Date.now,
		_oldPerformanceNow = window.performance.now,
		_oldGetTime = window.Date.prototype.getTime;
	// Date.prototype._oldGetTime = Date.prototype.getTime;

	var media = [];

	function _init() {

		_log( 'Capturer start' );

		_startTime = window.Date.now();
		_time = _startTime + _settings.startTime;
		_performanceStartTime = window.performance.now();
		_performanceTime = _performanceStartTime + _settings.startTime;

		window.Date.prototype.getTime = function(){
			return _time;
		};
		window.Date.now = function() {
			return _time;
		};

		window.setTimeout = function( callback, time ) {
			var t = {
				callback: callback,
				time: time,
				triggerTime: _time + time
			};
			_timeouts.push( t );
			_log( 'Timeout set to ' + t.time );
            return t;
		};
		window.clearTimeout = function( id ) {
			for( var j = 0; j < _timeouts.length; j++ ) {
				if( _timeouts[ j ] == id ) {
					_timeouts.splice( j, 1 );
					_log( 'Timeout cleared' );
					continue;
				}
			}
		};
		window.setInterval = function( callback, time ) {
			var t = {
				callback: callback,
				time: time,
				triggerTime: _time + time
			};
			_intervals.push( t );
			_log( 'Interval set to ' + t.time );
			return t;
		};
		window.clearInterval = function( id ) {
			_log( 'clear Interval' );
			return null;
		};
		window.requestAnimationFrame = function( callback ) {
			_requestAnimationFrameCallbacks.push( callback );
		};
		window.performance.now = function(){
			return _performanceTime;
		};

		function hookCurrentTime() { 
			if( !this._hooked ) {
				this._hooked = true;
				this._hookedTime = this.currentTime || 0;
				this.pause();
				media.push( this );
			}
			return this._hookedTime + _settings.startTime;
		};

		try {
			Object.defineProperty( HTMLVideoElement.prototype, 'currentTime', { get: hookCurrentTime } )
			Object.defineProperty( HTMLAudioElement.prototype, 'currentTime', { get: hookCurrentTime } )
		} catch (err) {
			_log(err);
		}

	}

	function _start() {
		_init();
		_encoder.start();
		_capturing = true;
	}

	function _stop() {
		_capturing = false;
		_encoder.stop();
		_destroy();
	}

	function _call( fn, p ) {
		_oldSetTimeout( fn, 0, p );
	}

	function _step() {
		//_oldRequestAnimationFrame( _process );
		_call( _process );
	}

	function _destroy() {
		_log( 'Capturer stop' );
		window.setTimeout = _oldSetTimeout;
		window.setInterval = _oldSetInterval;
		window.clearInterval = _oldClearInterval;
		window.clearTimeout = _oldClearTimeout;
		window.requestAnimationFrame = _oldRequestAnimationFrame;
		window.Date.prototype.getTime = _oldGetTime;
		window.Date.now = _oldNow;
		window.performance.now = _oldPerformanceNow;
	}

	function _updateTime() {
		var seconds = _frameCount / _settings.framerate;
		if( ( _settings.frameLimit && _frameCount >= _settings.frameLimit ) || ( _settings.timeLimit && seconds >= _settings.timeLimit ) ) {
			_stop();
			_save();
		}
		var d = new Date( null );
		d.setSeconds( seconds );
		if( _settings.motionBlurFrames > 2 ) {
			_timeDisplay.textContent = 'CCapture ' + _settings.format + ' | ' + _frameCount + ' frames (' + _intermediateFrameCount + ' inter) | ' +  d.toISOString().substr( 11, 8 );
		} else {
			_timeDisplay.textContent = 'CCapture ' + _settings.format + ' | ' + _frameCount + ' frames | ' +  d.toISOString().substr( 11, 8 );
		}
	}

	function _checkFrame( canvas ) {

		if( canvasMotionBlur.width !== canvas.width || canvasMotionBlur.height !== canvas.height ) {
			canvasMotionBlur.width = canvas.width;
			canvasMotionBlur.height = canvas.height;
			bufferMotionBlur = new Uint16Array( canvasMotionBlur.height * canvasMotionBlur.width * 4 );
			ctxMotionBlur.fillStyle = '#0'
			ctxMotionBlur.fillRect( 0, 0, canvasMotionBlur.width, canvasMotionBlur.height );
		}

	}

	function _blendFrame( canvas ) {

		//_log( 'Intermediate Frame: ' + _intermediateFrameCount );

		ctxMotionBlur.drawImage( canvas, 0, 0 );
		imageData = ctxMotionBlur.getImageData( 0, 0, canvasMotionBlur.width, canvasMotionBlur.height );
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			bufferMotionBlur[ j ] += imageData.data[ j ];
			bufferMotionBlur[ j + 1 ] += imageData.data[ j + 1 ];
			bufferMotionBlur[ j + 2 ] += imageData.data[ j + 2 ];
		}
		_intermediateFrameCount++;

	}

	function _saveFrame(){

		var data = imageData.data;
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			data[ j ] = bufferMotionBlur[ j ] * 2 / _settings.motionBlurFrames;
			data[ j + 1 ] = bufferMotionBlur[ j + 1 ] * 2 / _settings.motionBlurFrames;
			data[ j + 2 ] = bufferMotionBlur[ j + 2 ] * 2 / _settings.motionBlurFrames;
		}
		ctxMotionBlur.putImageData( imageData, 0, 0 );
		_encoder.add( canvasMotionBlur );
		_frameCount++;
		_intermediateFrameCount = 0;
		_log( 'Full MB Frame! ' + _frameCount + ' ' +  _time );
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			bufferMotionBlur[ j ] = 0;
			bufferMotionBlur[ j + 1 ] = 0;
			bufferMotionBlur[ j + 2 ] = 0;
		}
		gc();

	}

	function _capture( canvas ) {

		if( _capturing ) {

			if( _settings.motionBlurFrames > 2 ) {

				_checkFrame( canvas );
				_blendFrame( canvas );

				if( _intermediateFrameCount >= .5 * _settings.motionBlurFrames ) {
					_saveFrame();
				} else {
					_step();
				}

			} else {
				_encoder.add( canvas );
				_frameCount++;
				_log( 'Full Frame! ' + _frameCount );
			}

		}

	}

	function _process() {

		var step = 1000 / _settings.framerate;
		var dt = ( _frameCount + _intermediateFrameCount / _settings.motionBlurFrames ) * step;

		_time = _startTime + dt;
		_performanceTime = _performanceStartTime + dt;

		media.forEach( function( v ) {
			v._hookedTime = dt / 1000;
		} );

		_updateTime();
		_log( 'Frame: ' + _frameCount + ' ' + _intermediateFrameCount );

		for( var j = 0; j < _timeouts.length; j++ ) {
			if( _time >= _timeouts[ j ].triggerTime ) {
				_call( _timeouts[ j ].callback )
				//console.log( 'timeout!' );
				_timeouts.splice( j, 1 );
				continue;
			}
		}

		for( var j = 0; j < _intervals.length; j++ ) {
			if( _time >= _intervals[ j ].triggerTime ) {
				_call( _intervals[ j ].callback );
				_intervals[ j ].triggerTime += _intervals[ j ].time;
				//console.log( 'interval!' );
				continue;
			}
		}

		_requestAnimationFrameCallbacks.forEach( function( cb ) {
     		_call( cb, _time - g_startTime );
        } );
        _requestAnimationFrameCallbacks = [];

	}

	function _save( callback ) {

		if( !callback ) {
			callback = function( blob ) {
				download( blob, _encoder.filename + _encoder.extension, _encoder.mimeType );
				return false;
			}
		}
		_encoder.save( callback );

	}

	function _log( message ) {
		if( _verbose ) console.log( message );
	}

    function _on( event, handler ) {

        _handlers[event] = handler;

    }

    function _emit( event ) {

        var handler = _handlers[event];
        if ( handler ) {

            handler.apply( null, Array.prototype.slice.call( arguments, 1 ) );

        }

    }

    function _progress( progress ) {

        _emit( 'progress', progress );

    }

	return {
		start: _start,
		capture: _capture,
		stop: _stop,
		save: _save,
        on: _on
	}
}

(freeWindow || freeSelf || {}).CCapture = CCapture;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
    	return CCapture;
    });
}
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js.
    if (moduleExports) {
    	(freeModule.exports = CCapture).CCapture = CCapture;
    }
    // Export for CommonJS support.
    freeExports.CCapture = CCapture;
}
else {
    // Export to the global object.
    root.CCapture = CCapture;
}

}());

/**
 * A tool for presenting an ArrayBuffer as a stream for writing some simple data types.
 * 
 * By Nicholas Sherlock
 * 
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */

"use strict";

(function(){
    /*
     * Create an ArrayBuffer of the given length and present it as a writable stream with methods
     * for writing data in different formats.
     */
    var ArrayBufferDataStream = function(length) {
        this.data = new Uint8Array(length);
        this.pos = 0;
    };
    
    ArrayBufferDataStream.prototype.seek = function(offset) {
        this.pos = offset;
    };

    ArrayBufferDataStream.prototype.writeBytes = function(arr) {
        for (var i = 0; i < arr.length; i++) {
            this.data[this.pos++] = arr[i];
        }
    };

    ArrayBufferDataStream.prototype.writeByte = function(b) {
        this.data[this.pos++] = b;
    };
    
    //Synonym:
    ArrayBufferDataStream.prototype.writeU8 = ArrayBufferDataStream.prototype.writeByte;
    
    ArrayBufferDataStream.prototype.writeU16BE = function(u) {
        this.data[this.pos++] = u >> 8;
        this.data[this.pos++] = u;
    };

    ArrayBufferDataStream.prototype.writeDoubleBE = function(d) {
        var 
            bytes = new Uint8Array(new Float64Array([d]).buffer);
        
        for (var i = bytes.length - 1; i >= 0; i--) {
            this.writeByte(bytes[i]);
        }
    };

    ArrayBufferDataStream.prototype.writeFloatBE = function(d) {
        var 
            bytes = new Uint8Array(new Float32Array([d]).buffer);
        
        for (var i = bytes.length - 1; i >= 0; i--) {
            this.writeByte(bytes[i]);
        }
    };

    /**
     * Write an ASCII string to the stream
     */
    ArrayBufferDataStream.prototype.writeString = function(s) {
        for (var i = 0; i < s.length; i++) {
            this.data[this.pos++] = s.charCodeAt(i);
        }
    };

    /**
     * Write the given 32-bit integer to the stream as an EBML variable-length integer using the given byte width 
     * (use measureEBMLVarInt).
     * 
     * No error checking is performed to ensure that the supplied width is correct for the integer.
     * 
     * @param i Integer to be written
     * @param width Number of bytes to write to the stream
     */
    ArrayBufferDataStream.prototype.writeEBMLVarIntWidth = function(i, width) {
        switch (width) {
            case 1:
                this.writeU8((1 << 7) | i);
            break;
            case 2:
                this.writeU8((1 << 6) | (i >> 8));
                this.writeU8(i);
            break;
            case 3:
                this.writeU8((1 << 5) | (i >> 16));
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            case 4:
                this.writeU8((1 << 4) | (i >> 24));
                this.writeU8(i >> 16);
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            case 5:
                /* 
                 * JavaScript converts its doubles to 32-bit integers for bitwise operations, so we need to do a 
                 * division by 2^32 instead of a right-shift of 32 to retain those top 3 bits
                 */
                this.writeU8((1 << 3) | ((i / 4294967296) & 0x7)); 
                this.writeU8(i >> 24);
                this.writeU8(i >> 16);
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            default:
                throw new RuntimeException("Bad EBML VINT size " + width);
        }
    };
    
    /**
     * Return the number of bytes needed to encode the given integer as an EBML VINT.
     */
    ArrayBufferDataStream.prototype.measureEBMLVarInt = function(val) {
        if (val < (1 << 7) - 1) { 
            /* Top bit is set, leaving 7 bits to hold the integer, but we can't store 127 because
             * "all bits set to one" is a reserved value. Same thing for the other cases below:
             */
            return 1;
        } else if (val < (1 << 14) - 1) {
            return 2;
        } else if (val < (1 << 21) - 1) {
            return 3;
        } else if (val < (1 << 28) - 1) {
            return 4;
        } else if (val < 34359738367) { // 2 ^ 35 - 1 (can address 32GB)
            return 5;
        } else {
            throw new RuntimeException("EBML VINT size not supported " + val);
        }
    };
    
    ArrayBufferDataStream.prototype.writeEBMLVarInt = function(i) {
        this.writeEBMLVarIntWidth(i, this.measureEBMLVarInt(i));
    };
    
    /**
     * Write the given unsigned 32-bit integer to the stream in big-endian order using the given byte width.
     * No error checking is performed to ensure that the supplied width is correct for the integer.
     * 
     * Omit the width parameter to have it determined automatically for you.
     * 
     * @param u Unsigned integer to be written
     * @param width Number of bytes to write to the stream
     */
    ArrayBufferDataStream.prototype.writeUnsignedIntBE = function(u, width) {
        if (width === undefined) {
            width = this.measureUnsignedInt(u);
        }
        
        // Each case falls through:
        switch (width) {
            case 5:
                this.writeU8(Math.floor(u / 4294967296)); // Need to use division to access >32 bits of floating point var
            case 4:
                this.writeU8(u >> 24);
            case 3:
                this.writeU8(u >> 16);
            case 2:
                this.writeU8(u >> 8);
            case 1:
                this.writeU8(u);
            break;
            default:
                throw new RuntimeException("Bad UINT size " + width);
        }
    };
    
    /**
     * Return the number of bytes needed to hold the non-zero bits of the given unsigned integer.
     */
    ArrayBufferDataStream.prototype.measureUnsignedInt = function(val) {
        // Force to 32-bit unsigned integer
        if (val < (1 << 8)) {
            return 1;
        } else if (val < (1 << 16)) {
            return 2;
        } else if (val < (1 << 24)) {
            return 3;
        } else if (val < 4294967296) {
            return 4;
        } else {
            return 5;
        }
    };

    /**
     * Return a view on the portion of the buffer from the beginning to the current seek position as a Uint8Array.
     */
    ArrayBufferDataStream.prototype.getAsDataArray = function() {
        if (this.pos < this.data.byteLength) {
            return this.data.subarray(0, this.pos);
        } else if (this.pos == this.data.byteLength) {
            return this.data;
        } else {
            throw "ArrayBufferDataStream's pos lies beyond end of buffer";
        }
    };
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = ArrayBufferDataStream;
	} else {
		window.ArrayBufferDataStream = ArrayBufferDataStream;
	}
}());"use strict";

/**
 * Allows a series of Blob-convertible objects (ArrayBuffer, Blob, String, etc) to be added to a buffer. Seeking and
 * overwriting of blobs is allowed.
 * 
 * You can supply a FileWriter, in which case the BlobBuffer is just used as temporary storage before it writes it 
 * through to the disk.
 * 
 * By Nicholas Sherlock
 * 
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */
(function() {
	var BlobBuffer = function(fs) {
		return function(destination) {
			var
				buffer = [],
				writePromise = Promise.resolve(),
				fileWriter = null,
				fd = null;
			
			if (typeof FileWriter !== "undefined" && destination instanceof FileWriter) {
				fileWriter = destination;
			} else if (fs && destination) {
				fd = destination;
			}
			
			// Current seek offset
			this.pos = 0;
			
			// One more than the index of the highest byte ever written
			this.length = 0;
			
			// Returns a promise that converts the blob to an ArrayBuffer
			function readBlobAsBuffer(blob) {
				return new Promise(function (resolve, reject) {
					var
						reader = new FileReader();
					
					reader.addEventListener("loadend", function () {
						resolve(reader.result);
					});
					
					reader.readAsArrayBuffer(blob);
				});
			}
			
			function convertToUint8Array(thing) {
				return new Promise(function (resolve, reject) {
					if (thing instanceof Uint8Array) {
						resolve(thing);
					} else if (thing instanceof ArrayBuffer || ArrayBuffer.isView(thing)) {
						resolve(new Uint8Array(thing));
					} else if (thing instanceof Blob) {
						resolve(readBlobAsBuffer(thing).then(function (buffer) {
							return new Uint8Array(buffer);
						}));
					} else {
						//Assume that Blob will know how to read this thing
						resolve(readBlobAsBuffer(new Blob([thing])).then(function (buffer) {
							return new Uint8Array(buffer);
						}));
					}
				});
			}
			
			function measureData(data) {
				var
					result = data.byteLength || data.length || data.size;
				
				if (!Number.isInteger(result)) {
					throw "Failed to determine size of element";
				}
				
				return result;
			}
			
			/**
			 * Seek to the given absolute offset.
			 *
			 * You may not seek beyond the end of the file (this would create a hole and/or allow blocks to be written in non-
			 * sequential order, which isn't currently supported by the memory buffer backend).
			 */
			this.seek = function (offset) {
				if (offset < 0) {
					throw "Offset may not be negative";
				}
				
				if (isNaN(offset)) {
					throw "Offset may not be NaN";
				}
				
				if (offset > this.length) {
					throw "Seeking beyond the end of file is not allowed";
				}
				
				this.pos = offset;
			};
			
			/**
			 * Write the Blob-convertible data to the buffer at the current seek position.
			 *
			 * Note: If overwriting existing data, the write must not cross preexisting block boundaries (written data must
			 * be fully contained by the extent of a previous write).
			 */
			this.write = function (data) {
				var
					newEntry = {
						offset: this.pos,
						data: data,
						length: measureData(data)
					},
					isAppend = newEntry.offset >= this.length;
				
				this.pos += newEntry.length;
				this.length = Math.max(this.length, this.pos);
				
				// After previous writes complete, perform our write
				writePromise = writePromise.then(function () {
					if (fd) {
						return new Promise(function(resolve, reject) {
							convertToUint8Array(newEntry.data).then(function(dataArray) {
								var
									totalWritten = 0,
									buffer = Buffer.from(dataArray.buffer),
									
									handleWriteComplete = function(err, written, buffer) {
										totalWritten += written;
										
										if (totalWritten >= buffer.length) {
											resolve();
										} else {
											// We still have more to write...
											fs.write(fd, buffer, totalWritten, buffer.length - totalWritten, newEntry.offset + totalWritten, handleWriteComplete);
										}
									};
								
								fs.write(fd, buffer, 0, buffer.length, newEntry.offset, handleWriteComplete);
							});
						});
					} else if (fileWriter) {
						return new Promise(function (resolve, reject) {
							fileWriter.onwriteend = resolve;
							
							fileWriter.seek(newEntry.offset);
							fileWriter.write(new Blob([newEntry.data]));
						});
					} else if (!isAppend) {
						// We might be modifying a write that was already buffered in memory.
						
						// Slow linear search to find a block we might be overwriting
						for (var i = 0; i < buffer.length; i++) {
							var
								entry = buffer[i];
							
							// If our new entry overlaps the old one in any way...
							if (!(newEntry.offset + newEntry.length <= entry.offset || newEntry.offset >= entry.offset + entry.length)) {
								if (newEntry.offset < entry.offset || newEntry.offset + newEntry.length > entry.offset + entry.length) {
									throw new Error("Overwrite crosses blob boundaries");
								}
								
								if (newEntry.offset == entry.offset && newEntry.length == entry.length) {
									// We overwrote the entire block
									entry.data = newEntry.data;
									
									// We're done
									return;
								} else {
									return convertToUint8Array(entry.data)
										.then(function (entryArray) {
											entry.data = entryArray;
											
											return convertToUint8Array(newEntry.data);
										}).then(function (newEntryArray) {
											newEntry.data = newEntryArray;
											
											entry.data.set(newEntry.data, newEntry.offset - entry.offset);
										});
								}
							}
						}
						// Else fall through to do a simple append, as we didn't overwrite any pre-existing blocks
					}
					
					buffer.push(newEntry);
				});
			};
			
			/**
			 * Finish all writes to the buffer, returning a promise that signals when that is complete.
			 *
			 * If a FileWriter was not provided, the promise is resolved with a Blob that represents the completed BlobBuffer
			 * contents. You can optionally pass in a mimeType to be used for this blob.
			 *
			 * If a FileWriter was provided, the promise is resolved with null as the first argument.
			 */
			this.complete = function (mimeType) {
				if (fd || fileWriter) {
					writePromise = writePromise.then(function () {
						return null;
					});
				} else {
					// After writes complete we need to merge the buffer to give to the caller
					writePromise = writePromise.then(function () {
						var
							result = [];
						
						for (var i = 0; i < buffer.length; i++) {
							result.push(buffer[i].data);
						}
						
						return new Blob(result, {mimeType: mimeType});
					});
				}
				
				return writePromise;
			};
		};
	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = BlobBuffer(require('fs'));
	} else {
		window.BlobBuffer = BlobBuffer(null);
	}
})();/**
 * WebM video encoder for Google Chrome. This implementation is suitable for creating very large video files, because
 * it can stream Blobs directly to a FileWriter without buffering the entire video in memory.
 * 
 * When FileWriter is not available or not desired, it can buffer the video in memory as a series of Blobs which are 
 * eventually returned as one composite Blob.
 * 
 * By Nicholas Sherlock.
 * 
 * Based on the ideas from Whammy: https://github.com/antimatter15/whammy
 * 
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */

"use strict";

(function() {
    var WebMWriter = function(ArrayBufferDataStream, BlobBuffer) {
        function extend(base, top) {
            var
                target = {};
            
            [base, top].forEach(function(obj) {
                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        target[prop] = obj[prop];
                    }
                }
            });
            
            return target;
        }
        
        /**
         * Decode a Base64 data URL into a binary string.
         *
         * Returns the binary string, or false if the URL could not be decoded.
         */
        function decodeBase64WebPDataURL(url) {
            if (typeof url !== "string" || !url.match(/^data:image\/webp;base64,/i)) {
                return false;
            }
            
            return window.atob(url.substring("data:image\/webp;base64,".length));
        }
        
        /**
         * Convert a raw binary string (one character = one output byte) to an ArrayBuffer
         */
        function stringToArrayBuffer(string) {
            var
                buffer = new ArrayBuffer(string.length),
                int8Array = new Uint8Array(buffer);
            
            for (var i = 0; i < string.length; i++) {
                int8Array[i] = string.charCodeAt(i);
            }
            
            return buffer;
        }
        
        /**
         * Convert the given canvas to a WebP encoded image and return the image data as a string.
         */
        function renderAsWebP(canvas, quality) {
            var
                frame = canvas.toDataURL('image/webp', {quality: quality});
            
            return decodeBase64WebPDataURL(frame);
        }
        
        function extractKeyframeFromWebP(webP) {
            // Assume that Chrome will generate a Simple Lossy WebP which has this header:
            var
                keyframeStartIndex = webP.indexOf('VP8 ');
            
            if (keyframeStartIndex == -1) {
                throw "Failed to identify beginning of keyframe in WebP image";
            }
            
            // Skip the header and the 4 bytes that encode the length of the VP8 chunk
            keyframeStartIndex += 'VP8 '.length + 4;
            
            return webP.substring(keyframeStartIndex);
        }
        
        // Just a little utility so we can tag values as floats for the EBML encoder's benefit
        function EBMLFloat32(value) {
            this.value = value;
        }
        
        function EBMLFloat64(value) {
            this.value = value;
        }
        
        /**
         * Write the given EBML object to the provided ArrayBufferStream.
         *
         * The buffer's first byte is at bufferFileOffset inside the video file. This is used to complete offset and
         * dataOffset fields in each EBML structure, indicating the file offset of the first byte of the EBML element and
         * its data payload.
         */
        function writeEBML(buffer, bufferFileOffset, ebml) {
            // Is the ebml an array of sibling elements?
            if (Array.isArray(ebml)) {
                for (var i = 0; i < ebml.length; i++) {
                    writeEBML(buffer, bufferFileOffset, ebml[i]);
                }
            // Is this some sort of raw data that we want to write directly?
            } else if (typeof ebml === "string") {
                buffer.writeString(ebml);
            } else if (ebml instanceof Uint8Array) {
                buffer.writeBytes(ebml);
            } else if (ebml.id){
                // We're writing an EBML element
                ebml.offset = buffer.pos + bufferFileOffset;
                
                buffer.writeUnsignedIntBE(ebml.id); // ID field
                
                // Now we need to write the size field, so we must know the payload size:
                
                if (Array.isArray(ebml.data)) {
                    // Writing an array of child elements. We won't try to measure the size of the children up-front
                    
                    var
                        sizePos, dataBegin, dataEnd;
                    
                    if (ebml.size === -1) {
                        // Write the reserved all-one-bits marker to note that the size of this element is unknown/unbounded
                        buffer.writeByte(0xFF);
                    } else {
                        sizePos = buffer.pos;
                        
                        /* Write a dummy size field to overwrite later. 4 bytes allows an element maximum size of 256MB,
                         * which should be plenty (we don't want to have to buffer that much data in memory at one time
                         * anyway!)
                         */
                        buffer.writeBytes([0, 0, 0, 0]);
                    }
                    
                    dataBegin = buffer.pos;
                    
                    ebml.dataOffset = dataBegin + bufferFileOffset;
                    writeEBML(buffer, bufferFileOffset, ebml.data);
                    
                    if (ebml.size !== -1) {
                        dataEnd = buffer.pos;
                        
                        ebml.size = dataEnd - dataBegin;
                        
                        buffer.seek(sizePos);
                        buffer.writeEBMLVarIntWidth(ebml.size, 4); // Size field
                        
                        buffer.seek(dataEnd);
                    }
                } else if (typeof ebml.data === "string") {
                    buffer.writeEBMLVarInt(ebml.data.length); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeString(ebml.data);
                } else if (typeof ebml.data === "number") {
                    // Allow the caller to explicitly choose the size if they wish by supplying a size field
                    if (!ebml.size) {
                        ebml.size = buffer.measureUnsignedInt(ebml.data);
                    }
                    
                    buffer.writeEBMLVarInt(ebml.size); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeUnsignedIntBE(ebml.data, ebml.size);
                } else if (ebml.data instanceof EBMLFloat64) {
                    buffer.writeEBMLVarInt(8); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeDoubleBE(ebml.data.value);
                } else if (ebml.data instanceof EBMLFloat32) {
                    buffer.writeEBMLVarInt(4); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeFloatBE(ebml.data.value);
                } else if (ebml.data instanceof Uint8Array) {
                    buffer.writeEBMLVarInt(ebml.data.byteLength); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeBytes(ebml.data);
                } else {
                    throw "Bad EBML datatype " + typeof ebml.data;
                }
            } else {
                throw "Bad EBML datatype " + typeof ebml.data;
            }
        }
        
        return function(options) {
            var
                MAX_CLUSTER_DURATION_MSEC = 5000,
                DEFAULT_TRACK_NUMBER = 1,
            
                writtenHeader = false,
                videoWidth, videoHeight,
                
                clusterFrameBuffer = [],
                clusterStartTime = 0,
                clusterDuration = 0,
                
                optionDefaults = {
                    quality: 0.95,       // WebM image quality from 0.0 (worst) to 1.0 (best)
                    fileWriter: null,    // Chrome FileWriter in order to stream to a file instead of buffering to memory (optional)
                    fd: null,            // Node.JS file descriptor to write to instead of buffering (optional)
                    
                    // You must supply one of:
                    frameDuration: null, // Duration of frames in milliseconds
                    frameRate: null,     // Number of frames per second
                },
                
                seekPoints = {
                    Cues: {id: new Uint8Array([0x1C, 0x53, 0xBB, 0x6B]), positionEBML: null},
                    SegmentInfo: {id: new Uint8Array([0x15, 0x49, 0xA9, 0x66]), positionEBML: null},
                    Tracks: {id: new Uint8Array([0x16, 0x54, 0xAE, 0x6B]), positionEBML: null},
                },
                
                ebmlSegment,
                segmentDuration = {
                    "id": 0x4489, // Duration
                    "data": new EBMLFloat64(0)
                },
                
                seekHead,
                
                cues = [],
                
                blobBuffer = new BlobBuffer(options.fileWriter || options.fd);
    
            function fileOffsetToSegmentRelative(fileOffset) {
                return fileOffset - ebmlSegment.dataOffset;
            }
            
            /**
             * Create a SeekHead element with descriptors for the points in the global seekPoints array.
             *
             * 5 bytes of position values are reserved for each node, which lie at the offset point.positionEBML.dataOffset,
             * to be overwritten later.
             */
            function createSeekHead() {
                var
                    seekPositionEBMLTemplate = {
                        "id": 0x53AC, // SeekPosition
                        "size": 5, // Allows for 32GB video files
                        "data": 0 // We'll overwrite this when the file is complete
                    },
                    
                    result = {
                        "id": 0x114D9B74, // SeekHead
                        "data": []
                    };
                
                for (var name in seekPoints) {
                    var
                        seekPoint = seekPoints[name];
                
                    seekPoint.positionEBML = Object.create(seekPositionEBMLTemplate);
                    
                    result.data.push({
                         "id": 0x4DBB, // Seek
                         "data": [
                              {
                                  "id": 0x53AB, // SeekID
                                  "data": seekPoint.id
                              },
                              seekPoint.positionEBML
                         ]
                    });
                }
                
                return result;
            }
            
            /**
             * Write the WebM file header to the stream.
             */
            function writeHeader() {
                seekHead = createSeekHead();
                
                var
                    ebmlHeader = {
                        "id": 0x1a45dfa3, // EBML
                        "data": [
                            {
                                "id": 0x4286, // EBMLVersion
                                "data": 1
                            },
                            {
                                "id": 0x42f7, // EBMLReadVersion
                                "data": 1
                            },
                            {
                                "id": 0x42f2, // EBMLMaxIDLength
                                "data": 4
                            },
                            {
                                "id": 0x42f3, // EBMLMaxSizeLength
                                "data": 8
                            },
                            {
                                "id": 0x4282, // DocType
                                "data": "webm"
                            },
                            {
                                "id": 0x4287, // DocTypeVersion
                                "data": 2
                            },
                            {
                                "id": 0x4285, // DocTypeReadVersion
                                "data": 2
                            }
                        ]
                    },
                    
                    segmentInfo = {
                        "id": 0x1549a966, // Info
                        "data": [
                            {
                                "id": 0x2ad7b1, // TimecodeScale
                                "data": 1e6 // Times will be in miliseconds (1e6 nanoseconds per step = 1ms)
                            },
                            {
                                "id": 0x4d80, // MuxingApp
                                "data": "webm-writer-js",
                            },
                            {
                                "id": 0x5741, // WritingApp
                                "data": "webm-writer-js"
                            },
                            segmentDuration // To be filled in later
                        ]
                    },
                    
                    tracks = {
                        "id": 0x1654ae6b, // Tracks
                        "data": [
                            {
                                "id": 0xae, // TrackEntry
                                "data": [
                                    {
                                        "id": 0xd7, // TrackNumber
                                        "data": DEFAULT_TRACK_NUMBER
                                    },
                                    {
                                        "id": 0x73c5, // TrackUID
                                        "data": DEFAULT_TRACK_NUMBER
                                    },
                                    {
                                        "id": 0x9c, // FlagLacing
                                        "data": 0
                                    },
                                    {
                                        "id": 0x22b59c, // Language
                                        "data": "und"
                                    },
                                    {
                                        "id": 0x86, // CodecID
                                        "data": "V_VP8"
                                    },
                                    {
                                        "id": 0x258688, // CodecName
                                        "data": "VP8"
                                    },
                                    {
                                        "id": 0x83, // TrackType
                                        "data": 1
                                    },
                                    {
                                        "id": 0xe0,  // Video
                                        "data": [
                                            {
                                                "id": 0xb0, // PixelWidth
                                                "data": videoWidth
                                            },
                                            {
                                                "id": 0xba, // PixelHeight
                                                "data": videoHeight
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };
                
                ebmlSegment = {
                    "id": 0x18538067, // Segment
                    "size": -1, // Unbounded size
                    "data": [
                        seekHead,
                        segmentInfo,
                        tracks,
                    ]
                };
                
                var
                    bufferStream = new ArrayBufferDataStream(256);
                    
                writeEBML(bufferStream, blobBuffer.pos, [ebmlHeader, ebmlSegment]);
                blobBuffer.write(bufferStream.getAsDataArray());
                
                // Now we know where these top-level elements lie in the file:
                seekPoints.SegmentInfo.positionEBML.data = fileOffsetToSegmentRelative(segmentInfo.offset);
                seekPoints.Tracks.positionEBML.data = fileOffsetToSegmentRelative(tracks.offset);
            };
            
            /**
             * Create a SimpleBlock keyframe header using these fields:
             *     timecode    - Time of this keyframe
             *     trackNumber - Track number from 1 to 126 (inclusive)
             *     frame       - Raw frame data payload string
             *
             * Returns an EBML element.
             */
            function createKeyframeBlock(keyframe) {
                var
                    bufferStream = new ArrayBufferDataStream(1 + 2 + 1);
                
                if (!(keyframe.trackNumber > 0 && keyframe.trackNumber < 127)) {
                    throw "TrackNumber must be > 0 and < 127";
                }
    
                bufferStream.writeEBMLVarInt(keyframe.trackNumber); // Always 1 byte since we limit the range of trackNumber
                bufferStream.writeU16BE(keyframe.timecode);
                
                // Flags byte
                bufferStream.writeByte(
                    1 << 7 // Keyframe
                );
                
                return {
                    "id": 0xA3, // SimpleBlock
                    "data": [
                         bufferStream.getAsDataArray(),
                         keyframe.frame
                    ]
                };
            }
            
            /**
             * Create a Cluster node using these fields:
             *
             *    timecode    - Start time for the cluster
             *
             * Returns an EBML element.
             */
            function createCluster(cluster) {
                return {
                    "id": 0x1f43b675,
                    "data": [
                         {
                            "id": 0xe7, // Timecode
                            "data": Math.round(cluster.timecode)
                         }
                    ]
                };
            }
            
            function addCuePoint(trackIndex, clusterTime, clusterFileOffset) {
                cues.push({
                    "id": 0xBB, // Cue
                    "data": [
                         {
                             "id": 0xB3, // CueTime
                             "data": clusterTime
                         },
                         {
                             "id": 0xB7, // CueTrackPositions
                             "data": [
                                  {
                                      "id": 0xF7, // CueTrack
                                      "data": trackIndex
                                  },
                                  {
                                      "id": 0xF1, // CueClusterPosition
                                      "data": fileOffsetToSegmentRelative(clusterFileOffset)
                                  }
                             ]
                         }
                    ]
                });
            }
            
            /**
             * Write a Cues element to the blobStream using the global `cues` array of CuePoints (use addCuePoint()).
             * The seek entry for the Cues in the SeekHead is updated.
             */
            function writeCues() {
                var
                    ebml = {
                        "id": 0x1C53BB6B,
                        "data": cues
                    },
                    
                    cuesBuffer = new ArrayBufferDataStream(16 + cues.length * 32); // Pretty crude estimate of the buffer size we'll need
                
                writeEBML(cuesBuffer, blobBuffer.pos, ebml);
                blobBuffer.write(cuesBuffer.getAsDataArray());
                
                // Now we know where the Cues element has ended up, we can update the SeekHead
                seekPoints.Cues.positionEBML.data = fileOffsetToSegmentRelative(ebml.offset);
            }
            
            /**
             * Flush the frames in the current clusterFrameBuffer out to the stream as a Cluster.
             */
            function flushClusterFrameBuffer() {
                if (clusterFrameBuffer.length == 0) {
                    return;
                }
    
                // First work out how large of a buffer we need to hold the cluster data
                var
                    rawImageSize = 0;
                
                for (var i = 0; i < clusterFrameBuffer.length; i++) {
                    rawImageSize += clusterFrameBuffer[i].frame.length;
                }
                
                var
                    buffer = new ArrayBufferDataStream(rawImageSize + clusterFrameBuffer.length * 32), // Estimate 32 bytes per SimpleBlock header
    
                    cluster = createCluster({
                        timecode: Math.round(clusterStartTime),
                    });
                    
                for (var i = 0; i < clusterFrameBuffer.length; i++) {
                    cluster.data.push(createKeyframeBlock(clusterFrameBuffer[i]));
                }
                
                writeEBML(buffer, blobBuffer.pos, cluster);
                blobBuffer.write(buffer.getAsDataArray());
                
                addCuePoint(DEFAULT_TRACK_NUMBER, Math.round(clusterStartTime), cluster.offset);
                
                clusterFrameBuffer = [];
                clusterStartTime += clusterDuration;
                clusterDuration = 0;
            }
            
            function validateOptions() {
                // Derive frameDuration setting if not already supplied
                if (!options.frameDuration) {
                    if (options.frameRate) {
                        options.frameDuration = 1000 / options.frameRate;
                    } else {
                        throw "Missing required frameDuration or frameRate setting";
                    }
                }
            }
            
            function addFrameToCluster(frame) {
                frame.trackNumber = DEFAULT_TRACK_NUMBER;
                
                // Frame timecodes are relative to the start of their cluster:
                frame.timecode = Math.round(clusterDuration);
    
                clusterFrameBuffer.push(frame);
                
                clusterDuration += frame.duration;
                
                if (clusterDuration >= MAX_CLUSTER_DURATION_MSEC) {
                    flushClusterFrameBuffer();
                }
            }
            
            /**
             * Rewrites the SeekHead element that was initially written to the stream with the offsets of top level elements.
             *
             * Call once writing is complete (so the offset of all top level elements is known).
             */
            function rewriteSeekHead() {
                var
                    seekHeadBuffer = new ArrayBufferDataStream(seekHead.size),
                    oldPos = blobBuffer.pos;
                
                // Write the rewritten SeekHead element's data payload to the stream (don't need to update the id or size)
                writeEBML(seekHeadBuffer, seekHead.dataOffset, seekHead.data);
                
                // And write that through to the file
                blobBuffer.seek(seekHead.dataOffset);
                blobBuffer.write(seekHeadBuffer.getAsDataArray());
    
                blobBuffer.seek(oldPos);
            }
            
            /**
             * Rewrite the Duration field of the Segment with the newly-discovered video duration.
             */
            function rewriteDuration() {
                var
                    buffer = new ArrayBufferDataStream(8),
                    oldPos = blobBuffer.pos;
                
                // Rewrite the data payload (don't need to update the id or size)
                buffer.writeDoubleBE(clusterStartTime);
                
                // And write that through to the file
                blobBuffer.seek(segmentDuration.dataOffset);
                blobBuffer.write(buffer.getAsDataArray());
        
                blobBuffer.seek(oldPos);
            }
            
            /**
             * Add a frame to the video. Currently the frame must be a Canvas element.
             */
            this.addFrame = function(canvas) {
                if (writtenHeader) {
                    if (canvas.width != videoWidth || canvas.height != videoHeight) {
                        throw "Frame size differs from previous frames";
                    }
                } else {
                    videoWidth = canvas.width;
                    videoHeight = canvas.height;
    
                    writeHeader();
                    writtenHeader = true;
                }
    
                var
                    webP = renderAsWebP(canvas, {quality: options.quality});
                
                if (!webP) {
                    throw "Couldn't decode WebP frame, does the browser support WebP?";
                }
                
                addFrameToCluster({
                    frame: extractKeyframeFromWebP(webP),
                    duration: options.frameDuration
                });
            };
            
            /**
             * Finish writing the video and return a Promise to signal completion.
             *
             * If the destination device was memory (i.e. options.fileWriter was not supplied), the Promise is resolved with
             * a Blob with the contents of the entire video.
             */
            this.complete = function() {
                flushClusterFrameBuffer();
                
                writeCues();
                rewriteSeekHead();
                rewriteDuration();
                
                return blobBuffer.complete('video/webm');
            };
            
            this.getWrittenSize = function() {
                return blobBuffer.length;
            };
    
            options = extend(optionDefaults, options || {});
            validateOptions();
        };
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    module.exports = WebMWriter(require("./ArrayBufferDataStream"), require("./BlobBuffer"));
    } else {
	    window.WebMWriter = WebMWriter(ArrayBufferDataStream, BlobBuffer);
    }
})();
