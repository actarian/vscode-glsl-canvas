/* Shape 2D pie */
float sPie(in vec2 p, in float size, in float s, in float e) {
    s = mod(s, TWO_PI);
    e = mod(s + e, TWO_PI);
    float a = mod(atan(p.y, p.x), TWO_PI);
    a = abs(step(s, a) - step(e, a));
    a = s < e ? a : 1.0 - a;
    float d = length(p);
    return 1.0 - (a - d * 2.0) - size;
}
float pie(in vec2 p, in float size, in float s, in float e) {    
    float d = sPie(p, size, s, e);
    return fill(d);
}
float pie(in vec2 p, in float size, in float s, in float e, in float t) {
    float d = sPie(p, size, s, e);
    return stroke(d, t);    
}