'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import { ExtensionContext, TextDocumentContentProvider, EventEmitter, Event, Uri, ViewColumn } from 'vscode';

export function activate(context: ExtensionContext) {
    let uri = Uri.parse('glsl-preview://authority/glsl-preview');
    let provider = new GlslDocumentContentProvider(context);
    let content = vscode.workspace.registerTextDocumentContentProvider('glsl-preview', provider);

    let editor = vscode.window.activeTextEditor;
    let doc = editor.document;

    console.log(editor.document.fileName, editor.document.languageId);

    let ti;

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        clearTimeout(ti);
        ti = setTimeout(function () {
            if (e.document === doc) {
                provider.update(uri);
            }
        }, 1000);
    });

    vscode.workspace.onDidCloseTextDocument((e: vscode.TextDocument) => {
        if (doc.isClosed) {
            clearTimeout(ti);
            console.log('onDidCloseTextDocument', e.fileName);
        }
    });

    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        console.log('onDidChangeConfiguration', config);
    });

    let command = vscode.commands.registerCommand('glsl-canvas.showGlslCanvas', () => {
        return vscode.commands.executeCommand('vscode.previewHtml', uri, ViewColumn.Two, 'glslCanvas').then((success) => {
            // success
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(command, content);

    command = vscode.commands.registerCommand('glsl-canvas.revealGlslLine', (uri: vscode.Uri, line: number) => {
        // console.log('glsl-canvas.revealGlslLine', line, uri.toString());
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
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        // const has_textures = 'textures' in vscode.workspace.getConfiguration('glsl-canvas');
        let uniforms = config['uniforms'] || {};
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
                var uniforms = ${JSON.stringify(uniforms)};
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

    get onDidChange(): Event<Uri> {
        return this.onChange.event;
    }

    public update(uri: Uri) {
        this.onChange.fire(uri);
    }

    private getResource(resource: string): string {
        return this.context.asAbsolutePath(path.join('resources', resource));
    }
}

export function deactivate() {

}
