// ── AUDIO ────────────────────────────────────────────────────────────────
let _actx=null;
function ac(){if(!_actx){try{_actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}return _actx;}
function tone(f,type,dur,vol,d){try{const ctx=ac();if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type=type;o.frequency.value=f;const t=ctx.currentTime+(d||0);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);o.start(t);o.stop(t+dur+0.05);}catch(e){}}
function sndSlide(){tone(280,'sine',0.15,0.07);setTimeout(()=>tone(380,'sine',0.1,0.04),70);}
function sndAlert(){[0,0.18,0.36].forEach(d=>tone(880,'sawtooth',0.13,0.1,d));}
function sndDecrypt(){for(let i=0;i<12;i++)tone(80+i*55,'sawtooth',0.07,0.08,i*0.055);}
function sndDanger(){tone(160,'square',0.28,0.12);tone(110,'square',0.28,0.07,0.14);}
function sndWin(){tone(440,'sine',0.2,0.08);tone(550,'sine',0.2,0.06,0.15);tone(660,'sine',0.25,0.05,0.3);}

// ── INTRO SLIDE MACHINE ──────────────────────────────────────────────────
const TOTAL=7;
let slide=0,advancing=false;

// build dots
const dotsEl=document.getElementById('prog-dots');
for(let i=0;i<TOTAL;i++){const d=document.createElement('div');d.className='pd';d.id='pd-'+i;dotsEl.appendChild(d);}
function updateDots(){for(let i=0;i<TOTAL;i++){const d=document.getElementById('pd-'+i);d.className='pd'+(i<slide?' on':i===slide?' cur':'');}}
updateDots();

function advance(){
  if(advancing)return;
  if(slide>=TOTAL-1){goToDilemma();return;}
  advancing=true;
  sndSlide();
  document.getElementById('sl-'+slide).classList.remove('active');
  slide++;
  document.getElementById('sl-'+slide).classList.add('active');
  updateDots();
  // per-slide effects
  if(slide===2)setTimeout(popCells,150);
  if(slide===3){setTimeout(()=>{flashRed();sndAlert();},200);}
  if(slide===4)setTimeout(popTL,150);
  if(slide===5){sndDanger();setTimeout(flashRed,100);}
  setTimeout(()=>{advancing=false;},480);
}

function popCells(){for(let i=0;i<6;i++)setTimeout(()=>{const e=document.getElementById('dc-'+i);if(e)e.classList.add('pop');},i*75);}
function popTL(){for(let i=0;i<4;i++)setTimeout(()=>{const e=document.getElementById('tl-'+i);if(e)e.classList.add('pop');},i*160);}
function flashRed(){const o=document.getElementById('av-red');o.classList.add('flash');setTimeout(()=>o.classList.remove('flash'),160);setTimeout(()=>{o.classList.add('flash');setTimeout(()=>o.classList.remove('flash'),120);},320);}
function flashWhite(){const o=document.getElementById('av-white');o.classList.add('flash');setTimeout(()=>o.classList.remove('flash'),120);}

document.getElementById('s-intro').addEventListener('click',advance);
document.addEventListener('keydown',e=>{if(['Enter',' ','ArrowRight'].includes(e.key)){if(document.getElementById('s-intro').classList.contains('active'))advance();}});

// ── NAVIGATION ────────────────────────────────────────────────────────────
function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id);
  el.classList.add('active');
  // scroll to top of the new screen
  window.scrollTo({top:0,behavior:'instant'});
  el.scrollIntoView({behavior:'instant',block:'start'});
}

function goToDilemma(){
  document.getElementById('skip-hint').style.opacity='0';
  document.getElementById('prog-dots').style.opacity='0';
  goTo('s-dilemma');
}

