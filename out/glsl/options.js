'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const common_1 = require("./common");
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
        const folder = vscode.workspace ? vscode.workspace.rootPath : null;
        if (folder) {
            Object.keys(this.textures).forEach(x => {
                const texture = this.textures[x];
                if (texture.indexOf('http') !== 0 && texture.indexOf('file') !== 0) {
                    this.textures[x] = 'vscode-resource:' + vscode.Uri.file(path.join(folder, texture)).path;
                }
            });
            this.workpath = 'vscode-resource:' + vscode.Uri.file(folder).path;
        }
        else {
            this.workpath = '';
        }
        // console.log('workpath', this.workpath);
        this.refreshOnChange = config['refreshOnChange'] || false;
        this.refreshOnSave = config['refreshOnSave'] || false;
    }
    serialize() {
        return JSON.stringify(this);
    }
}
exports.default = GlslOptions;
//# sourceMappingURL=options.js.map