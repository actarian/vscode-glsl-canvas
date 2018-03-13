// Author: Luca Zampetti
// Title: vscode-glsl-canvas Blend examples

void main() {
    vec2 p = st;

    vec3 color = AZUR;
    
    float a = sCircle(p - cos(u_time) * 0.2, 0.3);
    float b = sCircle(p + cos(u_time) * 0.2, 0.3);

    float d = 0.0;
    d = sBlendExpo(a, b, 5.0);
    // d = sBlendPoly(a, b, 0.5);
    // d = sBlendPower(a, b, 3.0);

    color = mix(AZUR, WHITE, fill(d));
    // color = mix(AZUR, WHITE, stroke(d, 0.01));
    // color = field(d);
    
    gl_FragColor = vec4(color, 1.0);
}
