/* global window, document, console, GlslCanvas */

(function () {
    'use strict';

    function onLoad() {
        var o = 1; // important

        var content = document.getElementById('content');
        var canvas = document.getElementById('shader');
        var tools = {
            pause: document.querySelector('#pause'),
            record: document.querySelector('#record'),
            stats: document.querySelector('#stats'),
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
            var o = window.options;
            // var fragment = document.getElementById('fragment').innerHTML;
            // var vertex = document.getElementById('vertex').innerHTML;
            if (o.vertex.trim().length > 0) {
                glsl.load(o.fragment, o.vertex);
            } else if (o.fragment) {
                glsl.load(o.fragment);
            }
            for (var u in o.uniforms) {
                glsl.setUniform(u, o.uniforms[u]);
            }
            for (var t in o.textures) {
                glsl.setUniform('u_texture_' + t, o.textures[t]);
            }
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
            console.log('pause', flags.pause);
            if (glsl.paused) {
                if (glsl.timePause) {
                    glsl.timePrev = new Date();
                    glsl.timeLoad += (glsl.timePrev - glsl.timePause);
                }
                glsl.play();
                tools.pause.querySelector('i').setAttribute('class', 'icon-pause');
            } else {
                glsl.pause();
                glsl.timePause = new Date();
                tools.pause.querySelector('i').setAttribute('class', 'icon-play');
            }
        }

        function toggleRecord() {
            flags.record = !flags.record;
            console.log('record', flags.record);
            if (flags.record) {
                tools.record.querySelector('i').setAttribute('class', 'icon-stop');
            } else {
                tools.record.querySelector('i').setAttribute('class', 'icon-record');
            }
        }

        var stats, statsdom;

        function toggleStats() {
            flags.stats = !flags.stats;

            function statsTick() {
                stats.update();
                // stats.begin();
                // monitored code goes here
                // stats.end();
                if (flags.stats) {
                    requestAnimationFrame(statsTick);
                }
                // stats.begin();
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
                tools.stats.setAttribute('class', 'btn active');
            } else {
                if (statsdom) {
                    statsdom.style.visibility = 'hidden';
                }
                tools.stats.setAttribute('class', 'btn');
            }
        }

        function onMessage(event) {
            window.options = JSON.parse(event.data);
            console.log('onMessage', window.options);
            load();
            // Assuming you've verified the origin of the received message (which
            // you must do in any case), a convenient idiom for replying to a
            // message is to call postMessage on event.source and provide
            // event.origin as the targetOrigin.
            // event.source.postMessage("hi there yourself!  the secret response " + "is: rheeeeet!", event.origin);
        }

        tools.pause.addEventListener('mousedown', togglePause);
        tools.record.addEventListener('mousedown', toggleRecord);
        tools.stats.addEventListener('mousedown', toggleStats);
        document.addEventListener("dblclick", togglePause);
        window.addEventListener("message", onMessage, false);
        window.addEventListener('resize', onResize);
        onResize();

        /*
        // Called sometime after postMessage is called
        function receiveMessage(event) {
            // Do we trust the sender of this message?
            if (event.origin !== "http://example.com:8080") {
                return;
            }
            // event.source is window.opener
            // event.data is "hello there!"
            // Assuming you've verified the origin of the received message (which
            // you must do in any case), a convenient idiom for replying to a
            // message is to call postMessage on event.source and provide
            // event.origin as the targetOrigin.
            event.source.postMessage("hi there yourself!  the secret response " + "is: rheeeeet!", event.origin);
        }
        window.addEventListener("message", receiveMessage, false);
    
        window.addEventListener('message', (() => {
            const doScroll = throttle(line => {
                scrollDisabled = true;
                scrollToRevealSourceLine(line);
            }, 50);
            return event => {
                const line = +event.data.line;
                if (!isNaN(line)) {
                    doScroll(line);
                }
            };
        })(), false);
        */
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
        var output = '<div id="error"><h4>glslCanvas error</h4><ul>';
        output += errors.join('\n');
        output += warnings.join('\n');
        output += '</ul></div>';
        document.getElementById('content').innerHTML = output;
        if (errors.length) {
            document.querySelectorAll('.error')[0].click();
        }
        /*
        window.parent.postMessage({
            command: "did-click-link",
            data: createCommandUri('extension.sendMessage', 'hi')
        }, "file://");
        */
    }

    /*
    function onConsoleError() {
        console.log('onConsoleError', arguments);
    }

    console.error = onConsoleError;
    */

    // window.onload = onLoad;
    window.addEventListener('load', onLoad);
}());