// ── CHOICE DATA ───────────────────────────────────────────────────────────
const CD={
  broad:{
    headline:'Broad collection. No warrants.',
    body:'Your policy authorises bulk harvesting of encrypted civilian communications. No warrant required. Citizens are not informed. <strong> 280 million records are now stored.</strong>',
    tension:78,
    fw:'Under <strong>procedural ethics</strong>, a process is legitimate based on how it operates, not only its outcomes. Secret, unconsented, uncontestable collection fails procedural legitimacy, regardless of whether the data is ever misused. The absence of transparency is itself the violation.',
    reveal:'You set this policy without knowing your role. Now you know: <strong>you are one of the 280 million citizens in the database.</strong> Your messages, medical history, financial patterns, stored since 2020. In approximately 8 years, <span class="red">an analyst you will never meet will read all of it.</span>',
    revealTitle:'a citizen under your own policy.',
    subhead:'280 million records. 8 years in storage. All of it now readable.',
    enc:[{k:'Communications stored',v:'47,382 messages — 8 years of conversations',c:'rv',secret:true},{k:'Medical record fragments',v:'312 entries — diagnoses, prescriptions, therapy notes',c:'rv',secret:true},{k:'Financial transactions',v:'9,847 transactions — salary, rent, political donations visible',c:'rv',secret:true},{k:'Location history',v:'2,190 days tracked — home, workplace, relationships inferred',c:'rv',secret:true},{k:'Consent obtained',v:'NONE',c:'rv'},{k:'Readable in',v:'~8 years',c:'rv'}],
    dec:[{k:'Private messages (est.)',v:'47,000 messages decrypted',c:'dv'},{k:'Medical records',v:'Condition history, prescriptions',c:'dv'},{k:'Financial patterns',v:'Income inferred, donations visible',c:'dv'},{k:'Location history',v:'Home, workplace, relationships mapped',c:'dv'},{k:'Political affiliation',v:'Inferred — flagged for review',c:'dv'},{k:'Years of privacy',v:'RETROACTIVELY ELIMINATED',c:'rv'}],
    rawlsQ:'You designed a policy of broad, secret collection. You are now the subject. <strong>Eight years of your private life is now readable by a stranger.</strong> Knowing this, would you have pick a different rule from behind the veil of ignorance?',
    keep:'<strong>You stand by it.</strong> This is a defensible position as you chose the rules before knowing your role. However, the security benefit is abstract and collective while the privacy violation is concrete and personal. Then, whose interests the policy really protects, and why those people were not asked?',
    change:'<strong>You would change it.</strong> This is the veil of ignorance working as Rawls intended. The moment you became the subject, the policy felt different. That gap between what you designed for others and what you\'d accept for yourself is the ethical problem at the heart of this dilemma.'
  },
  targeted:{
    headline:'Targeted collection. Warrants required.',
    body:'Your policy restricts collection to individuals under active investigation. Judicial authorisation required. Ordinary citizens\' data is not harvested. The intelligence picture is narrower, <strong>but no one\'s private life is stored without cause.</strong> Your adversaries, however, do not share this restraint.',
    tension:28,
    fw:'Under <strong>justice as fairness</strong>, this is the most procedurally defensible position. Citizens retain meaningful control over their data. The process is transparent and contestable in court. The ethical cost is external as other states collecting broadly may gain strategic advantages your restraint forfeits.',
    reveal:'You are not in the broad database, <strong>but your adversaries did not make the same choice.</strong> Foreign intelligence agencies are collecting your data right now. In 8 years, they will read it. Your restraint protected your citizens from your own government <span class="red"> left them exposed to others who chose differently.</span>',
    revealTitle:'a citizen under your own policy.',
    subhead:'Your domestic file: empty. Foreign databases: unknown.',
    enc:[{k:'Civilian data collected',v:'NONE (warrant required)',c:'gv'},{k:'Targeted investigations',v:'Active warrants only',c:'dv'},{k:'Consent / due process',v:'Yes — judicial authorisation',c:'gv'},{k:'Adversary collection',v:'ONGOING — 280M+ records (foreign)',c:'rv'},{k:'Citizens\' exposure',v:'Via foreign programs',c:'rv'},{k:'Strategic cost',v:'HIGH',c:'rv'}],
    dec:[{k:'Your file (domestic)',v:'Not in database',c:'gv'},{k:'Your file (foreign states)',v:'Unknown — possibly stored',c:'rv'},{k:'Allied government data',v:'Exposed to foreign decryption',c:'rv'},{k:'Geopolitical cost',v:'UNQUANTIFIABLE',c:'rv'}],
    rawlsQ:'You protected your citizens from domestic surveillance. But foreign states are collecting their data anyway. <strong>A foreign quantum computer will read your citizens\' communications in 8 years regardless of your policy.</strong> Did your restraint protect anyone, or only your own conscience?',
    keep:'<strong>You stand by it.</strong> Under pragmatist ethics: you cannot control what adversaries do, only what you do. A policy that violates rights "because others do it" is a rationalisation, not a principle. The ethical standard must apply to your own conduct regardless of others\'.',
    change:'<strong>You would change it.</strong> This is the dilemma of unilateral restraint: ethical consistency may produce worse outcomes than strategic pragmatism. If your citizens\' data will be harvested by foreign states regardless, your domestic restraint may offer protection in name only.'
  },
  disclosed:{
    headline:'Broad collection but publicly disclosed.',
    body:'Your policy authorises bulk collection but publishes annual transparency reports: what is collected, how long stored, when it may be read. Citizens know the program exists. <strong>They cannot opt out.</strong> They can vote, organise, and challenge it politically.',
    tension:52,
    fw:'Under <strong>procedural ethics</strong>, transparency significantly improves legitimacy. A disclosed process is more contestable than a secret one. But the absence of opt-out creates a consent paradox: knowing you are surveilled is not the same as agreeing to it. Whether disclosure is sufficient, or merely more comfortable for those in power, is the dilemma.',
    reveal:'You are in the database, and you were told. <strong>You knew your messages, medical records, and financial patterns were being stored.</strong> You could not stop it. In 8 years, an analyst will read them. <span class="red">Does being informed change the ethics of what happens to your data?</span> Or does it only mean you were watching helplessly?',
    revealTitle:'a citizen under your own policy.',
    subhead:'You were told. You could not stop it. In 8 years, it is readable.',
    enc:[{k:'Communications stored',v:'47,382 messages — 8 years of conversations',c:'rv',secret:true},{k:'Medical record fragments',v:'312 entries — diagnoses, prescriptions, therapy notes',c:'rv',secret:true},{k:'Financial transactions',v:'9,847 transactions — salary, rent, political donations visible',c:'rv',secret:true},{k:'Consent obtained',v:'INFORMED — no opt-out',c:'rv'},{k:'Public disclosure',v:'Annual report published',c:'gv'},{k:'Readable in',v:'~8 years',c:'rv'}],
    dec:[{k:'Private messages',v:'47,000 messages decrypted',c:'dv'},{k:'Medical records',v:'Full history readable',c:'dv'},{k:'Financial patterns',v:'Income, donations visible',c:'dv'},{k:'You were informed',v:'Yes — you could not stop it',c:'dv'},{k:'Outcome for you',v:'Identical to secret collection',c:'rv'}],
    rawlsQ:'You were told your data was being collected. You could not stop it. <strong>Is there a meaningful ethical difference between secret surveillance and transparent surveillance when both produce the same outcome for the person being watched?</strong>',
    keep:'<strong>You stand by it.</strong> Transparency creates accountability even without opt-out. Citizens who know they are surveilled can organise and challenge through democratic means. Under procedural ethics, an open process is meaningfully more legitimate than a secret one, even when the outcome is the same.',
    change:'<strong>You would change it.</strong> Being informed that your privacy is eliminated is not the same as consenting to it. Transparency without meaningful choice may make power feel legitimate without actually giving citizens control. The question is whether procedural legitimacy is enough or whether genuine consent must be possible.'
  },
  treaty:{
    headline:'International treaty. Export controls.',
    body:'Your policy rejects unilateral collection and pursues an OECD-style quantum governance framework. <strong>36 countries now have national quantum strategies.</strong> Export controls restrict quantum technology transfers to prevent adversarial acceleration. This is the most structurally ambitious option but also the slowest. <span style="color:var(--amber);">While you negotiate, data collection continues, and the treaty will not be retroactive.</span>',
    tension:40,
    fw:'Under <strong>pragmatist ethics</strong>, collective governance is the only response that addresses the root cause. The OECD documents how quantum policy is already being treated as a geopolitical instrument, from export controls, to technology transfer restrictions and research collaboration limits. <em>(OECD, 2025)</em> However, pragmatist ethics also demands that outcomes be measured in practice, not intention. The GDPR (the EU\'s data protection law), which became applicable in May 2018, does not re-evaluate or penalise the initial collection of personal data prior to its enforcement<em>(European Union, 2016)</em>. A quantum treaty will face the same structural flaw. The people alive during negotiations will not be protected by the treaty they made possible.',    
    reveal:'You are a political dissident in 2028. Your government is mid-negotiation on the quantum treaty you helped advocate for. You use encrypted apps to organise, such asSignal, WhatsApp, secure email, to coordinate with activists in three countries. <strong>A hostile foreign state has been collecting your communications since 2020.</strong> The treaty your government is negotiating does not include retroactive deletion of already-harvested data. <span class="red">In 2035, a hostile government decrypts your 2028 messages. The treaty exists. It did not protect you.</span>',    revealTitle:'the generation that paid.',
    subhead:'The treaty passed. You paid for it. It covered everyone born after you.',
    enc:[
      {k:'Domestic HNDL collection',v:'SUSPENDED — treaty pending',c:'gv'},
      {k:'Treaty ratification (est.)',v:'2033 — 7 years of negotiation',c:'rv'},
      {k:'Your comms (foreign collected)',v:'31,204 messages collected by hostile state since 2020',c:'rv',secret:true},
      {k:'Foreign collection during talks',v:'ONGOING — treaty non-binding pre-sig',c:'rv'},
      {k:'Retroactive treaty protection',v:'NOT INCLUDED — negotiating compromise',c:'rv'},
      {k:'Long-term governance',v:'STRONGEST of all options',c:'gv'},
    ],
    dec:[
      {k:'Your file (foreign state)',v:'Fully decrypted — 2035',c:'rv'},
      {k:'Activist network exposed',v:'23 co-organisers identified',c:'rv'},
      {k:'Treaty coverage of your data',v:'NONE — pre-ratification',c:'rv'},
      {k:'Citizens born after 2033',v:'Protected by treaty',c:'gv'},
      {k:'You',v:'NOT COVERED — sacrificed for the future',c:'rv'},
      {k:'Precedent',v:'GDPR did not apply retroactively (2018)',c:'rv'},
    ],
    rawlsQ:'You chose the most structurally ethical response. A treaty now protects billions of people who will live after you. <strong>But you, living through the negotiation period, had your activist network exposed. Your private communications read by a hostile government, and you received no protection from the treaty you fought for.</strong><br><br>Rawls\'s veil of ignorance was designed for people within a single generation. Behind a veil that also hides <em>when</em> you are born, 2000 (unprotected) or 2015 (protected). Would you still have chosen this path?',
    keep:'<strong>You stand by it.</strong> Under ethics of care, preventing future harm at scale is the most important obligation, even at the cost of present protection. The GDPR\'s non-retroactivity was not considered a reason to abandon data protection law. A treaty that protects billions of future citizens may justify the exposure of those living through its creation. The alternative is a permanent arms race in which no generation is ever protected.',
    change:'<strong>You would change it.</strong> This is the intergenerational justice problem Rawls did not fully solve. His veil of ignorance assumes contemporaries designing a fair system together. However, when the people who bear the cost are different from the people who receive the benefit, separated by time, the fairness calculation breaks down. So if you knew you would be the one exposed while future generations are protected, you would not choose this path?'
  },
  nothing:{
    headline:'No collection at all.',
    body:'Your policy refuses all HNDL programs. No civilian data collected. No records stored. You publish a statement of democratic principle: surveillance without consent is incompatible with democratic governance.',
    tension:12,
    fw:'Under <strong>ethics of care</strong>, your policy most protects those made most vulnerable by surveillance, such as journalists, activists, political minorities, abuse survivors, dissidents. The ethical cost is external and uncontrollable as foreign programs continue regardless, and your citizens\' data may be harvested by those you cannot govern.',
    reveal:'<strong>You are not in a domestic database.</strong> Your government never stored your data, but you are almost certainly in a foreign one. Intelligence agencies in other states are collecting your communications right now. In 8 years, they may read them, even though your own government cannot. <span class="red">Your ethical consistency could not protect you from others\' ethical inconsistency.</span>',
    revealTitle:'a citizen under your own policy.',
    subhead:'Domestic file: empty. Foreign exposure: unknown and uncontrollable.',
    enc:[{k:'Domestic collection',v:'ZERO — policy refused',c:'gv'},{k:'Consent / due process',v:'N/A — nothing collected',c:'gv'},{k:'Foreign collection of your data',v:'Est. 38,000+ messages harvested by foreign states',c:'rv',secret:true},{k:'Your data in foreign databases',v:'Unknown — likely yes',c:'rv'},{k:'Intelligence capacity',v:'SEVERELY LIMITED',c:'rv'},{k:'Ethical consistency',v:'MAXIMUM',c:'gv'}],
    dec:[{k:'Your data (domestic)',v:'Never collected',c:'gv'},{k:'Your data (foreign states)',v:'Possibly stored — unknown',c:'rv'},{k:'Rights violation (domestic)',v:'NONE',c:'gv'},{k:'Protection from foreign access',v:'NONE',c:'rv'},{k:'The paradox',v:'Restraint cannot be enforced globally',c:'rv'},{k:'Did restraint protect you?',v:'UNKNOWN',c:'rv'}],
    rawlsQ:'You protected your citizens from your own government. But foreign states are collecting their data anyway. <strong>Knowing you may be in a foreign database and your private life readable in 8 years regardless, do you regret your restraint? Or does the principle hold regardless of outcome?</strong>',
    keep:'<strong>You stand by it.</strong> Your restraint does not protect everyone, but it protects those who would otherwise be harmed by your own government\'s surveillance. However, the global problem continues without you.',
    change:'<strong>You would change it.</strong> Unilateral restraint may feel ethical while producing no real protection. If your citizens\' data will be harvested regardless, refusing domestically may be more about your own moral comfort than genuine protection of the people you govern. Ethics must be measured by outcomes, not only intentions.'
  },
  consent_plus:{
    headline:'Opt-in civilians. Targeted suspects.',
    body:'Your policy creates two collection streams. <strong>Stream 1:</strong> Citizens who voluntarily consent can have their data collected for national security. <strong>Stream 2:</strong> Individuals under judicial warrant are targeted (for protection and security purposes). Everyone else is excluded. Full transparency about both.',
    tension:44,
    fw:'Under <strong>procedural ethics</strong>, this is the most procedurally elaborate option. Two legitimate streams build infrastructure that can be widened quietly: who counts as a suspect, what counts as consent, which behaviours trigger investigation. The question is not whether this policy is ethical today. It is whether it remains ethical in a changed political climate.',
    reveal:'You did not opt in. You are an investigative journalist. You read the program\'s terms and chose not to consent. You believed you were protected. <strong>In 2029, you published a story exposing a government surveillance contract.</strong> The minister whose department you investigated had you classified as a criminal, which places you directly into Stream 2. <span class="red">It did not matter that you never consented. Once the infrastructure existed to collect on "suspects and criminals", the definition of criminal expanded to include you. Your data is now collected under the same legal basis as any other target.</span>',
    revealTitle:'the journalist they reclassified.',
    subhead:'You never consented. The system collected you anyway. The two streams became one.',
    enc:[
      {k:'Opted in to program',v:'Yes',c:'gv'},
      {k:'Communications now collected',v:'38,204 messages',c:'rv',secret:true},
      {k:'Source communications stored',v:'11 confidential sources',c:'rv',secret:true},
    ],
    dec:[
      {k:'Your opt-out decision',v:'VOID — criminal classification overrides consent',c:'rv'},
      {k:'Collection basis',v:'Stream 2: criminal suspect — no warrant needed',c:'rv'},
      {k:'Messages decrypted',v:'38,204 messages — including pre-classification comms',c:'rv'},
      {k:'Source identities exposed',v:'11 confidential sources decrypted',c:'rv'},
      {k:'Stories suppressed',v:'2 — pre-empted by analyst using decrypted sources',c:'rv'},
    ],
    rawlsQ:'You chose not to consent. The system collected you anyway because the second stream\'s definition of "criminal" expanded to include your journalism. <strong>The dilemma of this policy is not whether opt-in is ethical. It is whether opt-in is even meaningful when the other stream has no limit on who qualifies as a target.</strong><br><br>Behind the veil of ignorance, not knowing whether you\'d be the policy designer, the analyst, or the journalist who declined to consent and was collected regardless, would you have built this system?',
    keep:'<strong>You stand by it.</strong> The opt-in stream remains ethically sound. The problem is the criminal classification decision and not the policy architecture itself. Better judicial oversight of who qualifies as a criminal target would fix this. The principle of two-stream collection is still more defensible than bulk collection of everyone.',
    change:'<strong>You would change it.</strong> This is the policy\'s fatal flaw: once you build infrastructure for collecting "criminals", you hand governments the power to define criminality. A journalist. An activist. A political opponent. The opt-in stream made the policy look rights-respecting. The criminal stream made it surveillance without limits.'
  }
};

