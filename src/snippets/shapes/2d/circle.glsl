/* Shape 2D circle */
float sCircle(in vec2 p, in float size) {
    return length(p) * 2.0 - size;
}
float circle(in vec2 p, in float size) {
    float d = sCircle(p, size);
    return fill(d);
}
float circle(in vec2 p, in float size, float t) {
    float d = sCircle(p, size);
    return stroke(d, t);
}