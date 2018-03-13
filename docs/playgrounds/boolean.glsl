// Author: Luca Zampetti
// Title: vscode-glsl-canvas Boolean examples

void main() {
    vec2 p = st;

    vec3 color = AZUR;
    
    float a = sCircle(p - cos(u_time) * 0.2, 0.3);
    float b = sCircle(p + cos(u_time) * 0.2, 0.3);

    float d = 0.0;
    d = sUnion(a, b);
    // d = sIntersect(a, b);
    // d = sDifference(a, b);

    color = mix(AZUR, WHITE, fill(d));
    // color = mix(AZUR, WHITE, stroke(d, 0.01));
    // color = field(d);
    
    gl_FragColor = vec4(color, 1.0);
}
