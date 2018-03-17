// Author: Luca Zampetti
// Title: vscode-glsl-canvas Playgrounds

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture_0;   
uniform vec2 u_trails[10];

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(1.0, 0.0, 0.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
#define BLUE            vec3(0.0, 0.0, 1.0)
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#define uv gl_FragCoord.xy / u_resolution.xy
#define st coord(gl_FragCoord.xy)
#define mx coord(u_mouse)
#define rx 1.0 / min(u_resolution.x, u_resolution.y)
vec2 pos(in float x, in float y) { return st + vec2(x * rx, y * rx); }
vec2 pos(in float x) { return pos(x, x); }
vec2 pos(in vec2 p) { return pos(p.x, p.y); }
float size(in float x) { return x * rx; }
vec2 size(in float x, in float y) { return vec2(x * rx, y * rx); }

vec2 tile(in vec2 p, vec2 w) { return fract(mod(p + w / 2.0, w)) - (w / 2.0); }
vec2 tile(in vec2 p, float w) { return tile(p, vec2(w)); }

float fill(in float d) { return 1.0 - smoothstep(0.0, rx * 2.0, d); }
float stroke(in float d, in float t) { return 1.0 - smoothstep(t - rx * 1.5, t + rx * 1.5, abs(d)); }
vec3 draw(in sampler2D t, in vec2 pos, in vec2 w) { vec2 s = w / 1.0; s.x *= -1.0; return texture2D(t, pos / s + 0.5).rgb; }
// field adapted from https://www.shadertoy.com/view/XsyGRW
vec3 field(float d) {
    const vec3 c1 = mix(WHITE, YELLOW, 0.4);
    const vec3 c2 = mix(WHITE, AZUR, 0.7);
    const vec3 c3 = mix(WHITE, ORANGE, 0.9);
    const vec3 c4 = BLACK;
    float d0 = abs(stroke(mod(d + 0.1, 0.2) - 0.1, 0.004));
    float d1 = abs(stroke(mod(d + 0.025, 0.05) - 0.025, 0.004));
    float d2 = abs(stroke(d, 0.004));
    float f = clamp(d * 0.85, 0.0, 1.0);
    vec3 gradient = mix(c1, c2, f);
    gradient = mix(gradient, c4, 1.0 - clamp(1.25 - d * 0.25, 0.0, 1.0));
    // gradient -= 1.0 - clamp(1.25 - d * 0.25, 0.0, 1.0);          
    gradient = mix(gradient, c3, fill(d));
    gradient = mix(gradient, c4, max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)) * clamp(1.25 - d, 0.0, 1.0));
    return gradient;
}

