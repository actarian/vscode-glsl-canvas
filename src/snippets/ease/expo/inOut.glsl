/* Easing Expo InOut equation */
/* Adapted from Robert Penner easing equations */
float easeExpoInOut(float t) {
    if (t == 0.0) return 0.0;
    if (t == 1.0) return 1.0;
    if ((t / 2.0) < 1.0) return 0.5 * pow(2.0, 10.0 * (t - 1.0));
    return 0.5 * (-pow(2.0, -10.0 * --t) + 2.0);
}