/* Shape 2D arc */
#define TWO_PI			6.283185307179586
float pi = atan(1.0) * 4.0;
float tau = atan(1.0) * 8.0;
float arc(in vec2 p, in float s, in float e, in float size) {
    s = mod(s, TWO_PI);
    e = mod(s + e, TWO_PI);
    float a = mod(atan(p.y, p.x), TWO_PI);
    a = abs(step(s, a) - step(e, a));
    a = s < e ? a : 1.0 - a;
    float d = length(p);
    d = smoothstep(d - rx, d + rx, size / 2.0 * a);
    return d;
}
float arc(in vec2 p, in float s, in float e, in float size, in float t) {
    e += s;
    float o = (s / 2.0 + e / 2.0 - pi);
	float a = mod(atan(p.y, p.x) - o, tau) + o;
	a = clamp(a, min(s, e), max(s, e));
	float d = distance(p, size / 2.0 * vec2(cos(a), sin(a)));
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(d));
}