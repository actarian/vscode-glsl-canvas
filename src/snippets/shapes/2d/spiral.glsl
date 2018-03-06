/* Shape 2D spiral */
float spiral(in vec2 p, in float turn) {    
    float r = dot(p, p);
    float a = atan(p.y, p.x);
    float d = abs(sin(fract(log(r) * (turn / 5.0) + a * 0.159)));
    return 1.0 - smoothstep(0.5 - rx, 0.5 + rx, d);
}