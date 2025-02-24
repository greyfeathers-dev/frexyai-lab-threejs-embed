/** @format */

function loadScript(url, callback) {
   function getMerchantId() {
      try {
         // Get script tag that loaded this file
         const scripts = document.getElementsByTagName("script");
         const script = scripts[scripts.length - 1]; // Last loaded script
         const src = new URL(script.src);
         return src.searchParams.get("merchantId") || "default";
      } catch (error) {
         console.error("Error getting merchantId:", error);
         return "default";
      }
   }
   const merchantId = getMerchantId();
   console.log("merchantId", merchantId);
   localStorage.setItem("merchantId", merchantId);
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
      loadScript("https://cdn.jsdelivr.net/gh/greyfeathers-dev/frexyai-lab-threejs-embed@main/index.js", function () {
         console.log("All scripts loaded!");
      });
   });
});
