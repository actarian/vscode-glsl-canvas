(function () {
    'use strict';

    var Vector = function () {

        function Vector(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }

        // Instance Methods
        // The methods add(), subtract(), multiply(), and divide() can all take either a vector or a number as an argument.

        Vector.prototype = {
            negative: function () {
                return new Vector(-this.x, -this.y, -this.z);
            },
            add: function (v) {
                if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
                else return new Vector(this.x + v, this.y + v, this.z + v);
            },
            subtract: function (v) {
                if (v instanceof Vector) return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
                else return new Vector(this.x - v, this.y - v, this.z - v);
            },
            multiply: function (v) {
                if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
                else return new Vector(this.x * v, this.y * v, this.z * v);
            },
            divide: function (v) {
                if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y, this.z / v.z);
                else return new Vector(this.x / v, this.y / v, this.z / v);
            },
            equals: function (v) {
                return this.x === v.x && this.y === v.y && this.z === v.z;
            },
            dot: function (v) {
                return this.x * v.x + this.y * v.y + this.z * v.z;
            },
            cross: function (v) {
                return new Vector(
                    this.y * v.z - this.z * v.y,
                    this.z * v.x - this.x * v.z,
                    this.x * v.y - this.y * v.x
                );
            },
            length: function () {
                return Math.sqrt(this.dot(this));
            },
            unit: function () {
                return this.divide(this.length());
            },
            min: function () {
                return Math.min(Math.min(this.x, this.y), this.z);
            },
            max: function () {
                return Math.max(Math.max(this.x, this.y), this.z);
            },
            toAngles: function () {
                return {
                    theta: Math.atan2(this.z, this.x),
                    phi: Math.asin(this.y / this.length())
                };
            },
            angleTo: function (a) {
                return Math.acos(this.dot(a) / (this.length() * a.length()));
            },
            toArray: function (n) {
                return [this.x, this.y, this.z].slice(0, n || 3);
            },
            clone: function () {
                return new Vector(this.x, this.y, this.z);
            },
            init: function (x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
                return this;
            }
        };

        // Static Methods
        // Vector.randomDirection() returns a vector with a length of 1 and a statistically uniform direction. Vector.lerp() performs linear interpolation between two vectors.

        Vector.negative = function (a, b) {
            b.x = -a.x;
            b.y = -a.y;
            b.z = -a.z;
            return b;
        };
        Vector.add = function (a, b, c) {
            if (b instanceof Vector) {
                c.x = a.x + b.x;
                c.y = a.y + b.y;
                c.z = a.z + b.z;
            } else {
                c.x = a.x + b;
                c.y = a.y + b;
                c.z = a.z + b;
            }
            return c;
        };
        Vector.subtract = function (a, b, c) {
            if (b instanceof Vector) {
                c.x = a.x - b.x;
                c.y = a.y - b.y;
                c.z = a.z - b.z;
            } else {
                c.x = a.x - b;
                c.y = a.y - b;
                c.z = a.z - b;
            }
            return c;
        };
        Vector.multiply = function (a, b, c) {
            if (b instanceof Vector) {
                c.x = a.x * b.x;
                c.y = a.y * b.y;
                c.z = a.z * b.z;
            } else {
                c.x = a.x * b;
                c.y = a.y * b;
                c.z = a.z * b;
            }
            return c;
        };
        Vector.divide = function (a, b, c) {
            if (b instanceof Vector) {
                c.x = a.x / b.x;
                c.y = a.y / b.y;
                c.z = a.z / b.z;
            } else {
                c.x = a.x / b;
                c.y = a.y / b;
                c.z = a.z / b;
            }
            return c;
        };
        Vector.cross = function (a, b, c) {
            c.x = a.y * b.z - a.z * b.y;
            c.y = a.z * b.x - a.x * b.z;
            c.z = a.x * b.y - a.y * b.x;
            return c;
        };
        Vector.unit = function (a, b) {
            var length = a.length();
            b.x = a.x / length;
            b.y = a.y / length;
            b.z = a.z / length;
            return b;
        };
        Vector.fromAngles = function (theta, phi) {
            return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
        };
        Vector.randomDirection = function () {
            return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
        };
        Vector.min = function (a, b) {
            return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
        };
        Vector.max = function (a, b) {
            return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
        };
        Vector.lerp = function (a, b, fraction) {
            return b.subtract(a).multiply(fraction).add(a);
        };
        Vector.fromArray = function (a) {
            return new Vector(a[0], a[1], a[2]);
        };
        Vector.angleBetween = function (a, b) {
            return a.angleTo(b);
        };

        return Vector;
    }();

    window.Vector = Vector;

}());
/* global window, console, Vector */

