import * as THREE from "three";

import InvisibleLogo from "./InvisibleLogo.ts";

const aspectRatio = 1.67;

class Gl {
  private element: HTMLElement;

  private renderer: THREE.WebGLRenderer;

  private requestAnimationFrameId: null | number;

  private readonly camera: THREE.OrthographicCamera;

  public scene: THREE.Scene;

  private readonly clock: THREE.Clock;

  private readonly mouse: THREE.Vector2;

  private readonly instanceObject: InvisibleLogo;

  constructor(element: HTMLElement) {
    this.element = element;
    const width = this.element.offsetWidth;
    const height = width / aspectRatio;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(
      Math.min(Math.floor(window.devicePixelRatio), 1.5),
    );

    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();

    this.camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0,
      30,
    );
    this.camera.position.set(0, 0, 1);

    this.instanceObject = new InvisibleLogo(width, height);
    this.scene.add(this.instanceObject);

    this.requestAnimationFrameId = null;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);

    this.init();
    this.animate();
  }

  init() {
    this.addCanvas();
    this.addEvents();
  }

  destroy() {
    this.removeEvents();
    this.cancelAnimate();

    this.clock.stop();
    this.scene.clear();
    this.camera.clear();
    this.renderer.dispose();
    this.instanceObject.destroy();

    while (this.element.firstChild) {
      this.element.firstChild.remove();
    }
  }

  addCanvas() {
    const canvas = this.renderer.domElement;
    canvas.classList.add("webgl");
    this.element.appendChild(canvas);
  }

  addEvents() {
    window.addEventListener("resize", this.resize);
    this.element.addEventListener("mousemove", this.mouseMove);
    this.element.addEventListener("mouseleave", this.mouseLeave);
    this.element.addEventListener("mouseenter", this.mouseEnter);
  }

  removeEvents() {
    window.removeEventListener("resize", this.resize);
    this.element.removeEventListener("mousemove", this.mouseMove);
    this.element.removeEventListener("mouseleave", this.mouseLeave);
    this.element.removeEventListener("mouseenter", this.mouseEnter);
  }

  resize() {
    const width = this.element.offsetWidth;
    const height = width / aspectRatio;

    this.renderer.setSize(width, height);
    this.camera.updateProjectionMatrix();
    this.instanceObject.resize(width, height);
  }

  mouseLeave() {
    this.instanceObject.material.uniforms.uCircleVisible.value = false;
  }

  mouseEnter() {
    this.instanceObject.material.uniforms.uCircleVisible.value = true;
  }

  mouseMove(e: MouseEvent) {
    const { target } = e;

    if (target) {
      const rect = (target as HTMLElement).getBoundingClientRect();
      this.mouse.x =
        ((e.clientX - rect.left) / this.element.offsetWidth) * 2 - 1;
      this.mouse.y =
        -1 *
          ((e.clientY - rect.top) / (this.element.offsetWidth / aspectRatio)) *
          2 +
        1;
    }
  }

  cancelAnimate() {
    if (this.requestAnimationFrameId) {
      cancelAnimationFrame(this.requestAnimationFrameId);
    }
  }

  animate() {
    this.requestAnimationFrameId = requestAnimationFrame(this.animate);
    this.render();
  }

  render() {
    this.instanceObject.render({
      time: this.clock.getElapsedTime(),
      mouse: this.mouse,
    });
    this.renderer.render(this.scene, this.camera);
  }
}

export default Gl;
