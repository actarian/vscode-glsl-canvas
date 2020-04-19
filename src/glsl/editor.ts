'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export const DefaultFragment = /* glsl */`
#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

varying vec4 v_position;
varying vec4 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;
varying vec3 v_light;

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;
uniform vec3 u_lightAmbient;
uniform vec3 u_lightColor;
uniform vec3 u_lightDirection;
uniform vec2 u_resolution;

uniform vec2 u_textureResolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_pos;
uniform sampler2D u_buffer0;

#define PI_TWO 1.570796326794897
#define PI 3.141592653589793
#define TWO_PI 6.283185307179586
#define DEG = PI / 180.0

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

vec2 tile(in vec2 p, vec2 w) { return fract(mod(p + w / 2.0, w)) - (w / 2.0); }
vec2 tile(in vec2 p, float w) { return tile(p, vec2(w)); }

float easeQuintInOut(float t) {
	if ((t / 2.0) < 1.0)return 0.5 * t * t * t * t * t;
	return 0.5 * ((t -= 2.0) * t * t * t * t + 2.0);
}

mat4 rotationAxis(float angle, vec3 axis) {
	axis = normalize(axis);
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.0 - c;
	return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
		oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
		oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
	0.0, 0.0, 0.0, 1.0);
}

vec3 rotateX(vec3 p, float angle) {
	return (vec4(p, 1.0) * rotationAxis(angle, vec3(1.0, 0.0, 0.0))).xyz;
}

vec3 rotateY(vec3 p, float angle) {
	return (vec4(p, 1.0) * rotationAxis(angle, vec3(0.0, 1.0, 0.0))).xyz;
}

vec3 rotateZ(vec3 p, float angle) {
	return (vec4(p, 1.0) * rotationAxis(angle, vec3(0.0, 0.0, 1.0))).xyz;
}

#if defined(VERTEX)

attribute vec4 a_position; // data/dolphin.obj
// attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec2 a_texcoord;
attribute vec4 a_color;

void main(void) {
	v_position = a_position;
	// float d = (5.0 + cos(u_time) * 2.5);
	// float a = sin((u_time * 4.0) + a_position.y) * 0.1;
	// float b = cos(((u_time + 1.5) * 10.0) + a_position.y * 2.0) * 0.05;
	// float c = sin((u_time * 4.0) + a_position.y) * 0.3;
	// v_position.z += a - b;
	// v_position.xyz = rotateZ(v_position.xyz, cos(u_time + a_position.x) * (2.0 * a));
	// mat4 modelView = rotationAxis(cos(u_time), vec3(0.0, 1.0, 0.0));
	v_position = u_projectionMatrix * u_modelViewMatrix * v_position;
	v_normal = u_normalMatrix * a_normal;
	v_texcoord = a_texcoord;
	v_color = a_color;
	gl_Position = v_position;
}

#else

float grid(vec2 p) {
	vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p);
	float line = min(grid.x, grid.y);
	return 1.0 - min(line, 1.0);
}

void main() {
	vec2 p = v_texcoord;

	// light
	vec3 direction = vec3(0.0, 1.0, 0.0);
	// vec3 direction = u_lightDirection;
	// vec3 direction = rotateY(vec3(0.0, 0.0, 1.0), - u_time * 2.0);
	float incidence = max(dot(v_normal.xyz, direction), 0.0);
	vec3 light = u_lightAmbient + (u_lightColor * incidence);

	// fresnel
	float fresnel = 1.0 - dot(v_normal.xyz, vec3(0.0, 0.0, 1.0));

	// alpha
	float alpha = 0.1 + fresnel;

	// hatch
	float hatch = clamp(fresnel - incidence, 0.0, 1.0);
	hatch = smoothstep(hatch, 0.0, 0.2);
	// hatch *= step(length(tile(st * 70.0, 0.9)) * 2.0, 0.5);

	// grid
	float gridColor = max(grid(p * 4.0) * 0.6, grid(p * 8.0) * 0.3);

	// color
	vec3 color = (0.2 + v_normal.xyz) * (1.0 - gridColor);

	gl_FragColor = vec4(clamp(max(light, color), 0.0, 1.0) - hatch, alpha);
}

#endif
`;

export const DefaultFragment_ = /* glsl */`
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_light;
varying vec4 v_color;

uniform mat4 u_normalMatrix;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO 1.570796326794897
#define PI 3.141592653589793
#define TWO_PI 6.283185307179586

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
	vec2 p = v_texcoord;
	// p -= 0.5;
	// p *= vec2(-1.0, 1.0);
	// p *= 2.0;
	// p = smoothstep(0.49, 0.5, p);
	vec3 color = vec3(
		abs(cos(u_time * 0.75)),
		abs(sin(u_time * 0.25)),
		abs(sin(u_time))
	) * 0.9;
	// color *= vec3(step(vec2(0.1), fract(p * 10.0)), 1.0);
	// color *= vec3(smoothstep(fract(p.x * 3.0), -0.02, 0.02));
	// color *= vec3(smoothstep(fract(p.y * 3.0), -0.02, 0.02));
	// color = vec3(st.x, st.y, 0.0);
	// color = vec3(st.x, 0.0, 0.0);
	// color = vec3(p.x, p.y, 0.0);
	// color = vec3(gl_FragCoord.x / u_resolution.x, 0.0, 0.0);
	// color = vec3(v_texcoord.x, 0.0, 0.0);

	vec2 a = step(
		vec2(
			0.5 + sin(u_time) * 0.5),
			fract((p + u_time * 0.1) * vec2(5.0, 5.0)
		)
	);
	float alpha = a.x * a.y;
	alpha = 1.0;
	vec4 normal = u_normalMatrix * vec4(v_normal, 1.0);
	// normal = normalize(normal) * length(normal);
	gl_FragColor = vec4(normal.rgb * v_light, alpha);
}
`;

export default class GlslEditor {

	static create(): Promise<vscode.TextDocument> {
		return new Promise((resolve, reject) => {
			/*
			if (!vscode.workspace.rootPath) {
				return vscode.window.showErrorMessage('No project currently open!');
			}
			*/
			const folder: string = vscode.workspace.rootPath || '';
			// console.log('onCreateShader', folder);
			let newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled.glsl'));
			let i = 1;
			while (fs.existsSync(newFile.fsPath)) {
				newFile = vscode.Uri.parse('untitled:' + path.join(folder, 'untitled' + i + '.glsl'));
				i++;
			}
			vscode.workspace.openTextDocument(newFile).then(
				document => {
					// console.log('document', document);
					const edit = new vscode.WorkspaceEdit();
					edit.insert(newFile, new vscode.Position(0, 0), DefaultFragment);
					return vscode.workspace.applyEdit(edit).then(
						success => {
							if (success) {
								vscode.window.showTextDocument(document, vscode.ViewColumn.One).then(
									success => {
										resolve(document);
									},
									error => {
										reject(error);
									}
								);
							} else {
								reject('Error!');
							}
						},
						error => {
							console.log('onCreateShader.applyEdit', error);
							reject(error);
						});
				},
				error => {
					console.log('onCreateShader.openTextDocument', error);
					reject(error);
				});
		});
	}

}
