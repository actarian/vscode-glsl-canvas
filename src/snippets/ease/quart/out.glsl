/* Easing Quart Out equation */
/* Adapted from Robert Penner easing equations */
float easeQuartOut(float t) {
    return -1.0 * ((t = t - 1.0) * t * t * t - 1.0);
}