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
            }
        }

        function hide() {
            var service = this;
            var gui = service.gui;
            gui.domElement.style.display = 'none';
            service.hidden = true;
            // dat.GUI.toggleHide();
        }

        function show() {
            var service = this;
            var locals = service.locals;
            if (Object.keys(locals).length) {
                var gui = service.gui;
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
/* global window, document, console, GlslCanvas, CaptureService, Stats, dat */

(function () {
    'use strict';

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

        var glsl = new GlslCanvas(canvas, {
            premultipliedAlpha: false,
            preserveDrawingBuffer: true,
            backgroundColor: 'rgba(1,1,1,1)',
        });
        glsl.on('error', onGlslError);

        var service = new CaptureService();
        service.set(canvas);

        glsl.on('render', function () {
            service.snapshotRender();
        });

        var gui = new GuiService(function (params) {
            var uniforms = gui.uniforms();
            // console.log('GuiService.onUpdate', uniforms);
            glsl.setUniforms(uniforms);
        });

        load();

        function load() {
            document.querySelector('.errors').setAttribute('class', 'errors');
            document.querySelector('.welcome').setAttribute('class', (options.uri ? 'welcome' : 'welcome active'));
            var o = window.options;
            o.vertex = o.vertex.trim().length > 0 ? o.vertex : null;
            o.fragment = o.fragment.trim().length > 0 ? o.fragment : null;
            glsl.load(o.fragment, o.vertex);
            for (var t in o.textures) {
                glsl.setUniform('u_texture_' + t, o.textures[t]);
            }
            gui.load(o.uniforms);
            glsl.setUniforms(gui.uniforms());
            document.querySelector('body').setAttribute('class', (o.fragment || o.vertex ? 'ready' : 'empty'));
        }

        function resize(init) {
            var w = content.offsetWidth;
            var h = content.offsetHeight;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            if (init) {
                canvas.width = w;
                canvas.height = h;
            } else {
                glsl.resize();
            }
        }

        function snapshot() {
            glsl.forceRender = true;
            glsl.render();
            return service.snapshot();
        }

        function record() {
            glsl.forceRender = true;
            glsl.render();
            if (service.record()) {
                // flags.record = true;
            }
        }

        function stop() {
            service.stop().then(function (video) {
                // console.log('service.stop');
                // var filename = options.uri.path.split('/').pop().replace('.glsl', '');
                // console.log('filename', filename);
                var url = URL.createObjectURL(video.blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = 'shader' + video.extension;
                link.click();
                setTimeout(function () {
                    window.URL.revokeObjectURL(output);
                }, 100);
            });
        }

        function togglePause() {
            flags.pause = !flags.pause;
            // console.log('pause', flags.pause);
            if (glsl.paused) {
                if (glsl.timePause) {
                    glsl.timePrev = new Date();
                    glsl.timeLoad += (glsl.timePrev - glsl.timePause);
                }
                glsl.play();
                buttons.pause.querySelector('i').setAttribute('class', 'icon-pause');
            } else {
                glsl.pause();
                glsl.timePause = new Date();
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

            function statsTick() {
                stats.update();
                if (flags.stats) {
                    requestAnimationFrame(statsTick);
                }
            }
            if (flags.stats) {
                if (!statsdom) {
                    stats = new Stats();
                    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
                    statsdom = stats.dom;
                    // statsdom.style.cssText = 'position:fixed;top:0;right:0;cursor:pointer;opacity:0.9;z-index:10000';
                    document.body.appendChild(stats.dom);
                } else {
                    statsdom.style.visibility = 'visible';
                }
                requestAnimationFrame(statsTick);
                gui.show();
                buttons.stats.setAttribute('class', 'btn btn-stats active');
            } else {
                if (statsdom) {
                    statsdom.style.visibility = 'hidden';
                }
                gui.hide();
                buttons.stats.setAttribute('class', 'btn btn-stats');
            }
        }

        function createShader(e) {
            // console.log('createShader', e);
            window.parent.postMessage({
                command: "did-click-link",
                data: 'command:glsl-canvas.createShader?' + JSON.stringify([options.uri]),
            }, "file://");
        }

        function onMessage(event) {
            window.options = JSON.parse(event.data);
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

        canvas.addEventListener("dblclick", togglePause);
        buttons.pause.addEventListener('mousedown', togglePause);
        buttons.record.addEventListener('mousedown', toggleRecord);
        buttons.stats.addEventListener('mousedown', toggleStats);
        buttons.create.addEventListener('click', createShader);
        window.addEventListener("message", onMessage, false);
        window.addEventListener('resize', onResize);
        resize();
    }

    function onGlslError(message) {
        // console.log('onGlslError.error', message.error);
        var options = window.options;
        var errors = [],
            warnings = [];
        message.error.replace(/ERROR: \d+:(\d+): \'(.+)\' : (.+)/g, function (m, l, v, t) {
            var message = 'ERROR (' + v + ') ' + t;
            var li = '<li><a class="error" unselectable href="' + encodeURI('command:glsl-canvas.revealGlslLine?' + JSON.stringify([options.uri, Number(l), message])) + '"><span class="line">ERROR line ' + Number(l) + '</span> <span class="value" title="' + v + '">' + v + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            errors.push(li);
            return li;
        });
        message.error.replace(/WARNING: \d+:(\d+): \'(.*\n*|.*|\n*)\' : (.+)/g, function (m, l, v, t) {
            var li = '<li><a class="warning" unselectable href="' + encodeURI('command:glsl-canvas.revealGlslLine?' + JSON.stringify([options.uri, Number(l), message])) + '"><span class="line">WARN line ' + Number(l) + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            warnings.push(li);
            return li;
        });
        var output = '<div class="errors-content"><p>glslCanvas error</p><ul>';
        output += errors.join('\n');
        output += warnings.join('\n');
        output += '</ul></div>';
        document.querySelector('.errors').setAttribute('class', 'errors active');
        document.querySelector('.errors').innerHTML = output;
    }
    window.addEventListener('load', onLoad);
}());