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
        getUniforms: getUniforms,
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

    function tuple(array) {
        var tuples = {
            2: ['x', 'y'],
            3: ['x', 'y', 'z'],
            4: ['r', 'g', 'b', 'a']
        };
        var keys = tuples[array.length];
        var r = {};
        array.filter(function (v, i) {
            r[keys[i]] = v;
        });
        return r;
    }

    function enumerate(array, prefix) {
        var r = {};
        array.filter(function (v, i) {
            r[prefix + i] = v;
        });
        return r;
    }

    function parse(obj) {
        var parsed = {};
        for (var p in obj) {
            var v = obj[p];
            if (Array.isArray(v)) {
                if (v.length > 1) {
                    switch (typeof v[0]) {
                        case 'number':
                            if (v.length < 5) {
                                parsed[p] = tuple(v);
                            }
                            break;
                        case 'boolean':
                            parsed[p] = enumerate(v, 'bool_');
                            break;
                        case 'string':
                            parsed[p] = enumerate(v, 'texture_');
                            break;
                        case 'object':
                            parsed[p] = enumerate(v, 'struct_');
                            break;
                    }
                } else if (v.length) {
                    parsed[p] = v[0];
                }
            } else if (v !== undefined && v !== null) {
                parsed[p] = v;
            }
        }
        return parsed;
    }

    function unparse(obj) {
        var unparsed = {};
        for (var p in obj) {
            var v = obj[p];
            parsed[p] = v;
        }
        /*
        float                                   <--- typeof U === 'number'
        bool                                    <--- typeof U === 'boolean'
        sampler2D                               <--- typeof U === 'string'
        Structure                               <--- typeof U === 'object'
        ARRAYS of                               <--- Array.isArray(U)
            number                              <--- typeof U[0] === 'number'
                float                           <--- U.length === 1
                vec2, vec3, vec4                <--- U.length > 1 && U.length < 5
                float[]                         <--- U.length > 4
            sampler2D[]                         <--- typeof U[0] === 'string'
            vec2[], vec3[], vec4[]              <--- Array.isArray(U[0]) && typeof U[0][0] === 'number'
            Structure[]                         <--- typeof U[0] === 'object'
        
            TODO: assume matrix for (typeof == Float32Array && length == 16)
        TODO: support other non-float types? (int, etc.)
        */
        return unparsed;
    }

    function loop(obj, params, callback) {
        var keys = [],
            p;
        for (p in params) {
            keys.push(p);
        }
        keys.filter(function (key) {
            var value = params[key];
            if (typeof value === 'number') {
                p = obj.add(params, key, 0.0, 1.0);
                p.onChange(callback);
            } else if (typeof value === 'object' && Object.keys(value).length > 0) {
                p = null;
                var folder = obj.addFolder(key);
                loop(folder, value, callback);
            } else {
                p = obj.add(params, key);
                p.onChange(callback);
            }
        });
    }

    function randomize(obj, params, callback) {

        function _randomize(obj, params) {
            obj.__controllers.filter(function (c) {
                if (typeof c.initialValue === 'number' && typeof c.__min === 'number' && typeof c.__max === 'number') {
                    var value = c.__min + (c.__max - c.__min) * Math.random();
                    params[c.property] = value;
                    c.updateDisplay();
                }
            });
            for (var f in obj.__folders) {
                _randomize(obj.__folders[f], params[f]);
            }
        }
        _randomize(obj, params);
        callback();
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
            var parsed = parse(params);
            var pool = merge(parsed, service.pool);
            service.pool = pool;
            var _callback = function () {
                service.callback(pool);
            };
            loop(gui, pool, _callback);
            pool.randomize = function () {
                randomize(gui, pool, _callback);
            };
            gui.add(pool, 'randomize');
            _callback();
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

    function getUniforms() {
        var service = this;
        var pool = service.pool;
        return unparse(pool);
    }

    window.GuiService = GuiService;

}());