mat2 rotate2d(float a){
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

/* Blending function */
/* Smoothmin functions by Inigo Quilez */
float sBlendExpo(float a, float b, float k) {
    float res = exp(-k * a) + exp(-k * b);
    return -log(res) / k;
}
float sBlendPoly(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}
float sBlendPower(float a, float b, float k) {
    a = pow(a, k); b = pow(b, k);
    return pow((a * b) / (a + b), 1.0 / k);
}

/* Boolean functions */
float sUnion(float a, float b) {
    return min(a, b);
}
float sIntersect(float a, float b) {
    return max(a, b);
}
float sDifference(float a, float b) {
    return max(a, -b);
}

float sArc(in vec2 p, in float w, in float s, in float e) {    
    float a = distance(p, w * 0.5 * vec2(cos(s), sin(s)));
    float x = -PI;
    p *= mat2(cos(x - s), -sin(x - s), sin(x - s), cos(x - s));
    float b = clamp(atan(p.y, p.x), x, x + e);
    b = distance(p, w * 0.5 * vec2(cos(b), sin(b)));
    return min(a, b) * 2.0;
}
float arc(in vec2 p, in float w, in float s, in float e, in float t) {
    float d = sArc(p, w, s, e);
    return stroke(d, t);
}

float sCircle(in vec2 p, in float w) {
    return length(p) * 2.0 - w;
}
float circle(in vec2 p, in float w) {
    float d = sCircle(p, w);
    return fill(d);
}
float circle(in vec2 p, in float w, float t) {
    float d = sCircle(p, w);
    return stroke(d, t);
}

float sHex(in vec2 p, in float w) {
    vec2 q = abs(p);
    float d = max((q.x * 0.866025 + q.y * 0.5), q.y) - w * 0.5; // * 0.4330125
    return d * 2.0;
}
float hex(in vec2 p, in float w) {    
    float d = sHex(p, w);
    return fill(d);
}
float hex(in vec2 p, in float w, in float t) {
    float d = sHex(p, w);
    return stroke(d, t);    
}

float sLine(in vec2 a, in vec2 b) {
    vec2 p = b - a;
    float d = abs(dot(normalize(vec2(p.y, -p.x)), a));
    return d * 2.0;
}
float line(in vec2 a, in vec2 b) {
    float d = sLine(a, b);
    return fill(d);
}
float line(in vec2 a, in vec2 b, in float t) {
    float d = sLine(a, b);
    return stroke(d, t);
}
float line(in vec2 p, in float a, in float t) {
    vec2 b = p + vec2(sin(a), cos(a));
    return line(p, b, t);
}

float sPie(in vec2 p, in float w, in float s, in float e) {
    s = mod(s, TWO_PI);
    e = mod(s + e, TWO_PI);
    float a = mod(atan(p.y, p.x), TWO_PI);
    a = abs(step(s, a) - step(e, a));
    a = s < e ? a : 1.0 - a;
    float d = length(p);
    return 1.0 - (a - d * 2.0) - w;
}
float pie(in vec2 p, in float w, in float s, in float e) {    
    float d = sPie(p, w, s, e);
    return fill(d);
}
float pie(in vec2 p, in float w, in float s, in float e, in float t) {
    float d = sPie(p, w, s, e);
    return stroke(d, t);    
}

float sPlot(vec2 p, float y){
    return p.y + y;
}
float plot(vec2 p, float y, float t) {
    float d = sPlot(p, y);
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, abs(d));
}

float sPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}
float poly(in vec2 p, in float w, in int sides) {
    float d = sPoly(p, w, sides);
    return fill(d);
}
float poly(in vec2 p, in float w, in int sides, in float t) {
    float d = sPoly(p, w, sides);
    return stroke(d, t);
}

float sRect(in vec2 p, in vec2 w) {    
    float d = max(abs(p.x / w.x), abs(p.y / w.y)) * 2.0;
    float m = max(w.x, w.y);
    return d * m - m;
}
float rect(in vec2 p, in vec2 w) {
    float d = sRect(p, w);
    return fill(d);
}
float rect(in vec2 p, in vec2 w, in float t) {
    float d = sRect(p, w);
    return stroke(d, t);
}

float sRoundrect(in vec2 p, in vec2 w, in float corner) {
    vec2 d = abs(p) - w * 0.5 + corner;
    return (min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - corner) * 2.0;
}
float roundrect(in vec2 p, in vec2 w, in float corner) {
    float d = sRoundrect(p, w, corner);
    return fill(d);
}
float roundrect(in vec2 p, in vec2 w, in float corner, in float t) {
    float d = sRoundrect(p, w, corner);
    return stroke(d, t);
}

float sSegment(in vec2 a, in vec2 b) {
    vec2 ba = a - b;
    float d = clamp(dot(a, ba) / dot(ba, ba), 0.0, 1.0);
    return length(a - ba * d) * 2.0;
}
float segment(in vec2 a, in vec2 b, float t) {
    float d = sSegment(a, b);
    return stroke(d, t);
}

float sSpiral(in vec2 p, in float turns) {
    float r = dot(p, p);
    float a = atan(p.y, p.x);
    float d = abs(sin(fract(log(r) * (turns / 5.0) + a * 0.159)));
    return d - 0.5;
}
float spiral(in vec2 p, in float turns) {    
    float d = sSpiral(p, turns);
    return fill(d);
}

float sStar(in vec2 p, in float w, in int sides) {    
    float r = 0.5; float s = max(5.0, float(sides)); float m = 0.5 / s; float x = PI_TWO / s * (2.0 - mod(s, 2.0)); 
    float segment = (atan(p.y, p.x) - x) / TWO_PI * s;    
    float a = ((floor(segment) + r) / s + mix(m, -m, step(r, fract(segment)))) * TWO_PI;
    float d = abs(dot(vec2(cos(a + x), sin(a + x)), p)) + m;
    return (d - rx) * 2.0 - w;
}
float star(in vec2 p, in float w, in int sides) {
    float d = sStar(p, w, sides);
    return fill(d);
}
float star(in vec2 p, in float w, in int sides, float t) {    
    float d = sStar(p, w, sides);
    return stroke(d, t);
}