let currentChoice=null, drAstage=1, yearTimer=null;

// per-choice story intro text
const storyIntros = {
  broad: 'Your policy is now in effect. <strong>Encrypted communication sent in your country is being harvested and stored.</strong> The files are unreadable today as it is sealed behind encryption that no computer can currently break. But the data is real and harvested. The people it belongs to do not know it exists.',
  targeted: 'Your policy is now in effect. <strong>Collection is restricted to individuals under active investigation.</strong> Most citizens\' data is never stored.',
  disclosed: 'Your policy is now in effect. <strong>Citizens have been informed that their data is being collected.</strong> They cannot stop it. They can only watch.',
  treaty: 'Your negotiations have begun. <strong>Collection is suspended domestically while the treaty is drafted.</strong> Foreign states continue regardless.',
  nothing: 'Your policy is now in effect. <strong>No data is collected. No files exist.</strong> Your citizens are protected from your own government\'s surveillance. But the collection happening in foreign intelligence programs continues, silently, beyond your reach.',
  consent_plus: 'Your policy is now in effect. <strong>Citizens who consented are being collected. Individuals classified as criminals are targeted under Stream 2.</strong> The system looks clean. Two streams, both with legal basis.',}
// per-choice tension explanations
const tensionIntros = {
  broad: '<strong>Where your policy sits:</strong> high security gain, severe rights cost. The thumb below marks where your choice lands on the spectrum between maximum intelligence and maximum protection.',
  targeted: '<strong>Where your policy sits:</strong> rights protected, with a significant security cost..',
  disclosed: '<strong>Where your policy sits:</strong> in the middle. It is more legitimate than secret collection, but the outcome for the subject is identical. Is transparency without opt-out truly consent and democratic?',
  treaty: '<strong>Where your policy sits:</strong> moderate tension now, lower tension in 20 years. The structural solution costs the present generation to protect the next.',
  nothing: '<strong>Where your policy sits:</strong> maximum rights protection, minimum security capacity.',
  consent_plus: '<strong>Where your policy sits:</strong> the most procedurally complex option. The tension score reflects the hidden risk: two legitimate streams, one expandable definition of "suspect".'
};

