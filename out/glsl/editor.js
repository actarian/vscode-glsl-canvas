'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
exports.DefaultFragment = `
#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_position;
varying vec4 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;
uniform vec2 u_resolution;
uniform float u_time;

#if defined(VERTEX)

// attribute vec4 a_position; // myfolder/myfile.obj
attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec2 a_texcoord;
attribute vec4 a_color;

void main(void) {
	v_position = u_projectionMatrix * u_modelViewMatrix * a_position;
	v_normal = u_normalMatrix * a_normal;
	v_texcoord = a_texcoord;
	v_color = a_color;
	gl_Position = v_position;
}

#else // fragment shader

uniform vec2 u_mouse;
uniform vec2 u_pos;
// uniform sampler2D u_texture; // https://cdn.jsdelivr.net/gh/actarian/plausible-brdf-shader/textures/mars/4096x2048/diffuse.jpg?repeat=true
// uniform vec2 u_textureResolution;

float checker(vec2 uv, float repeats) {
	float cx = floor(repeats * uv.x);
	float cy = floor(repeats * uv.y);
	float result = mod(cx + cy, 2.0);
	return sign(result);
}

void main() {
	vec2 p = v_texcoord;

	vec3 ambient = vec3(0.4);
	vec3 direction = vec3(0.0, 1.0, 1.0);
	vec3 lightColor = vec3(1.0);
	float incidence = max(dot(v_normal.xyz, direction), - 1.0);
	vec3 light = clamp(ambient + lightColor * incidence, 0.0, 1.0);

	vec3 color = (0.2 * checker(p, 8.0) + v_normal.rgb);
	gl_FragColor = vec4(color * light, 1.0);
}

#endif
`;
const DefaultFragment_old = /* glsl */ `
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
`;
class GlslEditor {
    static create() {
        return new Promise((resolve, reject) => {
            /*
            if (!vscode.workspace.rootPath) {
                return vscode.window.showErrorMessage('No project currently open!');
            }
            */
            const folder = vscode.workspace.rootPath || '';
            // console.log('GlslEditor.onCreateShader', folder);
            let newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled.glsl'));
            let i = 1;
            while (fs.existsSync(newFile.fsPath)) {
                newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled' + i + '.glsl'));
                i++;
            }
            vscode.workspace.openTextDocument(newFile).then(document => {
                // console.log('GlslEditor.document', document);
                const edit = new vscode.WorkspaceEdit();
                edit.insert(newFile, new vscode.Position(0, 0), exports.DefaultFragment);
                return vscode.workspace.applyEdit(edit).then(success => {
                    if (success) {
                        vscode.window.showTextDocument(document, vscode.ViewColumn.One).then(success => {
                            resolve(document);
                        }, error => {
                            reject(error);
                        });
                    }
                    else {
                        reject('Error!');
                    }
                }, error => {
                    console.log('GlslEditor.onCreateShader.applyEdit', error);
                    reject(error);
                });
            }, error => {
                console.log('GlslEditor.onCreateShader.openTextDocument', error);
                reject(error);
            });
        });
    }
}
exports.default = GlslEditor;
//# sourceMappingURL=editor.js.map