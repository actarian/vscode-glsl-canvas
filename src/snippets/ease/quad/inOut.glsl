/* Easing Quad InOut equation */
/* Adapted from Robert Penner easing equations */
float easeQuadInOut(float t) {
    if ((t / 2.0) < 1.0) return 0.5 * t * t;
    return -0.5 * ((--t) * (t - 2.0) - 1.0);
}