const finchEl = document.getElementById("finch");
const targetEl = document.getElementById("target");
const stepsInput = document.getElementById("stepsInput");
const directionSelect = document.getElementById("directionSelect");
const runBtn = document.getElementById("runBtn");
const statusEl = document.getElementById("status");
const addCommandBtn = document.getElementById("addCommandBtn");
const programListEl = document.getElementById("programList");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const printBtn = document.getElementById("printBtn");
const programJsonEl = document.getElementById("programJson");

const CELL_SIZE = 40;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

let program = [];
let moving = false;

let finch = {
  x: 0,
  y: 0,
  dx: 1,
  dy: 0
};

let target = randomTarget();

/* ---------- Helpers ---------- */

function randomTarget() {
  return {
    x: Math.floor(Math.random() * GRID_WIDTH),
    y: Math.floor(Math.random() * GRID_HEIGHT)
  };
}

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

/* ---------- Movement ---------- */

function moveStep(interval) {
  bounceIfNeeded();

  finch.x += finch.dx;
  finch.y += finch.dy;

  draw();

  if (reachedTarget()) {
    clearInterval(interval);
    moving = false;
  
    finchEl.classList.remove("moving");
    statusEl.textContent = "Target reached! New target generated.";
  
    target = randomTarget();
    draw();
  
    return true;
  }


  return false;
}

function runProgram() {
  if (moving || program.length === 0) return;

  moving = true;
  statusEl.textContent = "Running program...";
  finchEl.classList.add("moving");

  // reset finch at start of program
  finch.x = 0;
  finch.y = 0;
  draw();

  let commandIndex = 0;
  let stepsRemaining = program[0].steps;

  finch.dx = program[0].dx;
  finch.dy = program[0].dy;

  const interval = setInterval(() => {
    if (stepsRemaining <= 0) {
      commandIndex += 1;
  
      // ✅ PROGRAM FINISHED
      if (commandIndex >= program.length) {
        clearInterval(interval);
        moving = false;
  
        finchEl.classList.remove("moving");
        statusEl.textContent = "Program complete.";
  
        return;
      }
  
      // move to next command
      finch.dx = program[commandIndex].dx;
      finch.dy = program[commandIndex].dy;
      stepsRemaining = program[commandIndex].steps;
      return;
    }
  
    // ✅ STEP EXECUTION (this is where target detection happens)
    const hitTarget = moveStep(interval);
    if (hitTarget) return;
  
    stepsRemaining -= 1;
  }, 400);
}

/* ---------- Controls ---------- */

// RUN PROGRAM (sequence only)
runBtn.addEventListener("click", () => {
  if (program.length === 0) return;
  if (moving) return;

  runProgram();
});

// ADD COMMAND
addCommandBtn.addEventListener("click", () => {
  const direction = directionSelect.value;
  const steps = parseInt(stepsInput.value, 10);
  if (isNaN(steps) || steps <= 0) return;

  let dx = 0;
  let dy = 0;

  if (direction === "right") dx = 1;
  if (direction === "left") dx = -1;
  if (direction === "up") dy = -1;
  if (direction === "down") dy = 1;

  program.push({ dx, dy, steps });
  renderProgram();
});

/* ---------- Program Display ---------- */

/* ---------- Program Display ---------- */

function renderProgram() {
  programListEl.innerHTML = "";

  program.forEach((cmd, index) => {
    const li = document.createElement("li");
    li.textContent = `Step ${index + 1}: move ${cmd.steps} ${
      cmd.dx === 1 ? "right" :
      cmd.dx === -1 ? "left" :
      cmd.dy === 1 ? "down" : "up"
    }`;
    programListEl.appendChild(li);
  });
}

/* ---------- Reset / Export / Print ---------- */

resetBtn.addEventListener("click", () => {
  moving = false;
  program = [];

  finch.x = 0;
  finch.y = 0;

  renderProgram();
  draw();

  statusEl.textContent = "Reset complete. Build a new program.";
});

exportBtn.addEventListener("click", () => {
  programJsonEl.value = JSON.stringify(program, null, 2);
  statusEl.textContent = "Program exported as JSON.";
});

printBtn.addEventListener("click", () => {
  if (!programJsonEl.value) {
    programJsonEl.value = JSON.stringify(program, null, 2);
  }
  window.print();
});
draw();
statusEl.textContent = "Build a program, then run it.";
