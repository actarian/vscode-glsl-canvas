'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import { ExtensionContext, TextDocumentContentProvider, EventEmitter, Event, Uri, ViewColumn } from 'vscode';

export function activate(context: ExtensionContext) {
    let uri = Uri.parse('glsl-preview://authority/glsl-preview');
    let provider = new GlslDocumentContentProvider(context);
    let content = vscode.workspace.registerTextDocumentContentProvider('glsl-preview', provider);
    let ti;

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
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
        return vscode.commands.executeCommand('vscode.previewHtml', uri, ViewColumn.Two, 'GlslCanvas').then((success) => {

        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(command, content);
}

class GlslDocumentContentProvider implements TextDocumentContentProvider {

    private onChange = new EventEmitter<Uri>();
    private ctx: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.ctx = context;
    }

    private getResourcePath(mediaFile): string {
        return this.ctx.asAbsolutePath(path.join('resources', mediaFile));
    }

    public provideTextDocumentContent(uri: Uri): string {

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

    get onDidChange(): Event<Uri> {
        return this.onChange.event;
    }

    public update(uri: Uri) {
        this.onChange.fire(uri);
    }
}

export function deactivate() {
}
