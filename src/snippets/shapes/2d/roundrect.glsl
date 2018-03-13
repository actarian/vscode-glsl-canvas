/* Shape 2D roundrect */
float sRoundrect(in vec2 p, in vec2 w, in float corner) {
    vec2 s = w * 0.5 - corner;
    float m = max(s.x, s.y);
    float d = length(max(abs(p) - s, 0.00001)) * m / corner;
    return (d - m) / m * corner * 2.0;
}
float roundrect(in vec2 p, in vec2 w, in float corner) {
    float d = sRoundrect(p, w, corner);
    return fill(d);
}
float roundrect(in vec2 p, in vec2 w, in float corner, in float t) {
    float d = sRoundrect(p, w, corner);
    return stroke(d, t);
}