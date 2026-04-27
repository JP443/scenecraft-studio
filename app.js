// ══════════════════════════════════════
//  SCENECRAFT STUDIO — APP JS
// ══════════════════════════════════════

// ── Splash screen ──
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('splash')?.classList.add('gone'),1400);
});

// ── PROJECT TYPE CONFIG ──
const PT={feature:{ico:'🎬',name:'Feature Film',fmt:['Screenplay','Spec Script','Shooting Script'],tabs:['Story','Cast','Outline','Script','Polish'],structLabel:'Act Structure',structures:['3-Act Structure','Hero\'s Journey','Save the Cat','5-Act Structure','Non-linear'],unitLabel:'Scenes',unitSingular:'Scene',sceneNums:[10,15,20,25],defaultScenes:15,pages:'90–120 pages',runtime:'90–120 min',loglineHint:'A [flawed protagonist] must [goal] before [devastating consequence].',extraFields:[],outlineStructures:{act1:0.25,act2:0.5,act3:0.25},beatLabels:['ACT I','ACT II','ACT III'],beatSubs:['Setup 25%','Confrontation 50%','Resolution 25%'],scriptSys:`You are an award-winning Hollywood screenwriter. Write in strict professional screenplay format.`},
short:{ico:'🎞',name:'Short Film',fmt:['Drama Short','Comedy Short','Experimental','Thriller Short','Horror Short'],tabs:['Story','Cast','Outline','Script','Polish'],structLabel:'Structure',structures:['3-Act (Compact)','Single Scene','Vignette','Non-linear'],unitLabel:'Scenes',unitSingular:'Scene',sceneNums:[3,5,7,10],defaultScenes:5,pages:'5–40 pages',runtime:'5–40 min',loglineHint:'A [character] encounters [situation] that leads to [outcome or revelation].',extraFields:[{id:'fest',label:'Target Festival',type:'select',opts:['Sundance','TIFF','Cannes','Tribeca','Pan-African Film Festival','Local Festival']}],outlineStructures:{act1:0.3,act2:0.4,act3:0.3},beatLabels:['SETUP','CONFLICT','RESOLUTION'],beatSubs:['Setup 30%','Conflict 40%','Resolution 30%'],scriptSys:`You are a short film specialist screenwriter.`},
tv:{ico:'📺',name:'TV Show',fmt:['Drama (1hr)','Comedy (30 min)','Procedural','Anthology','Reality'],tabs:['Concept','Characters','Episode Outline','Script','Polish'],structLabel:'Episode Type',structures:['Pilot Episode','Spec Episode','Season Bible','Episode Outline Only'],unitLabel:'Acts / Scenes',unitSingular:'Act',sceneNums:[4,5,6,7],defaultScenes:5,pages:'22–60 pages',runtime:'22–60 min',loglineHint:'A [show concept]: in a world where [premise], one [protagonist] must [goal] each week.',extraFields:[{id:'network',label:'Network / Platform',type:'select',opts:['HBO / Max','Netflix','Amazon','Apple TV+','BBC','NTV Uganda','KTN','Local Network','Streaming Only']},{id:'season',label:'Season / Episode',type:'text',placeholder:'e.g. Season 1, Episode 1'}],outlineStructures:{act1:0.2,act2:0.4,act3:0.2,act4:0.2},beatLabels:['ACT 1','ACT 2','ACT 3','ACT 4'],beatSubs:['Cold Open','Rising','Climax','Tag'],scriptSys:`You are a professional TV writer.`},
doc:{ico:'🎙',name:'Documentary',fmt:['Observational','Interview-Based','Narrated','Cinéma Vérité','Historical','Political'],tabs:['Concept','Subjects','Structure','Script','Polish'],structLabel:'Documentary Style',structures:['Narrative Arc','Chronological','Thematic','Interview-Driven','Hybrid'],unitLabel:'Segments',unitSingular:'Segment',sceneNums:[5,8,10,12],defaultScenes:8,pages:'Variable',runtime:'20–120 min',loglineHint:'A documentary exploring [subject] that reveals [unexpected truth or journey].',extraFields:[{id:'pov',label:'Point of View',type:'select',opts:['Fly-on-the-wall','Filmmaker as subject','Multiple subjects','Archival-led','Narrator-driven']}],outlineStructures:{act1:0.25,act2:0.5,act3:0.25},beatLabels:['OPEN','BODY','RESOLUTION'],beatSubs:['Hook & Setup','Investigation & Evidence','Revelation & Conclusion'],scriptSys:`You are an experienced documentary writer and director.`},
web:{ico:'📱',name:'Web Series',fmt:['Drama','Comedy','Thriller','Mockumentary','Tutorial/Edu'],tabs:['Concept','Cast','Episodes','Script','Polish'],structLabel:'Format',structures:['Episodic','Serialized','Standalone Episodes','Hybrid'],unitLabel:'Episodes',unitSingular:'Episode',sceneNums:[4,6,8,10],defaultScenes:6,pages:'3–15 pages per ep',runtime:'5–20 min per ep',loglineHint:'A [show concept] told in [X] short episodes for [platform/audience].',extraFields:[{id:'platform',label:'Platform',type:'select',opts:['YouTube','TikTok','Instagram','Facebook Watch','Standalone Streaming','Festival Circuit']}],outlineStructures:{act1:0.3,act2:0.4,act3:0.3},beatLabels:['HOOK','MIDDLE','END'],beatSubs:['Hook fast','Story','Cliffhanger'],scriptSys:`You are a web series writer.`},
animation:{ico:'✏️',name:'Animation',fmt:['Animated Feature','Animated Series','Animated Short','Stop-Motion','Motion Graphics'],tabs:['Story','Characters','Outline','Script','Polish'],structLabel:'Style',structures:['3-Act (Family)','3-Act (Adult)','Non-linear','Adventure Arc'],unitLabel:'Sequences',unitSingular:'Sequence',sceneNums:[8,12,15,20],defaultScenes:12,pages:'80–120 pages',runtime:'80–120 min',loglineHint:'In a world of [animated setting], a [character] must [quest] to [ultimate goal].',extraFields:[{id:'rating',label:'Target Rating',type:'select',opts:['G / Family','PG / All Ages','PG-13','R / Adult Animation']}],outlineStructures:{act1:0.25,act2:0.5,act3:0.25},beatLabels:['ACT I','ACT II','ACT III'],beatSubs:['Ordinary World','Adventure','Resolution'],scriptSys:`You are a professional animation screenwriter.`},
commercial:{ico:'📣',name:'Commercial / Ad',fmt:['Brand Film','30-Second Spot','60-Second','Product Demo','Social Media Ad','PSA'],tabs:['Brief','Talent','Storyboard','Script','Polish'],structLabel:'Type',structures:['Narrative Ad','Product Demo','Testimonial','Emotional Brand Film','Comedy Spot'],unitLabel:'Shots / Scenes',unitSingular:'Shot',sceneNums:[5,8,10,15],defaultScenes:8,pages:'1–5 pages',runtime:'15s–3 min',loglineHint:'A [brand story] that makes the viewer feel [emotion] and inspires them to [action].',extraFields:[{id:'brand',label:'Brand / Product',type:'text',placeholder:'e.g. MTN Uganda'},{id:'cta',label:'Call to Action',type:'text',placeholder:'e.g. Visit mtnonline.com'}],outlineStructures:{act1:0.25,act2:0.5,act3:0.25},beatLabels:['HOOK','STORY','CTA'],beatSubs:['Grab attention','Build emotion','Drive action'],scriptSys:`You are an award-winning commercial screenwriter.`},
miniseries:{ico:'🎭',name:'Mini-Series',fmt:['2 Episodes','4 Episodes','6 Episodes','8 Episodes'],tabs:['Concept','Characters','Episode Arc','Script','Polish'],structLabel:'Episodes',structures:['2-Part','4-Part','6-Part','8-Part'],unitLabel:'Episodes',unitSingular:'Episode',sceneNums:[2,4,6,8],defaultScenes:4,pages:'45–60 pages per ep',runtime:'45–60 min per ep',loglineHint:'A limited series about [premise] told across [X] episodes, exploring [theme].',extraFields:[{id:'streamer',label:'Target Platform',type:'select',opts:['Netflix','HBO','Amazon','Apple TV+','BBC','Local Broadcast']}],outlineStructures:{act1:0.15,act2:0.5,act3:0.2,act4:0.15},beatLabels:['EP 1','EP 2–N-1','FINAL','CODA'],beatSubs:['Establish','Escalate','Climax','Resolve'],scriptSys:`You are a prestige television mini-series writer.`},
stage:{ico:'🎪',name:'Stage Play',fmt:['Full-Length Play','One-Act','Monologue','Two-Hander','Musical'],tabs:['Concept','Characters','Scenes','Script','Polish'],structLabel:'Format',structures:['Full-Length (2 Act)','One-Act','Short Play','Monologue'],unitLabel:'Scenes',unitSingular:'Scene',sceneNums:[3,5,8,10],defaultScenes:5,pages:'30–100 pages',runtime:'30–120 min',loglineHint:'A stage play exploring [theme] through [characters] in [setting].',extraFields:[{id:'venue',label:'Venue Type',type:'select',opts:['Black Box Theatre','Proscenium Stage','Thrust Stage','Site-Specific','Open Air']}],outlineStructures:{act1:0.4,act2:0.6},beatLabels:['ACT ONE','ACT TWO'],beatSubs:['Establish & Rising Action','Climax & Resolution'],scriptSys:`You are a professional playwright.`},
podcast:{ico:'🎧',name:'Audio Drama',fmt:['Podcast Drama','Radio Play','Audio Fiction','Narrated Story'],tabs:['Concept','Characters','Episodes','Script','Polish'],structLabel:'Format',structures:['Episodic Drama','Anthology','Serial Fiction','Radio Play'],unitLabel:'Episodes',unitSingular:'Episode',sceneNums:[3,5,8,10],defaultScenes:5,pages:'10–40 pages per ep',runtime:'20–60 min per ep',loglineHint:'An audio drama about [premise] told through [POV or structure].',extraFields:[{id:'pov',label:'Narration Style',type:'select',opts:['First Person Narrator','Omniscient','Found Footage Audio','Multiple POV','No Narration']}],outlineStructures:{act1:0.25,act2:0.5,act3:0.25},beatLabels:['OPEN','MID','CLOSE'],beatSubs:['Establish sound world','Story','Resolution'],scriptSys:`You are an audio drama and podcast script writer.`},
music:{ico:'🎵',name:'Music Video',fmt:['Narrative','Performance','Conceptual / Abstract','Lyric Video','Documentary Style'],tabs:['Treatment','Talent','Shot List','Script','Polish'],structLabel:'Style',structures:['Narrative Story','Performance-Based','Hybrid Narrative/Performance','Conceptual/Art'],unitLabel:'Shots / Scenes',unitSingular:'Shot',sceneNums:[5,8,12,15],defaultScenes:8,pages:'2–8 pages',runtime:'3–6 min',loglineHint:'A music video that visualizes [song theme] through [visual concept or story].',extraFields:[{id:'artist',label:'Artist / Band',type:'text',placeholder:'e.g. Eddy Kenzo'},{id:'song',label:'Song Title',type:'text',placeholder:'e.g. Stamina'}],outlineStructures:{act1:0.33,act2:0.34,act3:0.33},beatLabels:['VERSE','CHORUS','BRIDGE/END'],beatSubs:['Establish','Peak','Resolution'],scriptSys:`You are a music video director and treatment writer.`},
pilot:{ico:'🚀',name:'TV Pilot',fmt:['Network Drama (60 min)','Network Comedy (30 min)','Cable Drama','Streaming Drama','Animated Pilot'],tabs:['Concept','Characters','Outline','Script','Polish'],structLabel:'Network Type',structures:['Network Broadcast','Cable','Streaming (Netflix/HBO)','Premium Cable'],unitLabel:'Acts',unitSingular:'Act',sceneNums:[4,5,6,7],defaultScenes:5,pages:'22–65 pages',runtime:'22–65 min',loglineHint:'A pilot that establishes [world], introduces [protagonist], and poses the [series question].',extraFields:[{id:'netw',label:'Target Network',type:'select',opts:['NBC/CBS/ABC','HBO/Showtime','Netflix','Amazon','FX','Local TV']}],outlineStructures:{act1:0.2,act2:0.35,act3:0.25,act4:0.2},beatLabels:['COLD OPEN','ACT 1','ACT 2','TAG'],beatSubs:['Hook','Establish','Rising Action','Close'],scriptSys:`You are a professional TV pilot writer.`}
};

