import { TOOLTIP_CONFIG } from "../config/constants";

export class Tooltip {
  constructor() {
    this.isMobile = window.matchMedia("(max-width: 767px)").matches;
    this.tooltipContainer = null;
    this.currentAnimationID = null;
    this.timeoutDisappear = null;
  }

  show(config, onClose) {
    if (this.currentAnimationID === config.id) return;

    this.currentAnimationID = config.id;
    this.createTooltip(config, onClose);
  }

  createTooltip(config, onClose) {
    const {
      id,
      text,
      time,
      ctaList,
      hasClose,
      onClickClose,
      timerCountdown,
      format,
      destination_page,
    } = config;

    this.tooltipContainer = document.createElement("div");
    this.tooltipContainer.id = "tooltipContainer";
    this.styleTooltipContainer();

    const tooltip = this.createTooltipContent(text);
    this.tooltipContainer.appendChild(tooltip);

    if (hasClose) {
      this.addCloseButton(onClickClose, onClose);
    }

    if (timerCountdown) {
      this.addCountdownTimer(timerCountdown, onClose);
    }

    if (ctaList) {
      this.addCallToActions(ctaList, id, format, destination_page);
    }

    document.body.appendChild(this.tooltipContainer);

    if (time) {
      this.timeoutDisappear = setTimeout(() => {
        this.close(onClose);
      }, time * 1000);
    }
  }

  styleTooltipContainer() {
    Object.assign(this.tooltipContainer.style, {
      position: "fixed",
      maxWidth: this.isMobile ? "260px" : "300px",
      right: this.isMobile ? "90px" : "120px",
      bottom: this.isMobile ? "40px" : "52px",
      display: "block",
    });
  }

  createTooltipContent(text) {
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";

    const textArea = document.createElement("p");
    textArea.innerHTML = text;
    textArea.style.margin = 0;
    textArea.style.overflowWrap = "break-word";
    tooltip.appendChild(textArea);

    Object.assign(tooltip.style, {
      position: "relative",
      backgroundColor: TOOLTIP_CONFIG.BG,
      color: TOOLTIP_CONFIG.COLOR,
      padding: "16px 20px",
      borderRadius: "16px",
      fontSize: "16px",
      lineHeight: "24px",
      fontFamily: "sans-serif",
      pointerEvents: "none",
      whiteSpace: "wrap",
      zIndex: "10",
      boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
      margin: "8px 0",
    });

    return tooltip;
  }

  addCloseButton(onClickClose, onClose) {
    const closeBtn = document.createElement("button");
    Object.assign(closeBtn.style, {
      background: "white",
      padding: "4px",
      border: "0",
      position: "absolute",
      top: "-6px",
      left: "-12px",
      width: "26px",
      height: "26px",
      fontSize: "10px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "99",
      cursor: "pointer",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    });

    const closeImageIcon = document.createElement("img");
    closeImageIcon.src =
      "https://nbizksjfzehbiwmcipep.supabase.co/storage/v1/object/public/model/X%20Close%20Icon.png";
    closeImageIcon.style.width = "16px";
    closeImageIcon.style.height = "16px";
    closeBtn.appendChild(closeImageIcon);

    closeBtn.addEventListener("click", () => {
      if (onClickClose?.alertText) {
        this.close(onClose);
        // Trigger new tooltip with alert text
        return;
      }
      this.close(onClose);
    });

    this.tooltipContainer.appendChild(closeBtn);
  }

  addCountdownTimer(timerCountdown, onClose) {
    const timer = document.createElement("div");
    Object.assign(timer.style, {
      textAlign: "center",
      padding: "2px 6px",
      color: "#ff0000",
      fontSize: "12px",
      fontWeight: "bold",
      position: "absolute",
      top: "-8px",
      left: "-10px",
      borderRadius: "8px",
      zIndex: "99",
      background: "white",
    });

    const updateTimer = () => {
      if (timerCountdown > 0) {
        timer.innerText = this.formatTime(timerCountdown);
        timerCountdown--;
      } else {
        this.close(onClose);
      }
    };

    setInterval(updateTimer, 1000);
    this.tooltipContainer.appendChild(timer);
  }

  addCallToActions(ctaList, id, format, destination_page) {
    const ctaContainer = document.createElement("div");
    ctaContainer.style.marginTop = "12px";

    ctaList.forEach((ctaItem) => {
      const btn = document.createElement("button");
      btn.innerHTML = ctaItem.text;

      Object.assign(btn.style, {
        borderRadius: "28px",
        border: "0",
        fontSize: "14px",
        lineHeight: "24px",
        fontFamily: "sans-serif",
        background: ctaItem.bg,
        color: ctaItem.color,
        padding: "10px 14px",
        marginRight: "6px",
        cursor: "pointer",
      });

      btn.addEventListener("click", () => {
        this.handleCtaClick(id, format, destination_page);
      });

      ctaContainer.appendChild(btn);
    });

    this.tooltipContainer.appendChild(ctaContainer);
  }

  handleCtaClick(id, format, destination_page) {
    // Implement click handling logic here
    this.close();
  }

  close(onClose) {
    if (this.tooltipContainer) {
      this.tooltipContainer.remove();
      this.currentAnimationID = null;
      if (this.timeoutDisappear) {
        clearTimeout(this.timeoutDisappear);
        this.timeoutDisappear = null;
      }
      if (onClose) onClose();
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }
}
