// Simple offline PhotoSet Pro app script (no framework)
const PRESETS_ES = {
  "Retrato humano": { modo:"M", apertura:"f/2.8 – f/4", velocidad:"1/125 – 1/250 s", iso:"100–400", wb:"5200–5600 K", af:"AF-S / Flexible Spot", estilo:"Neutral", lente:"50mm f/1.8", consejos:"Luz lateral o ventana, Eye AF ON, fondo desenfocado" },
  "Paisaje": { modo:"M", apertura:"f/8 – f/11", velocidad:"1/125 – 1/250 s", iso:"100", wb:"5200–5600 K", af:"MF / Infinity", estilo:"Neutral o Vivid", lente:"16–50mm, polarizador", consejos:"Trípode, filtro polarizador para cielos y vegetación" },
  "Arquitectura": { modo:"M", apertura:"f/8 – f/16", velocidad:"1/125 – 1/250 s", iso:"100", wb:"5200–5600 K", af:"AF-S / Wide", estilo:"Clear", lente:"16–35mm gran angular", consejos:"Nivelar cámara, líneas rectas, evita distorsión" },
  "Amanecer / Atardecer": { modo:"M", apertura:"f/5.6 – f/11", velocidad:"1/60 – 1/125 s", iso:"100–200", wb:"5600–6000 K", af:"AF-S / Flexible Spot", estilo:"Vivid", lente:"16–50mm, polarizador opcional", consejos:"Trípode, capturar reflejos, calidez extra" },
  "Noche urbana / ciudad": { modo:"M", apertura:"f/2.8 – f/5.6", velocidad:"1/10 – 1/60 s", iso:"400–800", wb:"3200–4000 K", af:"MF / Peaking", estilo:"Neutral", lente:"16–50mm", consejos:"Trípode, balance WB frío, luz de farolas para contraste" },
  "Luna llena / nocturno": { modo:"M", apertura:"f/5.6 – f/8", velocidad:"1/125 – 1/250 s", iso:"100", wb:"5200–5600 K", af:"MF / Peaking", estilo:"Neutral", lente:"55–210mm", consejos:"Zoom teleobjetivo, trípode, exposiciones múltiples para luna + paisaje" },
  "Aves volando / animales mov.": { modo:"M", apertura:"f/5.6 – f/8", velocidad:"1/500 – 1/2000 s", iso:"400", wb:"5200 K", af:"AF-C / Tracking", estilo:"Neutral", lente:"70–200mm", consejos:"Congelar movimiento, ráfaga continua, enfoque en ojo" },
  "Lagos / ríos / cascadas": { modo:"M", apertura:"f/8 – f/16", velocidad:"0.5 – 2 s", iso:"100", wb:"5200 K", af:"MF / Infinity", estilo:"Vivid", lente:"16–50mm, ND", consejos:"Trípode, filtro ND para efecto seda en agua, enfoque al primer plano" }
};

const PRESETS_EN = {} // for future (kept simple for now)

const scenes = Object.keys(PRESETS_ES);
const grid = document.getElementById('sceneGrid');
const card = document.getElementById('card');
const cardTitle = document.getElementById('cardTitle');
const cardBody = document.getElementById('cardBody');
const closeBtn = document.getElementById('closeBtn');
const copyBtn = document.getElementById('copyBtn');
const favBtn = document.getElementById('favBtn');
const exportBtn = document.getElementById('exportBtn');
const langBtn = document.getElementById('langBtn');
const tutorial = document.getElementById('tutorial');
const tutorialOk = document.getElementById('tutorialOk');

let current = scenes[0];
let lang = localStorage.getItem('psp_lang') || 'es';
let favorites = JSON.parse(localStorage.getItem('psp_favs')||'[]');

function renderGrid(){
  grid.innerHTML = '';
  scenes.forEach(s=>{
    const btn = document.createElement('div');
    btn.className='scene-btn';
    btn.innerHTML = `<div class="scene-icon">📷</div><div class="scene-label">${s}</div>`;
    btn.onclick = ()=>openCard(s);
    grid.appendChild(btn);
  });
}

function openCard(s){
  current = s;
  cardTitle.textContent = s;
  cardBody.innerHTML='';
  const p = PRESETS_ES[s];
  for(const k of ['modo','apertura','velocidad','iso','wb','af','estilo','lente','consejos']){
    const node = document.createElement('div');
    node.className='preset-item';
    node.innerHTML = `<div class="k">${k.toUpperCase()}</div><div class="v">${p[k] || ''}</div>`;
    cardBody.appendChild(node);
  }
  card.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

closeBtn.onclick = ()=>{ card.classList.add('hidden'); }
copyBtn.onclick = ()=>{
  const p = PRESETS_ES[current];
  const text = `Escena: ${current}\nModo: ${p.modo}\nApertura: ${p.apertura}\nVelocidad: ${p.velocidad}\nISO: ${p.iso}\nWB: ${p.wb}\nAF: ${p.af}\nLente: ${p.lente}\nConsejos: ${p.consejos}`;
  navigator.clipboard.writeText(text).then(()=>alert('Copiado al portapapeles'));
};
favBtn.onclick = ()=>{
  favorites.unshift({name:current, preset:PRESETS_ES[current]}); localStorage.setItem('psp_favs',JSON.stringify(favorites)); alert('Guardado en Favoritos');
};
exportBtn.onclick = ()=>{
  const p = PRESETS_ES[current];
  const blob = new Blob([`Escena: ${current}\n`+Object.keys(p).map(k=>`${k}: ${p[k]}`).join('\n')],{type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`${current}.txt`; a.click(); URL.revokeObjectURL(url);
};

langBtn.onclick = ()=>{ lang = (lang==='es'?'en':'es'); localStorage.setItem('psp_lang', lang); alert('Idioma cambiado (solo interfaz): '+lang); }

tutorialOk.onclick = ()=>{ tutorial.classList.add('hidden'); localStorage.setItem('psp_seen_tutorial','1'); }

if(!localStorage.getItem('psp_seen_tutorial')){ tutorial.classList.remove('hidden'); }

renderGrid();

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').then(()=>console.log('SW registered')).catch(()=>{}); }
