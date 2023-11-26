import * as THREE from "three";

import composited from "../images/composited.jpg";
import grain from "../images/grain.jpg";
import noise from "../images/noise.png";
import reveal from "../images/reveal.png";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

class InvisibleLogo extends THREE.Object3D {
  private readonly geometry: THREE.PlaneGeometry;

  public material: THREE.RawShaderMaterial;

  public mesh: THREE.Mesh;

  constructor(width: number, height: number) {
    super();

    const compositedTxt = new THREE.TextureLoader().load(composited.src);
    compositedTxt.minFilter = THREE.LinearFilter;
    compositedTxt.generateMipmaps = false;

    const revealTxt = new THREE.TextureLoader().load(reveal.src);
    revealTxt.minFilter = THREE.LinearFilter;
    revealTxt.generateMipmaps = false;

    const grainTxt = new THREE.TextureLoader().load(grain.src);
    grainTxt.generateMipmaps = false;
    grainTxt.minFilter = THREE.LinearFilter;
    grainTxt.wrapS = THREE.RepeatWrapping;
    grainTxt.wrapT = THREE.RepeatWrapping;

    const noiseTxt = new THREE.TextureLoader().load(noise.src);
    noiseTxt.generateMipmaps = true;
    noiseTxt.minFilter = THREE.LinearFilter;
    noiseTxt.wrapS = THREE.RepeatWrapping;
    noiseTxt.wrapT = THREE.RepeatWrapping;

    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: {
          value: compositedTxt,
        },
        uTextureBack: {
          value: revealTxt,
        },
        uGrain: {
          value: grainTxt,
        },
        uSmoothNoise: {
          value: noiseTxt,
        },
        uFactorNoise1: {
          value: 26,
        },
        uFactorNoise2: {
          value: 78,
        },
        uFactorNoise3: {
          value: 17.6,
        },
        uTweakParam1: {
          value: 1,
        },
        uTweakParam2: {
          value: 1,
        },
        uTweakParam3: {
          value: 1,
        },
        uRes: {
          value: new THREE.Vector2(width, height),
        },
        uScreen: {
          value: new THREE.Vector2(width, height),
        },
        uMouse: {
          value: new THREE.Vector2(0, 0),
        },
        uCircleVisible: {
          value: false,
        },
        uStrength: {
          value: 0,
        },
        uParallax: {
          value: 0,
        },
        uTime: {
          value: 0,
        },
      },
      depthTest: true,
      depthWrite: false,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.visible = true;
    this.renderOrder = 1;

    this.add(this.mesh);
  }

  resize(width: number, height: number) {
    this.material.uniforms.uRes.value = new THREE.Vector2(width, height);
    this.material.uniforms.uScreen.value = new THREE.Vector2(width, height);
  }

  render({ mouse, time }: { mouse: THREE.Vector2; time: number }) {
    this.material.uniforms.uTime.value = (0.125 * time) % 16;
    this.material.uniforms.uMouse.value.x = mouse.x;
    this.material.uniforms.uMouse.value.y = mouse.y;
  }

  destroy() {
    this.remove(this.mesh);
  }
}

export default InvisibleLogo;
