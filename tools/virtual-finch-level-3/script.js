const finchEl = document.getElementById("finch");
const stepsInput = document.getElementById("stepsInput");
const runBtn = document.getElementById("runBtn");
const statusEl = document.getElementById("status");

const CELL_SIZE = 40;
const GRID_WIDTH = 10;

let finch = {
  x: 0,
  y: 0
};

let moving = false;

function drawFinch() {
  finchEl.style.left = `${finch.x * CELL_SIZE}px`;
  finchEl.style.top = `${finch.y * CELL_SIZE}px`;
}

function moveStep() {
  finch.x += 1;

  if (finch.x >= GRID_WIDTH) {
    finch.x = GRID_WIDTH - 1;
  }

  drawFinch();
}

function runMovement(steps) {
  if (moving) return;

  moving = true;
  statusEl.textContent = "Moving...";

  let stepsRemaining = steps;

  const interval = setInterval(() => {
    if (stepsRemaining <= 0) {
      clearInterval(interval);
      moving = false;
      statusEl.textContent = "Movement complete.";
      return;
    }

    moveStep();
    stepsRemaining -= 1;
  }, 400);
}

runBtn.addEventListener("click", () => {
  const steps = parseInt(stepsInput.value, 10);
  if (isNaN(steps) || steps <= 0) return;

  runMovement(steps);
});

drawFinch();
