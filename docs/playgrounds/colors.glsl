// Author: Luca Zampetti
// Title: vscode-glsl-canvas Colors examples

void main() {
    vec2 p = st;
    float a = circle(p - cos(u_time) * 0.2, 0.3, 0.1);
    float b = circle(p + cos(u_time) * 0.2, 0.3, 0.1);

    vec3 color = AZUR;
    // color = BLACK;           
    // color = WHITE;           
    // color = RED;             
    // color = GREEN;           
    // color = BLUE;            
    // color = YELLOW;          
    // color = CYAN;            
    // color = MAGENTA;         
    // color = ORANGE;          
    // color = PURPLE;          
    // color = LIME;            
    // color = ACQUA;           
    // color = VIOLET;          

    color = mix(color, WHITE, a);
    color = mix(color, BLACK, b);

    gl_FragColor = vec4(color, 1.0);
}