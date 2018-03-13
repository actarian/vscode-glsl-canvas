/* Pixel unit conversion function */
vec2 pos(in float x, in float y) { return st + vec2(x * rx, y * rx); }
vec2 pos(in float x) { return pos(x, x); }
vec2 pos(in vec2 p) { return pos(p.x, p.y); }
float size(in float x) { return x * rx; }
vec2 size(in float x, in float y) { return vec2(x * rx, y * rx); }