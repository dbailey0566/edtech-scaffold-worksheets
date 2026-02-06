
const virtualFinchConfig = {
  toolMeta: {
    title: "Virtual Finch Simulator",
    description:
      "Build movement logic using blocks, then run it to control a virtual Finch in a bounded space."
  },

  world: {
    width: 400,
    height: 400,
    stepSize: 20,
    boundary: "stop"
  },

  finch: {
    size: 30,
    startPosition: { x: 180, y: 180 },
    shape: "square"
  },

  events: [
    { id: "arrow_up", label: "When Up Arrow Pressed", key: "ArrowUp" },
    { id: "arrow_down", label: "When Down Arrow Pressed", key: "ArrowDown" },
    { id: "arrow_left", label: "When Left Arrow Pressed", key: "ArrowLeft" },
    { id: "arrow_right", label: "When Right Arrow Pressed", key: "ArrowRight" }
  ],

  actions: [
    { id: "move_up", label: "Move Up", delta: { x: 0, y: -1 } },
    { id: "move_down", label: "Move Down", delta: { x: 0, y: 1 } },
    { id: "move_left", label: "Move Left", delta: { x: -1, y: 0 } },
    { id: "move_right", label: "Move Right", delta: { x: 1, y: 0 } }
  ]
};
