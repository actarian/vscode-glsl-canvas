/* Normalized mouse coordinates returns a vec2 */
vec2 mx() {
	return -1.0 + u_mouse / u_resolution.xy * 2.0;
}