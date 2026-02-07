// Level 2 configuration: continuous movement with key hold
console.log("Level 2 config.js loaded");

const virtualFinchConfig = {
  toolMeta: {
    title: "Virtual Finch Simulator",
    description:
      "Level 2 · Control a virtual Finch using continuous movement while holding keys."
  },

  world: {
    width: 400,
    height: 400,
    stepSize: 1,        // small step, movement happens repeatedly
    speed: 3,           // pixels per tick
    boundary: "stop"    // stop at walls
  },

  finch: {
    size: 30,
    startPosition: { x: 180, y: 180 },
    shape: "square"
  },

  // Level 2 introduces HOLD-based events
  events: [
    {
      id: "arrow_up",
      label: "While Up Arrow Held",
      key: "ArrowUp",
      mode: "hold"
    },
    {
      id: "arrow_down",
      label: "While Down Arrow Held",
      key: "ArrowDown",
      mode: "hold"
    },
    {
      id: "arrow_left",
      label: "While Left Arrow Held",
      key: "ArrowLeft",
      mode: "hold"
    },
    {
      id: "arrow_right",
      label: "While Right Arrow Held",
      key: "ArrowRight",
      mode: "hold"
    }
  ],

  // Actions are still simple direction deltas
  actions: [
    {
      id: "move_up",
      label: "Move Up",
      delta: { x: 0, y: -1 }
    },
    {
      id: "move_down",
      label: "Move Down",
      delta: { x: 0, y: 1 }
    },
    {
      id: "move_left",
      label: "Move Left",
      delta: { x: -1, y: 0 }
    },
    {
      id: "move_right",
      label: "Move Right",
      delta: { x: 1, y: 0 }
    }
  ]
};

// Explicitly expose config for core.js
window.virtualFinchConfig = virtualFinchConfig;