const tensionCaptions = {
  broad: 'This is not a neutral position. It is a choice to prioritise security over individual rights.',
  targeted: 'Restraint may have a cost\.',
  nothing: 'The most rights-consistent position. Whether it is also the most rights-protective is the dilemma.',};

function makeChoice(key){
  currentChoice=key;
  const d=CD[key];
  drAstage=1;
  document.getElementById('dra-headline').innerHTML=d.headline;
  document.getElementById('dra-body').innerHTML=d.body;
  // populate story page
  document.getElementById('story-intro-text').innerHTML=storyIntros[key];
  document.getElementById('tension-intro').innerHTML=tensionIntros[key];
  document.getElementById('tension-caption').textContent=tensionCaptions[key];
  document.getElementById('fw-text').innerHTML=d.fw;
  document.getElementById('dra-reveal').innerHTML=d.reveal;
  document.getElementById('dra-reveal-title').innerHTML='You are <span class="red">'+d.revealTitle+'</span>';
  document.getElementById('drb-subhead').textContent=d.subhead;
  // build story file rows (hidden, revealed by animation)
  document.getElementById('sf-rows').innerHTML=d.enc.map((r,i)=>
    `<div class="sf-row" id="sfr-${i}"><div class="sf-key">${r.k}</div><div class="sf-val ${r.c}">${r.v}</div></div>`
  ).join('');
  document.getElementById('dec-rows').innerHTML=d.dec.map(r=>`<div class="fc-row"><div class="fc-k">${r.k}</div><div class="fc-v ${r.c}">${r.v}</div></div>`).join('');
  document.getElementById('rawls-q').innerHTML=d.rawlsQ;
  document.getElementById('rawls-resp').classList.remove('show');
  document.getElementById('restart-btn').style.display='none';
  // reset tension thumb to start
  document.getElementById('tb-thumb').style.left='5%';
  document.getElementById('dra2-continue').style.opacity='0';
  // show only first dr-stage
  document.querySelectorAll('.dr-stage').forEach(s=>s.classList.remove('active'));
  document.getElementById('dra-1').classList.add('active');
  document.getElementById('dr-b').style.display='none';
  goTo('s-consequence');
  sndAlert();
}

