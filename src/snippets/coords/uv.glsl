/* Normalized uv coordinates returns a vec2 */
vec2 uv(vec2 st) {
	vec2 uv = -1.0 + st * 2.0;
	return uv;
}