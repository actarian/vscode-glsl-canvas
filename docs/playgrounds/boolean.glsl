// Author: Luca Zampetti
// Title: vscode-glsl-canvas Boolean examples

void main() {
    vec2 p = st;

    vec3 color = BLACK;
    
    float a = sCircle(p - cos(u_time) * 0.2, 0.3);
    float b = sCircle(p + cos(u_time) * 0.2, 0.3);

    float d = 0.0;
    d = sUnion(a, b);
    // d = sIntersect(a, b);
    // d = sDifference(a, b);

    color = field(d);
    color = mix(BLACK, WHITE, fill(d));
    // color = mix(BLACK, WHITE, stroke(d, 0.01));

    gl_FragColor = vec4(color, 1.0);
}
