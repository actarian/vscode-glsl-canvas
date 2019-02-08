'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
class GlslEditor {
    static create() {
        return new Promise((resolve, reject) => {
            /*
            if (!vscode.workspace.rootPath) {
                return vscode.window.showErrorMessage('No project currently open!');
            }
            */
            const folder = vscode.workspace.rootPath || '';
            // console.log('onCreateShader', folder);
            let newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled.glsl'));
            let i = 1;
            while (fs.existsSync(newFile.fsPath)) {
                newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled' + i + '.glsl'));
                i++;
            }
            vscode.workspace.openTextDocument(newFile).then(document => {
                // console.log('document', document);
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFile, new vscode.Position(0, 0), `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

vec2 coord(in vec2 p) {
	p = p / u_resolution.xy;
	// correct aspect ratio
	if (u_resolution.x > u_resolution.y) {
		p.x *= u_resolution.x / u_resolution.y;
		p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
	} else {
		p.y *= u_resolution.y / u_resolution.x;
		p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
	}
	// centering
	p -= 0.5;
	p *= vec2(-1.0, 1.0);
	return p;
}
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)

void main() {
	vec3 color = vec3(
		abs(cos(st.x + mx.x)),
		abs(sin(st.y + mx.y)),
		abs(sin(u_time))
	);
	gl_FragColor = vec4(color, 1.0);
}
					`);
                return vscode.workspace.applyEdit(edit).then(success => {
                    if (success) {
                        // setTimeout(() => {
                        vscode.window.showTextDocument(document, vscode.ViewColumn.One).then(success => {
                            resolve(document);
                        }, error => {
                            reject(error);
                        });
                        // }, 100);
                    }
                    else {
                        reject('Error!');
                    }
                }, error => {
                    console.log('onCreateShader.applyEdit', error);
                    reject(error);
                });
            }, error => {
                console.log('onCreateShader.openTextDocument', error);
                reject(error);
            });
        });
    }
}
exports.default = GlslEditor;
//# sourceMappingURL=editor.js.map