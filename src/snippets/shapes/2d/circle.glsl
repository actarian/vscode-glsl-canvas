/* Shape 2D circle */

float circle(in vec2 p, in float radius){
    p -= 0.5;
    return 1.0 - smoothstep(
        radius - (radius * 0.01),
        radius + (radius * 0.01),
        dot(p, p) * 4.0
    );
}