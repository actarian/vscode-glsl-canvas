'use strict';

import * as vscode from 'vscode';

const LANGUAGES = ['glsl', 'cpp', 'c'];

export function isGlslLanguage(languageId: string): boolean {
    return LANGUAGES.indexOf(languageId) !== -1;
}

let lastGlslEditor: null | vscode.TextEditor = null;

export function currentGlslEditor(): vscode.TextEditor | null {
    const editor: vscode.TextEditor = vscode.window.activeTextEditor;
	// console.log('Common.currentGlslEditor', editor ? editor.document : null);
    if (editor && isGlslLanguage(editor.document.languageId)) {
		lastGlslEditor = editor;
	}
	// Just return the last valid editor we've seen
	return lastGlslEditor;
}

export function currentGlslDocument(): vscode.TextDocument {
    const editor: vscode.TextEditor = currentGlslEditor();
    return editor ? editor.document : null;
}
