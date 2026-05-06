# Q-DAY — Quantum Surveillance Policy Simulator

## How to open
Double-click `index.html` — works in any browser. No server needed.

## Folder structure
```
qday-vscode/
├── index.html        ← all screen HTML
├── css/style.css     ← all styles, colours, animations
├── js/main.js        ← all logic, choice data, sounds
└── README.md
```

## Key things to edit

### Colours (css/style.css, top :root block)
--red, --blue, --amber, --green, --bg, --surface, --tp, --ts, --tm

### Policy choices (js/main.js → CD object)
Each key matches an onclick="makeChoice('...')" button in index.html.
Fields: headline, body, tension (0-100), fw, reveal, revealTitle,
subhead, enc[], dec[], rawlsQ, keep, change
Add secret:true to enc rows you want redacted until Q-Day.

### Story intros / tension text (js/main.js)
storyIntros, tensionIntros, tensionCaptions — one entry per choice key.

### Countdown speed (js/main.js → startCountdown)
Change the interval: }, 380); — lower = faster

### Intro slides (index.html → #s-intro)
Each .islide div is one screen. Click or spacebar advances.

### About page (index.html → #s-about)
Edit the .about div directly.

### Adding a toggle section
HTML: use the .veil-toggle button + a hidden div pattern (see existing toggles)
JS: add a toggleXxx() function following the same pattern as toggleVeil()
