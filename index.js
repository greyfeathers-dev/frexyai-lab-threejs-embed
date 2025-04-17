/** @format */
localStorage.clear();
sessionStorage.clear();

// ***************************************************************** ENCRYPTION KEYS *****************************************************************
const supabaseUrl = "https://nbizksjfzehbiwmcipep.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaXprc2pmemVoYml3bWNpcGVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NTM3MDQsImV4cCI6MjA0NDEyOTcwNH0.t21-ZutMm4eRFPfYnUsu0y2dBqADN1yTUfeMWJs1eeg";

// Initialize Supabase client
let supabase = null;

// Function to initialize Supabase client
function initializeSupabase() {
  if (typeof window.supabase !== "undefined") {
    supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    return true;
  }
  return false;
}

// Try to initialize immediately
if (!initializeSupabase()) {
  // If initialization fails, wait for the script to load
  window.addEventListener("load", function () {
    let attempts = 0;
    const maxAttempts = 10;

    function tryInitialize() {
      if (initializeSupabase()) {
        console.log("Supabase client initialized successfully");
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryInitialize, 500);
      } else {
        console.error(
          "Failed to initialize Supabase client after multiple attempts"
        );
      }
    }

    tryInitialize();
  });
}

const leadIdLocal = localStorage.getItem("leadId");

// Add ElevenLabs configuration
const ELEVENLABS_API_KEY =
  "sk_09a3f745c965e473ddf6ec867b9cfe268aad70a5a15c56ff"; // Replace with your actual API key
const ELEVENLABS_VOICE_ID = "CYw3kZ02Hs0563khs1Fj"; // Replace with your desired voice ID
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

const CHATBOT_PAGE = "https://frexyai-lab-saas-dashboard-staging.vercel.app";
const ENDPOINT = "https://node-service-1e6u.onrender.com";

// ***************************************************************************************************************************************************

const MODEL_TEXTURE =
  "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Steve/Texture/model_texture.png";

// const MODEL_TEXTURE =
//   "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/base%20colour%20(1).png";

const TOOLTIP_BG = "#fff";
const TOOLTIP_COLOR = "#0D1934";
const audio = new Audio(
  "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/notification.mp3"
);
// const user_id = localStorage.getItem("merchantId");
const user_id = "82408252-28a4-422d-94be-e1c5fba157d0";

const BASE_MODEL = {
  model_url:
    "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Steve/Models/breathing_idle.glb",
  animation: "relaxed_grip", // Changed from 'idle' to match the actual animation name
};

// const BASE_MODEL = {
//   model_url:
//     "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/idle.glb",
//   animation: "idle",
// };

const ANIMATION_LIST = [
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Steve/Models/relaxed_grip.glb",
    animation: "relaxed_grip",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Anto/Casual%20Talk%201.glb",
    animation: "casual_talk_1",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Anto/Dance%20Like%20Anto.glb",
    animation: "dance_like_anto",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Anto/Relaxed%20Grip.glb",
    animation: "relaxed_grip",
  },
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Anto/Casual%20Talk%202.glb",
    animation: "casual_talk_2",
  },
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
  {
    model_url:
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/Anto/Wait%20Up.glb",
    animation: "wait_up",
  },
];

// ********************************************************************************* SVG ICONS *********************************************************************************
function getMuteIcon() {
  return `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.61689 2.44586L2.44189 3.62086L6.07523 7.25419L5.83356 7.5042H2.50023V12.5042H5.83356L10.0002 16.6709V11.1792L13.4836 14.6625C12.9419 15.0709 12.3336 15.3959 11.6669 15.5875V17.3042C12.7836 17.0542 13.8086 16.5375 14.6752 15.8459L16.3836 17.5542L17.5586 16.3792L3.61689 2.44586ZM8.33356 12.6459L6.52523 10.8375H4.16689V9.17086H6.52523L7.25856 8.43753L8.33356 9.51253V12.6459ZM15.8336 10.0042C15.8336 10.6875 15.7086 11.3459 15.4919 11.9542L16.7669 13.2292C17.2336 12.2542 17.5002 11.1625 17.5002 10.0042C17.5002 6.43753 15.0086 3.4542 11.6669 2.69586V4.41253C14.0752 5.1292 15.8336 7.36253 15.8336 10.0042ZM10.0002 3.33753L8.43356 4.9042L10.0002 6.47086V3.33753ZM13.7502 10.0042C13.7502 8.5292 12.9002 7.26253 11.6669 6.64586V8.13753L13.7336 10.2042C13.7419 10.1375 13.7502 10.0709 13.7502 10.0042Z" fill="#414141"/>
</svg>
  `;
}

// SVG for unmute icon
function getUnmuteIcon() {
  return `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 7.49998V12.5H5.83333L10 16.6667V3.33332L5.83333 7.49998H2.5ZM8.33333 7.35832V12.6417L6.525 10.8333H4.16667V9.16665H6.525L8.33333 7.35832ZM13.75 9.99998C13.75 8.52498 12.9 7.25832 11.6667 6.64165V13.35C12.9 12.7417 13.75 11.475 13.75 9.99998ZM11.6667 2.69165V4.40832C14.075 5.12498 15.8333 7.35832 15.8333 9.99998C15.8333 12.6417 14.075 14.875 11.6667 15.5917V17.3083C15.0083 16.55 17.5 13.5667 17.5 9.99998C17.5 6.43332 15.0083 3.44998 11.6667 2.69165Z" fill="#414141"/>
</svg>
  `;
}
// ************************************************************************************************************************************************************************

// ***************************************************************AUDIO API CALLS************************************************************************************

// Function to convert text to speech using ElevenLabs
async function convertTextToSpeech(text) {
  console.log(text, "text in convert text to speech");
  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error("Error converting text to speech:", error);
    return null;
  }
}

