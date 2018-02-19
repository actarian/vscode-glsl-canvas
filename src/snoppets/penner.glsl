
#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

// t: n, b: 0.0, c: 1.0, d: 1.0	
// t: current time, b: begInnIng value, c: change In value, d: duration	

// linear
float easeLinear (float t, float b, float c, float d) {
    return c * t / d + b;
}

// Quadratic
float easeInQuad(float t, float b, float c, float d) {
    return c * (t /= d) * t + b;
}
float easeOutQuad(float t, float b, float c, float d) {
    return -c * (t /= d) * (t - 2.0) + b;
}
float easeInOutQuad(float t, float b, float c, float d) {
    if ((t /= d / 2.0) < 1.0) return c / 2.0 * t * t + b;
    return -c / 2.0 * ((--t) * (t - 2.0) - 1.0) + b;
}

// Cubic
float easeInCubic(float t, float b, float c, float d) {
    return c * (t /= d) * t * t + b;
}
float easeOutCubic(float t, float b, float c, float d) {
    return c * ((t = t / d - 1.0) * t * t + 1.0) + b;
}
float easeInOutCubic(float t, float b, float c, float d) {
    if ((t /= d / 2.0) < 1.0) return c / 2.0 * t * t * t + b;
    return c / 2.0 * ((t -= 2.0) * t * t + 2.0) + b;
}

// Quartic
float easeInQuart(float t, float b, float c, float d) {
    return c * (t /= d) * t * t * t + b;
}
float easeOutQuart(float t, float b, float c, float d) {
    return -c * ((t = t / d - 1.0) * t * t * t - 1.0) + b;
}
float easeInOutQuart(float t, float b, float c, float d) {
    if ((t /= d / 2.0) < 1.0) return c / 2.0 * t * t * t * t + b;
    return -c / 2.0 * ((t -= 2.0) * t * t * t - 2.0) + b;
}

// Quintic
float easeInQuint(float t, float b, float c, float d) {
    return c * (t /= d) * t * t * t * t + b;
}
float easeOutQuint(float t, float b, float c, float d) {
    return c * ((t = t / d - 1.0) * t * t * t * t + 1.0) + b;
}
float easeInOutQuint(float t, float b, float c, float d) {
    if ((t /= d / 2.0) < 1.0) return c / 2.0 * t * t * t * t * t + b;
    return c / 2.0 * ((t -= 2.0) * t * t * t * t + 2.0) + b;
}

// Exponential
float easeInExpo(float t, float b, float c, float d) {
    return (t == 0.0) ? b : c * pow(2.0, 10.0 * (t / d - 1.0)) + b;
}
float easeOutExpo(float t, float b, float c, float d) {
    return (t == d) ? b + c : c * (-pow(2.0, -10.0 * t / d) + 1.0) + b;
}
float easeInOutExpo(float t, float b, float c, float d) {
    if (t == 0.0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2.0) < 1.0) return c / 2.0 * pow(2.0, 10.0 * (t - 1.0)) + b;
    return c / 2.0 * (-pow(2.0, -10.0 * --t) + 2.0) + b;
}

// Sine
float easeInSine(float t, float b, float c, float d) {
    return -c * cos(t / d * PI_TWO) + c + b;
}
float easeOutSine(float t, float b, float c, float d) {
    return c * sin(t / d * PI_TWO) + b;
}
float easeInOutSine(float t, float b, float c, float d) {
    return -c / 2.0 * (cos(PI*t / d) - 1.0) + b;
}

// Circular
float easeInCircular(float t, float b, float c, float d) {
    return -c * (sqrt(1.0 - (t /= d) * t) - 1.0) + b;
}
float easeOutCircular(float t, float b, float c, float d) {
    return c * sqrt(1.0 - (t = t / d - 1.0) * t) + b;
}
float easeInOutCircular(float t, float b, float c, float d) {
    if ((t /= d / 2.0) < 1.0) return -c / 2.0 * (sqrt(1.0 - t * t) - 1.0) + b;
    return c / 2.0 * (sqrt(1.0 - (t -= 2.0) * t) + 1.0) + b;
}

// Back
float easeInBack(float t, float b, float c, float d) {
    float s = 1.70158;
    return c * (t /= d) * t * ((s + 1.0) * t - s) + b;
}
float easeOutBack(float t, float b, float c, float d) {
    float s = 1.70158;
    return c * ((t = t / d - 1.0) * t * ((s + 1.0) * t + s) + 1.0) + b;
}
float easeInOutBack(float t, float b, float c, float d) {
    float s = 1.70158;
    if ((t /= d / 2.0) < 1.0) return c / 2.0 * (t * t * (((s *= (1.525)) + 1.0) * t - s)) + b;
    return c / 2.0 * ((t -= 2.0) * t * (((s *= (1.525)) + 1.0) * t + s) + 2.0) + b;
}

// Bounce
float easeInBounce(float t, float b, float c, float d) {
    return c - easeOutBounce(d - t, 0.0, c, d) + b;
}
float easeOutBounce(float t, float b, float c, float d) {
    if ((t /= d) < (1.0 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2.0 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    }
}
float easeInOutBounce(float t, float b, float c, float d) {
    if (t < d / 2.0) return easeInBounce(t * 2.0, 0.0, c, d) * 0.5 + b;
    else return easeOutBounce(t * 2.0 - d, 0.0, c, d) * 0.5 + c * 0.5 + b;
}

// Elastic
float easeInElastic(float t, float b, float c, float d, float a=undefined, float p=undefined) {
    float s;
    if (t == 0.0) return b; if ((t /= d) == 1.0) return b + c; if (!p) p = d * 0.3;
    if (!a || a < abs(c)) { a = c; s = p / 4.0; }
    else s = p / TWO_PI * asin (c / a);
    return -(a * pow(2.0, 10.0 * (t -= 1.0)) * sin( (t * d - s) * TWO_PI / p )) + b;
}
float easeOutElastic(float t, float b, float c, float d, float a=undefined, float p=undefined) {
    float s;
    if (t == 0.0) return b; if ((t /= d) == 1.0) return b + c; if (!p) p = d * 0.3;
    if (!a || a < abs(c)) { a = c; s = p / 4.0; }
    else s = p / TWO_PI * asin (c / a);
    return (a * pow(2.0, -10.0 * t) * sin( (t * d - s) * TWO_PI / p ) + c + b);
}
float easeInOutElastic(float t, float b, float c, float d, float a=undefined, float p=undefined) {
    float s;
    if (t == 0.0) return b; if ((t /= d / 2.0) == 2.0) return b + c; if (!p) p = d * (0.3 * 1.5);
    if (!a || a < abs(c)) { a = c; s = p / 4.0; }
    else s = p / TWO_PI * asin (c / a);
    if (t < 1.0) return -0.5 * (a * pow(2.0, 10.0 * (t -= 1.0)) * sin( (t * d - s) * TWO_PI / p )) + b;
    return a * pow(2.0, -10.0 * (t -= 1.0)) * sin( (t * d - s) * TWO_PI / p ) * 0.5 + c + b;
}

// Quad, Cubic, Quart, Quint, Expo, Sine, Circular, Back, Bounce, Elastic
