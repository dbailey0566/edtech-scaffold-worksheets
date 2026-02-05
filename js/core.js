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

  // Instructor override: unlock all steps
  if (instructorMode) {
    document.querySelectorAll(".step").forEach(step => {
      step.classList.remove("locked");
    });
  }
}

function renderFinchScaffold(config) {
  document.getElementById("activity-title").textContent =
    config.activityTitle;

  const container = document.getElementById("scaffold");
  container.innerHTML = "";

  config.steps.forEach((step, index) => {
    const section = document.createElement("section");
    section.className = "step locked";
    section.dataset.stepIndex = index;

    // First step starts unlocked
    if (index === 0) {
      section.classList.remove("locked");
    }

    section.innerHTML = `
      <h2>Step ${index + 1}: ${step.title}</h2>
      <p>${step.prompt}</p>

      <div class="instructor-note">
        <strong>Instructor note:</strong>
        <p>${step.instructorNote}</p>
      </div>

      <textarea placeholder="Student notes..."></textarea>

      <button class="completeStep">Mark Step Complete</button>
    `;

    container.appendChild(section);
  });

  document.querySelectorAll(".completeStep").forEach(button => {
    button.addEventListener("click", handleStepCompletion);
  });
}

function handleStepCompletion(e) {
  const currentStep = e.target.closest(".step");
  const index = parseInt(currentStep.dataset.stepIndex, 10);

  // Mark complete and prevent double-clicking
  currentStep.classList.add("completed");
  e.target.disabled = true;

  // Unlock the next step
  const nextStep = document.querySelector(
    `.step[data-step-index="${index + 1}"]`
  );

  if (nextStep) {
    nextStep.classList.remove("locked");
  }
}