// ── STATE ──
let selectedType=null,selectedFmt=null;
let S={title:'',logline:'',setting:'',themes:'',protagonist:'',conflict:'',tone:'',extra:{},cast:[],scenes:[],script:''};
let isGen=false,viewMode='preview',polType=null,editingCharIdx=-1;

// ── PROJECT SELECT ──
function selType(btn){
  document.querySelectorAll('.ptcard').forEach(c=>{c.classList.remove('sel');c.setAttribute('aria-pressed','false');});
  btn.classList.add('sel');btn.setAttribute('aria-pressed','true');
  selectedType=btn.dataset.type;selectedFmt=null;
  const cfg=PT[selectedType];
  const row=document.getElementById('fmtRow');
  row.style.display='flex';
  document.getElementById('fmtLbl').textContent='Format:';
  row.querySelectorAll('.fpill').forEach(p=>p.remove());
  cfg.fmt.forEach(f=>{const p=document.createElement('button');p.className='fpill';p.type='button';p.textContent=f;p.onclick=()=>{row.querySelectorAll('.fpill').forEach(x=>x.classList.remove('sel'));p.classList.add('sel');selectedFmt=f;};row.appendChild(p);});
  row.querySelector('.fpill')?.click();
  const cta=document.getElementById('ctaBtn');cta.classList.add('ready');cta.setAttribute('aria-disabled','false');
  document.getElementById('ctaIco').textContent=cfg.ico;
  document.getElementById('ctaHint').textContent=cfg.pages+' · '+cfg.runtime;
}
function startApp(){if(!selectedType)return;buildApp();document.getElementById('scr-select').classList.remove('on');document.getElementById('scr-app').classList.add('on');}

// ── MOBILE MENU ──
function toggleMobileMenu(){
  const nav=document.getElementById('mobileNav'),ov=document.getElementById('mobileNavOverlay'),btn=document.getElementById('hdMenuBtn');
  const open=nav.classList.toggle('on');ov.classList.toggle('on',open);btn.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',open?'true':'false');
  btn.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  nav.setAttribute('aria-hidden',open?'false':'true');
  document.body.style.overflow=open?'hidden':'';
}

// ── BUILD APP ──
function buildApp(){
  const cfg=PT[selectedType];
  const nav=document.getElementById('tabNav');
  nav.innerHTML=cfg.tabs.map((t,i)=>`<button class="tab ${i===0?'on':''}" data-ti="${i}" onclick="go(${i})"><span class="tn">${i+1}</span>${t}</button>`).join('');
  // Mobile tabs
  const mnav=document.getElementById('mobileTabNav');
  mnav.innerHTML=cfg.tabs.map((t,i)=>`<button class="mob-tab ${i===0?'on':''}" data-ti="${i}" onclick="go(${i});toggleMobileMenu();"><span class="tn">${i+1}</span>${t}</button>`).join('');
  document.getElementById('hdStat').innerHTML=`Pages:<b id="h-pg">0</b> ${cfg.unitLabel}:<b id="h-sc">0</b> Cast:<b id="h-ca">0</b>`;
  document.getElementById('mobileStats').innerHTML=`Pages: <b id="mh-pg">0</b> · ${cfg.unitLabel}: <b id="mh-sc">0</b> · Cast: <b id="mh-ca">0</b>`;
  buildPanels(cfg);renderCast();updateStats();renderSceneNav();
}
function buildPanels(cfg){document.getElementById('panelsContainer').innerHTML=panel0(cfg)+panel1(cfg)+panel2(cfg)+panel3(cfg)+panel4(cfg);}

// ── PANELS ──
function panel0(cfg){
  const ex=cfg.extraFields.map(f=>`<div class="f"><span class="lbl">${f.label}</span>${f.type==='select'?`<select id="ef-${f.id}" onchange="syncS()">${f.opts.map(o=>`<option>${o}</option>`).join('')}</select>`:`<input type="text" id="ef-${f.id}" placeholder="${f.placeholder||''}" oninput="syncS()"/>`}</div>`).join('');
  return`<div class="panel on" id="p-0"><div class="pg">
<div style="display:flex;align-items:center;gap:10px;margin-bottom:1.2rem;"><span style="font-size:1.4rem;">${cfg.ico}</span><div><div style="font-size:14px;font-weight:600;color:var(--tx);">${cfg.name} ${selectedFmt?'— '+selectedFmt:''}</div><div style="font-size:11px;color:var(--mu);">${cfg.pages} · ${cfg.runtime} · <span style="color:var(--g);cursor:pointer;" onclick="goSelect()">Change type</span></div></div></div>
<div class="ttl">${cfg.tabs[0]}</div><div class="sub">Start with your concept. Jump to any tab — nothing is locked.</div>
<div class="tip">${cfg.loglineHint}</div>
<div class="f2"><div class="f"><span class="lbl">Title</span><input id="s-title" type="text" placeholder="Working title..." oninput="syncS()"/></div><div class="f"><span class="lbl">Genre</span><select id="s-genre" onchange="syncS()"><option value="">Select...</option><option>Drama</option><option>Thriller</option><option>Crime</option><option>Action</option><option>Horror</option><option>Sci-Fi</option><option>Comedy</option><option>Romance</option><option>Historical</option><option>Mystery</option></select></div></div>
<div class="f"><span class="lbl">Logline / Premise</span><textarea id="s-logline" oninput="syncS()" style="min-height:60px;" placeholder="${cfg.loglineHint}"></textarea></div>
<div class="f2"><div class="f"><span class="lbl">World & Setting</span><input id="s-set" type="text" oninput="syncS()" placeholder="Time, place, world..."/></div><div class="f"><span class="lbl">Themes</span><input id="s-themes" type="text" oninput="syncS()" placeholder="e.g. identity, betrayal..."/></div></div>
<div class="f2"><div class="f"><span class="lbl">Protagonist</span><input id="s-proto" type="text" oninput="syncS()" placeholder="Who is your hero?"/></div><div class="f"><span class="lbl">Central Conflict</span><input id="s-conf" type="text" oninput="syncS()" placeholder="Core struggle?"/></div></div>
${cfg.extraFields.length?`<div class="f2">${ex}</div>`:''}
<div class="f"><span class="lbl">Tone</span><select id="s-tone" onchange="syncS()"><option>Cinematic & serious</option><option>Dark & atmospheric</option><option>Gritty & realistic</option><option>Fast-paced & kinetic</option><option>Warm & emotional</option><option>Witty & sharp</option></select></div>
<div class="brow"><button class="bg" onclick="devStory()"><span class="spin" id="sp1" style="display:none"></span>✦ Develop with AI</button><button class="bs" onclick="go(1)">→ ${cfg.tabs[1]}</button><button class="bs" onclick="go(3)">→ Jump to Script</button></div>
<div id="ab1-wrap" style="display:none;margin-top:1rem;"><div class="ebox-bar"><span class="ebox-lbl"><div class="edot" id="ab1dot"></div>AI Analysis <span class="edit-tag">✏ editable</span></span><button class="btiny" onclick="devStory()">Regen</button></div><textarea class="ebox-ta" id="ab1t"></textarea></div>
</div></div>`;
}

