// Author: Luca Zampetti
// Title: vscode-glsl-canvas Pixel Units examples

void main() {
    vec3 color = AZUR;
    
    color = mix(color, BLACK, grid(st, size(50.0)));
    
    float d = 0.0;
    
    d = arc(pos(0.0), size(150.0), 0.0, PI_TWO, size(2.0));
    // d = circle(pos(0.0), size(150.0));
    // d = circle(pos(0.0), size(150.0), size(2.0));    
    // d = line(pos(-75.0, -75.0), pos(75.0, 75.0), size(2.0));
    // d = pie(pos(0.0), size(150.0), 0.0, PI_TWO);
    // d = pie(pos(0.0), size(150.0), 0.0, PI_TWO, size(2.0));
    // d = plot(pos(0.0), -st.x, size(2.0));
    // d = poly(pos(0.0), size(150.0), 3);
    // d = poly(pos(0.0), size(150.0), 3, size(2.0));
    // d = rect(pos(0.0), size(150.0, 150.0));
    // d = rect(pos(0.0), size(150.0, 150.0), size(2.0));
    // d = roundrect(pos(0.0), size(150.0, 150.0), size(10.0));
    // d = roundrect(pos(0.0), size(150.0, 150.0), size(10.0), size(2.0));
    // d = segment(pos(-75.0, -75.0), pos(75.0, 75.0), size(2.0));
    // d = spiral(pos(0.0), 1.0);
    // d = star(pos(0.0), size(150.0), 5);
    // d = star(pos(0.0), size(150.0), 5, size(2.0));
    
    color = mix(color, WHITE, d);

    gl_FragColor = vec4(color, 1.0);
}
