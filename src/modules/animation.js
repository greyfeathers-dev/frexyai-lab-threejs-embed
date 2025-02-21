const THREE = require('three');
const { BASE_MODEL, MODEL_TEXTURE } = require('../constants/assets.constant');

class AnimationController {
	constructor() {
		this.scene = null;
		this.renderer = null;
		this.camera = null;
		this.model = null;
		this.neck = null;
		this.waist = null;
		this.mixer = null;
		this.idle = null;
		this.possibleAnimations = [];
		this.clock = new THREE.Clock();
		this.raycaster = new THREE.Raycaster();
		this.currentlyAnimating = false;
		this.isMobile = window.matchMedia('(max-width: 767px)').matches;
		this.fallbackLoader = null;
	}

	async initialize(canvas, fallbackLoader) {
		this.setupScene(canvas);
		await this.loadModel();
		this.setupLights();
		this.setupFloor();
		this.animate();
		if (!this.isMobile) {
			this.setupMouseTracking();
		}
		this.fallbackLoader = fallbackLoader;
	}

	setupScene(canvas) {
		this.scene = new THREE.Scene();
		this.scene.background = null;

		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
		this.renderer.shadowMap.enabled = true;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(this.renderer.domElement);
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 30;
		this.camera.position.x = 0;
		this.camera.position.y = -3;
	}

	async loadModel() {
		const texture = new THREE.TextureLoader().load(MODEL_TEXTURE);
		texture.flipY = false;

		const material = new THREE.MeshPhongMaterial({
			map: texture,
			color: 0xffffff,
			skinning: true,
		});

		const loader = new THREE.GLTFLoader();

		try {
			const gltf = await loader.loadAsync(BASE_MODEL.model_url);
			this.model = gltf.scene;
			this.setupModelAndAnimations(gltf, material);
		} catch (error) {
			console.error('Error loading model:', error);
		}
	}

	setupModelAndAnimations(gltf, material) {
		const fileAnimations = gltf.animations;

		this.model.traverse((o) => {
			if (o.isMesh) {
				o.castShadow = true;
				o.receiveShadow = true;
				o.material = material;
			}
			if (o.isBone && o.name === 'CC_Base_Head') {
				this.neck = o;
			}
			if (o.isBone && o.name === 'spine_01x') {
				this.waist = o;
			}
		});

		this.model.scale.set(14.5, 14.5, 14.5);
		this.model.position.y = -11;
		this.scene.add(this.model);

		this.setupAnimations(fileAnimations, gltf);
	}

	setupAnimations(fileAnimations, gltf) {
		this.mixer = new THREE.AnimationMixer(this.model);

		const clips = fileAnimations.filter((val) => val.name !== 'idle');
		this.possibleAnimations = clips.map((val) => {
			const clip = THREE.AnimationClip.findByName(clips, val.name);
			const clonedAnim = clip.clone();
			clonedAnim.tracks = clonedAnim.tracks
				.filter((track) => !track.name.includes('scale'))
				.filter((track) => !track.name.includes('position'));
			return {
				name: val.name,
				clip: this.mixer.clipAction(clonedAnim),
			};
		});

		const idleAnim = THREE.AnimationClip.findByName(fileAnimations, BASE_MODEL.animation);
		if (idleAnim) {
			const clonedIdleAnim = idleAnim.clone();
			clonedIdleAnim.tracks = clonedIdleAnim.tracks
				.filter((track) => !track.name.includes('scale'))
				.filter((track) => !track.name.includes('position'));
			this.idle = this.mixer.clipAction(clonedIdleAnim);
			this.idle.setLoop(THREE.LoopRepeat, Infinity);
			this.idle.play();
		}
		this.fallbackLoader.remove();
		this.loadAdditionalAnimations(gltf);
	}

	loadAdditionalAnimations(gltf) {
		const loader = new THREE.GLTFLoader();

		ANIMATION_LIST.forEach((animationItem, index) => {
			loader.load(
				animationItem.model_url,
				function (newGLTF) {
					if (!newGLTF.animations || newGLTF.animations.length === 0) {
						console.error(`No animations found in the loaded GLB file for ${animationItem.animation}.`);
						return;
					}

					// Add new animations to the existing GLTF animations
					gltf.animations.push(...newGLTF.animations);

					// Update possible animations list
					const clips = gltf.animations.filter((val) => val.name === animationItem.animation);
					const newAnimations = clips
						.map((val) => {
							let clip = THREE.AnimationClip.findByName(clips, val.name);
							if (!clip) {
								console.error(`Animation ${val.name} not found in the clips.`);
								return null;
							}
							const clonedAnim = clip.clone();
							clonedAnim.tracks = clonedAnim.tracks.filter(
								(track) => !track.name.includes('scale') && !track.name.includes('position')
							);
							return {
								name: val.name,
								clip: mixer.clipAction(clonedAnim),
							};
						})
						.filter(Boolean); // Remove null entries

					possibleAnims.push(...newAnimations);
				},
				undefined,
				function (error) {
					console.error(`Error loading GLTF for ${animationItem.animation}:`, error);
				}
			);
		});
	}

