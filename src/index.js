import { ThreeJSManager } from "./core/ThreeJSManager";
import { AnimationManager } from "./core/AnimationManager";
import { ChatWindow } from "./ui/ChatWindow";
import { Tooltip } from "./ui/Tooltip";
import { TrackingManager } from "./utils/tracking";
import { NOTIFICATION_SOUND, ENDPOINT } from "./config/constants";

class App {
  constructor() {
    this.threeJS = new ThreeJSManager();
    this.animationManager = new AnimationManager(this.threeJS);
    this.chatWindow = new ChatWindow();
    this.tooltip = new Tooltip();
    this.tracking = new TrackingManager();
    this.audio = new Audio(NOTIFICATION_SOUND);
    this.CONFIG = [];
    this.isFirstLandTriggered = false;
    this.inactivityTimers = new Map();
  }

  async init() {
    // Initialize components
    this.threeJS.init();
    this.tracking.init();
    await this.fetchConfig();
    await this.animationManager.loadAnimations();

    // Setup event listeners
    this.setupEventListeners();
    this.tracking.trackButtonEvents();

    // Start animation loop
    this.animate();
  }

  async fetchConfig() {
    try {
      const response = await fetch(
        `${ENDPOINT}/api/get-interaction?id=${this.tracking.leadId}`
      );
      if (response.ok) {
        const config = await response.json();
        this.CONFIG = config.data;
        this.triggerConfig();
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }

  setupEventListeners() {
    // Path change detection
    let previousPathname = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== previousPathname) {
        previousPathname = window.location.href;
        this.handlePathChange();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Mouse movement for head tracking
    if (!this.threeJS.isMobile) {
      let timer = setTimeout(() => this.animationManager.resetHead());
      document.addEventListener("mousemove", (e) => {
        if (this.animationManager.currentlyAnimating) return;
        if (timer) {
          clearTimeout(timer);
          timer = setTimeout(() => this.animationManager.resetHead(), 4000);
        }
        const mousecoords = { x: e.clientX, y: e.clientY };
        if (this.threeJS.neck) {
          this.animationManager.moveJoint(mousecoords, this.threeJS.neck, 50);
        }
      });
    }
  }

  handlePathChange() {
    this.tooltip.close();
    this.tracking.addActivity({
      type: "pageVisit",
      source: this.tracking.getSource(),
    });
  }

  triggerConfig() {
    this.CONFIG.forEach((config) => {
      if (!this.validateConfigRules(config)) return;

      switch (config.type) {
        case "onFirstLand":
          if (!this.isFirstLandTriggered) {
            this.showUIAnimation(config);
            this.isFirstLandTriggered = true;
          }
          break;
        case "inActive":
          this.handleInactiveConfig(config);
          break;
        case "scroll":
          this.handleScrollConfig(config);
          break;
        case "popstate":
          this.handlePopstateConfig(config);
          break;
      }
    });
  }

  validateConfigRules(config) {
    let isTrafficSourceValid = this.validateTrafficSource(config);
    let isLocationValid = this.validateLocation(config);
    return isTrafficSourceValid && isLocationValid;
  }

  validateTrafficSource(config) {
    if (!config?.traffic_source?.length) return true;
    if (config.traffic_source.includes("any")) return true;

    const path = window.location.href;
    const referrer = document.referrer;
    let isValid = false;

    config.traffic_source.forEach((source) => {
      switch (source) {
        case "direct":
          if (referrer === "") isValid = true;
          break;
        case "google":
          if (referrer === "https://www.google.com/") isValid = true;
          break;
        case "yahoo":
          if (referrer === "https://www.yahoo.com/") isValid = true;
          break;
        case "bing":
          if (referrer === "https://www.bing.com/") isValid = true;
          break;
        case "youtube":
          if (referrer === "https://www.youtube.com/") isValid = true;
          break;
        case "linkedin":
          if (referrer === "https://www.linkedin.com/") isValid = true;
          break;
        case "reddit":
          if (referrer === "https://www.reddit.com/") isValid = true;
          break;
        case "paid_google":
          if (path.includes("gclid")) isValid = true;
          break;
        case "paid_bing":
          if (path.includes("msclkid")) isValid = true;
          break;
        case "paid_linkedin":
          if (path.includes("li_fat_id")) isValid = true;
          break;
        case "paid_meta":
          if (path.includes("fbclid")) isValid = true;
          break;
        case "paid_youtube":
          if (path.includes("wbraid")) isValid = true;
          break;
        case "paid_reddit":
          if (path.includes("cid")) isValid = true;
          break;
      }
    });

    return isValid;
  }

  validateLocation(config) {
    if (!config?.location?.length) return true;

    const currTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return config.location.some((loc) => currTimezone === loc);
  }

  showUIAnimation(config) {
    if (this.animationManager.currentlyAnimating) return;

    this.animationManager.resetHead();
    if (config.animation) {
      this.animationManager.playAnimation(config.animation);
    }

    this.tracking.incrementImpression(config.id);
    this.audio.play();

    this.tooltip.show(config, () => {
      if (config.onEnd) {
        const nextConfig = this.CONFIG.find((c) => c.id === config.onEnd);
        if (nextConfig) this.showUIAnimation(nextConfig);
      }
    });
  }

  animate() {
    this.threeJS.update();
    requestAnimationFrame(() => this.animate());
  }

  handleInactiveConfig(config) {
    if (this.inactivityTimers.has(config.id)) return;

    const timer = setTimeout(() => {
      this.showUIAnimation(config);
    }, config.inActiveTime);

    this.inactivityTimers.set(config.id, timer);

    const resetTimer = () => {
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        this.showUIAnimation(config);
      }, config.inActiveTime);
      this.inactivityTimers.set(config.id, newTimer);
    };

    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);
    document.addEventListener("mousemove", resetTimer);
  }

  handleScrollConfig(config) {
    window.addEventListener("scroll", () => {
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
        if (this.displayState?.[config.id]) return;
        this.displayState = { ...this.displayState, [config.id]: true };
        this.showUIAnimation(config);
      }
    });
  }

  handlePopstateConfig(config) {
    const path = window.location.href;
    if (
      config.match === "equals"
        ? path === config.pagePath
        : path.includes(config.pagePath)
    ) {
      if (config.delay) {
        setTimeout(() => {
          this.showUIAnimation(config);
        }, config.delay);
      } else {
        this.showUIAnimation(config);
      }
    }
  }
}

// Initialize the application
const app = new App();
app.init();