(function () {
    'use strict';

    var CameraService = function () {

        var PI = Math.PI;
        var RAD = PI / 180;

        function CameraService(theta, phi, radius) {
            var service = this;
            service.theta = (theta || 45) * RAD;
            service.phi = (phi || 45) * RAD;
            service.radius = radius || 1.0;
        }

        CameraService.prototype = {
            down: down,
            move: move,
            up: up,
            wheel: wheel,
            render: render,
            update: update,
        };

        CameraService.fromVector = fromVector;
        CameraService.toVector = toVector;

        // publics

        function down(x, y) {
            var service = this;
            service.mouse = {
                x: x,
                y: y,
            };
        }

        function move(x, y) {
            var service = this,
                mouse = service.mouse;
            if (mouse) {
                var theta = (x - mouse.x) * 180 * RAD;
                var phi = (mouse.y - y) * 180 * RAD;
                mouse.x = x;
                mouse.y = y;
                service.theta += theta;
                service.phi += phi;
            }
        }

        function up(x, y) {
            var service = this;
            service.mouse = null;
        }

        function wheel(d) {
            var service = this;
            service.radius = Math.max(0.01, service.radius + d * 0.02);
        }

        function render(glsl) {
            var service = this;
            var vector = CameraService.toVector(service);
            var array = new Float32Array([vector.x, vector.y, vector.z]);
            service.update(glsl, '3fv', 'vec3', 'u_camera', array);
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

        // statics

        function fromVector(vector) {
            var radius = vector.length();
            var theta = Math.acos(vector.y / radius); //theta
            var phi = Math.atan(vector.x / vector.z); //phi
            return new CameraService(theta, phi, radius);
        }

        function toVector(camera) {
            var spr = Math.sin(camera.phi) * camera.radius;
            var x = spr * Math.sin(camera.theta);
            var y = Math.cos(camera.phi) * camera.radius;
            var z = spr * Math.cos(camera.theta);
            return new Vector(x, y, z);
        }

        return CameraService;

    }();

    window.CameraService = CameraService;

}());
/* global window, document, console, GlslCanvas */
/* 
Author: Brett Camper (@professorlemeza)
URL: https://github.com/tangrams/tangram/blob/master/src/utils/media_capture.js
*/

(function () {
    'use strict';

    function CaptureService() {}

    CaptureService.prototype = {
        set: set,
        snapshot: snapshot,
        snapshotRender: snapshotRender,
        record: record,
        stop: stop,
    };

    function set(canvas) {
        var service = this;
        service.canvas = canvas;
    }

    /*
    var mimeTypes = [
        'video/webm\;codecs=h264',
        'video/webm\;codecs=vp8',
        'video/webm\;codecs=daala',
        'video/webm',
        'audio/webm\;codecs=opus',
        'audio/webm',
        'video/mpeg',
    ];
    var options = {
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000,
        mimeType: 'video/webm',
        extension: '.webm',
    };
    // MediaRecorder.isTypeSupported(mimeTypes[0])
    */

    function record() {
        var service = this;
        if (typeof window.MediaRecorder !== 'function' || !service.canvas || typeof service.canvas.captureStream !== 'function') {
            console.log('warn: Video capture (Canvas.captureStream and/or MediaRecorder APIs) not supported by browser');
            return false;
        } else if (service.capture) {
            console.log('warn: Video capture already in progress, call Scene.stopVideoCapture() first');
            return false;
        }
        try {
            var capture = {};
            var chunks = [];
            var stream = service.canvas.captureStream();
            var options = {
                mimeType: 'video/webm', // 'video/webm\;codecs=h264'
            };
            var recorder = new MediaRecorder(stream, options);
            recorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
                // Stopped recording? Create the final capture file blob
                if (capture.resolve) {
                    var blob = new Blob(chunks, {
                        type: options.mimeType,
                    });
                    if (stream) {
                        var tracks = stream.getTracks() || [];
                        tracks.forEach(function (track) {
                            track.stop();
                            stream.removeTrack(track);
                        });
                    }
                    stream = null;
                    service.recorder = null;
                    service.capture = null;
                    capture.resolve({
                        blob: blob,
                        extension: '.webm',
                    });
                }
            };
            service.capture = capture;
            service.recorder = recorder;
            recorder.start();
        } catch (e) {
            service.capture = null;
            service.recorder = null;
            console.log('error: Scene video capture failed', e);
            return false;
        }
        return true;
    }

    function stop() {
        var service = this;
        if (!service.capture) {
            console.log('warn: No scene video capture in progress, call Scene.startVideoCapture() first');
            return Promise.resolve({});
        }
        service.capture.promise = new Promise(function (resolve, reject) {
            service.capture.resolve = resolve;
            service.capture.reject = reject;
        });
        service.recorder.stop();
        return service.capture.promise;
    }

    function snapshot() {
        var service = this;
        if (service.queue) {
            return service.queue.promise;
        }
        service.queue = {};
        service.queue.promise = new Promise(function (resolve, reject) {
            service.queue.resolve = resolve;
            service.queue.reject = reject;
        });
        return service.queue.promise;
    }

    function snapshotRender() {
        var service = this;
        if (service.queue) {
            // Get data URL, convert to blob
            // Strip host/mimetype/etc., convert base64 to binary without UTF-8 mangling
            // Adapted from: https://gist.github.com/unconed/4370822
            var url = service.canvas.toDataURL('image/png');
            var bytes = atob(url.slice(22));
            var buffer = new Uint8Array(bytes.length);
            for (var i = 0; i < bytes.length; ++i) {
                buffer[i] = bytes.charCodeAt(i);
            }
            var blob = new Blob([buffer], {
                type: 'image/png',
            });
            service.queue.resolve({
                blob: blob,
                extension: '.png',
            });
            service.queue = null;
        }
    }

    window.CaptureService = CaptureService;
}());
/* global window, document, console */

