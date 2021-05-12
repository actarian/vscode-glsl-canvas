'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
// import { ExtensionContext, Uri } from 'vscode';
const color_provider_1 = require("./glsl/color.provider");
const common_1 = require("./glsl/common");
const editor_1 = require("./glsl/editor");
const export_1 = require("./glsl/export");
const format_provider_1 = require("./glsl/format.provider");
const options_1 = require("./glsl/options");
const panel_1 = require("./glsl/panel");
const SERIALIZE_PANEL = true;
const SELECTOR = { scheme: 'file', language: 'glsl' };
const disposables_ = [];
// let uri = Uri.parse('glsl-preview://authority/glsl-preview');
let currentContext;
let currentExtensionPath;
let diagnosticCollection;
let colorFormatter;
let documentFormatter;
let rangeFormatter;
let panelSerializer;
let ti;
function activate(context) {
    currentContext = context;
    currentExtensionPath = context.extensionPath;
    registerDiagnostic();
    setConfiguration();
    context.subscriptions.push(vscode.commands.registerCommand('glsl-canvas.showGlslCanvas', () => {
        panel_1.default.createOrShow(currentExtensionPath, onGlslPanelMessage, context.subscriptions);
    }));
    vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration, null, disposables_);
    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument, null, disposables_);
    vscode.workspace.onDidCloseTextDocument(onDidCloseTextDocument, null, disposables_);
    vscode.workspace.onDidSaveTextDocument(onDidSaveDocument, null, disposables_);
    vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor, null, disposables_);
    setTimeout(() => {
        registerSerializer();
    }, 1000);
    // const exporter = new vscode.FileSystemProvider();
    // context.subscriptions.push(vscode.workspace.registerFileSystemProvider('exporter', exporter, { isCaseSensitive: true }));
    // vscode.window.onDidChangeTextEditorViewColumn(onDidChangeTextEditorViewColumn, null, disposables_);
    // vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument, null, disposables_);
    // vscode.commands.registerCommand('glsl-canvas.createShader', onCreateShader);
    // vscode.commands.registerCommand('glsl-canvas.revealLine', onRevealLine);
    // vscode.commands.registerCommand('glsl-canvas.showDiagnostic', onShowDiagnostic);
    // vscode.commands.registerCommand('glsl-canvas.refreshCanvas', onRefreshCanvas);
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
            break;
        case 'onExport':
            const options = JSON.parse(message.data);
            export_1.default.onExport(currentExtensionPath, options);
            break;
        case 'revealGlslLine':
            const data = JSON.parse(message.data);
            onRevealLine.apply(this, data);
            break;
        case 'clearDiagnostic':
            diagnosticCollection.clear();
            break;
        case 'loadError':
            const loadError = JSON.parse(message.data);
            vscode.window.showErrorMessage(`Load error: "${loadError.message}"`);
            break;
        case 'textureError':
            const textureError = JSON.parse(message.data);
            vscode.window.showErrorMessage(`Texture error "${textureError.key}": "${textureError.urlElementOrData}"
${textureError.message}`);
            break;
    }
}
function onCreateShader() {
    editor_1.default.create().then(document => {
        panel_1.default.rebuild(onGlslPanelMessage);
        // GlslPanel.reveal(uri);
    }, error => {
        console.log('onCreateShader', error);
        vscode.window.showInformationMessage('Unable to create shader!');
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
function setConfiguration(event = null) {
    if (!currentContext) {
        return;
    }
    const config = vscode.workspace.getConfiguration('glsl-canvas');
    // console.log('setConfiguration', config);
    registerColorFormatter(currentContext);
    if (!event || event.affectsConfiguration('glsl-canvas.useFormatter')) {
        if (config['useFormatter'] === true) {
            registerCodeFormatter(currentContext);
        }
        else {
            disposeCodeFormatter();
        }
    }
    if (!event) {
        return;
    }
    if (event.affectsConfiguration('glsl-canvas.doubleSided')) {
        // console.log('updated');
        if (common_1.currentGlslEditor()) {
            return panel_1.default.render();
        }
    }
    if (event.affectsConfiguration('glsl-canvas.textures') || event.affectsConfiguration('glsl-canvas.uniforms')) {
        // console.log('updated');
        if (common_1.currentGlslEditor()) {
            return panel_1.default.update();
        }
    }
}
function onDidChangeConfiguration(e) {
    // console.log('onDidChangeConfiguration');
    setConfiguration(e);
}
function onDidChangeTextDocument(event) {
    // console.log('onDidChangeTextDocument');
    const current = common_1.currentGlslDocument();
    if (current !== event.document) {
        return; // this is for some other document
    }
    const options = new options_1.default();
    if (options.refreshOnChange) {
        clearTimeout(ti);
        diagnosticCollection.clear();
        ti = setTimeout(function () {
            // if (currentGlslEditor()) {
            panel_1.default.update();
            // }
        }, options.timeout);
    }
}
function onDidCloseTextDocument(document) {
    // console.log('onDidCloseTextDocument');
    if (common_1.isGlslLanguage(document.languageId)) {
        panel_1.default.update();
    }
}
function onDidSaveDocument(document) {
    // console.log('onDidSaveDocument');
    const options = new options_1.default();
    if (common_1.currentGlslEditor() && options.refreshOnSave) {
        panel_1.default.update();
    }
}
function onDidChangeActiveTextEditor(editor) {
    // console.log('onDidChangeActiveTextEditor');
    const current = common_1.currentGlslEditor();
    if (current === editor) {
        panel_1.default.update();
        // GlslPanel.rebuild(onGlslPanelMessage);
    }
}
function registerSerializer() {
    disposeSerializer();
    if (SERIALIZE_PANEL && vscode.window.registerWebviewPanelSerializer) {
        panelSerializer = vscode.window.registerWebviewPanelSerializer(panel_1.default.viewType, new GlslPanelSerializer());
    }
}
function disposeSerializer() {
    if (panelSerializer) {
        panelSerializer.dispose();
        panelSerializer = null;
    }
}
function registerDiagnostic() {
    disposeDiagnostic();
    diagnosticCollection = vscode.languages.createDiagnosticCollection('glslCanvas');
    currentContext.subscriptions.push(diagnosticCollection);
}
function disposeDiagnostic() {
    if (diagnosticCollection) {
        diagnosticCollection.clear();
        diagnosticCollection.dispose();
        diagnosticCollection = null;
    }
}
function registerColorFormatter(context) {
    disposeColorFormatter();
    const colorProvider = new color_provider_1.default();
    colorFormatter = vscode.languages.registerColorProvider(SELECTOR, colorProvider);
    context.subscriptions.push(colorFormatter);
}
function disposeColorFormatter() {
    if (colorFormatter) {
        colorFormatter.dispose();
        colorFormatter = null;
    }
}
function registerCodeFormatter(context) {
    disposeCodeFormatter();
    const formatProvider = new format_provider_1.default();
    documentFormatter = vscode.languages.registerDocumentFormattingEditProvider(SELECTOR, formatProvider);
    context.subscriptions.push(documentFormatter);
    rangeFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider(SELECTOR, formatProvider);
    context.subscriptions.push(rangeFormatter);
}
function disposeCodeFormatter() {
    if (documentFormatter) {
        documentFormatter.dispose();
        documentFormatter = null;
    }
    if (rangeFormatter) {
        rangeFormatter.dispose();
        rangeFormatter = null;
    }
}
function deactivate() {
    while (disposables_.length) {
        const x = disposables_.pop();
        if (x) {
            x.dispose();
        }
    }
    panel_1.default.dispose();
    export_1.default.dispose();
    disposeColorFormatter();
    disposeCodeFormatter();
    disposeDiagnostic();
    disposeSerializer();
}
exports.deactivate = deactivate;
/*
function onDidChangeTextEditorViewColumn(e: vscode.TextEditorViewColumnChangeEvent) {
    // console.log('onDidChangeTextEditorViewColumn', e.viewColumn.toString());
}

function onDidOpenTextDocument(document: vscode.TextDocument) {
    // console.log('onDidOpenTextDocument', document.uri.path);
}
*/
/*
function onRefreshCanvas() {
    if (currentGlslEditor()) {
        GlslPanel.update(uri);
    }
}
*/
/*
function onShowDiagnostic(uri: vscode.Uri, line: number, message: string) {
    for (let editor of vscode.window.visibleTextEditors) {
        if (editor.document.uri.path === uri.path) {
            onDiagnostic(editor, line, message);
        }
    }
}
*/
class GlslPanelSerializer {
    deserializeWebviewPanel(webviewPanel, state) {
        return __awaiter(this, void 0, void 0, function* () {
            // `state` is the state persisted using `setState` inside the webview
            // console.log(`Got state: ${state}`);
            // Restore the content of our webview.
            // Make sure we hold on to the `webviewPanel` passed in here and
            // also restore any event listeners we need on it.
            panel_1.default.revive(webviewPanel, currentExtensionPath, onGlslPanelMessage, state);
            // return Promise.resolve();
        });
    }
}
//# sourceMappingURL=extension.js.map