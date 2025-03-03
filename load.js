/** @format */
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
if (merchantId !== "default") {
   localStorage.setItem("merchantId", merchantId);
}

function loadScript(url, callback) {
   let script = document.createElement("script");
   script.type = "text/javascript";
   script.src = url;

   // Execute the callback function after the script is loaded
   script.onload = callback;

   document.head.appendChild(script);
}

// Load the first script
loadScript("https://cdn.jsdelivr.net/npm/three@0.139.0/build/three.min.js", function () {
   // Load the second script after the first one has loaded
   loadScript("https://cdn.jsdelivr.net/npm/three@0.139.0/examples/js/loaders/GLTFLoader.js", function () {
      // Load your main script after both scripts are loaded
      loadScript("https://cdn.jsdelivr.net/gh/greyfeathers-dev/frexyai-lab-threejs-embed@f37728a76e2384cea0ce62c68d87355de8350edb/index.js", function () {
         console.log("All scripts loaded!");
      });
   });
});
