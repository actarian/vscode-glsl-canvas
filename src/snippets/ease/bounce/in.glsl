/* Easing Bounce In equation */
/* Adapted from Robert Penner easing equations */
float easeBounceOut(float t) {
    if (t < (1.0 / 2.75)) {
        return (7.5625 * t * t);
    } else if (t < (2.0 / 2.75)) {
        return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
    } else if (t < (2.5 / 2.75)) {
        return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
    } else {
        return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
    }
}
float easeBounceIn(float t) {
    return 1.0 - easeBounceOut(1.0 - t);
}