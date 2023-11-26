precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uParallax;

varying vec2 vUv;
varying vec4 vClip;

void main(){
  vUv = uv;
  vec3 pos = position;

  vec4 clip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vClip = clip;
  gl_Position = clip;
}
