import { CHATBOT_PAGE } from "../config/constants";

export class ChatWindow {
  constructor() {
    this.isMobile = window.matchMedia("(max-width: 767px)").matches;
    this.chatWindow = null;
    this.sourceLink = null;
  }

  init(sourceLink) {
    this.sourceLink = sourceLink;
    this.createChatWindow();
  }

  createChatWindow() {
    this.chatWindow = document.createElement("div");
    this.chatWindow.id = "chatWindow";
    this.styleChatWindow();
    this.createIframe();
    this.createCloseButton();
    document.body.appendChild(this.chatWindow);
    this.chatWindow.style.display = "none";
  }

  styleChatWindow() {
    Object.assign(this.chatWindow.style, {
      position: "fixed",
      boxSizing: "border-box",
      border: this.isMobile ? 0 : "0.3px solid #8F8F8F",
      color: "#fff",
      borderRadius: this.isMobile ? 0 : "16px",
      background: "#fff",
      fontSize: "14px",
      width: this.isMobile ? "100%" : "390px",
      height: this.isMobile ? "100%" : "625px",
      bottom: this.isMobile ? 0 : "20px",
      right: this.isMobile ? 0 : "20px",
      zIndex: "1000",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    });
  }

  createIframe() {
    const merchantId = localStorage.getItem("merchantId");
    const iframeContainer = document.createElement("iframe");
    iframeContainer.id = "chatbot-iframe";
    iframeContainer.src = `${this.sourceLink}&merchantId=${merchantId}`;

    Object.assign(iframeContainer.style, {
      width: "100%",
      height: "100%",
      border: 0,
      borderRadius: this.isMobile ? 0 : "16px",
    });

    this.chatWindow.appendChild(iframeContainer);
  }

  createCloseButton() {
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "×";

    Object.assign(closeButton.style, {
      cursor: "pointer",
      position: "absolute",
      right: "16px",
      top: "8px",
      fontSize: "24px",
      color: "#fff",
    });

    closeButton.onclick = () => this.hide();
    this.chatWindow.appendChild(closeButton);
  }

  show() {
    const chatbot = document.getElementById("chatbot-iframe");
    chatbot.src = this.sourceLink;
    setTimeout(() => {
      this.chatWindow.style.display = "block";
    }, 200);
  }

  hide() {
    this.chatWindow.style.display = "none";
  }

  updateSourceLink(newLink) {
    this.sourceLink = newLink;
  }
}
