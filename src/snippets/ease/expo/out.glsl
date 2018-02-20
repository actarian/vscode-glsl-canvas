/* Easing Expo Out equation */
/* Adapted from Robert Penner easing equations */
float easeExpoOut(float t) {
    return (t == 1.0) ? 1.0 : (-pow(2.0, -10.0 * t) + 1.0);
}