// Function to upload audio to Supabase storage
async function uploadAudioToStorage(audioBlob, interactionName) {
  try {
    const timestamp = Date.now();
    const sanitizedInteractionName = interactionName.replace(/\s+/g, "_");
    const filename = `leads/${leadIdLocal}/${sanitizedInteractionName}_${timestamp}.mp3`;

    console.log(
      leadIdLocal,
      filename,
      "leadId from local storage in interactions"
    );

    const { data, error } = await supabase.storage
      .from("interactions")
      .upload(filename, audioBlob, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      console.log(error, "error in uploading audio to storage in interactions");
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("interactions")
      .getPublicUrl(filename);
    console.log(publicUrlData, "public url data in interactions");

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading audio to storage:", error);
    return null;
  }
}

// ************************************************************************************************************************************************************************
(function () {
  // Set our main variables
  let scene,
    renderer,
    camera,
    model, // Our character
    neck, // Reference to the neck bone in the skeleton
    waist, // Reference to the waist bone in the skeleton
    jaw, // Add jaw reference
    upperJaw, // Add upper jaw reference
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
  let leadData = null;

  let isMuted = true;

  function enableAudioOnUserInteraction() {
    const unmute = () => {
      if (!isMuted) return; // Already unmuted

      isMuted = false;
      console.log("User interacted, audio enabled");

      // Remove the event listeners after first interaction
      window.removeEventListener("click", unmute);
      window.removeEventListener("keydown", unmute);
      window.removeEventListener("touchstart", unmute);
    };

    // Add interaction event listeners
    window.addEventListener("click", unmute);
    window.addEventListener("keydown", unmute);
    window.addEventListener("touchstart", unmute);
  }

  // Call this early in your app/script
  enableAudioOnUserInteraction();

  // ***************************************************************LEADS API CALLS************************************************************************************

  const getLeadsData = async () => {
    // const leadId = "1743157089204-1gqwxib4tv4";
    try {
      console.log(leadIdLocal, "leadId from local storage in interactions");
      const response = await fetch(
        `${supabaseUrl}/rest/v1/leads?id=eq.${leadIdLocal}`,
        {
          method: "GET",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const leads = await response.json();
      console.log("LEADS FROM FETCH", leads);
      leadData = leads[0];

      // Extract the required information
      const leadInfo = {
        firstName: leadData?.name ? leadData.name.split(" ")[0] : null,
        jobTitle: leadData?.job_title || null,
        company: leadData?.company || null,
        country: leadData?.country || null,
        source: leadData?.source || null,
      };

      return leadInfo;
    } catch (error) {
      console.error("Failed to get interactions:", error);
      return [];
    }
  };
  getLeadsData();

  const UpdateLeadsData = async (name, audioBlob, message) => {
    try {
      // Upload audio to storage using interaction name
      const audioUrl = await uploadAudioToStorage(audioBlob, name);
      console.log(audioUrl, "audio url in update leads data");
      if (!audioUrl) {
        throw new Error("Failed to upload audio");
      }

      // Check if the record already exists
      const existingData = await fetchExistingInteractionData(name);

      let method = "POST";
      let url = `${supabaseUrl}/rest/v1/leads_interactions_audio`;

      if (existingData) {
        // If record exists, update it
        method = "PATCH";
        url += `?id=eq.${leadIdLocal}&interaction_name=eq.${name}`;
      }

      // Update or insert the leads_interactions_audio table
      const response = await fetch(url, {
        method: method,
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadIdLocal,
          audio_url: audioUrl,
          interaction_name: name,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Audio uploaded and data updated successfully");
      return audioUrl;
    } catch (error) {
      console.error("Error in UpdateLeadsData:", error);
      return null;
    }
  };

  // ************************************************************************************************************************************************************************

  init();
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  let CONFIG = [];
  let INTERACTION_DATA = [];

  // ============================================= MODEL INITIALIZATION AND CONFIGURATION FUNCTIONS =============================================

  function init() {
    fetchConfig();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    firstPageVisited = window.location.href;
    country = Intl.DateTimeFormat().resolvedOptions().timeZone;
    source = getSource();
    const MODEL_PATH = BASE_MODEL.model_url;

    const fallbackLoader = document.createElement("div");
    fallbackLoader.id = "loader";
    const merchantId = localStorage.getItem("merchantId");
    const parentSiteUrl = `${window.location.protocol}//${window.location.host}`;
    sourceLink = `${CHATBOT_PAGE}/chat?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}&merchantId=${merchantId}&parentSiteUrl=${parentSiteUrl}`;
    if (document.body) {
      document.body.appendChild(fallbackLoader);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        document.body.appendChild(fallbackLoader);
      });
    }

    // Add loader to the page before the 3D model loads
    const style = document.createElement("style");
    style.type = "text/css";
    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

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

      #tooltip, #input, button {
        font-family: 'Inter', sans-serif;
      }
      `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // Create the canvas element
    const canvas = document.createElement("canvas");
    canvas.id = "threejs-canvas";
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.bottom = "-40px";
    canvas.style.right = isMobile ? "-76px" : "-45px";
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
        model = gltf.scene;
        let fileAnimations = gltf.animations;

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
          // Add detailed bone logging
          if (o.isBone) {
            console.log("Found bone:", o.name);
            if (o.name === "CC_Base_Head") {
              neck = o;
              console.log("Found neck bone:", neck);
            }
            if (o.name === "spine_01x") {
              waist = o;
              console.log("Found waist bone:", waist);
            }
            if (o.name === "CC_Base_JawRoot") {
              jaw = o;
              console.log("Found jaw bone:", jaw);
              console.log("Initial jaw quaternion:", jaw.quaternion);
              console.log("Jaw parent hierarchy:", getParentHierarchy(jaw));
            }
            if (o.name === "CC_Base_UpperJaw") {
              upperJaw = o;
              console.log("Found upper jaw bone:", upperJaw);
              console.log("Initial upper jaw quaternion:", upperJaw.quaternion);
              console.log(
                "Upper jaw parent hierarchy:",
                getParentHierarchy(upperJaw)
              );
            }
          }
        });

        // Add helper function to get parent hierarchy
        function getParentHierarchy(bone) {
          const hierarchy = [];
          let current = bone;
          while (current.parent) {
            hierarchy.unshift(current.parent.name || "unnamed");
            current = current.parent;
          }
          return hierarchy;
        }

        model.scale.set(12, 12, 12);
        model.position.y = -12;
        scene.add(model);

        // Initialize animation mixer
        mixer = new THREE.AnimationMixer(model);

        // Handle idle animation
        if (fileAnimations && fileAnimations.length > 0) {
          let idleAnim = fileAnimations[0]; // Use first animation as idle
          idleAnim.name = "idle"; // Set the name to idle

          const idleAction = mixer.clipAction(idleAnim);
          idleAction.setLoop(THREE.LoopRepeat, Infinity);
          idle = idleAction;
          idle.play();
        }

        // Remove loader after successful model load
        const loader = document.getElementById("loader");
        if (loader) {
          loader.remove();
        }

        // Load additional animations after model is ready
        loadAdditionalAnimations(gltf);

        // Run diagnostic functions
        inspectModelBones();
        checkAnimations();

        // Start jaw animation after model is loaded
        animateJaw(3);

        // Add diagnostic call
        diagnoseModelIssues();
      },
      undefined,
      function (error) {
        console.error("Error loading model:", error);
      }
    );

    //====================================================Model Click Event Listener====================================================

    // Add click handler function
    function onModelClick(event) {
      if (currentlyAnimating) return;

      // Check if Click-to-Dance interaction is enabled
      const clickToDanceInteraction = INTERACTION_DATA.find(
        (i) => i.key === "Click-to-Dance"
      );

      if (!clickToDanceInteraction || !clickToDanceInteraction.status) {
        console.log("Click-to-Dance interaction is not enabled");
        return;
      }

      // Get the canvas element and its bounds
      const canvas = renderer.domElement;
      const rect = canvas.getBoundingClientRect();

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      // Ensure model's world matrix is updated
      model.updateMatrixWorld(true);

      // Get all meshes from the model for intersection testing
      const meshes = [];
      model.traverse((child) => {
        if (child.isMesh) {
          meshes.push(child);
        }
      });

      // Calculate objects intersecting the picking ray using the collected meshes
      const intersects = raycaster.intersectObjects(meshes, true);

      // Make intersection detection more lenient - if click is close enough to model
      if (intersects.length > 0 || isClickNearModel(x, y)) {
        currentlyAnimating = true;

        // Find dance animation
        const danceAnim = possibleAnims.find(
          (anim) => anim.name === "dance_like_anto"
        );

        if (danceAnim) {
          playModifierAnimation(idle, 0.5, danceAnim, 0.5);

          // Reset currentlyAnimating after animation duration
          const animationDuration = danceAnim.clip._clip.duration * 1000; // Convert to milliseconds
          setTimeout(() => {
            currentlyAnimating = false;
          }, animationDuration);
        } else {
          // Fallback to celebration animation
          const celebrationAnim = possibleAnims.find(
            (anim) => anim.name === "celebration"
          );
          if (celebrationAnim) {
            playModifierAnimation(idle, 0.5, celebrationAnim, 0.5);
            setTimeout(() => {
              currentlyAnimating = false;
            }, celebrationAnim.clip._clip.duration * 1000);
          } else {
            currentlyAnimating = false;
          }
        }
      }
    }

    // Helper function to check if click is near the model
    function isClickNearModel(x, y) {
      // Convert model position to screen coordinates
      const modelPos = new THREE.Vector3(0, -11, 0);
      modelPos.project(camera);

      // Calculate distance between click and model center
      const dx = x - modelPos.x;
      const dy = y - modelPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Consider click "near" if within this threshold
      return distance < 1; // Increased threshold for better head detection
    }

    //====================================================End of Model Click Event Listener====================================================

    // Enhanced lighting setup
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
    dirLight.position.set(-9, 12, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    let d = 12; // Increased shadow camera size
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    dirLight.shadow.bias = -0.0005; // Adjusted bias for better shadow quality
    dirLight.shadow.normalBias = 0.01; // Added normal bias for better shadow edges
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
      opacity: 0.4, // Increased opacity for better shadow visibility
    });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -12; // Adjusted floor position to match model
    scene.add(floor);
  }

  // ============================================= ANIMATION LOADING FUNCTIONS =================================================================

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
          newGLTF.animations.forEach((anim) => {
            console.log("Loading animation:", animationItem.animation); // Debug animation loading
            anim.name = animationItem.animation;
          });

          gltf.animations.push(...newGLTF.animations);

          // Update possible animations list
          const newAnim = newGLTF.animations[0];
          if (newAnim) {
            const clonedAnim = newAnim.clone();
            // Only filter scale and position tracks, keep all bone animations
            clonedAnim.tracks = clonedAnim.tracks
              .filter((track) => !track.name.includes("scale"))
              .filter((track) => !track.name.includes("position"));

            const action = mixer.clipAction(clonedAnim);
            action.setLoop(THREE.LoopRepeat);

            possibleAnims?.push({
              name: animationItem.animation,
              clip: action,
            });

            console.log("Added animation:", animationItem.animation); // Debug animation addition
          }
        },
        undefined,
        function (error) {
          console.error(
            `Error loading animation for ${animationItem.animation}:`,
            error
          );
        }
      );
    });

    // Initialize UI elements after animations are loaded
    appendInput();
    triggerConfig();
    trackButtonEvents();
    addActivity({
      type: "pageVisit",
      source: getSource(),
    });
  }

  // ============================================= SOURCE DETECTION FUNCTIONS =============================================

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

  // ============================================= CONFIG FETCHING FUNCTIONS =============================================

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
      console.log("CONFIG FROM FETCH", CONFIG);
      triggerConfig();
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  // ============================================= BUTTON EVENT TRACKING FUNCTIONS =============================================

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

  // ============================================= OFFER CLICK TRACKING FUNCTIONS =============================================

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

  // ============================================= OFFER IMPRESSION TRACKING FUNCTIONS =============================================

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

  // ============================================= ACTIVITY ADDING FUNCTIONS =============================================

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

  // ============================================= RENDERING FUNCTIONS =============================================

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

  // ============================================= RESIZE RENDERER TO DISPLAY SIZE FUNCTIONS =============================================

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
  let isInteractionActive = false; // Add this flag at the top with other state variables

  // ============================================= PATH CHANGE EVENT FUNCTIONS =============================================

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

  // ============================================= LEAD ID SETTING FUNCTIONS =============================================

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

  // ============================================= CONFIG TRIGGERING FUNCTIONS =============================================

  function triggerConfig() {
    console.log("triggering config", CONFIG);
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
            // showUIAnimation(config);
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
                  // showUIAnimation(config), config.delay;
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

  // ============================================= UI ANIMATION FUNCTIONS =============================================

  function showUIAnimation(config) {
    console.log("showUIAnimation called with config:", config);
    console.log("Current state:", {
      currentlyAnimating,
      isInteractionActive,
      hasText: Boolean(config.text),
      animationType: config.animation,
    });

    if (currentlyAnimating) {
      console.log("Animation already in progress, returning");
      return;
    }

    resetHead();
    isInteractionActive = true;

    // Start jaw animation if we have text to display
    if (config.text) {
      console.log("Starting UI animation with jaw movement");
      // animateJaw(config.time || 10);
    }

    let animationIdx = -1;
    if (config.animation) {
      animationIdx = possibleAnims?.findIndex(
        (animation) => animation.name === config.animation
      );
      console.log(
        "Animation index found:",
        animationIdx,
        "for animation:",
        config.animation
      );
    }

    const type = config.imageUrl ? "overlay" : "tooltip";
    console.log("UI type:", type);

    hideInput();

    if (animationIdx >= 0) {
      console.log("Playing animation:", possibleAnims[animationIdx].name);
      playModifierAnimation(idle, 1, possibleAnims[animationIdx], 1.5);
    }

    incrementImpression(config.id);

    // Play notification sound
    setTimeout(() => {
      console.log("Playing notification sound");
      const notificationSound = new Audio("/notification.mp3");
      notificationSound.volume = 0.5;
      notificationSound.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }, 100);

    if (type === "tooltip") {
      console.log("Showing tooltip with text:", config.text);
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
          console.log("Tooltip callback triggered");
          if (config.onEnd) {
            console.log("Showing next animation");
            showUIAnimation(CONFIG.filter((c) => c.id === config.onEnd)[0]);
          } else {
            console.log("Resetting UI state");
            showInput();
            isInteractionActive = false;
          }
        }
      );
    } else {
      let innerHTML = `<></>`;
      innerHTML = `
            <div style="display:flex;flex-direction:column;background:${TOOLTIP_BG};padding:16px;border-radius:12px;box-shadow:0 2px 8px rgba(0, 0, 0, 0.3)">
              <img src=${config.imageUrl} style="height:200px;width:200px;border-radius:10px;margin-bottom:12px"/>
              <div id="text-area">
                <div style="color:${TOOLTIP_COLOR};font-size: 14px;line-height:20px">${config.text}</div>
              </div>
            </div>
          `;
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
          else {
            showInput();
            isInteractionActive = false;
          }
        }
      );
    }
  }

  // ============================================= TOOLTIP FUNCTIONS =============================================

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
    tooltipContainer.style.maxWidth = isMobile ? "260px" : "310px";

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
    tooltip.style.padding = "14px 18px";
    tooltip.style.paddingRight = "34px";

    tooltip.style.borderRadius = "17px";
    tooltip.style.fontSize = "14px";
    tooltip.style.color = "#0D1934";
    tooltip.style.lineHeight = "24px";
    tooltip.style.fontFamily = "Inter, sans-serif";
    tooltip.style.fontWeight = "400";
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "wrap";
    tooltip.style.zIndex = "10";
    tooltip.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.3)";
    tooltip.style.margin = "8px 0";

    const controlsContainer = document.createElement("div");
    controlsContainer.style.position = "absolute";
    controlsContainer.style.top = "27px";
    controlsContainer.style.right = "13px";
    controlsContainer.style.left = "auto";
    controlsContainer.style.display = "flex";

    // Add audio toggle button
    const audioToggleBtn = document.createElement("button");
    audioToggleBtn.style.background = "white";
    audioToggleBtn.style.padding = "4px";
    audioToggleBtn.style.border = "0";
    audioToggleBtn.style.width = "16px";
    audioToggleBtn.style.height = "16px";
    audioToggleBtn.style.borderRadius = "50%";
    audioToggleBtn.style.display = "flex";
    audioToggleBtn.style.justifyContent = "center";
    audioToggleBtn.style.alignItems = "center";
    audioToggleBtn.style.zIndex = "99";
    audioToggleBtn.style.cursor = "pointer";

    const audioIcon = document.createElement("span");
    audioIcon.innerHTML = isMuted ? getMuteIcon() : getUnmuteIcon(); // Start with mute icon
    audioToggleBtn.appendChild(audioIcon);
    console.log(isMuted, "isMuted in tooltip");

    audioToggleBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      audioIcon.innerHTML = isMuted ? getMuteIcon() : getUnmuteIcon();
      if (!isMuted) {
        // Play a silent audio to enable interaction
        const audio = new Audio();
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    });

    controlsContainer.appendChild(audioToggleBtn);

    function closeUI() {
      if (currentAnimationID !== id) return;
      tooltipContainer.remove();
      currentlyAnimating = false;
      animationCB();
      timeoutDisappear = null;
    }

    // Only create and append close button if hasClose is true
    if (hasClose) {
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
      closeBtn.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";

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
      controlsContainer.appendChild(closeBtn);
    }

    tooltipContainer.appendChild(controlsContainer);

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
      console.log(ctaList, "ctaList from tooltip");

      const ctaContainer = document.createElement("div");
      ctaContainer.style.marginTop = "15px";
      ctaList.map((ctaItem) => {
        const btn = document.createElement("button");
        btn.innerHTML = ctaItem.text;
        btn.style.borderRadius = "28px";
        btn.style.border = "0";
        btn.style.background = ctaItem.bg;
        btn.style.color = ctaItem.color;
        btn.style.padding = "12px 20px";
        btn.style.marginRight = "6px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "14px";
        btn.style.fontWeight = "400";
        btn.style.fontFamily = "Inter, sans-serif";
        btn.style.letterSpacing = "0.02em";
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
          } else if (ctaItem.format === "chat") {
            sourceLink = `${CHATBOT_PAGE}/chat?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}`;
            showChatWindow();
          }
        });
        ctaContainer.appendChild(btn);
      });
      tooltipContainer.appendChild(ctaContainer);
    }

    document.body.appendChild(tooltipContainer);
    tooltipContainer.style.right = isMobile ? "90px" : "140px";
    tooltipContainer.style.bottom = isMobile ? "40px" : "52px";
    tooltipContainer.style.display = "block";

    if (time) {
      timeoutDisappear = setTimeout(() => {
        closeUI();
      }, time * 1000);
    }
  }

  // ============================================= OVERLAY FUNCTIONS =============================================

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
      clearAudioQueue();
      animationCB();
      timeoutDisappear = null;
    }

    // Only create and append close button if hasClose is true
    if (hasClose) {
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
      closeBtn.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";

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
    }

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

  // ============================================= ANIMATION FUNCTIONS =============================================

  function playModifierAnimation(from, fSpeed, finalAnim, tSpeed) {
    const to = finalAnim.clip;

    // Instead of stopping all animations, we'll handle the transition more smoothly
    if (mixer) {
      // Only stop other animations if they're not the idle animation
      mixer._actions.forEach((action) => {
        if (action !== from && action !== to) {
          action.stop();
        }
      });
    }

    // Reset and play the new animation
    to.reset();
    to.setLoop(THREE.LoopOnce);
    to.clampWhenFinished = true;
    to.play();

    // Crossfade from idle to the new animation with a shorter duration
    from.crossFadeTo(to, fSpeed * 0.5, true);

    // Calculate when the animation will finish
    const animationDuration = to._clip.duration;

    // Set up the transition back to idle with a shorter duration
    setTimeout(() => {
      // Reset and play the idle animation
      from.reset();
      from.setLoop(THREE.LoopRepeat, Infinity);
      from.play();

      // Crossfade from the current animation back to idle with a shorter duration
      to.crossFadeTo(from, tSpeed * 0.5, true);

      // After the crossfade is complete, stop the temporary animation
      setTimeout(() => {
        to.stop();
      }, tSpeed * 500); // Reduced from 1000ms to 500ms
    }, (animationDuration - tSpeed) * 1000);
  }

  // ============================================= INPUT AND CHAT WINDOW FUNCTIONS =============================================

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
    input.style.fontFamily = "Inter, sans-serif";
    input.style.fontWeight = "400";

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
    inputContainer.style.bottom = isMobile ? "8px" : "30px";
    inputContainer.style.right = isMobile ? "80px" : "125px";

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

  // ============================================= INPUT FUNCTIONS =============================================

  function showInput() {
    if (currentlyAnimating) return;
    const input = document.getElementById("input");
    input.style.display = "block";
  }

  function hideInput() {
    const input = document.getElementById("input");
    input.style.display = "none";
  }

  // Modify the appendChatWindow function to include autoplay permissions
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
    chatWindow.style.width = isMobile ? "100%" : "390px";
    chatWindow.style.height = isMobile ? "100%" : "625px";
    chatWindow.style.bottom = isMobile ? 0 : "20px";
    chatWindow.style.right = isMobile ? 0 : "20px";
    chatWindow.style.zIndex = "1000";
    chatWindow.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
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
    closeButton.innerHTML = "×";
    closeButton.style.cursor = "pointer";
    closeButton.style.position = "absolute";
    closeButton.style.right = "16px";
    closeButton.style.top = "8px";
    closeButton.style.fontSize = "24px";
    closeButton.style.color = "#fff";

    closeButton.onclick = function () {
      chatWindow.style.display = "none";
    };

    chatWindow.appendChild(closeButton);
    document.body.appendChild(chatWindow);

    chatWindow.style.display = "none";
  }

  // Modify the showChatWindow function to handle autoplay permissions
  function showChatWindow() {
    const chat = document.getElementById("chatWindow");
    const chatbot = document.getElementById("chatbot-iframe");

    // Check if we have the data
    if (!INTERACTION_DATA || INTERACTION_DATA.length === 0) {
      // Wait for data to be available
      const checkData = setInterval(() => {
        if (INTERACTION_DATA && INTERACTION_DATA.length > 0) {
          clearInterval(checkData);
          chatbot.src = sourceLink;
          setTimeout(() => {
            chat.style.display = "block";
          }, 200);
        }
      }, 100);
    } else {
      chatbot.src = sourceLink;
      setTimeout(() => {
        chat.style.display = "block";
      }, 200);
    }
  }

  // ============================================= MOUSE POSITION AND HEAD RESET FUNCTIONS =============================================

  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }

  function moveJoint(mouse, joint, degreeLimit) {
    let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    if (joint) {
      // Apply rotations with easing
      const currentY = joint.rotation.y;
      const currentX = joint.rotation.x;
      const targetY = THREE.Math.degToRad(degrees.x);
      const targetX = THREE.Math.degToRad(degrees.y);

      // Smoother interpolation with easing
      const lerpFactor = 0.15; // Increased from 0.1 for smoother movement
      joint.rotation.y = THREE.Math.lerp(currentY, targetY, lerpFactor);
      joint.rotation.x = THREE.Math.lerp(currentX, targetX, lerpFactor);
    }
  }

  function resetHead() {
    let w = { x: window.innerWidth, y: window.innerHeight };
    const xRef = w.x / 2;
    const yRef = w.y / 2;

    if (neck) {
      // Set target positions with a slight upward tilt
      const targetY = THREE.Math.degToRad(0);
      const targetX = THREE.Math.degToRad(-15); // Negative value tilts head upward

      // Create a function to update the head position
      function updateHeadPosition() {
        const currentY = neck.rotation.y;
        const currentX = neck.rotation.x;

        // Calculate new positions with lerp - reduced factor for smoother movement
        const lerpFactor = 0.08; // Increased from 0.05 for smoother reset
        const newY = THREE.Math.lerp(currentY, targetY, lerpFactor);
        const newX = THREE.Math.lerp(currentX, targetX, lerpFactor);

        // Update the neck rotation
        neck.rotation.y = newY;
        neck.rotation.x = newX;

        // Check if we're close enough to the target position
        const threshold = 0.001;
        if (
          Math.abs(newY - targetY) > threshold ||
          Math.abs(newX - targetX) > threshold
        ) {
          // Continue updating if we're not close enough
          requestAnimationFrame(updateHeadPosition);
        }
      }

      // Start the update loop
      updateHeadPosition();
    }
  }

  // ============================================= MOUSE DEGREES FUNCTIONS =============================================

  function getMouseDegrees(x, y, degreeLimit) {
    let dx = 0,
      dy = 0;
    let w = { x: window.innerWidth, y: window.innerHeight };

    // Get the model's position on screen (bottom-right corner)
    const modelX = w.x - 340; // 280px + 60px offset from right
    const modelY = w.y - 40; // Accounting for bottom offset

    // Calculate the model's head center point
    // Adjusted to be more centered in the canvas
    const modelCenterX = modelX + 140; // Center of canvas width
    const modelCenterY = modelY + 100; // Adjusted higher for better head position

    // Calculate vector from model's center to mouse position
    const deltaX = x - modelCenterX;
    const deltaY = y - modelCenterY;

    // Calculate distance from mouse to model's center
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Create a non-linear response curve for more natural movement
    const maxDistance = 500; // Increased range for smoother rotation
    const distanceFactor = Math.min(distance / maxDistance, 1);

    // Calculate normalized direction with adjusted sensitivity
    const dirX = deltaX / (distance || 1);
    const dirY = deltaY / (distance || 1);

    // Apply the non-linear curve and degree limit with adjusted sensitivity
    const sensitivity = 0.8; // Reduced sensitivity for more natural movement
    dx = dirX * degreeLimit * Math.pow(distanceFactor, 0.8) * sensitivity;
    dy = dirY * degreeLimit * Math.pow(distanceFactor, 0.8) * sensitivity;

    // Adjust resting position to be more centered
    dx = dx + 0; // Removed right turn bias
    dy = dy + 0; // Removed downward tilt bias

    // Clamp values to prevent extreme rotations
    dx = Math.max(-degreeLimit, Math.min(degreeLimit, dx));
    dy = Math.max(-degreeLimit, Math.min(degreeLimit, dy));

    return { x: dx, y: dy };
  }

  // ******************************************************************** INTERACTIONS ********************************************************************

  // ***********************************************Function to get interactions*****************************************************
  const getInteractions = async () => {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/interactions?user_id=eq.${user_id}`,
        {
          method: "GET",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const interactions = await response.json();
      // Store the interactions in INTERACTION_DATA for use in other functions
      INTERACTION_DATA = interactions;
      initializeInteractions(interactions);

      // Set up head-cursor sync after data is loaded
      if (!isMobile) {
        let timer = setTimeout(() => resetHead());

        // Check if Head-Cursor Sync is enabled
        const headCursorSync = INTERACTION_DATA.find(
          (i) => i.key === "Head-Cursor Sync"
        );

        if (headCursorSync && headCursorSync.status) {
          let timer = null;
          let lastMouseMoveTime = Date.now();
          let isResetting = false;
          let isInitialized = false;
          let isModelReady = false;

          // Initialize head position after model is ready
          const initializeHeadTracking = () => {
            if (!isModelReady) {
              isModelReady = true;
              setTimeout(() => {
                resetHead();
                isInitialized = true;
              }, 1000);
            }
          };

          // Call this when model is loaded
          if (model) {
            initializeHeadTracking();
          }

          document.addEventListener("mousemove", function (e) {
            if (!isInitialized || !isModelReady) {
              return;
            }

            // Skip if interaction is active or currently animating
            if (currentlyAnimating || isInteractionActive) {
              return;
            }

            // Update last mouse move time
            const currentTime = Date.now();
            const timeSinceLastMove = currentTime - lastMouseMoveTime;
            lastMouseMoveTime = currentTime;

            // Clear existing timer if any
            if (timer) {
              clearTimeout(timer);
            }

            var mousecoords = getMousePos(e);
            if (neck && !currentlyAnimating) {
              moveJoint(mousecoords, neck, 50);
            }

            // Only set new timer if we're not already resetting
            if (!isResetting) {
              timer = setTimeout(() => {
                const timeSinceLastMove = Date.now() - lastMouseMoveTime;
                // Only reset if there's been no movement for at least 5 seconds
                if (timeSinceLastMove >= 5000) {
                  isResetting = true;
                  resetHead();
                  // Add a small delay before allowing another reset
                  setTimeout(() => {
                    isResetting = false;
                  }, 1000);
                }
              }, 5000);
            }
          });

          // Add visibility change handler to handle tab switching
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              resetHead();
              lastMouseMoveTime = Date.now();
            }
          });
        }
      }

      return interactions;
    } catch (error) {
      console.error("Failed to get interactions:", error);
      return [];
    }
  };
  getInteractions();

  // ***********************************************Function to initialize interactions based on their status*****************************************************
  const initializeInteractions = (interactions) => {
    // Helper function to check if an interaction is enabled
    const isEnabled = (key) => {
      const interaction = interactions.find((i) => i.key === key);
      return interaction ? interaction.status : false;
    };

    // Initialize each interaction based on its status
    if (isEnabled("Welcome New Visitor")) {
      console.log("New visitor is enabled");
      document.addEventListener("DOMContentLoaded", () => {
        showNewVisitorMessage();
      });

      window.addEventListener("load", () => {
        if (!document.newVisitorMessageShown) {
          showNewVisitorMessage();
        }
      });
    }

    if (isEnabled("Welcome Returning Visitor")) {
      console.log("Welcome returning visitor is enabled");

      document.addEventListener("DOMContentLoaded", () => {
        showReturningVisitorMessage();
      });

      window.addEventListener("load", () => {
        if (!document.returningVisitorMessageShown) {
          showReturningVisitorMessage();
        }
      });
    }

    if (isEnabled("Avoid Bounce")) {
      console.log("Avoid bounce is enabled");
      document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded");
        window.avoidBounceHandler = new AvoidBounceHandler();
        checkInternalNavigation();
      });

      window.addEventListener("load", () => {
        console.log("Window loaded");
        if (!window.avoidBounceHandler) {
          window.avoidBounceHandler = new AvoidBounceHandler();
        }
        checkInternalNavigation();
      });
    }

    if (isEnabled("Idle on Page")) {
      console.log("Idle on page is enabled");
      document.addEventListener("DOMContentLoaded", () => {
        window.inactivityTracker = new InactivityTracker();
      });

      window.addEventListener("load", () => {
        if (!window.inactivityTracker) {
          window.inactivityTracker = new InactivityTracker();
        }
      });
    }

    if (isEnabled("Normal Exit Intent")) {
      console.log("Normal exit intent is enabled");
      window.normalExitIntentSessionStartTime = Date.now();
      document.addEventListener("DOMContentLoaded", () => {
        window.normalExitIntentHandler = new NormalExitIntentHandler();
      });

      window.addEventListener("load", () => {
        if (!window.normalExitIntentHandler) {
          window.normalExitIntentHandler = new NormalExitIntentHandler();
        }
      });
    }

    if (isEnabled("Confused?")) {
      console.log("Confused? is enabled");
      document.addEventListener("DOMContentLoaded", () => {
        window.confusedInteractionHandler = new ConfusedInteractionHandler();
      });

      window.addEventListener("load", () => {
        if (!window.confusedInteractionHandler) {
          window.confusedInteractionHandler = new ConfusedInteractionHandler();
        }
      });
    }

    // Click-to-Dance is already handled by the model click event listener
    // No additional initialization needed
  };

  // ***********************************************Function to update total_impression count*****************************************************
  async function updateInteractionImpression(interaction_id) {
    try {
      const interaction = INTERACTION_DATA.find((i) => i.id === interaction_id);
      if (!interaction) return;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/interactions?id=eq.${interaction.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total_impressions: Number(interaction.total_impressions) + 1 || 0,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update impression count:", response.status);
      }
    } catch (error) {
      console.error("Error updating impression count:", error);
    }
  }

  // Function to fetch existing interaction data from the table
  async function fetchExistingInteractionData(interactionName) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/leads_interactions_audio?id=eq.${leadIdLocal}&interaction_name=eq.${interactionName}`,
        {
          method: "GET",
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "data in fetch existing interaction data");
      return data[0];
    } catch (error) {
      console.error("Error fetching existing interaction data:", error);
      return null;
    }
  }

  //*************************************************WELCOME NEW VISITOR AND RETURNING VISITOR MESSAGE*****************************************************

  // Helper function to replace placeholders in messages with lead data
  function replaceMessagePlaceholders(message, leadData) {
    if (!message || !leadData) {
      console.log("Message or leadData is missing:", { message, leadData });
    }

    console.log("Replacing placeholders in message:", message);
    console.log("Using lead data:", leadData);

    return message.replace(/\{([^}]+)\}/g, (match, key) => {
      const trimmedKey = key.trim();
      console.log("Processing placeholder:", trimmedKey);

      switch (trimmedKey) {
        case "firstName":
          return leadData?.name || "there";
        case "companyName":
          return leadData?.company || "GreyFeathers";
        default:
          return match;
      }
    });
  }

  // Modify the showNewVisitorMessage function to use text-to-speech
  async function showNewVisitorMessage() {
    console.log("Showing new visitor message", INTERACTION_DATA);
    let hasVisitedBefore = localStorage.getItem("hasWelcomeVisitor");
    console.log("Has visited before:", hasVisitedBefore);
    if (hasVisitedBefore !== "true") {
      const newVisitorInteraction = INTERACTION_DATA.find(
        (i) => i.key === "Welcome New Visitor"
      );
      console.log("New visitor interaction:", newVisitorInteraction);
      // const message = replaceMessagePlaceholders(
      //   newVisitorInteraction?.message,
      //   leadData
      // );
      // console.log("Message new visitors:", message);

      // const hasPlaceholders =
      //   newVisitorInteraction?.message?.includes("{firstName}") ||
      //   newVisitorInteraction?.message?.includes("{companyName}");

      // let audioUrl = null;

      // // Fetch existing message and audio URL from the table
      // const existingData = await fetchExistingInteractionData(
      //   "Welcome New Visitor"
      // );
      // const existingMessage = existingData?.message;
      // const existingAudioUrl = existingData?.audio_url;

      // if (
      //   hasPlaceholders &&
      //   existingMessage === newVisitorInteraction?.message
      // ) {
      //   console.log(existingAudioUrl, "existing audio url in new visitor");
      //   // Use existing audio if the message matches
      //   audioUrl = existingAudioUrl;
      // } else {
      //   // Generate new audio if the message differs
      //   const audioBlob = await convertTextToSpeech(message);
      //   if (audioBlob) {
      //     audioUrl = await UpdateLeadsData(
      //       "Welcome New Visitor",
      //       audioBlob,
      //       newVisitorInteraction?.message
      //     );
      //     console.log(audioUrl, "audio url in new visitor");
      //   }
      // }

      showUIAnimation({
        text: newVisitorInteraction?.message,
        time: 5,
        interactionAudio: newVisitorInteraction?.audio_url || "",
        hasClose: false,
        animation: "wave",
        cta: [
          {
            text: "Ask me Anything!",
            bg: "#007AFF",
            color: "#fff",
            format: "chat",
          },
        ],
      });
      updateInteractionImpression(newVisitorInteraction.id);
      localStorage.setItem("hasWelcomeVisitor", "true");
    }
  }

  function showReturningVisitorMessage() {
    console.log("Showing returning visitor message");
    let hasReturningVisitedBefore = localStorage.getItem("hasReturningVisitor");
    const hasShownReturningMessage = sessionStorage.getItem(
      "hasShownReturningMessage"
    );
    if (hasReturningVisitedBefore === "true" && !hasShownReturningMessage) {
      const returningVisitorInteraction = INTERACTION_DATA.find(
        (i) => i.key === "Welcome Returning Visitor"
      );
      const message = replaceMessagePlaceholders(
        returningVisitorInteraction?.message,
        leadData
      );

      setTimeout(() => {
        showUIAnimation({
          text: message,
          time: 8,
          hasClose: false,
          animation: "wave",
          interactionAudio: returningVisitorInteraction?.audio_url || "",
          cta: [
            {
              text: "Ask me anything!",
              bg: "#007AFF",
              color: "#fff",
              format: "chat",
            },
          ],
        });

        updateInteractionImpression(returningVisitorInteraction.id);
      }, 2000);
      // Set the flag only after the message is shown
      sessionStorage.setItem("hasShownReturningMessage", "true");
    } else {
      localStorage.setItem("hasReturningVisitor", "true");
    }
  }

  //*************************************************AVOID BOUNCE HANDLER*****************************************************
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
    console.log("Checking internal navigation in avoid bounce handler");
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

  class AvoidBounceHandler {
    constructor() {
      console.log("Initializing AvoidBounceHandler");
      this.sessionStartTime = Date.now();
      this.hasInteracted = false;
      this.hasReachedBottom = false;
      this.hasScrolledPast90 = false;
      this.isFirstVisit = isFirstTimeVisit();
      this.handleMouseMovement = this.handleMouseMovement.bind(this);
      this.lastY = null;
      this.mouseMovingUp = false;
      this.mousePath = [];
      this.maxPathLength = 30; // Store last 10 mouse positions
      this.setupEventListeners();
    }

    setupEventListeners() {
      console.log("Setting up event listeners");
      document.addEventListener("mousemove", (e) => {
        // Track mouse path
        this.mousePath.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        if (this.mousePath.length > this.maxPathLength) {
          this.mousePath.shift(); // Remove oldest position
        }
        this.handleMouseMovement(e);
      });

      document.addEventListener("scroll", () => {
        const currentScrollPercentage = getScrollPercentage();

        if (currentScrollPercentage >= 90) {
          this.hasScrolledPast90 = true;
          console.log("User has scrolled past 90%");
        }

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

      // Initialize lastY if not set
      if (this.lastY === null) {
        this.lastY = currentY;
        return;
      }

      // Calculate the vertical movement
      const verticalMovement = currentY - this.lastY;
      this.lastY = currentY;

      // Update mouseMovingUp flag based on movement direction
      this.mouseMovingUp = verticalMovement < 0;

      const timeSinceStart = Date.now() - this.sessionStartTime;
      const isWithin30Seconds = timeSinceStart <= 30000;
      const scrollPercentage = getScrollPercentage();
      const isNearTop = event.clientY < 30;

      // Check if any point in the mouse path is near the top
      const isNearTopInPath = this.mousePath.some((point) => point.y < 30);

      // Check if the movement is upward by comparing first and last points in path
      const isMovingUpward =
        this.mousePath.length >= 2 &&
        this.mousePath[this.mousePath.length - 1].y < this.mousePath[0].y;

      const isFirstVisit = this.isFirstVisit;
      const hasNotVisitedInternalPages = !hasVisitedInternalPages();

      if (
        isWithin30Seconds &&
        isMovingUpward &&
        (isNearTop || isNearTopInPath) &&
        !this.hasScrolledPast90 &&
        isFirstVisit &&
        hasNotVisitedInternalPages
      ) {
        console.log("⭐ All conditions met, triggering interaction");
        this.triggerInteraction();
      }
    }

    triggerInteraction() {
      this.hasInteracted = true;
      const avoidBounceInteraction = INTERACTION_DATA.find(
        (i) => i.key === "Avoid Bounce"
      );
      showUIAnimation({
        text:
          avoidBounceInteraction?.message ||
          "Wait, wait, wait! I've been practicing my dance moves, watch this! 🕺",
        time: 8,
        hasClose: false,
        animation: "no_no",
        interactionAudio: avoidBounceInteraction?.audio_url || "",
      });
      updateInteractionImpression(avoidBounceInteraction.id);
      document.removeEventListener("mousemove", this.handleMouseMovement);

      // Follow-up interactions after 8 seconds (after no_no animation)
      setTimeout(() => {
        showUIAnimation({
          animation: "dance_like_anto",
          time: 0, // Reduced dance time to 6 seconds
          hasClose: false,
        });

        // Show casual talk 2 seconds after dance ends (total 8 + 6 + 2 = 16s)
        setTimeout(() => {
          showUIAnimation({
            text: "Liked my dance? Let me help you with something!",
            time: 15,
            hasClose: false,
            animation: "casual_talk_2",
            cta: [
              {
                text: "Ask me anything!",
                bg: "#007AFF",
                color: "#fff",
                format: "chat",
              },
            ],
          });

          // Switch back to idle after 15 seconds
          setTimeout(() => {
            playModifierAnimation(idle, 1, idle, 1.5);
          }, 15000);
        }, 6000); // Show casual talk 2s after 6s dance ends
      }, 8000); // Start dance after 8s no_no animation
    }
  }

  //*************************************************NORMAL EXIT INTENT HANDLER*****************************************************

  function normalExitIntentHasSpentEnoughTime() {
    return Date.now() - window.normalExitIntentSessionStartTime >= 30000; // 30 seconds
  }

  // Function to check if the user has visited multiple pages
  function normalExitIntentHasVisitedMultiplePages() {
    const normalExitIntentVisitedPages = JSON.parse(
      sessionStorage.getItem("normalExitIntentVisitedPages") || "[]"
    );
    return normalExitIntentVisitedPages.length > 2;
  }

  // Function to mark page visit
  function normalExitIntentMarkPageVisit() {
    const normalExitIntentVisitedPages = JSON.parse(
      sessionStorage.getItem("normalExitIntentVisitedPages") || "[]"
    );
    const currentPath = window.location.pathname;
    if (!normalExitIntentVisitedPages.includes(currentPath)) {
      normalExitIntentVisitedPages.push(currentPath);
      sessionStorage.setItem(
        "normalExitIntentVisitedPages",
        JSON.stringify(normalExitIntentVisitedPages)
      );
    }
  }

  // Function to check if the interaction has already been triggered
  function normalExitIntentHasInteractedBefore() {
    return sessionStorage.getItem("normalExitIntentTriggered") === "true";
  }

  // Function to store that interaction has been triggered
  function normalExitIntentMarkInteractionTriggered() {
    sessionStorage.setItem("normalExitIntentTriggered", "true");
  }

  // Function to calculate scroll percentage
  function normalExitIntentGetScrollPercentage() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
  }

  // Main interaction handler
  class NormalExitIntentHandler {
    constructor() {
      this.normalExitIntentHighestScrollPercentage = 0;
      this.normalExitIntentHandleMouseMovement =
        this.normalExitIntentHandleMouseMovement.bind(this);
      this.normalExitIntentSetupEventListeners();
      normalExitIntentMarkPageVisit(); // Mark initial page visit
      this.lastMousePosition = { x: 0, y: 0 };
      this.lastMouseMoveTime = Date.now();
      this.mousePath = [];
      this.maxPathLength = 10; // Store last 10 mouse positions
    }

    normalExitIntentSetupEventListeners() {
      let normalExitIntentLastY = 0;

      // Detect mouse movement toward the top
      document.addEventListener("mousemove", (e) => {
        const currentTime = Date.now();
        const currentY = e.clientY;
        this.normalExitIntentMouseMovingUp = currentY < normalExitIntentLastY;
        normalExitIntentLastY = currentY;

        // Track mouse path
        this.mousePath.push({ x: e.clientX, y: e.clientY, time: currentTime });
        if (this.mousePath.length > this.maxPathLength) {
          this.mousePath.shift(); // Remove oldest position
        }

        this.normalExitIntentHandleMouseMovement(e);
      });

      // Track scroll percentage
      document.addEventListener("scroll", () => {
        const currentScrollPercentage = normalExitIntentGetScrollPercentage();
        this.normalExitIntentHighestScrollPercentage = Math.max(
          this.normalExitIntentHighestScrollPercentage,
          currentScrollPercentage
        );
      });

      // Track page navigation
      let normalExitIntentLastPath = window.location.pathname;
      const normalExitIntentObserver = new MutationObserver(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== normalExitIntentLastPath) {
          normalExitIntentLastPath = currentPath;
          normalExitIntentMarkPageVisit();
        }
      });

      normalExitIntentObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    normalExitIntentHandleMouseMovement(event) {
      if (normalExitIntentHasInteractedBefore()) return;

      // Check if any point in the mouse path is near the top or corners
      const isNearTopOrCorners = this.mousePath.some((point) => {
        const isNearTop = point.y < 30;
        const isNearTopLeftCorner = point.x < 30 && point.y < 30;
        const isNearTopRightCorner =
          point.x > window.innerWidth - 30 && point.y < 30;
        return isNearTop || isNearTopLeftCorner || isNearTopRightCorner;
      });

      // Check if the movement is upward by comparing first and last points in path
      const isMovingUpward =
        this.mousePath.length >= 2 &&
        this.mousePath[this.mousePath.length - 1].y < this.mousePath[0].y;
      console.log(
        isMovingUpward,
        isNearTopOrCorners,
        "mouse path",
        this.mousePath
      );

      if (
        normalExitIntentHasSpentEnoughTime() &&
        (normalExitIntentHasVisitedMultiplePages() ||
          this.normalExitIntentHighestScrollPercentage >= 90) &&
        isNearTopOrCorners &&
        isMovingUpward
      ) {
        this.normalExitIntentTriggerInteraction();
      }
    }

    normalExitIntentTriggerInteraction() {
      normalExitIntentMarkInteractionTriggered();
      const normalExitIntentInteraction = INTERACTION_DATA.find(
        (i) => i.key === "Normal Exit Intent"
      );
      showUIAnimation({
        text:
          normalExitIntentInteraction?.message ||
          "Leaving already? If you ever need help, I'm always here!",
        time: 8,
        hasClose: false,
        animation: "casual_talk_2",
        interactionAudio: normalExitIntentInteraction?.audio_url || "",
        cta: [
          {
            text: "Ask me anything!",
            bg: "#007AFF",
            color: "#fff",
            format: "chat",
          },
        ],
      });
      updateInteractionImpression(normalExitIntentInteraction.id);
      document.removeEventListener(
        "mousemove",
        this.normalExitIntentHandleMouseMovement
      );
    }
  }

  //*************************************************CONFUSSED INTERACTION HANDLER*****************************************************
  function hasConfusedInteractionTriggered() {
    return sessionStorage.getItem("confusedInteractionTriggered") === "true";
  }

  // Function to store that confused interaction has been triggered
  function markConfusedInteractionTriggered() {
    sessionStorage.setItem("confusedInteractionTriggered", "true");
  }

  // Function to get current unique page visits count for confused interaction
  function getConfusedInteractionVisitCount() {
    return parseInt(sessionStorage.getItem("confusedInteractionVisits") || "0");
  }

  // Function to get pages visited during confused interaction
  function getConfusedInteractionVisitedPages() {
    return JSON.parse(
      sessionStorage.getItem("confusedInteractionVisitedPages") || "[]"
    );
  }

  // Function to check if a page has been visited during confused interaction
  function hasConfusedInteractionPageBeenVisited(path) {
    const visitedPages = getConfusedInteractionVisitedPages();
    return visitedPages.includes(path);
  }

  // Function to mark a page as visited during confused interaction
  function markConfusedInteractionPageAsVisited(path) {
    const visitedPages = getConfusedInteractionVisitedPages();
    if (!visitedPages.includes(path)) {
      visitedPages.push(path);
      sessionStorage.setItem(
        "confusedInteractionVisitedPages",
        JSON.stringify(visitedPages)
      );
    }
  }

  // Function to increment unique page visits for confused interaction
  function incrementConfusedInteractionVisits(path) {
    if (!hasConfusedInteractionPageBeenVisited(path)) {
      const currentVisits = getConfusedInteractionVisitCount();
      sessionStorage.setItem(
        "confusedInteractionVisits",
        (currentVisits + 1).toString()
      );
      markConfusedInteractionPageAsVisited(path);
    }
  }

  // Function to check if current page has been scrolled past 70% during confused interaction
  function hasConfusedInteractionPageScrolledPast70Percent() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / docHeight) * 100;
    return scrollPercentage > 70;
  }

  // Function to mark current page as scrolled during confused interaction
  function markConfusedInteractionPageScrolled(path) {
    const scrolledPages = JSON.parse(
      sessionStorage.getItem("confusedInteractionScrolledPages") || "[]"
    );
    if (!scrolledPages.includes(path)) {
      scrolledPages.push(path);
      sessionStorage.setItem(
        "confusedInteractionScrolledPages",
        JSON.stringify(scrolledPages)
      );
      // If any page is scrolled, mark the entire session as scrolled
      sessionStorage.setItem("confusedInteractionSessionScrolled", "true");
    }
  }

  // Function to check if any page in the session was scrolled during confused interaction
  function hasConfusedInteractionAnyPageScrolled() {
    return (
      sessionStorage.getItem("confusedInteractionSessionScrolled") === "true"
    );
  }

  // Function to check if a page was scrolled during confused interaction
  function wasConfusedInteractionPageScrolled(path) {
    const scrolledPages = JSON.parse(
      sessionStorage.getItem("confusedInteractionScrolledPages") || "[]"
    );
    return scrolledPages.includes(path);
  }

  // Function to get initial path for confused interaction
  function getConfusedInteractionInitialPath() {
    return (
      sessionStorage.getItem("confusedInteractionInitialPath") ||
      window.location.pathname
    );
  }

  // Function to set initial path for confused interaction
  function setConfusedInteractionInitialPath(path) {
    if (!sessionStorage.getItem("confusedInteractionInitialPath")) {
      sessionStorage.setItem("confusedInteractionInitialPath", path);
    }
  }

  // Main confused interaction handler
  class ConfusedInteractionHandler {
    constructor() {
      this.handleScroll = this.handleScroll.bind(this);
      this.setupEventListeners();
      this.checkPageVisits();
      // Set initial path when handler is created
      setConfusedInteractionInitialPath(window.location.pathname);
    }

    setupEventListeners() {
      // Track scroll events
      document.addEventListener("scroll", this.handleScroll);

      // Track route changes for Next.js
      let lastPath = window.location.pathname;
      const observer = new MutationObserver(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== lastPath) {
          lastPath = currentPath;
          this.handlePageChange();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    handleScroll() {
      if (hasConfusedInteractionPageScrolledPast70Percent()) {
        markConfusedInteractionPageScrolled(window.location.pathname);
      }
    }

    handlePageChange() {
      const currentPath = window.location.pathname;
      const initialPath = getConfusedInteractionInitialPath();

      // Skip if we're on the initial path
      if (currentPath === initialPath) {
        return;
      }

      // Only increment visits if:
      // 1. The current page hasn't been visited before
      // 2. The current page hasn't been scrolled past 70%
      if (!wasConfusedInteractionPageScrolled(currentPath)) {
        if (!hasConfusedInteractionPageBeenVisited(currentPath)) {
          incrementConfusedInteractionVisits(currentPath);
          this.checkPageVisits();
        }
      }
    }

    checkPageVisits() {
      if (hasConfusedInteractionTriggered()) return;
      if (hasConfusedInteractionAnyPageScrolled()) return; // Don't trigger if any page was scrolled

      const visits = getConfusedInteractionVisitCount();
      if (visits >= 3) {
        this.triggerInteraction();
      }
    }

    triggerInteraction() {
      markConfusedInteractionTriggered();
      const confusedInteraction = INTERACTION_DATA.find(
        (i) => i.key === "Confused?"
      );
      showUIAnimation({
        text:
          confusedInteraction?.message ||
          "Looks like you're exploring 🤔….need a hand finding something?",
        time: 8,
        hasClose: false,
        animation: "casual_talk_2",
        interactionAudio: confusedInteraction?.audio_url || "",
        cta: [
          {
            text: "Ask me anything!",
            bg: "#007AFF",
            color: "#fff",
            format: "chat",
          },
        ],
      });
      updateInteractionImpression(confusedInteraction.id);
      document.removeEventListener("scroll", this.handleScroll);
    }
  }

  //*************************************************IDEAL ON PAGE INTERACTION HANDLER*****************************************************
  class InactivityTracker {
    constructor() {
      this.lastActivity = Date.now();
      this.triggerCount = this.getTriggerCount();
      this.trackingInterval = null;
      this.lastTriggerTime = 0;
      this.isShowingMessage = false;
      this.isTabVisible = !document.hidden;
      console.log("Initial trigger count:", this.triggerCount);
      this.setupListeners();
      this.startTracking();
    }

    getTriggerCount() {
      const count = sessionStorage.getItem("inactivityTriggerCount");
      return count ? parseInt(count) : 0;
    }

    incrementTriggerCount() {
      const newCount = this.triggerCount + 1;
      sessionStorage.setItem("inactivityTriggerCount", newCount.toString());
      this.triggerCount = newCount;

      // Verify the storage was updated
      const storedCount = sessionStorage.getItem("inactivityTriggerCount");
      console.log("Verified storage count:", storedCount);

      // Stop tracking if we've reached the limit
      if (this.triggerCount >= 1) {
        this.stopTracking();
      }
    }

    setupListeners() {
      const events = [
        "mousedown",
        "mousemove",
        "keydown",
        "scroll",
        "touchstart",
      ];
      events.forEach((event) => {
        document.addEventListener(event, () => this.updateActivity());
      });

      // Add visibility change listener
      document.addEventListener("visibilitychange", () => {
        this.isTabVisible = !document.hidden;
        if (this.isTabVisible) {
          this.updateActivity(); // Reset activity when tab becomes visible
        }
      });
    }

    updateActivity() {
      this.lastActivity = Date.now();
      this.isShowingMessage = false;
    }

    startTracking() {
      // Only start tracking if we haven't reached the limit
      if (this.triggerCount < 1) {
        console.log("Starting tracking with count:", this.triggerCount);
        this.trackingInterval = setInterval(() => {
          const inactiveTime = Date.now() - this.lastActivity;
          const currentCount = this.getTriggerCount();
          const timeSinceLastTrigger = Date.now() - this.lastTriggerTime;

          if (
            inactiveTime >= 30000 &&
            currentCount < 1 &&
            !this.isShowingMessage &&
            timeSinceLastTrigger >= 10000 &&
            this.isTabVisible // Only trigger if tab is visible
          ) {
            // 10 second cooldown between triggers
            this.showMessage();
            this.incrementTriggerCount();
          }
        }, 1000);
      } else {
        console.log("Already reached trigger limit, not starting tracking");
      }
    }

    stopTracking() {
      if (this.trackingInterval) {
        clearInterval(this.trackingInterval);
        this.trackingInterval = null;
        console.log("Tracking stopped");
      }
    }

    showMessage() {
      const currentCount = this.getTriggerCount();
      if (currentCount >= 1) {
        console.log("Skipping message - already reached trigger limit");
        return;
      }

      this.isShowingMessage = true;
      this.lastTriggerTime = Date.now();

      const idleInteraction = INTERACTION_DATA.find(
        (i) => i.key === "Idle on Page"
      );
      showUIAnimation({
        text:
          idleInteraction?.message ||
          "Still there? Let me know if you need any help!",
        time: 8,
        hasClose: false,
        animation: "wait_up",
        interactionAudio: idleInteraction?.audio_url || "",
        cta: [
          {
            text: "Ask me anything!",
            bg: "#007AFF",
            color: "#fff",
            format: "chat",
          },
        ],
      });
      updateInteractionImpression(idleInteraction.id);
    }
  }
  //*************************************************END OF INTERACTION HANDLER*****************************************************
  // Simplified jaw movement function
  function animateJaw(duration = 3) {
    if (!model) {
      console.warn("Model not loaded yet!");
      return;
    }

    // Find the jaw bone and its parent
    let jawBone = null;
    let facialBone = null;
    let teethMesh = null;

    model.traverse((object) => {
      if (object.isBone) {
        if (object.name === "CC_Base_JawRoot") {
          jawBone = object;
        } else if (object.name === "CC_Base_FacialBone") {
          facialBone = object;
        }
      } else if (object.isSkinnedMesh && object.name === "CC_Base_Teeth") {
        teethMesh = object;
      }
    });

    if (!jawBone || !facialBone) {
      console.warn("Required bones not found!");
      return;
    }

    if (!teethMesh) {
      console.warn("Teeth mesh not found!");
      return;
    }

    // Store initial transforms
    const initialPosition = jawBone.position.clone();
    const initialRotation = jawBone.rotation.clone();
    const initialQuaternion = jawBone.quaternion.clone();
    const initialMatrix = jawBone.matrix.clone();
    const initialMatrixWorld = jawBone.matrixWorld.clone();

    // Create a pivot point at the jaw's natural rotation point
    const pivotPoint = new THREE.Vector3(0, 0, 0);
    const pivotHelper = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    pivotHelper.position.copy(pivotPoint);
    jawBone.add(pivotHelper);

    // Add axis helpers
    const jawHelper = new THREE.AxesHelper(0.5);
    const facialHelper = new THREE.AxesHelper(0.5);
    jawBone.add(jawHelper);
    facialBone.add(facialHelper);

    // Add a bounding box helper for the teeth mesh
    const teethHelper = new THREE.BoxHelper(teethMesh, 0x00ff00);
    model.add(teethHelper);

    console.log("\n=== Initial Jaw State ===");
    console.log("Jaw Position:", initialPosition.toArray());
    console.log("Jaw Rotation:", initialRotation.toArray());
    console.log("Jaw Matrix:", initialMatrix.elements);
    console.log("Jaw World Matrix:", initialMatrixWorld.elements);
    console.log("Teeth Mesh Position:", teethMesh.position.toArray());
    console.log("Teeth Mesh Rotation:", teethMesh.rotation.toArray());

    let startTime = null;
    const maxRotation = Math.PI / 6; // 30 degrees

    function updateJaw() {
      if (!startTime) startTime = Date.now();
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate open amount using smooth easing
      const openAmount = Math.sin(progress * Math.PI) * maxRotation;

      // Create rotation matrix in local space
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationX(openAmount);

      // Apply rotation around pivot point
      jawBone.matrix.multiply(rotationMatrix);
      jawBone.matrix.decompose(
        jawBone.position,
        jawBone.quaternion,
        jawBone.scale
      );

      // Force update matrices
      jawBone.updateMatrixWorld(true);

      // Update the teeth mesh specifically
      teethMesh.updateMatrix();
      teethMesh.updateMatrixWorld(true);
      if (teethMesh.skeleton) {
        teethMesh.skeleton.update();
      }

      // Log current state
      console.log("\n=== Jaw Animation State ===");
      console.log("Bone Name:", jawBone.name);
      console.log("Parent Name:", jawBone.parent.name);
      console.log("Open Amount:", openAmount);
      console.log("Angle (degrees):", (openAmount * 180) / Math.PI);
      console.log("Jaw Position:", jawBone.position.toArray());
      console.log("Jaw Rotation:", jawBone.rotation.toArray());
      console.log("Jaw Matrix:", jawBone.matrix.elements);
      console.log("Jaw World Matrix:", jawBone.matrixWorld.elements);
      console.log("Teeth Position:", teethMesh.position.toArray());
      console.log("Teeth Rotation:", teethMesh.rotation.toArray());

      if (progress < 1) {
        requestAnimationFrame(updateJaw);
      } else {
        // Reset to initial state
        jawBone.position.copy(initialPosition);
        jawBone.rotation.copy(initialRotation);
        jawBone.quaternion.copy(initialQuaternion);
        jawBone.matrix.copy(initialMatrix);
        jawBone.matrixWorld.copy(initialMatrixWorld);

        teethMesh.updateMatrix();
        teethMesh.updateMatrixWorld(true);
        if (teethMesh.skeleton) {
          teethMesh.skeleton.update();
        }
      }
    }

    updateJaw();
  }

  // animateJaw(10);

  function inspectModelBones() {
    console.log("Inspecting model bones:");
    let bones = [];

    model.traverse((object) => {
      if (object.isBone) {
        bones.push({
          name: object.name,
          parent: object.parent ? object.parent.name : "none",
          children: object.children.length,
          position: object.position.toArray(),
          rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
          quaternion: [
            object.quaternion.x,
            object.quaternion.y,
            object.quaternion.z,
            object.quaternion.w,
          ],
        });
      }
    });

    console.table(bones);

    // Check skinned meshes
    let skinnedMeshes = [];
    model.traverse((object) => {
      if (object.isSkinnedMesh) {
        skinnedMeshes.push({
          name: object.name,
          bones: object.skeleton ? object.skeleton.bones.length : 0,
          hasSkeleton: !!object.skeleton,
        });
      }
    });

    console.log("Skinned meshes:", skinnedMeshes);
  }

  function checkAnimations() {
    console.log("Checking model animations:");

    if (model.animations) {
      console.log(
        `Found ${model.animations.length} animations:`,
        model.animations.map((a) => a.name)
      );
    } else {
      console.log("No animations found on model");
    }

    // Check for animation mixer
    if (model.mixer) {
      console.log("Model has animation mixer");
    }
  }

  function diagnoseModelIssues() {
    if (!model) {
      console.warn("Model not loaded yet!");
      return;
    }

    console.log("=== Starting Model Diagnosis ===");

    // 1. Check Bone Hierarchy
    console.log("\n1. Bone Hierarchy Analysis:");
    let bones = [];
    model.traverse((object) => {
      if (object.isBone) {
        const parentName = object.parent ? object.parent.name : "none";
        const children = object.children.map((child) => child.name);
        bones.push({
          name: object.name,
          parent: parentName,
          children: children,
          position: object.position.toArray(),
          rotation: object.rotation.toArray(),
          quaternion: object.quaternion.toArray(),
          matrix: object.matrix.elements,
          matrixWorld: object.matrixWorld.elements,
        });
      }
    });
    console.table(bones);

    // 2. Check Skinned Meshes
    console.log("\n2. Skinned Mesh Analysis:");
    let skinnedMeshes = [];
    model.traverse((object) => {
      if (object.isSkinnedMesh) {
        const boneNames = object.skeleton.bones.map((bone) => bone.name);
        skinnedMeshes.push({
          name: object.name,
          boneCount: object.skeleton.bones.length,
          bones: boneNames,
          influences: object.geometry.attributes.skinWeight
            ? object.geometry.attributes.skinWeight.array.length / 4
            : 0,
        });
      }
    });
    console.table(skinnedMeshes);

    // 3. Check Animations
    console.log("\n3. Animation Analysis:");
    if (model.animations && model.animations.length > 0) {
      model.animations.forEach((anim) => {
        console.log(`Animation: ${anim.name}`);
        console.log(
          "Tracks:",
          anim.tracks.map((track) => ({
            name: track.name,
            type: track.ValueTypeName,
            keyframes: track.times.length,
          }))
        );
      });
    } else {
      console.log("No animations found");
    }

    // 4. Check Jaw Bone Specifically
    console.log("\n4. Jaw Bone Analysis:");
    let jawBone = null;
    model.traverse((object) => {
      if (object.isBone && object.name === "CC_Base_JawRoot") {
        jawBone = object;
      }
    });

    if (jawBone) {
      console.log("Jaw bone found:", {
        name: jawBone.name,
        parent: jawBone.parent ? jawBone.parent.name : "none",
        position: jawBone.position.toArray(),
        rotation: jawBone.rotation.toArray(),
        quaternion: jawBone.quaternion.toArray(),
        matrix: jawBone.matrix.elements,
        matrixWorld: jawBone.matrixWorld.elements,
      });

      // Check if jaw bone is connected to any skinned meshes
      const connectedMeshes = [];
      model.traverse((object) => {
        if (object.isSkinnedMesh && object.skeleton.bones.includes(jawBone)) {
          connectedMeshes.push(object.name);
        }
      });
      console.log("Connected meshes:", connectedMeshes);
    } else {
      console.log("Jaw bone not found!");
    }

    // 5. Check Bone Constraints
    console.log("\n5. Bone Constraint Analysis:");
    model.traverse((object) => {
      if (object.isBone) {
        const constraints = [];
        if (
          object.rotation.x === 0 &&
          object.rotation.y === 0 &&
          object.rotation.z === 0
        ) {
          constraints.push("rotation_locked");
        }
        if (
          object.position.x === 0 &&
          object.position.y === 0 &&
          object.position.z === 0
        ) {
          constraints.push("position_locked");
        }
        if (constraints.length > 0) {
          console.log(`${object.name} has constraints:`, constraints);
        }
      }
    });

    console.log("\n=== Model Diagnosis Complete ===");
  }

  // Call this after model is loaded
  loader.load(
    MODEL_PATH,
    function (gltf) {
      model = gltf.scene;
      let fileAnimations = gltf.animations;

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
        // Add detailed bone logging
        if (o.isBone) {
          console.log("Found bone:", o.name);
          if (o.name === "CC_Base_Head") {
            neck = o;
            console.log("Found neck bone:", neck);
          }
          if (o.name === "spine_01x") {
            waist = o;
            console.log("Found waist bone:", waist);
          }
          if (o.name === "CC_Base_JawRoot") {
            jaw = o;
            console.log("Found jaw bone:", jaw);
            console.log("Initial jaw quaternion:", jaw.quaternion);
            console.log("Jaw parent hierarchy:", getParentHierarchy(jaw));
          }
          if (o.name === "CC_Base_UpperJaw") {
            upperJaw = o;
            console.log("Found upper jaw bone:", upperJaw);
            console.log("Initial upper jaw quaternion:", upperJaw.quaternion);
            console.log(
              "Upper jaw parent hierarchy:",
              getParentHierarchy(upperJaw)
            );
          }
        }
      });

      // Add helper function to get parent hierarchy
      function getParentHierarchy(bone) {
        const hierarchy = [];
        let current = bone;
        while (current.parent) {
          hierarchy.unshift(current.parent.name || "unnamed");
          current = current.parent;
        }
        return hierarchy;
      }

      model.scale.set(12, 12, 12);
      model.position.y = -12;
      scene.add(model);

      // Initialize animation mixer
      mixer = new THREE.AnimationMixer(model);

      // Handle idle animation
      if (fileAnimations && fileAnimations.length > 0) {
        let idleAnim = fileAnimations[0]; // Use first animation as idle
        idleAnim.name = "idle"; // Set the name to idle

        const idleAction = mixer.clipAction(idleAnim);
        idleAction.setLoop(THREE.LoopRepeat, Infinity);
        idle = idleAction;
        idle.play();
      }

      // Remove loader after successful model load
      const loader = document.getElementById("loader");
      if (loader) {
        loader.remove();
      }

      // Load additional animations after model is ready
      loadAdditionalAnimations(gltf);

      // Run diagnostic functions
      inspectModelBones();
      checkAnimations();

      // Start jaw animation after model is loaded
      animateJaw(3);

      // Add diagnostic call
      // diagnoseModelIssues();
    },
    undefined,
    function (error) {
      console.error("Error loading model:", error);
    }
  );
})(); // Don't add anything below this line

function analyzeSkinWeights(mesh, boneName) {
  if (!mesh.isSkinnedMesh) return null;

  const skinWeights = [];
  const geometry = mesh.geometry;
  const skinIndex = geometry.attributes.skinIndex;
  const skinWeight = geometry.attributes.skinWeight;

  // Get bone index
  const boneIndex = mesh.skeleton.bones.findIndex(
    (bone) => bone.name === boneName
  );
  if (boneIndex === -1) return null;

  // Analyze weights for this bone
  for (let i = 0; i < skinIndex.count; i++) {
    const indices = [
      skinIndex.getX(i),
      skinIndex.getY(i),
      skinIndex.getZ(i),
      skinIndex.getW(i),
    ];
    const weights = [
      skinWeight.getX(i),
      skinWeight.getY(i),
      skinWeight.getZ(i),
      skinWeight.getW(i),
    ];

    // Check if this vertex is influenced by our bone
    const boneWeightIndex = indices.indexOf(boneIndex);
    if (boneWeightIndex !== -1) {
      skinWeights.push({
        vertexIndex: i,
        weight: weights[boneWeightIndex],
        position: geometry.attributes.position
          ? new THREE.Vector3().fromBufferAttribute(
              geometry.attributes.position,
              i
            )
          : null,
      });
    }
  }

  return {
    meshName: mesh.name,
    boneName: boneName,
    totalVertices: skinIndex.count,
    influencedVertices: skinWeights.length,
    maxWeight: Math.max(...skinWeights.map((w) => w.weight)),
    minWeight: Math.min(...skinWeights.map((w) => w.weight)),
    averageWeight:
      skinWeights.reduce((sum, w) => sum + w.weight, 0) / skinWeights.length,
    weights: skinWeights,
  };
}