function panel1(cfg){
  const cl=selectedType==='doc'?'Subjects':'Characters';
  return`<div class="panel" id="p-1"><div class="pg"><div class="ttl">${cfg.tabs[1]}</div><div class="sub">Add ${cl.toLowerCase()} manually or let AI suggest.</div>
<div class="brow" style="margin-bottom:1rem;"><button class="bg" onclick="aiCast()"><span class="spin" id="sp2" style="display:none"></span>✦ AI Suggest</button><button class="bs" onclick="openCF()">+ Add Manually</button></div>
<div id="ab2-wrap" style="display:none;margin-bottom:0.8rem;"><div class="ebox-bar"><span class="ebox-lbl"><div class="edot" id="ab2dot"></div>AI Suggestions <span class="edit-tag">✏ editable</span></span><button class="btiny" onclick="aiCast()">Regen</button><button class="btiny" onclick="parseSuggAndAdd()">+ Import</button></div><textarea class="ebox-ta" id="ab2t" style="min-height:130px;"></textarea></div>
<div class="div"></div><div class="cgrid" id="cGrid"></div><button class="addcc" onclick="openCF()">+ Add ${cl.slice(0,-1)}</button>
<div class="cform" id="cForm"><div class="f2"><div class="f"><span class="lbl">Name</span><input id="cf-n" type="text"/></div><div class="f"><span class="lbl">Role</span><select id="cf-r">${castRoles()}</select></div></div><div class="f"><span class="lbl">Description</span><textarea id="cf-d"></textarea></div><div class="brow"><button class="bg" id="cfSaveBtn" onclick="addChar()">Add</button><button class="bs" onclick="closeCF()">Cancel</button></div></div>
<div class="brow" style="margin-top:1.2rem;"><button class="bs" onclick="go(0)">← ${cfg.tabs[0]}</button><button class="bg" onclick="go(2)">→ ${cfg.tabs[2]}</button></div>
</div></div>`;
}
function castRoles(){return['Protagonist','Antagonist','Supporting','Mentor','Love Interest','Anti-Hero','Comic Relief'].map(o=>`<option>${o}</option>`).join('');}

function panel2(cfg){
  const bb=cfg.beatLabels;
  const bbh=bb.length===4?`<div class="ba1" style="flex:0 0 20%">${bb[0]}</div><div class="ba2" style="flex:0 0 35%">${bb[1]}</div><div class="ba2" style="flex:0 0 25%">${bb[2]}</div><div class="ba3" style="flex:0 0 20%">${bb[3]}</div>`:bb.length===2?`<div class="ba1" style="flex:0 0 40%">${bb[0]}</div><div class="ba2" style="flex:0 0 60%">${bb[1]}</div>`:`<div class="ba1">${bb[0]}</div><div class="ba2">${bb[1]}</div><div class="ba3">${bb[2]}</div>`;
  const no=cfg.sceneNums.map(n=>`<option value="${n}" ${n===cfg.defaultScenes?'selected':''}>${n} ${cfg.unitLabel.toLowerCase()}</option>`).join('');
  return`<div class="panel" id="p-2"><div class="pg"><div class="ttl">${cfg.tabs[2]}</div><div class="sub">Generate ${cfg.unitLabel.toLowerCase()} or write manually. Every entry is editable.</div>
<div style="background:var(--bg3);border:1px solid var(--br);border-radius:var(--radius);padding:0.9rem;margin-bottom:1rem;"><div class="sec-lbl">${cfg.structLabel}</div><div class="beatbar">${bbh}</div><div class="blbls">${cfg.beatSubs.map(s=>`<span>${s}</span>`).join('')}</div></div>
<div class="f2"><div class="f"><span class="lbl">Number of ${cfg.unitLabel}</span><select id="o-n">${no}</select></div><div class="f"><span class="lbl">${cfg.structLabel}</span><select id="o-s">${cfg.structures.map(s=>`<option>${s}</option>`).join('')}</select></div></div>
<div class="brow"><button class="bg" onclick="genOutline()"><span class="spin" id="sp3" style="display:none"></span>✦ Generate ${cfg.unitLabel}</button><button class="bs" onclick="addBlankScene()">+ Add Manually</button></div>
<div id="ab3-wrap" style="display:none;margin-top:0.8rem;"><div class="ebox-bar"><span class="ebox-lbl"><div class="edot" id="ab3dot"></div>Generating...</span></div><textarea class="ebox-ta" id="ab3t"></textarea></div>
<div id="slist" style="margin-top:0.9rem;"></div>
<div class="brow"><button class="bs" onclick="go(1)">← ${cfg.tabs[1]}</button><button class="bg" onclick="go(3)">→ ${cfg.tabs[3]}</button></div>
</div></div>`;
}

function panel3(cfg){
  return`<div class="panel" id="p-3"><div class="tool">
<div class="ttl" style="font-size:1.1rem;">${cfg.tabs[3]}</div><div class="sub">Generate, stream, or paste. Preview or edit directly.</div>
<div class="f"><span class="lbl">Write</span><select id="sc-m"><option value="all">Full script</option><option value="act1">First section</option><option value="act2">Middle section</option><option value="act3">Final section</option></select></div>
<div class="f"><span class="lbl">Dialogue Style</span><select id="sc-d"><option>Balanced</option><option>Heavy dialogue</option><option>Action-focused</option></select></div>
<div class="brow"><button class="bg" id="gsbtn" onclick="genScript()"><span class="spin" id="sp4" style="display:none"></span>✦ Generate</button><button class="bs" onclick="clearSc()">Clear</button></div>
<div class="div"></div><span class="lbl">${cfg.unitLabel} Navigator</span><div id="snav" style="margin-top:0.4rem;max-height:160px;overflow-y:auto;"></div>
<div class="div"></div><span class="lbl">Stats</span>
<div class="statgrid"><div class="stat"><div class="stat-n" id="st-pg">0</div><div class="stat-l">Pages</div></div><div class="stat"><div class="stat-n" id="st-wd">0</div><div class="stat-l">Words</div></div><div class="stat"><div class="stat-n" id="st-sc">0</div><div class="stat-l">${cfg.unitLabel}</div></div><div class="stat"><div class="stat-n" id="st-rt">0m</div><div class="stat-l">Runtime</div></div></div>
<div class="brow" style="margin-top:0.8rem;"><button class="bs" onclick="go(2)">← ${cfg.tabs[2]}</button><button class="bg" onclick="go(4)">→ ${cfg.tabs[4]}</button></div>
</div><div class="preview"><div class="spwrap">
<div class="spmeta"><span id="sp-ttl">Untitled — Draft 1</span><span><b id="sp-pg">0</b> pages · <b id="sp-rt">0</b>m est.</span></div>
<div class="sp-toolbar"><span class="badge">${cfg.name}</span><span class="badge" id="fmtBadge">${selectedFmt||''}</span><div style="margin-left:auto;display:flex;gap:5px;flex-wrap:wrap;"><button class="mode-btn on" id="mbPreview" onclick="setMode('preview')">Preview</button><button class="mode-btn" id="mbEdit" onclick="setMode('edit')">✏ Edit</button><button class="mode-btn" onclick="pasteMode()">📋 Paste</button><button class="mode-btn" onclick="copyScript()">Copy</button></div></div>
<div id="spPreview"><div class="sppage"><div class="spnum">1.</div><div id="spContent"><div class="spempty"><div class="eico">${cfg.ico}</div><div class="ettl">FADE IN:</div><div class="esub">Generate or paste your screenplay</div></div></div></div></div>
<div id="spEditWrap" style="display:none;"><textarea class="sp-editor" id="spEditor" placeholder="Write or paste your script here..." oninput="onEditorInput()" spellcheck="true"></textarea></div>
<div id="spPasteWrap" style="display:none;"><textarea class="sp-editor" id="spPaste" placeholder="Paste your existing draft here..." style="background:#F0EDE5;color:#333;"></textarea><div class="brow" style="margin-top:0.5rem;"><button class="bg" onclick="importPaste()">Import Draft</button><button class="bs" onclick="cancelPaste()">Cancel</button></div></div>
</div></div></div>`;
}

