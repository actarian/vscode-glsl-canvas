// Author: Luca Zampetti
// Title: vscode-glsl-canvas Tile examples

void main() {
    vec3 color = BLACK;
    
    vec2 s = vec2(0.2, 0.2);

    float t = fract(u_time * 0.5);
    float d = 0.0;
    
    d = poly(tile(st + vec2(-0.1 + t * s.x, 0.01), s), 0.07, 3);
    color += mix(BLACK, RED, d);
    
    d = rect(tile(st + vec2(0.1, 0.0 + t * s.y), s), vec2(0.1));
    color += mix(BLACK, BLUE, d);

    gl_FragColor = vec4(color, 1.0);
}