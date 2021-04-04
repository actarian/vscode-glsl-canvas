'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const LANGUAGES = ['glsl', 'cpp', 'c'];
function isGlslLanguage(languageId) {
    return LANGUAGES.indexOf(languageId) !== -1;
}
exports.isGlslLanguage = isGlslLanguage;
function currentGlslEditor() {
    const editor = vscode.window.activeTextEditor;
    // console.log('Common.currentGlslEditor', editor ? editor.document : null);
    return editor && isGlslLanguage(editor.document.languageId) ? editor : null; // || editor.document.languageId === 'plaintext'
}
exports.currentGlslEditor = currentGlslEditor;
function currentGlslDocument() {
    const editor = currentGlslEditor();
    return editor ? editor.document : null;
}
exports.currentGlslDocument = currentGlslDocument;
//# sourceMappingURL=common.js.map