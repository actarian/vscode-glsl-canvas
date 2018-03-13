// Author: Luca Zampetti
// Title: vscode-glsl-canvas Colors examples

void main() {
    vec2 p = st;

    vec3 color = BLACK;
    
    float a = circle(p - cos(u_time) * 0.2, 0.3, 0.1);
    float b = circle(p + cos(u_time) * 0.2, 0.3, 0.1);

    color += mix(BLACK, RED, a);
    color += mix(BLACK, BLUE, b);

    gl_FragColor = vec4(color, 1.0);
}