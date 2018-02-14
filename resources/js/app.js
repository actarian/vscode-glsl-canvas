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

    var mimeTypes = [
        'video/webm\;codecs=h264',
        'video/webm\;codecs=vp8',
        'video/webm\;codecs=daala',
        'video/webm',
        'audio/webm\;codecs=opus',
        'audio/webm',
        'video/mpeg',
    ];

    function getOptions() {
        var options = {
            videoBitsPerSecond: 2500000,
            audioBitsPerSecond: 128000,
            mimeType: 'video/webm',
            extension: '.webm',
        };
        // MediaRecorder.isTypeSupported(mimeTypes[0])
        return options;
    }

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
                mimeType: 'video/webm\;codecs=h264'
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
        getParams: getParams,
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
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (typeof params[key] == 'number') {
                p = obj.add(params, key, params[key] * 0.5, params[key] * 2.0);
                p.onChange(callback);
            } else if (typeof params[key] == 'object' && Object.keys(params[key]).length > 0) {
                p = null;
                var folder = obj.addFolder(key);
                loop(folder, params[key], callback);
            } else {
                p = obj.add(params, key);
                p.onChange(callback);
            }
        }
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
            var pool = merge(params, service.pool);
            service.pool = pool;
            loop(gui, pool, service.callback);
            service.callback();
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

    function getParams() {
        var service = this;
        var pool = service.pool;
        return pool;
    }

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

        var guiservice = new GuiService(function () {
            // console.log('GuiService.onUpdate');
            var uniforms = guiservice.getParams();
            for (var u in uniforms) {
                // console.log(u, uniforms[u]);
                glsl.setUniform(u, uniforms[u]);
            }
        });

        load();

        function load() {
            document.querySelector('.errors').setAttribute('class', 'errors');
            document.querySelector('.welcome').setAttribute('class', (options.uri ? 'welcome' : 'welcome active'));
            var o = window.options;
            o.vertex = o.vertex.trim().length > 0 ? o.vertex : null;
            o.fragment = o.fragment.trim().length > 0 ? o.fragment : null;
            glsl.load(o.fragment, o.vertex);
            guiservice.load(o.uniforms);
            for (var t in o.textures) {
                glsl.setUniform('u_texture_' + t, o.textures[t]);
            }
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
                guiservice.show();
                buttons.stats.setAttribute('class', 'btn btn-stats active');
            } else {
                if (statsdom) {
                    statsdom.style.visibility = 'hidden';
                }
                guiservice.hide();
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

        document.addEventListener("dblclick", togglePause);
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