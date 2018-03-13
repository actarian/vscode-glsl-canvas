// Author: Luca Zampetti
// Title: vscode-glsl-canvas Drawing examples

void main() {
    vec2 p = st + cos(u_time + st.x) * 0.2;
    float d = sCircle(p, 0.5);
    
    vec3 color = AZUR;
    
    color = mix(AZUR, WHITE, fill(d));
    // color = mix(AZUR, WHITE, stroke(d, 0.05));
    // color = field(d);
    // color = mix(AZUR, draw(u_texture_0, p + u_time * 0.03, vec2(1.0)), fill(d));
    // color = mix(AZUR, draw(u_texture_0, p + u_time * 0.03, vec2(1.0)), stroke(d, 0.05));

    gl_FragColor = vec4(color, 1.0);
}