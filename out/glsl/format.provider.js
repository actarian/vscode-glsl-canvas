'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class GlslFormatProvider {
    // alt + shift + F = format
    // alt + shift + C = compact
    // Author: Name <email>
    provideDocumentFormattingEdits(document, options, token) {
        const range = new vscode.Range(document.lineAt(0).range.start, document.lineAt(document.lineCount - 1).range.end);
        return this.provideDocumentRangeFormattingEdits(document, range, options, token);
    }
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        // console.log('config', config);
        const format = config['useFormatter'];
        const compact = config['useCompactFormatter'];
        if (format) {
            let text = document.getText(range);
            const tab = options.insertSpaces ? new Array(options.tabSize).fill(' ').join('') : '\t';
            const comments = text.match(/(\/\/.*$)|(\/\*[\s\S]*\*\/)/gm);
            const splitByComments = /\/\/.*$|\/\*[\s\S]*\*\//gm;
            const splitted = text.split(splitByComments).map(s => {
                if (compact) {
                    // remove double spaces
                    s = s.replace(/[^\S\n]+/gm, ' ');
                    // trim
                    // s = s.replace(/^[^\S\n]+|[^\S\n]+$/gm, '');
                    /*
                    // remove start of line space
                    s = s.replace(/^[^\S\n]+/gm, '');
                    // remove end of line space
                    s = s.replace(/[^\S\n]+$/gm, '');
                    */
                    // remove extra new line
                    s = s.replace(/\n\s*\n\s*\n/g, '\n\n');
                    // remove space
                    s = s.replace(/[^\S\n]*(\B)[^\S\n]*/g, '$1');
                    // zero
                    s = s.replace(/(\d)\.0*(\D)/g, '$1.$2');
                    s = s.replace(/(\D)0*\.(\d)/g, '$1.$2');
                }
                else {
                    // parentesis
                    s = s.replace(/[^\S\n]*([\(\)\[\]])[^\S\n]*/g, '$1');
                    // spaces
                    s = s.replace(/([^\(\[])[^\S\n\()]*([\*\+\-\/\=]+)[^\S\n]*([^\+\-])/g, '$1 $2 $3');
                    s = s.replace(/([\,\;])[^\S\n]*/g, '$1 ');
                    s = s.replace(/[^\S\n]*([/{])/g, ' $1');
                    // zero
                    s = s.replace(/(\B)\.(\d)/g, '$10.$2');
                    s = s.replace(/(\d)\.(\B)/g, '$1.0$2');
                    // remove double spaces
                    s = s.replace(/[^\S\n]+/gm, ' ');
                    // trim
                    // s = s.replace(/^[^\S\n]+|[^\S\n]+$/gm, '');
                    /*
                    // remove start of line space
                    s = s.replace(/^[^\S\n]+/gm, '');
                    // remove end of line space
                    s = s.replace(/[^\S\n]+$/gm, '');
                    */
                    // remove extra new line
                    s = s.replace(/\n\s*\n\s*\n/g, '\n\n');
                }
                return s;
            });
            text = '';
            while (splitted.length) {
                text += splitted.shift() + (comments ? (comments.shift() || '') : '');
            }
            // indent blocks
            const lines = text.split('\n');
            let i = 0;
            text = lines.map(l => {
                let a = (l.match(/^[^\{]*\}/g) || []).length;
                let b = (l.match(/^[^\(]*\)/g) || []).length;
                let c = (l.match(/^[^\[]*\]/g) || []).length;
                i -= (a + b + c);
                if (i > 0) {
                    l = new Array(i).fill(tab).join('') + l.trim();
                }
                a = (l.match(/\{(?!.*\})/g) || []).length;
                b = (l.match(/\((?!.*\))/g) || []).length;
                c = (l.match(/\[(?!.*\])/g) || []).length;
                i += (a + b + c);
                return l;
            }).join('\n');
            return [vscode.TextEdit.replace(range, text)];
        }
        else {
            return undefined;
        }
    }
}
exports.default = GlslFormatProvider;
//# sourceMappingURL=format.provider.js.map