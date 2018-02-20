/* Easing Circular Out equation */
/* Adapted from Robert Penner easing equations */
float easeCircularOut(float t) {
    return sqrt(1.0 - (t = t - 1.0) * t);
}