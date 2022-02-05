# 💎 vscode-glsl-canvas

[![VS Code Marketplace](https://vsmarketplacebadge.apphb.com/version-short/circledev.glsl-canvas.svg) 
![Installs](https://vsmarketplacebadge.apphb.com/installs/circledev.glsl-canvas.svg)](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
![Rating](https://vsmarketplacebadge.apphb.com/rating-short/circledev.glsl-canvas.svg) 
[![Licence](https://img.shields.io/github/license/actarian/vscode-glsl-canvas.svg)](https://github.com/actarian/vscode-glsl-canvas)

The extension opens a live WebGL preview of GLSL shaders within VSCode by providing a ```Show glslCanvas``` command.

It use [glsl-canvas](https://github.com/actarian/glsl-canvas) a modified and improved version of [glslCanvas](https://github.com/patriciogonzalezvivo/glslCanvas) javascript library from [Book of Shaders](http://thebookofshaders.com) and [glslEditor](http://editor.thebookofshaders.com) made by [Patricio Gonzalez Vivo](http://patriciogonzalezvivo.com).

***Now supporting WebGL2. just add `#version 300 es` at the very start of the file.***

***Now supporting nested includes with relative paths.***

***Optimized video recording options, with record size and duration. Choose between MediaRecorderApi or CCapture for high quality compression.***

___

*Run ⌘ ⇧ P on mac os, ctrl ⇧ P on windows.*  
*Then type ```Show glslCanvas``` command to display a fullscreen preview of your fragment shader.*  

___
![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/01-mode.gif)

___

## Features

* Both supports WebGL and WebGL2. Automatically create WebGL2 context by adding `#version 300 es` as the first line of file.
* Integrated support of error handling with lines hilight.
* Drawing modes: ```flat```, ```box```, ```sphere```, ```torus``` and ```mesh``` with default mesh.
* Mesh loader and parser for ```.obj``` format.
* Vertex in fragment with ```VERTEX``` macro.
* Multiple buffers with ```BUFFER``` macro.
* Play / pause functionality.
* Recording and exporting to ```.webm``` video with resolution and duration settings, using ```MediaRecorder``` or ```CCapture``` for high quality video.
* Activable [stats.js](https://github.com/mrdoob/stats.js/) performance monitor.
* Custom uniforms.
* Activable gui for changing custom uniforms at runtime.
* Export to html page with live reload.
* Glsl code formatter standard and compact mode.
* Glsl Snippets.
___

## Attributes

The attributes provided are ```a_position```, ```a_normal```, ```a_texcoord```, ```a_color```.  

| Type                    | Property                         |
|-------------------------|----------------|
| `vec4`                  | a_position     |
| `vec4`                  | a_normal       |
| `vec2`                  | a_texcoord     |
| `vec4`                  | a_color        |
___

## Uniforms

The uniforms provided are ```u_resolution```, ```u_time```, ```u_mouse```, ```u_camera``` and ```u_trails[10]```.  

| Type                    | Property                         |
|-------------------------|-----------------|
| `vec2`                  | u_resolution    |
| `float`                 | u_time          |
| `vec2`                  | u_mouse         |
| `vec3`                  | u_camera        |
| `vec2[10]`              | u_trails[10]    |
___

## WebGL Extensions
You can include any supported WebGL extension through the ```glsl-canvas.extensions``` array option modifying the workspace's ```settings.json``` file. 
```json
{
    "glsl-canvas.extensions": [
		"EXT_shader_texture_lod"
	]
}
```
You can then enable the extension in the shader
```glsl
#extension GL_EXT_shader_texture_lod : enable  

vec3 color = texture2DLodEXT(u_texture, st, 0.0).rgb;
```
___

## WebGL2
For WebGL2 context creation just add `#version 300 es` at the very start of the file.  

***no other characters allowed before macro!*** 
```glsl
#version 300 es

precision mediump float;

```
___

## IO Buffers 

You can use shader buffers by requiring definition with `#ifdef` or `defined` directly in `.glsl` code.  
Just ask for `BUFFER_`N definition and a `u_buffer`N uniform will be created for you: 

```glsl

uniform sampler2D u_buffer0;

#ifdef BUFFER_0

void main() {
    vec4 color = texture2D(u_buffer0, uv, 0.0);
    ...
    gl_FragColor = color;
}

#else

void main() {
    vec4 color = texture2D(u_buffer0, uv, 0.0);
    ...
    gl_FragColor = color;
}

#endif

```

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=buffers)

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/06-buffers.gif)
___

## Textures
You can define the texture channels (```u_texture_0```, ```u_texture_1```, ...) by modifying the workspace's ```settings.json``` file. 
```json
{
    "glsl-canvas.textures": {
        "0": "./texture.png",
        "1": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-1.png",
        "2": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-2.jpg",        
    }
}
```
> *As of today VSCode do not support video element or audio element. You can use video texture with the Export to html feature.*
___

## u_camera

```u_camera``` is a vec3 array with coordinates for an orbital camera positioned at world zero, useful for raymarching.

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/03-camera.gif)
[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=camera)
___

## u_trails[10]

```u_trails[10]``` is a vec2 array with stored inertia mouse positions for mouse trailing effects.  

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/04-trails.gif)
[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=trails)
___

## Custom Uniforms

You can also define custom uniforms by modifying the workspace's ```settings.json``` file. 

```json
{
    "glsl-canvas.uniforms": {
        "u_strength": 1.0
    }
}
```

Types supported are ```float```,  ```vec2```,  ```vec3``` and ```vec4```. Vectors structures are converted from arrays of floats. Range values goes from ```0.0``` to ```1.0```.

| Type                    | Property                         |
|-------------------------|----------------------------------|
| `float`                 | "u_float":  1.0,                 |
| `vec2`                  | "u_vec2":  [1.0, 1.0],           |
| `vec3`                  | "u_vec3":  [1.0, 1.0, 1.0],      |
| `vec4`                  | "u_vec4":  [1.0, 1.0, 1.0, 1.0], |
___

## Uniforms Gui

By clicking the option button you can view and modify at runtime uniforms via the [dat.gui](https://github.com/dataarts/dat.gui) interface.

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/05-uniforms.gif)
___

## Export to html

You can export your shader, assets and uniforms to an html page with livereload for testing in browser.

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/07-export.gif)
___

## Color Picker

Waiting for a more customizable code inset feature, ```vec3``` and ```vec4``` arrays can be modified with the integrated color picker.  

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/02-picker.gif)
___
## Including dependent files with `#include`

You can now include other GLSL code using a traditional `#include "file.glsl"` macro. 

```javascript
// example
#include "common/uniforms.glsl"
#include "common/functions.glsl"

void main(){
```
___

## Antialias

Enables or disables antialias in the WebGL context.  

```json
{
    "glsl-canvas.antialias": false
}
```
___

## Change detection 

You can set the timeout change detection option by modifying the workspace's ```settings.json``` file. 

```json
{
    "glsl-canvas.timeout": 0
}
```
___

## Refresh on save

Enables or disables refreshing the glslCanvas when saving the document.  
                
```json
{
    "glsl-canvas.refreshOnSave": true
}
```

## Refresh on change

Enables or disables refreshing the glslCanvas when changing the document.  

```json
{
    "glsl-canvas.refreshOnChange": true
}
```
___

## Use formatter

Enables or disables glsl code formatter. 

```json
{
    "glsl-canvas.useFormatter": true
}
```
___

## Use compact formatter

Enables or disables glsl code formatter compact mode.

```json
{
    "glsl-canvas.useCompactFormatter": false
}
```

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/previews/08-format.gif)
___

## Install on export

Enables or disables installing the Npm packages on export. 

```json
{
    "glsl-canvas.installOnExport": true
}
```
___

## Record duration

Specify automatic recording duration in seconds. Set to ```0``` to disable this feature.  

```json
{
    "glsl-canvas.recordDuration": 10
}
```
___

## Record width

Specify canvas recording width in pixels. Default value is ```1024```.  

```json
{
    "glsl-canvas.recordWidth": 1024
}
```
___

## Record height

Specify canvas recording height in pixels. Default value is ```1024```.  

```json
{
    "glsl-canvas.recordHeight": 1024
}
```
___

## Fragment shader

An example of fragment shader. You can copy paste this code in an empty `.glsl` file:

```glsl
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.0);
    color = vec3(st.x, st.y, abs(sin(u_time)));

    gl_FragColor = vec4(color, 1.0);
}
```
___

## Glsl snippets

| Snippet                      | Purpose                               |
|------------------------------|---------------------------------------|
| `glsl.animation`             | Staggered animations                  |
| `glsl.modifiers.blend`       | Blend functions                       |
| `glsl.modifiers.boolean`     | Boolean functions                     |
| `glsl.colors`                | Colors palette                        |
| `glsl.coords`                | Pixel units utility functions         |
| `glsl.drawing`               | Signed distance drawing methods       |
| `glsl.ease.back.in`          | Ease equation back in                 |
| `glsl.ease.bounce.in`        | Ease equation bounce in               |
| `glsl.ease.circular.in`      | Ease equation circular in             |
| `glsl.ease.cubic.in`         | Ease equation cubic in                |
| `glsl.ease.elastic.in`       | Ease equation elastic in              |
| `glsl.ease.expo.in`          | Ease equation expo in                 |
| `glsl.ease.quad.in`          | Ease equation quad in                 |
| `glsl.ease.quart.in`         | Ease equation quart in                |
| `glsl.ease.quint.in`         | Ease equation quint in                |
| `glsl.ease.sine.in`          | Ease equation sine in                 |
| `glsl.main.new`              | Main function, uniforms & utils       |
| `glsl.core.object`           | Object struct with distance and color |
| `glsl.shapes.2d.arc`         | Shape 2D arc                          |
| `glsl.shapes.2d.circle`      | Shape 2D circle                       |
| `glsl.shapes.2d.grid`        | Shape 2D grid                         |
| `glsl.shapes.2d.hex`         | Shape 2D hexagon                      |
| `glsl.shapes.2d.line`        | Shape 2D line                         |
| `glsl.shapes.2d.pie`         | Shape 2D pie                          |
| `glsl.shapes.2d.plot`        | Shape 2D plot                         |
| `glsl.shapes.2d.poly`        | Shape 2D poly                         |
| `glsl.shapes.2d.rect`        | Shape 2D rect                         |
| `glsl.shapes.2d.roundrect`   | Shape 2D roundrect                    |
| `glsl.shapes.2d.segment`     | Shape 2D segment                      |
| `glsl.shapes.2d.spiral`      | Shape 2D spiral                       |
| `glsl.shapes.2d.star`        | Shape 2D star                         |
| `glsl.modifiers.tile`        | Tiling function                       |
| `glsl.units`                 | Pixel unit conversion function        |

Snippets library documentation and playgrounds [here](https://github.com/actarian/vscode-glsl-canvas/blob/master/src/snippets/snippets.md).
___

## Requirements

* A graphics card supporting WebGL.
___

## Todo

* Glsl 3d snippets.
___

## Contributing

*Pull requests are welcome and please submit bugs 🐞*

*Thank you for taking the time to provide feedback and review. This feedback is appreciated and very helpful 🌈*

[![GitHub forks](https://img.shields.io/github/forks/actarian/vscode-glsl-canvas.svg?style=social&label=Fork&maxAge=2592000)](https://gitHub.com/actarian/vscode-glsl-canvas/network/)  [![GitHub stars](https://img.shields.io/github/stars/actarian/vscode-glsl-canvas.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/actarian/vscode-glsl-canvas/stargazers/)  [![GitHub followers](https://img.shields.io/github/followers/actarian.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/actarian?tab=followers)

* [Github Project Page](https://github.com/actarian/vscode-glsl-canvas)  
* [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=circledev.glsl-canvas)
___

## Contact

* Luca Zampetti <lzampetti@gmail.com>
* Follow [@actarian](https://twitter.com/actarian) on Twitter

[![Twitter Follow](https://img.shields.io/twitter/follow/actarian.svg?style=social&label=Follow%20@actarian)](https://twitter.com/actarian)
___

## Release Notes
Changelog [here](https://github.com/actarian/vscode-glsl-canvas/blob/master/CHANGELOG.md).
