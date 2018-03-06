/* Shape 2D rectline */
mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
}
float rectline(in vec2 p, in float t, in float a) {
    p *= rotate2d(a);
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(p.x));
}
float rectline(in vec2 p, in float t) { return rectline (p, t, 0.0); }
float rectline(in vec2 p) { return rectline (p, 1.0, 0.0); }