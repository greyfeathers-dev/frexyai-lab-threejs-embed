/** @format */
function storeMerchantId() {
   try {
      const script = document.currentScript; // The script that is currently executing
      console.log("Script:", script);
      if (script) {
         const src = new URL(script.src);
         console.log("Src:", src);
         merchantId = src.searchParams.get("merchantId") || "default";
         if (merchantId !== "default") {
            console.log("Setting merchantId:", merchantId);
            localStorage.setItem("merchantId", merchantId);
         }
      }
   } catch (error) {
      console.error("Error getting merchantId:", error);
   }
   return "default";
}

// Move merchantId logic to the top, before any script loading
storeMerchantId();

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
   loadScript("https://cdn.jsdelivr.net/npm/three@0.139.0/build/three.min.js", function () {
      // Load the second script after the first one has loaded
      loadScript("https://cdn.jsdelivr.net/npm/three@0.139.0/examples/js/loaders/GLTFLoader.js", function () {
         // Load your main script after both scripts are loaded
         loadScript("https://frexyai-lab-threejs-embed.vercel.app/index.js", function () {
            console.log("All scripts loaded!");
         });
      });
   });
}, 0);

//This is loadjs
