/* Shape 2D circle */
float circle(in vec2 p, in float size) {
    float d = length(p) * 2.0;
    return 1.0 - smoothstep(size - rx, size + rx, d);
}
float circle(in vec2 p, in float size, float t) {
    float d = length(abs(p)) - size / 2.0;
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(d));
}