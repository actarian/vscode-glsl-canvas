/* Tween float and vec */
float tween(float a, float b, float v) { return a + (b - a) * v; }
vec2 tween(vec2 a, vec2 b, float v) { return a + (b - a) * v; }
vec3 tween(vec3 a, vec3 b, float v) { return a + (b - a) * v; }
vec4 tween(vec4 a, vec4 b, float v) { return a + (b - a) * v; }