/* global window, document, console */

(function () {
    'use strict';

    function GuiService(callback) {
        this.closed = true;
        this.hidden = true;
        this.callback = callback || function () {
            console.log('GuiService.onChange');
        };
        this.pool = {};
    }

    GuiService.prototype = {
        load: load,
        hide: hide,
        show: show,
        getParams: getParams,
    };

    // statics

    function differs(a, b) {
        // console.log('differs', JSON.stringify(a), JSON.stringify(b));
        return JSON.stringify(a) !== JSON.stringify(b);
    }

    function copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function merge(a, b) {
        function _merge(a, b) {
            for (var key in a) {
                if (b.hasOwnProperty(key)) {
                    if (typeof a[key] === 'number') {
                        a[key] = b[key];
                    } else if (typeof a[key] == 'object' && Object.keys(a[key]).length > 0) {
                        _merge(a[key], b[key]);
                    }
                }
            }
        }
        if (a) {
            a = copy(a);

            _merge(a, b);
        }
        return a;
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
                loop(folder, params[key], callback);
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
        if (gui && changed) {
            service.closed = gui.closed;
            gui.destroy();
            gui = null;
        }
        if (!gui) {
            gui = new dat.GUI();
            gui.closed = service.closed;
            service.gui = gui;
            if (service.hidden) {
                service.hide();
            } else {
                service.show();
            }
        }
        if (changed) {
            locals = copy(params);
            service.locals = locals;
            var pool = merge(params, service.pool);
            service.pool = pool;
            loop(gui, pool, service.callback);
            service.callback();
        }
    }

    function hide() {
        var service = this;
        var gui = service.gui;
        gui.domElement.style.display = 'none';
        service.hidden = true;
        // dat.GUI.toggleHide();
    }

    function show() {
        var service = this;
        var locals = service.locals;
        if (Object.keys(locals).length) {
            var gui = service.gui;
            gui.domElement.style.display = '';
        }
        service.hidden = false;
    }

    function getParams() {
        var service = this;
        var pool = service.pool;
        return pool;
    }

    window.GuiService = GuiService;

}());