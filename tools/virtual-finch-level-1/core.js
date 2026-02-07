(() => {
  "use strict";

  // ---------- CONFIG (deferred) ----------
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
  let isRunning = false;
  let rules = [];
  let position = { x: 0, y: 0 };

  // ---------- HELPERS ----------
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
      return {
        x: (next.x + maxX + 1) % (maxX + 1),
        y: (next.y + maxY + 1) % (maxY + 1)
      };
    }

    return {
      x: Math.max(0, Math.min(maxX, next.x)),
      y: Math.max(0, Math.min(maxY, next.y))
    };
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

  // ---------- MOVEMENT ----------
  function reset() {
    position = { ...cfg.finch.startPosition };
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
    position = clampPosition({
      x: position.x + action.delta.x * step,
      y: position.y + action.delta.y * step
    });

    draw();
  }

  function onKeyDown(e) {
    if (!isRunning) return;
    stepForKey(e.key);
  }

  // ---------- IMPORT / EXPORT ----------
  function exportRules() {
    rulesJson.value = JSON.stringify(
      {
        rules,
        meta: {
          exportedAt: new Date().toISOString(),
          tool: cfg.toolMeta.title
        }
      },
      null,
      2
    );
    setStatus("Rules exported.");
  }

  function importRules() {
    try {
      const parsed = JSON.parse(rulesJson.value);
      if (!Array.isArray(parsed.rules)) throw new Error();

      const validEvents = new Set(cfg.events.map(e => e.id));
      const validActions = new Set(cfg.actions.map(a => a.id));

      rules = parsed.rules.filter(
        r => validEvents.has(r.eventId) && validActions.has(r.actionId)
      );

      renderRules();
      setStatus("Rules imported.");
    } catch {
      setStatus("Invalid JSON. Check the format and try again.");
    }
  }

  // ---------- BOOT ----------
  function init() {
    cfg = window.virtualFinchConfig;

    if (!cfg) {
      console.error("virtualFinchConfig still not available at init()");
      return;
    }

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
    window.addEventListener("keydown", onKeyDown);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
