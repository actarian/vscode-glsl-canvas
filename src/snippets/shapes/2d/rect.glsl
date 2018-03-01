/* Shape 2D rect */
float rect(in vec2 p, in vec2 size) {
    size /= 2.0;
    float d = length(max(abs(p) -size, 0.0));
    return 1.0 - smoothstep(0.0, 0.0 + rx * 2.0, d);
}
float rect(in vec2 p, in vec2 size, in float t) {
    size /= 2.0;
    float d = length(max(abs(p), size - t) - size + t) - t * 2.0;
    return 1.0 - smoothstep(t - rx, t + rx, abs(d));
}