/* Shape 2D star */
float star(in vec2 p, in float size, in int sides) {    
    float r = 0.5; float s = max(5.0, float(sides)); float m = 0.5 / s; float x = PI_TWO / s * (2.0 - mod(s, 2.0)); 
    float segment = (atan(p.y, p.x) - x) / TWO_PI * s;    
    float a = ((floor(segment) + r) / s + mix(m, -m, step(r, fract(segment)))) * TWO_PI;
    float d = abs(dot(vec2(cos(a + x), sin(a + x)), p)) + m - size / 2.0;
    return 1.0 - smoothstep(0.0, rx * 2.0, d);
}
float star(in vec2 p, in float size, in int sides, float t) {    
    float r = 0.5; float s = max(5.0, float(sides)); float m = 0.5 / s; float x = PI_TWO / s * (2.0 - mod(s, 2.0)); 
    float segment = (atan(p.y, p.x) - x) / TWO_PI * s;    
    float a = ((floor(segment) + r) / s + mix(m, -m, step(r, fract(segment)))) * TWO_PI;
    float d = abs(dot(vec2(cos(a + x), sin(a + x)), p)) + m - size / 2.0;
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(d));
}