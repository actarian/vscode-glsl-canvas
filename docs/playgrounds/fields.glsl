// Author: Luca Zampetti
// Title: vscode-glsl-canvas Field example

void main() {
    vec2 p = st;

    vec3 color = BLACK;
    
    color = field(sArc(p, 0.3, 0.0, PI_TWO));
    // color = field(sCircle(p, 0.3));
    // color = field(sHex(p, 0.3));    
    // color = field(sLine(p, p + vec2(0.1)));
    // color = field(sSegment(p - vec2(0.15), p + vec2(0.15)));    
    // color = field(sPie(p, 0.3, 0.0, PI_TWO));
    // color = field(sPlot(p, -p.x));
    // color = field(sPoly(p, 0.3, 3));
    // color = field(sRect(p, vec2(0.3)));
    // color = field(sRoundrect(p, vec2(0.3), 0.05));
    // color = field(sSpiral(p, 1.0));
    // color = field(sStar(p, 0.5, 6));
    
    gl_FragColor = vec4(color, 1.0);
}
