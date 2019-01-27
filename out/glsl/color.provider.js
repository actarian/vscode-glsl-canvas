'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class GlslColorProvider {
    static trim(n) {
        const c = n.toFixed(4).replace(/(0*$)/, '');
        return c + (c.lastIndexOf('.') === c.length - 1 ? '0' : '');
        // return n.toFixed(7).replace(/(?<!\.)0*$/, '');
    }
    provideDocumentColors(document, token) {
        const regexp = /vec[3|4]\s*\(([0-9|.|,|\s]*)\)/gm;
        const colors = [];
        let match;
        while ((match = regexp.exec(document.getText())) !== null) {
            const l = match[0].indexOf('vec3') === 0 ? 3 : 4;
            const components = match[1].split(',').map((c) => parseFloat(c));
            const isColor = (components.length === 1 || components.length === l) && components.reduce((f, c) => {
                return f && c >= 0.0 && c <= 1.0;
            }, true);
            if (isColor) {
                if (components.length === 1) {
                    while (components.length < l) {
                        components.push(components[0]);
                    }
                }
                if (components.length === 3) {
                    components.push(1.0);
                }
                if (components.length === 4) {
                    const color = new vscode.ColorInformation(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)), new vscode.Color(components[0], components[1], components[2], components[3]));
                    colors.push(color);
                }
            }
        }
        return Promise.resolve(colors);
    }
    provideColorPresentations(color, context, token) {
        if (context.document.getText(context.range).indexOf('vec3') === 0) {
            return Promise.resolve([new vscode.ColorPresentation(`vec3(${GlslColorProvider.trim(color.red)}, ${GlslColorProvider.trim(color.green)}, ${GlslColorProvider.trim(color.blue)})`)]);
        }
        else {
            return Promise.resolve([new vscode.ColorPresentation(`vec4(${GlslColorProvider.trim(color.red)}, ${GlslColorProvider.trim(color.green)}, ${GlslColorProvider.trim(color.blue)}, ${GlslColorProvider.trim(color.alpha)})`)]);
        }
    }
}
exports.default = GlslColorProvider;
//# sourceMappingURL=color.provider.js.map