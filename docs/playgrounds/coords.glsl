// Author: Luca Zampetti
// Title: vscode-glsl-canvas Coords examples

void main() {
    vec3 color = AZUR;

    color = mix(color, BLACK, grid(st, 0.1));    

    color = mix(color, WHITE, circle(mx - st, 0.1));    
    
    gl_FragColor = vec4(color, 1.0);
}