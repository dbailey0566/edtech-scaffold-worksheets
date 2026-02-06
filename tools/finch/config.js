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
  title: "Build the Control Logic (Code Practice)",
  prompt: "Use Scratch-style blocks to design the logic that makes the Finch move forward when the Up arrow is pressed.",
  
  codePractice: {
    event: "when Up arrow pressed",

    blocks: [
      "set left motor speed",
      "set right motor speed",
      "wait",
      "stop motors"
    ],

    explanationPrompt:
      "Why does the order of these blocks matter for correct movement?"
  },

  instructorNote:
    "Expected logic: event → set both motors forward → optional wait → stop. Watch for students reversing motors instead of adjusting speed."
},

    {
      title: "Debugging",
      prompt: "Choose one failure scenario. Predict what will happen, observe the behavior, and explain why it occurred.",
      failures: [
        {
          label: "Left and right controls are reversed",
          studentPrompt: "What do you expect the robot to do when you press left? What actually happens?",
          instructorNote: "Usually caused by motor orientation or swapped motor values."
        },
        {
          label: "Robot spins instead of turning",
          studentPrompt: "Why would both motors running cause spinning instead of turning?",
          instructorNote: "Students often reverse one motor instead of slowing it."
        },
        {
          label: "Robot does not stop when input stops",
          studentPrompt: "What code is missing that causes continued motion?",
          instructorNote: "Look for missing stop() logic or key release handling."
        },
        {
          label: "Only one wheel moves",
          studentPrompt: "What does this suggest about the motor commands?",
          instructorNote: "Often one motor command is missing or overwritten."
        }
      ]
    }
  ]
};
