'use strict';

import * as vscode from 'vscode';

const LANGUAGES = ['glsl', 'cpp', 'c'];

export function isGlslLanguage(languageId: string): boolean {
    return LANGUAGES.indexOf(languageId) !== -1;
}

export function currentGlslEditor(): vscode.TextEditor {
    const editor: vscode.TextEditor = vscode.window.activeTextEditor;
    return editor && isGlslLanguage(editor.document.languageId) ? editor : null; // || editor.document.languageId === 'plaintext'
}

export function currentGlslDocument(): vscode.TextDocument {
    const editor: vscode.TextEditor = currentGlslEditor();
    return editor ? editor.document : null;
}

