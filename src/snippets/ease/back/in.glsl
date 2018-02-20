/* Easing Back In equation */
/* Adapted from Robert Penner easing equations */
float easeBackIn(float t) {
    float s = 1.70158;
    return t * t * ((s + 1.0) * t - s);
}