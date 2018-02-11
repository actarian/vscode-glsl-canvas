# vscode-glsl-canvas

The extension opens a live WebGL preview of GLSL shaders within VSCode by providing a ```Show glslCanvas``` command.

It use [glslCanvas](https://github.com/patriciogonzalezvivo/glslCanvas) a javaScript library from [Book of Shaders](http://thebookofshaders.com) and [glslEditor](http://editor.thebookofshaders.com) made by [Patricio Gonzalez Vivo](http://patriciogonzalezvivo.com).

*Run the command to display a fullscreen preview of your fragment shader.*

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/src/preview.gif)

## Uniforms

The uniforms provided are ```u_resolution```, ```u_time```, ```u_mouse```. You can define the texture channels (```u_texture_0```, ```u_texture_1```, ...) by modifying the workspace's ```settings.json``` file. 
```
{
    "glsl-canvas.textures": {
        "0": "./texture.png",
        "1": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-1.png",
        "2": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-2.jpg",        
    }
}
```

You can also define custom uniforms by modifying the workspace's ```settings.json``` file. 
```
{
    "glsl-canvas.uniforms": {
        "u_strength": 1.0,
    }
}
```

An example of fragment shader:
```glsl
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);
    color = vec3(st.x,st.y,abs(sin(u_time)));

    gl_FragColor = vec4(color,1.0);
}
```

## Features

* Integrated support of error handling with lines hilight.
* Play / pause functionality.
* Recording and exporting to ```.webm``` video.
* Activable fps counter.
* Glsl Snippets.

## Glsl Snippets

| Snippet                      | Purpose                         |
|------------------------------|---------------------------------|
| `glsl.main.new`              | Main function, uniforms & utils |
| `glsl.math.2d.transform`     | Math 2D Transformations         |
| `glsl.math.3d.transform`     | Math 3D Transformations         |
| `glsl.shapes.2d.box`         | Shape 2D box                    |
| `glsl.shapes.2d.circle`      | Shape 2D circle                 |
| `glsl.shapes.2d.poligon`     | Shape 2D polygon                |

## Requirements

* A graphics card supporting WebGL.

## Todo

* Improved snippets library.
* Gui for changing custom uniforms at runtime.
* Glsl code formatting.

## Contributing

[Github Project Page](https://github.com/actarian/vscode-glsl-canvas)  
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=circledev.glsl-canvas)

## Release Notes

### 0.1.3

* Play / pause functionality.
* Record button that exports to ```.webm``` video.
* Activable Fps counter.
* Better handling of active ```.glsl``` editor.
* Improved inline error message.
* Fix resizing issue.
* Minor snippets functionality.

### 0.1.1

* Initial release of glsl-canvas for vscode.
