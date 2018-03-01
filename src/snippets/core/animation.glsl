/* Staggered animation */
struct Animation { float time; float pow; };
Animation animation = Animation(0.0, 0.0);
void totalTime(in float t, in float d) { animation.time = mod(u_time + d, t); }
void totalTime(in float t) { totalTime(t, 0.0); }
bool between(in float duration) {
    float p = animation.time / duration;
    animation.pow = p;
    animation.time -= duration;
    return (p >= 0.0 && p <= 1.0);
}