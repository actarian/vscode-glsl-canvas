'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const options_1 = require("./options");
class GlslPanel {
    constructor(panel, extensionPath, onMessage) {
        this.disposables = [];
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
        this.panel.webview.onDidReceiveMessage(message => {
            if (typeof this.onMessage === 'function') {
                this.onMessage(message);
            }
            /*
            switch (message.command) {
                case 'createShader':
                    onCreateShader();
                    return;
                case 'revealGlslLine':
                    var data = JSON.parse(message.data);
                    onRevealLine.apply(this, data);
                    return;
            }
            */
        }, null, this.disposables);
    }
    static createOrShow(extensionPath, onMessage) {
        const viewColumn = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
        if (GlslPanel.current) {
            GlslPanel.current.panel.reveal(viewColumn, true);
            return GlslPanel.current;
        }
        const localResourceRoots = [vscode.Uri.file(path.join(extensionPath, 'resources'))];
        if (vscode.workspace) {
            localResourceRoots.push(vscode.Uri.file(vscode.workspace.rootPath));
        }
        const panel = vscode.window.createWebviewPanel(GlslPanel.viewType, 'GlslCanvas', {
            viewColumn: viewColumn,
            preserveFocus: true,
        }, {
            enableScripts: true,
            localResourceRoots: localResourceRoots,
        });
        GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
        return GlslPanel.current;
    }
    static revive(panel, extensionPath, onMessage) {
        GlslPanel.current = new GlslPanel(panel, extensionPath, onMessage);
    }
    static update(uri) {
        if (GlslPanel.current) {
            GlslPanel.current.update(uri);
        }
    }
    static rebuild() {
        if (GlslPanel.current) {
            const extensionPath = GlslPanel.current.extensionPath;
            GlslPanel.dispose();
            GlslPanel.createOrShow(extensionPath);
        }
    }
    static reveal(uri) {
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
    static dispose() {
        if (GlslPanel.current) {
            GlslPanel.current.dispose();
        }
    }
    dispose() {
        GlslPanel.current = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    update(uri) {
        const options = new options_1.default();
        this.panel.webview.postMessage(options.serialize()).then((success) => {
            // console.log('GlslDocumentContentProvider.update.success');
        }, (reason) => {
            console.log('GlslDocumentContentProvider.update.error');
            vscode.window.showErrorMessage(reason);
        });
    }
    render() {
        this.panel.title = 'glslCanvas';
        this.panel.webview.html = this.getPanelWebviewHtml();
    }
    getPanelWebviewHtml() {
        const config = vscode.workspace.getConfiguration('editor');
        const options = new options_1.default();
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
                </div>
                <div class="errors"></div>
                <div class="welcome"><div class="welcome-content" unselectable><p>There's no active .glsl editor</p><button class="btn-create"><span>create one</span></button></div></div>
                <div class="missing"><div class="missing-content" unselectable><p>Oops. There was a problem with WebGL.</p></div></div>
                <script nonce="${this.getNonce()}" src="${this.getResource('js/app.min.js')}"></script>
            </body>
        `;
        return content;
    }
    getResource(resource) {
        const file = vscode.Uri.file(path.join(this.extensionPath, 'resources', resource));
        const vscodeResource = file.with({ scheme: 'vscode-resource' });
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
GlslPanel.viewType = 'glslCanvas';
exports.default = GlslPanel;
//# sourceMappingURL=panel.js.map