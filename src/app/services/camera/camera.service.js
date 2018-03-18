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