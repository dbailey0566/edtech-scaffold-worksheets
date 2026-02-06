let instructorMode = false;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof finchConfig !== "undefined") {
    renderFinchScaffold(finchConfig);
  }

  const toggleBtn = document.getElementById("modeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleMode);
  }
  const printBtn = document.getElementById("printBtn");
if (printBtn) {
  printBtn.addEventListener("click", () => window.print());
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

/* ---------------------------
   RC CONTROL MAP
---------------------------- */
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

/* ---------------------------
   MAIN SCAFFOLD RENDER
---------------------------- */
function renderFinchScaffold(config) {
  const container = document.getElementById("scaffold");

  // Clear FIRST
  container.innerHTML = "";

  // Control map first
  renderControlMap(config.controls);

  // Title
  document.getElementById("activity-title").textContent =
    config.activityTitle;

  // Steps
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
        <p>${step.instructorNote || ""}</p>
      </div>

      ${
        step.codePractice
          ? renderCodePractice(step)
          : step.failures
          ? renderDebuggingUI(step)
          : `<textarea placeholder="Student notes..."></textarea>`
      }

      <button class="completeStep">Mark Step Complete</button>
    `;

    container.appendChild(section);
  });

  document.querySelectorAll(".completeStep").forEach(button => {
    button.addEventListener("click", handleStepCompletion);
  });
}

/* ---------------------------
   CODE PRACTICE (STEP 3)
---------------------------- */
function renderCodePractice(step) {
  return `
    <div class="code-practice">
      <p><strong>Event:</strong> ${step.codePractice.event}</p>

      <label>First action block:</label>
      <select class="blockSelect">
        <option value="">-- choose a block --</option>
        ${step.codePractice.blocks.map(
          b => `<option value="${b}">${b}</option>`
        ).join("")}
      </select>

      <label>Second action block:</label>
      <select class="blockSelect">
        <option value="">-- choose a block --</option>
        ${step.codePractice.blocks.map(
          b => `<option value="${b}">${b}</option>`
        ).join("")}
      </select>

      <p><strong>Explain your logic:</strong></p>
      <textarea placeholder="${step.codePractice.explanationPrompt}"></textarea>
    </div>
  `;
}

/* ---------------------------
   DEBUGGING UI (STEP 4)
---------------------------- */
function renderDebuggingUI(step) {
  return `
    <div class="debugging">
      <label>Select a failure scenario:</label>
      <select class="failureSelect">
        <option value="">-- Choose one --</option>
        ${step.failures.map(
          (f, i) => `<option value="${i}">${f.label}</option>`
        ).join("")}
      </select>

      <div class="failurePrompt"></div>
    </div>
  `;
}

document.addEventListener("change", e => {
  if (!e.target.classList.contains("failureSelect")) return;

  const stepSection = e.target.closest(".step");
  const stepIndex = parseInt(stepSection.dataset.stepIndex, 10);
  const failureIndex = e.target.value;

  if (failureIndex === "") return;

  const failure =
    finchConfig.steps[stepIndex].failures[failureIndex];

  stepSection.querySelector(".failurePrompt").innerHTML = `
    <p><strong>Student task:</strong> ${failure.studentPrompt}</p>
    <textarea placeholder="Explain what happened and why..."></textarea>

    <div class="instructor-note">
      <strong>Instructor note:</strong>
      <p>${failure.instructorNote}</p>
    </div>
  `;
});

/* ---------------------------
   STEP COMPLETION
---------------------------- */
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
