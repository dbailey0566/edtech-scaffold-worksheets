const finchEl = document.getElementById("finch");
const targetEl = document.getElementById("target");
const stepsInput = document.getElementById("stepsInput");
const runBtn = document.getElementById("runBtn");
const statusEl = document.getElementById("status");

const CELL_SIZE = 40;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

let finch = {
  x: 0,
  y: 0,
  dx: 1,
  dy: 0
};

let target = {
  x: 6,
  y: 0
};

let moving = false;

function draw() {
  finchEl.style.left = `${finch.x * CELL_SIZE}px`;
  finchEl.style.top = `${finch.y * CELL_SIZE}px`;

  targetEl.style.left = `${target.x * CELL_SIZE}px`;
  targetEl.style.top = `${target.y * CELL_SIZE}px`;
}

function bounceIfNeeded() {
  if (finch.x + finch.dx < 0 || finch.x + finch.dx >= GRID_WIDTH) {
    finch.dx *= -1;
  }

  if (finch.y + finch.dy < 0 || finch.y + finch.dy >= GRID_HEIGHT) {
    finch.dy *= -1;
  }
}

function reachedTarget() {
  return finch.x === target.x && finch.y === target.y;
}

function moveStep(interval, stepsRemainingRef) {
  bounceIfNeeded();

  finch.x += finch.dx;
  finch.y += finch.dy;

  draw();

  if (reachedTarget()) {
    clearInterval(interval);
    moving = false;
    statusEl.textContent = "Target reached. Movement stopped.";
    return true;
  }

  return false;
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
      statusEl.textContent = "Out of steps. Target not reached.";
      return;
    }

    const stopped = moveStep(interval);
    if (stopped) return;

    stepsRemaining -= 1;
  }, 400);
}

runBtn.addEventListener("click", () => {
  const steps = parseInt(stepsInput.value, 10);
  if (isNaN(steps) || steps <= 0) return;

  runMovement(steps);
});

draw();
statusEl.textContent = "Enter steps and try to reach the target.";
