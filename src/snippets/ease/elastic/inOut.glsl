/* Easing Elastic InOut equation */
/* Adapted from Robert Penner easing equations */
#define TWO_PI			6.283185307179586
float easeElasticInOut(float t) {
    t = t * 2.0;
    if (t == 0.0) { return 0.0; }
    if ((t / 2.0) == 2.0) { return 1.0; }
    float p = (0.3 * 1.5);
    float a = 1.0; 
    float s = p / 4.0;
    if (t < 1.0) {
        return -0.5 * (a * pow(2.0, 10.0 * (t -= 1.0)) * sin((t - s) * TWO_PI / p));
    }
    return a * pow(2.0, -10.0 * (t -= 1.0)) * sin((t - s) * TWO_PI / p) * 0.5 + 1.0;
}