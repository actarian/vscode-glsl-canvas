'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const vscode_1 = require("vscode");
let uri = vscode_1.Uri.parse('glsl-preview://authority/glsl-preview');
let provider;
let diagnosticCollection;
function activate(context) {
    provider = new GlslDocumentContentProvider(context);
    diagnosticCollection = vscode.languages.createDiagnosticCollection('glslCanvas');
    let ti, doc;
    vscode.workspace.onDidChangeTextDocument((e) => {
        clearTimeout(ti);
        diagnosticCollection.clear();
        ti = setTimeout(function () {
            provider.update(uri);
        }, 1000);
    });
    /*
    vscode.workspace.onDidCloseTextDocument((e: vscode.TextDocument) => {
        clearTimeout(ti);
        if (doc.isClosed) {
            clearTimeout(ti);
            console.log('onDidCloseTextDocument', e.fileName);
        }
    });
    */
    // subscribe to selection change and editor activation events
    // let subscriptions: vscode.Disposable[] = [];
    // vscode.window.onDidChangeTextEditorSelection(onDidChangeTextEditorSelection, this, context.subscriptions);
    vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor, this, context.subscriptions);
    vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
    // first opening;
    let showCommand = vscode.commands.registerCommand('glsl-canvas.showGlslCanvas', () => {
        // let editor = vscode.window.activeTextEditor;
        // if (editor && editor.document.languageId == 'glsl') {
        // doc = editor.document;
        // console.log(editor.document.fileName, editor.document.languageId);
        return vscode.commands.executeCommand('vscode.previewHtml', uri, vscode_1.ViewColumn.Two, 'glslCanvas').then((success) => {
            // success
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
        // }
    });
    vscode.commands.registerCommand('glsl-canvas.revealGlslLine', onRevealLine);
    let content = vscode.workspace.registerTextDocumentContentProvider('glsl-preview', provider);
    context.subscriptions.push(diagnosticCollection);
    context.subscriptions.push(showCommand, content);
}
exports.activate = activate;
function onDidChangeActiveTextEditor(editor) {
    console.log('onDidChangeActiveTextEditor', editor);
    if (editor && editor.document.languageId === 'glsl') {
        provider.update(uri);
    }
}
function onDidChangeConfiguration(e) {
    const config = vscode.workspace.getConfiguration('glsl-canvas');
    console.log('onDidChangeConfiguration', config);
}
function onRevealLine(uri, line, message) {
    // console.log('glsl-canvas.revealGlslLine', line, uri.toString());
    for (let editor of vscode.window.visibleTextEditors) {
        // console.log('editor', editor.document.uri.toString());
        if (editor.document.uri.toString() === uri.toString()) {
            let range = editor.document.lineAt(line - 1).range;
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
            onDiagnostic(editor, line, message);
        }
    }
}
function onDiagnostic(editor, line, message = 'error') {
    let startColumn = 0;
    let endColumn = 0;
    let diagnosticMap = new Map();
    let file = vscode.Uri.file(editor.document.fileName).toString();
    let range = editor.document.lineAt(line - 1).range;
    // let range = new vscode.Range(line - 1, startColumn, line - 1, endColumn);
    let diagnostics = diagnosticMap.get(file);
    if (!diagnostics) {
        diagnostics = [];
    }
    let diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
    diagnostics.push(diagnostic);
    diagnosticMap.set(file, diagnostics);
    diagnosticMap.forEach((value, key) => {
        diagnosticCollection.set(vscode.Uri.parse(key), value);
    });
}
class DocumentOptions {
    constructor() {
        const editor = vscode.window.activeTextEditor;
        const document = editor && editor.document.languageId === 'glsl' ? editor.document : null;
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        this.uri = document ? document.uri : null;
        this.fragment = document ? document.getText() : '';
        this.vertex = '';
        this.uniforms = config['uniforms'] || {};
        this.textures = config['textures'] || {};
    }
    serialize() {
        return JSON.stringify(this);
    }
}
class GlslDocumentContentProvider {
    constructor(context) {
        this.onChange = new vscode_1.EventEmitter();
        this.context = context;
    }
    provideTextDocumentContent(uri) {
        console.log('provideTextDocumentContent');
        const editorConfig = vscode.workspace.getConfiguration('editor');
        // console.log('editorConfig', editorConfig);
        let options = new DocumentOptions();
        const content = `        
            <head>
                <link rel="stylesheet" href="file://${this.getResource('extension.min.css')}" />   
                <style>
                    html, body { font-family: ${editorConfig.fontFamily}; font-weight: ${editorConfig.fontWeight}; font-size: ${editorConfig.fontSize}; };
                </style>
                <link href="file://${this.getResource('fonts/styles.css')}" rel="stylesheet">
                <script src="file://${this.getResource('glslCanvas.min.js')}"></script>                
            </head>
            <script>
                var options = ${options.serialize()};
            </script>
            <body>
                <div id="content">
                    <canvas id="shader"></canvas>
                </div>
                <div id="tools">
                    <button id="pause" class="btn" unselectable><i class="icon-pause"></i></button>
                    <button id="record" class="btn" unselectable><i class="icon-record"></i></button>
                    <button id="stats" class="btn" unselectable><i class="icon-stats"></i></button>
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
        let options = new DocumentOptions();
        vscode.commands.executeCommand('_workbench.htmlPreview.postMessage', uri, options.serialize()).then((success) => {
            console.log('GlslDocumentContentProvider.update.success');
        }, (reason) => {
            console.log('GlslDocumentContentProvider.update.error');
            vscode.window.showErrorMessage(reason);
        });
        // this.onChange.fire(uri);
    }
    getResource(resource) {
        return this.context.asAbsolutePath(path.join('resources', resource));
    }
}
function deactivate() {
    diagnosticCollection.clear();
    provider = null;
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map