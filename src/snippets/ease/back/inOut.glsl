/* Easing Back InOut equation */
/* Adapted from Robert Penner easing equations */
float easeBackInOut(float t) {
    float s = 1.70158;
    if ((t / 2.0) < 1.0) return 0.5 * (t * t * (((s *= (1.525)) + 1.0) * t - s));
    return 0.5 * ((t -= 2.0) * t * (((s *= (1.525)) + 1.0) * t + s) + 2.0);
}