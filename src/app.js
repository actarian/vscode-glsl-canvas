/* global window, document, console, GlslCanvas */

(function () {
    'use strict';

    function onLoad() {
        var o = 1;

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

        onResize();

        var glsl = new GlslCanvas(canvas);
        glsl.on('error', onGlslError);

        load();

        function load() {
            document.querySelector('.errors').setAttribute('class', 'errors');
            document.querySelector('.welcome').setAttribute('class', (options.uri ? 'welcome' : 'welcome active'));
            var o = window.options;
            o.vertex = o.vertex.trim().length > 0 ? o.vertex : null;
            o.fragment = o.fragment.trim().length > 0 ? o.fragment : null;
            glsl.load(o.fragment, o.vertex);
            for (var u in o.uniforms) {
                glsl.setUniform(u, o.uniforms[u]);
            }
            for (var t in o.textures) {
                glsl.setUniform('u_texture_' + t, o.textures[t]);
            }
            document.querySelector('body').setAttribute('class', (o.fragment || o.vertex ? 'ready' : 'empty'));
        }

        function onResize() {
            var w = content.offsetWidth + o;
            var h = content.offsetHeight + o;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            canvas.width = w;
            canvas.height = h;
            o = 0;
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

        var encoder;

        function toggleRecord() {
            flags.record = !flags.record;
            // console.log('record', flags.record);
            if (flags.record) {
                buttons.record.querySelector('i').setAttribute('class', 'icon-stop');
                try {
                    encoder = new Whammy.Video(20);
                    canvas = document.querySelector('.shader');
                    // canvas.crossOrigin = 'anonymous';
                    encoder.add(canvas); // , 10 * 1000); // ten sec
                    /*
                    // frame = frame.getContext('2d').getImageData(0, 0, frame.width, frame.height);
                    var context = frame.getContext('webgl');
                    var pixels = new Uint8Array(context.drawingBufferWidth * context.drawingBufferHeight * 4);
                    context.readPixels(0, 0, context.drawingBufferWidth, context.drawingBufferHeight, context.RGBA, context.UNSIGNED_BYTE, pixels);
                    frame = pixels;
                    */
                } catch (e) {
                    console.log('encoder.init.error', e);
                }
            } else {
                buttons.record.querySelector('i').setAttribute('class', 'icon-record');
                try {
                    if (encoder) {
                        encoder.compile(function (output) {
                            var blob = (window.webkitURL || window.URL).createObjectURL(output);
                            var link = document.createElement('a');
                            link.href = blob;
                            link.download = "shader.webm";
                            link.click();
                            setTimeout(function () {
                                (window.webkitURL || window.URL).revokeObjectURL(output);
                            }, 100);
                        });
                        encoder = null;
                    }
                } catch (e) {
                    console.log('encoder.compile.error', e);
                }
            }
        }

        var stats, statsdom;

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
                    statsdom.style.cssText = 'position:fixed;top:0;right:0;cursor:pointer;opacity:0.9;z-index:10000';
                    document.body.appendChild(stats.dom);
                } else {
                    statsdom.style.visibility = 'visible';
                }
                requestAnimationFrame(statsTick);
                buttons.stats.setAttribute('class', 'btn active');
            } else {
                if (statsdom) {
                    statsdom.style.visibility = 'hidden';
                }
                buttons.stats.setAttribute('class', 'btn');
            }
        }

        function createShader(e) {
            console.log('createShader', e);
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

        document.addEventListener("dblclick", togglePause);
        buttons.pause.addEventListener('mousedown', togglePause);
        buttons.record.addEventListener('mousedown', toggleRecord);
        buttons.stats.addEventListener('mousedown', toggleStats);
        buttons.create.addEventListener('click', createShader);
        window.addEventListener("message", onMessage, false);
        window.addEventListener('resize', onResize);
        onResize();
    }

    function onGlslError(message) {
        // console.log('onGlslError.error', message.error);
        var options = window.options;
        var errors = [],
            warnings = [];
        message.error.replace(/ERROR: \d+:(\d+): \'(.+)\' : (.+)/g, function (m, l, v, t) {
            var message = 'ERROR (' + v + ') ' + t;
            var li = '<li><a class="error" unselectable data-line="' + Number(l) + '" href="' + encodeURI('command:glsl-canvas.revealGlslLine?' + JSON.stringify([options.uri, Number(l), message])) + '"><span class="line">ERROR line ' + Number(l) + '</span> <span class="value" title="' + v + '">' + v + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            errors.push(li);
            return li;
        });
        message.error.replace(/WARNING: \d+:(\d+): \'(.*\n*|.*|\n*)\' : (.+)/g, function (m, l, v, t) {
            var li = '<li><a class="warning" unselectable data-line="' + Number(l) + '" href="' + encodeURI('command:glsl-canvas.revealGlslLine?' + JSON.stringify([options.uri, Number(l), message])) + '"><span class="line">WARN line ' + Number(l) + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            warnings.push(li);
            return li;
        });
        var output = '<div class="errors-content"><h4>glslCanvas error</h4><ul>';
        output += errors.join('\n');
        output += warnings.join('\n');
        output += '</ul></div>';
        document.querySelector('.errors').setAttribute('class', 'errors active');
        document.querySelector('.errors').innerHTML = output;
        if (errors.length) {
            document.querySelectorAll('.error')[0].click();
        }
    }
    window.addEventListener('load', onLoad);
}());