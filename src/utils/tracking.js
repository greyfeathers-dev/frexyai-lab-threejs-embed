import { ENDPOINT } from "../config/constants";

export class TrackingManager {
  constructor() {
    this.leadId = null;
    this.source = null;
    this.country = null;
    this.firstPageVisited = null;
  }

  init() {
    this.setLeadId();
    this.source = this.getSource();
    this.country = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.firstPageVisited = window.location.href;
  }

  setLeadId() {
    const id = localStorage.getItem("leadId");
    if (id) {
      this.leadId = id;
    } else {
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      this.leadId = uniqueId;
      localStorage.setItem("leadId", uniqueId);
    }
  }

  getSource() {
    const referrer = document.referrer;
    const path = window.location.href;

    if (referrer === "https://www.google.com/") return "google";
    if (referrer === "https://www.yahoo.com/") return "yahoo";
    if (referrer === "https://www.bing.com/") return "bing";
    if (referrer === "https://www.youtube.com/") return "youtube";
    if (referrer === "https://www.linkedin.com/") return "linkedin";
    if (referrer === "https://www.reddit.com/") return "reddit";
    if (path.includes("gclid")) return "paid_google";
    if (path.includes("msclkid")) return "paid_bing";
    if (path.includes("li_fat_id")) return "paid_linkedin";
    if (path.includes("fbclid")) return "paid_meta";
    if (path.includes("wbraid")) return "paid_youtube";
    if (path.includes("cid")) return "paid_reddit";
    return "direct";
  }

  async addActivity(activity) {
    if (!this.leadId) return;

    try {
      const response = await fetch(`${ENDPOINT}/api/add-activity`, {
        method: "POST",
        body: JSON.stringify({
          id: this.leadId,
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
        console.error("Failed to add activity");
      }
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  }

  async incrementClick(id) {
    await this.addActivity({
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
        console.error("Failed to increment click");
      }
    } catch (error) {
      console.error("Error incrementing click:", error);
    }
  }

  async incrementImpression(id) {
    await this.addActivity({
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
        console.error("Failed to increment impression");
      }
    } catch (error) {
      console.error("Error incrementing impression:", error);
    }
  }

  trackButtonEvents() {
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.addActivity({
          type: "buttonClicked",
          button_name: button.innerText || "UNNAMED",
        });
      });

      let hoverTimeout;
      button.addEventListener("mouseenter", () => {
        hoverTimeout = setTimeout(() => {
          this.addActivity({
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
}
