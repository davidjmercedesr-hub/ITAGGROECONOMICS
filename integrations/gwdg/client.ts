import type {AIContextPack} from '../../src/ai/context-pack';

export type GwdgArcanaConfig={
  apiKey:string;
  arcanaId:string;
  baseUrl?:string;
  model?:string;
};

export type GwdgChatResult={
  text:string;
  raw:unknown;
};

export async function askGwdgArcana(
  config:GwdgArcanaConfig,
  contextPack:AIContextPack,
  message:string
):Promise<GwdgChatResult>{
  const response=await fetch((config.baseUrl??'https://chat-ai.academiccloud.de/v1')+'/chat/completions',{
    method:'POST',
    headers:{
      Accept:'application/json',
      Authorization:'Bearer '+config.apiKey,
      'Content-Type':'application/json',
      'inference-service':'saia-openai-gateway'
    },
    body:JSON.stringify({
      model:config.model??'qwen3-30b-a3b-instruct-2507',
      messages:[
        {
          role:'system',
          content:'Du bist ein vorsichtiger Hof-Assistent. Trenne Beobachtung, mögliche Erklärungen, Prüfungen und nächste Schritte. Stelle agronomische Einschätzungen als Hinweise mit Unsicherheit dar und erfinde keine Quellen.'
        },
        {
          role:'user',
          content:'Nutzerfrage: '+message+'\n\nFarmVisite-Kontext:\n'+JSON.stringify(contextPack)
        }
      ],
      temperature:0,
      top_p:0.05,
      'enable-tools':true,
      arcana:{id:config.arcanaId}
    })
  });
  if(!response.ok) throw new Error('GWDG Arcana request failed: '+response.status);
  const data=await response.json() as {choices?:Array<{message?:{content?:string}}>} & Record<string,unknown>;
  return {text:data.choices?.[0]?.message?.content??'',raw:data};
}
