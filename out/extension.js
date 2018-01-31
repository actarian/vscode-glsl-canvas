'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const vscode_1 = require("vscode");
function activate(context) {
    let uri = vscode_1.Uri.parse('glsl-preview://authority/glsl-preview');
    let provider = new GlslDocumentContentProvider(context);
    let content = vscode.workspace.registerTextDocumentContentProvider('glsl-preview', provider);
    let ti;
    vscode.workspace.onDidChangeTextDocument((e) => {
        clearTimeout(ti);
        if (!vscode.window.activeTextEditor) {
            ti = setTimeout(function () {
                if (vscode.window.activeTextEditor && e.document === vscode.window.activeTextEditor.document) {
                    provider.update(uri);
                }
            }, 1000);
        }
    });
    let command = vscode.commands.registerCommand('extension.showGlslCanvas', () => {
        return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode_1.ViewColumn.Two, 'GlslCanvas').then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });
    context.subscriptions.push(command, content);
}
exports.activate = activate;
class GlslDocumentContentProvider {
    constructor(context) {
        this.onChange = new vscode_1.EventEmitter();
        this.ctx = context;
    }
    getResourcePath(mediaFile) {
        return this.ctx.asAbsolutePath(path.join('resources', mediaFile));
    }
    provideTextDocumentContent(uri) {
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        let textureScript = "";
        // const has_textures = 'textures' in vscode.workspace.getConfiguration('glsl-canvas');
        let textures = config['textures'] || {};
        let fragment = vscode.window.activeTextEditor.document.getText();
        // fragment = fragment.replace(/(\r\n|\n|\r)/gm, "");
        let vertex = "";
        const content = `
            <head>
                <link rel="stylesheet" href="file://${this.getResourcePath('extension.min.css')}" />   
                <script src="file://${this.getResourcePath('glslCanvas.min.js')}"></script>
            </head>
            <script type="x-shader/x-fragment" id="fragment">${fragment}</script>
            <script type="x-shader/x-vertex" id="vertex">${vertex}</script>
            <script>
                var textures = ${JSON.stringify(textures)};
            </script>
            <body>         
                <canvas id="shader"></canvas>
                <script src="file://${this.getResourcePath('shader.min.js')}"></script>
            </body>
        `;
        console.log(fragment);
        console.log(content);
        return content;
    }
    get onDidChange() {
        return this.onChange.event;
    }
    update(uri) {
        this.onChange.fire(uri);
    }
}
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map