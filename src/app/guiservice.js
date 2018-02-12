/* global window, document, console */

(function () {
    'use strict';

    function GuiService(callback) {
        this.callback = callback || function () {
            console.log('GuiService.onChange');
        };
    }

    GuiService.prototype = {
        load: load,
    };

    // statics

    function differs(a, b) {
        return JSON.stringify(a) !== JSON.stringify(b);
    }

    function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
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
                loop(folder, params[key]);
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
        if (gui && differs) {
            gui.destroy();
            gui = null;
        }
        if (!gui) {
            gui = new dat.GUI();
            gui.closed = true;
        }
        if (changed) {
            locals = copy(params);
            loop(gui, locals, service.callback);
        }
        service.gui = gui;
        service.locals = locals;
    }

    window.GuiService = GuiService;

}());