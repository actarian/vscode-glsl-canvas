/* global window, document, console, GlslCanvas */

(function () {
    'use strict';

    function onLoad() {
        var fragment = document.getElementById('fragment').innerHTML;
        var vertex = document.getElementById('vertex').innerHTML;

        var w = Math.ceil(window.innerWidth / 2) * 2.0;
        var h = Math.ceil(window.innerHeight / 2) * 2.0;

        var canvas = document.getElementById('shader');
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.width = w;
        canvas.height = h;

        var glsl = new GlslCanvas(canvas);

        function onResize() {
            var w = Math.ceil(window.innerWidth / 2) * 2.0;
            var h = Math.ceil(window.innerHeight / 2) * 2.0;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            canvas.width = w;
            canvas.height = h;
            glsl.on('error', onGlslError);
            if (vertex.trim().length > 0) {
                glsl.load(fragment, vertex);
            } else if (fragment) {
                glsl.load(fragment);
            }
            for (var p in window.textures) {
                glsl.setUniform('u_texture_' + p, window.textures[p]);
            }
            // console.log('onResize');
        }

        window.addEventListener('resize', onResize);
        onResize();
        // console.log('canvas', canvas);
        // console.log('glsl', glsl);
    }

    function onGlslError(message) {
        // console.log('onGlslError.error', message.error);
        var errors = [],
            warnings = [];
        message.error.replace(/ERROR: \d+:(\d+): \'(.+)\' : (.+)/g, function (m, l, v, t) {
            var li = '<li><a class="error" unselectable data-line="' + Number(l) + '" href="' + encodeURI('command:extension.revealGlslLine?' + JSON.stringify([window.command, Number(l)])) + '"><span class="line">ERROR line ' + Number(l) + '</span> <span class="value" title="' + v + '">' + v + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            errors.push(li);
            return li;
        });
        message.error.replace(/WARNING: \d+:(\d+): \'(.*\n*|.*|\n*)\' : (.+)/g, function (m, l, v, t) {
            var li = '<li><a class="warning" unselectable data-line="' + Number(l) + '" href="' + encodeURI('command:extension.revealGlslLine?' + JSON.stringify([window.command, Number(l)])) + '"><span class="line">WARN line ' + Number(l) + '</span> <span class="text" title="' + t + '">' + t + '</span></a></li>';
            warnings.push(li);
            return li;
        });

        var output = '<div id="error"><h4>glslCanvas error</h4><ul>';
        output += errors.join('\n');
        output += warnings.join('\n');
        output += '</ul></div>';
        document.getElementById('content').innerHTML = output;
        /*
        var lines = document.querySelectorAll('[data-line]');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var l = Number(line.getAttribute('data-line'));
            // console.log('register line', l);
            line.addEventListener('click', onClick);
        }
        */
    }

    /*
    function onClick(e) {
        var line = e.currentTarget;
        var l = Number(line.getAttribute('data-line'));
        // console.log('click line', l, window);
    }
    */

    /*
    function onConsoleError() {
        console.log('onConsoleError', arguments);
    }

    console.error = onConsoleError;
    */

    window.onload = onLoad;

}());