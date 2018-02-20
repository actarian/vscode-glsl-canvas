/* Easing Circular In equation */
/* Adapted from Robert Penner easing equations */
float easeCircularIn(float t) {
    return -1.0 * (sqrt(1.0 - t * t) - 1.0);
}