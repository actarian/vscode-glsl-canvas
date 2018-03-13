// Author: Luca Zampetti
// Title: vscode-glsl-canvas Main example

void main() {
    vec3 color = vec3(
        abs(cos(st.x + mx.x)), 
        abs(sin(st.y + mx.y)), 
        abs(sin(u_time))
    );
    gl_FragColor = vec4(color, 1.0);
}