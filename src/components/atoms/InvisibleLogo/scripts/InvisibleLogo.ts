import * as THREE from "three";

import composited from "../images/composited.jpg?url";
import grain from "../images/grain.jpg?url";
import noise from "../images/noise.png?url";
import reveal from "../images/reveal.png?url";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

class InvisibleLogo extends THREE.Object3D {
  private readonly geometry: THREE.PlaneGeometry;

  public material: THREE.RawShaderMaterial;

  public mesh: THREE.Mesh;

  constructor(width: number, height: number) {
    super();

    this.geometry = new THREE.PlaneGeometry(width, height);
    this.material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: {
          value: null,
        },
        uTextureBack: {
          value: null,
        },
        uGrain: {
          value: null,
        },
        uSmoothNoise: {
          value: null,
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
      visible: false,
    });

    this.loadTextures().then(() => {
      this.material.visible = true;
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.visible = true;
    this.renderOrder = 1;

    this.add(this.mesh);
  }

  async loadTextures() {
    const compositedTxtPromise = new THREE.TextureLoader().loadAsync(
      composited,
    );

    const revealTxtPromise = new THREE.TextureLoader().loadAsync(reveal);
    const grainTxtPromise = new THREE.TextureLoader().loadAsync(grain);
    const noiseTxtPromise = new THREE.TextureLoader().loadAsync(noise);

    const [compositedTxt, revealTxt, grainTxt, noiseTxt] = await Promise.all([
      compositedTxtPromise,
      revealTxtPromise,
      grainTxtPromise,
      noiseTxtPromise,
    ]);

    compositedTxt.minFilter = THREE.LinearFilter;
    compositedTxt.generateMipmaps = false;
    revealTxt.minFilter = THREE.LinearFilter;
    revealTxt.generateMipmaps = false;
    grainTxt.generateMipmaps = false;
    grainTxt.minFilter = THREE.LinearFilter;
    grainTxt.wrapS = THREE.RepeatWrapping;
    grainTxt.wrapT = THREE.RepeatWrapping;
    noiseTxt.generateMipmaps = true;
    noiseTxt.minFilter = THREE.LinearFilter;
    noiseTxt.wrapS = THREE.RepeatWrapping;
    noiseTxt.wrapT = THREE.RepeatWrapping;

    this.material.uniforms.uTexture.value = compositedTxt;
    this.material.uniforms.uTextureBack.value = revealTxt;
    this.material.uniforms.uGrain.value = grainTxt;
    this.material.uniforms.uSmoothNoise.value = noiseTxt;
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
