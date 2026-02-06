
(() => {
  "use strict";

  const cfg = window.virtualFinchConfig;
  if (!cfg) {
    console.error("virtualFinchConfig not found. Make sure config.js loads before core.js.");
    return;
  }

  const elTitle = document.getElementById("toolTitle");
  const elDesc = document.getElementById("toolDesc");

  const worldEl = document.getElementById("world");
  const finchEl = document.getElementById("finch");

  const eventSelect = document.getElementById("eventSelect");
  const actionSelect = document.getElementById("actionSelect");
  const addRuleBtn = document.getElementById("addRuleBtn");
  const rulesList = document.getElementById("rulesList");

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

  elTitle.textContent = cfg.toolMeta?.title || "Virtual Finch Simulator";
  elDesc.textContent = cfg.toolMeta?.description || "";

  worldEl.style.width = `${cfg.world.width}px`;
  worldEl.style.height = `${cfg.world.height}px`;

  finchEl.style.width = `${cfg.finch.size}px`;
  finchEl.style.height = `${cfg.finch.size}px`;
  finchEl.style.borderRadius = cfg.finch.shape === "circle" ? "999px" : "8px";

  let isRunning = false;
  let rules = [];
  let position = { x: cfg.finch.startPosition.x, y: cfg.finch.startPosition.y };

  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  function setRunState(running) {
    isRunning = running;
    runText.textContent = running ? "Running" : "Stopped";
    setStatus(running ? "Use arrow keys to test your rules." : "Stopped.");
  }

  function clampPosition(next) {
    const maxX = cfg.world.width - cfg.finch.size;
    const maxY = cfg.world.height - cfg.finch.size;

    if (cfg.world.boundary === "wrap") {
      let x = next.x;
      let y = next.y;

      if (x < 0) x = maxX;
      if (x > maxX) x = 0;
      if (y < 0) y = maxY;
      if (y > maxY) y = 0;

      return { x, y };
    }

    const x = Math.max(0, Math.min(maxX, next.x));
    const y = Math.max(0, Math.min(maxY, next.y));
    return { x, y };
  }

  function draw() {
    finchEl.style.transform = `translate(${position.x}px, ${position.y}px)`;
    posText.textContent = `x ${position.x}, y ${position.y}`;
  }

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

  function renderRules() {
    rulesList.innerHTML = "";

    if (rules.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No rules yet. Add at least one rule to test movement.";
      rulesList.appendChild(empty);
      return;
    }

    rules.forEach((r, idx) => {
      const ev = getEventById(r.eventId);
      const ac = getActionById(r.actionId);

      const card = document.createElement("div");
      card.className = "ruleCard";

      const text = document.createElement("div");
      text.className = "ruleText";
      text.textContent = `${ev?.label || r.eventId}  →  ${ac?.label || r.actionId}`;

      const actions = document.createElement("div");

      const delBtn = document.createElement("button");
      delBtn.className = "smallBtn";
      delBtn.type = "button";
      delBtn.textContent = "Remove";
      delBtn.addEventListener("click", () => {
        rules.splice(idx, 1);
        renderRules();
        setStatus("Rule removed.");
      });

      actions.appendChild(delBtn);
      card.appendChild(text);
      card.appendChild(actions);
      rulesList.appendChild(card);
    });
  }

  function addRule() {
    const eventId = eventSelect.value;
    const actionId = actionSelect.value;

    const exists = rules.some(r => r.eventId === eventId);
    if (exists) {
      setStatus("That key already has a rule. Remove it first if you want to change it.");
      return;
    }

    rules.push({ eventId, actionId });
    renderRules();
    setStatus("Rule added.");
  }

  function reset() {
    position = { x: cfg.finch.startPosition.x, y: cfg.finch.startPosition.y };
    draw();
    setStatus("Reset to start position.");
  }

  function stepForKey(key) {
    const ev = cfg.events.find(e => e.key === key);
    if (!ev) return;

    const rule = rules.find(r => r.eventId === ev.id);
    if (!rule) return;

    const action = getActionById(rule.actionId);
    if (!action) return;

    const step = cfg.world.stepSize;
    const next = {
      x: position.x + action.delta.x * step,
      y: position.y + action.delta.y * step
    };

    position = clampPosition(next);
    draw();
  }

  function onKeyDown(e) {
    if (!isRunning) return;
    stepForKey(e.key);
  }

  function exportRules() {
    const payload = {
      rules,
      meta: {
        exportedAt: new Date().toISOString(),
        tool: cfg.toolMeta?.title || "Virtual Finch Simulator"
      }
    };
    rulesJson.value = JSON.stringify(payload, null, 2);
    setStatus("Exported rules to JSON.");
  }

  function importRules() {
    const raw = rulesJson.value.trim();
    if (!raw) {
      setStatus("Paste JSON first.");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.rules)) {
        setStatus("Invalid JSON format. Expected an object with a rules array.");
        return;
      }

      const validEventIds = new Set(cfg.events.map(e => e.id));
      const validActionIds = new Set(cfg.actions.map(a => a.id));

      const cleaned = parsed.rules
        .filter(r => r && validEventIds.has(r.eventId) && validActionIds.has(r.actionId))
        .map(r => ({ eventId: r.eventId, actionId: r.actionId }));

      rules = cleaned;
      renderRules();
      setStatus("Imported rules.");
    } catch (err) {
      setStatus("JSON parse error. Fix the JSON and try again.");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
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

    window.addEventListener("keydown", onKeyDown);
  });
})();
