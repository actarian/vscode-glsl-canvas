// Author: Luca Zampetti
// Title: vscode-glsl-canvas Animation examples

void main() {
    vec2 p = st; float v = 0.0; float v2 = 0.0;
    
    totalTime(12.0);
    if (between(0.5)) {
        v = easeElasticOut(animation.pow);
        object.distance = circle(p, 0.1 + 0.1 * v);
    }
    if (between(0.5, -0.25)) {
        v = easeElasticOut(animation.pow);
        object.distance = rect(p * rotate2d(PI_TWO / 2.0 * v), vec2(0.3), 0.04);
    }
    if (between(0.25, -0.25)) {
        object.distance = circle(p, 0.2 + 1.3 * animation.pow, 0.1) * (1.0 - animation.pow);
    }
    if (between(0.5, 0.25)) {
        v = easeElasticOut(animation.pow);
        object.distance = line(p, 0.0, 0.5 * v);
    }
    if (between(0.25)) {
        v = easeSineOut(animation.pow);
        object.distance = line(p, PI_TWO / 2.0 * v, 0.5);
    }
    if (between(0.5)) {
        v = easeBounceOut(animation.pow);
        object.distance = line(p, PI_TWO / 2.0, 0.5 * (1.0 - v));
    }
    if (between(1.0, 0.25)) {
        v = easeQuintOut(animation.pow);
        v2 = easeQuintIn(animation.pow);
        object.distance = segment(p + vec2(mix(-0.5, 0.5, v), 0.0), st + vec2(mix(-0.5, 0.5, v2), 0.0), 0.004);
    }
    if (between(1.0, -0.8)) {
        v = easeQuintOut(animation.pow);
        v2 = easeQuintIn(animation.pow);
        object.distance += segment(p + vec2(mix(-0.5, 0.5, v), -0.1), st + vec2(mix(-0.5, 0.5, v2), -0.1), 0.008);
    }
    if (between(1.0, -0.6)) {
        v = easeQuintOut(animation.pow);
        v2 = easeQuintIn(animation.pow);
        object.distance += segment(p + vec2(mix(-0.5, 0.5, v), 0.1), st + vec2(mix(-0.5, 0.5, v2), 0.1), 0.012);
    }
    if (between(1.0, 0.25)) {
        v = easeBounceOut(animation.pow);
        object.distance = circle(p + vec2(0.0, mix(-0.3, 0.3, v)), 0.2, 0.02);
    }
    if (between(0.5)) {
        v = easeSineOut(animation.pow);
        object.distance = circle(p + vec2(0.3 * cos(PI_TWO + v * 2.0 * PI), 0.3 * sin(PI_TWO + v * 2.0 * PI)), 0.2, 0.02);
    }
    if (between(1.0)) {
        v = easeElasticOut(animation.pow);
        object.distance = circle(p + vec2(0.0, mix(0.3, 0.0, v)), 0.2 + 0.4 * v, 0.02 + 0.06 * v);
    }
    if (between(0.15)) {
        v = easeSineOut(animation.pow);
        object.distance = circle(p, 0.6 - 0.5 * v, 0.08) * (1.0 - v);
    }
    if (between(0.5)) {
        v = easeElasticOut(animation.pow);
        object.distance = poly(p * rotate2d(PI), 0.1 + 0.2 * v, 3, 0.06);
    }
    if (between(0.35)) {
        v = easeCircularOut(animation.pow);
        object.distance = poly(p * rotate2d(PI) + vec2(0.0, mix(0.6, 0.0, v)), 0.1, 3, 0.02);
    }
    if (between(0.35)) {
        v = easeCircularIn(animation.pow);
        object.distance = poly(p * rotate2d(PI) + vec2(0.0, mix(0.0, -0.6, v)), 0.1, 3, 0.02);
    }
    if (between(1.0, 0.25)) {
        v = easeQuintOut(animation.pow);
        v2 = easeQuintIn(animation.pow);
        object.distance = segment(p + vec2(0.0, mix(-0.5, 0.5, v)), st + vec2(0.0, mix(-0.5, 0.5, v2)), 0.004);
    }
    if (between(1.0, -0.8)) {
        v = easeQuintOut(animation.pow);
        v2 = easeQuintIn(animation.pow);
        object.distance += segment(p + vec2(-0.1, mix(-0.5, 0.5, v)), st + vec2(-0.1, mix(-0.5, 0.5, v2)), 0.008);
    }
    if (between(1.0, -0.6)) {
        v = easeQuintOut(animation.pow);
        v2 = easeQuintIn(animation.pow);
        object.distance += segment(p + vec2(0.1, mix(-0.5, 0.5, v)), st + vec2(0.1, mix(-0.5, 0.5, v2)), 0.012);
    }
    if (between(1.0)) {
        v = easeCircularIn(animation.pow);
        object.distance = star(p, 0.5, 6 + int((1.0 - animation.pow) * 44.0), 0.04);
    }
    if (between(0.5)) {
        v = easeCircularIn(animation.pow);
        object.distance = star(p + vec2(0.0, mix(0.0, 0.5, v)), 0.5, 6, 0.04) * (1.0 - animation.pow);
    }

    vec3 color = AZUR;
    object.color = WHITE;
    color = mix(color, object.color, object.distance);

    gl_FragColor = vec4(color, 1.0);
}