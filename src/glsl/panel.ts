'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { Uri } from 'vscode';
import GlslOptions from './options';

export default class GlslPanel {

	public static current: GlslPanel | undefined;
	public static readonly viewType = 'glslCanvas';
	private readonly panel: vscode.WebviewPanel;
	private readonly extensionPath: string;
	private disposables: vscode.Disposable[] = [];
	private _onMessage: Function;

	set onMessage(onMessage: Function) {
		this._onMessage = onMessage;
		this.panel.webview.onDidReceiveMessage(message => {
			if (typeof onMessage === 'function') {
				onMessage(message);
			}
		}, null, this.disposables);
	}

	get onMessage(): Function {
		return this._onMessage;
	}

	private constructor(
		panel: vscode.WebviewPanel,
		extensionPath: string,
		onMessage?: Function,
	) {
		this.panel = panel;
		this.extensionPath = extensionPath;
		this.render();
		this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
		this.panel.onDidChangeViewState(e => {
            /*
            if (this.panel.visible) {
                console.log('onDidChangeViewState', e);
                // this.render();
            }
            */
		}, null, this.disposables);
		this.onMessage = onMessage;
	}

	public static createOrShow(extensionPath: string, onMessage?: Function): GlslPanel {
		const viewColumn = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
		if (GlslPanel.current) {
			GlslPanel.current.onMessage = onMessage;
			GlslPanel.current.panel.reveal(viewColumn, true);
			return GlslPanel.current;
		}
		const localResourceRoots = [];
		localResourceRoots.push(
			vscode.Uri.file(path.join(extensionPath, 'resources'))
		);
		if (vscode.workspace && vscode.workspace.rootPath) {
			localResourceRoots.push(
				vscode.Uri.file(vscode.workspace.rootPath)
			);
		}
		const panel = vscode.window.createWebviewPanel(
			GlslPanel.viewType,
			'GlslCanvas', {
				viewColumn: viewColumn,
				preserveFocus: true,
			}, {
				enableScripts: true,
				retainContextWhenHidden: true, // !!!
				localResourceRoots: localResourceRoots,
			}
		);
		GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
		return GlslPanel.current;
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string, onMessage?: Function) {
		GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
	}

	public static update(uri: vscode.Uri) {
		if (GlslPanel.current) {
			GlslPanel.current.update(uri);
		}
	}

	public static rebuild(onMessage?: Function) {
		if (GlslPanel.current) {
			const extensionPath = GlslPanel.current.extensionPath;
			GlslPanel.dispose();
			GlslPanel.createOrShow(extensionPath, onMessage);
		}
	}

	public static reveal(uri: vscode.Uri) {
		if (GlslPanel.current) {
            /*
            const viewColumn = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
            console.log('reveal', vscode.window.activeTextEditor, viewColumn);
            GlslPanel.current.panel.reveal(viewColumn, true);
            */
			GlslPanel.current.panel.reveal(vscode.ViewColumn.Beside, true);
			GlslPanel.current.update(uri);
		}
	}

	public static dispose() {
		if (GlslPanel.current) {
			GlslPanel.current.dispose();
		}
	}

	public dispose() {
		GlslPanel.current = undefined;
		this.panel.dispose();
		while (this.disposables.length) {
			const x = this.disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	public update(uri: Uri) {
		const options = new GlslOptions();
		this.panel.webview.postMessage(options.serialize()).then(
			(success) => {
				// console.log('GlslPanel.update.success');
			},
			(reason) => {
				console.log('GlslPanel.update.error');
				vscode.window.showErrorMessage(reason);
			}
		);
	}

	private render() {
		this.panel.title = 'glslCanvas';
		this.panel.webview.html = this.getPanelWebviewHtml();
	}

	private getPanelWebviewHtml(): string {
		const config = vscode.workspace.getConfiguration('editor');
		const options = new GlslOptions();
		// console.log('getPanelWebviewHtml', config, options);
		const content = `
<head>
	<link href="${this.getResource('fonts/styles.css')}" rel="stylesheet">
	<!-- <link href="${this.getResource('css/vendors.min.css')}" rel="stylesheet"> -->
	<style>
		html, body { font-family: ${config.fontFamily}; font-weight: ${config.fontWeight}; font-size: ${config.fontSize}; };
	</style>
	<script nonce="${this.getNonce()}" src="${this.getResource('js/vendors.min.js')}"></script>
	<link href="${this.getResource('css/app.min.css')}" rel="stylesheet"/>
</head>
<script>
	var options = ${options.serialize()};
</script>
<body class="idle">
	<div class="content">
		<canvas class="shader"></canvas>
	</div>
	<div class="tools">
		<button class="btn btn-pause" unselectable><i class="icon-pause"></i></button>
		<button class="btn btn-record" unselectable><i class="icon-record"></i></button>
		<button class="btn btn-stats" unselectable><i class="icon-stats"></i></button>
		<button class="btn btn-export" unselectable><i class="icon-export"></i></button>
	</div>
	<div class="errors"></div>
	<div class="welcome"><div class="welcome-content" unselectable><p>There's no active .glsl editor</p><button class="btn-create"><span>create one</span></button></div></div>
	<div class="missing"><div class="missing-content" unselectable><p>Oops. There was a problem with WebGL.</p></div></div>
	<script nonce="${this.getNonce()}" src="${this.getResource('js/app.min.js')}"></script>
</body>
        `;
		return content;
	}

	private getResource(resource: string): vscode.Uri {
		const file = vscode.Uri.file(path.join(this.extensionPath, 'resources', resource));
		const vscodeResource = file.with({ scheme: 'vscode-resource' });
		return vscodeResource;
	}

	private getNonce() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

}
