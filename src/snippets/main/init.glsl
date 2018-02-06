/* Main function initializer */

#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI				3.14159265359
#define TWO_PI			6.28318530718
#define RAD				0.01745329251
#define EPSILON			0.001

vec2 st() {
	vec2 st = gl_FragCoord.xy / u_resolution.xy;
	st.y *= u_resolution.y / u_resolution.x;
	st.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
	return st;
}

vec2 uv(vec2 st) {
	vec2 uv = -1.0 + st * 2.0;
	return uv;
}

vec2 mx() {
	return -1.0 + u_mouse / u_resolution.xy * 2.0;
}

void main() {
    vec2 st = st();
    vec2 mx = mx();

    vec3 color = vec3(
        abs(cos(st.x + mx.x)), 
        abs(sin(st.y + mx.y)), 
        abs(sin(u_time))
    );

    gl_FragColor = vec4(color, 1.0);
}