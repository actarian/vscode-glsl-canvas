/* Shape 2D poly */
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586
float poly(in vec2 p, in float size, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return 1.0 - smoothstep(size / 2.0 - rx, size / 2.0 + rx, d);
}
float poly(in vec2 p, in float size, in int sides, in float t) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0)) - size / 2.0;
    return 1.0 - smoothstep(t - rx, t + rx, abs(d));
}