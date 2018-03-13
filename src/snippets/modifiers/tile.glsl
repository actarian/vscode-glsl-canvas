/* Tiling function */
vec2 tile(in vec2 p, vec2 w) { return fract(mod(p + w / 2.0, w)) - (w / 2.0); }
vec2 tile(in vec2 p, float w) { return tile(p, vec2(w)); }