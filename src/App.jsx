import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════════════
// DATA & CONSTANTS
// ══════════════════════════════════════════════════════════════

const ALL_MUSCLES = [
  "Bryst","Rygg","Skuldre","Biceps","Triceps",
  "Mage","Quadriceps","Hamstrings","Rumpe","Legger",
];

const MUSCLE_EMOJI = {
  Bryst:"🫁",Rygg:"🔙",Skuldre:"🏔️",Biceps:"💪",Triceps:"🦾",
  Mage:"🎯",Quadriceps:"🦵",Hamstrings:"🦿",Rumpe:"🍑",Legger:"🦶",
};

const EQUIPMENT_TYPES = ["Kroppsvekt","Manualer","Vektstang","Maskin","Kabel","Kettlebell","Strikk"];

const EXERCISES = [
  {id:"ex01",name:"Benkpress",primary:["Bryst"],secondary:["Triceps","Skuldre"],equipment:"Vektstang",desc:"Ligg på benk, press stangen opp fra brystet"},
  {id:"ex02",name:"Skråbenkpress",primary:["Bryst"],secondary:["Skuldre","Triceps"],equipment:"Manualer",desc:"Benkpress i skrå vinkel for øvre bryst"},
  {id:"ex03",name:"Push-ups",primary:["Bryst"],secondary:["Triceps","Skuldre","Mage"],equipment:"Kroppsvekt",desc:"Klassisk armheving fra gulvet"},
  {id:"ex04",name:"Kabelflyes",primary:["Bryst"],secondary:["Skuldre"],equipment:"Kabel",desc:"Stå mellom to kabelstasjoner, før armene sammen"},
  {id:"ex05",name:"Brystpress maskin",primary:["Bryst"],secondary:["Triceps"],equipment:"Maskin",desc:"Sitt i maskin, press fremover"},
  {id:"ex06",name:"Dips",primary:["Bryst"],secondary:["Triceps","Skuldre"],equipment:"Kroppsvekt",desc:"Senk kroppen mellom to barer"},
  {id:"ex07",name:"Markløft",primary:["Rygg","Hamstrings"],secondary:["Rumpe","Mage"],equipment:"Vektstang",desc:"Løft stangen fra gulvet med rak rygg"},
  {id:"ex08",name:"Pull-ups",primary:["Rygg"],secondary:["Biceps","Skuldre"],equipment:"Kroppsvekt",desc:"Heng i stang, dra deg opp"},
  {id:"ex09",name:"Nedtrekk",primary:["Rygg"],secondary:["Biceps"],equipment:"Kabel",desc:"Sitt ved kabelmaskin, trekk stangen ned til brystet"},
  {id:"ex10",name:"Roing med manualer",primary:["Rygg"],secondary:["Biceps","Skuldre"],equipment:"Manualer",desc:"Bøyd over, dra manualen opp mot hoften"},
  {id:"ex11",name:"Sittende roing",primary:["Rygg"],secondary:["Biceps"],equipment:"Kabel",desc:"Sitt ved kabelmaskin, ro mot magen"},
  {id:"ex12",name:"Bøyd over roing",primary:["Rygg"],secondary:["Biceps","Mage"],equipment:"Vektstang",desc:"Bøy deg fremover, ro stangen mot magen"},
  {id:"ex13",name:"Skulderpress",primary:["Skuldre"],secondary:["Triceps"],equipment:"Manualer",desc:"Press manualene over hodet"},
  {id:"ex14",name:"Sidehev",primary:["Skuldre"],secondary:[],equipment:"Manualer",desc:"Løft manualene ut til siden"},
  {id:"ex15",name:"Fronthev",primary:["Skuldre"],secondary:[],equipment:"Manualer",desc:"Løft manualene foran deg"},
  {id:"ex16",name:"Face pulls",primary:["Skuldre","Rygg"],secondary:[],equipment:"Kabel",desc:"Trekk kabel mot ansiktet med utoverrotasjon"},
  {id:"ex17",name:"Arnold press",primary:["Skuldre"],secondary:["Triceps"],equipment:"Manualer",desc:"Skulderpress med rotasjon"},
  {id:"ex18",name:"Militærpress",primary:["Skuldre"],secondary:["Triceps","Mage"],equipment:"Vektstang",desc:"Stående skulderpress med vektstang"},
  {id:"ex19",name:"Bicepscurl",primary:["Biceps"],secondary:[],equipment:"Manualer",desc:"Stående curl med manualer"},
  {id:"ex20",name:"Hammercurl",primary:["Biceps"],secondary:[],equipment:"Manualer",desc:"Curl med nøytralt grep"},
  {id:"ex21",name:"Konsentrasjonscurl",primary:["Biceps"],secondary:[],equipment:"Manualer",desc:"Sittende curl med albuen mot låret"},
  {id:"ex22",name:"Kabelcurl",primary:["Biceps"],secondary:[],equipment:"Kabel",desc:"Curl i kabelmaskin"},
  {id:"ex23",name:"Vektstangcurl",primary:["Biceps"],secondary:[],equipment:"Vektstang",desc:"Stående curl med vektstang"},
  {id:"ex24",name:"Triceps pushdown",primary:["Triceps"],secondary:[],equipment:"Kabel",desc:"Trykk kabel ned med strake armer"},
  {id:"ex25",name:"Fransk press",primary:["Triceps"],secondary:[],equipment:"Manualer",desc:"Ligg på benk, bøy og strekk armene over hodet"},
  {id:"ex26",name:"Triceps kickback",primary:["Triceps"],secondary:[],equipment:"Manualer",desc:"Bøyd over, strekk armen bak"},
  {id:"ex27",name:"Diamant push-ups",primary:["Triceps"],secondary:["Bryst"],equipment:"Kroppsvekt",desc:"Push-ups med hendene tett sammen"},
  {id:"ex28",name:"Overhead tricepspress",primary:["Triceps"],secondary:[],equipment:"Manualer",desc:"Press manual over hodet med begge hender"},
  {id:"ex29",name:"Planke",primary:["Mage"],secondary:["Skuldre"],equipment:"Kroppsvekt",desc:"Hold kroppen rett i armstrekk"},
  {id:"ex30",name:"Crunches",primary:["Mage"],secondary:[],equipment:"Kroppsvekt",desc:"Ligg på rygg, løft skuldrene"},
  {id:"ex31",name:"Russian twist",primary:["Mage"],secondary:[],equipment:"Kroppsvekt",desc:"Sitt med bøyde knær, roter overkroppen"},
  {id:"ex32",name:"Hengende benhev",primary:["Mage"],secondary:[],equipment:"Kroppsvekt",desc:"Heng i stang, løft bena"},
  {id:"ex33",name:"Ab rollout",primary:["Mage"],secondary:["Skuldre"],equipment:"Kroppsvekt",desc:"Rull hjulet ut foran deg fra knærne"},
  {id:"ex34",name:"Kabelcrunches",primary:["Mage"],secondary:[],equipment:"Kabel",desc:"Knelende crunches med kabel"},
  {id:"ex35",name:"Knebøy",primary:["Quadriceps","Rumpe"],secondary:["Hamstrings","Mage"],equipment:"Vektstang",desc:"Klassisk knebøy med vektstang"},
  {id:"ex36",name:"Beinpress",primary:["Quadriceps"],secondary:["Rumpe","Hamstrings"],equipment:"Maskin",desc:"Press vekten i beinpressmaskin"},
  {id:"ex37",name:"Utfall",primary:["Quadriceps","Rumpe"],secondary:["Hamstrings"],equipment:"Manualer",desc:"Ta et langt steg frem og bøy"},
  {id:"ex38",name:"Beinekstensjon",primary:["Quadriceps"],secondary:[],equipment:"Maskin",desc:"Strekk bena i maskin"},
  {id:"ex39",name:"Goblet squat",primary:["Quadriceps","Rumpe"],secondary:["Mage"],equipment:"Kettlebell",desc:"Knebøy med kettlebell foran brystet"},
  {id:"ex40",name:"Bulgarske utfall",primary:["Quadriceps","Rumpe"],secondary:["Hamstrings"],equipment:"Manualer",desc:"Utfall med bakfoten på benk"},
  {id:"ex41",name:"Rumensk markløft",primary:["Hamstrings","Rumpe"],secondary:["Rygg"],equipment:"Vektstang",desc:"Markløft med lette knær og fokus på strekk"},
  {id:"ex42",name:"Leggcurl",primary:["Hamstrings"],secondary:[],equipment:"Maskin",desc:"Bøy bena i leggcurlmaskin"},
  {id:"ex43",name:"Nordic curl",primary:["Hamstrings"],secondary:[],equipment:"Kroppsvekt",desc:"Knelende, senk kroppen sakte fremover"},
  {id:"ex44",name:"Stivbent markløft",primary:["Hamstrings"],secondary:["Rygg","Rumpe"],equipment:"Manualer",desc:"Markløft med strake bein"},
  {id:"ex45",name:"Hip thrust",primary:["Rumpe"],secondary:["Hamstrings"],equipment:"Vektstang",desc:"Rygg mot benk, press hoften opp"},
  {id:"ex46",name:"Rumpeløft",primary:["Rumpe"],secondary:["Hamstrings"],equipment:"Kroppsvekt",desc:"Ligg på rygg, løft hoften opp"},
  {id:"ex47",name:"Kickbacks i kabel",primary:["Rumpe"],secondary:["Hamstrings"],equipment:"Kabel",desc:"Stå ved kabel, spark benet bak"},
  {id:"ex48",name:"Sumo knebøy",primary:["Rumpe","Quadriceps"],secondary:["Hamstrings"],equipment:"Manualer",desc:"Bred knebøy med tærne ut"},
  {id:"ex49",name:"Tåhev stående",primary:["Legger"],secondary:[],equipment:"Maskin",desc:"Stående, press deg opp på tærne"},
  {id:"ex50",name:"Tåhev sittende",primary:["Legger"],secondary:[],equipment:"Maskin",desc:"Sittende tåhev i maskin"},
  {id:"ex51",name:"Tåhev med kroppsvekt",primary:["Legger"],secondary:[],equipment:"Kroppsvekt",desc:"Stå på et trinn, press opp på tærne"},
];

