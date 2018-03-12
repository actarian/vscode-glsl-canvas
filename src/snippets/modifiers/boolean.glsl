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