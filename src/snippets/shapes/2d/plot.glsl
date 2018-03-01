/* Shape 2D plot */
mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
}
float plot(in vec2 p, in float t, in float a) {
    p *= rotate2d(a);
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(p.x));
}
float plot(in vec2 p, in float t) { return plot (p, t, 0.0); }
float plot(in vec2 p) { return plot (p, rx, 0.0); }
