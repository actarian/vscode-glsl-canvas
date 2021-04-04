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
/* global window, document, console, GlslEditor, CameraService, TrailsService */

(function () {
    'use strict';

    var camera = new CameraService();

    var trails = new TrailsService();

    init();

    function init() {
        var frag_header = '';
        getResource("playgrounds/lib.glsl", function (data) {
            frag_header = data;
            var qso = getQuerystring();
            var resource = qso.glsl || 'main';
            getResource('playgrounds/' + resource + '.glsl', function (data) {
                var editorNode = document.querySelector('.editor');
                editorNode.innerHTML = data;
                var editor = new GlslEditor(editorNode, {
                    canvas_size: 400,
                    canvas_draggable: true,
                    fileDrops: false,
                    frag_header: frag_header,
                    menu: false,
                    multipleBuffers: false,
                    theme: 'monokai',
                    watchHash: false,
                });
                // console.log('editor', editor);
                var glsl = editor.shader.canvas;
                glsl.on('render', function () {
                    trails.render(glsl);
                    camera.render(glsl);
                    glsl.forceRender = true;
                });
                glsl.on('load', function () {
                    glsl.uniformTexture('u_texture_0', 'https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-1.png', {
                        filtering: 'mipmap',
                        repeat: true,
                    });
                });

                function onDown(e) {
                    var min = Math.min(glsl.canvas.offsetWidth, glsl.canvas.offsetHeight);
                    camera.down(e.x / min, e.y / min);
                }

                function onMove(e) {
                    var min = Math.min(glsl.canvas.offsetWidth, glsl.canvas.offsetHeight);
                    camera.move(e.x / min, e.y / min);
                    trails.move(e.x, glsl.canvas.offsetHeight - e.y);
                }

                function onUp(e) {
                    var min = Math.min(glsl.canvas.offsetWidth, glsl.canvas.offsetHeight);
                    camera.up(e.x / min, e.y / min);
                }

                function onWheel(e) {
                    camera.wheel(e.wheelDelta / Math.abs(e.wheelDelta));
                }

                glsl.canvas.addEventListener('mousedown', onDown);
                glsl.canvas.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
                window.addEventListener('mousewheel', onWheel);

                glsl.canvas.addEventListener('mousemove', function onMove(e) {
                    trails.move(e.x - editor.shader.el.offsetLeft, editor.shader.el.offsetTop + editor.shader.el.offsetHeight - e.y);
                });
            });
            // var nodes = document.querySelectorAll('code');
            // forEach(nodes, function (i, node) { });
        });
    }

    function forEach(array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    }

    function getResource(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.addEventListener('load', function () {
            callback(request.responseText);
        });
        request.send();
    }

    function getQuerystring() {
        var q = (function (list) {
            if (list == '') return {};
            var dict = {};
            for (var i = 0; i < list.length; ++i) {
                var kv = list[i].split('=', 2);
                if (kv.length == 1) {
                    dict[kv[0]] = '';
                } else {
                    dict[kv[0]] = decodeURIComponent(kv[1].replace(/\+/g, ' '));
                }
            }
            return dict;
        })(window.location.search.substr(1).split('&'));
        return q;
    }

}());