function drNext(section,num){
  sndSlide();
  document.querySelectorAll('.dr-stage').forEach(s=>s.classList.remove('active'));
  document.getElementById('dr'+section+'-'+num).classList.add('active');
  window.scrollTo({top:0,behavior:'instant'});
  if(section==='a' && num==='2b') setTimeout(runTransition, 300);
  if(section==='a' && num===2) setTimeout(runStoryAnimations, 300);
}

function runTransition(){
  // CSS handles the staggered fade-ins via animation-delay
  // JS just adds sound cues and runs the glitch word loop
  const soundCues = [200, 1200, 2400, 3600];
  soundCues.forEach((delay, i) => {
    setTimeout(()=> sndSlide(), delay);
  });

  // start glitch word loop after the 4 lines have appeared
  setTimeout(runGlitchLoop, 5200);

  // danger sound + flash when YOU lands
  setTimeout(()=>{ sndDanger(); flashRed(); setTimeout(flashRed, 350); }, 7200);
}

let glitchLoop = null;
function runGlitchLoop(){
  const glitchEl = document.getElementById('trans-glitch');
  let count = 0;
  const words = ['IDENTITY', 'SUBJECT', 'CIVILIAN', 'ANALYST', 'SUSPECT', 'DISSIDENT', 'JOURNALIST', 'YOU'];

  glitchLoop = setInterval(()=>{
    // glitch sound
    tone(200 + Math.random()*600, 'sawtooth', 0.06, 0.09);
    glitchEl.classList.remove('glitching','final');
    void glitchEl.offsetWidth;
    glitchEl.classList.add('glitching');

    // change word
    document.getElementById('glitch-word').textContent = words[count % words.length];
    count++;

    // after cycling through, land on YOU with final glitch
    if(count >= words.length){
      clearInterval(glitchLoop);
      glitchLoop = null;
      setTimeout(()=>{
        glitchEl.classList.remove('glitching');
        glitchEl.classList.add('final');
        document.getElementById('glitch-word').textContent = 'YOU';
        sndDanger();
        flashRed();
        setTimeout(flashRed, 350);
        // show continue button
        setTimeout(()=>{
          document.getElementById('trans-continue-btn').style.opacity='1';
        }, 800);
      }, 400);
    }
  }, 280);
}

