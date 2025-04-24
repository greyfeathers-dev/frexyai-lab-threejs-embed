/** @format */
//this is load.js
function getMerchantId() {
  try {
    const script = document.currentScript; // The script that is currently executing

    if (script) {
      const src = new URL(script.src);
      const id = src.searchParams.get("merchantId") || "default";
      console.log("Extracted merchantId from URL:", id);
      return id;
    }
  } catch (error) {
    console.error("Error getting merchantId:", error);
  }
  return "default";
}

const merchantId = getMerchantId();
console.log("Merchant ID:", merchantId);

// Use '*' as target origin to allow cross-origin communication
window.parent.postMessage({ type: "MERCHANT_ID", merchantId }, "*");

try {
  localStorage.setItem("merchantId", merchantId);
  console.log(
    "Merchant ID stored in localStorage:",
    localStorage.getItem("merchantId")
  );
} catch (error) {
  console.error("Error storing merchantId:", error);
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = () => {
      console.log(`Script loaded successfully: ${url}`);
      resolve();
    };
    script.onerror = (error) => {
      console.error(`Error loading script ${url}:`, error);
      reject(error);
    };
    document.head.appendChild(script);
  });
}

// Load the scripts in the correct order
loadScript("https://cdn.jsdelivr.net/npm/three@0.139.0/build/three.min.js")
  .then(() =>
    loadScript(
      "https://cdn.jsdelivr.net/npm/three@0.139.0/examples/js/loaders/GLTFLoader.js"
    )
  )
  .then(() =>
    loadScript(
      "https://frexyai-lab-threejs-embed-pre-staging.vercel.app/index.js"
    )
  )
  .then(() => console.log("All scripts loaded successfully!"))
  .catch((error) => console.error("Error loading scripts:", error));

//This is loadjs