function panel4(cfg){
  return`<div class="panel" id="p-4"><div class="pg"><div class="ttl">${cfg.tabs[4]}</div><div class="sub">Refine with targeted AI tools. Before/After comparison.</div>
<div class="pgrid">
<button class="pc" onclick="selPol(this,'dialogue')"><span class="pc-i">💬</span><div class="pc-n">Sharpen Dialogue</div><div class="pc-d">Distinctive, subtext-loaded</div></button>
<button class="pc" onclick="selPol(this,'action')"><span class="pc-i">⚡</span><div class="pc-n">Tighten Action</div><div class="pc-d">Leaner, more cinematic</div></button>
<button class="pc" onclick="selPol(this,'pacing')"><span class="pc-i">🎞</span><div class="pc-n">Fix Pacing</div><div class="pc-d">Balance rhythm</div></button>
<button class="pc" onclick="selPol(this,'tension')"><span class="pc-i">🔥</span><div class="pc-n">Raise Stakes</div><div class="pc-d">More conflict & urgency</div></button>
<button class="pc" onclick="selPol(this,'format')"><span class="pc-i">📋</span><div class="pc-n">Fix Formatting</div><div class="pc-d">Industry standard</div></button>
<button class="pc" onclick="selPol(this,'director')"><span class="pc-i">🎥</span><div class="pc-n">Director's Notes</div><div class="pc-d">Visual direction</div></button>
</div>
<div class="brow"><button class="bg" id="polbtn" onclick="runPol()" disabled><span class="spin" id="sp5" style="display:none"></span>✦ Polish</button><button class="bs" onclick="acceptPolish()">✓ Accept</button><button class="bs" onclick="copyScript()">📋 Copy</button><button class="xbtn" onclick="doExport()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export</button></div>
<div id="polOut" style="display:none;margin-top:1.2rem;"><div class="compare-grid"><div class="compare-col"><h4>Original</h4><div class="sp-compare" id="polBefore"></div></div><div class="compare-col after"><h4>Polished ✦ <span class="edit-tag">✏ editable</span></h4><textarea class="sp-compare" id="polAfter" style="background:#FAF8F2;border:2px solid rgba(200,144,30,0.3);resize:vertical;min-height:180px;font-family:'Courier Prime',monospace;font-size:10pt;color:#111;outline:none;width:100%;"></textarea></div></div></div>
</div></div>`;
}

// ── NAVIGATION ──
function go(n){
  document.querySelectorAll('.panel').forEach(p=>{p.classList.remove('on');p.style.display='';});
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('on'));
  document.querySelectorAll('.mob-tab').forEach(b=>b.classList.remove('on'));
  const panel=document.getElementById('p-'+n);
  if(panel){panel.classList.add('on');if(n===3)panel.style.display='flex';}
  document.querySelector('.tab[data-ti="'+n+'"]')?.classList.add('on');
  document.querySelector('.mob-tab[data-ti="'+n+'"]')?.classList.add('on');
  renderSceneNav();
}
function goSelect(){document.getElementById('scr-app').classList.remove('on');document.getElementById('scr-select').classList.add('on');}

// ── STATE SYNC ──
function v(id){return document.getElementById(id)?.value||'';}
function syncS(){
  S.title=v('s-title');S.logline=v('s-logline');S.setting=v('s-set');S.themes=v('s-themes');S.protagonist=v('s-proto');S.conflict=v('s-conf');S.tone=v('s-tone');
  const cfg=PT[selectedType];S.extra={};cfg.extraFields.forEach(f=>{S.extra[f.id]=v('ef-'+f.id);});updateStats();
}
function updateStats(){
  const w=S.script.split(/\s+/).filter(Boolean).length,pg=Math.max(0,Math.round(w/185)),scn=(S.script.match(/^(INT\.|EXT\.|SCENE|SEGMENT\s|SHOT\s)/gm)||[]).length,rt=pg+'m';
  const se=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val;};
  se('h-pg',pg);se('h-sc',S.scenes.length||scn);se('h-ca',S.cast.length);
  se('mh-pg',pg);se('mh-sc',S.scenes.length||scn);se('mh-ca',S.cast.length);
  se('st-pg',pg);se('st-wd',w>999?(w/1000).toFixed(1)+'k':w);se('st-sc',S.scenes.length||scn);se('st-rt',rt);
  se('sp-pg',pg);se('sp-rt',pg);se('sp-ttl',(S.title||'Untitled')+' — Draft 1');
  saveDraft();
}

// ── STREAMING ──
const API='/api/chat';
async function stream(sys,user,onChunk,onDone){
  hideErr();
  if(!window.SC?.configured){
    showErr('AI is not configured yet. Edit firebase-config.js with your Firebase project values, then redeploy.');
    onDone?.('');return;
  }
  if(!window.SC.getCurrentUser()){
    openAuth('Sign in to use AI generation.');
    onDone?.('');return;
  }
  let token;
  try{token=await window.SC.getIdToken();}catch{token=null;}
  if(!token){openAuth('Your session expired. Please sign in again.');onDone?.('');return;}

  let res;
  try{
    res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({max_tokens:2000,system:sys,messages:[{role:'user',content:user}]})});
  }catch(e){
    showErr('Network error: '+e.message,()=>stream(sys,user,onChunk,onDone));
    onDone?.('');return;
  }
  if(!res.ok){
    let msg=`Error ${res.status}`;
    try{const j=await res.json();if(j?.error)msg=j.error;}catch{}
    if(res.status===401){openAuth(msg);onDone?.('');return;}
    showErr(msg,res.status===429?null:()=>stream(sys,user,onChunk,onDone));
    onDone?.('');return;
  }
  const reader=res.body.getReader(),dec=new TextDecoder();let buf='',full='';
  try{
    while(true){
      const{done,value}=await reader.read();if(done)break;
      buf+=dec.decode(value,{stream:true});
      const lines=buf.split('\n');buf=lines.pop()??'';
      for(const line of lines){
        if(!line.startsWith('data: '))continue;
        const d=line.slice(6).trim();
        if(d==='[DONE]'){onDone?.(full);return;}
        try{const j=JSON.parse(d);if(j.type==='content_block_delta'&&j.delta?.type==='text_delta'){full+=j.delta.text;onChunk?.(j.delta.text,full);}}catch{}
      }
    }
    onDone?.(full);
  }catch(e){
    showErr('Stream interrupted: '+e.message);
    onDone?.(full);
  }
}

// ── STORY ──
async function devStory(){syncS();if(!S.logline&&!S.title){notify('Enter a title or logline first');return;}show('sp1');const w=document.getElementById('ab1-wrap'),t=document.getElementById('ab1t');w.style.display='block';t.value='';setDot('ab1dot',true);const cfg=PT[selectedType];
const sys=`You are a senior script consultant specializing in ${cfg.name}.`;const p=`Analyze this ${cfg.name} concept:\nTitle: ${S.title}\nLogline: ${S.logline}\nSetting: ${S.setting}\nThemes: ${S.themes}\nProtagonist: ${S.protagonist}\nConflict: ${S.conflict}\n\n1) What's compelling 2) What needs sharpening 3) Comparable works 4) Key note.`;
previewCost(sys,p);
await stream(sys,p,(c,full)=>{t.value=full;},()=>{hide('sp1');setDot('ab1dot',false);});}

// ── CAST ──
async function aiCast(){syncS();show('sp2');const w=document.getElementById('ab2-wrap'),t=document.getElementById('ab2t');w.style.display='block';t.value='';setDot('ab2dot',true);const cfg=PT[selectedType];
const sys=`You are a ${cfg.name} development expert.`;const p=`Suggest 5 characters for:\nTitle: ${S.title}\nLogline: ${S.logline}\nSetting: ${S.setting}\n\nFormat: NAME — Role — description — Arc: transformation`;
previewCost(sys,p);
await stream(sys,p,(c,full)=>{t.value=full;},()=>{hide('sp2');setDot('ab2dot',false);});}
function parseSuggAndAdd(){const txt=document.getElementById('ab2t').value;const lines=txt.split('\n').filter(l=>l.includes('—'));let a=0;lines.forEach(l=>{const p=l.split('—');if(p.length<2)return;const name=p[0].replace(/^\d+\.\s*/,'').trim().toUpperCase();if(!name||name.length>35)return;const role='Supporting';const desc=p.slice(2).join('—').trim();if(!S.cast.find(c=>c.name===name)){S.cast.push({name,role,desc});a++;}});renderCast();updateStats();notify(a>0?`${a} imported!`:'No entries found.');}
function openCF(idx=-1){editingCharIdx=idx;document.getElementById('cForm').style.display='block';if(idx>=0){const c=S.cast[idx];document.getElementById('cf-n').value=c.name;document.getElementById('cf-r').value=c.role;document.getElementById('cf-d').value=c.desc;document.getElementById('cfSaveBtn').textContent='Save';}else{document.getElementById('cf-n').value='';document.getElementById('cf-d').value='';document.getElementById('cfSaveBtn').textContent='Add';}}
function closeCF(){document.getElementById('cForm').style.display='none';editingCharIdx=-1;}
function addChar(){const n=(document.getElementById('cf-n').value||'').trim().toUpperCase(),r=document.getElementById('cf-r').value,d=document.getElementById('cf-d').value.trim();if(!n)return;if(editingCharIdx>=0)S.cast[editingCharIdx]={name:n,role:r,desc:d};else S.cast.push({name:n,role:r,desc:d});renderCast();updateStats();closeCF();}
function remChar(i){if(confirm('Remove?')){S.cast.splice(i,1);renderCast();updateStats();}}
function renderCast(){const g=document.getElementById('cGrid');if(!g)return;g.innerHTML=S.cast.map((c,i)=>`<div class="cc"><button class="ccedit" type="button" onclick="openCF(${i})" aria-label="Edit ${esc(c.name)}">✏</button><button class="ccdel" type="button" onclick="remChar(${i})" aria-label="Delete ${esc(c.name)}">✕</button><div class="ccn">${esc(c.name)}</div><div class="ccr">${esc(c.role)}</div><div class="ccd">${esc(c.desc||'No description.')}</div></div>`).join('');}

