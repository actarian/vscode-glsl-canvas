'use strict';

import * as vscode from 'vscode';
import { ExtensionContext, Uri } from 'vscode';
import GlslColorProvider from './glsl/color.provider';
import { currentGlslEditor, isGlslLanguage } from './glsl/common';
import GlslEditor from './glsl/editor';
import GlslExport from './glsl/export';
import GlslFormatProvider from './glsl/format.provider';
import GlslOptions from './glsl/options';
import GlslPanel from './glsl/panel';

const SELECTOR: vscode.DocumentSelector = { scheme: 'file', language: 'glsl' };

let uri = Uri.parse('glsl-preview://authority/glsl-preview');
let currentContext: ExtensionContext;
let currentExtensionPath: string;
let diagnosticCollection: vscode.DiagnosticCollection;
let colorFormatter: vscode.Disposable;
let documentFormatter: vscode.Disposable;
let rangeFormatter: vscode.Disposable;
let panelSerializer: vscode.Disposable;
let ti;

export function activate(context: ExtensionContext) {
	currentContext = context;
	currentExtensionPath = context.extensionPath;
	registerSerializer();
	registerDiagnostic();
	setConfiguration();
	context.subscriptions.push(vscode.commands.registerCommand('glsl-canvas.showGlslCanvas', () => {
		GlslPanel.createOrShow(currentExtensionPath, onGlslPanelMessage);
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

function onGlslPanelMessage(
	message: { command: string; data: any; }
) {
	switch (message.command) {
		case 'createShader':
			onCreateShader();
			break;
		case 'onExport':
			const options = JSON.parse(message.data);
			GlslExport.onExport(currentExtensionPath, options);
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
	GlslEditor.create().then(
		document => {
			GlslPanel.rebuild(onGlslPanelMessage);
			// GlslPanel.reveal(uri);
		},
		error => {
			console.log('onCreateShader', error);
			vscode.window.showInformationMessage('Unable to create shader!');
		}
	);
}

function onRevealLine(uri: vscode.Uri, line: number, message: string) {
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

function onDiagnostic(editor: vscode.TextEditor, line: number, message: string = 'error') {
	const diagnosticMap: Map<string, vscode.Diagnostic[]> = new Map();
	const file = vscode.Uri.file(editor.document.fileName).toString();
	const range = editor.document.lineAt(line - 1).range;
	let diagnostics = diagnosticMap.get(file);
	if (!diagnostics) {
		diagnostics = [];
	}
	const diagnostic: vscode.Diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
	diagnostics.push(diagnostic);
	diagnosticMap.set(file, diagnostics);
	diagnosticMap.forEach((value: vscode.Diagnostic[], key: string) => {
		diagnosticCollection.set(vscode.Uri.parse(key), value);
	});
}

function setConfiguration(e: vscode.ConfigurationChangeEvent = null) {
	if (!currentContext) {
		return;
	}
	const config = vscode.workspace.getConfiguration('glsl-canvas');
	// console.log('setConfiguration', config);
	registerColorFormatter(currentContext);
	if (!e || e.affectsConfiguration('glsl-canvas.useFormatter')) {
		if (config['useFormatter'] === true) {
			registerCodeFormatter(currentContext);
		} else {
			disposeCodeFormatter();
		}
	}
	if (!e) {
		return;
	}
	if (e.affectsConfiguration('glsl-canvas.textures') || e.affectsConfiguration('glsl-canvas.uniforms')) {
		console.log('updated');
		if (currentGlslEditor()) {
			GlslPanel.update(uri);
		}
	}
}

function onDidChangeConfiguration(e: vscode.ConfigurationChangeEvent) {
	setConfiguration(e);
}

function onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent) {
	// console.log('onDidChangeTextDocument', e.document.uri.path);
	let options = new GlslOptions();
	if (options.refreshOnChange) {
		clearTimeout(ti);
		diagnosticCollection.clear();
		ti = setTimeout(function () {
			GlslPanel.update(uri);
		}, options.timeout);
	}
}

function onDidCloseTextDocument(document: vscode.TextDocument) {
	if (isGlslLanguage(document.languageId)) {
		GlslPanel.update(uri);
	}
}

function onDidSaveDocument(document: vscode.TextDocument) {
	let options = new GlslOptions();
	if (currentGlslEditor() && options.refreshOnSave) {
		GlslPanel.update(uri);
	}
}

function onDidChangeActiveTextEditor(editor: vscode.TextEditor) {
	// console.log('onDidChangeActiveTextEditor', editor.document.uri);
	if (currentGlslEditor()) {
		GlslPanel.update(uri);
	}
}

function registerSerializer() {
	if (vscode.window.registerWebviewPanelSerializer) {
		panelSerializer = vscode.window.registerWebviewPanelSerializer(GlslPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				GlslPanel.revive(webviewPanel, currentExtensionPath, onGlslPanelMessage);
				return Promise.resolve();
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

function registerColorFormatter(context: ExtensionContext) {
	disposeColorFormatter();
	const colorProvider = new GlslColorProvider();
	colorFormatter = vscode.languages.registerColorProvider(SELECTOR, colorProvider);
	context.subscriptions.push(colorFormatter);
}

function disposeColorFormatter() {
	if (colorFormatter) {
		colorFormatter.dispose();
		colorFormatter = null;
	}
}

function registerCodeFormatter(context: ExtensionContext) {
	disposeCodeFormatter();
	const formatProvider = new GlslFormatProvider();
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

export function deactivate() {
	GlslPanel.dispose();
	GlslExport.dispose();
	disposeColorFormatter();
	disposeCodeFormatter();
	disposeDiagnostic();
	disposeSerializer();
}

/*
function onDidChangeTextEditorViewColumn(e: vscode.TextEditorViewColumnChangeEvent) {
    console.log('onDidChangeTextEditorViewColumn', e.viewColumn.toString());
}

function onDidOpenTextDocument(document: vscode.TextDocument) {
    console.log('onDidOpenTextDocument', document.uri.path);
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
