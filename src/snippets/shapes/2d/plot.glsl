/* Shape 2D plot */
float plot(vec2 p, float y, float t){
    float d = abs(p.y + y);
    return 1.0 - smoothstep(t / 2.0 - rx, t / 2.0 + rx, d);
}