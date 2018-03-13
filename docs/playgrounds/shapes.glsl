// Author: Luca Zampetti
// Title: vscode-glsl-canvas Shapes examples

void main() {
    vec2 p = st;

    vec3 color = AZUR;
    
    color = mix(color, BLACK, grid(p, 0.1));
    
    float d = 0.0;
    
    d = arc(p, 0.3, 0.0, PI_TWO, 0.004);
    // d = circle(p, 0.3);
    // d = circle(p, 0.3, 0.004);
    // d = hex(p, 0.3);
    // d = hex(p, 0.3, 0.004);
    // d = line(p - vec2(0.15), p + vec2(0.15), 0.004);
    // d = pie(p, 0.3, 0.0, PI_TWO);
    // d = pie(p, 0.3, 0.0, PI_TWO, 0.004);
    // d = plot(p, -p.x, 0.004);
    // d = poly(p, 0.3, 3);
    // d = poly(p, 0.3, 3, 0.004);
    // d = rect(p, vec2(0.3));
    // d = rect(p, vec2(0.3), 0.004);
    // d = roundrect(p, vec2(0.3), 0.05);
    // d = roundrect(p, vec2(0.3), 0.05, 0.004);
    // d = segment(p - vec2(0.15), p + vec2(0.15), 0.004);
    // d = spiral(p, 1.0);
    // d = star(p, 0.5, 6);
    // d = star(p, 0.5, 6, 0.004);
    
    color = mix(color, WHITE, d);
    
    gl_FragColor = vec4(color, 1.0);
}
