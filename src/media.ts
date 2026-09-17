export async function recordShortAudio(ms=5000):Promise<Blob>{
  if(typeof MediaRecorder==='undefined'||!navigator.mediaDevices?.getUserMedia)throw new Error('Audioaufnahme wird auf diesem Gerät nicht unterstützt.');
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  return new Promise((resolve,reject)=>{
    const chunks:BlobPart[]=[];
    const r=new MediaRecorder(stream);
    r.ondataavailable=e=>chunks.push(e.data);
    r.onerror=()=>reject(new Error('Aufnahme fehlgeschlagen.'));
    r.onstop=()=>{stream.getTracks().forEach(t=>t.stop());resolve(new Blob(chunks,{type:r.mimeType||'audio/webm'}))};
    r.start();setTimeout(()=>r.stop(),ms);
  });
}