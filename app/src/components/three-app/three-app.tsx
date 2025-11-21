import { Component, Element, h } from '@stencil/core';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

@Component({
  tag: 'three-app',
  styleUrl: 'three-app.css',
  shadow: true,
})
export class ThreeApp {

  @Element() hostEl: HTMLElement;

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private cube: THREE.Mesh;

  componentDidLoad() {
    this.initScene();
    this.startRendering();
  }

  disconnectedCallback() {
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
    }
  }

  initScene() {
    const container = this.hostEl.shadowRoot.querySelector('#vr-container');

    // --- Renderer ---
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.xr.enabled = true;
    container.appendChild(this.renderer.domElement);

    // Add VR Button (outside shadow root)
    document.body.appendChild(VRButton.createButton(this.renderer));

    // --- Scene ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x101010);

    // --- Camera ---
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // --- Object ---
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.z = -3;
    this.scene.add(this.cube);

    // --- Light ---
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));

    // Resize
    window.addEventListener('resize', () => this.resizeRenderer(container));
  }

  startRendering() {
    this.renderer.setAnimationLoop(() => {
      this.cube.rotation.x += 0.005;
      this.cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    });
  }

  resizeRenderer(container: Element) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  render() {
    return <div id="vr-container"></div>;
  }
}
