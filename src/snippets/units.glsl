/* Pixel units conversion */
vec2 pos(in float x, in float y) { return st + vec2(x * rx, y * rx); }
vec2 pos(in float x) { return pos(x, x); }
vec2 pos(in vec2 p) { return pos(p.x, p.y); }
float pix(in float x) { return x * rx; }
vec2 pix(in float x, in float y) { return vec2(x * rx, y * rx); }