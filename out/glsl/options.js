'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const common_1 = require("./common");
exports.WORKPATH_SCHEME = 'vscode-webview-resource:'; // 'vscode-webview-resource':
class GlslOptions {
    constructor(webview = null, extensionPath = null) {
        const document = common_1.currentGlslDocument();
        const config = vscode.workspace.getConfiguration('glsl-canvas');
        const uri = document ? document.uri : null;
        const workspaceFolder = this.getWorkspaceFolder_();
        const textures = Object.assign({}, config['textures'] || {});
        this.uri = uri;
        this.workspaceFolder = workspaceFolder;
        this.fragment = document ? document.getText() : '';
        this.vertex = '';
        this.textures = textures;
        this.uniforms = config['uniforms'] || {};
        this.timeout = config['timeout'] || 0;
        this.extensions = config['extensions'] || [];
        this.antialias = config['antialias'] || false;
        this.doubleSided = config['doubleSided'] || false;
        this.refreshOnChange = config['refreshOnChange'] || false;
        this.refreshOnSave = config['refreshOnSave'] || false;
        this.recordMethod = config['recordMethod'] || 'MediaRecorder';
        // tslint:disable-next-line: triple-equals
        this.recordDuration = config['recordDuration'] != null ? config['recordDuration'] : 10;
        // tslint:disable-next-line: triple-equals
        this.recordWidth = config['recordWidth'] != null ? config['recordWidth'] : 1024;
        // tslint:disable-next-line: triple-equals
        this.recordHeight = config['recordHeight'] != null ? config['recordHeight'] : 1024;
        if (webview !== null && extensionPath !== null) {
            const workpath = this.getWorkpath_(webview, extensionPath, workspaceFolder, uri);
            const folder = this.getFolder_(extensionPath, workspaceFolder, uri);
            const resources = this.getResources_(webview, extensionPath);
            Object.keys(textures).forEach(key => {
                let texture = textures[key];
                if (texture.indexOf('http') === -1) {
                    if (workspaceFolder) {
                        texture = path.join(workspaceFolder, texture);
                        texture = path.relative(folder, texture);
                    }
                    else {
                        texture = path.join(folder, texture);
                    }
                }
                textures[key] = texture;
            });
            this.workpath = workpath;
            this.folder = folder;
            this.resources = resources;
        }
        // console.log('GlslOptions', this);
    }
    serialize() {
        return JSON.stringify(this);
    }
    getWorkspaceFolder_() {
        return vscode.workspace && vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : null;
    }
    getWorkpath_(webview, extensionPath, workspaceFolder, uri) {
        let url;
        const folder = uri ? path.dirname(uri.path) : workspaceFolder;
        if (folder) {
            uri = webview.asWebviewUri(vscode.Uri.file(folder));
        }
        else {
            uri = vscode.Uri.file(path.join(extensionPath, 'resources'));
        }
        url = uri.scheme + '://' + uri.authority + uri.path;
        // console.log('GlslOptions.getWorkpath', url);
        return url;
    }
    getFolder_(extensionPath, workspaceFolder, uri) {
        let url;
        const folder = uri ? path.dirname(uri.path) : workspaceFolder;
        if (folder) {
            url = folder;
        }
        else {
            url = path.join(extensionPath, 'resources');
        }
        // console.log('GlslOptions.getFolder', url);
        return url;
    }
    getResources_(webview, extensionPath) {
        const filePath = vscode.Uri.file(path.join(extensionPath, 'resources'));
        const uri = webview.asWebviewUri(filePath);
        const url = uri.scheme + '://' + uri.authority + uri.path;
        // console.log('GlslOptions.getResources', url);
        return url;
    }
}
exports.default = GlslOptions;
//# sourceMappingURL=options.js.map