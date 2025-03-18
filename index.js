/** @format */
const CHATBOT_PAGE = "https://frexyai-lab-saas-dashboard-staging.vercel.app";
// const CHATBOT_PAGE = 'http://localhost:3000';
const ENDPOINT = "https://node-service-1e6u.onrender.com";
// const ENDPOINT = 'http://localhost:3001'

const BASE_MODEL = {
  model_url:
    "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/idle.glb",
  // model_url: 'https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Idle_Head.glb',
  animation: "idle",
};

const ANIMATION_LIST = [
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/celebration.glb",
    animation: "celebration",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/disappointed.glb",
    animation: "disappointed",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/no_no.glb",
    animation: "no_no",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/offer.glb",
    animation: "offer",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/thumbs_up.glb",
    animation: "thumbs_up",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/two_hand_wave.glb",
    animation: "two_hand_wave",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/wave.glb",
    animation: "wave",
  },
];

const MODEL_TEXTURE =
  "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/base%20colour%20(1).png";

const TOOLTIP_BG = "#fff";
const TOOLTIP_COLOR = "#0D1934";
const audio = new Audio(
  "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/notification.mp3"
);

(function () {
  // Set our main variables
  let scene,
    renderer,
    camera,
    model, // Our character
    neck, // Reference to the neck bone in the skeleton
    waist, // Reference to the waist bone in the skeleton
    possibleAnims, // Animations found in our file
    mixer, // THREE.js animations mixer
    idle, // Idle, the default state our character returns to
    clock = new THREE.Clock(), // Used for anims, which run to a clock instead of frame rate
    raycaster = new THREE.Raycaster(); // Used to detect the click on our character

  let country = null;
  let source = null;
  let sourceLink = "#";
  let firstPageVisited = null;
  let leadId = null;

  init();

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  let CONFIG = [];

  function init() {
    fetchConfig();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    firstPageVisited = window.location.href;
    country = Intl.DateTimeFormat().resolvedOptions().timeZone;
    source = getSource();
    const MODEL_PATH = BASE_MODEL.model_url;

    // Add welcome message check
    checkAndShowWelcomeMessage();

    const fallbackLoader = document.createElement("div");
    fallbackLoader.id = "loader";
    const merchantId = localStorage.getItem("merchantId");
    const parentSiteUrl = `${window.location.protocol}//${window.location.host}`;
    console.log(parentSiteUrl, "parentSiteUrl");
    sourceLink = `${CHATBOT_PAGE}/chat?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}&merchantId=${merchantId}&parentSiteUrl=${parentSiteUrl}`;
    if (document.body) {
      document.body.appendChild(fallbackLoader);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        document.body.appendChild(fallbackLoader);
      });
    }

    const style = document.createElement("style");
    style.type = "text/css";
    const css = `
        #loader {
          width: 60px;
          height: 60px;
          position: fixed;
          bottom: 36px;
          right: 36px;
          --colorA: #BE0EFF;
          
          &::before,
          &::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              border-top: 4px solid #fff;
              filter: 
                  drop-shadow(0 0 2px var(--colorA))
                  drop-shadow(0 0 5px var(--colorA))
                  drop-shadow(0 0 10px var(--colorA))
                  drop-shadow(0 0 20px var(--colorA));
              animation: rotate 3s infinite linear;
          }
          
          &::after {
              --colorA: #6622FF;
              animation-delay: -1.5s;
          }
      }
  
      @keyframes rotate {
          100% {
              transform: rotate(360deg);
          }
      }
      `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    const canvas = document.createElement("canvas");
    canvas.id = "threejs-canvas";
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.bottom = "-40px";
    canvas.style.right = isMobile ? "-76px" : "-60px";
    canvas.style.height = isMobile ? "260px" : "280px";
    canvas.style.width = isMobile ? "260px" : "280px";

    scene = new THREE.Scene();
    scene.background = null;

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 0.3;
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = -3;

    let stacy_txt = new THREE.TextureLoader().load(
      MODEL_TEXTURE,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
      },
      undefined,
      (error) => console.error("Error loading texture:", error)
    );
    stacy_txt.flipY = false;

    const stacy_mtl = new THREE.MeshStandardMaterial({
      map: stacy_txt,
      skinning: true,
      metalness: 0.2,
      roughness: 0.7,
      color: new THREE.Color(0xffffff),
      emissive: new THREE.Color(0x000000),
      envMapIntensity: 1.0,
    });

    var loader = new THREE.GLTFLoader();

    loader.load(
      MODEL_PATH,
      function (gltf) {
        // A lot is going to happen here
        model = gltf.scene;
        let fileAnimations = gltf.animations;

        // First of all, we're going to use the model's traverse method to find all the meshs, and enabled the ability to cast and receive shadows. This is done like this. Again, this should go above scene.add(model):
        model.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = stacy_mtl.clone();

            // Enhance material colors
            if (o.material instanceof THREE.MeshStandardMaterial) {
              o.material.color.multiplyScalar(2);
              o.material.needsUpdate = true;
            }
          }
          // if(o.isBone) console.log(o.name);
          // Reference the neck and waist bones
          if (o.isBone && o.name === "CC_Base_Head") {
            neck = o;
          }
          if (o.isBone && o.name === "spine_01x") {
            waist = o;
          }
          // console.log(neck, waist, o);
        });

        model.scale.set(14.5, 14.5, 14.5);
        model.position.y = -11;
        scene.add(model);
        mixer = new THREE.AnimationMixer(model);
        let clips = fileAnimations.filter((val) => val.name !== "idle ");
        possibleAnims = clips.map((val) => {
          let clip = THREE.AnimationClip.findByName(clips, val.name);
          // clip.tracks.splice(3, 3);
          // clip.tracks.splice(9, 3);
          // clip = mixer.clipAction(clip);
          let clonedAnim = clip.clone();
          clonedAnim.tracks = clonedAnim.tracks
            .filter((track) => !track.name.includes("scale"))
            .filter((track) => !track.name.includes("position"));
          clip = mixer.clipAction(clonedAnim);
          return {
            name: val.name,
            clip,
          };
        });

        let idleAnim = THREE.AnimationClip.findByName(
          fileAnimations,
          BASE_MODEL.animation
        );
        idleAnim.tracks.splice(48, 3);
        // idleAnim.tracks.splice(9, 3);
        // idle = mixer.clipAction(idleAnim);
        // idle.play();
        if (idleAnim) {
          let clonedIdleAnim = idleAnim.clone();
          clonedIdleAnim.tracks = clonedIdleAnim.tracks
            .filter((track) => !track.name.includes("scale"))
            .filter((track) => !track.name.includes("position"));
          idle = mixer.clipAction(clonedIdleAnim);
          idle.setLoop(THREE.LoopRepeat, Infinity); // Loop the idle animation
          idle.play(); // Play the idle animation
        }
        fallbackLoader.remove();
        loadAdditionalAnimations(gltf);
        appendInput();
        triggerConfig();
        trackButtonEvents();
        addActivity({
          type: "pageVisit",
          source: getSource(),
        });
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      }
    );

    // Enhanced lighting setup
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(-9, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    let d = 8.25;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // Add fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(4, 0, -20);
    scene.add(fillLight);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Enhanced floor setup
    let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.ShadowMaterial({
      opacity: 0.3,
    });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -11;
    scene.add(floor);
  }

  function loadAdditionalAnimations(gltf) {
    const loader = new THREE.GLTFLoader();

    ANIMATION_LIST.forEach((animationItem, index) => {
      loader.load(
        animationItem.model_url,
        function (newGLTF) {
          if (!newGLTF.animations || newGLTF.animations.length === 0) {
            console.error(
              `No animations found in the loaded GLB file for ${animationItem.animation}.`
            );
            return;
          }

          // Add new animations to the existing GLTF animations
          gltf.animations.push(...newGLTF.animations);

          // Update possible animations list
          const clips = gltf.animations.filter(
            (val) => val.name === animationItem.animation
          );
          const newAnimations = clips
            .map((val) => {
              let clip = THREE.AnimationClip.findByName(clips, val.name);
              if (!clip) {
                console.error(`Animation ${val.name} not found in the clips.`);
                return null;
              }
              const clonedAnim = clip.clone();
              clonedAnim.tracks = clonedAnim.tracks.filter(
                (track) =>
                  !track.name.includes("scale") &&
                  !track.name.includes("position")
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
          console.error(
            `Error loading GLTF for ${animationItem.animation}:`,
            error
          );
        }
      );
    });
  }

  function getSource() {
    const referrer = document.referrer;
    const path = window.location.href;
    if (referrer === "https://www.google.com/") return "google";
    else if (referrer === "https://www.yahoo.com/") return "yahoo";
    else if (referrer === "https://www.bing.com/") return "bing";
    else if (referrer === "https://www.youtube.com/") return "youtube";
    else if (referrer === "https://www.linkedin.com/") return "linkedin";
    else if (referrer === "https://www.reddit.com/") return "reddit";
    else if (path.includes("gclid")) return "paid_google";
    else if (path.includes("msclkid")) return "paid_bing";
    else if (path.includes("li_fat_id")) return "paid_linkedin";
    else if (path.includes("fbclid")) return "paid_meta";
    else if (path.includes("wbraid")) return "paid_youtube";
    else if (path.includes("cid")) return "paid_reddit";
    else return "direct";
  }

  async function fetchConfig() {
    setLeadId();
    try {
      const response = await fetch(
        `${ENDPOINT}/api/get-interaction?id=${leadId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const config = await response.json();
      CONFIG = config.data;
      triggerConfig();
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  function trackButtonEvents() {
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        addActivity({
          type: "buttonClicked",
          button_name: button.innerText || "UNNAMED",
        });
      });

      let hoverTimeout;
      button.addEventListener("mouseenter", () => {
        hoverTimeout = setTimeout(() => {
          addActivity({
            type: "buttonHovered",
            button_name: button.innerText || "UNNAMED",
          });
        }, 2000);
      });

      button.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimeout);
      });
    });
  }

  async function incrementClick(id) {
    addActivity({
      type: "offerClicked",
      offer_id: id,
    });
    try {
      const response = await fetch(`${ENDPOINT}/api/increment-click`, {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  async function incrementImpression(id) {
    addActivity({
      type: "offerView",
      offer_id: id,
    });
    const existingOfferIds = JSON.parse(localStorage.getItem("offerIds")) || [];

    if (existingOfferIds.includes(id)) return;

    existingOfferIds.push(id);
    localStorage.setItem("offerIds", JSON.stringify(existingOfferIds));

    try {
      const response = await fetch(`${ENDPOINT}/api/increment-impressions`, {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  async function addActivity(activity) {
    const leadId = localStorage.getItem("leadId") || "";

    if (!leadId) return;

    try {
      const response = await fetch(`${ENDPOINT}/api/add-activity`, {
        method: "POST",
        body: JSON.stringify({
          id: leadId,
          activity: {
            ...activity,
            page_source: window.location.href,
            created_at: Date.now(),
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  function update() {
    if (mixer) {
      mixer.update(clock.getDelta());
    }
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }
  update();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let isFirstLandTriggered = false;
  let currentlyAnimating = false;
  let currentAnimationID = null;
  let timeoutDisappear = null;

  //path change event

  function dispatchPathChangeEvent() {
    addActivity({
      type: "pageVisit",
      source: getSource(),
    });
    const pathChangeEvent = new Event("pathChange");
    window.dispatchEvent(pathChangeEvent);
  }

  let previousPathname = window.location.href;

  const observer = new MutationObserver(() => {
    if (window.location.href !== previousPathname) {
      previousPathname = window.location.href;
      const tooltipContainer = document.getElementById("tooltipContainer");
      if (tooltipContainer) {
        tooltipContainer.remove();
      }

      if (timeoutDisappear) clearTimeout(timeoutDisappear);
      currentlyAnimating = false;
      showInput();
      dispatchPathChangeEvent();
    }
  });

  // Observe the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });

  const displayState = {};

  function setLeadId() {
    const id = localStorage.getItem("leadId");
    if (id) {
      leadId = id;
    } else {
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      leadId = uniqueId;
      localStorage.setItem("leadId", uniqueId);
    }
  }

  function triggerConfig() {
    CONFIG.map((config) => {
      let isTrafficSourceValid = true;
      let isLocationValid = true;
      if (config?.traffic_source?.length) {
        if (!config.traffic_source.includes("any")) {
          const path = window.location.href;
          const referrer = document.referrer;
          isTrafficSourceValid = false;
          config.traffic_source.map((loc) => {
            switch (loc) {
              case "direct":
                if (referrer === "") isTrafficSourceValid = true;
                break;
              case "google":
                if (referrer === "https://www.google.com/")
                  isTrafficSourceValid = true;
                break;
              case "yahoo":
                if (referrer === "https://www.yahoo.com/")
                  isTrafficSourceValid = true;
                break;
              case "bing":
                if (referrer === "https://www.bing.com/")
                  isTrafficSourceValid = true;
                break;
              case "youtube":
                if (referrer === "https://www.youtube.com/")
                  isTrafficSourceValid = true;
                break;
              case "linkedin":
                if (referrer === "https://www.linkedin.com/")
                  isTrafficSourceValid = true;
                break;
              case "reddit":
                if (referrer === "https://www.reddit.com/")
                  isTrafficSourceValid = true;
                break;
              case "paid_google":
                if (path.includes("gclid")) isTrafficSourceValid = true;
                break;
              case "paid_bing":
                if (path.includes("msclkid")) isTrafficSourceValid = true;
                break;
              case "paid_linkedin":
                if (path.includes("li_fat_id")) isTrafficSourceValid = true;
                break;
              case "paid_meta":
                if (path.includes("fbclid")) isTrafficSourceValid = true;
                break;
              case "paid_youtube":
                if (path.includes("wbraid")) isTrafficSourceValid = true;
                break;
              case "paid_reddit":
                if (path.includes("cid")) isTrafficSourceValid = true;
                break;
            }
          });
        }
      }
      if (config?.location?.length) {
        isLocationValid = false;
        const currTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        config?.location.map((loc) => {
          if (currTimezone === loc) isLocationValid = true;
        });
      }
      if (!(isTrafficSourceValid && isLocationValid)) return;
      switch (config.type) {
        case "onFirstLand":
          if (!isFirstLandTriggered) {
            showUIAnimation(config);
          }
          break;
        case "inActive":
          let timer;
          timer = setTimeout(
            () => showUIAnimation(config),
            config.inActiveTime
          );
          window.addEventListener("click", () => {
            if (timer) {
              clearTimeout(timer);
              timer = setTimeout(
                () => showUIAnimation(config),
                config.inActiveTime
              );
            }
          });
          window.addEventListener("scroll", () => {
            if (timer) {
              clearTimeout(timer);
              timer = setTimeout(
                () => showUIAnimation(config),
                config.inActiveTime
              );
            }
          });
          document.addEventListener("mousemove", () => {
            if (timer) {
              clearTimeout(timer);
              timer = setTimeout(
                () => showUIAnimation(config),
                config.inActiveTime
              );
            }
          });
          break;
        case "scroll":
          window.addEventListener("scroll", function () {
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            const path = window.location.href;

            if (
              (config.match === "equals"
                ? path === config.pagePath
                : path.includes(config.pagePath)) &&
              Number(scrollPercent) > Number(config.scrollValue)
            ) {
              if (displayState[config.id]) return;
              displayState[config.id] = true;
              showUIAnimation(config);
            }
          });
          break;
        case "popstate":
          const path = window.location.href;
          if (
            config.match === "equals"
              ? path === config.pagePath
              : path.includes(config.pagePath)
          ) {
            showUIAnimation(config);
          }
          window.addEventListener("pathChange", () => {
            const pagePath = window.location.href;
            if (
              config.match === "equals"
                ? pagePath === config.pagePath
                : pagePath.includes(config.pagePath)
            ) {
              if (config.delay) {
                if (displayState[config.id]) return;
                setTimeout(() => {
                  displayState[config.id] = true;
                  showUIAnimation(config), config.delay;
                });
              } else {
                if (displayState[config.id]) return;
                displayState[config.id] = true;
                showUIAnimation(config);
              }
            }
          });
          break;
      }
    });
  }

  function showUIAnimation(config) {
    if (currentlyAnimating) return;
    resetHead();
    let animationIdx = -1;
    if (config.animation) {
      animationIdx = possibleAnims?.findIndex(
        (animation) => animation.name === config.animation
      );
    }
    const type = config.imageUrl ? "overlay" : "tooltip";
    hideInput();
    if (animationIdx >= 0) {
      playModifierAnimation(idle, 1, possibleAnims[animationIdx], 1.5);
    }
    incrementImpression(config.id);
    if (type === "tooltip") {
      showTooltip(
        config.id,
        config.format,
        config.destination_page,
        config.text,
        TOOLTIP_BG,
        TOOLTIP_COLOR,
        config.time,
        config.cta,
        config.hasClose,
        config.onClickClose,
        config.timerCountdown,
        () => {
          if (config.onEnd)
            showUIAnimation(CONFIG.filter((c) => c.id === config.onEnd)[0]);
          else showInput();
        }
      );
    } else {
      let innerHTML = `<></>`;
      // if(config.orientation === 'landscape'){
      //   innerHTML = `
      //     <div style="display:flex;flex-direction:row;align-items:center;background:${TOOLTIP_BG};padding:8px;border-radius:12px;max-width:425px;box-shadow:0 2px 8px rgba(0, 0, 0, 0.5)">
      //       <img src=${config.imageUrl} style="height:180px;border-radius:10px;margin-right:12px"/>
      //       <div id="text-area">
      //         <div style="color:${TOOLTIP_COLOR}">${config.text}</div>
      //       </div>
      //     </div>
      //   `;
      // } else {
      innerHTML = `
            <div style="display:flex;flex-direction:column;background:${TOOLTIP_BG};padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0, 0, 0, 0.3)">
              <img src=${config.imageUrl} style="height:200px;width:200px;border-radius:10px;margin-bottom:12px"/>
              <div id="text-area">
                <div style="color:${TOOLTIP_COLOR};font-size: 14px;line-height:20px">${config.text}</div>
              </div>
            </div>
          `;
      // }
      showOverlay(
        config.id,
        config.format,
        config.destination_page,
        innerHTML,
        TOOLTIP_BG,
        config.time,
        config.cta,
        config.hasClose,
        config.onClickClose,
        config.timerCountdown,
        () => {
          if (config.onEnd)
            showUIAnimation(CONFIG.filter((c) => c.id === config.onEnd)[0]);
          else showInput();
        }
      );
    }
    audio.play();
  }

  function showTooltip(
    id,
    format,
    destination_page,
    text,
    bg,
    color,
    time,
    ctaList,
    hasClose,
    onClickClose,
    timerCountdown,
    animationCB
  ) {
    currentlyAnimating = true;
    currentAnimationID = id;
    hideInput();
    const tooltipContainer = document.createElement("div");
    tooltipContainer.id = "tooltipContainer";
    tooltipContainer.style.position = "fixed";
    tooltipContainer.style.maxWidth = isMobile ? "260px" : "300px";

    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";

    const textArea = document.createElement("p");
    textArea.innerHTML = text;
    textArea.style.margin = 0;
    textArea.style.overflowWrap = "break-word";
    tooltip.appendChild(textArea);
    tooltipContainer.appendChild(tooltip);

    tooltip.style.position = "relative";
    tooltip.style.backgroundColor = bg;
    tooltip.style.color = color;
    tooltip.style.padding = "16px 20px";
    tooltip.style.borderRadius = "16px";
    // tooltip.style.fontSize = isMobile ? '16px': '16px';
    // tooltip.style.lineHeight = isMobile ? '10px': '24px';
    tooltip.style.fontSize = "16px";
    tooltip.style.lineHeight = "24px";
    tooltip.style.fontFamily = "sans-serif";
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "wrap";
    tooltip.style.zIndex = "10";
    tooltip.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.3)";
    tooltip.style.margin = "8px 0";

    function closeUI() {
      if (currentAnimationID !== id) return;
      tooltipContainer.remove();
      currentlyAnimating = false;
      animationCB();
      timeoutDisappear = null;
    }

    const closeBtn = document.createElement("button");
    closeBtn.style.background = "white";
    closeBtn.style.padding = "4px";
    closeBtn.style.border = "0";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "-6px";
    closeBtn.style.left = "-12px";
    closeBtn.style.width = "26px";
    closeBtn.style.height = "26px";
    closeBtn.style.fontSize = "10px";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.display = "flex";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.alignItems = "center";
    closeBtn.style.zIndex = "99";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)"; // Adding shadow for effect
    // closeBtn.innerHTML = 'X';

    const closeImageIcon = document.createElement("img");
    closeImageIcon.src =
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/X%20Close%20Icon.png";
    closeImageIcon.style.width = "16px";
    closeImageIcon.style.height = "16px";
    closeBtn.appendChild(closeImageIcon);

    closeBtn.addEventListener("click", () => {
      if (onClickClose) {
        if (onClickClose.alertText) {
          closeUI();
          showUIAnimation({
            hasClose: false,
            text: onClickClose.alertText,
            time: 2000,
            cta: [],
          });
          return;
        }
      }
      closeUI();
    });
    tooltipContainer.appendChild(closeBtn);

    if (timerCountdown) {
      const timer = document.createElement("div");
      timer.style.textAlign = "center";
      timer.style.padding = "2px 6px";
      timer.style.color = "#ff0000";
      timer.style.fontSize = "12px";
      timer.style.fontWeight = "bold";
      timer.style.position = "absolute";
      timer.style.top = "-8px";
      timer.style.left = "-10px";
      timer.style.borderRadius = "8px";
      timer.style.zIndex = "99";
      timer.style.background = "white";
      // timer.style.border = '1px solid black';

      function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60); // Get the minutes
        let secs = seconds % 60; // Get the remaining seconds
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
          2,
          "0"
        )}`; // Format as MM:SS
      }

      function updateTimer() {
        if (timerCountdown > 0) {
          timer.innerText = `${formatTime(timerCountdown)}`; // Display in MM:SS format
          timerCountdown--;
        } else {
          tooltipContainer.remove();
          currentlyAnimating = false;
          showInput();
        }
      }

      // Update the timer every second
      setInterval(updateTimer, 1000);
      tooltipContainer.appendChild(timer);
    }

    if (ctaList) {
      const ctaContainer = document.createElement("div");
      ctaContainer.style.marginTop = "12px";
      ctaList.map((ctaItem) => {
        const btn = document.createElement("button");
        btn.innerHTML = ctaItem.text;
        btn.style.borderRadius = "28px";
        btn.style.border = "0";
        // tooltip.style.fontSize = isMobile ? '12px': '14px';
        // tooltip.style.lineHeight = isMobile ? '16px': '18px';
        tooltip.style.fontSize = "14px";
        tooltip.style.lineHeight = "24px";
        tooltip.style.fontFamily = "sans-serif";
        btn.style.background = ctaItem.bg;
        btn.style.color = ctaItem.color;
        btn.style.padding = "10px 14px";
        btn.style.marginRight = "6px";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
          incrementClick(id);
          closeUI();
          if (format === "leadGen") {
            const parentSiteUrl = `${window.location.protocol}//${window.location.host}`;
            console.log(parentSiteUrl, "parentSiteUrl");
            sourceLink = `${CHATBOT_PAGE}/form/${id}?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}&parentSiteUrl=${parentSiteUrl}`;
            showChatWindow();
          } else if (format === "pageVisit") {
            if (destination_page)
              window.location.href = `https://${destination_page}`;
          }
        });
        ctaContainer.appendChild(btn);
      });
      tooltipContainer.appendChild(ctaContainer);
    }

    document.body.appendChild(tooltipContainer);
    tooltipContainer.style.right = isMobile ? "90px" : "120px";
    tooltipContainer.style.bottom = isMobile ? "40px" : "52px";
    tooltipContainer.style.display = "block";

    if (time) {
      timeoutDisappear = setTimeout(() => {
        closeUI();
      }, time * 1000);
    }
  }

  function showOverlay(
    id,
    format,
    destination_page,
    innerHTML,
    bg,
    time,
    ctaList,
    hasClose,
    onClickClose,
    timerCountdown,
    animationCB
  ) {
    currentlyAnimating = true;
    currentAnimationID = id;
    hideInput();
    const tooltipContainer = document.createElement("div");
    tooltipContainer.id = "tooltipContainer";
    tooltipContainer.style.position = "fixed";
    tooltipContainer.style.fontSize = isMobile ? "14px" : "16px";
    tooltipContainer.style.lineHeight = isMobile ? "18px" : "20px";
    tooltipContainer.style.fontFamily = "sans-serif";
    tooltipContainer.innerHTML = innerHTML;

    function closeUI() {
      if (currentAnimationID !== id) return;
      tooltipContainer.remove();
      currentlyAnimating = false;
      animationCB();
      timeoutDisappear = null;
    }

    const closeBtn = document.createElement("button");
    closeBtn.style.background = "white";
    closeBtn.style.padding = "2px";
    closeBtn.style.border = "none";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "-12px";
    closeBtn.style.left = "-12px";

    closeBtn.style.width = "26px";
    closeBtn.style.height = "26px";
    closeBtn.style.fontSize = "10px";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.display = "flex";
    closeBtn.style.justifyContent = "center";
    closeBtn.style.alignItems = "center";
    closeBtn.style.zIndex = "99";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)"; // Adding shadow for effect

    const closeImageIcon = document.createElement("img");
    closeImageIcon.src =
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/X%20Close%20Icon.png";
    closeImageIcon.style.width = "16px";
    closeImageIcon.style.height = "16px";
    closeBtn.appendChild(closeImageIcon);

    closeBtn.addEventListener("click", () => {
      if (onClickClose) {
        if (onClickClose.alertText) {
          closeUI();
          showUIAnimation({
            hasClose: false,
            text: onClickClose.alertText,
            time: 2000,
            cta: [],
          });
          return;
        }
      }
      closeUI();
    });
    tooltipContainer.appendChild(closeBtn);

    if (timerCountdown) {
      const timer = document.createElement("div");
      timer.style.textAlign = "center";
      timer.style.padding = "2px 6px";
      timer.style.color = "#ff0000";
      timer.style.fontSize = "12px";
      timer.style.fontWeight = "bold";
      timer.style.position = "absolute";
      timer.style.top = "-8px";
      timer.style.left = "-10px";
      timer.style.borderRadius = "8px";
      timer.style.zIndex = "99";
      timer.style.background = "white";

      function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60); // Get the minutes
        let secs = seconds % 60; // Get the remaining seconds
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
          2,
          "0"
        )}`; // Format as MM:SS
      }

      function updateTimer() {
        if (timerCountdown > 0) {
          timer.innerText = `${formatTime(timerCountdown)}`; // Display in MM:SS format
          timerCountdown--;
        } else {
          tooltipContainer.remove();
          currentlyAnimating = false;
          showInput();
        }
      }

      // Update the timer every second
      setInterval(updateTimer, 1000);
      tooltipContainer.appendChild(timer);
    }

    if (ctaList) {
      const ctaContainer = document.createElement("div");
      ctaContainer.style.marginTop = "4px";
      ctaList.map((ctaItem) => {
        const btn = document.createElement("button");
        btn.innerHTML = ctaItem.text;
        btn.style.borderRadius = "28px";
        btn.style.width = "100%";
        btn.style.border = 0;
        btn.style.background = ctaItem?.bg;
        btn.style.color = ctaItem?.color;
        btn.style.padding = "10px 14px";
        btn.style.marginTop = "4px";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => {
          incrementClick(id);
          closeUI();
          if (format === "leadGen") {
            sourceLink = `${CHATBOT_PAGE}/form/${id}?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}`;
            showChatWindow();
          } else if (format === "pageVisit") {
            if (destination_page)
              window.location.href = `https://${destination_page}`;
          }
        });
        ctaContainer.appendChild(btn);
      });
      const container = tooltipContainer.querySelector("#text-area");
      container.appendChild(ctaContainer);
    }

    document.body.appendChild(tooltipContainer);
    const canvas = document.getElementById("threejs-canvas");
    const canvasBounds = canvas.getBoundingClientRect();
    tooltipContainer.style.right = isMobile ? "90px" : "120px";
    tooltipContainer.style.bottom = isMobile ? "12px" : "20px";
    tooltipContainer.style.display = "block";

    if (time) {
      timeoutDisappear = setTimeout(() => {
        closeUI();
      }, time * 1000);
    }
  }

  function playModifierAnimation(from, fSpeed, finalAnim, tSpeed) {
    const to = finalAnim.clip;

    // Ensure the new animation (to) is ready to play and is looped if necessary
    to.setLoop(THREE.LoopRepeat);
    to.reset(); // Resets the animation state
    to.play(); // Start playing the 'to' animation

    // Apply fade-in for the incoming animation
    from.crossFadeTo(to, fSpeed, true);

    // After the fade-in completes, we set up the fade-out when the animation reaches its end
    setTimeout(function () {
      from.enabled = true; // Ensure the original animation can be re-enabled for the next fade
      // Now apply fade-out and return to the 'from' animation
      to.crossFadeTo(from, tSpeed, true);
    }, to._clip.duration * 1000 - (tSpeed + fSpeed) * 1000);
  }

  function appendInput() {
    // Create an input element (rounded input box)
    const inputContainer = document.createElement("div");
    inputContainer.id = "input";
    inputContainer.style.background = "linear-gradient(45deg, purple, blue)";
    inputContainer.style.padding = "1px";
    inputContainer.style.position = "relative";
    inputContainer.style.borderRadius = "20px"; // Rounded corners
    const input = document.createElement("div");
    input.innerHTML = "Ask me anything"; // Set the input value to the message
    inputContainer.appendChild(input);
    inputContainer.style.display = "none";

    input.style.setProperty("--placeholder-color", "#9C9C9C"); // Fallback if inline CSS doesn't work
    input.style.setProperty("--placeholder-font-size", "24px");

    // Inline styles for placeholder
    const style = document.createElement("style");
    style.innerHTML = `
        #input input::placeholder {
          color: var(--placeholder-color, gray);  // Change color to gray
          font-size: var(--placeholder-font-size, 16px); // Change font size to 16px
        }
      `;
    document.head.appendChild(style);

    // Styling the input to make it look like a rounded box
    input.style.color = "#000";
    input.style.background = "#fff";
    input.style.color = "#8F8F8F";
    input.style.fontSize = "14px";
    input.style.lineHeight = "36px";
    input.style.fontFamily = "sans-serif";
    input.style.padding = "0px 20px";
    input.style.width = isMobile ? "62vw" : "220px";
    input.style.height = "36px";
    input.style.borderRadius = "20px"; // Rounded corners
    input.style.fontSize = "14px";
    input.style.cursor = "pointer";
    input.style.zIndex = "10";

    const imageIcon = document.createElement("img");
    imageIcon.src =
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Ask%20me%20Anything%20Animation.gif";
    imageIcon.style.position = "absolute";
    imageIcon.style.top = "-1px";
    imageIcon.style.right = "2px";
    imageIcon.style.width = "48px";
    imageIcon.style.height = "40px";
    inputContainer.appendChild(imageIcon);

    // Positioning of the input box
    inputContainer.style.position = "fixed";
    inputContainer.style.bottom = isMobile ? "8px" : "32px";
    inputContainer.style.right = isMobile ? "80px" : "108px";

    // Add the input element to the body
    document.body.appendChild(inputContainer);

    appendChatWindow();

    // Show the input box for the given time, then hide it
    if (!currentlyAnimating) {
      showInput();
    } else {
      hideInput();
    }
    input.addEventListener("click", (e) => {
      e.preventDefault();
      sourceLink = `${CHATBOT_PAGE}/chat?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}`;
      showChatWindow();
    });
  }

  function showInput() {
    if (currentlyAnimating) return;
    const input = document.getElementById("input");
    input.style.display = "block";
  }

  function hideInput() {
    const input = document.getElementById("input");
    input.style.display = "none";
  }

  function appendChatWindow() {
    // Create a container for the chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = "chatWindow";

    // Styling the chat window to look like a small chat box
    chatWindow.style.position = "fixed";
    chatWindow.style.boxSizing = "border-box";
    chatWindow.style.border = isMobile ? 0 : "0.3px solid #8F8F8F";
    chatWindow.style.color = "#fff";
    chatWindow.style.borderRadius = isMobile ? 0 : "16px";
    chatWindow.style.background = "#fff";
    chatWindow.style.fontSize = "14px";
    chatWindow.style.width = isMobile ? "100%" : "390px"; // Small chat window width
    chatWindow.style.height = isMobile ? "100%" : "625px"; // Fixed chat window height
    chatWindow.style.bottom = isMobile ? 0 : "20px"; // Position it at the bottom of the screen
    chatWindow.style.right = isMobile ? 0 : "20px"; // Align it to the bottom right corner
    chatWindow.style.zIndex = "1000";
    chatWindow.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)"; // Adding shadow for effect
    const merchantId = localStorage.getItem("merchantId");
    const iframeContainer = document.createElement("iframe");
    iframeContainer.id = "chatbot-iframe";
    iframeContainer.src = `${sourceLink}?source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}&merchantId=${merchantId}`;
    iframeContainer.style.width = "100%";
    iframeContainer.style.height = "100%";
    iframeContainer.style.border = 0;
    iframeContainer.style.borderRadius = isMobile ? 0 : "16px";

    chatWindow.appendChild(iframeContainer);

    // Create a close button inside the chat header
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "×"; // Close (X) symbol
    closeButton.style.cursor = "pointer";
    closeButton.style.position = "absolute";
    closeButton.style.right = "16px";
    closeButton.style.top = "8px";
    closeButton.style.fontSize = "24px";
    closeButton.style.color = "#fff";

    // Close chat window when close button is clicked
    closeButton.onclick = function () {
      chatWindow.style.display = "none";
    };

    chatWindow.appendChild(closeButton);
    document.body.appendChild(chatWindow);

    chatWindow.style.display = "none";
  }

  function showChatWindow() {
    const chat = document.getElementById("chatWindow");
    const chatbot = document.getElementById("chatbot-iframe");
    chatbot.src = sourceLink;
    setTimeout(() => {
      chat.style.display = "block";
    }, 200);
  }

  if (!isMobile) {
    let timer = setTimeout(() => resetHead());
    document.addEventListener("mousemove", function (e) {
      if (currentlyAnimating) return;
      if (timer) {
        clearTimeout(timer);
        timer = setTimeout(() => resetHead(), 4000);
      }
      var mousecoords = getMousePos(e);
      if (neck && !currentlyAnimating) {
        moveJoint(mousecoords, neck, 50);
        // moveJoint(mousecoords, waist, 30);
      }
    });
  }

  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }

  function resetHead() {
    let w = { x: window.innerWidth, y: window.innerHeight };

    const xRef = w.x - 160;
    const yRef = w.y - 190;

    moveJoint({ x: xRef, y: yRef }, neck, 50);
    moveJoint({ x: xRef, y: yRef }, waist, 30);
  }

  function moveJoint(mouse, joint, degreeLimit) {
    let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    if (joint) {
      joint.rotation.y = THREE.Math.degToRad(degrees.x);
      joint.rotation.x = THREE.Math.degToRad(degrees.y);
    }
  }

  function getMouseDegrees(x, y, degreeLimit) {
    let dx = 0,
      dy = 0,
      xdiff,
      xPercentage,
      ydiff,
      yPercentage;

    let w = { x: window.innerWidth, y: window.innerHeight };

    // Left (Rotates neck left between 0 and -degreeLimit)

    const xRef = w.x - 160;
    const yRef = w.y - 190;

    if (x <= xRef) {
      // Get the difference between model and cursor position
      xdiff = xRef - x;
      // Find the percentage of that difference (percentage toward edge of screen)
      xPercentage = (xdiff / xRef) * 100;
      // Convert that to a percentage of the maximum rotation we allow for the neck
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }
    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= xRef) {
      xdiff = x - xRef;
      xPercentage = (xdiff / xRef) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= yRef) {
      ydiff = yRef - y;
      yPercentage = (ydiff / yRef) * 100;
      // Note that I cut degreeLimit in half when she looks up
      dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
    }

    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= yRef) {
      ydiff = y - yRef;
      yPercentage = (ydiff / yRef) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
  }

  // ******************************************************************** INTERACTIONS ********************************************************************

  //*************************************************WELCOME NEW VISITOR AND RETURNING VISITOR MESSAGE*****************************************************

  // Add the welcome message function after the init() function
  function checkAndShowWelcomeMessage() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showWelcomeMessage);
    } else {
      showWelcomeMessage();
    }
  }

  function showWelcomeMessage() {
    const hasWelcomeVisitor = localStorage.getItem("hasWelcomeVisitor");

    if (!hasWelcomeVisitor) {
      localStorage.setItem("hasWelcomeVisitor", "true");
      // Show first-time visitor message after 1 second
      setTimeout(() => {
        showUIAnimation({
          text: "Hey! I'm Frexy, your personal AI assistant 😃. I'm here to help, guide, or even entertain.",
          time: 5,
          hasClose: true,
          animation: "wave",
        });
      }, 1000);
    } else if (hasWelcomeVisitor === "true") {
      // Show returning visitor message after 3 seconds
      setTimeout(() => {
        showUIAnimation({
          text: "Hey there, welcome back! I've been waiting for you. Need any help?",
          time: 5,
          hasClose: true,
          animation: "wave",
        });
      }, 3000);
    }
  }

  //*************************************************EXIT INTENT HANDLER*****************************************************

  function isFirstTimeVisit() {
    console.log("Checking first time visit");
    const userAlreadyVisited = localStorage.getItem("hasNewVisitor");
    if (!userAlreadyVisited) {
      console.log("This is a first time visit");
      localStorage.setItem("hasNewVisitor", "true");
      return true;
    } else {
      console.log("This is not a first time visit");
      return false;
    }
  }

  function hasVisitedInternalPages() {
    return localStorage.getItem("visitedInternalPages") === "true";
  }

  function markInternalPageVisit() {
    localStorage.setItem("visitedInternalPages", "true");
  }

  function checkInternalNavigation() {
    const initialPath =
      localStorage.getItem("initialPath") || window.location.pathname;
    if (window.location.pathname !== initialPath) {
      markInternalPageVisit();
    }
  }

  // Add route change listener for Next.js
  let lastPath = window.location.pathname;
  const avoidBounceObserver = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      checkInternalNavigation();
    }
  });

  avoidBounceObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  if (!localStorage.getItem("initialPath")) {
    localStorage.setItem("initialPath", window.location.pathname);
  }

  function getScrollPercentage() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100 || 0;
  }

  class ExitIntentHandler {
    constructor() {
      console.log("Initializing ExitIntentHandler");
      this.sessionStartTime = Date.now();
      this.hasInteracted = false;
      this.hasReachedBottom = false;
      this.isFirstVisit = isFirstTimeVisit();
      this.handleMouseMovement = this.handleMouseMovement.bind(this);
      this.lastY = null;
      this.mouseMovingUp = false;
      this.setupEventListeners();
    }

    setupEventListeners() {
      console.log("Setting up event listeners");
      // document.addEventListener("mousemove", (e) => {
      //   console.log(`Raw mouse position - X: ${e.clientX}, Y: ${e.clientY}`);
      // });
      document.addEventListener("mousemove", this.handleMouseMovement);
      document.addEventListener("scroll", () => {
        const currentScrollPercentage = getScrollPercentage();
        console.log("Current scroll percentage:", currentScrollPercentage);
        if (currentScrollPercentage >= 98) {
          this.hasReachedBottom = true;
          console.log("User has reached bottom of page");
        }
      });
      console.log("Event listeners setup complete");
    }

    handleMouseMovement(event) {
      if (this.hasInteracted || currentlyAnimating) {
        return;
      }

      const currentY = event.clientY;
      const currentX = event.clientX;

      if (this.lastY === null) {
        this.lastY = currentY;
        return;
      }

      this.mouseMovingUp = currentY < this.lastY;
      this.lastY = currentY;

      const timeSinceStart = Date.now() - this.sessionStartTime;
      const isWithin30Seconds = timeSinceStart <= 30000;
      const scrollPercentage = getScrollPercentage();
      const isNearTop = event.clientY < 100;
      const isMovingUpward = this.mouseMovingUp;
      const isFirstVisit = this.isFirstVisit;
      const hasNotVisitedInternalPages = !hasVisitedInternalPages();

      console.log("Condition check:", {
        timeSinceStart,
        isWithin30Seconds,
        scrollPercentage,
        isNearTop,
        isMovingUpward,
        isFirstVisit,
        hasNotVisitedInternalPages,
      });

      if (
        isWithin30Seconds &&
        isMovingUpward &&
        isNearTop &&
        scrollPercentage < 90 &&
        isFirstVisit &&
        hasNotVisitedInternalPages
      ) {
        console.log("⭐ All conditions met, triggering interaction");
        this.triggerInteraction();
      }
    }

    triggerInteraction() {
      this.hasInteracted = true;
      showUIAnimation({
        text: "Wait, wait, wait! I've been practicing my dance moves, watch this! 🕺",
        time: 5,
        hasClose: true,
        animation: "celebration",
        cta: [
          {
            text: "Show me!",
            bg: "#BE0EFF",
            color: "#fff",
          },
        ],
      });
      document.removeEventListener("mousemove", this.handleMouseMovement);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    window.exitIntentHandler = new ExitIntentHandler();
    checkInternalNavigation();
  });

  window.addEventListener("load", () => {
    console.log("Window loaded");
    if (!window.exitIntentHandler) {
      window.exitIntentHandler = new ExitIntentHandler();
    }
    checkInternalNavigation();
  });
})(); // Don't add anything below this line
