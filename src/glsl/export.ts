'use strict';

import { ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as spawn from 'spawn-command-with-kill';
import * as vscode from 'vscode';
import GlslOptions from './options';

export default class GlslExport {

	static terminal: vscode.Terminal;
	static npm: boolean = false;

	static onExport(extensionPath: string, options: GlslOptions) {
		// console.log('onExport', extensionPath, options.fragment, options.textures, options.uniforms);
		const workpath = options.workpath.replace('vscode-resource:/', '');
		const includeUris: string[] = GlslExport.getInlineIncludes(options);
		const textureUris: string[] = GlslExport.getInlineTextures(options.fragment);
		const uniforms: { [key: string]: any } = {};
		for (let key in options.uniforms) {
			const regexp = new RegExp('uniform\\s+\\w*\\s+(' + key + ')\\s*;');
			if (regexp.test(options.fragment)) {
				uniforms[key] = options.uniforms[key];
			}
		}
		const textures: { [key: string]: string } = {};
		for (let key in options.textures) {
			const regexp = new RegExp('uniform\\s+sampler2D\\s+(u_texture_' + key + ')\\s*;');
			if (regexp.test(options.fragment)) {
				let texture = options.textures[key];
				if (texture.indexOf(options.workpath) === 0) {
					texture = texture.replace(options.workpath, '');
					textureUris.push(texture);
				}
				textures[key] = texture;
			}
		}
		const extensions: string[] = options.extensions;
		// const uniforms = JSON.stringify(options.uniforms, null, '\t');
		GlslExport.selectFolder().then(
			(outputPath: string) => {
				const resourcePath = vscode.Uri.file(path.join(extensionPath, 'resources', 'export')).fsPath;
				const tasks1: Promise<string[] | string>[] = includeUris.map((x, i) => GlslExport.copyFile(
					x,
					path.join(outputPath, 'shaders', `${i}-${path.basename(x)}`)
				));
				const tasks2: Promise<string[] | string>[] = textureUris.map(x => GlslExport.copyFile(
					path.join(workpath, x),
					path.join(outputPath, x)
				));
				const tasks3: Promise<string[] | string>[] = [
					GlslExport.copyFolder(
						path.join(resourcePath),
						path.join(outputPath)
					),
					GlslExport.copyFolder(
						path.join(resourcePath, 'css'),
						path.join(outputPath, 'css')
					),
					GlslExport.copyFolder(
						path.join(resourcePath, 'img'),
						path.join(outputPath, 'img')
					),
					GlslExport.copyFile(
						path.join(extensionPath, 'node_modules', 'stats.js', 'build', 'stats.min.js'),
						path.join(outputPath, 'js', 'stats.min.js')
					),
					GlslExport.copyFile(
						path.join(extensionPath, 'node_modules', 'glsl-canvas-js', 'dist', 'umd', 'glsl-canvas.min.js'),
						path.join(outputPath, 'js', 'glsl-canvas.min.js')
					),
					GlslExport.writeFile(
						options.fragment,
						path.join(outputPath, 'shaders', 'fragment.glsl')
					),
					GlslExport.writeFile(`<!DOCTYPE html>
	<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=2,user-scalable=yes">
		<title>GlslCanvas</title>
		<link type="image/png" href="/img/favicon-32x32.png" sizes="32x32" rel="icon" />
		<link type="image/png" href="/img/favicon-16x16.png" sizes="16x16" rel="icon" />
		<link type="image/x-icon" href="/img/favicon.ico" rel="icon"/>
		<link type="text/css" href="/css/glsl-canvas.css" rel="stylesheet"/>
		<script type="text/javascript" src="/js/stats.min.js"></script>
		<script type="text/javascript" src="/js/glsl-canvas.min.js"></script>
	</head>

	<body>
		<canvas class="glsl-canvas" data-fragment-url="shaders/fragment.glsl"></canvas>
	</body>
	<script>
		/*
		stats.js
		*/
		var stats = new Stats();
		stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(stats.dom);

		/*
		glsl-canvas.js
		Attributes: data-fragment-url, data-vertex-url, data-fragment, data-vertex, controls, data-autoplay
		Events: load, error, textureError, render, over, out, move, click
		Methods: load, on, pause, play, toggle, setTexture, setUniform, setUniforms, destroy
		*/
		var options = {
			extensions: ${JSON.stringify(extensions)},
		};
		var canvas = document.querySelector('.glsl-canvas');
		var glsl = new glsl.Canvas(canvas, options);
		glsl.setUniforms(${JSON.stringify(uniforms)});${Object.keys(textures).map(x => `
		glsl.setTexture('u_texture_${x}', '${textures[x]}', {
			filtering: 'mipmap',
			repeat: true,
		});`).join('')}
		glsl.on('render', function () {
			stats.end();
			// execute here custom code on every raf tick
			stats.begin();
		});
	</script>

	</html>`,
						path.join(outputPath, 'index.html')
					)
				];
				Promise.all(tasks1.concat(tasks2, tasks3)).then(
					resolve => {
						// console.log('all.resolve', resolve);
						GlslExport.detectNpm().then(
							has => {
								GlslExport.npmInstallOrStart(outputPath).then(
									(success: vscode.Terminal) => {
										// console.log('npmInstall.success', success);
									},
									(error: any) => {
										console.log('npmInstall.error', error);
									}
								);
							},
							error => {
								vscode.window.showInformationMessage(`All files exported to '${outputPath}'`);
							});
					},
					reject => {
						console.log('all.reject', reject);
					}
				);
			});
	}

	static selectFolder(openLabel: string = 'Export'): Promise<string> {
		return new Promise((resolve, reject) => {
			const options: vscode.OpenDialogOptions = {
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: openLabel,
			};
			vscode.window.showOpenDialog(options).then((uris: vscode.Uri[]) => {
				if (uris && uris[0]) {
					const outputPath = uris[0].fsPath;
					// console.log(openLabel + ' ' + outputPath);
					resolve(outputPath);
				} else {
					reject(uris);
				}
			});
		});
	}

	static readFiles(folder: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			fs.readdir(folder, (error, files) => {
				if (error) {
					reject(error);
				} else {
					resolve(files);
				}
			});
		});
	}

	static copyFolder(src: string, dest: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			GlslExport.readFiles(src).then(
				(files: string[]) => {
					Promise.all(
						files.filter(x => {
							const filePath = path.join(src, x);
							return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
						}).map(x => {
							return GlslExport.copyFile(
								path.join(src, x),
								path.join(dest, x)
							);
						})
					).then(
						files => {
							resolve(files);
						},
						error => {
							reject(error);
						});
				},
				error => {
					reject(error);
				}
			);
		});
	}

	static copyFile(src: string, dest: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const folder = path.dirname(dest);
			GlslExport.existsOrCreateFolder(folder).then(
				folder => {
					fs.copyFile(
						src,
						dest,
						(error) => {
							if (error) {
								reject(error);
							} else {
								resolve(dest);
							}
						}
					);
				},
				error => {
					reject(error);
				}
			);
		});
	}

	static writeFile(content: string, dest: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const folder = path.dirname(dest);
			GlslExport.existsOrCreateFolder(folder).then(
				folder => {
					fs.writeFile(
						dest,
						content,
						'utf8',
						error => {
							if (error) {
								reject(error);
							} else {
								resolve(dest);
							}
						});
				},
				error => {
					reject(error);
				}
			);
		});
	}

	static existsOrCreateFolder(folder: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.exists(folder, (exists: boolean) => {
				if (exists) {
					resolve(folder);
				} else {
					return fs.mkdir(folder, (error) => {
						if (error) {
							if (fs.existsSync(folder)) {
								resolve(folder);
							} else {
								reject(error);
							}
						} else {
							resolve(folder);
						}
					});
				}
			});
		});
	}

	static npmInstallOrStart(dest: string): Thenable<vscode.Terminal> {
		return new Promise((resolve, reject) => {
			if (fs.existsSync(path.join(dest, 'node_modules'))) {
				const terminal = GlslExport.runCommand(['--prefix', `"${dest}"`, 'start', `"${dest}"`], dest);
				resolve(terminal);
			} else {
				const terminal = GlslExport.runCommand(['--prefix', `"${dest}"`, 'install', `"${dest}"`], dest);
				resolve(terminal);
			}
		});
	}

	static runCommand(args: string[], workpath: string | undefined): vscode.Terminal {
		const cmd_args = Array.from(args);
		if (!GlslExport.terminal) {
			GlslExport.terminal = vscode.window.createTerminal('npm');
		}
		GlslExport.terminal.show();
		if (workpath) {
			// Replace single backslash with double backslash.
			const textCwd = workpath.replace(/\\/g, '\\\\');
			GlslExport.terminal.sendText(['cd', `"${textCwd}"`].join(' '));
		}
		cmd_args.splice(0, 0, 'npm');
		GlslExport.terminal.sendText(cmd_args.join(' '));
		return GlslExport.terminal;
	}

	static getInlineIncludes(options: GlslOptions): string[] {
		const fragmentString = options.fragment;
		const slices: string[] = [];
		const includes: string[] = [];
		const regexp = /#include\s*['|"](.*.glsl)['|"]/gm;
		let i = 0, n = 0;
		let match;
		while ((match = regexp.exec(fragmentString)) !== null) {
			slices.push(fragmentString.slice(i, match.index));
			i = match.index + match[0].length;
			const include = match[1].replace('vscode-resource:/', '');
			const file = path.basename(include);
			includes.push(include);
			// console.log('include', include, 'file', file);
			slices.push(`#include "shaders/${n}-${file}"`);
			n++;
		}
		slices.push(fragmentString.slice(i));
		const fragment = slices.join('');
		options.fragment = fragment;
		// console.log('fragment', fragment);
		// return [];
		return includes;
	}

	static getInlineTextures(fragmentString: string): string[] {
		const textures: string[] = [];
		const textureExtensions = ['jpg', 'jpeg', 'png', 'ogv', 'webm', 'mp4'];
		const regexp = /uniform\s*sampler2D\s*([\w]*);(\s*\/\/\s*([\w|\:\/\/|\.|\-|\_]*)|\s*)/gm;
		let matches;
		while ((matches = regexp.exec(fragmentString)) !== null) {
			const key = matches[1];
			if (matches[3]) {
				const ext = matches[3].split('.').pop().toLowerCase();
				const url = matches[3];
				if (url && textureExtensions.indexOf(ext) !== -1) {
					textures.push(url);
				}
			}
		}
		return textures;
	}

	static detectNpm(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const config = vscode.workspace.getConfiguration('glsl-canvas');
			if (config['installOnExport'] === false) {
				return reject(false);
			}
			if (GlslExport.npm) {
				return resolve(true);
			}
			const childProcess: ChildProcess = spawn('npm -v');
			childProcess.stdout.on('data', function (data) {
				// console.log('stdout', data.toString());
				GlslExport.npm = true;
				resolve(true);
			});
			childProcess.stderr.on('data', function (data) {
				// console.log('stderr', data.toString());
				reject(data.toString());
			});
			childProcess.kill();
		});
	}

	static dispose() {
		if (GlslExport.terminal) {
			GlslExport.terminal.dispose();
			GlslExport.terminal = null;
		}
	}
}
