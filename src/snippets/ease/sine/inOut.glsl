/* Easing Sine InOut equation */
/* Adapted from Robert Penner easing equations */
#define PI				3.141592653589793
float easeSineInOut(float t) {
    return -0.5 * (cos(PI * t) - 1.0);
}