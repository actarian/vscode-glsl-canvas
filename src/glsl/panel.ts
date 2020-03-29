'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { Uri } from 'vscode';
import GlslOptions from './options';

const DESERIALIZE_PANEL: boolean = true;

export default class GlslPanel {

	public static current: GlslPanel | undefined;
	public static readonly viewType = 'glslCanvas';
	private readonly panel_: vscode.WebviewPanel;
	private readonly extensionPath_: string;
	private disposables_: vscode.Disposable[] = [];
	private onMessage_: Function;
	private onMessageDisposable_: vscode.Disposable;

	set onMessage(onMessage: Function) {
		this.onMessage_ = onMessage;
		if (this.onMessageDisposable_) {
			this.onMessageDisposable_.dispose();
		}
		this.onMessageDisposable_ = this.panel_.webview.onDidReceiveMessage(message => {
			if (typeof onMessage === 'function') {
				onMessage(message);
			}
		}, null, this.disposables_);
	}

	get onMessage(): Function {
		return this.onMessage_;
	}

	private constructor(
		panel: vscode.WebviewPanel,
		extensionPath: string,
		onMessage?: Function,
	) {
		this.panel_ = panel;
		this.extensionPath_ = extensionPath;
		this.panel_.onDidDispose(() => this.dispose(), null, this.disposables_);
		/*
		// Update the content based on view changes
		// cause an unneeded reload of the canvas
		this.panel_.onDidChangeViewState(e => {
			if (this.panel_.visible) {
				// console.log('onDidChangeViewState', e);
				this.render();
			}
		}, null, this.disposables_);
		*/
		this.onMessage = onMessage;
		this.render();
		// console.log('GlslPanel');
	}

	public static createOrShow(extensionPath: string, onMessage?: Function): GlslPanel {
		const viewColumn = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
		if (GlslPanel.current) {
			if (DESERIALIZE_PANEL) {
				GlslPanel.current.onMessage = onMessage;
				GlslPanel.current.panel_.reveal(viewColumn, true);
				return GlslPanel.current;
			} else {
				GlslPanel.current.dispose();
			}
		}
		const localResourceRoots = this.getLocalResourceRoots(extensionPath);
		const panel = vscode.window.createWebviewPanel(
			GlslPanel.viewType,
			'GlslCanvas',
			{
				viewColumn: viewColumn,
				preserveFocus: true,
			},
			{
				enableScripts: true,
				retainContextWhenHidden: true, // !!!
				localResourceRoots: localResourceRoots,
			}
		);
		GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
		return GlslPanel.current;
	}

	public static getLocalResourceRoots(extensionPath: string): vscode.Uri[] {
		const localResourceRoots = [];
		localResourceRoots.push(vscode.Uri.file(path.join(extensionPath, 'resources')));
		if (vscode.workspace && vscode.workspace.rootPath) {
			localResourceRoots.push(vscode.Uri.file(vscode.workspace.rootPath));
		}
		// console.log(localResourceRoots);
		return localResourceRoots;
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string, onMessage?: Function) {
		// panel.webview.options.localResourceRoots.concat(this.getLocalResourceRoots(extensionPath));
		GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
	}

	public static update(uri: vscode.Uri) {
		if (GlslPanel.current) {
			GlslPanel.current.update(uri);
		}
	}

	public static render(uri: vscode.Uri) {
		if (GlslPanel.current) {
			GlslPanel.current.render(uri);
		}
	}

	public static rebuild(onMessage?: Function) {
		if (GlslPanel.current) {
			const extensionPath = GlslPanel.current.extensionPath_;
			GlslPanel.dispose();
			GlslPanel.createOrShow(extensionPath, onMessage);
		}
	}

	public static reveal(uri: vscode.Uri) {
		if (GlslPanel.current) {
            /*
            const viewColumn = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
            console.log('reveal', vscode.window.activeTextEditor, viewColumn);
            GlslPanel.current.panel_.reveal(viewColumn, true);
            */
			GlslPanel.current.panel_.reveal(vscode.ViewColumn.Beside, true);
			GlslPanel.current.update(uri);
		}
	}

	public static dispose() {
		if (GlslPanel.current) {
			GlslPanel.current.dispose();
		}
	}

	public dispose() {
		while (this.disposables_.length) {
			const x = this.disposables_.pop();
			if (x) {
				x.dispose();
			}
		}
		this.panel_.dispose();
		GlslPanel.current = undefined;
	}

	public update(uri: Uri) {
		const options = new GlslOptions();
		this.panel_.webview.postMessage(options.serialize()).then(
			(success) => {
				// console.log('GlslPanel.update.success');
			},
			(reason) => {
				console.log('GlslPanel.update.error');
				vscode.window.showErrorMessage(reason);
			}
		);
	}

	private render(uri?: vscode.Uri) {
		this.panel_.title = 'glslCanvas';
		this.panel_.webview.html = this.getPanelWebviewHtml(uri);
	}

	private getPanelWebviewHtml(uri?: vscode.Uri): string {
		const config = vscode.workspace.getConfiguration('editor');
		const options = new GlslOptions();
		const nonce = this.getNonce();
		const cspSource = this.getCspSource();
		// console.log('getPanelWebviewHtml', config, options);
		const content = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<!--
	<meta http-equiv="Content-Security-Policy" content="
	default-src 'none';
	script-src ${cspSource} 'self' 'nonce-${nonce}';
	style-src ${cspSource} 'self' 'nonce-${nonce}';
	img-src ${cspSource} 'self' https:;
	font-src ${cspSource} 'self';
	connect-src 'self'; " />
	-->
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link nonce="${nonce}" href="${this.getResource('fonts/styles.css')}" rel="stylesheet">
	<!-- <link nonce="${nonce}" href="${this.getResource('css/vendors.min.css')}" rel="stylesheet"> -->
	<style>
		html, body { font-family: ${config.fontFamily}; font-weight: ${config.fontWeight}; font-size: ${config.fontSize}; };
	</style>
	<link nonce="${nonce}" href="${this.getResource('css/app.min.css')}" rel="stylesheet"/>
</head>
<script nonce="${nonce}">
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
	<script nonce="${nonce}" src="${this.getResource('js/vendors.min.js')}"></script>
	<script nonce="${nonce}" src="${this.getResource('js/app.min.js')}"></script>
</body>
</html>`;
		return content;
	}

	private getCspSource(): string {
		return this.panel_.webview.cspSource;
	}

	private getResource(resource: string): vscode.Uri {
		const fileOnDisk = vscode.Uri.file(
			path.join(this.extensionPath_, 'resources', resource)
		);
		// const vscodeResource = fileOnDisk.with({ scheme: 'vscode-resource' });
		const panel = this.panel_;
		const vscodeResource = panel.webview.asWebviewUri(fileOnDisk);
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