const EX_MAP = {};
EXERCISES.forEach(e => { EX_MAP[e.id] = e; });

const DEFAULT_PROGRAMS = [
  {id:"prog-push",name:"Push Dag",emoji:"🫸",desc:"Bryst, skuldre og triceps.",level:"Nybegynner–Middels",category:"split",
    exercises:[{id:"ex01",sets:4,reps:"8-10",rest:90},{id:"ex02",sets:3,reps:"10-12",rest:75},{id:"ex13",sets:3,reps:"10",rest:75},{id:"ex14",sets:3,reps:"15",rest:45},{id:"ex24",sets:3,reps:"12",rest:45},{id:"ex25",sets:3,reps:"12",rest:45}]},
  {id:"prog-pull",name:"Pull Dag",emoji:"🫷",desc:"Rygg og biceps.",level:"Nybegynner–Middels",category:"split",
    exercises:[{id:"ex08",sets:4,reps:"6-8",rest:120},{id:"ex12",sets:4,reps:"8-10",rest:90},{id:"ex11",sets:3,reps:"12",rest:60},{id:"ex16",sets:3,reps:"15",rest:45},{id:"ex19",sets:3,reps:"12",rest:45},{id:"ex20",sets:3,reps:"12",rest:45}]},
  {id:"prog-legs",name:"Bein Dag",emoji:"🦵",desc:"Quad, hamstrings, rumpe og legger.",level:"Nybegynner–Middels",category:"split",
    exercises:[{id:"ex35",sets:4,reps:"8-10",rest:120},{id:"ex41",sets:3,reps:"10",rest:90},{id:"ex36",sets:3,reps:"12",rest:75},{id:"ex42",sets:3,reps:"12",rest:60},{id:"ex45",sets:3,reps:"12",rest:75},{id:"ex49",sets:4,reps:"15",rest:45}]},
  {id:"prog-upper",name:"Overkropp",emoji:"💪",desc:"Komplett overkroppsøkt.",level:"Middels",category:"upper-lower",
    exercises:[{id:"ex01",sets:4,reps:"8",rest:90},{id:"ex12",sets:4,reps:"8",rest:90},{id:"ex13",sets:3,reps:"10",rest:75},{id:"ex09",sets:3,reps:"10",rest:60},{id:"ex19",sets:2,reps:"12",rest:45},{id:"ex24",sets:2,reps:"12",rest:45}]},
  {id:"prog-lower",name:"Underkropp",emoji:"🏋️",desc:"Komplett underkroppsøkt.",level:"Middels",category:"upper-lower",
    exercises:[{id:"ex35",sets:4,reps:"6-8",rest:120},{id:"ex41",sets:3,reps:"10",rest:90},{id:"ex37",sets:3,reps:"10/side",rest:75},{id:"ex45",sets:3,reps:"12",rest:75},{id:"ex38",sets:3,reps:"12",rest:60},{id:"ex42",sets:3,reps:"12",rest:60}]},
  {id:"prog-full",name:"Fullkropp",emoji:"🔥",desc:"Treffer alt i én økt.",level:"Nybegynner",category:"fullbody",
    exercises:[{id:"ex35",sets:3,reps:"8-10",rest:120},{id:"ex01",sets:3,reps:"8-10",rest:90},{id:"ex12",sets:3,reps:"10",rest:90},{id:"ex13",sets:3,reps:"10",rest:60},{id:"ex41",sets:3,reps:"10",rest:75},{id:"ex29",sets:3,reps:"45s",rest:30}]},
  {id:"prog-core",name:"Mage & Core",emoji:"🎯",desc:"Kjernemuskeltrening.",level:"Alle",category:"supplement",
    exercises:[{id:"ex29",sets:3,reps:"45s",rest:30},{id:"ex32",sets:3,reps:"12",rest:45},{id:"ex31",sets:3,reps:"20",rest:30},{id:"ex33",sets:3,reps:"10",rest:45},{id:"ex34",sets:3,reps:"15",rest:30}]},
];

const DEFAULT_GOALS = { muscleFrequency:2, cardioSessions:3, minMusclesPerWeek:8 };
const LEVEL_THRESHOLDS = { light:5, moderate:15, strong:25 };
const TABS = [
  {id:"home",label:"Hjem",icon:"🏠"},
  {id:"programs",label:"Program",icon:"📋"},
  {id:"body",label:"Kropp",icon:"💪"},
  {id:"timer",label:"Timer",icon:"⏱️"},
];

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

const today = () => new Date().toISOString().split("T")[0];

function getWeekRange(date) {
  const d = new Date(date); const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d); mon.setDate(diff); mon.setHours(0,0,0,0);
  const sun = new Date(mon); sun.setDate(mon.getDate()+6); sun.setHours(23,59,59,999);
  return {start:mon,end:sun};
}
function inWeek(dateStr,s,e){ const d=new Date(dateStr); return d>=s&&d<=e; }
function getWeeksBack(n){
  const {start}=getWeekRange(new Date());
  return Array.from({length:n},(_,i)=>{
    const ws=new Date(start); ws.setDate(ws.getDate()-i*7);
    const we=new Date(ws); we.setDate(ws.getDate()+6); we.setHours(23,59,59,999);
    return {start:ws,end:we};
  });
}
function weekLabel(s){
  const mo=["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"];
  const e=new Date(s); e.setDate(s.getDate()+6);
  return `${s.getDate()}. ${mo[s.getMonth()]} – ${e.getDate()}. ${mo[e.getMonth()]}`;
}
function formatTime(sec){ const m=Math.floor(sec/60),s=sec%60; return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; }

function getMusclesFromExercises(exercises){
  const p=new Set(), s=new Set();
  exercises.forEach(e=>{ const ex=EX_MAP[e.id]; if(ex){ex.primary.forEach(m=>p.add(m));ex.secondary.forEach(m=>s.add(m));}});
  return {primary:[...p],secondary:[...s].filter(m=>!p.has(m))};
}

function getMuscleVolume(exercises){
  const vol={};
  exercises.forEach(e=>{
    const ex=EX_MAP[e.id]; if(!ex) return;
    ex.primary.forEach(m=>{ vol[m]=(vol[m]||0)+e.sets; });
    ex.secondary.forEach(m=>{ vol[m]=(vol[m]||0)+Math.ceil(e.sets*0.5); });
  });
  return vol;
}

function getLevel(sets){
  if(sets>=LEVEL_THRESHOLDS.strong) return "strong";
  if(sets>=LEVEL_THRESHOLDS.moderate) return "moderate";
  if(sets>=LEVEL_THRESHOLDS.light) return "light";
  return "none";
}

const LEVEL_COLORS={none:"rgba(255,255,255,0.04)",light:"#1e3a5f",moderate:"#2563eb",strong:"#6366f1"};
const LEVEL_LABELS={none:"Ikke trent",light:"Lett truffet",moderate:"Moderat",strong:"Godt trent"};
const LEVEL_EMOJI_MAP={none:"⚪",light:"🔵",moderate:"🟣",strong:"💜"};

// ══════════════════════════════════════════════════════════════
// SVG COMPONENTS
// ══════════════════════════════════════════════════════════════

