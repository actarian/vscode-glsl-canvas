'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const common_1 = require("./common");
exports.WORKPATH_SCHEME = 'vscode-webview-resource:'; // 'vscode-webview-resource':
class GlslOptions {
    constructor() {
        const document = common_1.currentGlslDocument();
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        this.uri = document ? document.uri : null;
        this.fragment = document ? document.getText() : '';
        this.vertex = '';
        this.uniforms = config['uniforms'] || {};
        this.timeout = config['timeout'] || 0;
        this.textures = Object.assign({}, config['textures'] || {});
        this.extensions = config['extensions'] || [];
        this.doubleSided = config['doubleSided'] || false;
        this.refreshOnChange = config['refreshOnChange'] || false;
        this.refreshOnSave = config['refreshOnSave'] || false;
    }
    serialize() {
        return JSON.stringify(this);
    }
}
exports.default = GlslOptions;
//# sourceMappingURL=options.js.map