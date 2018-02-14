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