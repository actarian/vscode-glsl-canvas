// Author: Luca Zampetti
// Title: vscode-glsl-canvas Trails examples

void main() {
    vec3 color = AZUR;

    for (int i = 0; i < 10; i++) {
        float d = circle(st - coord(u_trails[i]), 0.01 * float(10 - i));
        vec3 c = mix(WHITE, BLACK, float(i) / 10.0);
        color = mix(color, c, d);
    }

    gl_FragColor = vec4(color, 1.0);
}