// ── OUTLINE ──
async function genOutline(){syncS();const n=document.getElementById('o-n')?.value||10,sval=document.getElementById('o-s')?.value||'3-Act',cfg=PT[selectedType],cs=S.cast.map(c=>`${c.name} (${c.role})`).join(', ')||'main characters';show('sp3');
const w=document.getElementById('ab3-wrap'),t=document.getElementById('ab3t');w.style.display='block';t.value='';setDot('ab3dot',true);document.getElementById('slist').innerHTML='';
const sys=`You are a ${cfg.name} story structure expert.`;const p=`Create a ${n}-${cfg.unitSingular.toLowerCase()} outline using ${sval} for:\nTitle: ${S.title}\nLogline: ${S.logline}\nSetting: ${S.setting}\nCast: ${cs}\n\nFormat: 1. [HEADING] — What happens.`;
previewCost(sys,p);
await stream(sys,p,(c,full)=>{t.value=full;},(full)=>{hide('sp3');setDot('ab3dot',false);document.getElementById('ab3-wrap').style.display='none';parseScenes(full);updateStats();renderSceneNav();});}
function parseScenes(txt){const lines=txt.split('\n').filter(l=>/^\d+\./.test(l.trim()));S.scenes=lines.map((l,i)=>{const wo=l.replace(/^\d+\.\s*/,'').trim();const di=wo.indexOf('—');let loc=wo,desc='';if(di>-1){loc=wo.slice(0,di).trim();desc=wo.slice(di+1).trim();}return{num:i+1,loc,desc};});renderSceneList();}
function renderSceneList(){const cfg=PT[selectedType],n=S.scenes.length,a1=Math.floor(n*0.25),a2=Math.floor(n*0.75),bb=cfg.beatLabels;
document.getElementById('slist').innerHTML=S.scenes.map((sc,i)=>{let al='';if(i===0)al=`<div><span class="actlbl">${bb[0]}</span></div>`;else if(i===a1)al=`<div><span class="actlbl">${bb[bb.length>2?1:1]}</span></div>`;else if(i===a2&&bb.length>2)al=`<div><span class="actlbl">${bb[bb.length-1]}</span></div>`;
return`${al}<div class="si"><div class="sih"><span class="sin">${sc.num}</span><div class="si-body"><div class="si-loc" contenteditable="true" spellcheck="false" onblur="saveScene(${i},'loc',this.textContent)">${esc(sc.loc)}</div><div class="si-desc" contenteditable="true" onblur="saveScene(${i},'desc',this.textContent)">${esc(sc.desc)}</div><div class="si-tools"><button class="siact" onclick="wScene(${i});go(3)">✦ Write</button><button class="siact" onclick="appendScene(${i})">+ Append</button><button class="siact danger" onclick="deleteScene(${i})">✕</button></div></div></div></div>`;}).join('');updateStats();}
function saveScene(i,f,v){if(S.scenes[i])S.scenes[i][f]=v.trim();}
function deleteScene(i){S.scenes.splice(i,1);S.scenes.forEach((s,j)=>s.num=j+1);renderSceneList();renderSceneNav();updateStats();}
function addBlankScene(){const cfg=PT[selectedType];S.scenes.push({num:S.scenes.length+1,loc:cfg.unitSingular.toUpperCase()+' '+(S.scenes.length+1),desc:'Describe...'});renderSceneList();renderSceneNav();updateStats();}
function renderSceneNav(){const nav=document.getElementById('snav');if(!nav)return;if(!S.scenes.length){nav.innerHTML='<div style="font-size:11px;color:var(--mu);">No outline yet.</div>';return;}nav.innerHTML=S.scenes.map((sc,i)=>`<div class="snav-item" onclick="appendScene(${i})"><span class="snav-n">${sc.num}</span><span class="snav-t">${esc((sc.loc||'').replace(/^(INT\.|EXT\.)\s*/,'').substring(0,28))}</span></div>`).join('');}

