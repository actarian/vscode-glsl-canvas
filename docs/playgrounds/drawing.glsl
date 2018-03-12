// Author: Luca Zampetti
// Title: vscode-glsl-canvas Drawing examples

void main() {
    vec2 p = st;

    vec3 color = BLACK;
    
    float d = sCircle(p, 0.5);
    
    color = mix(BLACK, WHITE, fill(d));
    // color = mix(BLACK, WHITE, stroke(d, 0.05));
    // color = field(d);
    // color = mix(BLACK, draw(u_texture_0, p + u_time * 0.03, vec2(1.0)), fill(d));
    // color = mix(BLACK, draw(u_texture_0, p + u_time * 0.03, vec2(1.0)), stroke(d, 0.05));

    gl_FragColor = vec4(color, 1.0);
}