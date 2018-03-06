/* Shape 2D roundrect */
float roundrect(in vec2 p, in vec2 size, in float radius) {
    radius *= 2.0; size /= 2.0;
    float d = length(max(abs(p) -size + radius, 0.0)) - radius;
    return 1.0 - smoothstep(0.0, rx * 2.0, d);
}
float roundrect(in vec2 p, in vec2 size, in float radius, in float t) {
    radius *= 2.0; size /= 2.0; size -= radius;
    float d = length(max(abs(p), size) - size) - radius;
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(d));
}