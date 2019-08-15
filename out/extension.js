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
const vscode = require("vscode");
const vscode_1 = require("vscode");
const color_provider_1 = require("./glsl/color.provider");
const common_1 = require("./glsl/common");
const editor_1 = require("./glsl/editor");
const export_1 = require("./glsl/export");
const format_provider_1 = require("./glsl/format.provider");
const options_1 = require("./glsl/options");
const panel_1 = require("./glsl/panel");
const SELECTOR = { scheme: 'file', language: 'glsl' };
let uri = vscode_1.Uri.parse('glsl-preview://authority/glsl-preview');
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
    registerSerializer();
    registerDiagnostic();
    setConfiguration();
    context.subscriptions.push(vscode.commands.registerCommand('glsl-canvas.showGlslCanvas', () => {
        panel_1.default.createOrShow(currentExtensionPath, onGlslPanelMessage);
    }));
    vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
    vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument);
    vscode.workspace.onDidCloseTextDocument(onDidCloseTextDocument);
    vscode.workspace.onDidSaveTextDocument(onDidSaveDocument);
    vscode.window.onDidChangeActiveTextEditor(onDidChangeActiveTextEditor);
    // const exporter = new vscode.FileSystemProvider();
    // context.subscriptions.push(vscode.workspace.registerFileSystemProvider('exporter', exporter, { isCaseSensitive: true }));
    // vscode.window.onDidChangeTextEditorViewColumn(onDidChangeTextEditorViewColumn);
    // vscode.workspace.onDidOpenTextDocument(onDidOpenTextDocument);
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
        case 'textureError':
            const error = JSON.parse(message.data);
            vscode.window.showErrorMessage(`Texture error "${error.key}": "${error.urlElementOrData}"
${error.message}`);
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
function setConfiguration(e = null) {
    if (!currentContext) {
        return;
    }
    const config = vscode.workspace.getConfiguration('glsl-canvas');
    // console.log('setConfiguration', config);
    registerColorFormatter(currentContext);
    if (!e || e.affectsConfiguration('glsl-canvas.useFormatter')) {
        if (config['useFormatter'] === true) {
            registerCodeFormatter(currentContext);
        }
        else {
            disposeCodeFormatter();
        }
    }
    if (!e) {
        return;
    }
    if (e.affectsConfiguration('glsl-canvas.textures') || e.affectsConfiguration('glsl-canvas.uniforms')) {
        // console.log('updated');
        if (common_1.currentGlslEditor()) {
            panel_1.default.update(uri);
        }
    }
}
function onDidChangeConfiguration(e) {
    setConfiguration(e);
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
function registerSerializer() {
    if (vscode.window.registerWebviewPanelSerializer) {
        panelSerializer = vscode.window.registerWebviewPanelSerializer(panel_1.default.viewType, {
            deserializeWebviewPanel(webviewPanel, state) {
                return __awaiter(this, void 0, void 0, function* () {
                    panel_1.default.revive(webviewPanel, currentExtensionPath, onGlslPanelMessage);
                    return Promise.resolve();
                });
            }
        });
    }
}
function disposeSerializer() {
    if (panelSerializer) {
        panelSerializer.dispose();
        panelSerializer = null;
    }
}
function registerDiagnostic() {
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
    panel_1.default.dispose();
    export_1.default.dispose();
    disposeColorFormatter();
    disposeCodeFormatter();
    disposeDiagnostic();
    disposeSerializer();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map