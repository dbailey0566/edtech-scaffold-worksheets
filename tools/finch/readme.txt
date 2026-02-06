This scaffold guides learners through:

Control mapping
Understanding how directional input maps to robot movement

Movement logic
Designing reusable movement functions

Input handling
Connecting keyboard or phone input to movement logic

Debugging (capstone step)
Diagnosing intentional failure scenarios and explaining why they occur

Key features:

Step-by-step locking (students cannot skip ahead)

Instructor vs student mode

Conceptual remote-control visual mapping

Structured debugging with failure injection

No direct hardware control in the scaffold itself

The robot is controlled through the Finch environment.
This worksheet supports thinking and explanation, not hardware execution.

How to use this in a class

Open the scaffold in a browser

Switch to Instructor Mode to review guidance

Have students work in Student Mode

Students type directly into the worksheet as they work

Use responses for discussion, assessment, or reflection

The page can be:

Used live in class

Shared as a link

Printed or saved as PDF (browser print)

Instructor vs Student mode

At the top of each scaffold is a toggle:

Student Mode

Shows only student-facing prompts

Hides instructor notes

Enforces step locking

Instructor Mode

Reveals instructional guidance

Unlocks all steps

Highlights common misconceptions

This allows one page to serve both audiences.

Design principles

This project is intentionally:

Config-driven
Pedagogy lives in config.js, not in hard-coded logic

Lightweight
Plain HTML, CSS, and JavaScript

Ethically safe
No analytics, no data collection, no student tracking

Forkable
Instructors are encouraged to adapt and modify

Repository structure
/
├── index.html          # Landing page
├── css/
│   └── style.css       # Shared styles
├── js/
│   └── core.js         # Shared scaffold logic
└── tools/
    └── finch/
        ├── index.html  # Finch worksheet
        └── config.js   # Finch pedagogy and prompts

Extending this project

Planned or possible extensions include:

Additional tools (LEGO Education, VEX, 3D printing)

Print/export enhancements

Sensor-based autonomy follow-up activities

Instructor documentation for adaptation

Each tool lives in its own folder under /tools.