function runStoryAnimations(){
  // just reset state when page loads — countdown starts on click
  const yearEl = document.getElementById('year-display');
  const yearSubEl = document.getElementById('year-sub');
  const tickDot = document.getElementById('tick-dot');
  const fillEl = document.getElementById('year-fill');
  if(yearTimer) clearInterval(yearTimer);
  yearEl.textContent = '2026';
  yearEl.classList.remove('danger');
  yearSubEl.textContent = 'Your policy takes effect. Collection begins.';
  yearSubEl.classList.remove('red');
  tickDot.classList.remove('danger');
  fillEl.style.width = '0%';
  // reset hidden elements
  document.getElementById('year-counter-wrap').style.display = 'none';
  document.getElementById('year-track-wrap').style.display = 'none';
  document.getElementById('story-file').style.display = 'none';
  document.getElementById('tension-wrap').style.display = 'none';
  document.getElementById('start-countdown-btn').style.display = 'inline-block';
  document.getElementById('dra2-continue').style.opacity = '0';
  document.getElementById('sf-spill').className = 'spill enc';
  document.getElementById('sf-spill').textContent = '● ENCRYPTED';
  document.getElementById('sf-class-label').textContent = '// SAMPLE subject file';
  document.getElementById('sf-rows').innerHTML = '';
}

