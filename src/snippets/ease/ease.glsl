
#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

// Quadratic
float easeQuadIn(float t) {
    return t * t;
}
float easeQuadOut(float t) {
    return -1.0 * t * (t - 2.0);
}
float easeQuadInOut(float t) {
    if ((t / 2.0) < 1.0) return 0.5 * t * t;
    return -0.5 * ((--t) * (t - 2.0) - 1.0);
}

// Cubic
float easeCubicIn(float t) {
    return t * t * t;
}
float easeCubicOut(float t) {
    return ((t = t - 1.0) * t * t + 1.0);
}
float easeCubicInOut(float t) {
    if ((t / 2.0) < 1.0) return 0.5 * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t + 2.0);
}

// Quartic
float easeQuartIn(float t) {
    return t * t * t * t;
}
float easeQuartOut(float t) {
    return -1.0 * ((t = t - 1.0) * t * t * t - 1.0);
}
float easeQuartInOut(float t) {
    if ((t / 2.0) < 1.0) return 0.5 * t * t * t * t;
    return -0.5 * ((t -= 2.0) * t * t * t - 2.0);
}

// Quintic
float easeQuintIn(float t) {
    return t * t * t * t * t;
}
float easeQuintOut(float t) {
    return ((t = t - 1.0) * t * t * t * t + 1.0);
}
float easeQuintInOut(float t) {
    if ((t / 2.0) < 1.0) return 0.5 * t * t * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t * t * t + 2.0);
}

// Exponential
float easeExpoIn(float t) {
    return (t == 0.0) ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}
float easeExpoOut(float t) {
    return (t == 1.0) ? 1.0 : (-pow(2.0, -10.0 * t) + 1.0);
}
float easeExpoInOut(float t) {
    if (t == 0.0) return 0.0;
    if (t == 1.0) return 1.0;
    if ((t / 2.0) < 1.0) return 0.5 * pow(2.0, 10.0 * (t - 1.0));
    return 0.5 * (-pow(2.0, -10.0 * --t) + 2.0);
}

// Sine
float easeSineIn(float t) {
    return -1.0 * cos(t * PI_TWO) + 1.0;
}
float easeSineOut(float t) {
    return sin(t * PI_TWO);
}
float easeSineInOut(float t) {
    return -0.5 * (cos(PI * t) - 1.0);
}

// Circular
float easeCircularIn(float t) {
    return -1.0 * (sqrt(1.0 - t * t) - 1.0);
}
float easeCircularOut(float t) {
    return sqrt(1.0 - (t = t - 1.0) * t);
}
float easeCircularInOut(float t) {
    if ((t / 2.0) < 1.0) return -0.5 * (sqrt(1.0 - t * t) - 1.0);
    return 0.5 * (sqrt(1.0 - (t -= 2.0) * t) + 1.0);
}

// Back
float easexBackIn(float t) {
    float s = 1.70158;
    return t * t * ((s + 1.0) * t - s);
}
float easeBackOut(float t) {
    float s = 1.70158;
    return ((t = t - 1.0) * t * ((s + 1.0) * t + s) + 1.0);
}
float easeBackInOut(float t) {
    float s = 1.70158;
    if ((t / 2.0) < 1.0) return 0.5 * (t * t * (((s *= (1.525)) + 1.0) * t - s));
    return 0.5 * ((t -= 2.0) * t * (((s *= (1.525)) + 1.0) * t + s) + 2.0);
}

// Bounce
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
float easeBounceInOut(float t) {
    if (t < 0.5) return easeBounceIn(t * 2.0) * 0.5;
    else return easeBounceOut(t * 2.0 - 1.0) * 0.5 + 0.5;
}

// Elastic
float easeElasticIn(float t) {
    if (t == 0.0) { return 0.0; }
    if (t == 1.0) { return 1.0; }
    float p = 0.3;
    float a = 1.0; 
    float s = p / 4.0;
    return -(a * pow(2.0, 10.0 * (t -= 1.0)) * sin((t - s) * TWO_PI / p));
}
float easeElasticOut(float t) {
    if (t == 0.0) { return 0.0; }
    if (t == 1.0) { return 1.0; }
    float p = 0.3;
    float a = 1.0; 
    float s = p / 4.0;
    return (a * pow(2.0, -10.0 * t) * sin((t - s) * TWO_PI / p) + 1.0);
}
float easeElasticInOut(float t) {
    if (t == 0.0) { return 0.0; }
    if ((t / 2.0) == 2.0) { return 1.0; }
    float p = (0.3 * 1.5);
    float a = 1.0; 
    float s = p / 4.0;
    if (t < 1.0) {
        return -0.5 * (a * pow(2.0, 10.0 * (t -= 1.0)) * sin((t - s) * TWO_PI / p));
    }
    return a * pow(2.0, -10.0 * (t -= 1.0)) * sin((t - s) * TWO_PI / p) * 0.5 + 1.0;
}

// Quad, Cubic, Quart, Quint, Expo, Sine, Circular, Back, Bounce, Elastic
