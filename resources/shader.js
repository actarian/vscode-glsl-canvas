/* global window, document, console, GlslCanvas */

(function () {
    'use strict';

    function onLoad() {
        var fragment = document.getElementById('fragment').innerHTML;
        var vertex = null;
        var texture = 'https://raw.githubusercontent.com/actarian/plausible-brdf-shader/master/textures/mars/2048x1024/diffuse.jpg';

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

            if (vertex) {
                glsl.load(fragment, vertex);
            } else if (fragment) {
                glsl.load(fragment);
            }

            // glsl.setUniform("u_texture", texture);
            /*
            for (let i in textures) {
                textureScript += `shader.uniforms.iChannel${i} = { type: 't', value: THREE.ImageUtils.loadTexture('${textures[i]}') };`;
                console.log('texture', textures[i]);
            }
            */

            console.log('onResize');
        }

        window.addEventListener('resize', onResize);
        onResize();

        console.log('canvas', canvas);
        console.log('glsl', glsl);
    }

    function onGlslError(message) {
        console.log('onGlslError.error', message.error);
        var errors = [],
            warnings = [];
        message.error.replace(/ERROR: \d+:(\d+): \'(.+)\' : (.+)/g, function (m, l, v, t) {
            var li = '<li class="error"><span class="line">ERROR line ' + Number(l) + '</span> <span class="value">' + v + '</span> <span class="text">' + t + '</span></li>';
            errors.push(li);
            return li;
        });
        output += message.error.replace(/WARNING: \d+:(\d+): \'\' : (.+)/g, function (m, l) {
            var li = '<li class="warning"><span class="line">WARN line ' + Number(l) + '</span> <span class="text">' + t + '</span></li>';
            warnings.push(li);
            return li;
        });
        var output = '<div id="error"><h4>glsl shader error</h4><ul>';
        output += errors.join('\n');
        output += warnings.join('\n');
        output += '</ul></div>';
        document.body.innerHTML = output;
    }

    /*
    function onConsoleError() {
        console.log('onConsoleError', arguments);
        var output = '<div id="error"><h3>Shader failed to compile</h3><ul>';
        if ('7' in arguments) {
            output += arguments[7].replace(/ERROR: \\d+:(\\d+)/g, function (m, c) {
                return "<li>Line " + String(Number(c)) + '</li>';
            });
        } else {
            output += '<li>' + arguments[0] + '</li>';
        }
        output += '</ul></div>';
        document.body.innerHTML = output;
    }
    console.error = onConsoleError;
    */

    window.onload = onLoad;

}());