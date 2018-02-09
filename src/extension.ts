'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import { ExtensionContext, TextDocumentContentProvider, EventEmitter, Event, Uri, ViewColumn } from 'vscode';

let uri = Uri.parse('glsl-preview://authority/glsl-preview');
let provider: GlslDocumentContentProvider;
let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: ExtensionContext) {

    provider = new GlslDocumentContentProvider(context);
    diagnosticCollection = vscode.languages.createDiagnosticCollection('glslCanvas');

    let ti, doc;

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
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
        return vscode.commands.executeCommand('vscode.previewHtml', uri, ViewColumn.Two, 'glslCanvas').then((success) => {
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

function onDidChangeActiveTextEditor(editor: vscode.TextEditor) {
    console.log('onDidChangeActiveTextEditor', editor);
    if (editor && editor.document.languageId === 'glsl') {
        provider.update(uri);
    }
}

function onDidChangeConfiguration(e: vscode.ConfigurationChangeEvent) {
    const config = vscode.workspace.getConfiguration('glsl-canvas');
    console.log('onDidChangeConfiguration', config);
}

function onRevealLine(uri: vscode.Uri, line: number, message: string) {
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

function onDiagnostic(editor: vscode.TextEditor, line: number, message: string = 'error') {
    let startColumn: number = 0;
    let endColumn: number = 0;
    let diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();
    let file = vscode.Uri.file(editor.document.fileName).toString();
    let range = editor.document.lineAt(line - 1).range;
    // let range = new vscode.Range(line - 1, startColumn, line - 1, endColumn);
    let diagnostics = diagnosticMap.get(file);
    if (!diagnostics) {
        diagnostics = [];
    }
    let diagnostic: vscode.Diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
    diagnostics.push(diagnostic);
    diagnosticMap.set(file, diagnostics);
    diagnosticMap.forEach((value: vscode.Diagnostic[], key: string) => {
        diagnosticCollection.set(vscode.Uri.parse(key), value);
    });
}

class DocumentOptions {
    public uri: vscode.Uri;
    public fragment: string;
    public vertex: string;
    public uniforms: object;
    public textures: object;

    constructor() {
        const editor: vscode.TextEditor = vscode.window.activeTextEditor;
        const document: vscode.TextDocument = editor && editor.document.languageId === 'glsl' ? editor.document : null;
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        this.uri = document ? document.uri : null;
        this.fragment = document ? document.getText() : '';
        this.vertex = '';
        this.uniforms = config['uniforms'] || {};
        this.textures = config['textures'] || {};
    }

    public serialize(): string {
        return JSON.stringify(this);
    }
    /*
        <script type="x-shader/x-fragment" id="fragment">${fragment}</script>
        <script type="x-shader/x-vertex" id="vertex">${vertex}</script>
        <script>
            var uniforms = ${JSON.stringify(uniforms)};
            var textures = ${JSON.stringify(textures)};
            var command = ${JSON.stringify(vscode.window.activeTextEditor.document.uri)};
        </script>
    */
}

class GlslDocumentContentProvider implements TextDocumentContentProvider {
    private onChange = new EventEmitter<Uri>();
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    public provideTextDocumentContent(uri: Uri): string {
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

    get onDidChange(): Event<Uri> {
        return this.onChange.event;
    }

    public update(uri: Uri) {
        let options = new DocumentOptions();
        vscode.commands.executeCommand('_workbench.htmlPreview.postMessage', uri, options.serialize()).then((success) => {
            console.log('GlslDocumentContentProvider.update.success');
        }, (reason) => {
            console.log('GlslDocumentContentProvider.update.error');
            vscode.window.showErrorMessage(reason);
        });
        // this.onChange.fire(uri);
    }

    private getResource(resource: string): string {
        return this.context.asAbsolutePath(path.join('resources', resource));
    }
}

export function deactivate() {
    diagnosticCollection.clear();
    provider = null;
}
