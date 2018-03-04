/* Shape 2D pie */
#define TWO_PI			6.283185307179586
float pie(in vec2 p, in float s, in float e, in float size) {
    s = mod(s, TWO_PI);
    e = mod(s + e, TWO_PI);
    float a = mod(atan(p.y, p.x), TWO_PI);
    a = abs(step(s, a) - step(e, a));
    a = s < e ? a : 1.0 - a;
    float d = length(p);
    d = smoothstep(d - rx, d + rx, size / 2.0 * a);
    return d;
}
float pie(in vec2 p, in float s, in float e, in float size, in float t) {
    s = mod(s, TWO_PI);
    e = mod(s + e, TWO_PI);
    float a = mod(atan(p.y, p.x), TWO_PI);
    a = abs(step(s, a) - step(e, a));
    a = s < e ? a : 1.0 - a;
    float d = length(p * a) - size / 2.0;
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(d));
}