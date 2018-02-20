/* Easing Elastic In equation */
/* Adapted from Robert Penner easing equations */
#define TWO_PI			6.283185307179586
float easeElasticIn(float t) {
    if (t == 0.0) { return 0.0; }
    if (t == 1.0) { return 1.0; }
    float p = 0.3;
    float a = 1.0; 
    float s = p / 4.0;
    return -(a * pow(2.0, 10.0 * (t -= 1.0)) * sin((t - s) * TWO_PI / p));
}