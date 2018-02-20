/* Easing Cubic Out equation */
/* Adapted from Robert Penner easing equations */
float easeCubicOut(float t) {
    return ((t = t - 1.0) * t * t + 1.0);
}