float grid(in vec2 p, in float w) {
    vec2 l = tile(p, w);
    float d = 0.0;
    d += line(l, l + vec2(0.0, 0.1), 0.002);
    d += line(l, l + vec2(0.1, 0.0), 0.002);
    d *= 0.2;
    p = tile(p, vec2(w * 5.0));
    float s = w / 10.0;
    float g = 0.0;
    g += segment(p + vec2(-s, 0.0), p + vec2(s, 0.0), 0.004);
    g += segment(p + vec2(0.0, -s), p + vec2(0.0, s), 0.004);
    return d + g;
}

// Easing Equations adapted from Robert Penner easing functions.
// Back, Bounce, Circular, Cubic, Elastic, Expo, Quad, Quart, Quint, Sine

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
    t *= 2.0; float s = 1.70158;
    if (t < 1.0) return 0.5 * (t * t * (((s *= (1.525)) + 1.0) * t - s));
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
// Circular
float easeCircularIn(float t) {
    return -1.0 * (sqrt(1.0 - t * t) - 1.0);
}
float easeCircularOut(float t) {
    return sqrt(1.0 - (t = t - 1.0) * t);
}
float easeCircularInOut(float t) {
    t = t * 2.0; if ((t) < 1.0) return -0.5 * (sqrt(1.0 - t * t) - 1.0);
    return 0.5 * (sqrt(1.0 - (t -= 2.0) * t) + 1.0);
}
// Cubic
float easeCubicIn(float t) {
    return t * t * t;
}
float easeCubicOut(float t) {
    return ((t = t - 1.0) * t * t + 1.0);
}
float easeCubicInOut(float t) {
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t + 2.0);
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
    t = t * 2.0;
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
// Exponential
float easeExpoIn(float t) {
    return (t == 0.0) ? 0.0 : pow(2.0, 10.0 * (t - 1.0));
}
float easeExpoOut(float t) {
    return (t == 1.0) ? 1.0 : (-pow(2.0, -10.0 * t) + 1.0);
}
float easeExpoInOut(float t) {
    t = t * 2.0;
    if (t == 0.0) return 0.0;
    if (t == 1.0) return 1.0;
    if (t < 1.0) return 0.5 * pow(2.0, 10.0 * (t - 1.0));
    return 0.5 * (-pow(2.0, -10.0 * --t) + 2.0);
}
// Quadratic
float easeQuadIn(float t) {
    return t * t;
}
float easeQuadOut(float t) {
    return -1.0 * t * (t - 2.0);
}
float easeQuadInOut(float t) {
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t;
    return -0.5 * ((--t) * (t - 2.0) - 1.0);
}
// Quartic
float easeQuartIn(float t) {
    return t * t * t * t;
}
float easeQuartOut(float t) {
    return -1.0 * ((t = t - 1.0) * t * t * t - 1.0);
}
float easeQuartInOut(float t) {
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t * t;
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
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t * t * t + 2.0);
}
// Sine
float easeSineIn(float t) {
    return -1.0 * cos(t * PI_TWO) + 1.0;
}
float easeSineOut(float t) {
    return sin(t * PI_TWO);
}
float easeSineInOut(float t) {
    return -0.5 * (cos(PI * t * 2.0) - 1.0);
}

struct Object { float distance; vec3 color; };
Object object = Object(0.0, vec3(0.0));

struct Animation { float time; float pow; };
Animation animation = Animation(0.0, 0.0);
void totalTime(in float t, in float offset) { animation.time = mod(u_time + offset, t); }
void totalTime(in float t) { totalTime(t, 0.0); }
bool between(in float duration, in float offset) {
    float p = (animation.time - offset) / duration;
    animation.pow = p;
    animation.time -= (duration + offset);
    return (p >= 0.0 && p <= 1.0);
}
bool between(in float duration) {
    return between(duration, 0.0);
} 