function startCountdown(){
  const d = CD[currentChoice];
  const qday = 2034;
  let yr = 2026;

  document.getElementById('start-countdown-btn').style.display = 'none';
  document.getElementById('year-counter-wrap').style.display = 'block';
  document.getElementById('year-track-wrap').style.display = 'block';

  const yearEl = document.getElementById('year-display');
  const yearSubEl = document.getElementById('year-sub');
  const tickDot = document.getElementById('tick-dot');
  const fillEl = document.getElementById('year-fill');

  // show file immediately — redact harvested data rows, show known facts plainly
  document.getElementById('sf-rows').innerHTML = d.enc.map((r,i)=>{
    const isRedacted = r.secret === true;
    return `<div class="sf-row reveal" id="sfr-${i}">
       <div class="sf-key">${r.k}</div>
       <div class="sf-val ${isRedacted ? 'ev' : r.c}" id="sfv-${i}">${isRedacted ? '████████████' : r.v}</div>
     </div>`;
  }).join('');
  document.getElementById('story-file').style.display = 'block';

  const yearMessages = {
    2026: 'Your policy takes effect. Collection begins.',
    2027: 'Files accumulate. You don\'t know they exist.',
    2028: 'Your messages from this year will be stored for decades.',
    2029: 'IBM targets fault-tolerant quantum by this year.',
    2030: 'Halfway to Q-Day. The database grows.',
    2031: 'NSA mandates post-quantum encryption for classified systems.',
    2032: 'Your oldest stored messages are now 6 years old.',
    2033: 'Two years away. Post-quantum migration accelerates.',
    2034: 'Q-Day. Encryption breaks. Your file opens.'
  };

  if(yearTimer) clearInterval(yearTimer);

  // click anywhere on the stage to skip to 2034 — jump yr, let interval fire the final tick
  const stageEl = document.getElementById('dra-2');
  const skipHandler = (e) => {
    if(e.target.closest('button')) return;
    yr = qday - 1; // next interval tick will increment to qday and trigger Q-Day
    stageEl.removeEventListener('click', skipHandler);
  };
  stageEl.addEventListener('click', skipHandler);

  yearTimer = setInterval(()=>{
    yr++;
    yearEl.textContent = yr;
    yearSubEl.textContent = yearMessages[yr] || '';
    const pct = ((yr - 2026) / (qday - 2026)) * 100;
    fillEl.style.width = Math.min(100, pct) + '%';
    tone(400 + (yr-2026)*30, 'sine', 0.08, 0.04);

    if(yr >= qday){
      stageEl.removeEventListener('click', skipHandler);
      yearEl.classList.add('danger');
      yearSubEl.classList.add('red');
      tickDot.classList.add('danger');
      clearInterval(yearTimer);
      yearTimer = null;
      setTimeout(()=>revealFileRows(d), 400);
    }
  }, 380);
}

