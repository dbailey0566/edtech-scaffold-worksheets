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

function renderControlMap(controls) {
  const container = document.getElementById("scaffold");

  const controlSection = document.createElement("section");
  controlSection.className = "control-map";

  controlSection.innerHTML = `
    <h2>Remote Control Mapping</h2>

    <div class="controls-grid">
      <div></div>
      <div class="control up">↑<br><span>${controls.up}</span></div>
      <div></div>

      <div class="control left">←<br><span>${controls.left}</span></div>
      <div class="control stop">■<br><span>Stop</span></div>
      <div class="control right">→<br><span>${controls.right}</span></div>

      <div></div>
      <div class="control down">↓<br><span>${controls.down}</span></div>
      <div></div>
    </div>

    <div class="instructor-note">
      <strong>Instructor guidance:</strong>
      <ul>
        ${controls.instructorTips.map(tip => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `;

  container.appendChild(controlSection);
}

function renderFinchScaffold(config) {
  const container = document.getElementById("scaffold");

  // Clear FIRST
  container.innerHTML = "";

  // Then render control map
  renderControlMap(config.controls);

  // Set title
  document.getElementById("activity-title").textContent =
    config.activityTitle;

  // Then render steps
  config.steps.forEach((step, index) => {
    const section = document.createElement("section");
    section.className = "step locked";
    section.dataset.stepIndex = index;

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

  currentStep.classList.add("completed");
  e.target.disabled = true;

  const nextStep = document.querySelector(
    `.step[data-step-index="${index + 1}"]`
  );

  if (nextStep) {
    nextStep.classList.remove("locked");
  }
}
