/* Shape 2D Box */

float box(in vec2 p, in vec2 size){
    size = vec2(0.5) - size * 0.5;
    vec2 uv = smoothstep(
        size,
        size + vec2(0.001),
        p
    );
    uv *= smoothstep(
        size,
        size + vec2(0.001),
        vec2(1.0) - p
    );
    return uv.x * uv.y;
}