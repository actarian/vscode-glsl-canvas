/* Easing Quint InOut equation */
/* Adapted from Robert Penner easing equations */
float easeQuintInOut(float t) {
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t * t * t + 2.0);
}