import * as path from 'path';
import * as vscode from 'vscode';
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
	private fsPath: string;

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
		state?: any,
	) {
		this.panel_ = panel;
		this.extensionPath_ = extensionPath;
		this.panel_.onDidDispose(() => this.dispose(), null, this.disposables_);
		/*
		// Update the content based on view changes
		// cause an unneeded reload of the canvas
		this.panel_.onDidChangeViewState(e => {
			if (this.panel_.visible) {
				// console.log('GlslPanel.onDidChangeViewState', e);
				this.render();
			}
		}, null, this.disposables_);
		*/
		this.onMessage = onMessage;
		this.render();
		// console.log('GlslPanel', panel, extensionPath, state);
	}

	public static createOrShow(extensionPath: string, onMessage?: Function, subscriptions?: { dispose: any }[]): GlslPanel {
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
		panel.onDidDispose(() => {
			// console.log('GlslPanel.onDidDispose');
		}, null, subscriptions);
		GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
		return GlslPanel.current;
	}

	public static getLocalResourceRoots(extensionPath: string): vscode.Uri[] {
		const rootPath = (process.platform === 'win32') ? process.cwd().split(path.sep)[0] : '/';
		const localResourceRoots = [];
		localResourceRoots.push(vscode.Uri.file(path.join(extensionPath, 'resources')));
		localResourceRoots.push(vscode.Uri.file(rootPath));
		/*
		if (vscode.workspace && vscode.workspace.rootPath) {
			localResourceRoots.push(vscode.Uri.file(vscode.workspace.rootPath));
		}
		*/
		// console.log('GlslPanel.getLocalResourceRoots', localResourceRoots);
		return localResourceRoots;
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string, onMessage?: Function, state?: any) {
		// console.log('GlslPanel.revive', panel, extensionPath, onMessage, state);
		// panel.webview.options.localResourceRoots.concat(this.getLocalResourceRoots(extensionPath));
		GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage, state);
	}

	public static update() {
		if (GlslPanel.current) {
			GlslPanel.current.update();
		}
	}

	public static render() {
		if (GlslPanel.current) {
			GlslPanel.current.render();
		}
	}

	public static rebuild(onMessage?: Function) {
		if (GlslPanel.current) {
			const extensionPath = GlslPanel.current.extensionPath_;
			GlslPanel.dispose();
			GlslPanel.createOrShow(extensionPath, onMessage);
		}
	}

	public static reveal() {
		if (GlslPanel.current) {
			/*
			const viewColumn = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
			// console.log('GlslPanel.reveal', vscode.window.activeTextEditor, viewColumn);
			GlslPanel.current.panel_.reveal(viewColumn, true);
			*/
			GlslPanel.current.panel_.reveal(vscode.ViewColumn.Beside, true);
			GlslPanel.current.update();
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

	public update() {
		// return this.render(); // !!!
		const options = new GlslOptions(this.panel_.webview, this.extensionPath_);
		const fsPath = options.uri ? options.uri.fsPath : null;
		if (this.fsPath !== fsPath) {
			this.fsPath = fsPath;
			return this.render();
		}
		// console.log('GlslPanel.update', options.workpath, options.folder, options.resources);
		this.panel_.webview.postMessage(options.serialize()).then(
			(success) => {
				// console.log('GlslPanel.update.success');
			},
			(error) => {
				console.log('GlslPanel.update.error', error);
				vscode.window.showErrorMessage(error);
			}
		);
	}

	private render() {
		this.panel_.title = 'glslCanvas';
		this.panel_.webview.html = this.getPanelWebviewHtml(this.panel_.webview);
	}

	private getPanelWebviewHtml(webview: vscode.Webview): string {
		const config = vscode.workspace.getConfiguration('editor');
		const options = new GlslOptions(webview, this.extensionPath_);
		this.fsPath = options.uri ? options.uri.fsPath : null;
		const nonce = this.getNonce();
		const content = /* html */`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Security-Policy" content="
	default-src 'none';
	connect-src ${webview.cspSource} https: http: data: blob:;
	img-src ${webview.cspSource} https: http: data: blob: mediastream:;
	media-src ${webview.cspSource} https: http: data: blob: mediastream:;
	font-src ${webview.cspSource} https: http: data: blob:;
	script-src 'nonce-${nonce}';
	style-src 'nonce-${nonce}';
	">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link nonce="${nonce}" href="${this.getResourcePath(webview, 'fonts/styles.css')}" rel="stylesheet">
	<link nonce="${nonce}" href="${this.getResourcePath(webview, 'css/vendors.min.css')}" rel="stylesheet">
	<style nonce="${nonce}">
		html, body { font-family: ${config.fontFamily}; font-weight: ${config.fontWeight}; font-size: ${config.fontSize}; };
	</style>
	<link nonce="${nonce}" href="${this.getResourcePath(webview, 'css/app.min.css')}" rel="stylesheet"/>
</head>
<body class="idle">
	<div class="content">
		<canvas class="shader"></canvas>
	</div>
	<div class="tools">
		<button class="btn btn-mode" unselectable>
			<i class="icon-flat"></i>
			<ul class="nav-modes">
				<li value="mesh"><i class="icon-mesh"></i></li>
				<li value="torus"><i class="icon-torus"></i></li>
				<li value="sphere"><i class="icon-sphere"></i></li>
				<li value="box"><i class="icon-box"></i></li>
				<li value="flat"><i class="icon-flat"></i></li>
			</ul>
		</button>
		<button class="btn btn-pause" unselectable><i class="icon-pause"></i></button>
		<button class="btn btn-record" unselectable><i class="icon-record"></i></button>
		<button class="btn btn-stats" unselectable><i class="icon-stats"></i></button>
		<button class="btn btn-export" unselectable><i class="icon-export"></i></button>
	</div>
	<div class="record"></div>
	<div class="errors"></div>
	<div class="welcome"><div class="welcome-content" unselectable><p>There's no active .glsl editor</p><button class="btn-create"><span>create one</span></button></div></div>
	<div class="missing"><div class="missing-content" unselectable><p>Oops. There was a problem with WebGL.</p></div></div>
	<script nonce="${nonce}" src="${this.getResourcePath(webview, 'js/vendors.min.js')}"></script>
	<script nonce="${nonce}">
		var options = ${options.serialize()};
	</script>
	<script nonce="${nonce}" src="${this.getResourcePath(webview, 'js/app.min.js')}"></script>
</body>
</html>`;
		return content;
	}

	private getResourcePath(webview: vscode.Webview, resource: string): string {
		const filePath = vscode.Uri.file(
			path.join(this.extensionPath_, 'resources', resource)
		);
		const uri: vscode.Uri = webview.asWebviewUri(filePath);
		const url: string = uri.scheme + '://' + uri.authority + uri.path;
		// console.log('GlslPanel.getResourcePath', url);
		return url;
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
