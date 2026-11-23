// GLSL for the fog, particles and flames. Colours come in as uniforms built from palette.ts.
const noise = /* glsl */ `
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * n(p); p *= 2.02; a *= 0.5; }
  return v;
}
`

export const planeVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

// Layered noise that scrolls, with soft edges and more density near the ground.
export const fogFrag = /* glsl */ `
${noise}
uniform float uTime; uniform float uSpeed; uniform float uSeed; uniform float uDensity; uniform vec3 uColor;
varying vec2 vUv;
void main(){
  vec2 p = vUv * vec2(4.0, 2.0) + vec2(uTime * uSpeed, uSeed);
  float f = fbm(p + fbm(p + uTime * 0.03));
  float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x) * smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
  float ground = mix(1.0, 0.45, vUv.y);
  gl_FragColor = vec4(uColor, smoothstep(0.35, 0.85, f) * edge * ground * uDensity);
  #include <colorspace_fragment>
}
`

// One shader for embers and dust motes: points that rise, sway and fade.
export const particleVert = /* glsl */ `
attribute float aSpeed; attribute float aPhase;
uniform float uTime; uniform float uSize; uniform float uHeight; uniform float uPx;
varying float vLife;
void main(){
  vec3 p = position;
  float y = mod(p.y + uTime * aSpeed, uHeight);
  vLife = y / uHeight;
  p.y = y;
  p.x += sin(uTime * 0.5 + aPhase + y * 0.6) * 0.45;
  p.z += cos(uTime * 0.4 + aPhase * 1.3 + y * 0.5) * 0.45;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * uPx * (1.0 - vLife * 0.5) * (14.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

export const particleFrag = /* glsl */ `
uniform vec3 uColorA; uniform vec3 uColorB; uniform float uAlpha;
varying float vLife;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float soft = smoothstep(0.5, 0.0, d);
  float fade = smoothstep(0.0, 0.08, vLife) * (1.0 - vLife);
  gl_FragColor = vec4(mix(uColorA, uColorB, vLife), soft * fade * uAlpha);
  #include <colorspace_fragment>
}
`

// A teardrop flame with a slow wobble. Values above 1 feed the bloom.
export const flameFrag = /* glsl */ `
uniform float uTime; uniform float uLit; uniform vec3 uInner; uniform vec3 uOuter;
varying vec2 vUv;
void main(){
  float wob = 0.06 * sin(uTime * 2.3 + vUv.y * 5.0);
  float w = mix(0.3, 0.0, pow(vUv.y, 0.8));
  // Written without smoothstep(edge0 > edge1) so no pixel can become NaN at the flame tip.
  float a = clamp(1.0 - abs(vUv.x - 0.5 + wob * vUv.y) / max(w, 0.001), 0.0, 1.0) * clamp((1.0 - vUv.y) * 4.0, 0.0, 1.0);
  vec3 col = mix(uInner, uOuter, smoothstep(0.1, 0.8, vUv.y));
  gl_FragColor = vec4(min(col * 1.5, vec3(1.0)), clamp(a, 0.0, 1.0) * uLit);
  #include <colorspace_fragment>
}
`
