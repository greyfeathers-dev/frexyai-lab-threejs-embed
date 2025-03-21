/** @format */
//this is load.js
function getMerchantId() {
  try {
    const script = document.currentScript; // The script that is currently executing

    if (script) {
      const src = new URL(script.src);
      return src.searchParams.get("merchantId") || "default";
    }
  } catch (error) {
    console.error("Error getting merchantId:", error);
  }
  return "default";
}

const merchantId = getMerchantId();
console.log("Merchant ID:", merchantId);

window.parent.postMessage(
  { type: "MERCHANT_ID", merchantId },
  "https://frexyai-lab-saas-dashboard-staging.vercel.app"
);

// Inject a script that runs in the host page's context
(function injectScript() {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.textContent = `
      (function() {
         try {
            localStorage.setItem("merchantId", "${merchantId}");
            console.log("Merchant ID stored in localStorage:", localStorage.getItem("merchantId"));
         } catch (error) {
            console.error("Error storing merchantId:", error);
         }
      })();
   `;
  document.documentElement.appendChild(script);
})();

function loadScript(url, callback) {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

// Add a small delay to ensure merchantId is set before loading scripts
setTimeout(() => {
  // Load the first script
  loadScript(
    "https://cdn.jsdelivr.net/npm/three@0.139.0/build/three.min.js",
    function () {
      // Load the second script after the first one has loaded
      loadScript(
        "https://cdn.jsdelivr.net/npm/three@0.139.0/examples/js/loaders/GLTFLoader.js",
        function () {
          // Load your main script after both scripts are loaded
          loadScript(
            `https://frexyai-lab-threejs-embed-production.vercel.app/index.js?merchantId=${merchantId}`,
            function () {
              console.log("All scripts loaded!");
            }
          );
        }
      );
    }
  );
}, 0);

//This is loadjs
