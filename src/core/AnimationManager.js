import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ANIMATION_LIST } from "../config/animations";

export class AnimationManager {
  constructor(threeJSManager) {
    this.threeJS = threeJSManager;
    this.possibleAnims = [];
    this.currentlyAnimating = false;
    this.idle = null;
  }

  async loadAnimations() {
    const loader = new GLTFLoader();

    for (const animationItem of ANIMATION_LIST) {
      try {
        const gltf = await this.loadGLTF(loader, animationItem.model_url);
        if (!gltf.animations || gltf.animations.length === 0) {
          console.error(`No animations found in: ${animationItem.animation}`);
          continue;
        }

        const clips = gltf.animations.filter(
          (val) => val.name === animationItem.animation
        );
        const newAnimations = clips
          .map((val) => {
            const clip = THREE.AnimationClip.findByName(clips, val.name);
            if (!clip) return null;

            const clonedAnim = clip.clone();
            clonedAnim.tracks = clonedAnim.tracks.filter(
              (track) =>
                !track.name.includes("scale") &&
                !track.name.includes("position")
            );

            return {
              name: val.name,
              clip: this.threeJS.mixer.clipAction(clonedAnim),
            };
          })
          .filter(Boolean);

        this.possibleAnims.push(...newAnimations);
      } catch (error) {
        console.error(
          `Error loading animation ${animationItem.animation}:`,
          error
        );
      }
    }
  }

  loadGLTF(loader, url) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });
  }

  playModifierAnimation(from, fSpeed, to, tSpeed) {
    if (this.currentlyAnimating) return;
    this.currentlyAnimating = true;

    to.setLoop(THREE.LoopRepeat);
    to.reset();
    to.play();

    from.crossFadeTo(to, fSpeed, true);

    setTimeout(() => {
      from.enabled = true;
      to.crossFadeTo(from, tSpeed, true);
      this.currentlyAnimating = false;
    }, to._clip.duration * 1000 - (tSpeed + fSpeed) * 1000);
  }

  playAnimation(animationName) {
    const animation = this.possibleAnims.find((a) => a.name === animationName);
    if (animation && this.idle) {
      this.playModifierAnimation(this.idle, 0.2, animation.clip, 0.2);
    }
  }

  setIdleAnimation(idleClip) {
    this.idle = this.threeJS.mixer.clipAction(idleClip);
    this.idle.setLoop(THREE.LoopRepeat, Infinity);
    this.idle.play();
  }

  resetHead() {
    if (this.currentlyAnimating) return;

    const w = { x: window.innerWidth, y: window.innerHeight };
    const xRef = w.x - 160;
    const yRef = w.y - 190;

    this.moveJoint({ x: xRef, y: yRef }, this.threeJS.neck, 50);
    this.moveJoint({ x: xRef, y: yRef }, this.threeJS.waist, 30);
  }

  moveJoint(mouse, joint, degreeLimit) {
    if (!joint) return;

    const degrees = this.getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    joint.rotation.y = THREE.Math.degToRad(degrees.x);
    joint.rotation.x = THREE.Math.degToRad(degrees.y);
  }

  getMouseDegrees(x, y, degreeLimit) {
    const w = { x: window.innerWidth, y: window.innerHeight };
    const xRef = w.x - 160;
    const yRef = w.y - 190;

    let dx = 0,
      dy = 0;

    // Left rotation
    if (x <= xRef) {
      const xdiff = xRef - x;
      const xPercentage = (xdiff / xRef) * 100;
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }
    // Right rotation
    if (x >= xRef) {
      const xdiff = x - xRef;
      const xPercentage = (xdiff / xRef) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    // Up rotation
    if (y <= yRef) {
      const ydiff = yRef - y;
      const yPercentage = (ydiff / yRef) * 100;
      dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
    }
    // Down rotation
    if (y >= yRef) {
      const ydiff = y - yRef;
      const yPercentage = (ydiff / yRef) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }

    return { x: dx, y: dy };
  }
}
