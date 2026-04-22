# Q-DAY — Quantum Surveillance Policy Simulator

A web-based ethics tool exploring the "harvest now, decrypt later" dilemma
posed by quantum computing.

## How to open

1. Download and unzip this folder
2. Open `index.html` in any web browser (Chrome, Firefox, Safari, Edge)
3. No server or installation required — it runs entirely in the browser

## How to edit

Open the folder in VS Code. The three files you'll want to edit are:

- `index.html` — page structure and content (add your name in the About section)
- `css/style.css` — all visual styling
- `js/simulator.js` — all slider logic, metric calculations, and dilemma text

## Folder structure

```
qday-simulator/
├── index.html          ← main page
├── css/
│   └── style.css       ← all styles
├── js/
│   └── simulator.js    ← all interactivity
└── README.md           ← this file
```

## Personalising for submission

In `index.html`, find the About section and replace:

  [Your Name] — [Course Name], [University], 2026

with your actual details.

## The dilemma

Quantum computers, expected within the next decade, will break all current
encryption. Intelligence agencies are already collecting encrypted civilian
data today to decrypt retroactively — a strategy called "harvest now,
decrypt later" (HNDL). Citizens have not consented to this.

The simulator asks users to set government policy and observe the trade-offs
between national security and citizens' rights in real time.

## Ethical frameworks

- Justice as fairness (Rawls) — veil of ignorance applied to surveillance policy
- Procedural ethics — is secret collection illegitimate regardless of outcome?
- Ethics of care — who is made vulnerable, and who is responsible?

## Sources

- Federal Reserve Board (2025). "Harvest Now Decrypt Later"
  https://www.federalreserve.gov/econres/feds/2025093pap.pdf

- MDPI Telecom (2025). Harvest-Now, Decrypt-Later: A Temporal Cybersecurity Risk
  https://www.mdpi.com/2673-4001/6/4/100

- Berberich et al. (2023). Ethics of Quantum Computing: an Outline. Springer.
  https://link.springer.com/article/10.1007/s13347-023-00651-6

- Hoofnagle & Garfinkel (2024). Human rights compatible governance framework
  for quantum computing. Cambridge University Press.
  https://www.cambridge.org/core/journals/research-directions-quantum-technologies/...

- Masaar (2023). Quantum Computers: Ethical Dilemmas and Human Rights Challenges.
  https://masaar.net/en/quantum-computers-ethical-dilemmas-and-human-rights-challenges/