	setupLights() {
		const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
		hemiLight.position.set(0, 50, 0);
		this.scene.add(hemiLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
		dirLight.position.set(-8, 5, 20);
		dirLight.castShadow = true;
		dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 1500;
		const d = 8.25;
		dirLight.shadow.camera.left = d * -1;
		dirLight.shadow.camera.right = d;
		dirLight.shadow.camera.top = d;
		dirLight.shadow.camera.bottom = d * -1;
		this.scene.add(dirLight);
	}

	setupFloor() {
		const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
		const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -0.5 * Math.PI;
		floor.receiveShadow = true;
		floor.position.y = -11;
		this.scene.add(floor);
	}

	setupMouseTracking() {
		let timer = null;
		document.addEventListener('mousemove', (e) => {
			if (this.currentlyAnimating) return;

			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => this.resetHead(), 4000);

			const mouseCoords = this.getMousePos(e);
			if (this.neck && !this.currentlyAnimating) {
				this.moveJoint(mouseCoords, this.neck, 50);
			}
		});
	}

	animate() {
		if (this.mixer) {
			this.mixer.update(this.clock.getDelta());
		}
		if (this.resizeRendererToDisplaySize()) {
			const canvas = this.renderer.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.animate());
	}

	resizeRendererToDisplaySize() {
		const canvas = this.renderer.domElement;
		const width = window.innerWidth;
		const height = window.innerHeight;
		const canvasPixelWidth = canvas.width / window.devicePixelRatio;
		const canvasPixelHeight = canvas.height / window.devicePixelRatio;

		const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
		if (needResize) {
			this.renderer.setSize(width, height, false);
		}
		return needResize;
	}

	playModifierAnimation(from, fSpeed, finalAnim, tSpeed) {
		const to = finalAnim.clip;
		to.setLoop(THREE.LoopRepeat);
		to.reset();
		to.play();

		from.crossFadeTo(to, fSpeed, true);

		setTimeout(() => {
			from.enabled = true;
			to.crossFadeTo(from, tSpeed, true);
		}, to._clip.duration * 1000 - (tSpeed + fSpeed) * 1000);
	}

	resetHead() {
		const w = { x: window.innerWidth, y: window.innerHeight };
		const xRef = w.x - 160;
		const yRef = w.y - 190;

		this.moveJoint({ x: xRef, y: yRef }, this.neck, 50);
		this.moveJoint({ x: xRef, y: yRef }, this.waist, 30);
	}

	moveJoint(mouse, joint, degreeLimit) {
		const degrees = this.getMouseDegrees(mouse.x, mouse.y, degreeLimit);
		if (joint) {
			joint.rotation.y = THREE.Math.degToRad(degrees.x);
			joint.rotation.x = THREE.Math.degToRad(degrees.y);
		}
	}

	getMousePos(e) {
		return { x: e.clientX, y: e.clientY };
	}

	getMouseDegrees(x, y, degreeLimit) {
		const w = { x: window.innerWidth, y: window.innerHeight };
		const xRef = w.x - 160;
		const yRef = w.y - 190;

		let dx = 0,
			dy = 0;

		if (x <= xRef) {
			const xdiff = xRef - x;
			const xPercentage = (xdiff / xRef) * 100;
			dx = ((degreeLimit * xPercentage) / 100) * -1;
		}
		if (x >= xRef) {
			const xdiff = x - xRef;
			const xPercentage = (xdiff / xRef) * 100;
			dx = (degreeLimit * xPercentage) / 100;
		}
		if (y <= yRef) {
			const ydiff = yRef - y;
			const yPercentage = (ydiff / yRef) * 100;
			dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
		}
		if (y >= yRef) {
			const ydiff = y - yRef;
			const yPercentage = (ydiff / yRef) * 100;
			dy = (degreeLimit * yPercentage) / 100;
		}
		return { x: dx, y: dy };
	}
}

module.exports = AnimationController;
