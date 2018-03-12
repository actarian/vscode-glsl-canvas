/* Shape 2D arc */
float sArc(in vec2 p, in float size, in float s, in float e) {
    e += s;
    float o = (s + e - PI);
	float a = mod(atan(p.y, p.x) - o, TWO_PI) + o;
	a = clamp(a, min(s, e), max(s, e));
    vec2 r = vec2(cos(a), sin(a));
	float d = distance(p, size * 0.5 * r);
    return d * 2.0;
}
float arc(in vec2 p, in float size, in float s, in float e, in float t) {
    float d = sArc(p, size, s, e);
    return stroke(d, t);
}