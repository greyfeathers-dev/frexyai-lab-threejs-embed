document.addEventListener("DOMContentLoaded", function () {
  // Check if the user has visited before
  if (!localStorage.getItem("hasNewVisitor")) {
    localStorage.setItem("hasNewVisitor", "true"); // Store visit permanently
    // Delay the alert by 1 second
    setTimeout(function () {
      alert(
        "Hey! I'm Frexy, your personal AI assistant 😃. I'm here to help, guide, or even entertain."
      );
    }, 1000);
  } else if (localStorage.getItem("hasNewVisitor") === "true") {
    setTimeout(function () {
      alert(
        "Hey there, welcome back! I’ve been waiting for you 👋. Need any help?"
      );
    }, 3000);
  }
});
