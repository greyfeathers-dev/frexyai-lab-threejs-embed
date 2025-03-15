import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { BASE_MODEL, MODEL_TEXTURE } from "../config/constants";

export class ThreeJSManager {
  constructor() {
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.model = null;
    this.neck = null;
    this.waist = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.isMobile = window.matchMedia("(max-width: 767px)").matches;
    this.animationFrameId = null;
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.setupFloor();
    this.loadModel();
    this.startAnimationLoop();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null;
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;
    this.camera.position.x = 0;
    this.camera.position.y = -3;
  }

  setupRenderer() {
    const canvas = document.createElement("canvas");
    canvas.id = "threejs-canvas";
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.bottom = "-40px";
    canvas.style.right = this.isMobile ? "-76px" : "-60px";
    canvas.style.height = this.isMobile ? "260px" : "280px";
    canvas.style.width = this.isMobile ? "260px" : "280px";
    canvas.style.zIndex = "1000";

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 0.3;
  }

  setupLights() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(-9, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(4, 0, -20);
    this.scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);
  }

  setupFloor() {
    const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -11;
    this.scene.add(floor);
  }

  loadModel() {
    // Create and show loading indicator
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "model-loader";
    loadingIndicator.style.cssText = `
      position: fixed;
      bottom: 36px;
      right: 36px;
      width: 60px;
      height: 60px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #BE0EFF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      z-index: 1000;
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(loadingIndicator);

    const texture = new THREE.TextureLoader().load(
      MODEL_TEXTURE,
      undefined,
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
        this.handleLoadError();
      }
    );
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      skinning: true,
      metalness: 0.2,
      roughness: 0.7,
      color: new THREE.Color(0xffffff),
      emissive: new THREE.Color(0x000000),
      envMapIntensity: 1.0,
    });

    const loader = new GLTFLoader();
    loader.load(
      BASE_MODEL.model_url,
      (gltf) => {
        this.onModelLoaded(gltf, material);
        // Remove loading indicator when model is loaded
        const loadingIndicator = document.getElementById("model-loader");
        if (loadingIndicator) {
          loadingIndicator.remove();
        }
      },
      (progress) => {
        // Update loading progress if needed
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("Error loading model:", error);
        this.handleLoadError();
      }
    );
  }

  handleLoadError() {
    const loadingIndicator = document.getElementById("model-loader");
    if (loadingIndicator) {
      loadingIndicator.style.border = "4px solid #ff0000";
      loadingIndicator.style.animation = "none";
    }
    // You might want to show an error message to the user here
  }

  onModelLoaded(gltf, material) {
    this.model = gltf.scene;
    this.model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.material = material.clone();
      }
      if (o.isBone && o.name === "CC_Base_Head") {
        this.neck = o;
      }
      if (o.isBone && o.name === "spine_01x") {
        this.waist = o;
      }
    });

    this.model.scale.set(14.5, 14.5, 14.5);
    this.model.position.y = -11;
    this.scene.add(this.model);

    this.mixer = new THREE.AnimationMixer(this.model);
    // Additional animation setup can be added here
  }

  startAnimationLoop() {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }

  stopAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  update() {
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
}
