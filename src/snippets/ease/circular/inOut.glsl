/* Easing Circular InOut equation */
/* Adapted from Robert Penner easing equations */
float easeCircularInOut(float t) {
    t = t * 2.0; if ((t) < 1.0) return -0.5 * (sqrt(1.0 - t * t) - 1.0);
    return 0.5 * (sqrt(1.0 - (t -= 2.0) * t) + 1.0);
}