/* Shape 2D polygon */
#define PI				3.14159265359
#define TWO_PI			6.28318530718

float polygon(vec2 p, int sides) {
    p -= 0.5;
    p *= 30.0;
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(p);
    return smoothstep(0.6, 0.61, d);
}