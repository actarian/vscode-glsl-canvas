/* Easing Back Out equation */
/* Adapted from Robert Penner easing equations */
float easeBackOut(float t) {
    float s = 1.70158;
    return ((t = t - 1.0) * t * ((s + 1.0) * t + s) + 1.0);
}