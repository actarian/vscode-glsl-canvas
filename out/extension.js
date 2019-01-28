'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const color_provider_1 = require("./glsl/color.provider");
const common_1 = require("./glsl/common");
const options_1 = require("./glsl/options");
const panel_1 = require("./glsl/panel");
const USE_SERIALIZE = true;
let uri = vscode_1.Uri.parse('glsl-preview://authority/glsl-preview');
let diagnosticCollection;
let ti;
function activate(context) {
    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument);
    vscode.workspace.onDidCloseTextDocument(onDidCloseTextDocument);
    vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
    vscode.workspace.onDidSaveTextDocument(onDidSaveDocument);
    vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor);
    // vscode.window.onDidChangeTextEditorViewColumn(onDidChangeTextEditorViewColumn);
    // vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument);
    // vscode.commands.registerCommand('glsl-canvas.createShader', onCreateShader);
    // vscode.commands.registerCommand('glsl-canvas.revealLine', onRevealLine);
    vscode.commands.registerCommand('glsl-canvas.showDiagnostic', onShowDiagnostic);
    vscode.commands.registerCommand('glsl-canvas.refreshCanvas', onRefreshCanvas);
    context.subscriptions.push(vscode.commands.registerCommand('glsl-canvas.showGlslCanvas', () => {
        panel_1.default.createOrShow(context.extensionPath, onGlslPanelMessage);
    }));
    if (USE_SERIALIZE) {
        if (vscode.window.registerWebviewPanelSerializer) {
            vscode.window.registerWebviewPanelSerializer(panel_1.default.viewType, {
                deserializeWebviewPanel(webviewPanel, state) {
                    return __awaiter(this, void 0, void 0, function* () {
                        // console.log(`state ${state}`);
                        panel_1.default.revive(webviewPanel, context.extensionPath, onGlslPanelMessage);
                    });
                }
            });
        }
    }
    diagnosticCollection = vscode.languages.createDiagnosticCollection('glslCanvas');
    context.subscriptions.push(diagnosticCollection);
    context.subscriptions.push(vscode.languages.registerColorProvider({ scheme: 'file', language: 'glsl' }, new color_provider_1.default()));
    // context.subscriptions.push(vscode.languages.registerColorProvider({ pattern: '**/*.glsl' }, new GlslColorProvider()));
    /*
    context.subscriptions.push(vscode.languages.registerHoverProvider('glsl', {
        provideHover(document, position, token) {
            return {
                contents: [document.getText(document.getWordRangeAtPosition(position))]
            };
        }
    }));
    */
}
exports.activate = activate;
function onGlslPanelMessage(message) {
    switch (message.command) {
        case 'createShader':
            onCreateShader();
            return;
        case 'revealGlslLine':
            var data = JSON.parse(message.data);
            onRevealLine.apply(this, data);
            return;
    }
}
function onCreateShader() {
    /*
    if (!vscode.workspace.rootPath) {
        return vscode.window.showErrorMessage('No project currently open!');
    }
    */
    const folder = vscode.workspace.rootPath || '';
    // console.log('onCreateShader', folder);
    let newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled.glsl'));
    let i = 1;
    while (fs.existsSync(newFile.fsPath)) {
        newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled' + i + '.glsl'));
        i++;
    }
    vscode.workspace.openTextDocument(newFile).then(document => {
        // console.log('document', document);
        const edit = new vscode.WorkspaceEdit();
        edit.insert(newFile, new vscode.Position(0, 0), `
#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    // correct aspect ratio
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    // centering
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)

void main() {
    vec3 color = vec3(
        abs(cos(st.x + mx.x)),
        abs(sin(st.y + mx.y)),
        abs(sin(u_time))
    );
    gl_FragColor = vec4(color, 1.0);
}
`);
        return vscode.workspace.applyEdit(edit).then(success => {
            if (success) {
                // setTimeout(() => {
                vscode.window.showTextDocument(document, vscode_1.ViewColumn.One).then(success => {
                    panel_1.default.rebuild();
                    // GlslPanel.reveal(uri);
                });
                // }, 100);
            }
            else {
                vscode.window.showInformationMessage('Error!');
            }
        }, error => {
            console.log('onCreateShader.applyEdit', error);
        });
    }, error => {
        console.log('onCreateShader.openTextDocument', error);
    });
}
function onRevealLine(uri, line, message) {
    for (let editor of vscode.window.visibleTextEditors) {
        // console.log('editor', editor.document.uri.toString());
        if (editor.document.uri.path === uri.path) {
            let range = editor.document.lineAt(line - 1).range;
            editor.selection = new vscode.Selection(range.start, range.end);
            editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
            onDiagnostic(editor, line, message);
        }
    }
}
function onShowDiagnostic(uri, line, message) {
    for (let editor of vscode.window.visibleTextEditors) {
        if (editor.document.uri.path === uri.path) {
            onDiagnostic(editor, line, message);
        }
    }
}
function onDiagnostic(editor, line, message = 'error') {
    const diagnosticMap = new Map();
    const file = vscode.Uri.file(editor.document.fileName).toString();
    const range = editor.document.lineAt(line - 1).range;
    let diagnostics = diagnosticMap.get(file);
    if (!diagnostics) {
        diagnostics = [];
    }
    const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
    diagnostics.push(diagnostic);
    diagnosticMap.set(file, diagnostics);
    diagnosticMap.forEach((value, key) => {
        diagnosticCollection.set(vscode.Uri.parse(key), value);
    });
}
function onRefreshCanvas() {
    if (common_1.currentGlslEditor()) {
        panel_1.default.update(uri);
    }
}
function onDidChangeTextDocument(e) {
    // console.log('onDidChangeTextDocument', e.document.uri.path);
    let options = new options_1.default();
    if (options.refreshOnChange) {
        clearTimeout(ti);
        diagnosticCollection.clear();
        ti = setTimeout(function () {
            panel_1.default.update(uri);
        }, options.timeout);
    }
}
function onDidCloseTextDocument(document) {
    if (common_1.isGlslLanguage(document.languageId)) {
        panel_1.default.update(uri);
    }
}
function onDidSaveDocument(document) {
    let options = new options_1.default();
    if (common_1.currentGlslEditor() && options.refreshOnSave) {
        panel_1.default.update(uri);
    }
}
function onDidChangeActiveTextEditor(editor) {
    // console.log('onDidChangeActiveTextEditor', editor.document.uri);
    if (common_1.currentGlslEditor()) {
        panel_1.default.update(uri);
    }
}
function onDidChangeConfiguration(e) {
    if (common_1.currentGlslEditor()) {
        panel_1.default.update(uri);
    }
}
/*
function onDidChangeTextEditorViewColumn(e: vscode.TextEditorViewColumnChangeEvent) {
    console.log('onDidChangeTextEditorViewColumn', e.viewColumn.toString());
}

function onDidOpenTextDocument(document: vscode.TextDocument) {
    console.log('onDidOpenTextDocument', document.uri.path);
}
*/
function deactivate() {
    diagnosticCollection.clear();
    panel_1.default.dispose();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map