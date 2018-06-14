
// #define OCCLUSION
// #define OCCLUSION_

#define CAMERA_FOV      	0.90
#define CAMERA_NEAR     	0.000001
#define CAMERA_FAR      	1000.0

#define MARCHER_STEPS		128	

vec2 getUv() {
	vec2 xy = gl_FragCoord.xy / u_resolution.xy;
	if (u_resolution.x > u_resolution.y) {
        xy.x *= u_resolution.x / u_resolution.y;
        xy.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        xy.y *= u_resolution.y / u_resolution.x;
	    xy.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
	xy -= 0.5;
	return xy;
}

mat4 rotationAxis(float angle, vec3 axis) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
vec3 pRotate(vec3 p) {
    mat4 matrix = rotationAxis(
        RAD * 360.0 * u_time * 0.2 + st.x * st.y, 
        vec3(0.0, 1.0, 0.0)
    );
    return p = (vec4(p, 1.0) * matrix).xyz;
}
float vmax(vec3 v) {
	return max(max(v.x, v.y), v.z);
}
float sBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
}

int materialId = -1;
struct Material {
	vec3 color;
	float ambient;
	float glossiness;
	float shininess;
};
Material getMaterial(int m) {
	Material material;
		material = Material(
			WHITE, // color
			0.8, // ambient,
			0.5, // glossiness
			1.0 // shininess
		);
	return material;
}

float scene(vec3 p) {
	float 	 z = 1000000.0
			,a = sBox(pRotate(p), vec3(1.0));
    materialId = 1;
	return a;
}
vec3 getNormal(in vec3 p) {
    float ref = scene(p);
	return normalize(vec3(
		scene(vec3(p.x + EPSILON, p.y, p.z)) - ref,
		scene(vec3(p.x, p.y + EPSILON, p.z)) - ref,
		scene(vec3(p.x, p.y, p.z + EPSILON)) - ref
	));
}

struct Camera {
    vec3 position;
    vec3 target;
    vec3 forward;
    vec3 right;
    vec3 up;
    float fov;
	float near;
	float far;
};
Camera getCamera(vec3 position, vec3 target) {
    vec3 forward = normalize(target - position);
    vec3 right = vec3(0.0);
    vec3 up = vec3(0.0);
	Camera camera = Camera(position, target, forward, right, up, CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR);
	camera.right = normalize(vec3(camera.forward.z, 0.0, -camera.forward.x));
	camera.up = normalize(cross(camera.forward, camera.right));
	return camera;
}

struct Marcher {
    vec3 origin;
    vec3 direction;
	float scale;
	float threshold;
	float distance;
	float depth;
};
Marcher getMarcher(Camera camera) {
	const float scale = 0.5;
	const float threshold = 0.001; 
	vec2 xy = getUv();
	Marcher marcher = Marcher(
		camera.position,
		normalize(
            camera.forward + 
            (camera.fov * camera.right * xy.x) + 
            (camera.fov * camera.up * xy.y)
        ),
		scale,
		threshold,
		0.0,
		0.0
	);	
	return marcher;
}

struct Surface {
    vec3 position;
    vec3 normal;
	vec3 rgb;
};
Surface getSurface(Marcher marcher) {
	vec3 position = marcher.origin + marcher.direction * marcher.distance;
	vec3 normal = getNormal(position);
	Surface surface = Surface(position, normal, vec3(0.0));
	return surface;
}
const int OSTEPS = 4;
float getOcclusion(vec3 p, vec3 d) {
	float occ = 1.0;
	p += d;
	for (int i = 0; i < OSTEPS; i++) {
		float distance = scene(p);
		p += d * distance;
		occ = min(occ, distance);
	}
	return max(0.0, occ);
}
float getSoftShadow(in vec3 ro, in vec3 rd, float mint, float k, in vec4 c ) {
    return 1.0;
}
struct Light {
	vec3 color;
	vec3 position;
	vec3 direction;
	vec3 reflected;
	float distance;
	float attenuation;
	float diffuse;
	float specular;
	float occlusion;
};
Light getLight(
    vec3 color, 
    vec3 position, 
    Material material, 
    Surface surface, 
    Camera camera
    ) {
	const float specularity = 16.0;
	Light light = Light(color, position, vec3(0.0), vec3(0.0), 0.0, 0.0, 0.0, 0.0, 1.0);
	light.direction = light.position - surface.position;
	light.distance = length(light.direction);
	light.direction /= light.distance; 
	light.attenuation = min(1.0 / (0.25 * light.distance * light.distance), 1.0); // Keeps things between 0 and 1.
	light.reflected = reflect(-light.direction, surface.normal);
	light.diffuse = max(0.0, dot(surface.normal, light.direction));
	light.specular = max(0.0, dot(light.reflected, normalize(camera.position - surface.position)));
	light.specular = pow(light.specular, specularity); // Ramping up the specular value to the specular power for a bit of shininess.
#ifdef OCCLUSION
		float diffuseOcclusion = getOcclusion(surface.position, light.direction);
		float specularOcclusion = getOcclusion(surface.position, light.reflected);
		light.diffuse *= diffuseOcclusion;
		light.specular *= specularOcclusion;
		light.occlusion = getOcclusion(surface.position, surface.normal);
    #ifdef OCCLUSION_
			light.occlusion += diffuseOcclusion + specularOcclusion;
			light.occlusion *= .3;
	#endif
#endif	
	return light;
}
vec3 calcLight(Light light, Material material) {
	return (material.color * (material.ambient * light.occlusion + light.diffuse * material.glossiness) + light.specular * material.shininess) * light.color * light.attenuation;
}

float getRayDistance(Marcher marcher, Camera camera) {
	marcher.distance = 0.0;
	marcher.depth = camera.near; 
	for (int i = 0; i < MARCHER_STEPS; i++ ) {
		marcher.distance = scene(marcher.origin + marcher.direction * marcher.depth);
        if ((marcher.distance < marcher.threshold) || (marcher.depth >= camera.far)) {
			break;
		}
		marcher.depth += marcher.distance * marcher.scale;
	}
	if (marcher.distance >= marcher.threshold) {
		marcher.depth = camera.far;
	} else {
		marcher.depth += marcher.distance;
	} 
	return marcher.depth;
}

vec3 render() {
	vec3 background = AZUR;
	float radius = 10.0;
	Camera camera = getCamera(
		u_camera * radius, 
		vec3(0.0) // target
	);
	Marcher marcher = getMarcher(camera);
	marcher.distance = getRayDistance(marcher, camera);
	if (marcher.distance >= camera.far) {
	    return background;
	}
	Surface surface = getSurface(marcher);
	Material material = getMaterial(materialId);
	Light light = getLight(
		WHITE, // color
		u_camera * 4.0, // position
		material,
		surface,
		camera
	);
	surface.rgb = calcLight(light, material);
	return clamp(surface.rgb, 0.0, 1.0); // from 0 to 1
}

void main() {
    vec3 color = render();
    gl_FragColor = vec4(color, 1.0);
}