'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const options_1 = require("./options");
const DESERIALIZE_PANEL = true;
class GlslPanel {
    constructor(panel, extensionPath, onMessage, state) {
        this.disposables_ = [];
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
        this.render(state ? state.uri : null);
        // console.log('GlslPanel');
    }
    set onMessage(onMessage) {
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
    get onMessage() {
        return this.onMessage_;
    }
    static createOrShow(extensionPath, onMessage) {
        const viewColumn = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
        if (GlslPanel.current) {
            if (DESERIALIZE_PANEL) {
                GlslPanel.current.onMessage = onMessage;
                GlslPanel.current.panel_.reveal(viewColumn, true);
                return GlslPanel.current;
            }
            else {
                GlslPanel.current.dispose();
            }
        }
        const localResourceRoots = this.getLocalResourceRoots(extensionPath);
        const panel = vscode.window.createWebviewPanel(GlslPanel.viewType, 'GlslCanvas', {
            viewColumn: viewColumn,
            preserveFocus: true,
        }, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: localResourceRoots,
        });
        GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
        return GlslPanel.current;
    }
    static getLocalResourceRoots(extensionPath) {
        const localResourceRoots = [];
        localResourceRoots.push(vscode.Uri.file(path.join(extensionPath, 'resources')));
        if (vscode.workspace && vscode.workspace.rootPath) {
            localResourceRoots.push(vscode.Uri.file(vscode.workspace.rootPath));
        }
        // console.log(localResourceRoots);
        return localResourceRoots;
    }
    static revive(panel, extensionPath, onMessage, state) {
        // panel.webview.options.localResourceRoots.concat(this.getLocalResourceRoots(extensionPath));
        GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage, state);
    }
    static update(uri) {
        if (GlslPanel.current) {
            GlslPanel.current.update(uri);
        }
    }
    static render(uri) {
        if (GlslPanel.current) {
            GlslPanel.current.render(uri);
        }
    }
    static rebuild(onMessage) {
        if (GlslPanel.current) {
            const extensionPath = GlslPanel.current.extensionPath_;
            GlslPanel.dispose();
            GlslPanel.createOrShow(extensionPath, onMessage);
        }
    }
    static reveal(uri) {
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
    static dispose() {
        if (GlslPanel.current) {
            GlslPanel.current.dispose();
        }
    }
    dispose() {
        while (this.disposables_.length) {
            const x = this.disposables_.pop();
            if (x) {
                x.dispose();
            }
        }
        this.panel_.dispose();
        GlslPanel.current = undefined;
    }
    update(uri) {
        const fsPath = uri ? uri.fsPath : null;
        if (this.fsPath !== fsPath) {
            this.fsPath = fsPath;
            return this.render(uri);
        }
        const options = new options_1.default();
        // this.fsPath = options.uri ? options.uri.fsPath : null;
        this.panel_.webview.postMessage(options.serialize()).then((success) => {
            // console.log('GlslPanel.update.success');
        }, (reason) => {
            console.log('GlslPanel.update.error');
            vscode.window.showErrorMessage(reason);
        });
    }
    render(uri) {
        this.panel_.title = 'glslCanvas';
        this.panel_.webview.html = this.getPanelWebviewHtml(uri);
    }
    getPanelWebviewHtml(uri) {
        const config = vscode.workspace.getConfiguration('editor');
        const options = new options_1.default();
        // options.resources = this.getResource('').fsPath;
        // options.resources = this.getResource('').fsPath;
        options.resources = 'vscode-resource:' + vscode.Uri.file(path.join(this.extensionPath_, 'resources')).path;
        this.fsPath = options.uri ? options.uri.fsPath : null;
        const nonce = this.getNonce();
        const cspSource = this.getCspSource();
        // console.log('getPanelWebviewHtml', config, options);
        const content = /* html */ `<!DOCTYPE html>
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
	<div class="errors"></div>
	<div class="welcome"><div class="welcome-content" unselectable><p>There's no active .glsl editor</p><button class="btn-create"><span>create one</span></button></div></div>
	<div class="missing"><div class="missing-content" unselectable><p>Oops. There was a problem with WebGL.</p></div></div>
	<script nonce="${nonce}" src="${this.getResource('js/vendors.min.js')}"></script>
	<script nonce="${nonce}" src="${this.getResource('js/app.min.js')}"></script>
</body>
</html>`;
        return content;
    }
    getCspSource() {
        return this.panel_.webview.cspSource;
    }
    getResource(resource) {
        const fileOnDisk = vscode.Uri.file(path.join(this.extensionPath_, 'resources', resource));
        // const vscodeResource = fileOnDisk.with({ scheme: 'vscode-resource' });
        const panel = this.panel_;
        const vscodeResource = panel.webview.asWebviewUri(fileOnDisk);
        return vscodeResource;
    }
    getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
exports.default = GlslPanel;
GlslPanel.viewType = 'glslCanvas';
//# sourceMappingURL=panel.js.map