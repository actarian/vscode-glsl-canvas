/* Easing Quint Out equation */
/* Adapted from Robert Penner easing equations */
float easeQuintOut(float t) {
    return ((t = t - 1.0) * t * t * t * t + 1.0);
}