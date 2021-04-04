(function () {
	'use strict';

	var vscode = acquireVsCodeApi();
	var oldState = vscode.getState();
	// console.log('oldState', oldState);

	function onLoad() {
		var stats, statsdom;

		var body = document.querySelector('body');
		var content = document.querySelector('.content');
		var canvas = document.querySelector('.shader');
		var errors = document.querySelector('.errors');
		var welcome = document.querySelector('.welcome');
		var missing = document.querySelector('.missing');
		var buttons = {
			pause: document.querySelector('.btn-pause'),
			record: document.querySelector('.btn-record'),
			stats: document.querySelector('.btn-stats'),
			export: document.querySelector('.btn-export'),
			create: document.querySelector('.btn-create'),
			mode: document.querySelector('.btn-mode'),
		};
		var modes = Array.prototype.slice.call(buttons.mode.querySelectorAll('li'));
		var flags = {
			toggle: false,
			record: false,
			stats: false,
			mode: 'flat',
		};
		resize(true);

		// console.log('app.js workpath', options.workpath);
		// console.log('app.js resources', options.resources);

		var glslCanvas = new glsl.Canvas(canvas, {
			backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.0)',
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
			preserveDrawingBuffer: false,
			workpath: options.workpath,
			// mesh: options.resources + '/model/lego.obj',
			mesh: options.resources + '/model/duck-toy.obj',
			extensions: options.extensions,
			doubleSided: options.doubleSided,
		});

		// console.log('glslCanvas.init', glslCanvas.mode);

		glslCanvas.on('load', onGlslLoad);
		glslCanvas.on('error', onGlslError);
		glslCanvas.on('textureError', onGlslTextureError);

		var capture = new CaptureService();
		capture.set(canvas);

		// var camera = new CameraService();
		var trails = new TrailsService();

		glslCanvas.on('render', function () {
			if (flags.stats) {
				stats.end();
			}
			capture.snapshotRender();
			// camera.render(glslCanvas);
			trails.render(glslCanvas);
			if (flags.stats) {
				stats.begin();
			}
		});

		function onUpdateUniforms(params) {
			var uniforms = gui.uniforms();
			glslCanvas.setUniforms(uniforms);
		}

		var gui = new GuiService(onUpdateUniforms);

		load();

		function load() {
			var o = window.options;
			o.vertex = o.vertex.trim().length > 0 ? o.vertex : null;
			o.fragment = o.fragment.trim().length > 0 ? o.fragment : null;
			if (o.fragment || o.vertex) {
				body.classList.remove('idle', 'empty');
				body.classList.add('ready');
			} else {
				body.classList.remove('idle', 'ready')
				body.classList.add('empty');
				removeStats();
			}
			for (var t in o.textures) {
				glslCanvas.setTexture('u_texture_' + t, o.textures[t], {
					filtering: 'mipmap',
					repeat: true,
				});
			}
			glslCanvas.load(o.fragment, o.vertex).then(success => {
				missing.classList.remove('active');
			}, error => {
				missing.classList.add('active');
				onGlslLoadError(error);
				return;
			});
		}

		function onGlslLoad() {
			var o = window.options;
			gui.load(o.uniforms);
			glslCanvas.setUniforms(gui.uniforms());
			errors.classList.remove('active');
			if (options.uri) {
				welcome.classList.remove('active');
			} else {
				welcome.classList.add('active');
			}
			if (flags.pause) {
				glslCanvas.pause();
			} else {
				glslCanvas.play();
			}
			swapCanvas_(glslCanvas.canvas);
		}

		function resize(init) {
			var w = content.offsetWidth;
			var h = content.offsetHeight;
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
		}

		function snapshot() {
			glslCanvas.forceRender = true;
			glslCanvas.render();
			return capture.snapshot();
		}

		function record() {
			glslCanvas.forceRender = true;
			glslCanvas.render();
			if (capture.record()) {
				// flags.record = true;
			}
		}

		function stop() {
			capture.stop().then(function (video) {
				var url = URL.createObjectURL(video.blob);
				var link = document.createElement('a');
				link.href = url;
				link.download = 'shader' + video.extension;
				link.click();
				setTimeout(function () {
					window.URL.revokeObjectURL(output);
				}, 100);
			});
		}

		function togglePause() {
			if (flags.pause) {
				flags.pause = false;
				/*
				if (glslCanvas.timePause) {
				    glslCanvas.timePrev = new Date();
				    glslCanvas.timeLoad += (glslCanvas.timePrev - glslCanvas.timePause);
				}
				*/
				glslCanvas.play();
				buttons.pause.querySelector('i').setAttribute('class', 'icon-pause');
			} else {
				flags.pause = true;
				glslCanvas.pause();
				/*
				glslCanvas.timePause = new Date();
				*/
				buttons.pause.querySelector('i').setAttribute('class', 'icon-play');
			}
		}

		function toggleRecord() {
			flags.record = !flags.record;
			if (flags.record) {
				buttons.record.setAttribute('class', 'btn btn-record active');
				buttons.record.querySelector('i').setAttribute('class', 'icon-stop');
				record();
			} else {
				buttons.record.setAttribute('class', 'btn btn-record');
				buttons.record.querySelector('i').setAttribute('class', 'icon-record');
				stop();
			}
		}

		function toggleStats() {
			flags.stats = !flags.stats;
			/*
            function statsTick() {
                stats.update();
                if (flags.stats) {
                    requestAnimationFrame(statsTick);
                }
			}
			*/
			if (flags.stats) {
				if (!statsdom) {
					stats = new Stats();
					stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
					statsdom = stats.dom;
					statsdom.setAttribute('class', 'stats');
					// statsdom.style.cssText = 'position:fixed;top:0;right:0;cursor:pointer;opacity:0.9;z-index:10000';
					document.body.appendChild(stats.dom);
				} else {
					statsdom.style.visibility = 'visible';
				}
				// requestAnimationFrame(statsTick);
				gui.show();
				buttons.stats.setAttribute('class', 'btn btn-stats active');
			} else {
				removeStats();
			}
		}

		function removeStats() {
			if (statsdom) {
				statsdom.style.visibility = 'hidden';
			}
			gui.hide();
			buttons.stats.setAttribute('class', 'btn btn-stats');
			flags.stats = false;
		}

		function onExport(e) {
			// console.log('app.onExport');
			window.options.mode = glslCanvas.mode;
			vscode.postMessage({
				command: 'onExport',
				data: JSON.stringify(window.options),
			});
		}

		function createShader(e) {
			vscode.postMessage({
				command: 'createShader',
				data: null,
			});
		}

		function onMessage(event) {
			window.options = JSON.parse(event.data);
			// console.log('window.options', window.options);
			vscode.setState(window.options);
			load();
		}

		var ri;
		function onResize() {
			if (ri) {
				clearTimeout(ri);
			}
			ri = setTimeout(resize, 50);
		}

		var ui;
		function updateUniforms(e) {
			if (ui) {
				clearTimeout(ui);
			}
			ui = setTimeout(function () {
				onUpdateUniforms();
			}, 1000 / 25);
		}

		/*
		function onDown(e) {
			var min = Math.min(content.offsetWidth, content.offsetHeight);
			camera.down(e.x / min, e.y / min);
		}
		*/

		function onMove(e) {
			// var min = Math.min(content.offsetWidth, content.offsetHeight);
			// camera.move(e.x / min, e.y / min);
			trails.move(e.x, content.offsetHeight - e.y);
		}

		/*
		function onUp(e) {
			var min = Math.min(content.offsetWidth, content.offsetHeight);
			camera.up(e.x / min, e.y / min);
		}
		*/

		/*
		function onWheel(e) {
			camera.wheel(e.wheelDelta / Math.abs(e.wheelDelta));
		}
		*/

		function swapCanvas_(canvas_) {
			if (canvas !== canvas_) {
				removeCanvasListeners_();
				canvas = canvas_;
				addCanvasListeners_();
				capture.set(canvas);
			}
		}

		function setMode(mode) {
			// console.log('mode', mode);
			buttons.mode.firstElementChild.setAttribute('class', 'icon-' + mode);
			flags.mode = mode;
			glslCanvas.setMode(mode);
		}

		function addCanvasListeners_() {
			canvas.addEventListener('dblclick', togglePause);
			// canvas.addEventListener('mousedown', onDown);
			canvas.addEventListener('mousemove', onMove);
		}

		function removeCanvasListeners_() {
			canvas.removeEventListener('dblclick', togglePause);
			// canvas.removeEventListener('mousedown', onDown);
			canvas.removeEventListener('mousemove', onMove);
		}

		function addListeners_() {
			// window.addEventListener('mouseup', onUp);
			// window.addEventListener('wheel', onWheel);
			buttons.pause.addEventListener('mousedown', togglePause);
			buttons.record.addEventListener('mousedown', toggleRecord);
			buttons.stats.addEventListener('mousedown', toggleStats);
			buttons.export.addEventListener('mousedown', onExport);
			buttons.create.addEventListener('click', createShader);
			buttons.mode.addEventListener('mouseenter', function () {
				buttons.mode.classList.add('hover');
			});
			buttons.mode.addEventListener('mouseleave', function () {
				buttons.mode.classList.remove('hover');
			});
			modes.forEach(function (node) {
				node.addEventListener('mousedown', function () {
					modes.forEach(function (x) {
						x === node ? x.classList.add('active') : x.classList.remove('active');
					});
					var value = node.getAttribute('value');
					setMode(value);
				})
			});
			window.addEventListener('message', onMessage, false);
			window.addEventListener('resize', onResize);
			errors.addEventListener('click', function () {
				clearDiagnostic();
			});
			addCanvasListeners_();
		}

		addListeners_();
		resize();
		vscode.setState(options);
	}

	function clearDiagnostic() {
		vscode.postMessage({
			command: 'clearDiagnostic',
			data: null,
		});
	}

	function revealGlslLine(data) {
		vscode.postMessage({
			command: 'revealGlslLine',
			data: JSON.stringify(data),
		});
	}

	function onGlslError(message) {
		// console.log('onGlslError', message);
		var options = window.options
		var errors = document.querySelector('.errors');
		var errorLines = [],
			warningLines = [],
			lines = [];
		message.error.replace(/ERROR: \d+:(\d+): \'(.+)\' : (.+)/g, function (m, l, v, t) {
			l = Number(l) - message.offset;
			var li = '<li><span class="error" unselectable reveal-line="' + lines.length + '"><span class="line">ERROR line ' + l + '</span> <span class="value" title="' + v + '">' + v + '</span> <span class="text" title="' + t + '">' + t + '</span></span></li>';
			errorLines.push(li);
			lines.push([options.uri, l, 'ERROR (' + v + ') ' + t]);
			return li;
		});
		message.error.replace(/WARNING: \d+:(\d+): \'(.*\n*|.*|\n*)\' : (.+)/g, function (m, l, v, t) {
			l = Number(l) - message.offset;
			var li = '<li><span class="warning" unselectable reveal-line="' + lines.length + '"><span class="line">WARN line ' + l + '</span> <span class="text" title="' + t + '">' + t + '</span></span></li>';
			warningLines.push(li);
			lines.push([options.uri, l, 'ERROR (' + v + ') ' + t]);
			return li;
		});
		var output = '<div class="errors-content"><div class="title">glsl-canvas error</div><ul>';
		output += errorLines.join('\n');
		output += warningLines.join('\n');
		output += '</ul></div>';
		errors.innerHTML = output;
		errors.classList.add('active');
		// console.log('onGlslError', 'errorLines', errorLines, 'warningLines', warningLines);
		[].slice.call(document.querySelectorAll('.errors [reveal-line]')).forEach(function (node) {
			var index = parseInt(node.getAttribute('reveal-line'));
			node.addEventListener('click', function (event) {
				revealGlslLine(lines[index]);
				event.preventDefault();
				event.stopPropagation();
			});
		});
		document.querySelector('body').setAttribute('class', 'idle');
		/*
		var body = document.querySelector('body');
		body.classList.remove('ready', 'empty');
		body.classList.add('idle');
		*/
	}

	function onGlslTextureError(error) {
		// console.log('onGlslTextureError', error);
		vscode.postMessage({
			command: 'textureError',
			data: JSON.stringify(error),
		});
	}

	function onGlslLoadError(error) {
		vscode.postMessage({
			command: 'loadError',
			data: JSON.stringify({ message: String(error) }),
		});
	}

	window.addEventListener('load', onLoad);

}());
