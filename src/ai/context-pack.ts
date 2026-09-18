import type {FarmTask,Observation} from '../domain';
import type {Farm,Field} from '../farm';

export type AIContextPack = {
  version:'1';
  farm:{id:string;name:string;location?:string};
  field:{id:string;name:string;crop?:string;areaHa?:number};
  observation:{
    id:string;
    text:string;
    timestamp:string;
    status:Observation['status'];
    media:Array<{type:'image'|'audio';name:string}>;
  };
  sensorReadings:Observation['sensorReadings'];
  weatherContext:Observation['weatherContext'];
  history:Array<{id:string;text:string;timestamp:string;status:Observation['status']}>;
  taskContext:Array<{id:string;title:string;due:string;status:FarmTask['status']}>;
  knowledgeQuery:string;
};

export function buildAIContextPack(input:{
  farm:Farm;
  field:Field;
  observation:Observation;
  history?:Observation[];
  tasks?:FarmTask[];
}):AIContextPack{
  const {farm,field,observation,history=[],tasks=[]}=input;
  return {
    version:'1',
    farm:{id:farm.id,name:farm.name,location:farm.location},
    field:{id:field.id,name:field.name,crop:field.crop,areaHa:field.areaHa},
    observation:{
      id:observation.id,
      text:observation.text,
      timestamp:observation.timestamp,
      status:observation.status,
      media:observation.media.map(({type,name})=>({type,name}))
    },
    sensorReadings:observation.sensorReadings,
    weatherContext:observation.weatherContext,
    history:history
      .filter(o=>o.id!==observation.id&&o.fieldId===field.id)
      .slice(0,10)
      .map(o=>({id:o.id,text:o.text,timestamp:o.timestamp,status:o.status})),
    taskContext:tasks.filter(t=>t.field===field.name).slice(0,10)
      .map(t=>({id:t.id,title:t.title,due:t.due,status:t.status})),
    knowledgeQuery:[field.crop,field.name,observation.text].filter(Boolean).join(' · ')
  };
}

export function contextPackToPrompt(pack:AIContextPack,message:string):string{
  return [
    'Du bist ein vorsichtiger Hof-Assistent.',
    'Nutze nur den bereitgestellten Kontext. Formuliere agronomische Einschätzungen als Hinweise mit Unsicherheit, nicht als definitive Diagnose.',
    'Antworte praktisch und trenne Beobachtung, mögliche Erklärungen, Prüfungen und nächste Schritte.',
    `Nutzerfrage: ${message}`,
    `Kontext: ${JSON.stringify(pack)}`
  ].join('\n');
}
