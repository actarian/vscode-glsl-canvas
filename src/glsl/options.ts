'use strict';

import * as vscode from 'vscode';
import { currentGlslDocument } from './common';

export const WORKPATH_SCHEME:string = 'vscode-webview-resource:'; // 'vscode-webview-resource':

export default class GlslOptions {

	public uri: vscode.Uri;
	public workpath: string;
	public folder: string;
	public resources: string;
	public fragment: string;
	public vertex: string;
	public uniforms: object;
	public textures: object;
	public extensions: string[];
	public doubleSided: boolean;
	public timeout: number;
	public refreshOnChange: boolean;
	public refreshOnSave: boolean;
	public mode?: 'mesh' | 'torus' | 'spere' | 'box' | 'flat';

	constructor() {
		const document: vscode.TextDocument = currentGlslDocument();
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

	public serialize(): string {
		return JSON.stringify(this);
	}

}
