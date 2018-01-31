# Visual Studio Code - glslCanvas

The extension let you view a live WebGL preview of GLSL shaders within VSCode by providing a "Show glslCanvas" command.

It use [glslCanvas](https://github.com/patriciogonzalezvivo/glslCanvas) a javaScript library from Book of Shaders and glslEditor made by Patricio Gonzalez Vivo [patriciogonzalezvivo](https://github.com/patriciogonzalezvivo/glslCanvas).

![example](https://rawgit.com/actarian/vscode-glsl-canvas/master/resources/example.jpg)

Running the command splits the view and displays a fullscreen quad with your shader applied. Your fragment shader's entry point is ```void main()```. 

## Features

Automatically update display with the results of your shader. At the moment, ```iResolution```, ```iGlobalTime```, and ```iDeltaTime```, ```iChannelN``` are the only uniforms provided. The texture channels (```iChannel0```, ```iChannel1```, ...) may be defined by modifying the workspace's settings.json file. For example:  
```
{
    "glsl-canvas.textures": {
        "0": "./texture.png",
        "1": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-1.png",
        "2": "https://rawgit.com/actarian/plausible-brdf-shader/master/textures/noise/cloud-2.jpg",        
    }
}
```
This demonstrates using local and remote images as textures. *Remember that "power of 2" texture sizes is generally what you want to stick to.*

The following is an example ported from Shadertoy.com:
```glsl
// Author:
// Title:

#ifdef GL_ES
    precision mediump float;
#endif

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

## Requirements

* A graphics card supporting WebGL.

## Contributing

[Github Project Page](https://github.com/actarian/vscode-glsl-canvas)  
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=circledev.glsl-canvas)

## Release Notes

### 0.1.1

Initial release of glsl-canvas for vscode.