// ── SCRIPT ──
function setMode(m){viewMode=m;const e=id=>document.getElementById(id);e('mbPreview')?.classList.toggle('on',m==='preview');e('mbEdit')?.classList.toggle('on',m==='edit');e('spPreview').style.display=m==='preview'?'block':'none';e('spEditWrap').style.display=m==='edit'?'block':'none';e('spPasteWrap').style.display='none';if(m==='edit'){e('spEditor').value=S.script;e('spEditor')?.focus();}if(m==='preview')renderSP();}
function pasteMode(){document.getElementById('spPreview').style.display='none';document.getElementById('spEditWrap').style.display='none';document.getElementById('spPasteWrap').style.display='block';}
function importPaste(){const txt=document.getElementById('spPaste')?.value.trim();if(!txt){notify('Nothing to import.');return;}S.script=txt;document.getElementById('spPaste').value='';setMode('preview');updateStats();notify('Draft imported!');}
function cancelPaste(){document.getElementById('spPaste').value='';setMode('preview');}
function onEditorInput(){S.script=document.getElementById('spEditor')?.value||'';updateStats();}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function parseSP(txt){if(!txt?.trim())return'';const lines=txt.split('\n');let html='',inDial=false,prev='';for(const t of lines){const tr=t.trim();if(!tr){html+='<div class="spbl"></div>';if(prev==='action')inDial=false;continue;}if(/^(FADE IN:|FADE OUT\.|FADE TO BLACK\.|CUT TO:|THE END|ACT ONE|ACT TWO|ACT THREE|END OF ACT|TAG:)$/.test(tr)){html+=`<div class="sptr">${esc(tr)}</div>`;inDial=false;prev='trans';continue;}if(/^(INT\.|EXT\.|I\/E\.|B-ROLL:|SCENE\s\d|SEGMENT\s\d|SHOT\s\d|SOUND:|MUSIC:)/.test(tr)){html+=`<div class="spsh">${esc(tr)}</div>`;inDial=false;prev='sh';continue;}if(tr.startsWith('(')&&tr.endsWith(')')&&inDial){html+=`<div class="sppa">${esc(tr)}</div>`;prev='paren';continue;}if(/^[A-Z][A-Z\s'\-()\.V]+$/.test(tr)&&tr.length<45&&!tr.endsWith('TO:')&&!tr.startsWith('INT')&&!tr.startsWith('EXT')&&tr.split(' ').length<=6){html+=`<div class="spch">${esc(tr)}</div>`;inDial=true;prev='char';continue;}if(inDial&&prev!=='sh'&&prev!=='action'){html+=`<div class="spdi">${esc(tr)}</div>`;prev='dial';continue;}html+=`<div class="spac">${esc(tr)}</div>`;inDial=false;prev='action';}return html;}
function renderSP(){const el=document.getElementById('spContent');if(!el)return;const html=parseSP(S.script);el.innerHTML=html||`<div class="spempty"><div class="eico">${PT[selectedType]?.ico||'🎬'}</div><div class="ettl">FADE IN:</div><div class="esub">Generate or paste your screenplay</div></div>`;}
async function genScript(){syncS();if(isGen)return;isGen=true;show('sp4');document.getElementById('gsbtn').disabled=true;setMode('preview');const cfg=PT[selectedType],cs=S.cast.map(c=>`${c.name} (${c.role}): ${c.desc}`).join('\n')||'As needed',ss=S.scenes.length?S.scenes.map(s=>`${s.num}. ${s.loc} — ${s.desc}`).join('\n'):'Generate from logline';
const prompt=`Write a professional ${cfg.name} script:\nTITLE: ${S.title||'Untitled'}\nLOGLINE: ${S.logline}\nSETTING: ${S.setting}\nTONE: ${S.tone}\n\nCAST:\n${cs}\n\nOUTLINE:\n${ss}\n\nBegin with FADE IN:.`;
const spc=document.getElementById('spContent');spc.innerHTML='';const cur=document.createElement('span');cur.className='gen-cursor';
previewCost(cfg.scriptSys,prompt);
await stream(cfg.scriptSys,prompt,(c,full)=>{S.script=full;spc.innerHTML=parseSP(full);spc.appendChild(cur);document.querySelector('.preview')?.scrollTo(0,999999);},(full)=>{S.script=full;renderSP();hide('sp4');document.getElementById('gsbtn').disabled=false;isGen=false;updateStats();renderSceneNav();notify('Generated! ~'+Math.round(full.split(/\s+/).length/185)+' pages');});}
async function wScene(idx){syncS();const sc=S.scenes[idx];if(!sc||isGen)return;isGen=true;go(3);setMode('preview');show('sp4');document.getElementById('gsbtn').disabled=true;const cfg=PT[selectedType],cs=S.cast.map(c=>`${c.name}: ${c.desc}`).join('\n')||'';const existing=S.script?S.script+'\n\n':'';const spc=document.getElementById('spContent');const cur=document.createElement('span');cur.className='gen-cursor';
const p=`Write one ${cfg.unitSingular.toLowerCase()}:\n${sc.loc} — ${sc.desc}\nTitle: ${S.title}\nCast: ${cs}\nTone: ${S.tone}`;
previewCost(cfg.scriptSys,p);
await stream(cfg.scriptSys,p,(c,full)=>{spc.innerHTML=parseSP(existing+full);spc.appendChild(cur);document.querySelector('.preview')?.scrollTo(0,999999);},(full)=>{S.script=existing+full;renderSP();hide('sp4');document.getElementById('gsbtn').disabled=false;isGen=false;updateStats();renderSceneNav();notify(cfg.unitSingular+' written!');});}
async function appendScene(idx){await wScene(idx);}
function clearSc(){if(S.script&&!confirm('Clear the entire script?'))return;S.script='';renderSP();const e=document.getElementById('spEditor');if(e)e.value='';updateStats();renderSceneNav();}

// ── POLISH ──
function selPol(btn,t){document.querySelectorAll('.pc').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel');polType=t;document.getElementById('polbtn').disabled=false;}
async function runPol(){if(!polType)return;syncS();show('sp5');document.getElementById('polbtn').disabled=true;const po=document.getElementById('polOut'),ba=document.getElementById('polBefore'),af=document.getElementById('polAfter');po.style.display='block';const sample=(S.script||'No script yet.').substring(0,2500);ba.textContent=sample;af.value='';
const inst={dialogue:'Rewrite dialogue to be more distinctive and subtext-rich.',action:'Tighten action lines: leaner, present tense.',pacing:'Improve pacing: cut unnecessary beats.',tension:'Raise dramatic stakes: more conflict.',format:`Correct formatting to professional ${PT[selectedType]?.name} standard.`,director:'Add [DIRECTOR\'S NOTE:] after key scenes.'};
const sys='You are a senior script doctor.';const p=`${inst[polType]}\n\nSCRIPT:\n${sample}`;
previewCost(sys,p);
await stream(sys,p,(c,full)=>{af.value=full;},()=>{hide('sp5');document.getElementById('polbtn').disabled=false;});}
function acceptPolish(){const af=document.getElementById('polAfter'),p=af?.value;if(!p){notify('Run a polish tool first.');return;}if(confirm('Replace script with polished version?')){S.script=p;renderSP();updateStats();const e=document.getElementById('spEditor');if(e)e.value=p;notify('Accepted!');go(3);}}

// ── EXPORT / UTILS ──
function copyScript(){navigator.clipboard.writeText(S.script||'No script yet.').then(()=>notify('Copied!'));}
function show(el){const e=document.getElementById(el);if(e)e.style.display='inline-block';}
function hide(el){const e=document.getElementById(el);if(e)e.style.display='none';}
function notify(msg){const n=document.getElementById('notif');if(!n)return;n.textContent=msg;n.classList.add('on');setTimeout(()=>n.classList.remove('on'),2800);}
function setDot(elId,anim){const d=document.getElementById(elId);if(d)d.classList.toggle('anim',anim);}

// ══════════════════════════════════════
//  ERROR BANNER
// ══════════════════════════════════════
function showErr(msg,retryFn){
  const b=document.getElementById('errBanner'),m=document.getElementById('errMsg'),r=document.getElementById('errRetry'),c=document.getElementById('errClose');
  if(!b)return;
  m.textContent=msg||'Something went wrong.';
  if(retryFn){r.style.display='';r.onclick=()=>{hideErr();retryFn();};}else{r.style.display='none';}
  c.onclick=hideErr;b.hidden=false;
}
function hideErr(){const b=document.getElementById('errBanner');if(b)b.hidden=true;}

// ══════════════════════════════════════
//  DRAFT PERSISTENCE (multi-draft, Firestore + localStorage cache)
// ══════════════════════════════════════
const LS_KEY='scenecraft.cache.v2';      // active draft cache (anon offline use)
const ONBOARD_KEY='scenecraft.onboarded.v1';
let currentDraftId=null;
let saveT=0,lastDraftSerialized='',hasUnsavedChanges=false;

function emptyS(){return{title:'',logline:'',setting:'',themes:'',protagonist:'',conflict:'',tone:'',extra:{},cast:[],scenes:[],script:''};}
function draftPayload(){return{title:S.title||'Untitled',selectedType,selectedFmt,S};}

function saveDraft(){
  const p=draftPayload();
  let json;try{json=JSON.stringify(p);}catch{return;}
  if(json===lastDraftSerialized)return;
  lastDraftSerialized=json;
  hasUnsavedChanges=true;
  try{localStorage.setItem(LS_KEY,JSON.stringify({...p,id:currentDraftId,savedAt:Date.now()}));}catch{}
  clearTimeout(saveT);
  saveT=setTimeout(async()=>{
    if(window.SC?.getCurrentUser()&&window.SC.drafts){
      try{
        if(!currentDraftId){
          currentDraftId=await window.SC.drafts.create(p);
          await window.SC.drafts.setActive(currentDraftId);
        }else{
          await window.SC.drafts.save(currentDraftId,p);
        }
        hasUnsavedChanges=false;
      }catch{/* keep dirty so we retry on next change */}
    }else{
      hasUnsavedChanges=false; // local cache is synchronous, no pending I/O
    }
  },700);
}
function loadLocalCache(){try{return JSON.parse(localStorage.getItem(LS_KEY)||'null');}catch{return null;}}
function clearLocalCache(){try{localStorage.removeItem(LS_KEY);}catch{}}

function applyDraftIntoUI(d){
  selectedType=d.selectedType;selectedFmt=d.selectedFmt||null;
  S=Object.assign(emptyS(),d.S||{});
  buildApp();
  document.getElementById('scr-select').classList.remove('on');
  document.getElementById('scr-app').classList.add('on');
  setVal('s-title',S.title);setVal('s-logline',S.logline);setVal('s-set',S.setting);setVal('s-themes',S.themes);setVal('s-proto',S.protagonist);setVal('s-conf',S.conflict);
  if(S.tone){const t=document.getElementById('s-tone');if(t)t.value=S.tone;}
  const cfg=PT[selectedType];
  cfg.extraFields.forEach(f=>{if(S.extra&&S.extra[f.id]!=null)setVal('ef-'+f.id,S.extra[f.id]);});
  renderCast();renderSceneList();renderSP();renderSceneNav();updateStats();
  // updateStats triggers saveDraft; reset its serialized so we don't re-save the same payload immediately.
  lastDraftSerialized=JSON.stringify(draftPayload());
  hasUnsavedChanges=false;
}
function setVal(id,v){const e=document.getElementById(id);if(e)e.value=v||'';}

// ══════════════════════════════════════
//  PROJECT PICKER
// ══════════════════════════════════════
async function refreshDraftsList(){
  const sec=document.getElementById('draftsSection');
  const grid=document.getElementById('draftsGrid');
  if(!sec||!grid)return;
  if(!window.SC?.getCurrentUser()){sec.hidden=true;return;}
  let drafts=[];
  try{drafts=await window.SC.drafts.list();}catch{drafts=[];}
  if(!drafts.length){sec.hidden=true;return;}
  sec.hidden=false;
  grid.innerHTML=drafts.map(d=>{
    const ico=PT[d.selectedType]?.ico||'📄';
    const typeName=PT[d.selectedType]?.name||'Project';
    const ts=d.updatedAt?.toMillis?d.updatedAt.toMillis():d.updatedAt?.seconds?d.updatedAt.seconds*1000:Date.now();
    return `<button class="draft-card" type="button" onclick="openDraft('${esc(d.id)}')">
      <div class="draft-card-actions">
        <span class="draft-card-act" onclick="event.stopPropagation();renameDraftCmd('${esc(d.id)}','${esc(d.title||'Untitled')}')" title="Rename">✏</span>
        <span class="draft-card-act danger" onclick="event.stopPropagation();deleteDraftCmd('${esc(d.id)}','${esc(d.title||'Untitled')}')" title="Delete">✕</span>
      </div>
      <div class="draft-card-top"><span class="draft-card-ico">${ico}</span><span class="draft-card-type">${esc(typeName)}${d.selectedFmt?' · '+esc(d.selectedFmt):''}</span></div>
      <div class="draft-card-ttl">${esc(d.title||'Untitled')}</div>
      <div class="draft-card-meta"><span>${relativeTime(ts)}</span><span>${d.S?.script?.length?Math.round(d.S.script.split(/\s+/).length/185)+'pp':''}</span></div>
    </button>`;
  }).join('');
}
function relativeTime(ts){
  if(!ts)return '';
  const diff=Date.now()-ts;
  if(diff<60000)return 'just now';
  if(diff<3600000)return Math.floor(diff/60000)+'m ago';
  if(diff<86400000)return Math.floor(diff/3600000)+'h ago';
  if(diff<604800000)return Math.floor(diff/86400000)+'d ago';
  const d=new Date(ts);return d.toLocaleDateString();
}
async function openDraft(id){
  if(!window.SC?.drafts)return;
  try{
    const d=await window.SC.drafts.get(id);
    if(!d){notify('Draft not found.');return;}
    currentDraftId=id;
    await window.SC.drafts.setActive(id);
    applyDraftIntoUI(d);
  }catch(e){showErr('Could not load draft: '+e.message);}
}
function newProject(){
  if(!confirmIfDirty())return;
  currentDraftId=null;
  selectedType=null;selectedFmt=null;
  S=emptyS();
  lastDraftSerialized='';hasUnsavedChanges=false;
  document.getElementById('scr-app').classList.remove('on');
  document.getElementById('scr-select').classList.add('on');
  document.querySelectorAll('.ptcard').forEach(c=>{c.classList.remove('sel');c.setAttribute('aria-pressed','false');});
  const row=document.getElementById('fmtRow');if(row){row.style.display='none';row.querySelectorAll('.fpill').forEach(p=>p.remove());}
  const cta=document.getElementById('ctaBtn');cta.classList.remove('ready');cta.setAttribute('aria-disabled','true');
  document.getElementById('ctaIco').textContent='✦';
  document.getElementById('ctaHint').textContent='Select a project type above to begin';
  refreshDraftsList();
}
async function renameDraftCmd(id,currentTitle){
  const t=prompt('Rename project:',currentTitle);
  if(!t||t.trim()===currentTitle)return;
  try{await window.SC.drafts.rename(id,t.trim());notify('Renamed');refreshDraftsList();}
  catch(e){showErr('Could not rename: '+e.message);}
}
async function deleteDraftCmd(id,title){
  if(!confirm(`Delete "${title}"? This cannot be undone.`))return;
  try{
    await window.SC.drafts.delete(id);
    if(currentDraftId===id){currentDraftId=null;clearLocalCache();}
    notify('Deleted');refreshDraftsList();
  }catch(e){showErr('Could not delete: '+e.message);}
}

// ══════════════════════════════════════
//  RESTORE-DRAFT TOAST (anon users with local cache only)
// ══════════════════════════════════════
let pendingDraft=null;
function checkForLocalDraft(){
  if(window.SC?.getCurrentUser())return; // signed-in users see the picker instead
  const local=loadLocalCache();
  if(!local||!local.selectedType)return;
  pendingDraft=local;
  const t=document.getElementById('restoreToast'),m=document.getElementById('restoreMsg');
  if(!t)return;
  if(m)m.textContent='Restore your last draft (this device)?';
  t.hidden=false;
}
function dismissRestore(){
  const t=document.getElementById('restoreToast');if(t)t.hidden=true;
  pendingDraft=null;clearLocalCache();lastDraftSerialized='';
}
function restoreDraft(){
  if(!pendingDraft)return;
  const d=pendingDraft;pendingDraft=null;
  document.getElementById('restoreToast').hidden=true;
  applyDraftIntoUI(d);
  notify('Draft restored');
}
function confirmIfDirty(){
  if(!hasUnsavedChanges)return true;
  return confirm('You have unsaved changes that may not be synced yet. Continue?');
}

// ══════════════════════════════════════
//  AUTH MODAL
// ══════════════════════════════════════
let authMode='signin';
function openAuth(reason){
  if(!window.SC?.configured){
    showErr('Firebase is not configured yet. Edit firebase-config.js with your project values, then redeploy.');
    return;
  }
  const o=document.getElementById('authOverlay');
  const sub=document.getElementById('authSub');
  if(reason&&sub)sub.textContent=reason;
  hideAuthErr();
  if(o)o.hidden=false;
  setTimeout(()=>document.getElementById('authEmail')?.focus(),50);
}
function closeAuth(e){
  if(e&&e.target&&e.target!==e.currentTarget)return;
  const o=document.getElementById('authOverlay');if(o)o.hidden=true;
}
function setAuthMode(m){
  authMode=m;
  document.getElementById('authTabIn').classList.toggle('on',m==='signin');
  document.getElementById('authTabUp').classList.toggle('on',m==='signup');
  document.getElementById('authSubmit').textContent=m==='signin'?'Sign in':'Create account';
  document.getElementById('authPwd').autocomplete=m==='signin'?'current-password':'new-password';
  hideAuthErr();
}
function showAuthErr(msg){const e=document.getElementById('authErr');if(!e)return;e.textContent=msg;e.hidden=false;}
function hideAuthErr(){const e=document.getElementById('authErr');if(e)e.hidden=true;}
function humanizeAuthError(e){
  const c=e?.code||'';const m=e?.message||String(e);
  if(c.includes('user-not-found'))return 'No account with that email. Switch to "Create account" to sign up.';
  if(c.includes('wrong-password')||c.includes('invalid-credential'))return 'Wrong email or password.';
  if(c.includes('email-already-in-use'))return 'An account with that email already exists. Switch to "Sign in".';
  if(c.includes('weak-password'))return 'Password is too weak (minimum 6 characters).';
  if(c.includes('invalid-email'))return 'That email address looks invalid.';
  if(c.includes('popup-closed-by-user'))return 'Sign-in window was closed before completing.';
  if(c.includes('popup-blocked'))return 'Pop-up blocked. Allow pop-ups for this site and try again.';
  if(c.includes('network-request-failed'))return 'Network error. Check your connection and try again.';
  return m.replace(/^Firebase:\s*/,'').replace(/\s*\(auth\/[^)]+\)\.?$/,'');
}
async function doGoogleSignIn(){
  hideAuthErr();
  try{await window.SC.signInGoogle();closeAuth();notify('Welcome!');}
  catch(e){showAuthErr(humanizeAuthError(e));}
}
async function doEmailAuth(ev){
  if(ev)ev.preventDefault();
  hideAuthErr();
  const email=document.getElementById('authEmail').value.trim();
  const pwd=document.getElementById('authPwd').value;
  if(!email||!pwd)return;
  const btn=document.getElementById('authSubmit');btn.disabled=true;
  try{
    if(authMode==='signin')await window.SC.signInEmail(email,pwd);
    else await window.SC.signUpEmail(email,pwd);
    closeAuth();notify(authMode==='signup'?'Account created':'Welcome back!');
  }catch(e){showAuthErr(humanizeAuthError(e));}
  finally{btn.disabled=false;}
}
async function doResetPassword(){
  const email=document.getElementById('authEmail').value.trim();
  if(!email){showAuthErr('Enter your email above first, then click Forgot password.');return;}
  try{await window.SC.resetPassword(email);showAuthErr('Reset email sent. Check your inbox.');}
  catch(e){showAuthErr(humanizeAuthError(e));}
}

// ══════════════════════════════════════
//  USER PILL + QUOTA
// ══════════════════════════════════════
function onUserPillClick(){
  if(!window.SC?.getCurrentUser()){openAuth();return;}
  toggleUserMenu();
}
function toggleUserMenu(){
  let m=document.getElementById('userMenu');
  if(m){m.remove();return;}
  const u=window.SC.getCurrentUser();if(!u)return;
  const pill=document.getElementById('userPill');const r=pill.getBoundingClientRect();
  m=document.createElement('div');m.id='userMenu';m.className='user-menu';
  m.style.top=(r.bottom+6)+'px';
  m.style.right=(window.innerWidth-r.right)+'px';
  const q=window.SC.getQuota?.();
  const qStr=q?`Tokens: <b>${q.used.toLocaleString()}</b> / ${q.quota.toLocaleString()}`:'Tokens: <i>loading…</i>';
  m.innerHTML=`<div class="user-menu-head"><div>${esc(u.displayName||u.email||'Account')}</div><div class="um-email">${esc(u.email||'')}</div><div class="um-email" style="margin-top:6px;">${qStr}</div></div>
    <button class="user-menu-item" type="button" onclick="document.getElementById('userMenu')?.remove();goSelect();">Project picker</button>
    <button class="user-menu-item danger" type="button" onclick="doSignOut()">Sign out</button>`;
  document.body.appendChild(m);
  setTimeout(()=>document.addEventListener('click',closeUserMenuOnce,{once:true}),0);
}
function closeUserMenuOnce(){const m=document.getElementById('userMenu');if(m)m.remove();}
async function doSignOut(){
  closeUserMenuOnce();
  try{await window.SC.signOut();notify('Signed out');}catch{notify('Sign out failed');}
}
function updateAuthUI(user,quota){
  const pills=[
    {pill:document.getElementById('userPill'),av:document.getElementById('userAvatar'),lab:document.getElementById('userLabel')},
    {pill:document.getElementById('userPillSel'),av:document.getElementById('userAvatarSel'),lab:document.getElementById('userLabelSel')},
  ];
  const q=document.getElementById('hdQuota');
  for(const {pill,av,lab} of pills){
    if(!pill)continue;
    if(user){
      pill.classList.add('signed-in');
      if(user.photoURL){av.style.backgroundImage=`url('${user.photoURL}')`;av.style.backgroundSize='cover';av.style.backgroundPosition='center';av.textContent='';}
      else{av.style.backgroundImage='';av.textContent=((user.displayName||user.email||'?').trim()[0]||'?');}
      lab.textContent=user.displayName||user.email||'Account';
    }else{
      pill.classList.remove('signed-in');
      av.style.backgroundImage='';av.textContent='?';
      lab.textContent='Sign in';
    }
  }
  if(q){
    if(user&&quota){
      const pct=quota.quota?Math.round((quota.used/quota.quota)*100):0;
      q.innerHTML=`<b>${pct}%</b> used`;
      q.classList.toggle('warn',pct>=85);
      q.hidden=false;
      q.title=`${quota.used.toLocaleString()} / ${quota.quota.toLocaleString()} tokens this month`;
    }else{q.hidden=true;}
  }
}

// ══════════════════════════════════════
//  EXPORT MENU (TXT, PDF, FDX)
// ══════════════════════════════════════
function doExport(){
  if(!S.script){notify('Generate a script first!');return;}
  const m=document.getElementById('exportMenu');
  if(m){m.remove();return;}
  const anchor=document.querySelector('.xbtn');
  const r=anchor?.getBoundingClientRect()||{bottom:60,right:window.innerWidth-20};
  const menu=document.createElement('div');
  menu.id='exportMenu';menu.className='user-menu';
  menu.style.top=(r.bottom+6)+'px';
  menu.style.right=(window.innerWidth-r.right)+'px';
  menu.innerHTML=`
    <button class="user-menu-item" type="button" onclick="exportTxt()">Plain text (.txt)</button>
    <button class="user-menu-item" type="button" onclick="exportPdf()">PDF — print dialog</button>
    <button class="user-menu-item" type="button" onclick="exportFdx()">Final Draft (.fdx)</button>`;
  document.body.appendChild(menu);
  setTimeout(()=>document.addEventListener('click',closeExportMenuOnce,{once:true}),0);
}
function closeExportMenuOnce(){const m=document.getElementById('exportMenu');if(m)m.remove();}
function safeFilename(){return(S.title||'script').replace(/[^a-z0-9-]+/gi,'-').toLowerCase().replace(/^-|-$/g,'')||'script';}
function exportTxt(){
  closeExportMenuOnce();
  const blob=new Blob([S.script],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=safeFilename()+'.txt';a.click();
  URL.revokeObjectURL(a.href);notify('Exported .txt');
}
function exportPdf(){
  closeExportMenuOnce();
  // Make sure preview is visible (print CSS hides everything except .sppage)
  setMode('preview');
  setTimeout(()=>{window.print();notify('Print dialog opened — choose "Save as PDF".');},80);
}
function exportFdx(){
  closeExportMenuOnce();
  const xml=buildFdx(S.script,S.title||'Untitled');
  const blob=new Blob([xml],{type:'application/xml;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=safeFilename()+'.fdx';a.click();
  URL.revokeObjectURL(a.href);notify('Exported .fdx');
}
function buildFdx(script,title){
  // Minimal Final Draft 8+ XML. Each line classified using the same heuristics as parseSP.
  const lines=(script||'').split('\n');
  const paras=[];
  let inDial=false;
  for(const t of lines){
    const tr=t.trim();
    if(!tr){inDial=false;continue;}
    let type='Action';
    if(/^(FADE IN:|FADE OUT\.|FADE TO BLACK\.|CUT TO:|THE END|ACT ONE|ACT TWO|ACT THREE|END OF ACT|TAG:)$/.test(tr)){type='Transition';inDial=false;}
    else if(/^(INT\.|EXT\.|I\/E\.|B-ROLL:|SCENE\s\d|SEGMENT\s\d|SHOT\s\d|SOUND:|MUSIC:)/.test(tr)){type='Scene Heading';inDial=false;}
    else if(tr.startsWith('(')&&tr.endsWith(')')&&inDial){type='Parenthetical';}
    else if(/^[A-Z][A-Z\s'\-()\.V]+$/.test(tr)&&tr.length<45&&!tr.endsWith('TO:')&&tr.split(' ').length<=6){type='Character';inDial=true;}
    else if(inDial){type='Dialogue';}
    else{type='Action';inDial=false;}
    paras.push(`    <Paragraph Type="${type}"><Text>${esc(tr)}</Text></Paragraph>`);
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<FinalDraft DocumentType="Script" Template="No" Version="1">
  <Content>
${paras.join('\n')}
  </Content>
  <TitlePage>
    <Content>
      <Paragraph Alignment="Center"><Text>${esc(title)}</Text></Paragraph>
      <Paragraph Alignment="Center"><Text>by SceneCraft Studio</Text></Paragraph>
    </Content>
  </TitlePage>
</FinalDraft>`;
}

// ══════════════════════════════════════
//  EMAIL VERIFICATION BANNER
// ══════════════════════════════════════
function updateVerifyBanner(user){
  let b=document.getElementById('verifyBanner');
  const needs=user&&user.email&&!user.emailVerified&&user.providerData?.some(p=>p.providerId==='password');
  if(!needs){if(b)b.remove();return;}
  if(b)return; // already shown
  b=document.createElement('div');b.id='verifyBanner';b.className='verify-banner';b.setAttribute('role','status');
  b.innerHTML=`<span>Please verify <b>${esc(user.email)}</b> to use AI generation. Check your inbox.</span>
    <button type="button" onclick="resendVerify()">Resend</button>
    <button type="button" onclick="checkedVerify()">I verified</button>
    <button class="verify-x" type="button" aria-label="Dismiss" onclick="this.parentElement.remove()">✕</button>`;
  document.body.appendChild(b);
}
async function resendVerify(){
  try{await window.SC.resendVerification();notify('Verification email sent');}
  catch(e){showErr(e.message||'Could not resend.');}
}
async function checkedVerify(){
  try{
    await window.SC.reloadUser();
    const u=window.SC.getCurrentUser();
    if(u?.emailVerified){notify('Verified!');document.getElementById('verifyBanner')?.remove();}
    else notify('Still not verified — check your inbox and click the link.');
  }catch{}
}

// ══════════════════════════════════════
//  TOKEN COST PREVIEW
// ══════════════════════════════════════
function estimateTokens(s){return Math.ceil((String(s||'').length)/3.7);} // rough char→token
function previewCost(sys,user){
  const t=estimateTokens(sys)+estimateTokens(user)+200; // +200 for response setup
  notify(`Generating · ~${t.toLocaleString()} tokens (est.)`);
}

// ══════════════════════════════════════
//  ONBOARDING TOUR
// ══════════════════════════════════════
function maybeStartOnboarding(){
  try{if(localStorage.getItem(ONBOARD_KEY))return;}catch{return;}
  // Wait until project select screen is the visible one and grid is rendered.
  if(!document.getElementById('scr-select')?.classList.contains('on'))return;
  startOnboarding();
}
function startOnboarding(){
  const steps=[
    {sel:'.ptcard',msg:'1. Pick a project type. The studio tailors every tool to your format.',pos:'bottom'},
    {sel:'#fmtRow,#ctaBtn',msg:'2. Choose a sub-format and start writing.',pos:'top'},
    {sel:'#userPillSel',msg:'3. Sign in to save drafts and unlock AI generation.',pos:'bottom'},
  ];
  showOnboardStep(steps,0);
}
function showOnboardStep(steps,i){
  const old=document.getElementById('coachmark');if(old)old.remove();
  if(i>=steps.length){try{localStorage.setItem(ONBOARD_KEY,'1');}catch{}return;}
  const s=steps[i];
  const target=document.querySelector(s.sel);
  if(!target){showOnboardStep(steps,i+1);return;}
  const r=target.getBoundingClientRect();
  const cm=document.createElement('div');cm.id='coachmark';cm.className='coachmark';
  cm.innerHTML=`<div class="coachmark-msg">${esc(s.msg)}</div>
    <div class="coachmark-row"><span class="coachmark-step">${i+1} / ${steps.length}</span>
      <button class="coachmark-skip" type="button" onclick="endOnboarding()">Skip</button>
      <button class="coachmark-next" type="button" id="coachNext">${i===steps.length-1?'Done':'Next'}</button></div>`;
  document.body.appendChild(cm);
  const cmr=cm.getBoundingClientRect();
  let top=s.pos==='top'?r.top-cmr.height-12:r.bottom+12;
  let left=Math.min(window.innerWidth-cmr.width-12,Math.max(12,r.left+r.width/2-cmr.width/2));
  if(top<12)top=r.bottom+12;
  if(top+cmr.height>window.innerHeight-12)top=Math.max(12,r.top-cmr.height-12);
  cm.style.top=top+'px';cm.style.left=left+'px';
  document.getElementById('coachNext').onclick=()=>showOnboardStep(steps,i+1);
}
function endOnboarding(){
  document.getElementById('coachmark')?.remove();
  try{localStorage.setItem(ONBOARD_KEY,'1');}catch{}
}

// ══════════════════════════════════════
//  BEFOREUNLOAD GUARD
// ══════════════════════════════════════
window.addEventListener('beforeunload',(e)=>{
  if(isGen||hasUnsavedChanges){
    e.preventDefault();
    e.returnValue='';
    return '';
  }
});

// ══════════════════════════════════════
//  PWA — register service worker
// ══════════════════════════════════════
if('serviceWorker' in navigator&&location.protocol!=='file:'){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/service-worker.js').catch(()=>{/* SW is optional */});
  });
}

// ══════════════════════════════════════
//  INIT
// ══════════════════════════════════════
async function bootstrap(){
  if(window.SC?.onAuth){
    let firstAuth=true;
    window.SC.onAuth(async(user,quota)=>{
      updateAuthUI(user,quota);
      updateVerifyBanner(user);
      refreshDraftsList(); // hides itself if signed out
      if(firstAuth){
        firstAuth=false;
        if(user){
          try{
            const activeId=await window.SC.drafts.getActive();
            if(activeId){
              const d=await window.SC.drafts.get(activeId);
              if(d){currentDraftId=activeId;applyDraftIntoUI(d);return;}
            }
          }catch{}
        }
        checkForLocalDraft();
        maybeStartOnboarding();
      }
    });
  }else{
    checkForLocalDraft();
    maybeStartOnboarding();
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap);
else bootstrap();
