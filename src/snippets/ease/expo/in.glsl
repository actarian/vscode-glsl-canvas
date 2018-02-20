/* Easing Expo In equation */
/* Adapted from Robert Penner easing equations */
float easeExpoIn(float t) {
    return (t == 0.0) ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}