(function () {
    'use strict';

    var Parser = function () {

        var Parser = {
            set: set,
            get: get,
        };

        function tuple(array) {
            var tuples = {
                2: ['x', 'y'],
                3: ['x', 'y', 'z'],
                4: ['r', 'g', 'b', 'a']
            };
            var keys = tuples[array.length];
            var r = {};
            array.filter(function (v, i) {
                r[keys[i]] = v;
            });
            return r;
        }

        function enumerate(array, prefix) {
            var r = {};
            array.filter(function (v, i) {
                r[prefix + i] = v;
            });
            return r;
        }

        function getter(v) {
            return function (key) {
                return v[key];
            };
        }

        function set(obj) {
            var data = {};
            for (var p in obj) {
                var v = obj[p];
                if (Array.isArray(v)) {
                    if (v.length > 1) {
                        switch (typeof v[0]) {
                            case 'number':
                                if (v.length < 5) {
                                    data[p] = tuple(v);
                                }
                                break;
                            case 'boolean':
                                data[p] = enumerate(v, 'bool_');
                                break;
                            case 'string':
                                data[p] = enumerate(v, 'texture_');
                                break;
                            case 'object':
                                data[p] = enumerate(v, 'struct_');
                                break;
                        }
                    } else if (v.length) {
                        data[p] = v[0];
                    }
                } else if (v !== undefined && v !== null) {
                    data[p] = v;
                }
            }
            return data;
        }

        function get(obj) {
            var data = {};
            for (var p in obj) {
                var v = obj[p];
                switch (typeof v) {
                    case 'function':
                        break;
                    case 'number':
                    case 'boolean':
                    case 'string':
                        data[p] = v;
                        break;
                    default:
                        var keys = Object.keys(v);
                        data[p] = keys.map(getter(v));
                        break;
                }
            }
            // console.log('Parser.get', data);
            return data;
        }

        /*
        float                                   <--- typeof U === 'number'
        bool                                    <--- typeof U === 'boolean'
        sampler2D                               <--- typeof U === 'string'
        Structure                               <--- typeof U === 'object'
        ARRAYS of                               <--- Array.isArray(U)
            number                              <--- typeof U[0] === 'number'
                float                           <--- U.length === 1
                vec2, vec3, vec4                <--- U.length > 1 && U.length < 5
                float[]                         <--- U.length > 4
            sampler2D[]                         <--- typeof U[0] === 'string'
            vec2[], vec3[], vec4[]              <--- Array.isArray(U[0]) && typeof U[0][0] === 'number'
            Structure[]                         <--- typeof U[0] === 'object'
        
            TODO: assume matrix for (typeof == Float32Array && length == 16)
        TODO: support other non-float types? (int, etc.)
        */

        return Parser;

    }();

    var GuiService = function () {

        function GuiService(callback) {
            this.closed = true;
            this.hidden = true;
            this.callback = callback || function () {
                console.log('GuiService.onChange');
            };
            this.pool = {};
        }

        GuiService.prototype = {
            load: load,
            hide: hide,
            show: show,
            uniforms: uniforms,
        };

        // statics

        function differs(a, b) {
            // console.log('differs', JSON.stringify(a), JSON.stringify(b));
            return JSON.stringify(a) !== JSON.stringify(b);
        }

        function copy(obj) {
            return JSON.parse(JSON.stringify(obj));
        }

        function merge(a, b) {
            function _merge(a, b) {
                for (var key in a) {
                    if (b.hasOwnProperty(key)) {
                        if (typeof a[key] === 'number') {
                            a[key] = b[key];
                        } else if (typeof a[key] == 'object' && Object.keys(a[key]).length > 0) {
                            _merge(a[key], b[key]);
                        }
                    }
                }
            }
            if (a) {
                a = copy(a);

                _merge(a, b);
            }
            return a;
        }

        function loop(obj, params, callback) {
            var keys = [],
                p;
            for (p in params) {
                keys.push(p);
            }
            keys.filter(function (key) {
                var value = params[key];
                if (typeof value === 'number') {
                    p = obj.add(params, key, 0.0, 1.0);
                    p.onChange(callback);
                } else if (typeof value === 'object' && Object.keys(value).length > 0) {
                    p = null;
                    var folder = obj.addFolder(key);
                    loop(folder, value, callback);
                } else {
                    p = obj.add(params, key);
                    p.onChange(callback);
                }
            });
        }

        function randomize(obj, params, callback) {
            function _randomize(obj, params) {
                obj.__controllers.filter(function (c) {
                    if (typeof c.initialValue === 'number' && typeof c.__min === 'number' && typeof c.__max === 'number') {
                        var value = c.__min + (c.__max - c.__min) * Math.random();
                        params[c.property] = value;
                        c.updateDisplay();
                    }
                });
                for (var f in obj.__folders) {
                    _randomize(obj.__folders[f], params[f]);
                }
            }
            _randomize(obj, params);
            callback();
        }

        // publics

        function load(params) {
            var service = this;
            var gui = service.gui;
            var locals = service.locals;
            var changed = differs(params, locals);
            if (gui && changed) {
                service.closed = gui.closed;
                gui.destroy();
                gui = null;
            }
            if (!gui) {
                gui = new dat.GUI();
                gui.closed = service.closed;
                service.gui = gui;
                if (service.hidden) {
                    service.hide();
                } else {
                    service.show();
                }
            }
            if (changed) {
                locals = copy(params);
                service.locals = locals;
                var pool = Parser.set(params);
                pool = merge(pool, service.pool);
                service.pool = pool;
                var _callback = function () {
                    service.callback(pool);
                };
                loop(gui, pool, _callback);
                pool.randomize = function () {
                    randomize(gui, pool, _callback);
                };
                gui.add(pool, 'randomize');
            } else {
                // console.log('service.callback', service.pool);
                service.callback(service.pool);
            }
        }

        function hide() {
            var service = this;
            service.hidden = true;
            var gui = service.gui;
            if (gui) {
                gui.domElement.style.display = 'none';
                // dat.GUI.toggleHide();
            }
        }

        function show() {
            var service = this;
            var locals = service.locals;
            var gui = service.gui;
            if (gui && Object.keys(locals).length) {
                gui.domElement.style.display = '';
            }
            service.hidden = false;
        }

        function uniforms() {
            var service = this;
            var pool = service.pool;
            return Parser.get(pool);
        }

        return GuiService;
    }();

    window.GuiService = GuiService;

}());
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
/* global window, document, console, acquireVsCodeApi, GlslCanvas, CaptureService, GuiService, TrailsService, CameraService, Stats, dat */

