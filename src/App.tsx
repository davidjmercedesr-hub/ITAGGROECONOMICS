import {useEffect,useRef,useState} from 'react';
import type {FarmTask,Observation} from './domain';
import {localAssistant} from './assistant';
import {listObservations,listTasks,saveObservation,saveTask} from './storage';
import {recordShortAudio} from './media';
import {demoFarm,demoFields} from './farm';

export function App(){
  const[observations,setObservations]=useState<Observation[]>([]);
  const[tasks,setTasks]=useState<FarmTask[]>([]);
  const[text,setText]=useState('');
  const[fieldId,setFieldId]=useState(demoFields[0].id);
  const field=demoFields.find(f=>f.id===fieldId)??demoFields[0];
  const[selectedId,setSelectedId]=useState<string|null>(null);
  const[chatInput,setChatInput]=useState('');
  const[chat,setChat]=useState(['Hallo. Ich arbeite offline-first und zeige bei agronomischen Hinweisen Unsicherheit statt einer definitiven Diagnose.']);
  const[recording,setRecording]=useState(false);
  const[message,setMessage]=useState('');
  const photoRef=useRef<HTMLInputElement>(null);

  useEffect(()=>{Promise.all([listObservations(),listTasks()]).then(([o,t])=>{setObservations(o);setTasks(t)}).catch(console.warn)},[]);

  const selected=observations.find(o=>o.id===selectedId)??null;

  async function addObservation(media:Observation['media']=[]){
    const value=text.trim(); if(!value&&!media.length)return;
    const o:Observation={id:crypto.randomUUID(),farmId:demoFarm.id,fieldId:field.id,field:field.name,text:value||'Medienbeobachtung',timestamp:new Date().toISOString(),status:'new',media,sensorReadings:[],weatherContext:null,aiFindings:null};
    await saveObservation(o); setObservations(v=>[o,...v]); setSelectedId(o.id); setText(''); setMessage('Beobachtung lokal gespeichert.');
  }
  async function createTask(o:Observation){
    if(tasks.some(t=>t.observationId===o.id&&t.status==='open')){setMessage('Für diese Beobachtung gibt es bereits eine offene Aufgabe.');return}
    const t:FarmTask={id:crypto.randomUUID(),observationId:o.id,title:o.text,field:o.field,due:'heute',status:'open'};
    await saveTask(t); setTasks(v=>[t,...v]); setMessage('Aufgabe lokal gespeichert.');
  }
  async function toggleTask(t:FarmTask){
    const next={...t,status:t.status==='open'?'done':'open'} as FarmTask;
    await saveTask(next); setTasks(v=>v.map(x=>x.id===t.id?next:x));
  }
  async function sendChat(){
    const v=chatInput.trim();if(!v)return;
    setChat(vs=>[...vs,'Du: '+v,'Assistent: wird verarbeitet …']);setChatInput('');
    const a=await localAssistant.ask({message:v,observation:selected??observations[0]});
    setChat(vs=>[...vs.slice(0,-1),'Assistent: '+a]);
  }
  async function startRecording(){
    setRecording(true);try{const blob=await recordShortAudio();await addObservation([{type:'audio',name:'aufnahme.webm',blob}])}
    catch(e){alert(e instanceof Error?e.message:'Audioaufnahme fehlgeschlagen.')}finally{setRecording(false)}
  }
  function exportJson(){
    const safeObservations=observations.map(({media,...o})=>({...o,media:media.map(({type,name})=>({type,name}))}));
    const blob=new Blob([JSON.stringify({farm:demoFarm,fields:demoFields,observations:safeObservations,tasks,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
    const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='klarblattfarm-export.json';a.click();URL.revokeObjectURL(u);
  }

  return <main>
    <header className="top"><div className="brand"><div className="logo">K</div><div><div className="ey">FarmVisite · offline first</div><h1>KlarblattFarm</h1><div className="sub">Beobachten → Kontext → Assistieren → Handeln</div></div></div><div className="offline">● Lokal gespeichert</div></header>
    <nav className="nav">{['Heute','Rundgang','Beobachtungen','Aufgaben','Hof & Felder','Einstellungen'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}</button>)}</nav>
    {message&&<div className="notice">{message}</div>}
    <section className="grid">
      <div>
        {selected?<div className="card detail">
          <div className="head"><div><div className="ey">Beobachtung</div><div className="title">{selected.text}</div><div className="muted">{selected.field} · {new Date(selected.timestamp).toLocaleString('de-DE')}</div></div><button className="btn secondary" onClick={()=>setSelectedId(null)}>← Zur Übersicht</button></div>
          <div className="detail-grid"><div><b>Status</b><div className="tag">{selected.status}</div></div><div><b>Medien</b><div className="muted">{selected.media.length?selected.media.map(m=>m.name).join(', '):'Keine Medien'}</div></div><div><b>Sensoren</b><div className="muted">{selected.sensorReadings.length?selected.sensorReadings.map(s=>s.key+': '+s.value+' '+s.unit).join(' · '):'Noch keine Messwerte'}</div></div><div><b>Wetter</b><div className="muted">{selected.weatherContext?'Kontext vorhanden':'Noch kein Wetterkontext'}</div></div></div>
          <div className="actions"><button className="btn primary" onClick={()=>void createTask(selected)}>→ Aufgabe anlegen</button><button className="btn secondary" onClick={()=>{setObservations(v=>v.map(o=>o.id===selected.id?{...o,status:'reviewed'}:o));void saveObservation({...selected,status:'reviewed'});setMessage('Beobachtung als geprüft markiert.')}}>Als geprüft markieren</button></div>
          <div className="card inner"><div className="title">AI-Befund</div><p className="muted">{selected.aiFindings?.summary??'Noch keine KI-Auswertung. Für eine belastbare Assistenz zuerst Beobachtung, Bild, Sensor- und Wetterkontext sammeln.'}</p></div>
        </div>:<div className="card">
          <div className="head"><div><div className="title">Heute auf dem Hof</div><div className="muted">{demoFarm.name} · {field.name}</div></div><button className="btn primary" onClick={()=>document.getElementById('obText')?.focus()}>＋ Rundgang starten</button></div>
          <div className="stats"><div className="stat"><b>{observations.length}</b><span>Beobachtungen</span></div><div className="stat"><b>{tasks.filter(t=>t.status==='open').length}</b><span>offene Aufgaben</span></div><div className="stat"><b>Offline</b><span>Datenspeicherung</span></div></div>
          <form className="form" onSubmit={e=>{e.preventDefault();void addObservation()}}><input id="obText" value={text} onChange={e=>setText(e.target.value)} placeholder="Was fällt dir auf? z. B. feuchte Stelle, Blattbild …"/><select value={fieldId} onChange={e=>setFieldId(e.target.value)}>{demoFields.map(f=><option key={f.id} value={f.id}>{f.name}{f.crop?' · '+f.crop:''}</option>)}</select><button className="btn primary">Speichern</button></form>
          <div className="media-actions"><button className="btn secondary" onClick={()=>photoRef.current?.click()}>📷 Foto hinzufügen</button><button className="btn secondary" onClick={()=>void startRecording()} disabled={recording}>{recording?'● Aufnahme …':'🎙 Sprache aufnehmen'}</button><input ref={photoRef} hidden type="file" accept="image/*" capture="environment" onChange={e=>{const f=e.target.files?.[0];if(f)void addObservation([{type:'image',name:f.name,blob:f}]);e.currentTarget.value='' }}/></div>
          <ul>{observations.slice(0,8).map(o=><li className="obs" key={o.id}><button className="obs-main" onClick={()=>setSelectedId(o.id)}><div className="dot">👀</div><div><b>{o.text}</b><div className="muted">{o.field} · {new Date(o.timestamp).toLocaleString('de-DE')}</div><span className="tag">{o.media.length?o.media.length+' Medium':'Beobachtung'}</span></div></button><button className="btn ghost" onClick={()=>void createTask(o)}>→ Aufgabe</button></li>)}{!observations.length&&<li className="empty">Noch keine Beobachtung. Starte den Rundgang.</li>}</ul>
        </div>}
        <div className="card"><div className="head"><div><div className="title">Nächste Schritte</div><div className="muted">Aus Beobachtungen werden konkrete Aufgaben.</div></div><button className="btn secondary" onClick={exportJson}>JSON Export</button></div>
          <ul>{tasks.map(t=><li className="obs" key={t.id}><button className="obs-main" onClick={()=>t.observationId&&setSelectedId(t.observationId)}><div className="dot">{t.status==='done'?'✓':'○'}</div><div><b>{t.title}</b><div className="muted">{t.field} · {t.due}</div></div></button><button className="btn ghost" onClick={()=>void toggleTask(t)}>{t.status==='done'?'↩ Offen':'✓ Erledigt'}</button></li>)}{!tasks.length&&<li className="empty">Noch keine Aufgaben.</li>}</ul>
        </div>
      </div>
      <aside className="card chat"><div className="head"><div><div className="title">✦ Hof-Assistent</div><div className="muted">Kontext: Feld + Beobachtung + Verlauf</div></div><select><option>Demo · lokal</option><option>Ollama · lokal</option><option>llama.cpp · lokal</option><option>GWDG · online (Adapter)</option></select></div><div className="chatlog">{chat.map((m,i)=><div className={m.startsWith('Du:')?'msg me':'msg ai'} key={i}>{m}</div>)}</div><form className="chatform" onSubmit={e=>{e.preventDefault();void sendChat()}}><textarea value={chatInput} onChange={e=>setChatInput(e.target.value)} rows={2} placeholder="Frag z. B.: Was sollte ich bei dieser Beobachtung prüfen?"/><button className="btn primary">Senden</button></form></aside>
    </section>
    <p className="foot">Web/PWA und mobile App teilen dieselbe Codebasis. Native Gerätefunktionen werden über Capacitor angebunden.</p>
  </main>
}