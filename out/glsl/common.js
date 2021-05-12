'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const LANGUAGES = ['glsl', 'cpp', 'c'];
function isGlslLanguage(languageId) {
    return LANGUAGES.indexOf(languageId) !== -1;
}
exports.isGlslLanguage = isGlslLanguage;
let lastGlslEditor = null;
function currentGlslEditor() {
    const editor = vscode.window.activeTextEditor;
    // console.log('Common.currentGlslEditor', editor ? editor.document : null);
    if (editor && isGlslLanguage(editor.document.languageId)) {
        lastGlslEditor = editor;
        return editor;
    }
    // Just return the last valid editor we've seen
    return lastGlslEditor;
}
exports.currentGlslEditor = currentGlslEditor;
function currentGlslDocument() {
    const editor = currentGlslEditor();
    return editor ? editor.document : null;
}
exports.currentGlslDocument = currentGlslDocument;
//# sourceMappingURL=common.js.map