// Author: Luca Zampetti
// Title: vscode-glsl-canvas Easing examples

void main() {           
    vec2 p = st * 1.2;
    float s = 1.0; float s2 = s / 2.0; float x = 0.5 - p.x;
    float t = fract(u_time * 0.5);

    float v = t; float y = x;
    // v = easexBackIn(t); y = easexBackIn(x);
    // v = easeBackOut(t); y = easeBackOut(x);
    // v = easeBackInOut(t); y = easeBackInOut(x);
    // v = easeBounceOut(t); y = easeBounceOut(x);
    // v = easeBounceIn(t); y = easeBounceIn(x);
    // v = easeBounceInOut(t); y = easeBounceInOut(x);
    // v = easeCircularIn(t); y = easeCircularIn(x);
    // v = easeCircularOut(t); y = easeCircularOut(x);
    // v = easeCircularInOut(t); y = easeCircularInOut(x);
    // v = easeCubicIn(t); y = easeCubicIn(x);
    // v = easeCubicOut(t); y = easeCubicOut(x);
    // v = easeCubicInOut(t); y = easeCubicInOut(x);
    // v = easeElasticIn(t); y = easeElasticIn(x);
    // v = easeElasticOut(t); y = easeElasticOut(x);
    // v = easeElasticInOut(t); y = easeElasticInOut(x);
    // v = easeExpoIn(t); y = easeExpoIn(x);
    // v = easeExpoOut(t); y = easeExpoOut(x);
    // v = easeExpoInOut(t); y = easeExpoInOut(x);
    // v = easeQuadIn(t); y = easeQuadIn(x);
    // v = easeQuadOut(t); y = easeQuadOut(x);
    // v = easeQuadInOut(t); y = easeQuadInOut(x);
    // v = easeQuartIn(t); y = easeQuartIn(x);
    // v = easeQuartOut(t); y = easeQuartOut(x);
    // v = easeQuartInOut(t); y = easeQuartInOut(x);
    // v = easeQuintIn(t); y = easeQuintIn(x);
    // v = easeQuintOut(t); y = easeQuintOut(x);
    // v = easeQuintInOut(t); y = easeQuintInOut(x);
    // v = easeSineIn(t); y = easeSineIn(x);
    // v = easeSineOut(t); y = easeSineOut(x);
    // v = easeSineInOut(t); y = easeSineInOut(x);

    vec3 color = AZUR;

    color = mix(color, BLACK, grid(p, 0.1));
    
    float d = plot(p, y - s2, 0.008);
    color = mix(color, WHITE, d * 0.5);

    vec2 c = vec2(t, v);
    d = 0.0;
    d += segment(p - vec2(s2, s2 + 0.01), p + vec2(-s2, s2 + 0.01), 0.004);
    d += segment(p + vec2(-s2 - 0.01, s2), p + vec2(s2 + 0.01, s2), 0.004);
    color = mix(color, BLACK, d * 0.3);
    
    d = circle(p - 0.5 + c, 0.04);
    color = mix(color, BLACK, d);
    
    gl_FragColor = vec4(color, 1.0);
}