(function() {
	'use strict';

	var vscode = acquireVsCodeApi();
	var oldState = vscode.getState();

	function onLoad() {
		var stats, statsdom;

		var content = document.querySelector('.content');
		var canvas = document.querySelector('.shader');
		var buttons = {
			pause: document.querySelector('.btn-pause'),
			record: document.querySelector('.btn-record'),
			stats: document.querySelector('.btn-stats'),
			create: document.querySelector('.btn-create'),
		};
		var flags = {
			toggle: false,
			record: false,
			stats: false,
		};

		resize(true);

		console.log('app.js workpath', options.workpath);

		var glsl = new GlslCanvas(canvas, {
			backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.0)',
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
			preserveDrawingBuffer: false,
			workpath: options.workpath,
		});

		if (!glsl.gl) {
			document.querySelector('.missing').setAttribute('class', 'missing active');
			return;
		}

		glsl.on('error', onGlslError);

		var capture = new CaptureService();
		capture.set(canvas);

		var camera = new CameraService();

		var trails = new TrailsService();

		glsl.on('render', function() {
			if (flags.stats) {
				stats.end();
			}
			capture.snapshotRender();
			camera.render(glsl);
			trails.render(glsl);
			if (flags.stats) {
				stats.begin();
			}
		});

		function onUpdateUniforms(params) {
			var uniforms = gui.uniforms();
			// console.log('GuiService.onUpdate', uniforms);
			glsl.setUniforms(uniforms);
			// console.log('onUpdateUniforms', uniforms);
		}

		var gui = new GuiService(onUpdateUniforms);

		load();

		function load() {
			document.querySelector('.errors').setAttribute('class', 'errors');
			document.querySelector('.welcome').setAttribute('class', (options.uri ? 'welcome' : 'welcome active'));
			var o = window.options;
			o.vertex = o.vertex.trim().length > 0 ? o.vertex : null;
			o.fragment = o.fragment.trim().length > 0 ? o.fragment : null;
			if (o.fragment || o.vertex) {
				document.querySelector('body').setAttribute('class', 'ready');
			} else {
				document.querySelector('body').setAttribute('class', 'empty');
				removeStats();
			}
			console.log('load', o.textures);
			for (var t in o.textures) {
				// console.log(t, o.textures[t]);
				// glsl.setUniform('u_texture_' + t, o.textures[t]);
				glsl.setTexture('u_texture_' + t, o.textures[t], {
					filtering: 'mipmap',
					repeat: true,
				});
			}
			glsl.load(o.fragment, o.vertex);
			gui.load(o.uniforms);
			glsl.setUniforms(gui.uniforms());
		}

		function resize(init) {
			var w = content.offsetWidth;
			var h = content.offsetHeight;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
			/*
			if (init) {
			    canvas.width = w;
			    canvas.height = h;
			} else {
			    glsl.resize();
			}
			*/
		}

		function snapshot() {
			glsl.forceRender = true;
			glsl.render();
			return capture.snapshot();
		}

		function record() {
			glsl.forceRender = true;
			glsl.render();
			if (capture.record()) {
				// flags.record = true;
			}
		}

		function stop() {
			capture.stop().then(function(video) {
				// console.log('capture.stop');
				// var filename = options.uri.path.split('/').pop().replace('.glsl', '');
				// console.log('filename', filename);
				var url = URL.createObjectURL(video.blob);
				var link = document.createElement('a');
				link.href = url;
				link.download = 'shader' + video.extension;
				link.click();
				setTimeout(function() {
					window.URL.revokeObjectURL(output);
				}, 100);
			});
		}

		function togglePause() {
			// flags.pause = !flags.pause;
			// console.log('pause', flags.pause);
			if (glsl.timer.paused) {
				flags.pause = false;
				/*
				if (glsl.timePause) {
				    glsl.timePrev = new Date();
				    glsl.timeLoad += (glsl.timePrev - glsl.timePause);
				}
				*/
				glsl.play();
				buttons.pause.querySelector('i').setAttribute('class', 'icon-pause');
			} else {
				flags.pause = true;
				glsl.pause();
				/*
				glsl.timePause = new Date();
				*/
				buttons.pause.querySelector('i').setAttribute('class', 'icon-play');
			}
		}

		function toggleRecord() {
			flags.record = !flags.record;
			// console.log('record', flags.record);
			if (flags.record) {
				buttons.record.setAttribute('class', 'btn btn-record active');
				buttons.record.querySelector('i').setAttribute('class', 'icon-stop');
				record();
			} else {
				buttons.record.setAttribute('class', 'btn btn-record');
				buttons.record.querySelector('i').setAttribute('class', 'icon-record');
				stop();
			}
		}

		function toggleStats() {
			flags.stats = !flags.stats;

			/*
            function statsTick() {
                stats.update();
                if (flags.stats) {
                    requestAnimationFrame(statsTick);
                }
			}
			*/
			if (flags.stats) {
				if (!statsdom) {
					stats = new Stats();
					stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
					statsdom = stats.dom;
					statsdom.setAttribute('class', 'stats');
					// statsdom.style.cssText = 'position:fixed;top:0;right:0;cursor:pointer;opacity:0.9;z-index:10000';
					document.body.appendChild(stats.dom);
				} else {
					statsdom.style.visibility = 'visible';
				}
				// requestAnimationFrame(statsTick);
				gui.show();
				buttons.stats.setAttribute('class', 'btn btn-stats active');
			} else {
				removeStats();
			}
		}

		function removeStats() {
			if (statsdom) {
				statsdom.style.visibility = 'hidden';
			}
			gui.hide();
			buttons.stats.setAttribute('class', 'btn btn-stats');
			flags.stats = false;
		}

		function createShader(e) {
			vscode.postMessage({
				command: 'createShader',
				data: null,
			});
		}

		function onMessage(event) {
			window.options = JSON.parse(event.data);
			// update state
			vscode.setState(window.options);
			// console.log('onMessage', window.options);
			// event.source.postMessage('message', event.origin);
			load();
		}

		var ri;

		function onResize() {
			if (ri) {
				clearTimeout(ri);
			}
			ri = setTimeout(resize, 50);
		}

		var ui;

		function updateUniforms(e) {
			if (ui) {
				clearTimeout(ui);
			}
			ui = setTimeout(function() {
				onUpdateUniforms();
			}, 1000 / 25);
		}

		function onDown(e) {
			var min = Math.min(content.offsetWidth, content.offsetHeight);
			camera.down(e.x / min, e.y / min);
		}

		function onMove(e) {
			var min = Math.min(content.offsetWidth, content.offsetHeight);
			camera.move(e.x / min, e.y / min);
			trails.move(e.x, content.offsetHeight - e.y);
		}

		function onUp(e) {
			var min = Math.min(content.offsetWidth, content.offsetHeight);
			camera.up(e.x / min, e.y / min);
		}

		function onWheel(e) {
			camera.wheel(e.wheelDelta / Math.abs(e.wheelDelta));
		}

		canvas.addEventListener('dblclick', togglePause);
		canvas.addEventListener('mousedown', onDown);
		canvas.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
		window.addEventListener('mousewheel', onWheel);
		buttons.pause.addEventListener('mousedown', togglePause);
		buttons.record.addEventListener('mousedown', toggleRecord);
		buttons.stats.addEventListener('mousedown', toggleStats);
		buttons.create.addEventListener('click', createShader);
		window.addEventListener('message', onMessage, false);
		window.addEventListener('resize', onResize);

		resize();
	}

	function revealGlslLine(data) {
		vscode.postMessage({
			command: 'revealGlslLine',
			data: JSON.stringify(data),
		});
	}

	function onGlslError(message) {
		// console.log('onGlslError.error', message.error);
		var options = window.options;
		var errors = [],
			warnings = [],
			lines = [];
		message.error.replace(/ERROR: \d+:(\d+): \'(.+)\' : (.+)/g, function(m, l, v, t) {
			var li = '<li><span class="error" unselectable reveal-line="' + lines.length + '"><span class="line">ERROR line ' + Number(l) + '</span> <span class="value" title="' + v + '">' + v + '</span> <span class="text" title="' + t + '">' + t + '</span></span></li>';
			errors.push(li);
			lines.push([options.uri, Number(l), 'ERROR (' + v + ') ' + t]);
			return li;
		});
		message.error.replace(/WARNING: \d+:(\d+): \'(.*\n*|.*|\n*)\' : (.+)/g, function(m, l, v, t) {
			var li = '<li><span class="warning" unselectable reveal-line="' + lines.length + '"><span class="line">WARN line ' + Number(l) + '</span> <span class="text" title="' + t + '">' + t + '</span></span></li>';
			warnings.push(li);
			lines.push([options.uri, Number(l), 'ERROR (' + v + ') ' + t]);
			return li;
		});
		var output = '<div class="errors-content"><div class="title">glsl-canvas error</div><ul>';
		output += errors.join('\n');
		output += warnings.join('\n');
		output += '</ul></div>';
		document.querySelector('.errors').setAttribute('class', 'errors active');
		document.querySelector('.errors').innerHTML = output;
		[].slice.call(document.querySelectorAll('.errors [reveal-line]')).forEach(function(node) {
			var index = parseInt(node.getAttribute('reveal-line'));
			node.addEventListener('click', function() {
				revealGlslLine(lines[index]);
			});
		});
		document.querySelector('body').setAttribute('class', 'idle');
	}

	window.addEventListener('load', onLoad);

}());
