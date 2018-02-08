/* global window, document, console, GlslCanvas */

(function () {
    'use strict';

    function onLoad() {
        var o = 1; // important

        var fragment = document.getElementById('fragment').innerHTML;
        var vertex = document.getElementById('vertex').innerHTML;
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
            if (vertex.trim().length > 0) {
                glsl.load(fragment, vertex);
            } else if (fragment) {
                glsl.load(fragment);
            }
            for (var p in window.uniforms) {
                glsl.setUniform(p, window.uniforms[p]);
            }
            for (var p in window.textures) {
                glsl.setUniform('u_texture_' + p, window.textures[p]);
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

        tools.pause.addEventListener('mousedown', togglePause);
        tools.record.addEventListener('mousedown', toggleRecord);
        tools.stats.addEventListener('mousedown', toggleStats);
        document.addEventListener("dblclick", togglePause);
        window.addEventListener('resize', onResize);
        onResize();
    }

    function onGlslError(message) {
        // console.log('onGlslError.error', message.error);
        var errors = [],
            warnings = [];
        message.error.replace(/ERROR: \d+:(\d+): \'(.+)\' : (.+)/g, function (m, l, v, t) {
            var li = '<li><a class="error" unselectable data-line="' + Number(l) + '" href="' + encodeURI('command:glsl-canvas.revealGlslLine?' + JSON.stringify([window.command, Number(l)])) + '"><span class="line">ERROR line ' + Number(l) + '</span> <span class="value" title="' + v + '">' + v + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            errors.push(li);
            return li;
        });
        message.error.replace(/WARNING: \d+:(\d+): \'(.*\n*|.*|\n*)\' : (.+)/g, function (m, l, v, t) {
            var li = '<li><a class="warning" unselectable data-line="' + Number(l) + '" href="' + encodeURI('command:glsl-canvas.revealGlslLine?' + JSON.stringify([window.command, Number(l)])) + '"><span class="line">WARN line ' + Number(l) + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            warnings.push(li);
            return li;
        });
        var output = '<div id="error"><h4>glslCanvas error</h4><ul>';
        output += errors.join('\n');
        output += warnings.join('\n');
        output += '</ul></div>';
        document.getElementById('content').innerHTML = output;
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