function revealFileRows(d){
  // flash the file card
  const fileEl = document.getElementById('story-file');
  fileEl.classList.add('shaking');
  setTimeout(()=>fileEl.classList.remove('shaking'), 600);

  // flip header status
  document.getElementById('sf-spill').className = 'spill dec';
  document.getElementById('sf-spill').textContent = '● DECRYPTED';
  document.getElementById('sf-class-label').textContent = '// Civilian file — decryption complete';

  // flip only the secret rows from ████ to real value
  d.enc.forEach((r, i)=>{
    if(!r.secret) return;
    setTimeout(()=>{
      const valEl = document.getElementById('sfv-'+i);
      if(valEl){
        valEl.className = 'sf-val ' + r.c;
        valEl.textContent = r.v;
        tone(280+i*35,'sine',0.05,0.03);
        flashWhite();
      }
    }, i * 200);
  });

  // after all rows done, show tension + continue
  const lastIdx = d.enc.length - 1;
  setTimeout(()=>{
    document.getElementById('tension-wrap').style.display = 'block';
    document.getElementById('tb-thumb').style.left = d.tension + '%';
    setTimeout(()=>{
      document.getElementById('dra2-continue').style.opacity = '1';
    }, 800);
  }, lastIdx * 200 + 400);
}

function goToDecrypt(){
  sndDecrypt();
  flashRed();
  setTimeout(flashWhite,200);
  document.getElementById('dr-a').style.display='none';
  document.getElementById('dr-b').style.display='block';
  // show journalist reveal only for consent_plus
  const jr=document.getElementById('journalist-reveal');
  jr.style.display = currentChoice==='consent_plus' ? 'block' : 'none';
  window.scrollTo({top:0,behavior:'instant'});
  document.getElementById('dr-b').scrollIntoView({behavior:'instant',block:'start'});
  const fc=document.querySelector('#dr-b .file-card');
  if(fc){fc.classList.add('shaking');setTimeout(()=>fc.classList.remove('shaking'),600);}
  // extra alarm for journalist reveal
  if(currentChoice==='consent_plus') setTimeout(sndAlert, 800);
}

function rawlsAns(ans){
  const d=CD[currentChoice];
  const el=document.getElementById('rawls-resp');
  el.innerHTML=ans==='keep'?d.keep:d.change;
  el.classList.add('show');
  document.getElementById('restart-btn').style.display='block';
  document.getElementById('about-btn').style.display='block';
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function restart(){
  if(glitchLoop){ clearInterval(glitchLoop); glitchLoop=null; }
  const ge=document.getElementById('trans-glitch'); if(ge){ ge.classList.remove('glitching','final'); }
  document.getElementById('glitch-word').textContent='IDENTITY';
  currentChoice=null;
  document.getElementById('rawls-resp').classList.remove('show');
  document.getElementById('dr-a').style.display='';
  goTo('s-dilemma');
}

function toggleNav(){}
function navChoices(){
  restart();
  goTo('s-dilemma');
}
function navAbout(){
  window._prevScreen = document.querySelector('.screen.active')?.id || 's-consequence';
  goTo('s-about');
}
function navBack(){
  goTo(window._prevScreen || 's-consequence');
}
function closeAbout(){}
function closeAboutBtn(){}

function toggleVeil(){
  const box=document.getElementById('veil-box');
  const arrow=document.getElementById('veil-arrow');
  const open=box.style.display==='block';
  box.style.display=open?'none':'block';
  arrow.classList.toggle('open',!open);
}
function toggleQC(){
  const box=document.getElementById('qc-box');
  const arrow=document.getElementById('qc-arrow');
  const open=box.style.display==='block';
  box.style.display=open?'none':'block';
  arrow.classList.toggle('open',!open);
}
function togglePrecedents(){
  const box=document.getElementById('precedents-box');
  const arrow=document.getElementById('precedents-arrow');
  const open=box.style.display==='block';
  box.style.display=open?'none':'block';
  arrow.classList.toggle('open',!open);
}

function flashRed(){const o=document.getElementById('av-red');o.classList.add('flash');setTimeout(()=>o.classList.remove('flash'),180);setTimeout(()=>{o.classList.add('flash');setTimeout(()=>o.classList.remove('flash'),130);},360);}
function flashWhite(){const o=document.getElementById('av-white');o.classList.add('flash');setTimeout(()=>o.classList.remove('flash'),110);}