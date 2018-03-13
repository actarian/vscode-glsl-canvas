/* Shape 2D hexagon */
float sHex(in vec2 p, in float w) {
    vec2 q = abs(p);
    float d = max((q.x * 0.866025 + q.y * 0.5), q.y) - w * 0.5; // * 0.4330125
    return d * 2.0;
}
float hex(in vec2 p, in float w) {    
    float d = sHex(p, w);
    return fill(d);
}
float hex(in vec2 p, in float w, in float t) {
    float d = sHex(p, w);
    return stroke(d, t);    
}