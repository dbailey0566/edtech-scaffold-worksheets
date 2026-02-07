const finch = document.getElementById("finch");
const target = document.getElementById("target");
const statusEl = document.getElementById("status");

const CELL_SIZE = 40;

// starting positions
let finchPos = { x: 0, y: 0 };
let targetPos = { x: 5, y: 3 };

function draw() {
  finch.style.left = `${finchPos.x * CELL_SIZE}px`;
  finch.style.top = `${finchPos.y * CELL_SIZE}px`;

  target.style.left = `${targetPos.x * CELL_SIZE}px`;
  target.style.top = `${targetPos.y * CELL_SIZE}px`;
}

draw();

statusEl.textContent = "Level 3 ready.";

