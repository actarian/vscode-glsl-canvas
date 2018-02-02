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
        ti = setTimeout(function () {
            if (vscode.window.activeTextEditor && e.document === vscode.window.activeTextEditor.document) {
                provider.update(uri);
            }
        }, 1000);
    });
    let command = vscode.commands.registerCommand('extension.showGlslCanvas', () => {
        return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode_1.ViewColumn.Two, 'glslCanvas').then((success) => {
            // success
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });
    context.subscriptions.push(command, content);
    command = vscode.commands.registerCommand('extension.revealGlslLine', (uri, line) => {
        // console.log('extension.revealGlslLine', line, uri.toString());
        for (let editor of vscode.window.visibleTextEditors) {
            // console.log('editor', editor.document.uri.toString());
            if (editor.document.uri.toString() === uri.toString()) {
                let range = editor.document.lineAt(line - 1).range;
                editor.selection = new vscode.Selection(range.start, range.end);
                editor.revealRange(range);
            }
        }
    });
}
exports.activate = activate;
class GlslDocumentContentProvider {
    constructor(context) {
        this.onChange = new vscode_1.EventEmitter();
        this.ctx = context;
    }
    provideTextDocumentContent(uri) {
        const editorConfig = vscode.workspace.getConfiguration('editor');
        // console.log('editorConfig', editorConfig);
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        // const has_textures = 'textures' in vscode.workspace.getConfiguration('glsl-canvas');
        let textures = config['textures'] || {};
        let fragment = vscode.window.activeTextEditor.document.getText();
        let vertex = '';
        const content = `        
            <head>
                <link rel="stylesheet" href="file://${this.getResource('extension.min.css')}" />   
                <style>
                    html, body { font-family: ${editorConfig.fontFamily}; font-weight: ${editorConfig.fontWeight}; font-size: ${editorConfig.fontSize}; };
                </style>
                <script src="file://${this.getResource('glslCanvas.min.js')}"></script>
            </head>
            <script type="x-shader/x-fragment" id="fragment">${fragment}</script>
            <script type="x-shader/x-vertex" id="vertex">${vertex}</script>
            <script>
                var textures = ${JSON.stringify(textures)};
                var command = ${JSON.stringify(vscode.window.activeTextEditor.document.uri)};
            </script>
            <body>
                <div id="content">
                    <canvas id="shader"></canvas>
                </div>
                <script src="file://${this.getResource('shader.min.js')}"></script>
            </body>
        `;
        // console.log('provideTextDocumentContent', content);
        return content;
    }
    get onDidChange() {
        return this.onChange.event;
    }
    update(uri) {
        this.onChange.fire(uri);
    }
    getResource(resource) {
        return this.ctx.asAbsolutePath(path.join('resources', resource));
    }
}
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map