const BODY_OUTLINE = "M 150,28 Q 140,28 134,34 Q 128,40 128,50 Q 128,60 134,66 Q 140,72 150,72 Q 160,72 166,66 Q 172,60 172,50 Q 172,40 166,34 Q 160,28 150,28 Z M 150,74 Q 135,74 125,80 Q 112,88 105,98 Q 95,88 88,86 Q 80,84 78,92 Q 76,100 78,115 Q 75,130 72,150 Q 70,165 74,172 Q 78,178 84,170 Q 88,160 90,148 Q 92,138 96,128 Q 100,138 108,145 Q 112,150 115,165 Q 118,180 120,195 Q 122,210 122,220 Q 118,235 116,255 Q 114,275 116,295 Q 118,310 120,315 Q 116,330 115,350 Q 114,370 118,390 Q 120,400 126,405 Q 132,408 138,405 Q 142,400 140,390 Q 138,375 136,355 Q 134,335 134,320 Q 138,315 142,310 Q 146,315 150,318 Q 154,315 158,310 Q 162,315 166,320 Q 166,335 164,355 Q 162,375 160,390 Q 158,400 162,405 Q 168,408 174,405 Q 180,400 182,390 Q 186,370 185,350 Q 184,330 180,315 Q 182,310 184,295 Q 186,275 184,255 Q 182,235 178,220 Q 178,210 180,195 Q 182,180 185,165 Q 188,150 192,145 Q 200,138 204,128 Q 208,138 210,148 Q 212,160 216,170 Q 222,178 226,172 Q 230,165 228,150 Q 225,130 222,115 Q 224,100 222,92 Q 220,84 212,86 Q 205,88 195,98 Q 188,88 175,80 Q 165,74 150,74 Z";

const FRONT_PATHS = {
  Bryst:["M 108,108 Q 120,100 140,104 Q 150,108 152,120 Q 150,132 140,136 Q 125,138 112,130 Q 105,122 108,108 Z","M 192,108 Q 180,100 160,104 Q 150,108 148,120 Q 150,132 160,136 Q 175,138 188,130 Q 195,122 192,108 Z"],
  Skuldre:["M 96,90 Q 88,85 85,95 Q 83,108 90,116 Q 98,120 105,114 Q 110,105 108,95 Q 104,88 96,90 Z","M 204,90 Q 212,85 215,95 Q 217,108 210,116 Q 202,120 195,114 Q 190,105 192,95 Q 196,88 204,90 Z"],
  Biceps:["M 88,120 Q 83,125 80,140 Q 78,155 82,165 Q 88,168 93,162 Q 97,150 96,135 Q 94,125 88,120 Z","M 212,120 Q 217,125 220,140 Q 222,155 218,165 Q 212,168 207,162 Q 203,150 204,135 Q 206,125 212,120 Z"],
  Mage:["M 132,140 Q 130,158 130,178 Q 132,198 135,210 Q 142,216 150,217 Q 158,216 165,210 Q 168,198 170,178 Q 170,158 168,140 Q 160,136 150,135 Q 140,136 132,140 Z"],
  Quadriceps:["M 122,222 Q 118,240 116,260 Q 115,278 118,296 Q 124,306 132,308 Q 140,306 143,296 Q 146,278 145,260 Q 144,240 140,222 Q 132,218 122,222 Z","M 178,222 Q 182,240 184,260 Q 185,278 182,296 Q 176,306 168,308 Q 160,306 157,296 Q 154,278 155,260 Q 156,240 160,222 Q 168,218 178,222 Z"],
  Legger:["M 119,314 Q 115,332 115,352 Q 116,372 120,386 Q 126,390 132,386 Q 135,372 135,352 Q 134,332 129,314 Q 124,312 119,314 Z","M 181,314 Q 185,332 185,352 Q 184,372 180,386 Q 174,390 168,386 Q 165,372 165,352 Q 166,332 171,314 Q 176,312 181,314 Z"],
};
const BACK_PATHS = {
  Rygg:["M 128,104 Q 125,120 124,140 Q 124,160 126,178 Q 132,188 140,192 Q 148,194 150,194 Q 152,194 160,192 Q 168,188 174,178 Q 176,160 176,140 Q 175,120 172,104 Q 164,96 150,94 Q 136,96 128,104 Z"],
  Skuldre:["M 96,90 Q 88,85 85,95 Q 83,108 90,116 Q 98,120 105,114 Q 110,105 108,95 Q 104,88 96,90 Z","M 204,90 Q 212,85 215,95 Q 217,108 210,116 Q 202,120 195,114 Q 190,105 192,95 Q 196,88 204,90 Z"],
  Triceps:["M 86,120 Q 80,128 77,145 Q 76,160 80,168 Q 86,172 92,166 Q 96,155 95,140 Q 93,128 86,120 Z","M 214,120 Q 220,128 223,145 Q 224,160 220,168 Q 214,172 208,166 Q 204,155 205,140 Q 207,128 214,120 Z"],
  Hamstrings:["M 123,224 Q 119,242 117,262 Q 116,280 119,296 Q 125,305 133,306 Q 140,304 143,296 Q 145,280 144,262 Q 143,242 139,224 Q 132,219 123,224 Z","M 177,224 Q 181,242 183,262 Q 184,280 181,296 Q 175,305 167,306 Q 160,304 157,296 Q 155,280 156,262 Q 157,242 161,224 Q 168,219 177,224 Z"],
  Rumpe:["M 125,192 Q 120,200 120,212 Q 122,222 130,226 Q 140,228 150,226 Q 148,218 145,208 Q 140,196 130,190 Z","M 175,192 Q 180,200 180,212 Q 178,222 170,226 Q 160,228 150,226 Q 152,218 155,208 Q 160,196 170,190 Z"],
  Legger:["M 118,316 Q 114,332 114,352 Q 115,372 120,388 Q 126,393 132,388 Q 136,372 135,352 Q 134,332 128,316 Q 123,313 118,316 Z","M 182,316 Q 186,332 186,352 Q 185,372 180,388 Q 174,393 168,388 Q 164,372 165,352 Q 166,332 172,316 Q 177,313 182,316 Z"],
};

