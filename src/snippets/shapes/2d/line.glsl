/* Shape 2D line */
float line(in vec2 a, in vec2 b, float size) {
    vec2 ba = a - b;
    float d = clamp(dot(a, ba) / dot(ba, ba), 0.0, 1.0);
    d = length(a - ba * d);
    return smoothstep(size + rx, size - rx, d);
}