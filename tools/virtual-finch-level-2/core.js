(() => {
  "use strict";

  // ---------- CONFIG ----------
  let cfg;

  // ---------- DOM ----------
  const elTitle = document.getElementById("toolTitle");
  const elDesc = document.getElementById("toolDesc");

  const worldEl = document.getElementById("world");
  const finchEl = document.getElementById("finch");

  const eventSelect = document.getElementById("eventSelect");
  const actionSelect = document.getElementById("actionSelect");
  const addRuleBtn = document.getElementById("addRuleBtn");
  const rulesList = document.getElementById("rulesList");

  const stepInput = document.getElementById("stepInput");
  const wallMode = document.getElementById("wallMode");

  const runBtn = document.getElementById("runBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");
  const printBtn = document.getElementById("printBtn");

  const exportBtn = document.getElementById("exportBtn");
  const importBtn = document.getElementById("importBtn");
  const rulesJson = document.getElementById("rulesJson");
  const statusEl = document.getElementById("status");

  const posText = document.getElementById("posText");
  const runText = document.getElementById("runText");

  // ---------- STATE ----------
  const SPACE_SIZE = 6; // pixels per space
  let isRunning = false;
  let rules = [];
  let position = { x: 0, y: 0 };

  let activeDirections = new Set();
  let moveInterval = null;
  let remainingSpaces = 0;
  let currentDirection = null;
  let directionVector = { x: 0, y: 0 };
  // ---------- HELPERS ----------
  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  function setRunState(running) {
    isRunning = running;
    runText.textContent = running ? "Running" : "Stopped";
    stepInput.disabled = running;
    setStatus(running ? "Hold arrow keys to move." : "Stopped.");
  }

  function clampPosition(next) {
    const maxX = cfg.world.width - cfg.finch.size;
    const maxY = cfg.world.height - cfg.finch.size;
  
    return {
      x: Math.max(0, Math.min(maxX, next.x)),
      y: Math.max(0, Math.min(maxY, next.y))
    };
  }

  function addClickFeedback(btn) {
    btn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        btn.classList.add("is-pressed");
      }
    });
  
    btn.addEventListener("keyup", e => {
      if (e.key === "Enter" || e.key === " ") {
        btn.classList.remove("is-pressed");
      }
    });
  }


  

  function draw() {
    finchEl.style.transform = `translate(${position.x}px, ${position.y}px)`;
    posText.textContent = `x ${position.x}, y ${position.y}`;
  }

  // ---------- SELECTS ----------
  function populateSelects() {
    eventSelect.innerHTML = "";
    actionSelect.innerHTML = "";

    cfg.events.forEach(ev => {
      const opt = document.createElement("option");
      opt.value = ev.id;
      opt.textContent = ev.label;
      eventSelect.appendChild(opt);
    });

    cfg.actions.forEach(ac => {
      const opt = document.createElement("option");
      opt.value = ac.id;
      opt.textContent = ac.label;
      actionSelect.appendChild(opt);
    });
  }

  function getEventById(id) {
    return cfg.events.find(e => e.id === id);
  }

  function getActionById(id) {
    return cfg.actions.find(a => a.id === id);
  }

  // ---------- RULES ----------
  function renderRules() {
    rulesList.innerHTML = "";

    if (rules.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No rules yet. Add at least one rule to test movement.";
      empty.style.color = "#6b7280";
      rulesList.appendChild(empty);
      return;
    }

    rules.forEach((r, idx) => {
      const ev = getEventById(r.eventId);
      const ac = getActionById(r.actionId);

      const card = document.createElement("div");
      card.style.display = "flex";
      card.style.justifyContent = "space-between";
      card.style.alignItems = "center";
      card.style.padding = "8px 10px";
      card.style.border = "1px solid #e5e7eb";
      card.style.borderRadius = "8px";
      card.style.marginBottom = "6px";
      card.style.fontSize = "14px";

      const text = document.createElement("div");
      text.textContent = `${ev.label} → ${ac.label}`;

      const delBtn = document.createElement("button");
      delBtn.textContent = "Remove";
      delBtn.style.fontSize = "12px";
      delBtn.addEventListener("click", () => {
        rules.splice(idx, 1);
        renderRules();
        setStatus("Rule removed.");
      });

      card.appendChild(text);
      card.appendChild(delBtn);
      rulesList.appendChild(card);
    });
  }

  function addRule() {
    const eventId = eventSelect.value;
    const actionId = actionSelect.value;

    if (rules.some(r => r.eventId === eventId)) {
      setStatus("That key already has a rule. Remove it first to change it.");
      return;
    }

    rules.push({ eventId, actionId });
    renderRules();
    setStatus("Rule added.");
  }

  // ---------- MOVEMENT (LEVEL 2) ----------
  function applyContinuousMovement() {
    if (remainingSpaces <= 0 || !currentDirection) {
      clearInterval(moveInterval);
      moveInterval = null;
      return;
    }
  
    let nextX = position.x + directionVector.x * SPACE_SIZE;
    let nextY = position.y + directionVector.y * SPACE_SIZE;
  
    const maxX = cfg.world.width - cfg.finch.size;
    const maxY = cfg.world.height - cfg.finch.size;
  
    // X wall handling
    if (nextX < 0 || nextX > maxX) {
      if (wallMode.value === "bounce") {
        directionVector.x *= -1;
        nextX = position.x + directionVector.x * SPACE_SIZE;
      } else {
        remainingSpaces = 0;
        return;
      }
    }
  
    // Y wall handling
    if (nextY < 0 || nextY > maxY) {
      if (wallMode.value === "bounce") {
        directionVector.y *= -1;
        nextY = position.y + directionVector.y * SPACE_SIZE;
      } else {
        remainingSpaces = 0;
        return;
      }
    }
  
    position.x = nextX;
    position.y = nextY;
  
    remainingSpaces--; // ALWAYS consume one space
    draw();
  }




  function onKeyDown(e) {
    if (!isRunning || moveInterval) return;
  
    const ev = cfg.events.find(evt => evt.key === e.key);
    if (!ev) return;
  
    const rule = rules.find(r => r.eventId === ev.id);
    if (!rule) return;
  
    const action = getActionById(rule.actionId);
    if (!action) return;
  
    e.preventDefault();
  
    remainingSpaces = Math.max(1, parseInt(stepInput.value, 10) || 1);
    currentDirection = ev.id;
    directionVector = { ...action.delta };
  
    moveInterval = setInterval(applyContinuousMovement, 40);
  }

  function onKeyUp(e) {
    const ev = cfg.events.find(evt => evt.key === e.key);
    if (!ev) return;
  
    remainingSpaces = 0;
    currentDirection = null;
  
    if (moveInterval) {
      clearInterval(moveInterval);
      moveInterval = null;
    }
  }
  
  
    function reset() {
      position = { ...cfg.finch.startPosition };
      activeDirections.clear();
  
      if (moveInterval) {
        clearInterval(moveInterval);
        moveInterval = null;
      }
  
      draw();
      setStatus("Reset to start position.");
      remainingSpaces = 0;
      currentDirection = null;
    }

  // ---------- IMPORT / EXPORT ----------
  function exportRules() {
    rulesJson.value = JSON.stringify({ rules }, null, 2);
    setStatus("Rules exported.");
  }

  function importRules() {
    try {
      const parsed = JSON.parse(rulesJson.value);
      if (!Array.isArray(parsed.rules)) throw new Error();

      rules = parsed.rules;
      renderRules();
      setStatus("Rules imported.");
    } catch {
      setStatus("Invalid JSON.");
    }
  }

  // ---------- INIT ----------
  function init() {
    cfg = window.virtualFinchConfig;
    if (!cfg) return;

    elTitle.textContent = cfg.toolMeta.title;
    if (elDesc) elDesc.textContent = cfg.toolMeta.description;

    worldEl.style.width = `${cfg.world.width}px`;
    worldEl.style.height = `${cfg.world.height}px`;

    finchEl.style.width = `${cfg.finch.size}px`;
    finchEl.style.height = `${cfg.finch.size}px`;
    finchEl.style.borderRadius =
      cfg.finch.shape === "circle" ? "999px" : "6px";

    populateSelects();
    renderRules();
    reset();
    setRunState(false);

    addRuleBtn.addEventListener("click", addRule);
    runBtn.addEventListener("click", () => setRunState(true));
    stopBtn.addEventListener("click", () => setRunState(false));
    resetBtn.addEventListener("click", reset);
    printBtn.addEventListener("click", () => window.print());
    exportBtn.addEventListener("click", exportRules);
    importBtn.addEventListener("click", importRules);
    [runBtn, stopBtn, resetBtn, printBtn].forEach(addClickFeedback);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
