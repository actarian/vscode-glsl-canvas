/* global window, document, console, GlslCanvas */
/*
Author: Brett Camper (@professorlemeza)
URL: https://github.com/tangrams/tangram/blob/master/src/utils/media_capture.js
*/

(function () {
    'use strict';

    function CCaptureService() {
		this.capturer = new CCapture({
			format: 'webm',
			quality: 90,
			framerate: 60,
			// motionBlurFrames: 3,
			// timeLimit: window.options.recordDuration !== 0 ? window.options.recordDuration : null,
		});
	}

    CCaptureService.prototype = {
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

    function record() {
        var service = this;
        var capturer = service.capturer;
        capturer.start();
        return true;
    }

    function stop() {
        var service = this;
		var capturer = service.capturer;
        return new Promise(function (resolve, reject) {
            capturer.stop();
			capturer.save(function(blob) {
				resolve({
					blob: blob,
					extension: '.webm',
				});
			});
        });
    }

    function snapshot() {
        var service = this;
        return null;
    }

    function snapshotRender() {
        var service = this;
		var capturer = service.capturer;
		capturer.capture(service.canvas);
    }

    window.CCaptureService = CCaptureService;
}());
