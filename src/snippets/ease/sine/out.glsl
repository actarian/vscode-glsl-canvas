/* Easing Sine Out equation */
/* Adapted from Robert Penner easing equations */
#define PI_TWO			1.570796326794897
float easeSineOut(float t) {
    return sin(t * PI_TWO);
}