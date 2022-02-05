'use strict';

import * as path from 'path';
import * as vscode from 'vscode';
import { currentGlslDocument } from './common';

export const WORKPATH_SCHEME: string = 'vscode-webview-resource:'; // 'vscode-webview-resource':

export default class GlslOptions {

	public uri: vscode.Uri;
	public workspaceFolder: string;
	public workpath: string;
	public folder: string;
	public resources: string;
	public fragment: string;
	public vertex: string;
	public uniforms: object;
	public textures: object;
	public timeout: number;
	public extensions: string[];
	public antialias: boolean;
	public doubleSided: boolean;
	public refreshOnChange: boolean;
	public refreshOnSave: boolean;
	public recordMethod: string;
	public recordDuration: number;
	public recordWidth: number;
	public recordHeight: number;
	public mode?: 'mesh' | 'torus' | 'spere' | 'box' | 'flat';

	constructor(webview: vscode.Webview = null, extensionPath: string = null) {
		const document: vscode.TextDocument = currentGlslDocument();
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
					} else {
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

	public serialize(): string {
		return JSON.stringify(this);
	}

	private getWorkspaceFolder_(): string {
		return vscode.workspace && vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : null;
	}

	private getWorkpath_(webview: vscode.Webview, extensionPath: string, workspaceFolder?:string, uri?: vscode.Uri): string {
		let url: string;
		const folder = uri ? path.dirname(uri.path) : workspaceFolder;
		if (folder) {
			uri = webview.asWebviewUri(vscode.Uri.file(folder));
		} else {
			uri = vscode.Uri.file(path.join(extensionPath, 'resources'));
		}
		url = uri.scheme + '://' + uri.authority + uri.path;
		// console.log('GlslOptions.getWorkpath', url);
		return url;
	}

	private getFolder_(extensionPath: string, workspaceFolder?:string, uri?: vscode.Uri): string {
		let url: string;
		const folder = uri ? path.dirname(uri.path) : workspaceFolder;
		if (folder) {
			url = folder;
		} else {
			url = path.join(extensionPath, 'resources');
		}
		// console.log('GlslOptions.getFolder', url);
		return url;
	}

	private getResources_(webview: vscode.Webview, extensionPath: string): string {
		const filePath = vscode.Uri.file(
			path.join(extensionPath, 'resources')
		);
		const uri: vscode.Uri = webview.asWebviewUri(filePath);
		const url: string = uri.scheme + '://' + uri.authority + uri.path;
		// console.log('GlslOptions.getResources', url);
		return url;
	}
}
