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