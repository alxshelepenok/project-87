precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uTextureBack;
uniform sampler2D uGrain;
uniform sampler2D uSmoothNoise;

uniform float uTime;
uniform float uFactorNoise1;
uniform float uFactorNoise2;
uniform float uFactorNoise3;
uniform float uTweakParam1;
uniform float uTweakParam2;
uniform float uTweakParam3;
uniform bool uCircleVisible;

uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uDiff;
uniform vec2 uScreen;

float circle(vec2 uv, vec2 pos, vec2 res, float radius, float scale, float s1, float s2) {
  uv -= pos;
  uv.x *= res.x / res.y;
  return 1.0 - smoothstep(s1, s2, length(uv) / 4.0 * radius / scale);
}

float snoise3(vec3 v) {
  v *= 0.05;
  return texture2D(uGrain, v.z * 3.25 * vec2(v.x + (v.z), v.y + (v.z))).r;
}

float smoothnoise3(vec3 v) {
  v *= 0.07;
  return texture2D(uSmoothNoise, v.z * 3.25 * vec2(v.x + (v.z), v.y + (v.z))).r;
}

varying vec2 vUv;
varying vec4 vClip;

void main() {
  float sizeReduce = 0.1;
  vec2 uv2 = vUv * (1.0 + sizeReduce) - vec2(sizeReduce / 2.0);
  vec2 uv = uv2;

  vec2 clipUv = vClip.xy / vClip.w;

  vec2 mouse = -uMouse;
  mouse *= -1.;

  float circ = 0.0;

  if (uCircleVisible) {
    circ = circle(clipUv, mouse, uScreen, 40.0, 4.2, 0.95, 1.0);
  }

  float g = snoise3(50.0 * vec3(uv.x * 9.0 * uv.y, uv.y * 6.0 * (uTime * 6.1) * snoise3(vec3(uv, uTime)), uTime * 1.0));

  float noise = smoothnoise3(vec3(uv.x * uFactorNoise1, uv.y * 2.8 + uTime * 2.0, uTime));
  noise = (noise + 1.0) * 0.5;

  float noise2 = smoothnoise3(vec3(uv.x * uFactorNoise2, uv.y * 2.5, uTime));
  noise2 = (noise2 + 1.0) * 0.25;

  noise = noise * noise2 * g;
  noise = smoothstep(0.2, 0.8, noise);

  float noise3 = smoothnoise3(vec3(uv.x * uFactorNoise3, uv.y * 2.4 + uTime, uTime));
  noise3 = (noise3 + 1.0) * 0.5;
  noise3 = pow(noise3, 12.0);
  noise3 = smoothstep(0.0, 0.14, noise3);

  float noise4 = smoothnoise3(vec3(uv.x * uFactorNoise3, uv.y * 2.4, (uTime * 1.2) + 3.0));
  noise4 = (noise4 + 1.0) * 0.5;
  noise4 = pow(noise4, 12.0);
  noise4 = smoothstep(0.0, 0.54, noise4);

  float finalNoise = max(noise3, noise4);
  finalNoise = clamp(finalNoise, 0.0, 1.0) * g * 2.0;

  uv.y += finalNoise * 0.018 + noise * 0.15 + (noise3 * g * 0.05) * 0.55;
  uv.x += noise * 0.18 + noise * 2.0 + (noise3 * g * 0.05);

  vec4 txtSharp = texture2D(uTexture, uv);
  txtSharp.rgb = txtSharp.rrr;
  txtSharp.rgb = 1.0 - txtSharp.rgb;

  vec4 txtBlur = texture2D(uTexture, uv  + (noise3 * 0.1));
  txtBlur.rgb = txtBlur.ggg;
  txtBlur.rgb -= g * (1.0 - txtBlur.r);
  txtBlur.rgb = 1.0 - (txtBlur.rgb * 1.0);

  float mixFactor = (noise + finalNoise + noise3);
  mixFactor = clamp(mixFactor, 0.0, 1.0);
  vec4 txt = mix(txtSharp, txtBlur, mixFactor * 2.0);

  txt.a = 0.85;

  vec4 redTxt = texture2D(uTextureBack, uv2 + (noise3 * 0.01));
  redTxt = mix(redTxt, txt, 0.123);
  redTxt.a = 1.0;

  vec4 finalTxt = mix(txt, redTxt, circ);

  gl_FragColor = finalTxt;
}
