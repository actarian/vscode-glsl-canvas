/* global window, document, console */

(function () {
    'use strict';

    var TrailsService = function () {

        function TrailsService() {
            var service = this;
            service.mouse = new Float32Array([0.0, 0.0]);
            service.history = [];
            service.trails = new Array(10).fill(null).map(function () {
                return new Float32Array([0.0, 0.0]);
            });
        }

        TrailsService.prototype = {
            render: render,
            move: move,
            push: throttle(_push, 1000 / 60),
            update: update,
        };

        // statics

        var getNow = Date.now || function () {
            return new Date().getTime();
        };

        function throttle(func, wait, options) {
            // Returns a function, that, when invoked, will only be triggered at most once
            // during a given window of time. Normally, the throttled function will run
            // as much as it can, without ever going more than once per `wait` duration;
            // but if you'd like to disable the execution on the leading edge, pass
            // `{leading: false}`. To disable execution on the trailing edge, ditto.
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function () {
                previous = options.leading === false ? 0 : getNow();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
                var now = getNow();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        }

        // publics

        var ti = 0;

        function render(glsl) {
            var service = this;
            var trails = service.trails,
                history = service.history,
                mouse = service.mouse;

            var i = 0,
                t = trails.length;
            var tx = history.length ? history[0] : mouse;
            while (i < t) {
                var e = (i > 0 ? trails[i - 1] : tx);
                var v = trails[i];
                var friction = 1.0 / (5.0 + i);
                v[0] += (e[0] - v[0]) * friction;
                v[1] += (e[1] - v[1]) * friction;
                service.update(glsl, '2fv', 'vec2', 'u_trails[' + i + ']', v);
                i++;
            }
            if (history.length) {
                history.shift();
            }
            /*
            var d = trails[0];
            if (history.length && Math.abs(d.x - tx.x) < 2 && Math.abs(d.y - tx.y) < 2) {
                history.shift();
            }
            */
            /*
            ti++;
            if (ti % 10 === 0 && history.length > 0) {
                history.shift();
            }
            */
            /*
            fastUpdate('2fv', 'vec2', 'u_trails[10]', trails);
            console.log('parseUniforms', parseUniforms({
                u_trails: value
            }));
            */
            // onUpdateUniforms();
            // uniforms.u_trails = trails;
            // glsl.setUniform('u_trails', trails);
            // console.log('onUpdateUniforms', trails[0][0], trails[0][1]);
        }

        function move(x, y) {
            var service = this,
                mouse = service.mouse;
            mouse[0] = x;
            mouse[1] = y;
            service.push();
        }

        function _push() {
            var service = this;
            service.history.push(new Float32Array(service.mouse));
        }

        function update(glsl, method, type, name, value) {
            try {
                var u = glsl.uniforms[name] = glsl.uniforms[name] || {};
                u.name = name;
                u.value = value;
                u.type = type;
                u.method = 'uniform' + method;
                u.location = glsl.gl.getUniformLocation(glsl.program, name);
                glsl.gl[u.method].apply(glsl.gl, [u.location].concat(u.value));
            } catch (e) {
                console.log('fastUpdate', e);
            }
        }

        return TrailsService;
    }();

    window.TrailsService = TrailsService;

}());