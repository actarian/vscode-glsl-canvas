/* Easing Sine In equation */
/* Adapted from Robert Penner easing equations */
#define PI_TWO			1.570796326794897
float easeSineIn(float t) {
    return -1.0 * cos(t * PI_TWO) + 1.0;
}