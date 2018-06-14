// Author: Luca Zampetti
// Title: vscode-glsl-canvas Buffers examples

uniform sampler2D u_buffer0;
uniform sampler2D u_buffer1;

#if defined(BUFFER_0)

void main() {
    vec3 color = vec3(
        0.5 + cos(u_time) * 0.5,
        0.5 + sin(u_time) * 0.5,
        1.0
    );
    vec3 buffer = texture2D(u_buffer1, uv, 0.0).rgb;
    buffer *= 0.99;
    vec2 p = vec2(
        st.x + cos(u_time * 5.0) * 0.3, 
        st.y + sin(u_time * 2.0) * 0.3
    );
    float c = circle(p, 0.2 + 0.1 * sin(u_time));
    buffer = mix(buffer, color, c * 1.0);
    gl_FragColor = vec4(buffer, 1.0);
}

#elif defined(BUFFER_1)

void main() {
    vec3 color = vec3(
        0.5 + cos(u_time) * 0.5,
        0.5 + sin(u_time) * 0.5,
        1.0
    );
    vec3 buffer = texture2D(u_buffer0, uv, 0.0).rgb;
    buffer *= 0.99;
    vec2 p = vec2(
        st.x + sin(u_time * 2.0) * 0.3, 
        st.y + cos(u_time * 6.0) * 0.3
    );
    float c = circle(p, 0.2 + 0.1 * cos(u_time));
    buffer = mix(buffer, color, c * 1.0);
    gl_FragColor = vec4(buffer, 1.0);
}

#else

void main() {
    vec3 color = BLACK;
    // vec3 b0 = texture2D(u_buffer0, uv).rgb;
    vec3 b1 = texture2D(u_buffer1, uv).rgb;
    // color += b0;
    color += b1;
    gl_FragColor = vec4(color, 1.0);
}

#endif
