const finchConfig = {
  toolName: "Finch Robot",
  activityTitle: "Remote Control Finch Car",

  goals: [
    "Map user input to robot movement",
    "Understand directional logic",
    "Debug movement errors"
  ],

controls: {
  up: "Move forward",
  down: "Move backward",
  left: "Turn left",
  right: "Turn right",
  instructorTips: [
    "Left/right may feel reversed depending on motor orientation.",
    "Turning is usually achieved by slowing one wheel, not reversing both.",
    "Have students test movement one direction at a time."
  ]
},

  
 steps: [
  {
    title: "Control Mapping",
    prompt: "Decide how each control maps to robot movement.",
    instructorNote: "Have students verbalize why left and right can feel reversed."
  },
  {
    title: "Movement Functions",
    prompt: "Create functions for forward, backward, left, and right movement.",
    instructorNote: "Watch for duplicated code instead of reusable functions."
  },
  {
    title: "Input Handling",
    prompt: "Connect phone or keyboard input to movement functions.",
    instructorNote: "This is where students often mix up key events."
  },
  {
    title: "Debugging",
    prompt: "Identify and fix at least one movement issue.",
    instructorNote: "Require students to explain the bug before fixing it."
  }
]
};