const BodySVG = ({muscles, side, selected, onSelect, colorFn}) => {
  const paths = side === "front" ? FRONT_PATHS : BACK_PATHS;
  return (
    <svg viewBox="0 0 300 430" style={{width:"100%",height:"auto"}}>
      <defs>
        <filter id="gl"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d={BODY_OUTLINE} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
      {Object.entries(paths).map(([name, ps]) => {
        const c = colorFn(name);
        const sel = selected === name;
        return (
          <g key={name} onClick={()=>onSelect(sel?null:name)} style={{cursor:"pointer"}}>
            {ps.map((d,i)=>(
              <path key={i} d={d} fill={c.fill} fillOpacity={c.opacity||0.6}
                stroke={sel?"#fff":c.stroke} strokeWidth={sel?2:1}
                filter={c.glow?"url(#gl)":"none"} style={{transition:"all 0.4s"}}/>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════
// SHARED STYLES
// ══════════════════════════════════════════════════════════════

const S = {
  app:{fontFamily:"'Poppins','Segoe UI',sans-serif",background:"linear-gradient(150deg,#0a0a0f 0%,#111128 50%,#0d1117 100%)",color:"#e8e8f0",minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:72,overflow:"hidden"},
  sub:{fontSize:12,color:"#8b8ba7",margin:0,letterSpacing:1.5,textTransform:"uppercase",fontWeight:500},
  h1:{fontSize:26,fontWeight:800,margin:"4px 0 0",letterSpacing:-0.5},
  card:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 16px",marginBottom:8,transition:"all 0.2s"},
  chip:(a)=>({padding:"6px 14px",fontSize:12,fontWeight:600,borderRadius:20,cursor:"pointer",border:a?"1px solid rgba(99,102,241,0.4)":"1px solid rgba(255,255,255,0.08)",background:a?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)",color:a?"#a5b4fc":"#8b8ba7",transition:"all 0.2s",whiteSpace:"nowrap",fontFamily:"inherit"}),
  tag:(t)=>({display:"inline-block",fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:5,marginRight:3,marginTop:3,background:t==="primary"?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.06)",color:t==="primary"?"#a5b4fc":"#8b8ba7"}),
  eqTag:{display:"inline-block",fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:5,background:"rgba(16,185,129,0.12)",color:"#6ee7b7",marginTop:3},
  numIn:{width:56,padding:"8px 4px",fontSize:14,fontWeight:600,textAlign:"center",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#e8e8f0",fontFamily:"inherit",outline:"none"},
  btnPri:{padding:"14px",width:"100%",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 20px rgba(99,102,241,0.3)"},
  btnGhost:{padding:"10px 18px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#a5b4fc",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"},
  backBtn:{background:"none",border:"none",color:"#6366f1",fontSize:14,fontWeight:600,cursor:"pointer",padding:0,fontFamily:"inherit",marginBottom:14},
  searchIn:{width:"100%",padding:"12px 16px 12px 42px",fontSize:14,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#e8e8f0",outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
};

// ══════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ══════════════════════════════════════════════════════════════

async function load(key, fallback) {
  try { const r = await window.storage.get(key); return r?.value ? JSON.parse(r.value) : fallback; } catch { return fallback; }
}
async function save(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════

export default function TrainingApp() {
  const [tab, setTab] = useState("home");
  const [subView, setSubView] = useState(null);

  // ─── GLOBAL STATE ────────────────────────────────
  const [programs, setPrograms] = useState(DEFAULT_PROGRAMS);
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [allTimeVolume, setAllTimeVolume] = useState({});
  const [goals, setGoals] = useState(DEFAULT_GOALS);

  // ─── SESSION STATE ────────────────────────────────
  const [activeSession, setActiveSession] = useState(null);
  const [completedSets, setCompletedSets] = useState({});
  const [sessionStart, setSessionStart] = useState(null);

  // ─── BUILDER STATE ────────────────────────────────
  const [builderExercises, setBuilderExercises] = useState([]);
  const [builderName, setBuilderName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ─── BROWSE/SEARCH STATE ────────────────────────
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState(null);
  const [equipFilter, setEquipFilter] = useState(null);

  // ─── BODY VIEW STATE ─────────────────────────────
  const [bodySide, setBodySide] = useState("front");
  const [bodyMode, setBodyMode] = useState("alltime"); // alltime | weekly
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [showGoalSettings, setShowGoalSettings] = useState(false);

  // ─── TIMER STATE ──────────────────────────────────
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("stopwatch");
  const [countdownFrom, setCountdownFrom] = useState(60);
  const timerRef = useRef(null);

  // ─── DETAIL STATE ─────────────────────────────────
  const [detailProgram, setDetailProgram] = useState(null);

  // ─── LOAD DATA ────────────────────────────────────
  useEffect(() => {
    (async () => {
      setPrograms(await load("app-programs", DEFAULT_PROGRAMS));
      setCustomWorkouts(await load("app-custom-workouts", []));
      setWorkoutLog(await load("app-workout-log", []));
      setAllTimeVolume(await load("app-alltime-volume", {}));
      setGoals(await load("app-goals", DEFAULT_GOALS));
    })();
  }, []);

  // ─── TIMER EFFECT ─────────────────────────────────
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSec(p => {
          if (timerMode === "countdown" && p <= 1) { setTimerRunning(false); return 0; }
          return timerMode === "stopwatch" ? p + 1 : p - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerMode]);

  // ─── PERSIST HELPERS ──────────────────────────────
  const savePrograms = (d) => { setPrograms(d); save("app-programs", d); };
  const saveCustom = (d) => { setCustomWorkouts(d); save("app-custom-workouts", d); };
  const saveLog = (d) => { setWorkoutLog(d); save("app-workout-log", d); };
  const saveVolume = (d) => { setAllTimeVolume(d); save("app-alltime-volume", d); };
  const saveGoals = (d) => { setGoals(d); save("app-goals", d); };

  // ─── START SESSION ────────────────────────────────
  const startSession = (workout) => {
    setActiveSession(workout);
    setCompletedSets({});
    setSessionStart(Date.now());
    setTab("session");
    setSubView(null);
  };

  // ─── FINISH SESSION ───────────────────────────────
  const finishSession = (isCardio = false) => {
    if (!activeSession && !isCardio) return;

    const muscles = isCardio ? {} : getMuscleVolume(activeSession.exercises);
    const entry = {
      id: `log-${Date.now()}`,
      date: today(),
      name: isCardio ? "Kondisjonsøkt" : activeSession.name,
      type: isCardio ? "cardio" : "strength",
      duration: Math.max(Math.round((Date.now() - sessionStart) / 60000), 1),
      muscles,
      exerciseCount: isCardio ? 0 : activeSession.exercises.length,
      setCount: isCardio ? 0 : activeSession.exercises.reduce((s,e)=>s+e.sets, 0),
    };

    const newLog = [entry, ...workoutLog];
    saveLog(newLog);

    if (!isCardio) {
      const newVol = { ...allTimeVolume };
      Object.entries(muscles).forEach(([m, sets]) => { newVol[m] = (newVol[m] || 0) + sets; });
      saveVolume(newVol);
    }

    setActiveSession(null);
    setCompletedSets({});
    setTab("home");
  };

  const logCardio = () => {
    setSessionStart(Date.now() - 30 * 60000);
    const entry = {
      id: `log-${Date.now()}`, date: today(), name: "Kondisjonsøkt", type: "cardio",
      duration: 30, muscles: {}, exerciseCount: 0, setCount: 0,
    };
    saveLog([entry, ...workoutLog]);
  };

  const toggleSet = (exIdx, setIdx) => {
    const key = `${exIdx}-${setIdx}`;
    setCompletedSets(p => ({ ...p, [key]: !p[key] }));
  };

  // ─── WEEK DATA ────────────────────────────────────
  const { start: wkStart, end: wkEnd } = getWeekRange(new Date());
  const weekLog = workoutLog.filter(e => inWeek(e.date, wkStart, wkEnd));
  const weekMuscleData = {};
  const weekMuscleHits = {};
  ALL_MUSCLES.forEach(m => { weekMuscleData[m] = 0; weekMuscleHits[m] = 0; });
  weekLog.forEach(entry => {
    Object.entries(entry.muscles || {}).forEach(([m, sets]) => {
      weekMuscleData[m] = (weekMuscleData[m] || 0) + sets;
      weekMuscleHits[m] = (weekMuscleHits[m] || 0) + 1;
    });
  });
  const cardioThisWeek = weekLog.filter(e => e.type === "cardio").length;

  // Streaks
  const weeks = getWeeksBack(8);
  const muscleStreaks = {};
  ALL_MUSCLES.forEach(m => {
    let s = 0;
    for (const w of weeks) {
      if (workoutLog.filter(e => inWeek(e.date, w.start, w.end)).some(e => (e.muscles?.[m] || 0) > 0)) s++; else break;
    }
    muscleStreaks[m] = s;
  });

  // Balance score
  const musclesHit = ALL_MUSCLES.filter(m => weekMuscleData[m] > 0).length;
  const coverage = Math.round((musclesHit / ALL_MUSCLES.length) * 100);
  const vals = ALL_MUSCLES.map(m => weekMuscleData[m]);
  const avg = vals.reduce((a, b) => a + b, 0) / ALL_MUSCLES.length;
  const variance = avg > 0 ? vals.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / ALL_MUSCLES.length : 0;
  const evenness = avg > 0 ? Math.max(0, 100 - Math.round((Math.sqrt(variance) / avg) * 50)) : 0;
  const balanceScore = Math.round(coverage * 0.6 + evenness * 0.4);
  const balColor = balanceScore >= 75 ? "#10b981" : balanceScore >= 50 ? "#fbbf24" : balanceScore >= 25 ? "#f97316" : "#ef4444";
  const balLabel = balanceScore >= 75 ? "Utmerket" : balanceScore >= 50 ? "Bra" : balanceScore >= 25 ? "Ujevnt" : "Mangelfullt";

  // Recommendations
  const recs = [];
  const untrained = ALL_MUSCLES.filter(m => weekMuscleData[m] === 0);
  const underTrained = ALL_MUSCLES.filter(m => weekMuscleHits[m] > 0 && weekMuscleHits[m] < goals.muscleFrequency);
  if (untrained.length > 0) recs.push({ icon: "🚨", title: "Manglende muskler", desc: `${untrained.join(", ")} er ikke trent denne uken.`, sug: untrained.length >= 3 ? `Prøv en fullkroppsøkt.` : `Legg inn en økt for ${untrained.join(" og ")}.`, pri: "high" });
  if (underTrained.length > 0) recs.push({ icon: "📊", title: "Trenger mer frekvens", desc: `${underTrained.join(", ")} trenger flere økter.`, sug: `Målet er ${goals.muscleFrequency}x/uke.`, pri: "medium" });
  if (cardioThisWeek < goals.cardioSessions) recs.push({ icon: "🫀", title: "Mer kondisjon", desc: `${cardioThisWeek}/${goals.cardioSessions} kondisjonsøkter.`, sug: "Legg inn en løpetur eller HIIT-økt.", pri: cardioThisWeek === 0 ? "high" : "medium" });
  if (untrained.length === 0 && cardioThisWeek >= goals.cardioSessions) recs.push({ icon: "🏆", title: "Fantastisk uke!", desc: "Alle muskler og kondisjon dekket.", sug: "Fokuser på restitusjon!", pri: "low" });

  // Recommended program
  const findRecommendedProgram = () => {
    if (untrained.length === 0) return null;
    const all = [...programs, ...customWorkouts];
    let best = null, bestScore = 0;
    all.forEach(p => {
      const { primary } = getMusclesFromExercises(p.exercises);
      const score = primary.filter(m => untrained.includes(m)).length;
      if (score > bestScore) { best = p; bestScore = score; }
    });
    return best;
  };

  // ─── BUILDER FUNCTIONS ────────────────────────────
  const addToBuilder = (ex) => {
    if (builderExercises.find(e => e.id === ex.id)) return;
    setBuilderExercises(p => [...p, { ...ex, sets: 3, reps: "10", rest: 60 }]);
  };
  const removeFromBuilder = (id) => setBuilderExercises(p => p.filter(e => e.id !== id));
  const updateBuilderEx = (id, f, v) => setBuilderExercises(p => p.map(e => e.id === id ? { ...e, [f]: v } : e));
  const moveBuilderEx = (i, d) => {
    const arr = [...builderExercises]; const ni = i + d;
    if (ni < 0 || ni >= arr.length) return;
    [arr[i], arr[ni]] = [arr[ni], arr[i]];
    setBuilderExercises(arr);
  };

  const saveWorkout = () => {
    if (!builderName.trim() || builderExercises.length === 0) return;
    const wk = {
      id: editingId || `wk-${Date.now()}`, name: builderName, emoji: "🏋️",
      exercises: builderExercises.map(e => ({ id: e.id, sets: e.sets, reps: e.reps, rest: e.rest })),
      category: "custom",
    };
    const updated = editingId ? customWorkouts.map(w => w.id === editingId ? wk : w) : [...customWorkouts, wk];
    saveCustom(updated);
    setBuilderName(""); setBuilderExercises([]); setEditingId(null);
    setSubView("myWorkouts");
  };

  const editWorkout = (wk) => {
    setBuilderName(wk.name);
    setBuilderExercises(wk.exercises.map(e => ({ ...(EX_MAP[e.id] || e), sets: e.sets, reps: e.reps, rest: e.rest })));
    setEditingId(wk.id);
    setSubView("builder");
  };

  // ─── SEARCH FILTER ────────────────────────────────
  const filtered = EXERCISES.filter(ex => {
    const ms = !search || ex.name.toLowerCase().includes(search.toLowerCase());
    const mm = !muscleFilter || ex.primary.includes(muscleFilter) || ex.secondary.includes(muscleFilter);
    const me = !equipFilter || ex.equipment === equipFilter;
    return ms && mm && me;
  });

  // Session progress
  const totalSets = activeSession ? activeSession.exercises.reduce((s, e) => s + e.sets, 0) : 0;
  const doneSets = Object.values(completedSets).filter(Boolean).length;
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  // ─── RECENT LOG ────────────────────────────────────
  const recentLog = workoutLog.slice(0, 5);
  const DAYS = ["Man","Tir","Ons","Tor","Fre","Lør","Søn"];
  const dayActivity = DAYS.map((_, i) => {
    const d = new Date(wkStart); d.setDate(wkStart.getDate() + i);
    const ds = d.toISOString().split("T")[0];
    const entries = weekLog.filter(e => e.date === ds);
    return { str: entries.some(e => e.type === "strength"), car: entries.some(e => e.type === "cardio") };
  });

  // ══════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <div style={{position:"fixed",top:-120,right:-120,width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:100,left:-100,width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <div style={{position:"relative",zIndex:1}}>

      {/* ═══════════════════════════════════════════════ */}
      {/* HOME TAB */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === "home" && (
        <div style={{padding:"24px 20px"}}>
          <p style={S.sub}>MuscleMap</p>
          <h1 style={S.h1}>Hjem</h1>

          {/* Week strip */}
          <div style={{display:"flex",gap:4,margin:"16px 0 12px"}}>
            {DAYS.map((d,i)=>(
              <div key={d} style={{flex:1,textAlign:"center"}}>
                <div style={{height:36,borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
                  background:dayActivity[i].str||dayActivity[i].car?"rgba(99,102,241,0.1)":"rgba(255,255,255,0.03)",
                  border:`1px solid ${dayActivity[i].str||dayActivity[i].car?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.05)"}`}}>
                  {dayActivity[i].str&&<div style={{width:5,height:5,borderRadius:"50%",background:"#6366f1"}}/>}
                  {dayActivity[i].car&&<div style={{width:5,height:5,borderRadius:"50%",background:"#10b981"}}/>}
                </div>
                <span style={{fontSize:9,color:"#6b6b8a",fontWeight:500}}>{d}</span>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
            {[
              {v:weekLog.filter(e=>e.type==="strength").length,u:"styrkeøkter",c:"#a5b4fc"},
              {v:cardioThisWeek,u:"kondisjon",c:"#6ee7b7"},
              {v:balanceScore,u:"balanse",c:balColor},
            ].map(s=>(
              <div key={s.u} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                <div style={{fontSize:24,fontWeight:800,color:s.c}}>{s.v}</div>
                <div style={{fontSize:9,color:"#8b8ba7",fontWeight:500,textTransform:"uppercase",letterSpacing:0.5}}>{s.u}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:10}}>Start trening</h2>
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            <button onClick={()=>{setTab("programs");setSubView(null);}} style={{flex:1,...S.btnPri,padding:"12px",fontSize:14}}>
              📋 Velg program
            </button>
            <button onClick={logCardio} style={{...S.btnGhost,flex:1,padding:"12px"}}>
              🫀 Logg kondisjon
            </button>
          </div>

          {/* Recommendation */}
          {recs.length > 0 && recs[0].pri !== "low" && (
            <div style={{background:recs[0].pri==="high"?"rgba(239,68,68,0.04)":"rgba(251,191,36,0.04)",
              border:`1px solid ${recs[0].pri==="high"?"rgba(239,68,68,0.2)":"rgba(251,191,36,0.15)"}`,
              borderRadius:14,padding:"14px 16px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:16}}>{recs[0].icon}</span>
                <span style={{fontWeight:700,fontSize:13}}>{recs[0].title}</span>
              </div>
              <p style={{fontSize:12,color:"#b0b0c8",margin:"0 0 4px",lineHeight:1.5}}>{recs[0].desc}</p>
              <p style={{fontSize:12,color:"#a5b4fc",margin:0,fontWeight:600}}>→ {recs[0].sug}</p>
              {(() => { const rec = findRecommendedProgram(); return rec ? (
                <button onClick={() => { setDetailProgram(rec); setTab("programs"); setSubView("detail"); }}
                  style={{marginTop:10,padding:"8px 14px",fontSize:12,fontWeight:600,borderRadius:10,
                    background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.2)",
                    color:"#a5b4fc",cursor:"pointer",fontFamily:"inherit"}}>
                  Prøv: {rec.emoji} {rec.name}
                </button>
              ) : null; })()}
            </div>
          )}

          {/* Recent log */}
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:10}}>Siste økter</h2>
          {recentLog.length === 0 ? (
            <div style={{textAlign:"center",padding:30,color:"#6b6b8a"}}>
              <span style={{fontSize:40}}>📝</span>
              <p style={{marginTop:8}}>Ingen økter logget ennå. Start din første trening!</p>
            </div>
          ) : recentLog.map(entry => (
            <div key={entry.id} style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{entry.type==="cardio"?"🫀":"🏋️"} {entry.name}</div>
                <div style={{fontSize:11,color:"#8b8ba7",marginTop:2}}>
                  {entry.date} · {entry.duration} min {entry.setCount > 0 ? `· ${entry.setCount} sett` : ""}
                </div>
              </div>
              <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8,
                background:entry.type==="cardio"?"rgba(16,185,129,0.1)":"rgba(99,102,241,0.1)",
                color:entry.type==="cardio"?"#6ee7b7":"#a5b4fc"}}>
                {entry.type==="cardio"?"Kondisjon":"Styrke"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* ACTIVE SESSION */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === "session" && activeSession && (
        <div style={{padding:"24px 20px"}}>
          <div style={{marginBottom:16}}>
            <p style={{...S.sub,color:"#10b981"}}>AKTIV ØKT</p>
            <h1 style={{...S.h1,fontSize:22}}>{activeSession.emoji||"🏋️"} {activeSession.name}</h1>
          </div>

          {/* Progress */}
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#8b8ba7",marginBottom:6}}>
              <span>Fremgang</span><span>{doneSets}/{totalSets} sett</span>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#6366f1,#10b981)",borderRadius:4,transition:"width 0.4s"}}/>
            </div>
          </div>

          {/* Exercises */}
          {activeSession.exercises.map((e, exIdx) => {
            const ex = EX_MAP[e.id] || { name: e.name || "Øvelse" };
            const allDone = Array.from({length:e.sets}).every((_,si) => completedSets[`${exIdx}-${si}`]);
            return (
              <div key={exIdx} style={{...S.card,background:allDone?"rgba(16,185,129,0.05)":"rgba(255,255,255,0.03)",
                borderColor:allDone?"rgba(16,185,129,0.2)":"rgba(255,255,255,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontWeight:700,fontSize:14}}>
                    {allDone && <span style={{color:"#10b981",marginRight:6}}>✓</span>}
                    {ex.name}
                  </div>
                  <span style={{fontSize:11,color:"#8b8ba7"}}>{e.reps}</span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {Array.from({length:e.sets}).map((_,si) => {
                    const done = completedSets[`${exIdx}-${si}`];
                    return (
                      <button key={si} onClick={()=>toggleSet(exIdx,si)} style={{
                        flex:1,padding:"10px 0",fontSize:11,fontWeight:600,cursor:"pointer",
                        background:done?"linear-gradient(135deg,#10b981,#059669)":"rgba(255,255,255,0.06)",
                        border:done?"1px solid rgba(16,185,129,0.4)":"1px solid rgba(255,255,255,0.1)",
                        borderRadius:10,color:done?"#fff":"#8b8ba7",transition:"all 0.2s",fontFamily:"inherit",
                      }}>{done?"✓":`Sett ${si+1}`}</button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button onClick={()=>finishSession(false)} style={{
            ...S.btnPri, marginTop:16,
            background:progress===100?"linear-gradient(135deg,#10b981,#059669)":"rgba(255,255,255,0.08)",
            color:progress===100?"#fff":"#8b8ba7",
            boxShadow:progress===100?"0 4px 20px rgba(16,185,129,0.3)":"none",
          }}>
            {progress===100?"Fullfør Økt! 🎉":"Avslutt Økt"}
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* PROGRAMS TAB */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === "programs" && (
        <div style={{padding:"24px 20px"}}>

          {/* Programs list */}
          {!subView && (
            <>
              <p style={S.sub}>Treningsprogram</p>
              <h1 style={{...S.h1,marginBottom:14}}>Program</h1>

              {/* Sub-nav */}
              <div style={{display:"flex",gap:4,marginBottom:14}}>
                {[{id:null,l:"Ferdiglagde"},{id:"myWorkouts",l:`Mine (${customWorkouts.length})`},{id:"browse",l:"Bygg ny"}].map(t=>(
                  <button key={t.id||"def"} onClick={()=>setSubView(t.id)} style={{
                    flex:1,padding:"9px 0",fontSize:12,fontWeight:600,borderRadius:10,cursor:"pointer",fontFamily:"inherit",
                    background:(!subView&&!t.id)||(subView===t.id)?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.03)",
                    border:(!subView&&!t.id)||(subView===t.id)?"1px solid rgba(99,102,241,0.3)":"1px solid rgba(255,255,255,0.06)",
                    color:(!subView&&!t.id)||(subView===t.id)?"#a5b4fc":"#6b6b8a",transition:"all 0.2s",
                  }}>{t.l}</button>
                ))}
              </div>

              {/* Program cards */}
              {programs.map(p => {
                const {primary} = getMusclesFromExercises(p.exercises);
                return (
                  <button key={p.id} onClick={()=>{setDetailProgram(p);setSubView("detail");}}
                    style={{...S.card,display:"flex",alignItems:"center",gap:14,cursor:"pointer",width:"100%",textAlign:"left",fontFamily:"inherit",color:"#e8e8f0"}}>
                    <span style={{fontSize:32}}>{p.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:15}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#8b8ba7"}}>{p.exercises.length} øvelser · {p.exercises.reduce((s,e)=>s+e.sets,0)} sett</div>
                      <div style={{marginTop:3}}>{primary.slice(0,4).map(m=><span key={m} style={S.tag("primary")}>{m}</span>)}</div>
                    </div>
                    <span style={{color:"#6366f1",fontSize:18}}>→</span>
                  </button>
                );
              })}
            </>
          )}

          {/* My workouts */}
          {subView === "myWorkouts" && (
            <>
              <button onClick={()=>setSubView(null)} style={S.backBtn}>← Tilbake</button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:14}}>Mine økter</h2>
              {customWorkouts.length === 0 ? (
                <div style={{textAlign:"center",padding:40,color:"#6b6b8a"}}>
                  <span style={{fontSize:48}}>📋</span>
                  <p style={{marginTop:12}}>Ingen egne økter ennå</p>
                  <button onClick={()=>{setBuilderName("");setBuilderExercises([]);setEditingId(null);setSubView("browse");}} style={S.btnGhost}>🔍 Bygg ny økt</button>
                </div>
              ) : customWorkouts.map(wk => (
                <div key={wk.id} style={{...S.card}}>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{wk.emoji} {wk.name}</div>
                  <div style={{fontSize:11,color:"#8b8ba7",marginBottom:8}}>
                    {wk.exercises.length} øvelser · {wk.exercises.reduce((s,e)=>s+e.sets,0)} sett
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>startSession(wk)} style={{...S.btnPri,flex:2,padding:"10px",fontSize:13}}>▶ Start</button>
                    <button onClick={()=>editWorkout(wk)} style={{...S.btnGhost,flex:1,padding:"10px"}}>✏️</button>
                    <button onClick={()=>{saveCustom(customWorkouts.filter(w=>w.id!==wk.id));}}
                      style={{padding:"10px 14px",fontSize:12,fontWeight:600,borderRadius:12,background:"rgba(239,68,68,0.08)",
                        border:"1px solid rgba(239,68,68,0.15)",color:"#f87171",cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
                  </div>
                </div>
              ))}
              {customWorkouts.length > 0 && (
                <button onClick={()=>{setBuilderName("");setBuilderExercises([]);setEditingId(null);setSubView("browse");}}
                  style={{...S.btnPri,marginTop:12}}>+ Bygg ny økt</button>
              )}
            </>
          )}

          {/* Detail view */}
          {subView === "detail" && detailProgram && (
            <>
              <button onClick={()=>{setSubView(null);setDetailProgram(null);}} style={S.backBtn}>← Tilbake</button>
              <div style={{textAlign:"center",marginBottom:20}}>
                <span style={{fontSize:52}}>{detailProgram.emoji}</span>
                <h2 style={{fontSize:22,fontWeight:800,margin:"6px 0 4px"}}>{detailProgram.name}</h2>
                <p style={{fontSize:12,color:"#8b8ba7",margin:0}}>{detailProgram.desc}</p>
                <div style={{marginTop:6}}>
                  {(() => { const {primary,secondary} = getMusclesFromExercises(detailProgram.exercises); return (
                    <>{primary.map(m=><span key={m} style={S.tag("primary")}>{m}</span>)}{secondary.map(m=><span key={m} style={S.tag("secondary")}>{m}</span>)}</>
                  );})()}
                </div>
              </div>
              {detailProgram.exercises.map((e,i) => {
                const ex = EX_MAP[e.id];
                return ex ? (
                  <div key={i} style={{...S.card,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:13,color:"#6366f1",fontWeight:800,width:18,textAlign:"center"}}>{i+1}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>{ex.name}</div>
                      <div style={{fontSize:11,color:"#8b8ba7"}}>{e.sets}×{e.reps} · {e.rest}s hvile</div>
                    </div>
                    <span style={S.eqTag}>{ex.equipment}</span>
                  </div>
                ) : null;
              })}
              <button onClick={()=>startSession(detailProgram)} style={{...S.btnPri,marginTop:16}}>Start Økt 🚀</button>
            </>
          )}

          {/* Browse exercises / Builder */}
          {subView === "browse" && (
            <>
              <button onClick={()=>setSubView(builderExercises.length > 0 ? "builder" : null)} style={S.backBtn}>
                ← {builderExercises.length > 0 ? "Til byggeren" : "Tilbake"}
              </button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:10}}>Finn øvelser</h2>

              <div style={{position:"relative",marginBottom:10}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:15,opacity:0.4}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Søk..." style={S.searchIn}/>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                {ALL_MUSCLES.map(m=>(
                  <button key={m} onClick={()=>setMuscleFilter(muscleFilter===m?null:m)} style={S.chip(muscleFilter===m)}>{m}</button>
                ))}
              </div>
              <p style={{fontSize:11,color:"#6b6b8a",margin:"0 0 8px"}}>{filtered.length} øvelser</p>
              {filtered.map(ex => {
                const added = builderExercises.find(e=>e.id===ex.id);
                return (
                  <div key={ex.id} style={{...S.card,display:"flex",alignItems:"center",gap:10,
                    borderColor:added?"rgba(16,185,129,0.2)":"rgba(255,255,255,0.06)",
                    background:added?"rgba(16,185,129,0.04)":"rgba(255,255,255,0.04)"}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13}}>{ex.name}</div>
                      <div>{ex.primary.map(m=><span key={m} style={S.tag("primary")}>{m}</span>)}<span style={S.eqTag}>{ex.equipment}</span></div>
                    </div>
                    <button onClick={()=>added?removeFromBuilder(ex.id):addToBuilder(ex)} style={{
                      width:32,height:32,borderRadius:8,border:"none",fontSize:16,cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      background:added?"rgba(239,68,68,0.15)":"rgba(99,102,241,0.15)",
                      color:added?"#f87171":"#a5b4fc",
                    }}>{added?"−":"+"}</button>
                  </div>
                );
              })}
              {builderExercises.length > 0 && (
                <button onClick={()=>setSubView("builder")} style={{...S.btnPri,position:"sticky",bottom:80,marginTop:16}}>
                  Gå til bygger ({builderExercises.length} øvelser)
                </button>
              )}
            </>
          )}

          {/* Builder */}
          {subView === "builder" && (
            <>
              <button onClick={()=>setSubView(null)} style={S.backBtn}>← Tilbake</button>
              <h2 style={{fontSize:20,fontWeight:800,marginBottom:12}}>
                {editingId ? "Rediger økt" : "Bygg økt"}
              </h2>
              <input value={builderName} onChange={e=>setBuilderName(e.target.value)} placeholder="Navn på økt..."
                style={{...S.searchIn,paddingLeft:16,fontSize:16,fontWeight:600,marginBottom:14}}/>
              {builderExercises.length === 0 ? (
                <div style={{textAlign:"center",padding:30,color:"#6b6b8a"}}>
                  <p>Ingen øvelser ennå</p>
                  <button onClick={()=>setSubView("browse")} style={S.btnGhost}>🔍 Finn øvelser</button>
                </div>
              ) : (
                <>
                  {builderExercises.map((ex, idx) => (
                    <div key={ex.id} style={{...S.card}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:12,color:"#6366f1",fontWeight:800}}>{idx+1}</span>
                          <span style={{fontWeight:600,fontSize:13}}>{ex.name}</span>
                        </div>
                        <div style={{display:"flex",gap:2}}>
                          <button onClick={()=>moveBuilderEx(idx,-1)} style={{background:"none",border:"none",color:idx===0?"#2a2a3a":"#8b8ba7",fontSize:11,cursor:"pointer",padding:"2px 4px"}}>▲</button>
                          <button onClick={()=>moveBuilderEx(idx,1)} style={{background:"none",border:"none",color:idx===builderExercises.length-1?"#2a2a3a":"#8b8ba7",fontSize:11,cursor:"pointer",padding:"2px 4px"}}>▼</button>
                          <button onClick={()=>removeFromBuilder(ex.id)} style={{background:"none",border:"none",color:"#ef4444",fontSize:11,cursor:"pointer",padding:"2px 4px"}}>✕</button>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:10}}>
                        {[{l:"SETT",k:"sets",t:"number",w:56},{l:"REPS",k:"reps",t:"text",w:64},{l:"HVILE",k:"rest",t:"number",w:56}].map(f=>(
                          <div key={f.k} style={{textAlign:"center"}}>
                            <label style={{fontSize:9,color:"#6b6b8a",fontWeight:600,display:"block",marginBottom:3}}>{f.l}</label>
                            <input type={f.t} value={ex[f.k]}
                              onChange={e=>updateBuilderEx(ex.id,f.k,f.t==="number"?parseInt(e.target.value)||0:e.target.value)}
                              style={{...S.numIn,width:f.w}}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:12}}>
                    <button onClick={()=>setSubView("browse")} style={{...S.btnGhost,flex:1}}>+ Legg til</button>
                    <button onClick={saveWorkout} style={{
                      ...S.btnPri,flex:2,opacity:builderName.trim()?1:0.5,
                    }}>{editingId?"Oppdater 💾":"Lagre 💾"}</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* BODY TAB */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === "body" && (
        <div style={{padding:"24px 20px"}}>
          <p style={S.sub}>Muskeloversikt</p>
          <h1 style={{...S.h1,marginBottom:6}}>Kropp</h1>

          {/* Mode toggle */}
          <div style={{display:"flex",gap:4,marginBottom:12}}>
            {[{id:"alltime",l:"All-time"},{id:"weekly",l:`Denne uken`}].map(m=>(
              <button key={m.id} onClick={()=>{setBodyMode(m.id);setSelectedMuscle(null);}} style={{
                flex:1,padding:"9px 0",fontSize:13,fontWeight:600,borderRadius:10,cursor:"pointer",fontFamily:"inherit",
                background:bodyMode===m.id?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.03)",
                border:bodyMode===m.id?"1px solid rgba(99,102,241,0.3)":"1px solid rgba(255,255,255,0.06)",
                color:bodyMode===m.id?"#a5b4fc":"#6b6b8a",transition:"all 0.2s",
              }}>{m.l}</button>
            ))}
          </div>

          {/* ALL-TIME MODE */}
          {bodyMode === "alltime" && (
            <>
              {/* Front/back toggle */}
              <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                <div style={{display:"inline-flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3}}>
                  {["front","back"].map(s=>(
                    <button key={s} onClick={()=>{setBodySide(s);setSelectedMuscle(null);}} style={{
                      padding:"8px 28px",fontSize:13,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",
                      background:bodySide===s?"rgba(99,102,241,0.2)":"transparent",
                      border:bodySide===s?"1px solid rgba(99,102,241,0.3)":"1px solid transparent",
                      color:bodySide===s?"#a5b4fc":"#6b6b8a",transition:"all 0.2s",
                    }}>{s==="front"?"Forfra":"Bakfra"}</button>
                  ))}
                </div>
              </div>

              {/* SVG body */}
              <div style={{maxWidth:280,margin:"0 auto",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:18,padding:"12px 6px"}}>
                <BodySVG side={bodySide} selected={selectedMuscle} onSelect={setSelectedMuscle}
                  colorFn={(name) => {
                    const sets = allTimeVolume[name] || 0;
                    const lvl = getLevel(sets);
                    return {
                      fill: LEVEL_COLORS[lvl], opacity: lvl === "none" ? 0.3 : 0.65,
                      stroke: lvl === "none" ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.3)",
                      glow: lvl !== "none",
                    };
                  }}/>
              </div>

              {/* Legend */}
              <div style={{display:"flex",gap:6,margin:"12px 0",justifyContent:"center"}}>
                {["none","light","moderate","strong"].map(l=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:10,height:10,borderRadius:3,background:LEVEL_COLORS[l],border:"1px solid rgba(255,255,255,0.08)"}}/>
                    <span style={{fontSize:9,color:"#6b6b8a"}}>{LEVEL_LABELS[l]}</span>
                  </div>
                ))}
              </div>

              {/* Muscle list */}
              {ALL_MUSCLES.map(m => {
                const sets = allTimeVolume[m] || 0;
                const lvl = getLevel(sets);
                return (
                  <button key={m} onClick={()=>setSelectedMuscle(selectedMuscle===m?null:m)} style={{
                    display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:4,width:"100%",
                    background:selectedMuscle===m?"rgba(99,102,241,0.08)":"rgba(255,255,255,0.02)",
                    border:`1px solid ${selectedMuscle===m?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)"}`,
                    cursor:"pointer",fontFamily:"inherit",color:"#e8e8f0",textAlign:"left",transition:"all 0.2s",
                  }}>
                    <div style={{width:24,height:24,borderRadius:6,background:LEVEL_COLORS[lvl],display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,border:"1px solid rgba(255,255,255,0.08)"}}>{LEVEL_EMOJI_MAP[lvl]}</div>
                    <span style={{flex:1,fontWeight:600,fontSize:12}}>{MUSCLE_EMOJI[m]} {m}</span>
                    <span style={{fontSize:11,color:"#8b8ba7",fontWeight:600}}>{sets} sett</span>
                    <div style={{width:50,height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min((sets/40)*100,100)}%`,background:LEVEL_COLORS[lvl],borderRadius:3,transition:"width 0.4s"}}/>
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {/* WEEKLY MODE */}
          {bodyMode === "weekly" && (
            <>
              {/* Goal settings */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:12,color:"#8b8ba7"}}>{weekLabel(wkStart)}</span>
                <button onClick={()=>setShowGoalSettings(!showGoalSettings)} style={{
                  padding:"6px 12px",fontSize:11,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",
                  background:showGoalSettings?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.04)",
                  border:`1px solid ${showGoalSettings?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.06)"}`,
                  color:showGoalSettings?"#a5b4fc":"#8b8ba7",
                }}>⚙️ Mål</button>
              </div>

              {showGoalSettings && (
                <div style={{background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:14,padding:"14px 16px",marginBottom:14}}>
                  {[{k:"muscleFrequency",l:"Frekvens per muskel",u:"/uke",min:1,max:5},{k:"cardioSessions",l:"Kondisjonsøkter",u:"/uke",min:0,max:7}].map(s=>(
                    <div key={s.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:12,color:"#ccc"}}>{s.l}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <button onClick={()=>saveGoals({...goals,[s.k]:Math.max(s.min,goals[s.k]-1)})} style={{width:28,height:28,borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",color:"#e8e8f0",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <span style={{fontSize:14,fontWeight:700,color:"#a5b4fc",width:20,textAlign:"center"}}>{goals[s.k]}</span>
                        <button onClick={()=>saveGoals({...goals,[s.k]:Math.min(s.max,goals[s.k]+1)})} style={{width:28,height:28,borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",color:"#e8e8f0",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Balance score */}
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px",textAlign:"center",marginBottom:14}}>
                <div style={{position:"relative",width:100,height:100,margin:"0 auto 6px"}}>
                  <svg viewBox="0 0 100 100" style={{width:100,height:100}}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
                    <circle cx="50" cy="50" r="42" fill="none" stroke={balColor} strokeWidth="7"
                      strokeDasharray={`${(balanceScore/100)*264} 264`} strokeLinecap="round"
                      transform="rotate(-90 50 50)" style={{transition:"stroke-dasharray 0.6s"}}/>
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontSize:26,fontWeight:900,color:balColor}}>{balanceScore}</span>
                    <span style={{fontSize:9,color:"#8b8ba7"}}>{balLabel}</span>
                  </div>
                </div>
                <span style={{fontSize:10,color:"#6b6b8a"}}>Balansescore</span>
              </div>

              {/* Cardio bar */}
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px",marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:6}}>
                  <span style={{color:"#8b8ba7"}}>🫀 Kondisjon</span>
                  <span style={{fontWeight:700,color:cardioThisWeek>=goals.cardioSessions?"#10b981":"#e8e8f0"}}>
                    {cardioThisWeek}/{goals.cardioSessions} {cardioThisWeek>=goals.cardioSessions?"✓":""}
                  </span>
                </div>
                <div style={{height:10,background:"rgba(255,255,255,0.06)",borderRadius:5,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min((cardioThisWeek/Math.max(goals.cardioSessions,1))*100,100)}%`,
                    background:cardioThisWeek>=goals.cardioSessions?"linear-gradient(90deg,#10b981,#34d399)":"linear-gradient(90deg,#2563eb,#60a5fa)",
                    borderRadius:5,transition:"width 0.5s"}}/>
                </div>
              </div>

              {/* Weekly muscle list with streaks */}
              <h3 style={{fontSize:14,fontWeight:700,marginBottom:8}}>Muskelgrupper</h3>
              {ALL_MUSCLES.map(m => {
                const sets = weekMuscleData[m] || 0;
                const hits = weekMuscleHits[m] || 0;
                const goalMet = hits >= goals.muscleFrequency;
                const streak = muscleStreaks[m];
                return (
                  <div key={m} style={{
                    display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,marginBottom:4,
                    background:goalMet?"rgba(16,185,129,0.04)":"rgba(255,255,255,0.02)",
                    border:`1px solid ${goalMet?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.04)"}`,
                  }}>
                    <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,
                      background:goalMet?"#10b981":sets>0?"#2563eb":"rgba(255,255,255,0.1)",
                      boxShadow:goalMet?"0 0 6px rgba(16,185,129,0.4)":"none"}}/>
                    <span style={{fontWeight:600,fontSize:12,width:82,flexShrink:0}}>{MUSCLE_EMOJI[m]} {m}</span>
                    <span style={{fontSize:11,fontWeight:700,width:30,textAlign:"center",
                      color:goalMet?"#10b981":hits>0?"#a5b4fc":"#4a4a6a"}}>{hits}/{goals.muscleFrequency}</span>
                    <span style={{fontSize:10,color:"#6b6b8a",width:38,textAlign:"right"}}>{sets}s</span>
                    {streak >= 2 && <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:6,
                      background:streak>=4?"rgba(251,191,36,0.12)":"rgba(255,255,255,0.06)",
                      color:streak>=4?"#fbbf24":"#8b8ba7",whiteSpace:"nowrap"}}>🔥{streak}u</span>}
                  </div>
                );
              })}

              {/* Recommendations */}
              {recs.length > 0 && (
                <>
                  <h3 style={{fontSize:14,fontWeight:700,margin:"16px 0 8px"}}>💡 Anbefalinger</h3>
                  {recs.map((r,i) => (
                    <div key={i} style={{
                      background:r.pri==="high"?"rgba(239,68,68,0.04)":r.pri==="medium"?"rgba(251,191,36,0.04)":"rgba(16,185,129,0.04)",
                      border:`1px solid ${r.pri==="high"?"rgba(239,68,68,0.2)":r.pri==="medium"?"rgba(251,191,36,0.15)":"rgba(16,185,129,0.15)"}`,
                      borderRadius:12,padding:"12px 14px",marginBottom:6,
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                        <span style={{fontSize:14}}>{r.icon}</span>
                        <span style={{fontWeight:700,fontSize:12}}>{r.title}</span>
                      </div>
                      <p style={{fontSize:11,color:"#b0b0c8",margin:"0 0 3px",lineHeight:1.4}}>{r.desc}</p>
                      <p style={{fontSize:11,color:"#a5b4fc",margin:0,fontWeight:600}}>→ {r.sug}</p>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/* TIMER TAB */}
      {/* ═══════════════════════════════════════════════ */}
      {tab === "timer" && (
        <div style={{padding:"24px 20px",textAlign:"center"}}>
          <h1 style={{...S.h1,marginBottom:20}}>Timer</h1>

          <div style={{display:"inline-flex",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:3,marginBottom:28}}>
            {["stopwatch","countdown"].map(m=>(
              <button key={m} onClick={()=>{setTimerMode(m);setTimerRunning(false);setTimerSec(m==="countdown"?countdownFrom:0);}}
                style={{padding:"9px 22px",fontSize:13,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",
                  background:timerMode===m?"rgba(99,102,241,0.2)":"transparent",
                  border:timerMode===m?"1px solid rgba(99,102,241,0.3)":"1px solid transparent",
                  color:timerMode===m?"#a5b4fc":"#6b6b8a",transition:"all 0.2s",
                }}>{m==="stopwatch"?"Stoppeklokke":"Nedtelling"}</button>
            ))}
          </div>

          <div style={{fontSize:72,fontWeight:900,fontVariantNumeric:"tabular-nums",letterSpacing:-2,margin:"16px 0 32px",
            background:"linear-gradient(135deg,#e8e8f0,#a5b4fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            {formatTime(timerSec)}
          </div>

          {timerMode === "countdown" && !timerRunning && (
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:28}}>
              {[30,45,60,90,120].map(s=>(
                <button key={s} onClick={()=>{setCountdownFrom(s);setTimerSec(s);}} style={{
                  padding:"7px 12px",fontSize:12,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"inherit",
                  background:countdownFrom===s?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)",
                  border:`1px solid ${countdownFrom===s?"rgba(99,102,241,0.3)":"rgba(255,255,255,0.06)"}`,
                  color:countdownFrom===s?"#a5b4fc":"#8b8ba7",
                }}>{s}s</button>
              ))}
            </div>
          )}

          <div style={{display:"flex",gap:12,justifyContent:"center"}}>
            <button onClick={()=>setTimerRunning(!timerRunning)} style={{
              width:68,height:68,borderRadius:"50%",border:"none",color:"#fff",fontSize:22,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              background:timerRunning?"linear-gradient(135deg,#ef4444,#dc2626)":"linear-gradient(135deg,#10b981,#059669)",
              boxShadow:timerRunning?"0 4px 20px rgba(239,68,68,0.3)":"0 4px 20px rgba(16,185,129,0.3)",
            }}>{timerRunning?"⏸":"▶"}</button>
            <button onClick={()=>{setTimerRunning(false);setTimerSec(timerMode==="countdown"?countdownFrom:0);}} style={{
              width:68,height:68,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.1)",color:"#8b8ba7",fontSize:18,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.06)",
            }}>↺</button>
          </div>
        </div>
      )}

      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* BOTTOM NAV */}
      {/* ═══════════════════════════════════════════════ */}
      <div style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,
        background:"rgba(10,10,15,0.95)",backdropFilter:"blur(20px)",
        borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",padding:"6px 0 12px",zIndex:10,
      }}>
        {TABS.map(t => {
          const active = tab === t.id || (tab === "session" && t.id === "programs");
          return (
            <button key={t.id} onClick={()=>{
              if(tab==="session"&&t.id!=="programs") setTab(t.id);
              else if(tab!=="session"){setTab(t.id);setSubView(null);setDetailProgram(null);setSelectedMuscle(null);}
            }} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,
              background:"none",border:"none",cursor:"pointer",padding:"4px 0",
              color:active?"#a5b4fc":"#4a4a6a",fontFamily:"inherit",
            }}>
              <span style={{fontSize:20}}>{t.icon}</span>
              <span style={{fontSize:9,fontWeight:600,letterSpacing:0.3}}>{t.label}</span>
              {active && <div style={{width:4,height:4,borderRadius:"50%",background:"#6366f1",marginTop:1}}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
