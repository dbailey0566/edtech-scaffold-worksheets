let instructorMode = false;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof finchConfig !== "undefined") {
    renderFinchScaffold(finchConfig);
  }

  const toggleBtn = document.getElementById("modeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleMode);
  }
});

function toggleMode() {
  instructorMode = !instructorMode;
  document.body.classList.toggle("instructor", instructorMode);

  const btn = document.getElementById("modeToggle");
  btn.textContent = instructorMode
    ? "Switch to Student Mode"
    : "Switch to Instructor Mode";
}

function renderFinchScaffold(config) {
  document.getElementById("activity-title").textContent =
    config.activityTitle;

  const container = document.getElementById("scaffold");

  config.steps.forEach((step, index) => {
    const section = document.createElement("section");
    section.className = "step";

    section.innerHTML = `
      <h2>Step ${index + 1}: ${step.title}</h2>
      <p>${step.prompt}</p>
      <textarea placeholder="Student notes..."></textarea>
    `;

    container.appendChild(section);
  });
}
