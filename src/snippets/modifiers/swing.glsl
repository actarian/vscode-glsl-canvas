/* Swing function */
float swing (float size) { return (1.0 + cos(u_time)) / 2.0 * pix(size); }
vec2 swing (in float x, in float y) { return (1.0 + cos(u_time)) / 2.0 * pix(x, y); }