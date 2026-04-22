// Q-DAY Simulator — core logic
// Connects sliders to live security/rights dashboards and ethical tension meter

const collectSlider     = document.getElementById('collect');
const investSlider      = document.getElementById('invest');
const transparencySlider = document.getElementById('transparency');

// Format large numbers: 1400000 → 1.4M, 50000 → 50K
function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(0) + 'K';
  return n.toString();
}

// Set a bar's width and its accompanying score label
function setBar(barId, scoreId, value, max) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  document.getElementById(barId).style.width = pct + '%';
  document.getElementById(scoreId).textContent = pct + '/100';
}

function update() {
  const c = parseInt(collectSlider.value);      // 0–100: data collection rate
  const v = parseInt(investSlider.value);       // 0–100: quantum investment
  const t = parseInt(transparencySlider.value); // 0–100: public transparency

  // Update slider display labels
  document.getElementById('collect-val').textContent      = c + '%';
  document.getElementById('invest-val').textContent       = v + '%';
  document.getElementById('transparency-val').textContent = t + '%';

  // ── Security metrics ──────────────────────────────────────────────────────
  const threats    = Math.round(200 + c * 8 + v * 6);
  const geoAdv     = Math.min(100, Math.round(v * 0.7 + c * 0.3));
  const secScore   = Math.round(c * 0.4 + v * 0.6);
  const intelScore = Math.max(0, Math.round(v * 0.8 + c * 0.2 - t * 0.3));
  const readyScore = Math.max(0, Math.round(v * 0.9 - t * 0.1));
  const qdayYears  = Math.max(3, Math.round(12 - v * 0.08));

  document.getElementById('threats-val').textContent = fmt(threats);
  document.getElementById('geo-val').textContent     = geoAdv + '/100';
  document.getElementById('qday-est').textContent    = 'Estimated Q-Day: ' + qdayYears + ' years';

  setBar('sec-bar',   'sec-score',   secScore,   100);
  setBar('intel-bar', 'intel-score', intelScore, 100);
  setBar('ready-bar', 'ready-score', readyScore, 100);

  // ── Rights metrics ────────────────────────────────────────────────────────
  const records     = Math.round(c * 2800000 + 500000);
  const exposureYrs = qdayYears;
  const privScore   = Math.round(c * 0.7 + (100 - t) * 0.3);
  const trustScore  = Math.max(0, Math.round(t * 0.6 - c * 0.4 + 40));
  const consentScore = Math.round(c * 0.6 + (100 - t) * 0.4);

  document.getElementById('records-val').textContent  = fmt(records);
  document.getElementById('exposure-val').textContent = exposureYrs + ' yrs';
  document.getElementById('at-risk').textContent      = 'Citizens with data stored: ' + fmt(records);

  setBar('priv-bar',    'priv-score',    privScore,    100);
  setBar('trust-bar',   'trust-score',   trustScore,   100);
  setBar('consent-bar', 'consent-score', consentScore, 100);

  // ── Ethical tension score ─────────────────────────────────────────────────
  // Tension rises when collection is high and transparency is low,
  // or when there's a large gap between what is done and what is disclosed.
  const tension = Math.min(100, Math.round(
    Math.abs(c - t) * 0.4 +
    Math.abs(v - t) * 0.3 +
    c * 0.2 +
    (100 - t) * 0.1
  ));

  document.getElementById('tension-val').textContent    = tension + '/100';
  document.getElementById('tension-thumb').style.left   = tension + '%';

  // ── Contextual dilemma text ───────────────────────────────────────────────
  let dilemma = '';

  if (c > 70 && t < 30) {
    dilemma = '<strong>Maximum collection, minimum disclosure.</strong> Your agency is harvesting data from millions of citizens who have no idea. When Q-Day arrives, you will have the most complete intelligence picture ever assembled — and the largest retroactive privacy violation in history.';
  } else if (c < 30 && t > 70) {
    dilemma = '<strong>Low collection, high transparency.</strong> You\'ve told citizens what you\'re doing and chosen restraint. But your adversaries haven\'t. When Q-Day arrives, they will be reading your allies\' secrets. Was restraint a moral choice — or a strategic failure?';
  } else if (v > 70 && t < 40) {
    dilemma = '<strong>Racing to Q-Day in secret.</strong> You\'re investing heavily to reach quantum capability first. Citizens are funding this acceleration through their taxes — without knowing it will be used to decrypt the data already collected from them.';
  } else if (t > 70 && c > 60) {
    dilemma = '<strong>Transparent surveillance.</strong> You\'ve told citizens you\'re collecting their data. Some argue informed collection is ethically defensible. But is consent possible when refusal means your adversaries gain the advantage instead?';
  } else if (c < 20 && v < 20) {
    dilemma = '<strong>Unilateral restraint.</strong> You\'ve chosen not to collect or invest. But quantum computing will arrive regardless. Other states will reach it first. Have you protected rights — or simply exported the problem?';
  } else {
    dilemma = 'Your current settings store <strong>' + fmt(records) + ' citizen records</strong> that will become readable in approximately <strong>' + exposureYrs + ' years</strong>. Is this a rights violation today — or only when the data is actually read?';
  }

  document.getElementById('dilemma-text').innerHTML = dilemma;

  // ── Framework verdict ─────────────────────────────────────────────────────
  let verdict = '';

  if (tension > 70) {
    verdict = 'Under justice as fairness (Rawls): if you did not know whether you were the intelligence director or one of the ' + fmt(records) + ' citizens whose records are stored, would you endorse this policy? The high tension between your settings suggests the answer is likely no.';
  } else if (c > 60 && t > 60) {
    verdict = 'Procedural ethics asks whether the process is legitimate regardless of outcome. Transparent collection is more defensible procedurally — but does informing citizens of surveillance they cannot opt out of constitute genuine consent?';
  } else if (v > 70) {
    verdict = 'Ethics of care asks: who is made vulnerable by this decision, and who bears responsibility for them? Accelerating quantum capability concentrates power in those who already have it — and brings forward the moment of exposure for everyone else.';
  } else {
    verdict = 'Adjust the sliders further to surface a specific ethical tension. Every combination reveals a different conflict between security, rights, consent, and power.';
  }

  document.getElementById('verdict-text').textContent = verdict;
}

// Attach listeners and run on load
collectSlider.addEventListener('input', update);
investSlider.addEventListener('input', update);
transparencySlider.addEventListener('input', update);

update();
