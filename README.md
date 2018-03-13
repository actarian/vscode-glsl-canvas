# vscode-glsl-canvas

The extension opens a live WebGL preview of GLSL shaders within VSCode by providing a ```Show glslCanvas``` command.

It use [glslCanvas](https://github.com/patriciogonzalezvivo/glslCanvas) a javaScript library from [Book of Shaders](http://thebookofshaders.com) and [glslEditor](http://editor.thebookofshaders.com) made by [Patricio Gonzalez Vivo](http://patriciogonzalezvivo.com).

*Run the command to display a fullscreen preview of your fragment shader.*

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/preview-half.gif)

-----------

## Uniforms

The uniforms provided are ```u_resolution```, ```u_time```, ```u_mouse``` and ```u_trails[10]```. You can define the texture channels (```u_texture_0```, ```u_texture_1```, ...) by modifying the workspace's ```settings.json``` file. 
```
{
    "glsl-canvas.textures": {
        "0": "./texture.png",
        "1": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-1.png",
        "2": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-2.jpg",        
    }
}
```

## u_trails[10]

```u_trails[10]``` is a vec2 array with stored inertia mouse positions for mouse trailing effects.

[Playground](https://actarian.github.io/vscode-glsl-canvas/?glsl=trails)

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/preview-trail.gif)

-----------

## Custom Uniforms

You can also define custom uniforms by modifying the workspace's ```settings.json``` file. 

```
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

## Uniforms Gui

By clicking the option button you can view and modify at runtime uniforms via the [dat.gui](https://github.com/dataarts/dat.gui) interface.

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/preview-gui.gif)

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

## Features

* Integrated support of error handling with lines hilight.
* Play / pause functionality.
* Recording and exporting to ```.webm``` video.
* Activable [stats.js](https://github.com/mrdoob/stats.js/) performance monitor.
* Custom uniforms.
* Activable gui for changing custom uniforms at runtime.
* Glsl Snippets.

-----------

## Glsl Snippets

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

## Requirements

* A graphics card supporting WebGL.

-----------

## Todo

* Glsl 3d snippets.
* Mouse orbit control.
* Glsl code formatting.
* WebGL code exporter.

## Contributing

[Github Project Page](https://github.com/actarian/vscode-glsl-canvas)  
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=circledev.glsl-canvas)

*Thank you so much for taking the time to provide feedback and review. This feedback is appreciated and very helpful.*

-----------

## Release Notes

### 0.1.6

* Documented snippets library with playgrounds.
* Mouse trail uniforms.
* Texture repeating feature.

### 0.1.5

* Gui for changing custom uniforms at runtime.
* Fix dependancy from other extension.

### 0.1.3

* Play / pause functionality.
* Record button that exports to ```.webm``` video.
* Activable performance monitor.
* Better handling of active ```.glsl``` editor.
* Improved inline error message.
* Fix resizing issue.
* Minor snippets functionality.

### 0.1.1

* Initial release of glsl-canvas for vscode.
