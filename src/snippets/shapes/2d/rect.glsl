/* Shape 2D rect */
float sRect(in vec2 p, in vec2 size) {    
    float d = max(abs(p.x / size.x), abs(p.y / size.y)) * 2.0;
    float m = max(size.x, size.y);
    return d * m - m;
}
float rect(in vec2 p, in vec2 size) {
    float d = sRect(p, size);
    return fill(d);
}
float rect(in vec2 p, in vec2 size, in float t) {
    float d = sRect(p, size);
    return stroke(d, t);
}