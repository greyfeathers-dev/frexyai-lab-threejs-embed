/** @format */

const { CHATBOT_PAGE } = require("../constants/definitions");

/**
 * Generates a UUID v4 (random UUID)
 * Uses crypto.randomUUID() if available, otherwise falls back to manual implementation
 */
const generateUUID = () => {
   alert("generateUUID");
   if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
   }

   // Fallback UUID v4 implementation
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
   });
};

const isValidUUID = (str) => {
   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
   return uuidRegex.test(str);
};

const getLeadId = () => {
   alert("getLeadId");
   let leadId = localStorage.getItem("leadId");
   alert(leadId + "leadId");
   alert(isValidUUID(leadId) + "isValidUUID");
   console.log("Getting lead id here !!!!");

   if (!leadId || !isValidUUID(leadId)) {
      if (leadId && !isValidUUID(leadId)) {
         localStorage.removeItem("leadId");
      }
      leadId = generateUUID();
      localStorage.setItem("leadId", leadId);
   }
   return leadId;
};

const getOrUpdateOfferIds = (offerId) => {
   const existingOfferIds = JSON.parse(localStorage.getItem("offerIds")) || [];
   if (existingOfferIds.includes(offerId)) return existingOfferIds;
   existingOfferIds.push(offerId);
   localStorage.setItem("offerIds", JSON.stringify(existingOfferIds));
   return existingOfferIds;
};

const getSource = () => {
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
};

const getSourceLink = () => {
   const leadId = getLeadId();
   const source = getSource();
   const country = Intl.DateTimeFormat().resolvedOptions().timeZone;
   const firstPageVisited = window.location.href;

   return `${CHATBOT_PAGE}/chat?lead=${leadId}&source=${source}&country=${country}&firstPageVisited=${firstPageVisited}&conversion_page=${window.location.href}`;
};

module.exports = { getLeadId, getOrUpdateOfferIds, getSource, getSourceLink };
